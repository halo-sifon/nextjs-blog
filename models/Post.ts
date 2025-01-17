import mongoose, { Model, model } from "mongoose";

// 定义文章模型的接口
export interface IPost {
  _id?: string; // MongoDB ID
  title: string; // 标题
  content: string; // 内容
  category: string; // 分类
  summary?: string; // 摘要
  tags?: string[]; // 标签
  publishDate: Date; // 发布时间
  updateDate: Date; // 更新时间
  status: "draft" | "published"; // 状态：草稿或已发布
  viewCount: number; // 浏览次数
  author: string; // 作者
  slug: string; // URL 友好的标识符
}

// 创建 Schema
const PostSchema = new mongoose.Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, "标题是必需的"],
      trim: true,
      maxlength: [100, "标题不能超过100个字符"],
    },
    content: {
      type: String,
      required: [true, "内容是必需的"],
    },
    category: {
      type: String,
      required: [true, "分类是必需的"],
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: [200, "摘要不能超过200个字符"],
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    publishDate: {
      type: Date,
      default: Date.now,
    },
    updateDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    author: {
      type: String,
      required: [true, "作者是必需的"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug是必需的"],
      trim: true,
      lowercase: true,
      index: { unique: true },
    },
  },
  {
    timestamps: true, // 自动管理 createdAt 和 updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 添加索引以提高查询性能
PostSchema.index({ title: "text", content: "text" });
PostSchema.index({ category: 1 });
PostSchema.index({ publishDate: -1 });

// 导出 Post 模型
export const Post: Model<IPost> =
  mongoose.models.Post || model<IPost>("Post", PostSchema);
