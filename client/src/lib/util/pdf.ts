import {
  PerformanceMetrics,
  ServerMetrics,
  StabilityMetrics,
  Log,
  SystemMetrics,
  TrafficMetrics,
} from "@/lib/interface";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SecurityStats = {
  totalLogins: number;
  successLogins: number;
  failedLogins: number;
  totalUnusual: number;
  unusualHighFreq: number;
  unusualConsecSuccess: number;
  bruteForce: number;
};

type LogEntry = {
  _id: string;
  ip: string;
  statusCode: number;
  isSuccess: boolean;
  userAgent: string;
  duration: number;
  isBruteForce: boolean;
  isUnusual: boolean;
  unusualReason: string | null;
  createdAt: string;
};

export const generateHealthMetricsPDF = (
  project: string,
  performanceData: PerformanceMetrics,
  serverMetrics: ServerMetrics,
  systemMetrics: SystemMetrics,
  trafficMetrics: TrafficMetrics,
  stabilityMetrics: StabilityMetrics
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "normal");

  doc.setTextColor(22, 196, 127);

  doc.setFontSize(12);
  doc.text(
    `Health and Perfomance Metrics Report for Project: ${project}`,
    10,
    10
  );
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);

  const safeValue = (value: number | string | null | undefined) =>
    value !== undefined && value !== null ? value : 0;

  doc.setFontSize(10);
  doc.text("Performance Metrics", 10, 26);

  autoTable(doc, {
    startY: 30,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Metric", "Value"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      ["Uptime Percentage", `${safeValue(performanceData.uptimePercentage)}%`],
      ["Latency", `${safeValue(performanceData.latency)} ms`],
      ["Response Time", `${safeValue(performanceData.responseTime)} ms`],
      ["Total Requests", safeValue(performanceData.requests)],
      ["Failed Requests", safeValue(performanceData.failedReq)],
      ["Success Rate", `${safeValue(performanceData.success)}%`],
      ["Error Rate", `${safeValue(performanceData.errorrate)}%`],
    ],
  });

  doc.text("Server Metrics", 10, 110);
  autoTable(doc, {
    startY: 114,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Metric", "Value"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      ["Total Requests", safeValue(serverMetrics.totalRequests)],
      ["Latest Status", safeValue(serverMetrics.latestStatus)],
      ["Avg Response Time", `${safeValue(serverMetrics.avgResponseTime)} ms`],
      ["Avg Latency", `${safeValue(serverMetrics.avgLatency)} ms`],
      ["Avg Uptime", `${safeValue(serverMetrics.avgUptimePercentage)}%`],
      ["Current Uptime", `${safeValue(serverMetrics.currentUptime)}%`],
    ],
  });

  doc.text("System Metrics", 10, 190);
  autoTable(doc, {
    startY: 194,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Resource", "Avg Usage", "Max Usage", "Latest Usage", "Health"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      [
        "CPU",
        `${safeValue(systemMetrics.avgCpuUsage)}%`,
        `${safeValue(systemMetrics.maxCpuUsage)}%`,
        `${safeValue(systemMetrics.latestCpuUsage)}%`,
        safeValue(systemMetrics.healthStatus.cpu),
      ],
      [
        "Memory",
        `${safeValue(systemMetrics.avgMemoryUsage)}%`,
        `${safeValue(systemMetrics.maxMemoryUsage)}%`,
        `${safeValue(systemMetrics.latestMemoryUsage)}%`,
        safeValue(systemMetrics.healthStatus.memory),
      ],
      [
        "Disk",
        `${safeValue(systemMetrics.avgDiskUsage)}%`,
        `${safeValue(systemMetrics.maxDiskUsage)}%`,
        `${safeValue(systemMetrics.latestDiskUsage)}%`,
        safeValue(systemMetrics.healthStatus.disk),
      ],
    ],
  });

  doc.text("Traffic Metrics", 10, doc.internal.pageSize.height - 70);
  autoTable(doc, {
    startY: doc.internal.pageSize.height - 66,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Metric", "Value"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      ["Total Requests", safeValue(trafficMetrics.metrics.totalRequests)],
      ["Total Success", safeValue(trafficMetrics.metrics.totalSuccess)],
      ["Total Failed", safeValue(trafficMetrics.metrics.totalFailed)],
      [
        "Requests per Second (Avg)",
        safeValue(trafficMetrics.metrics.requestsPerSecond.average),
      ],
      [
        "Requests per Second (Peak)",
        safeValue(trafficMetrics.metrics.requestsPerSecond.peak),
      ],
      ["Success Rate", `${safeValue(trafficMetrics.metrics.successRate)}%`],
      ["Error Rate", `${safeValue(trafficMetrics.metrics.errorRate)}%`],
      ["Traffic Health", safeValue(trafficMetrics.metrics.trafficHealth)],
    ],
  });

  if (doc.internal.getNumberOfPages() < 2) {
    doc.addPage();

    doc.setTextColor(22, 196, 127);
  }
  doc.text("Stability Metrics", 10, 20);
  autoTable(doc, {
    startY: 24,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Metric", "Value"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      ["Failed Requests", safeValue(stabilityMetrics.failedRequests)],
      ["Success Requests", safeValue(stabilityMetrics.successRequests)],
      ["Error Rate", `${safeValue(stabilityMetrics.errorRate)}%`],
    ],
  });

  doc.save(`${project}_perfomance_report.pdf`);
};

export const generateSecurityPDF = (
  project: string,
  stats: SecurityStats,
  currentLogins: LogEntry[]
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(22, 196, 127);

  doc.setFontSize(12);
  doc.text(`Security Metrics Report for Project: ${project}`, 10, 10);
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);

  const safeValue = (value: number | string | null | undefined) =>
    value !== undefined && value !== null ? value : 0;

  doc.setFontSize(10);
  doc.text("Security Stats", 10, 26);

  autoTable(doc, {
    startY: 30,
    theme: "plain",
    styles: { fontSize: 8, cellPadding: 2 },
    head: [["Metric", "Value"]],
    headStyles: { fillColor: [22, 196, 127] },
    body: [
      ["Total Logins", safeValue(stats.totalLogins)],
      ["Successful Logins", safeValue(stats.successLogins)],
      ["Failed Logins", safeValue(stats.failedLogins)],
      ["Total Unusual Activities", safeValue(stats.totalUnusual)],
      ["Unusual High Frequency", safeValue(stats.unusualHighFreq)],
      ["Unusual Consecutive Success", safeValue(stats.unusualConsecSuccess)],
      ["Brute Force Attempts", safeValue(stats.bruteForce)],
    ],
  });

  const startYForLogs =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 10;
  doc.text("Current Login Attempts", 10, startYForLogs);

  const logRows = currentLogins.map((log) => [
    log._id,
    log.ip,
    log.statusCode,
    log.isSuccess ? "Success" : "Failed",
    log.userAgent,
    `${log.duration} ms`,
    log.isBruteForce ? "Yes" : "No",
    log.isUnusual ? "Yes" : "No",
    log.unusualReason ? log.unusualReason : "-",
    new Date(log.createdAt).toLocaleString(),
  ]);

  autoTable(doc, {
    startY: startYForLogs + 4,
    theme: "striped",
    styles: { fontSize: 7, cellPadding: 2 },
    head: [
      [
        "ID",
        "IP",
        "Status Code",
        "Status",
        "User Agent",
        "Duration",
        "Brute Force",
        "Unusual",
        "Unusual Reason",
        "Timestamp",
      ],
    ],
    headStyles: { fillColor: [22, 196, 127] },
    body: logRows,
  });

  doc.save(`${project}_security_report.pdf`);
};

export const generateLogsPDF = (project: string, logs: Log[]) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  doc.setFont("helvetica", "normal");
  doc.setTextColor(22, 196, 127);

  doc.setFontSize(12);
  doc.text(`Logs Report for Project: ${project}`, 10, 10);
  doc.setFontSize(8);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 16);

  const safeValue = (value: number | string | null | undefined) =>
    value !== undefined && value !== null ? value : "-";

  const rows = logs.map((log) => [
    safeValue(log._id),
    safeValue(log.message),
    safeValue(log.level),
    safeValue(log.statusCode.toString()),
    safeValue(log.method),
    `${safeValue(log.duration)} ms`,
    safeValue(log.route),
    safeValue(log.project),
    safeValue(log.__v.toString()),
  ]);

  const columns = [
    "ID",
    "Message",
    "Level",
    "Status Code",
    "Method",
    "Duration",
    "Route",
    "Project",
    "Version",
  ];

  autoTable(doc, {
    startY: 20,
    theme: "striped",
    head: [columns],
    headStyles: { fillColor: [22, 196, 127] },
    body: rows,
    styles: { fontSize: 7, cellPadding: 2 },
  });

  doc.save(`${project}_logs_report.pdf`);
};
