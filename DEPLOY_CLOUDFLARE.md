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

域名 `stevencress.com` 已在 Cloudflare 注册后，`wrangler deploy` 会自动绑定路由。

如需 www 跳转，可在 Cloudflare **Rules** 中添加：`www.stevencress.com` → `stevencress.com`

## 验证

- https://stevencress.com
- https://www.stevencress.com
