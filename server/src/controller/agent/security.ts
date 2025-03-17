import { Request, Response, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { AuthenticatedRequest } from "../../lib/types/type";
import Project from "../../model/projectModel";
import Security from "../../model/securityModel";
import CustomError from "../../lib/util/CustomError";
import { SecurityLogPayload } from "../../lib/types/type";
import getTimeRange from "../../lib/util/getTimeRange";
import checkProjectOwnership from "../../lib/util/checkProjectOwnership";
import Notification from "../../model/notiModel"; 
import { sendNotification } from "../../jobs/socket";
import { Server } from "socket.io";

const handleIncomingSecurity = async (
  req: Request,
  res: Response,
  next: NextFunction  
) => {
  const apiKey = req.headers["x-api-key"] as string;
  const passKey = req.headers["x-pass-key"] as string;

  if (!apiKey || !passKey) {
    return next(new CustomError(401, "Unauthorized"));
  }

  const project = await Project.findOne({ apiKey, passKey });
  if (!project) {
    return next(new CustomError(404, "Project not found"));
  }

  if (!req.body) {
    return next(new CustomError(400, "Missing required fields"));
  }

  const security = req.body as SecurityLogPayload;

  // Manage security log storage
  const securityCount = await Security.countDocuments({ project: project._id });
  if (securityCount >= 120) {
    const oldSecurity = await Security.find({ project: project._id })
      .sort({ createdAt: 1 })
      .limit(20);
    const oldIds = oldSecurity.map((sec) => sec._id);
    await Security.deleteMany({ _id: { $in: oldIds } });
  }

  await Security.create({ project: project._id, ...security });

  // Check if notifications are enabled for this project
  if (project.notificationStatus) {
    const notifications = [];

    if (security.isBruteForce) {
      notifications.push({
        message: `Brute force attack detected from ${security.ip}`,
        user: project.user,
        project: project._id,
        type: "brute_force",
        severity: "critical",
        metadata: {
          ip: security.ip,
          userAgent: security.userAgent,
        },
      });
    }

    if (security.isUnusual) {
      notifications.push({
        message: `Unusual login attempt detected: ${security.unusualReason}`,
        user: project.user,
        project: project._id,
        type: "unusual_login",
        severity: "warning",
        metadata: {
          ip: security.ip,
          userAgent: security.userAgent,
        },
      });
    }

    if (notifications.length > 0) {
      const savedNotifications = await Notification.insertMany(notifications);


      const io = req.app.get("io") as Server;
      // Emit notifications to the user via Socket.IO
      savedNotifications.forEach((notification)=>{
        sendNotification(io, project.user.toString(), notification);
      })
    }
  }

  return res.status(200).json({ status: "success" });
};


// controllers
const getTotalLogins = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { timeFilter = "today" } = req.query;
  const timeRange = getTimeRange(timeFilter as string);

  if (!projectId) return next(new CustomError(400, "Project ID is required"));

  const logins = await Security.find({
    project: projectId,
    isSuccess: true,
    ...(timeRange && { createdAt: timeRange }),
  }).sort({ createdAt: -1 });


  const groupedByIP = logins.reduce(
    (acc, login) => {
      acc[login.ip] = (acc[login.ip] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );


  const mostActiveIP = Object.keys(groupedByIP).reduce(
    (a, b) => (groupedByIP[a] > groupedByIP[b] ? a : b),
    ""
  );

  res.status(200).json({
    status: "success",
    count: logins.length,
    logins,
    summary: {
      totalAttempts: logins.length,
      mostActiveIP,
      groupedByIP,
      frequentUserAgents: [...new Set(logins.map((login) => login.userAgent))],
    },
  });
};

const getFailedLogins = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { timeFilter = "today" } = req.query;
  const timeRange = getTimeRange(timeFilter as string);

  if (!projectId) return next(new CustomError(400, "Project ID is required"));

  const logins = await Security.find({
    project: projectId,
    isSuccess: false,
    ...(timeRange && { createdAt: timeRange }),
  }).sort({ createdAt: -1 });

  const groupedByIP = logins.reduce(
    (acc, login) => {
      acc[login.ip] = (acc[login.ip] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostAttackedIP = Object.keys(groupedByIP).reduce(
    (a, b) => (groupedByIP[a] > groupedByIP[b] ? a : b),
    ""
  );

  res.status(200).json({
    status: "success",
    count: logins.length,
    logins,
    summary: {
      totalAttempts: logins.length,
      mostAttackedIP,
      groupedByIP,
      frequentUserAgents: [...new Set(logins.map((login) => login.userAgent))],
    },
  });
};


const getSecurityStats = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { timeFilter = "today" } = req.query;
  const timeRange = getTimeRange(timeFilter as string);

  if (!projectId) return next(new CustomError(400, "Project ID is required"));


  const stats = await Security.aggregate([
    { $match: { project: new ObjectId(projectId), ...(timeRange && { createdAt: timeRange }) } },
    {
      $group: {
        _id: null,
        totalLogins: { $sum: 1 },
        successLogins: { $sum: { $cond: ["$isSuccess", 1, 0] } },
        failedLogins: { $sum: { $cond: ["$isSuccess", 0, 1] } },
        totalUnusual: { $sum: { $cond: ["$isUnusual", 1, 0] } },
        unusualHighFreq: {
          $sum: {
            $cond: [
              {
                $eq: [
                  "$unusualReason",
                  "Unusually high number of logins within 24 hours",
                ],
              },
              1,
              0,
            ],
          },
        },
        unusualConsecSuccess: {
          $sum: {
            $cond: [
              {
                $eq: [
                  "$unusualReason",
                  "Rapid consecutive login failures followed by success",
                ],
              },
              1,
              0,
            ],
          },
        },
        bruteForce: { $sum: { $cond: ["$isBruteForce", 1, 0] } },
      },
    },
  ]);

  const result = stats[0] || {
    totalLogins: 0,
    successLogins: 0,
    failedLogins: 0,
    totalUnusual: 0,
    unusualHighFreq: 0,
    unusualConsecSuccess: 0,
    bruteForce: 0,
  };

  res.status(200).json({ status: "success", stats: result });
};


const getBruteForceAttempts = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { timeFilter = "today" } = req.query;
  const timeRange = getTimeRange(timeFilter as string);

  const logins = await Security.find({
    project: projectId,
    isBruteForce: true,
    ...(timeRange && { createdAt: timeRange }),
  }).sort({ createdAt: -1 });

  const groupedByIP = logins.reduce(
    (acc, login) => {
      acc[login.ip] = (acc[login.ip] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const mostAttackedIP = Object.keys(groupedByIP).reduce(
    (a, b) => (groupedByIP[a] > groupedByIP[b] ? a : b),
    ""
  );

  res.status(200).json({
    status: "success",
    count: logins.length,
    logins,
    summary: {
      totalAttempts: logins.length,
      mostAttackedIP,
      groupedByIP,
      frequentUserAgents: [...new Set(logins.map((login) => login.userAgent))],
    },
  });
};

const getUnusualLogins = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  if (!(await checkProjectOwnership(req, next))) return;

  const { projectId } = req.params;
  const { timeFilter = "today" } = req.query;
  const timeRange = getTimeRange(timeFilter as string);

  const logins = await Security.find({
    project: projectId,
    isUnusual: true,
    ...(timeRange && { createdAt: timeRange }),
  }).sort({ createdAt: -1 });

  const reasonsCount = logins.reduce(
    (acc, login) => {
      const reason = login.unusualReason || "Unknown";
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  res.status(200).json({
    status: "success",
    count: logins.length,
    logins,
    summary: {
      totalUnusualLogins: logins.length,
      reasonsCount,
      frequentUserAgents: [...new Set(logins.map((login) => login.userAgent))],
    },
  });
};

export {
  handleIncomingSecurity,
  getTotalLogins,
  getFailedLogins,
  getSecurityStats,
  getBruteForceAttempts,
  getUnusualLogins,
};
