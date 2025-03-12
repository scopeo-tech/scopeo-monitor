export interface User {
    _id: string;
    username: string;
    email: string;
  }

export interface userDetails {
    _id: string;
    username: string;
    email: string;
    joinedDate: string;
    googleId?: string;
  }

export interface Project {
    _id: string;
    name: string;
    apiKey: string;
    passKey: string;
    notificationStatus: boolean;
    created: Date;
    status: { connectionStatus: boolean; updatedAt: Date };
  }


export interface ErrorLog {
  statusCode: number;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  route: string;
  message: string;
  createdAt: string;
  _id?: string;
  projectId?: string;
  __v?: number;
}

export interface Log {
  _id: string;
  message: string;
  level: string;
  statusCode: number;
  method: string;
  duration: number;
  route: string;
  project: string;
  __v: number;
}


export interface PerformanceMetrics {
  _id: string;
  projectId: string;
  uptimePercentage: number;
  latency: number;
  responseTime: number;
  createdAt: string;
  requests: number;
  averagePerSecond: number;
  failedReq: number;
  success: number;
  errorrate: number;
  cpuUsage: number | null;
  memoryUsage: number | null;
  diskUsage: number | null;
};

export interface ServerMetrics {
  projectId: string;
  totalRequests: number;
  httpStatusCounts: Record<string, number>;
  latestStatus: "up" | "down";
  avgResponseTime: number;
  avgLatency: number;
  avgUptimePercentage: number;
  currentUptime: number;
}

interface DiskDetail {
  drive: string;
  total: number;
  used: number;
  free: number;
  usagePercent: number;
}

interface HealthStatus {
  cpu: "healthy" | "warning" | "critical";
  memory: "healthy" | "warning" | "critical";
  disk: "healthy" | "warning" | "critical";
}

interface Recommendation {
  resource: string;
  message: string;
}

export interface SystemMetrics {
  projectId: string;
  avgCpuUsage: number;
  maxCpuUsage: number;
  avgMemoryUsage: number;
  maxMemoryUsage: number;
  avgDiskUsage: number;
  maxDiskUsage: number;
  latestCpuUsage: number;
  latestMemoryUsage: number;
  latestDiskUsage: number;
  diskDetails: DiskDetail[];
  timestamp: string;
  healthStatus: HealthStatus;
  recommendations: Recommendation[];
  overallHealth: "healthy" | "warning" | "critical";
}


interface RequestsPerSecond {
  average: number;
  peak: number;
}

interface Metrics {
  totalRequests: number;
  totalSuccess: number;
  totalFailed: number;
  requestsPerSecond: RequestsPerSecond;
  requestsPerMinute: number;
  successRate: number;
  errorRate: number;
  trafficHealth: "healthy" | "degraded" | "critical";
}

interface StatusCodes {
  informational: Record<string, number>;
  success: Record<string, number>;
  redirection: Record<string, number>;
  clientError: Record<string, number>;
  serverError: Record<string, number>;
}

export interface TrafficMetrics {
  projectId: string;
  metrics: Metrics;
  statusCodes: StatusCodes;
  insights: string[];
}


export interface StabilityMetrics {
  projectId: string;
  failedRequests: number;
  successRequests: number;
  errorRate: number;
}
