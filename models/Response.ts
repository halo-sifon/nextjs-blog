interface ResponseProps<T = any> {
  data: T | null;
  message: string;
  showType: "slient" | "error" | "success";
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

export { ApiResponse, SuccessResponse, FailResponse };
