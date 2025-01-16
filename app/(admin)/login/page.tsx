"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "~/libs/request";
import { Button, Input } from "~/components/ui";
import { ResponseProps } from "~/models/Response";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        "/user/login",
        {
          username,
          password,
        },
        {
          skipErrorHandle: true,
        }
      );
      document.cookie = `admin-token=${response.data.token}; path=/`;
      router.push("/admin");
    } catch (err) {
      const error = err as ResponseProps;
      setError(error.message || "登录失败，请检查用户名和密码");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          登录
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            用户名
          </label>
          <Input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            placeholder="请输入用户名"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-700">
            密码
          </label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            placeholder="请输入密码"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          登录
        </Button>
      </form>
    </div>
  );
}
