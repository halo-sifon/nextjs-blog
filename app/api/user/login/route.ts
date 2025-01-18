import { NextRequest, NextResponse } from "next/server";
import { Admin } from "@/models/Admin";
import { FailResponse, SuccessResponse } from "@/models/Response";
import { HttpStatusCode } from "axios";
import { SignJWT } from "jose";
import { connectDB } from "@/lib/mongodb";
import { Types } from "mongoose";

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

    // 查找用户
    const user = await Admin.findOne({ username });
    if (!user) {
      return NextResponse.json(new FailResponse({ message: "用户不存在" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(new FailResponse({ message: "密码错误" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    // 使用 jose 生成 token
    const token = await new SignJWT({
      id: (user._id as Types.ObjectId).toString(),
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1d")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET || ""));

    // 设置cookie
    const response = NextResponse.json(
      new SuccessResponse({ message: "登录成功", data: { token } })
    );
    response.headers.set(
      "Set-Cookie",
      `admin-token=${token}; HttpOnly; Secure; Max-Age=86400; Path=/`
    );

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(new FailResponse({ message: "登录失败" }), {
      status: HttpStatusCode.InternalServerError,
    });
  }
}
