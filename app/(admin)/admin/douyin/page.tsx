"use client";

import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
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
import axiosInstance from "@/lib/request";
import { showToast } from "@/lib/utils";
import { IDouyin } from "@/models/Douyin";
import { PaginationResponse } from "@/types/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminDouyin() {
  const [douyins, setDouyins] = useState<IDouyin[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  // 获取抖音视频列表
  const fetchDouyins = async (page = 1) => {
    try {
      const { data } = await axiosInstance.get<PaginationResponse<IDouyin>>(
        "/douyin",
        {
          params: { page, limit: 10 },
        }
      );

      setDouyins(data?.list || []);
      setPageInfo({
        currentPage: data?.currentPage || 1,
        totalPages: data?.totalPages || 1,
        total: data?.total || 0,
      });
    } catch {
      toast.error("获取抖音视频列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 删除分类
  const handleDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/douyin`, {
        params: { id },
      });

      toast.success("删除成功");
      fetchDouyins(); // 重新获取列表
    } catch {}
  };

  useEffect(() => {
    fetchDouyins();
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
          <h1 className="text-2xl font-bold">抖音视频管理</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {pageInfo.total} 个抖音视频
          </p>
        </div>
      </div>

      {douyins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">暂无抖音视频</div>
      ) : (
        <>
          <div className="relative w-full overflow-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">标题</TableHead>
                    <TableHead className="w-[200px]">博主</TableHead>
                    <TableHead className="w-[100px]">下载次数</TableHead>
                    <TableHead className="w-[100px]">下载时间</TableHead>
                    <TableHead className="w-[100px]">视频链接</TableHead>
                    <TableHead className="w-[120px] text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {douyins.map(douyin => (
                    <TableRow key={douyin._id}>
                      <TableCell className="font-medium">
                        <div
                          className="truncate max-w-[280px]"
                          title={douyin.title}
                        >
                          {douyin.title}
                        </div>
                      </TableCell>

                      <TableCell className="font-medium">
                        <div
                          className="truncate max-w-[280px]"
                          title={douyin.name}
                        >
                          {douyin.name}
                        </div>
                      </TableCell>

                      <TableCell>{douyin.downloads || 1}</TableCell>
                      <TableCell>
                        {new Date(douyin.createdAt).toLocaleString("zh-CN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <span
                          className="cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(douyin.video!);
                            showToast.success("复制成功");
                          }}
                        >
                          复制链接
                        </span>
                      </TableCell>

                      <TableCell className="text-right space-x-2">
                        <ConfirmDeleteDialog
                          title="确认删除"
                          description={`确定要删除抖音视频 "${douyin.title}" 吗？`}
                          onConfirm={() => handleDelete(douyin._id!)}
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
                      onClick={() => fetchDouyins(pageInfo.currentPage - 1)}
                      isActive={pageInfo.currentPage > 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pageInfo.totalPages }).map((_, i) => (
                    <PaginationItem key={i + 1}>
                      <PaginationLink
                        href="#"
                        onClick={() => fetchDouyins(i + 1)}
                        isActive={pageInfo.currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={() => fetchDouyins(pageInfo.currentPage + 1)}
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
