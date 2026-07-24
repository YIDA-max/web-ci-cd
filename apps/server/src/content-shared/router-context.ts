/** 兼容原 Koa handler 签名，无真实 Koa 依赖 */
export type RouterContext = {
  request: any;
  params: any;
  query: any;
  body: any;
  status: number;
  type?: string;
  set: (key: string, value: string) => void;
  app?: any;
};
