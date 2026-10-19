# 纸间 / Paperlink

适合 GitHub Pages 的 Google Drive PDF 下载链接转换器。纯 HTML、CSS、JavaScript，无依赖、无需构建、无需 API key。

## 使用

1. 在 Google Drive 中选择 PDF → 分享 → 常规访问权限设为“知道链接的任何人”，授予查看者权限，并确保允许下载。
2. 粘贴文件分享链接，点击「打开 PDF 下载」直接请求下载，或点击「仅生成直链」。
3. 把生成的 **Google 下载直链** 复制到打印机的 URL 输入框。建议先在未登录 Google 的无痕窗口测试。
4. 敏感文件打印后，将 Drive 共享权限改回「受限」。撤销共享不会删除已经下载的副本。

支持 `drive.google.com/file/d/文件ID/view`、`open?id=文件ID`、`uc?id=文件ID` 等文件链接，保留需要的 `resourcekey`。Google Docs 文档和文件夹链接不受支持。本工具无法确认目标文件是否确实为 PDF，请输入 PDF 文件链接。

## 部署到 GitHub Pages

1. 把 `index.html`、`styles.css`、`drive-link.js`、`app.js`、`favicon.svg` 和 `.nojekyll` 上传到 GitHub 仓库根目录。可以一并提交本说明和 `.gitignore`。**不要提交 PDF 或实际的敏感文件链接。**
2. 在仓库 **Settings → Pages → Build and deployment** 中选择 **Deploy from a branch**。
3. 选择代码所在分支（通常是 `main`），目录选择 **/ (root)**，保存。
4. 等待 GitHub Pages 部署完成，打开 `https://你的用户名.github.io/仓库名/`。

所有资源使用相对路径，可用于用户站点、项目站点或自定义域名。不需要 GitHub Actions 构建脚本。

## 本地预览

在项目目录运行 `python3 -m http.server 8000`，然后访问 `http://localhost:8000/`。也可以直接打开 `index.html`；如果浏览器不允许剪贴板访问，页面会选中链接供手动复制。

## 能力和隐私边界

- 输入的链接只在当前页面内存中处理，不放进页面 URL，不使用 localStorage、cookie、分析服务或第三方脚本。刷新或清空即可移除当前页面中的输入。
- 只有点击下载时，浏览器才会向 Google 发送下载请求；复制的直链也会包含文件 ID 和可能存在的资源密钥。请把它当作访问凭据保管。
- GitHub 只托管这几个静态代码文件；应用不会读取或上传 PDF，也不会把文件写入 Git 历史。`.gitignore` 排除 PDF 是防误提交措施，不能清除已经提交的文件。
- 转换不等于私密授权。“知道链接的任何人”允许持有链接的人访问。工具无法替打印机登录 Google、绕过文件权限、组织策略或下载限制。
- 输出的主入口是 `https://drive.google.com/uc?export=download&id=文件ID`，备用入口为 `https://drive.usercontent.google.com/download?id=文件ID&export=download`。这是请求下载的地址，不是自建文件服务，不保证 Google 每次都直接返回 PDF。
- Google 可能返回登录、病毒扫描确认、限流或其他 HTML 页面。页面无法从跨域响应中检测下载结果，因此「已生成」只表示 URL 转换成功。GitHub Pages 无法代理 PDF、控制 Google 响应头，或保证打印机兼容性。
- 如果打印机只接受直接返回 `application/pdf` 的 URL，而 Google 两个入口都返回 HTML，需要另外的后端或文件存储服务；静态页面无法解决这一点。

参考：[Google Drive 共享权限](https://support.google.com/drive/answer/2494822?hl=zh-Hans)、[Google 文件下载说明](https://developers.google.com/workspace/drive/api/guides/manage-downloads)、[资源密钥说明](https://developers.google.com/workspace/drive/api/guides/resource-keys)。
