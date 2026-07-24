/**
 * Koa 中间件 → Nest 可调用的薄适配（业务逻辑仍在 legacy handler 中，接口层为 Nest）。
 */
export type LegacyCtx = {
  request: {
    body: any;
    query: any;
    files?: any;
  };
  params: Record<string, any>;
  query: Record<string, any>;
  body: any;
  status: number;
  type?: string;
  responseHeaders: Record<string, string>;
  set: (key: string, value: string) => void;
  app: { emit: (...args: any[]) => void };
};

export type LegacyHandler = (ctx: LegacyCtx, next: () => Promise<void>) => Promise<void> | void;

export async function runLegacyHandler(
  handler: LegacyHandler,
  input: {
    body?: any;
    query?: any;
    params?: Record<string, any>;
    files?: any;
  },
): Promise<{ body: any; status: number; type?: string; headers: Record<string, string> }> {
  const headers: Record<string, string> = {};
  const ctx: LegacyCtx = {
    request: {
      body: input.body ?? {},
      query: input.query ?? {},
      files: input.files,
    },
    params: input.params ?? {},
    query: input.query ?? {},
    body: undefined,
    status: 200,
    responseHeaders: headers,
    set: (key, value) => {
      headers[key] = value;
    },
    app: {
      emit: (code: any) => {
        throw new Error(typeof code === 'string' ? code : 'legacy_error');
      },
    },
  };

  await handler(ctx, async () => undefined);
  return {
    body: ctx.body,
    status: ctx.status || 200,
    type: ctx.type,
    headers,
  };
}
