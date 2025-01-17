/**
 * 通用 API 响应接口
 */
export interface ApiResponse<T> {
  /** 响应数据 */
  data: T;
  /** 响应消息 */
  message?: string;
  /** 显示类型 */
  showType?: "error" | "success" | "warning" | "silent";
}

/**
 * 分页响应接口
 */
export interface PaginationResponse<T> {
  /** 数据列表 */
  list: T[];
  /** 总数 */
  total: number;
  /** 是否有更多 */
  hasMore: boolean;
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: Record<string, string>;
}
