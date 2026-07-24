const cheerio = require("cheerio");

const html = `
                 <li class="current"><a href="/list/">最新发布</a></li>
            <li><a href="/list/update.html">最新更新</a></li>
            <li><a href="/list/view.html">人气最旺</a></li>
            <li><a href="/list/rate.html">评分最高</a></li>
`;

const $ = cheerio.load(html);
const data = [];

$("a").each((index, element) => {
  let href = $(element).attr("href");
  let text = $(element).text();
  if (href) {
    href = href.replace("/list/", "");
    data.push({ label: text, value: href });
  }
});

console.log(data); // 打印出所有的链接
