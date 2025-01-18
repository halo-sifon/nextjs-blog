import mongoose, { Model, model } from "mongoose";

// 定义文章模型的接口
export interface ICategory {
  _id?: string; // MongoDB ID
  title: string;
  slug: string; // URL 友好的标识符
}

// 创建 Schema
const CategorySchema = new mongoose.Schema<ICategory>(
  {
    title: {
      type: String,
      required: [true, "标题是必需的"],
      trim: true,
      maxlength: [100, "标题不能超过100个字符"],
      unique: true,
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
    timestamps: true,
  }
);

// 添加索引以提高查询性能
CategorySchema.index({ title: "text", slug: "text" });
CategorySchema.index({ slug: 1 });

// 导出 Category 模型
export const Category: Model<ICategory> =
  mongoose.models.Category || model<ICategory>("Category", CategorySchema);
