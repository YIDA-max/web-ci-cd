import Bookmark from "./fetch/bookmark";
import Followers from "./fetch/followers";
import FollowingUsers from "./fetch/followingUsers";
import Illustration from "./fetch/illustration";
import IllustrationComments from "./fetch/illustrationComments";
import IllustrationFromFollowingCreators from "./fetch/illustrationFromFollowingCreators";
import IllustrationRanking from "./fetch/illustrationRanking";
import RecommendedIllustrations from "./fetch/recommendedIllustrations";
import RelatedIllustrations from "./fetch/relatedIllustrations";
import SearchForIllustration from "./fetch/searchForIllustration";
import TrendingTags from "./fetch/trendingTags";
import User from "./fetch/user";
import UserBookmarkIllustrations from "./fetch/userBookmarkIllustrations";
import UserBookmarkTags from "./fetch/userBookmarkTags";
import UserIllustrations from "./fetch/userIllustrations";
import SearchForUser from "./fetch/searchForUser";

/**
 * Methods to fetch information (ranking, illutration info, etc.)
 */
export namespace fetch {
  // 以下是每个方法的作用和注释
  // 获取用户收藏夹中的插画
  export const bookmark = Bookmark;
  // 获取用户的粉丝列表
  export const followers = Followers;
  // 获取用户关注的用户列表
  export const followingUsers = FollowingUsers;
  // 获取指定 ID 的插画信息
  export const illustration = Illustration;
  // 获取指定 ID 的插画的评论列表
  export const illustrationComments = IllustrationComments;
  // 获取关注的创作者的新作品
  export const illustrationFromFollowingCreators =
    IllustrationFromFollowingCreators;
  // 获取插画排行榜
  export const illustrationRanking = IllustrationRanking;
  // 获取推荐的插画列表
  export const recommendedIllustrations = RecommendedIllustrations;
  // 获取与指定 ID 的插画相关的插画列表
  export const relatedIllustrations = RelatedIllustrations;
  // 搜索插画
  export const searchForIllustration = SearchForIllustration;
  // 获取热门标签
  export const trendingTags = TrendingTags;
  // 获取指定 ID 的用户信息
  export const user = User;
  // 获取用户收藏的插画列表
  export const userBookmarkIllustrations = UserBookmarkIllustrations;
  // 获取用户收藏的标签列表
  export const userBookmarkTags = UserBookmarkTags;
  // 获取指定用户发布的插画列表
  export const userIllustrations = UserIllustrations;
  // 搜索用户
  export const searchForUser = SearchForUser;
}
