import { Admin } from "~/models/Admin";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "~/lib/mongodb";
import { FailResponse, SuccessResponse } from "~/models/Response";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json(
        new FailResponse({ message: "用户名或密码不能为空" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }
    await connectDB();
    // 检查用户名是否已存在
    const existingUser = await Admin.findOne({ username });

    if (existingUser) {
      return NextResponse.json(new FailResponse({ message: "用户名已存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // 创建新用户
    const newUser = new Admin({ username, password });
    await newUser.save();

    // 返回成功响应
    return NextResponse.json(new SuccessResponse({ message: "注册成功" }));
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
