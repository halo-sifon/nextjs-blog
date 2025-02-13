"use client";

import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css";
import MarkdownIt from "markdown-it";
import highlightjs from "markdown-it-highlightjs";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Loading } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axiosInstance from "@/lib/request";
import { IPost } from "@/models/Post";
import { ICategory } from "@/models/Category";

// 初始化 markdown-it
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
}).use(highlightjs);

interface PageProps {
  params: Promise<{ id?: string[] }>;
}

export default function EditPost({ params }: PageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [post, setPost] = useState<IPost>({
    title: "",
    content: "",
    category: "",
    summary: "",
    tags: [],
    status: "draft",
    author: "",
    publishDate: new Date(),
    updateDate: new Date(),
    viewCount: 0,
  });

  const resolvedParams = use(params);
  const postId = resolvedParams.id?.[0]; // 获取可选的文章 ID

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get<ICategory[]>(
          "/categories/list"
        );
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("获取分类列表失败");
      }
    };

    fetchCategories();
  }, []);

  // 更新预览
  useEffect(() => {
    try {
      if (typeof post.content === "string") {
        const rendered = md.render(post.content || "");
        setPreview(rendered);
      } else {
        setPreview("");
      }
    } catch (error) {
      console.error("Markdown rendering error:", error);
      setPreview("预览出错，请检查 Markdown 语法");
    }
  }, [post.content]);

  // 获取文章详情
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axiosInstance.get<IPost>(`/posts/${postId}`);

        if (data) {
          setPost(data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [postId]);

  // 保存文章
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { data } = await axiosInstance({
        url: "/posts",
        method: postId ? "PUT" : "POST",
        data: postId ? { ...post, id: postId } : post,
      });

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success(postId ? "更新成功" : "创建成功");
      router.push("/admin/posts");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || (postId ? "更新失败" : "创建失败")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 space-y-4 max-w-4xl mx-auto overflow-y-scroll"
    >
      <h1 className="text-2xl font-bold mb-6">
        {postId ? "编辑文章" : "新建文章"}
      </h1>

      <div className="space-y-2">
        <Label htmlFor="title">标题</Label>
        <Input
          id="title"
          value={post.title}
          onChange={e => setPost({ ...post, title: e.target.value })}
          required
          placeholder="请输入文章标题"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">分类</Label>
        <Select
          value={post.category as string}
          onValueChange={value => setPost({ ...post, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="请选择文章分类" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem
                key={category._id}
                value={category._id?.toString() || ""}
              >
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">摘要</Label>
        <Textarea
          id="summary"
          value={post.summary}
          onChange={e => setPost({ ...post, summary: e.target.value })}
          rows={3}
          placeholder="请输入文章摘要（选填）"
        />
      </div>

      <div className="space-y-2">
        <Label>内容</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-medium text-sm">编辑</div>
            <Textarea
              id="content"
              value={post.content}
              onChange={e => setPost({ ...post, content: e.target.value })}
              rows={20}
              required
              placeholder="请输入文章内容（支持 Markdown 格式）"
              className="font-mono h-[600px]"
            />
          </div>
          <div className="space-y-2">
            <div className="font-medium text-sm">预览</div>
            <div
              className="markdown-body h-[600px] p-4 border rounded-md overflow-auto bg-white"
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">状态</Label>
        <Select
          value={post.status}
          onValueChange={(value: "draft" | "published") =>
            setPost({ ...post, status: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">草稿</SelectItem>
            <SelectItem value="published">发布</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">标签（用逗号分隔）</Label>
        <Input
          id="tags"
          value={post.tags?.join(",")}
          onChange={e =>
            setPost({
              ...post,
              tags: e.target.value.split(",").map(t => t.trim()),
            })
          }
          placeholder="请输入标签，多个标签用英文逗号分隔（选填）"
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/posts")}
        >
          取消
        </Button>
        {post.category && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open(
                `/posts/${(post.category as ICategory).slug}/${post.title}`,
                "_blank"
              )
            }
          >
            预览
          </Button>
        )}
        <Button type="submit" disabled={saving}>
          {saving ? "保存中..." : "保存"}
        </Button>
      </div>
    </form>
  );
}
