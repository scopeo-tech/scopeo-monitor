import mongoose, { Schema, InferSchemaType, Model } from "mongoose";

const diskSchema = new Schema({
  drive: { type: String, required: true },
  total: { type: Number, required: true },
  used: { type: Number, required: true },
  free: { type: Number, required: true },
  usagePercent: { type: Number, required: true },
  filesystem: { type: String, required: false }
}, { _id: false });

const performanceSchema = new Schema(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    uptimePercentage: { type: Number, required: true },
    latency: { type: Number, required: true },
    responseTime: { type: Number, required: true },
    requests: {
      totalRequests: { type: Number, required: true },
      httpStatusCounts: {
        type: Map,
        of: Number,
        default: {
          200: 0,
          400: 0,
          500: 0
        }
      },
      averagePerSecond: { type: Number, required: true },
      peakPerSecond: { type: Number, required: true },
      failed: { type: Number, required: true },
      success: { type: Number, required: true },
      errorRate: { type: Number, required: true },
    },
    systemUsage: {
      cpuUsage: { type: [Number], required: true },
      memoryUsage: {
        total: { type: Number, required: true },
        used: { type: Number, required: true },
        free: { type: Number, required: true },
        usagePercent: { type: Number, required: true },
      },
      diskUsage: {
        total: { type: Number, required: true },
        used: { type: Number, required: true },
        free: { type: Number, required: true },
        usagePercent: { type: Number, required: true },
        disks: { type: [diskSchema], default: [] }
      },
      loadAverage: { type: [Number], required: true },
    },
  },
  {
    timestamps: true,
  }
);

type IPerformance = InferSchemaType<typeof performanceSchema>;

const Performance: Model<IPerformance> = mongoose.model(
  "Performance",
  performanceSchema
);
export default Performance;