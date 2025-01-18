"use client";

import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/request";
import { ICategory } from "@/models/Category";

interface PageProps {
  params: Promise<{ id?: string[] }>;
}

export default function EditCategory({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [category, setCategory] = useState<ICategory>({
    title: "",
    slug: "",
  });

  const resolvedParams = use(params);

  const categoryId = resolvedParams.id?.[0]; // 获取可选的文章 ID

  // 获取文章详情
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await axiosInstance.get<ICategory>(
          `/categories/${categoryId}`
        );

        console.log(data);

        if (data) {
          setCategory(data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    } else {
      setLoading(false);
    }
  }, [categoryId]);

  // 保存文章
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await axiosInstance({
        url: "/categories",
        method: categoryId ? "PUT" : "POST",
        data: categoryId ? { ...category, id: categoryId } : category,
      });

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(categoryId ? "更新成功" : "创建成功");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || (categoryId ? "更新失败" : "创建失败")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {categoryId ? "编辑分类" : "新建分类"}
      </h1>

      <div className="space-y-2">
        <Label htmlFor="title">标题</Label>
        <Input
          id="title"
          value={category.title}
          onChange={e => setCategory({ ...category, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          value={category.slug}
          onChange={e => setCategory({ ...category, slug: e.target.value })}
          required
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
        >
          取消
        </Button>

        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}
