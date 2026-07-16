# 🏔️ 西藏支教 · 行李准备助手

> 2026 · 昌都 — 愿你翻越山海，奔赴热爱。

纯前端离线网页应用，帮助整理支教出行的行李清单。

---

## ✨ 功能

- **120 项物资清单** — 按证件 / 电子产品 / 火车用品 / 生活用品分类
- **一键勾选** — Apple 风格圆形复选框，进度实时统计
- **全文搜索** — 输入关键词即时过滤，匹配高亮
- **折叠面板** — 点击分类标题展开/收起
- **倒计时** — 出发前显示"距离出发 XX 天"，出发后自动切换"已经出发 第 X 天"
- **数据持久化** — 勾选状态保存在浏览器 LocalStorage，刷新不丢失
- **响应式设计** — 手机 / 平板 / 桌面均可使用
- **雪山主题** — 毛玻璃卡片 + 手绘风雪山背景 + 飘雪动画

---

## 📂 目录结构

```
西藏支教/物资准备/
├── index.html                         ← 唯一文件，双击即用
├── README.md
└── 西藏昌都支教一年物资准备清单_最终版.xlsx  ← 原始 Excel
```

---

## 🔧 如何修改

### 修改出发日期

打开 `index.html`，找到脚本顶部：

```javascript
const DEPARTURE = '2026-07-21';
```

改为你的出发日期（格式 `YYYY-MM-DD`），保存即可。

### 修改物资清单

打开 `index.html`，找到 `CATEGORIES` 数组（约第 580 行）：

```javascript
var CATEGORIES = [
  {
    id: 'docs',
    name: '证件',
    icon: '🪪',
    iconClass: 'docs',
    items: [
      '身份证',
      '身份证复印件(5份)',
      // ← 在这里增删物品
    ]
  },
  // ...
];
```

- **增加物品**：在对应数组中添加字符串，如 `'护照'`
- **删除物品**：删除对应行
- **调整重要性**：在 `IMPORTANCE` 对象中设置 `'物品名': 2` 或 `3`
- **子分类**（如生活用品）：每个子分类有 `name` 和 `items` 两个字段

---

## 🚀 部署

### 方式一：本地直接打开（零配置）

双击 `index.html` 即可在浏览器中使用。

### 方式二：任意静态服务器

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .

# VS Code
安装 Live Server 插件，右键 → Open with Live Server
```

### 方式三：部署到公网

将 `index.html` 上传到任意静态托管平台：

- **GitHub Pages** — 推送到仓库，Settings → Pages 开启
- **Vercel** — 拖拽文件夹到 vercel.com
- **Netlify** — 拖拽文件夹到 netlify.com
- **Cloudflare Pages** — 连接 Git 仓库自动部署
- **任何 Nginx / Apache / OSS** — 直接放置文件即可

---

## 💾 备份与恢复 LocalStorage

勾选数据保存在浏览器的 `localStorage` 中，以 `luggage_v3_` 为前缀。

### 导出（备份）

打开浏览器开发者工具（F12），在 Console 中执行：

```javascript
// 导出所有勾选数据
var data = {};
for (var i = 0; i < localStorage.length; i++) {
  var key = localStorage.key(i);
  if (key.startsWith('luggage_v3_')) {
    data[key] = localStorage.getItem(key);
  }
}
console.log(JSON.stringify(data));
// 复制输出的 JSON 字符串，保存到文件
```

### 导入（恢复）

```javascript
// 粘贴之前备份的 JSON
var backup = {"luggage_v3_docs_身份证":"1", ...};
Object.keys(backup).forEach(function(key) {
  localStorage.setItem(key, backup[key]);
});
location.reload(); // 刷新页面
```

### 清除所有数据

```javascript
// 清除所有行李准备数据
for (var i = localStorage.length - 1; i >= 0; i--) {
  var key = localStorage.key(i);
  if (key.startsWith('luggage_v3_')) {
    localStorage.removeItem(key);
  }
}
location.reload();
```

---

## 🎨 设计参考

- Apple HIG — 毛玻璃、圆形复选框、弹簧动画
- Notion — 极简卡片、留白、层级字号
- Linear — 精致阴影、柔和过渡
- iOS — SF 字体栈、色彩系统

---

## 🛠 技术栈

| 层 | 技术 |
|---|---|
| 结构 | HTML5 语义化标签 |
| 样式 | CSS Custom Properties（设计令牌）、Grid、Flexbox、毛玻璃 |
| 逻辑 | 原生 JavaScript（ES5 兼容，无任何依赖） |
| 存储 | `localStorage`（键名 `luggage_v3_`） |

---

## 📄 许可证

个人使用，自由修改。
