/** 去掉对真实 koa-router 的依赖，仅保留类型兼容 */
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

declare const Router: any;
export default Router;
