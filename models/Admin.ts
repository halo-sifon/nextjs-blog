import mongoose, { Document, model, Model } from "mongoose";
import bcrypt from "bcryptjs";

// 定义管理员模型的接口
export interface IAdmin {
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// 定义管理员模型实例的类型
export interface IAdminDocument extends IAdmin, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// 定义管理员模型的 Schema
const adminSchema = new mongoose.Schema<IAdminDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// 在保存之前对密码进行加密
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 添加验证密码的方法
adminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 导出 Admin 模型
export const Admin: Model<IAdminDocument> =
  mongoose.models.Admin || model<IAdminDocument>("Admin", adminSchema);
