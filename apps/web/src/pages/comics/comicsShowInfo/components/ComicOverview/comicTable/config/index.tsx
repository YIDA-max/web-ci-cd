import { ProColumns } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Image, Spin } from 'antd';
import LookInfo from '../../../ComicsInfo';
type GithubIssueItem = {
  imgSrc: string;
  toUrl: string;
  name: string;
  ttSection: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};
// Define the props type
interface RenderOptionProps {
  record: {
    toUrl: string;
    name: string;
  };
}
// Create the new function component
const RenderOption: React.FC<RenderOptionProps> = ({ record }) => {
  const { userSpinning } = useModel('comicsShowInfoSpin');
  return (
    <Spin spinning={userSpinning} key={1}>
      <LookInfo toUrl={record.toUrl} name={record.name} />
    </Spin>
  );
};
const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '地区',
    dataIndex: 'area',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      japan: { text: '日本' },
      hongkong: { text: '港台' },
      other: { text: '其他' },
      europe: { text: '欧美' },
      china: { text: '大陆' },
      korea: { text: '韩国' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '标签',
    dataIndex: 'tags',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      rexue: { text: '热血' },
      maoxian: { text: '冒险' },
      mohuan: { text: '魔幻' },
      shengui: { text: '神鬼' },
      gaoxiao: { text: '搞笑' },
      mengxi: { text: '萌系' },
      aiqing: { text: '爱情' },
      kehuan: { text: '科幻' },
      mofa: { text: '魔法' },
      gedou: { text: '格斗' },
      wuxia: { text: '武侠' },
      jizhan: { text: '机战' },
      zhanzheng: { text: '战争' },
      jingji: { text: '竞技' },
      tiyu: { text: '体育' },
      xiaoyuan: { text: '校园' },
      shenghuo: { text: '生活' },
      lizhi: { text: '励志' },
      lishi: { text: '历史' },
      weiniang: { text: '伪娘' },
      zhainan: { text: '宅男' },
      funv: { text: '腐女' },
      danmei: { text: '耽美' },
      baihe: { text: '百合' },
      hougong: { text: '后宫' },
      zhiyu: { text: '治愈' },
      meishi: { text: '美食' },
      tuili: { text: '推理' },
      xuanyi: { text: '悬疑' },
      kongbu: { text: '恐怖' },
      sige: { text: '四格' },
      zhichang: { text: '职场' },
      zhentan: { text: '侦探' },
      shehui: { text: '社会' },
      yinyue: { text: '音乐' },
      wudao: { text: '舞蹈' },
      zazhi: { text: '杂志' },
      heidao: { text: '黑道' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '受众',
    dataIndex: 'audience',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      shaonv: { text: '少女' },
      shaonian: { text: '少年' },
      qingnian: { text: '青年' },
      ertong: { text: '儿童' },
      tongyong: { text: '通用' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '年份',
    dataIndex: 'year',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      '2021': { text: '2021年' },
      '2020': { text: '2020年' },
      '2019': { text: '2019年' },
      '2018': { text: '2018年' },
      '2017': { text: '2017年' },
      '2016': { text: '2016年' },
      '2015': { text: '2015年' },
      '2014': { text: '2014年' },
      '2013': { text: '2013年' },
      '2012': { text: '2012年' },
      '2011': { text: '2011年' },
      '2010': { text: '2010年' },
      '200x': { text: '00年代' },
      '199x': { text: '90年代' },
      '198x': { text: '80年代' },
      '197x': { text: '更早' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '字母',
    dataIndex: 'letter',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      a: { text: 'A' },
      b: { text: 'B' },
      c: { text: 'C' },
      d: { text: 'D' },
      e: { text: 'E' },
      f: { text: 'F' },
      g: { text: 'G' },
      h: { text: 'H' },
      i: { text: 'I' },
      j: { text: 'J' },
      k: { text: 'K' },
      l: { text: 'L' },
      m: { text: 'M' },
      n: { text: 'N' },
      o: { text: 'O' },
      p: { text: 'P' },
      q: { text: 'Q' },
      r: { text: 'R' },
      s: { text: 'S' },
      t: { text: 'T' },
      u: { text: 'U' },
      v: { text: 'V' },
      w: { text: 'W' },
      x: { text: 'X' },
      y: { text: 'Y' },
      z: { text: 'Z' },
      '0-9': { text: '0-9' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      '': { text: '全部' },
      lianzai: { text: '连载' },
      wanjie: { text: '完结' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '排序',
    dataIndex: 'sort',
    valueType: 'select',
    valueEnum: {
      'index.html': { text: '最新发布' },
      'update.html': { text: '最新更新' },
      'view.html': { text: '人气最旺' },
      'rate.html': { text: '评分最高' },
    },
    hideInTable: true, // 在表格中隐藏
  },
  {
    title: '名字',
    dataIndex: 'name',
    hideInSearch: true, // 在表单中隐藏
  },
  {
    title: '最新章节',
    dataIndex: 'ttSection',
    hideInSearch: true, // 在表单中隐藏
    ellipsis: true,
  },
  {
    title: '地址',
    dataIndex: 'toUrl',
    hideInSearch: true, // 在表单中隐藏
    copyable: true,
    ellipsis: true,
  },
  {
    title: '封面',
    dataIndex: 'imgSrc',
    render: (_, record) => {
      return (
        <Image width={'100%'} src={record.imgSrc} fallback="https://via.placeholder.com/40"></Image>
      );
    },
    hideInSearch: true, // 在表单中隐藏
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record) => <RenderOption record={record} />,
  },
];

export { columns, GithubIssueItem };
