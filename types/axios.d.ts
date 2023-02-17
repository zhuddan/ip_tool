export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined;

export interface RequestOptions {
  // Splicing request parameters to url
  joinParamsToUrl?: boolean;
  // Format request parameter time
  formatDate?: boolean;
  // Whether to process the request result
  isTransformResponse?: boolean;
  // Whether to return native response headers
  // For example: use this attribute when you need to get the response headers
  isReturnNativeResponse?: boolean;
  // Whether to join url
  joinPrefix?: boolean;
  // Interface address, use the default apiUrl if you leave it blank
  apiUrl?: string;
  // 请求拼接路径
  urlPrefix?: string;
  // Error message prompt type
  errorMessageMode?: ErrorMessageMode;
  // Whether to add a timestamp
  joinTime?: boolean;

  ignoreCancelToken?: boolean;
  // Whether to send token in header
  withToken?: boolean;

  tokenKey?: string;
}

export interface Result<T = any> {
  code: number;
  msg: string;
  data: T;
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable;
  // File parameter interface field name
  name?: string;
  // file name
  file: File | Blob;
  // file name
  filename?: string;
  [key: string]: any;
}

declare global {
  /**
   * @description 请求响应
   */

  declare type ResponseResult<T> = T & {
    code: number;
    msg?: string;
  };

  declare type ListData<T> = ResponseResult<{
    total: number;
    rows: T[];
  }>;

  declare type ResponseData<T = any> = ResponseResult<{
    data: T;
  }>;

  declare type ListParams<T = object> = {
    pageNum: number;
    pageSize: number;
  } & Partial<T>;

  declare type ListQuery<T = Recordable> = ListParams & Partial<T>;
}
