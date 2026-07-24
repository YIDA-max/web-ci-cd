/*
 * Pixiv 推荐列表 — Nest 适配后的 handler
 */
import { RouterContext } from '../../content-shared/router-context';
import * as pixiv from './pixivNode';

export default async (
  ctx: RouterContext & {
    request: {
      body: {
        loginInfo?: {
          access_token?: string;
          refresh_token?: string;
          expire_time?: number;
          user?: any;
        };
        queryParameter?: {
          contentType?: 'ILLUSTRATION' | 'MANGA' | 'UGOIRA' | 'NOVEL';
          includeRankingIllustration?: 'false' | 'true';
          maxBookmarkIDForRecommend?: number;
          minBookmarkIDForRecentIllustrations?: number;
          offset?: number;
          bookmarkIllustIDs?: Array<number> | any;
          includeRankingLabel?: 'false' | 'true';
        };
      };
    };
  },
  _next: () => any,
) => {
  const body = ctx.request.body || {};
  const loginInfo = body.loginInfo;
  const queryParameter = body.queryParameter || {
    contentType: 'ILLUSTRATION' as const,
    includeRankingIllustration: 'true' as const,
    includeRankingLabel: 'true' as const,
  };

  if (!loginInfo?.access_token) {
    ctx.status = 400;
    ctx.body = {
      success: false,
      errorMessage: '缺少 Pixiv access_token，请先在推荐页完成 Pixiv 授权登录',
      errorCode: 'PIXIV_TOKEN_MISSING',
    };
    return;
  }

  try {
    const {
      contentType,
      includeRankingIllustration,
      maxBookmarkIDForRecommend,
      minBookmarkIDForRecentIllustrations,
      offset,
      bookmarkIllustIDs,
      includeRankingLabel,
    } = queryParameter;

    const data = await pixiv.fetch.recommendedIllustrations(loginInfo as any, {
      contentType,
      includeRankingIllustration,
      maxBookmarkIDForRecommend,
      minBookmarkIDForRecentIllustrations,
      offset,
      bookmarkIllustIDs,
      includeRankingLabel,
    });
    ctx.body = { data };
  } catch (err: any) {
    const status = err?.response?.status || 502;
    const pixivMsg =
      err?.response?.data?.error?.message ||
      err?.response?.data?.message ||
      err?.message ||
      'Pixiv 推荐接口调用失败';
    ctx.status = status >= 400 && status < 600 ? status : 502;
    ctx.body = {
      success: false,
      errorMessage: `Pixiv 请求失败: ${pixivMsg}`,
      errorCode: 'PIXIV_RECOMMEND_FAILED',
      detail: err?.response?.data,
    };
  }
};
