import { NextResponse } from "next/server";
import { SuccessResponse } from "~/models/Response";

export async function POST() {
  // 创建响应对象
  const response = NextResponse.json(
    new SuccessResponse({ message: "退出成功" })
  );

  // 通过设置过期时间为过去的时间来删除cookie
  response.headers.set(
    "Set-Cookie",
    `admin-token=; HttpOnly; Secure; Max-Age=0; Path=/`
  );

  return response;
}
