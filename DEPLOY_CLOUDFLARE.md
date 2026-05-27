# 前端 Cloudflare 部署指南

仓库：https://github.com/nikegongsi-afk/qianduan

- 正式域名：`https://stevencress.com`
- 后端 API：`https://houduan-api.onrender.com`

## 命令行部署

```bash
cd web--wangye/stock-web-2025-12-29-new
npm install
npx wrangler login
npm run deploy
```

## Cloudflare Dashboard 部署（Git 自动构建）

1. 打开 https://dash.cloudflare.com → **Workers & Pages**
2. **Create** → **Worker** → **Connect to Git**
3. 选择 **nikegongsi-afk/qianduan**
4. 构建设置：
   - Build command: `npm install && npm run build`
   - Deploy command: `npx wrangler deploy`
5. 环境变量已在 `wrangler.toml` 中配置，无需额外添加

## 域名 DNS

根域名 `stevencress.com` 已有解析即可访问。若 **`www.stevencress.com` 打不开**，通常是缺少 `www` 子域名 DNS 记录。

### 1. 添加 www DNS（必做）

Cloudflare 控制台 → **stevencress.com** → **DNS** → **添加记录**：

| 类型 | 名称 | 内容 | 代理 |
|------|------|------|------|
| CNAME | `www` | `stevencress.com` | 已代理（橙色云） |

保存后等待 1–5 分钟生效。

### 2. www 自动跳转到主域名

Worker 已配置：访问 `www.stevencress.com` 会 **301 跳转到** `https://stevencress.com`（保留路径，如 `/userlogin`）。

也可在 Cloudflare **Rules → Redirect Rules** 中额外配置（与 Worker 二选一即可）。

## 验证

- https://stevencress.com
- https://www.stevencress.com（应自动跳转到上面主域名）
