(function () {
  "use strict";
  const form = document.getElementById("link-form");
  const input = document.getElementById("share-link");
  const error = document.getElementById("input-error");
  const result = document.getElementById("result");
  const empty = document.getElementById("empty-result");
  const output = document.getElementById("download-link");
  const badge = document.getElementById("result-badge");
  const status = document.getElementById("status");
  const openLink = document.getElementById("open-link");
  const alternateLink = document.getElementById("alternate-link");

  function resetResult() {
    result.hidden = true;
    empty.hidden = false;
    output.value = "";
    openLink.removeAttribute("href");
    alternateLink.removeAttribute("href");
    badge.textContent = "等待链接";
    badge.classList.remove("ready");
    status.textContent = "";
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
  }

  input.addEventListener("input", resetResult);
  document.getElementById("clear-button").addEventListener("click", function () {
    input.value = "";
    resetResult();
    input.focus();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    resetResult();
    let links;
    try {
      links = DriveLink.convert(input.value);
    } catch (cause) {
      error.textContent = cause.message;
      error.hidden = false;
      input.setAttribute("aria-invalid", "true");
      input.focus();
      return;
    }
    output.value = links.direct;
    openLink.href = links.direct;
    alternateLink.href = links.alternate;
    empty.hidden = true;
    result.hidden = false;
    badge.textContent = "已生成";
    badge.classList.add("ready");

    if (!event.submitter || event.submitter.value === "download") {
      status.textContent = "已请求 Google 下载。若没有开始，请点击“打开下载”或尝试备用入口。";
      // A real link navigation needs neither cross-origin fetch nor a public proxy.
      openLink.click();
    } else {
      status.textContent = "直链已生成，可复制到打印机。文件访问权限尚未验证。";
    }
  });

  document.getElementById("copy-button").addEventListener("click", async function () {
    if (!output.value) return;
    const value = output.value;
    try {
      await navigator.clipboard.writeText(value);
      if (output.value === value) status.textContent = "下载链接已复制。";
    } catch {
      if (output.value !== value) return;
      output.focus();
      output.select();
      status.textContent = "浏览器未允许自动复制，已选中链接，请手动复制。";
    }
  });
})();
