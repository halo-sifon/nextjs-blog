export interface ResponseProps<T = any> {
  data: T | null;
  message: string;
  showType: "slient" | "error" | "success" | "warning";
}

class ApiResponse<T> {
  protected data: T | null;
  protected message: string;
  protected showType: string;

  constructor({ data, message, showType }: ResponseProps<T>) {
    this.data = data;
    this.message = message;
    this.showType = showType;
  }
}

class SuccessResponse<T> extends ApiResponse<T> {
  constructor({
    data = null,
    message = "操作成功",
    showType = "slient",
  }: Partial<ResponseProps<T>>) {
    super({ data, message, showType });
  }
}

class FailResponse<T> extends ApiResponse<T> {
  constructor({
    data = null,
    message = "操作失败",
    showType = "error",
  }: Partial<ResponseProps<T>>) {
    super({ data, message, showType });
  }
}

interface ListData<T> {
  list: T[];
  total: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

class ListResponse<T> extends SuccessResponse<ListData<T>> {
  constructor({
    data = {
      list: [],
      total: 0,
      hasMore: false,
      currentPage: 1,
      totalPages: 1,
    },
    message = "操作成功",
    showType = "slient",
  }: Partial<ResponseProps<ListData<T>>>) {
    super({ data, message, showType });
  }
}

export { ApiResponse, SuccessResponse, FailResponse, ListResponse };
