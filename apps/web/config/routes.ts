/**
 * GitCICD + 内容站路由
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        path: '/user/*',
        component: './exception/404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'home',
    component: './Welcome',
  },
  {
    path: '/git',
    name: 'git-merge',
    icon: 'branches',
    component: './git-merge',
  },
  {
    path: '/deploy',
    name: 'deploy',
    icon: 'cloudUpload',
    component: './deploy',
  },
  {
    name: 'pixiv',
    path: '/pixiv',
    icon: 'coffee',
    footerRender: false,
    routes: [
      { path: '/pixiv', redirect: '/pixiv/PixivRecommend' },
      {
        path: '/pixiv/PixivRecommend',
        name: '推荐页面',
        component: './Pixiv/PixivRecommend',
      },
      {
        path: '/pixiv/PixivViewer/:id',
        name: '详情页面',
        component: './Pixiv/PixivViewer',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '笔趣阁',
    path: '/fiction',
    icon: 'fileText',
    footerRender: false,
    routes: [
      { path: '/fiction', redirect: '/fiction/FictionList' },
      {
        path: '/fiction/FictionList',
        name: '小说列表',
        component: './Fiction/FictionList',
      },
      {
        path: '/fiction/FictionInfo/:url',
        name: '小说阅读',
        component: './Fiction/FictionInfo',
        hideInMenu: true,
      },
      {
        path: '/fiction/MyFiction',
        name: '我的书架',
        component: './Fiction/MyFiction',
      },
    ],
  },
  {
    name: '漫画柜',
    path: '/comics',
    icon: 'read',
    footerRender: false,
    routes: [
      { path: '/comics', redirect: '/comics/comicsShowInfo' },
      {
        path: '/comics/comicsShowInfo',
        name: '漫画列表',
        component: './comics/comicsShowInfo',
      },
      {
        path: '/comics/comicsView/:url',
        name: '查看漫画',
        hideInMenu: true,
        component: './comics/comicsView',
      },
    ],
  },
  {
    name: 'Mooncell',
    path: '/mooncell',
    icon: 'fire',
    footerRender: false,
    routes: [
      { path: '/mooncell', redirect: '/mooncell/homePage' },
      {
        path: '/mooncell/homePage',
        name: '主页',
        component: './Mooncell/homePage',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    path: '/*',
    component: './exception/404',
  },
];
