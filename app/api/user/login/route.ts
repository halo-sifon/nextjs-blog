import { NextRequest, NextResponse } from "next/server";
import { Admin } from "@/models/admin";
import { FailResponse, SuccessResponse } from "~/models/Response";
import { HttpStatusCode } from "axios";
import jwt from "jsonwebtoken";
import { connectDB } from "~/libs/mongodb";

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

    // 生成 使用jwt的token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1d",
    });

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
