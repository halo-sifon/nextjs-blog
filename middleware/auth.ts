import { verifyToken } from "~/lib/jwt";
import { cookies } from "next/headers";

export async function validateToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token")?.value;

    // 如果token不存在，返回未登录
    if (!token) {
      return {
        data: {
          message: "未登录",
        },
        status: 401,
      };
    }

    // 验证token
    const decoded = await verifyToken(token);
    if (!decoded) {
      return {
        data: {
          message: "token无效",
        },
        status: 401,
      };
    }

    // 返回用户id
    return {
      data: {
        id: decoded.id,
      },
      status: 200,
    };
  } catch (error) {
    console.error("Token验证失败:", error);
    return {
      data: {
        message: "认证失败",
      },
      status: 401,
    };
  }
}

// 用于需要管理员权限的接口
// export async function validateAdmin() {
//   const result = await validateToken();

//   if (result.data.message) {
//     return result;
//   }

//   // 检查用户是否是管理员
//   if (result.data.id !== "admin") {
//     return {
//       data: {
//         message: "需要管理员权限",
//       },
//       status: 403,
//     };
//   }

//   return result;
// }
