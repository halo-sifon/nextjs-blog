"use client";

import { Edit, Eye, Plus, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import axiosInstance from "@/lib/request";
import { IPost } from "@/models/Post";
import { PaginationResponse } from "@/types/api";

export default function AdminPosts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const router = useRouter();

  // 获取文章列表
  const fetchPosts = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get<PaginationResponse<IPost>>(
        "/posts",
        {
          params: { page, limit: 10 },
        }
      );

      setPosts(data?.list || []);
      setPageInfo({
        currentPage: data?.currentPage || 1,
        totalPages: data?.totalPages || 1,
        total: data?.total || 0,
      });
    } catch {
      toast.error("获取文章列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 删除文章
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("删除成功");
      fetchPosts(); // 重新获取列表
    } catch {
      toast.error("删除失败");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">文章管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {pageInfo.total} 篇文章
          </p>
        </div>
        <Button onClick={() => router.push("/admin/posts/edit")}>
          <Plus className="w-4 h-4 mr-2" />
          新建文章
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无文章，点击右上角按钮创建新文章
        </div>
      ) : (
        <>
          <div className="relative w-full overflow-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">标题</TableHead>
                    <TableHead className="w-[100px]">分类</TableHead>
                    <TableHead className="w-[120px]">标签</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">发布时间</TableHead>
                    <TableHead className="w-[100px]">更新时间</TableHead>
                    <TableHead className="w-[60px]">浏览</TableHead>
                    <TableHead className="w-[120px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map(post => (
                    <TableRow key={post._id}>
                      <TableCell className="font-medium">
                        <div
                          className="truncate max-w-[280px]"
                          title={post.title}
                        >
                          {post.title}
                        </div>
                        {post.summary && (
                          <div
                            className="text-sm text-muted-foreground truncate"
                            title={post.summary}
                          >
                            {post.summary}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{post.category}</TableCell>
                      <TableCell>
                        {post.tags && post.tags.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span className="text-sm">
                              {post.tags.join(", ")}
                            </span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            post.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.status === "published" ? "已发布" : "草稿"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {new Date(post.publishDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(post.updateDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{post.viewCount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" asChild>
                          <Link
                            href={`/posts/${post.category}/${post.title}`}
                            target="_blank"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            router.push(`/admin/posts/edit/${post._id!}`)
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <ConfirmDeleteDialog
                          title="确认删除"
                          description={`确定要删除文章 "${post.title}" 吗？此操作不可恢复。`}
                          onConfirm={() => handleDelete(post._id!)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {pageInfo.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={() => fetchPosts(pageInfo.currentPage - 1)}
                      isActive={pageInfo.currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageInfo.totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={() => fetchPosts(i + 1)}
                        isActive={pageInfo.currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => fetchPosts(pageInfo.currentPage + 1)}
                      isActive={pageInfo.currentPage < pageInfo.totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
