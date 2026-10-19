/* Deliberately offline: accept only known Drive file routes, never arbitrary redirects. */
(function () {
  "use strict";

  function convert(input) {
    const value = input.trim();
    if (!value) throw new Error("请先粘贴 Google Drive 的 PDF 分享链接。");

    let url;
    try {
      url = new URL(/^drive\.(?:google|usercontent\.google)\.com\//i.test(value) ? "https://" + value : value);
    } catch {
      throw new Error("链接格式不正确，请复制完整的 Google Drive 分享链接。");
    }

    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !["drive.google.com", "drive.usercontent.google.com"].includes(url.hostname)) {
      throw new Error("请使用 drive.google.com 的 HTTPS 文件链接。");
    }

    const filePath = url.pathname.match(/^\/file\/(?:u\/\d+\/)?d\/([A-Za-z0-9_-]+)(?:\/(?:view|preview|edit))?\/?$/);
    const queryRoute = url.hostname === "drive.google.com"
      ? /^\/(?:open|uc|download)\/?$/ : /^\/download\/?$/;
    const id = filePath && url.hostname === "drive.google.com"
      ? filePath[1] : queryRoute.test(url.pathname) ? url.searchParams.get("id") : null;

    if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
      throw new Error("没有找到文件 ID。请使用单个 PDF 文件的分享链接，不是文件夹或 Google 文档链接。");
    }

    const resourceKey = url.searchParams.get("resourcekey");
    if (resourceKey !== null && !/^[A-Za-z0-9_-]+$/.test(resourceKey)) {
      throw new Error("链接中的 resourcekey 不完整，请重新从 Drive 复制分享链接。");
    }

    const direct = new URL("https://drive.google.com/uc");
    direct.searchParams.set("export", "download");
    direct.searchParams.set("id", id);
    const alternate = new URL("https://drive.usercontent.google.com/download");
    alternate.searchParams.set("id", id);
    alternate.searchParams.set("export", "download");
    // Older link-shared files can require this key even with a valid file ID.
    if (resourceKey) {
      direct.searchParams.set("resourcekey", resourceKey);
      alternate.searchParams.set("resourcekey", resourceKey);
    }
    return { direct: direct.href, alternate: alternate.href };
  }

  globalThis.DriveLink = Object.freeze({ convert });
})();
