interface IListInfo {
  // 热门推荐
  hotRecommendations: Array<IListInfoItem>;
  // 经典完结
  classicFinished: Array<IListInfoItem>;
  // 热门连载
  hotOngoingManga: Array<IListInfoItem>;
  // 最新上架
  latestShelves: Array<IListInfoItem>;
  // 新番漫画
  newSeriesManga: Array<IListInfoItem>;
  // 漫画推荐大全
  mangaRecommendations: Array<IListInfoItem>;
}
interface IListInfoItem {
  imgSrc?: string;
  name: string;
  toUrl: string;
  ttSection?: string;
}
export { IListInfo, IListInfoItem };
