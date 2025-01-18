"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Loading } from "~/components/ui/loading";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import axiosInstance from "~/lib/request";
import { ICategory } from "~/models/Category";
import { PaginationResponse } from "~/types/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });
  const router = useRouter();

  // 获取分类列表
  const fetchCategories = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get<PaginationResponse<ICategory>>(
        "/categories",
        {
          params: { page, limit: 10 },
        }
      );

      setCategories(data?.list || []);
      setPageInfo({
        currentPage: data?.currentPage || 1,
        totalPages: data?.totalPages || 1,
        total: data?.total || 0,
      });
    } catch {
      toast.error("获取分类列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 删除分类
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/categories`, {
        params: { id },
      });

      toast.success("删除成功");
      fetchCategories(); // 重新获取列表
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
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
          <h1 className="text-2xl font-bold">分类管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {pageInfo.total} 个分类
          </p>
        </div>
        <Button onClick={() => router.push("/admin/categories/edit")}>
          <Plus className="w-4 h-4 mr-2" />
          新建分类
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          暂无分类，点击右上角按钮创建新分类
        </div>
      ) : (
        <>
          <div className="relative w-full overflow-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">标题</TableHead>
                    <TableHead className="w-[100px]">Slug</TableHead>
                    <TableHead className="w-[120px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map(category => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">
                        <div
                          className="truncate max-w-[280px]"
                          title={category.title}
                        >
                          {category.title}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>

                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            router.push(
                              `/admin/categories/edit/${category._id!}`
                            )
                          }
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>确认删除</AlertDialogTitle>
                              <AlertDialogDescription>
                                确定要删除分类 &ldquo;{category.title}&rdquo; 吗？如果该分类下还有文章，将无法删除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category._id!)}
                              >
                                确认删除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      onClick={() => fetchCategories(pageInfo.currentPage - 1)}
                      isActive={pageInfo.currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageInfo.totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={() => fetchCategories(i + 1)}
                        isActive={pageInfo.currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => fetchCategories(pageInfo.currentPage + 1)}
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
