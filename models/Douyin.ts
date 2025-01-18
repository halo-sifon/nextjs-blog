import mongoose, { Document, Schema } from "mongoose";

/**
 * 抖音内容的类型
 */
export type DouyinType = "video" | "images";

/**
 * 抖音内容的接口定义
 */
export interface IDouyin extends Document {
  _id: string; // MongoDB ID
  // 作者昵称
  name: string;
  // 内容标题/描述
  title: string;
  // 视频地址（如果是视频类型）
  video?: string;
  // 封面图片地址
  cover: string;
  // 抖音视频ID
  awemeId: string;
  // 图片列表（如果是图片类型）
  images: string[];
  // 内容类型：视频或图片
  type: DouyinType;
  // 下载次数
  downloads: number;

  // 创建时间
  createdAt: Date;
  // 更新时间
  updatedAt: Date;
}

const DouyinSchema = new Schema<IDouyin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      type: String,
      required: false,
    },
    cover: {
      type: String,
      required: true,
    },
    awemeId: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      required: true,
      enum: ["video", "images"],
    },
    downloads: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // 自动管理 createdAt 和 updatedAt 字段
  }
);

// 防止重复定义 model
export const Douyin =
  mongoose.models.Douyin || mongoose.model<IDouyin>("Douyin", DouyinSchema);
