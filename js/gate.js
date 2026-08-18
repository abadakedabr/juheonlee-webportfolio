(function () {
  if (sessionStorage.getItem("siteAuth") === "ok") return;
  document.documentElement.style.visibility = "hidden";

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.createElement("div");
    overlay.id = "site-gate";
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:99999;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;font-family:'Pretendard','Helvetica Neue',Arial,sans-serif;";
    overlay.innerHTML =
      '<div style="color:#fff;font-size:13px;letter-spacing:0.05em;opacity:0.7;">이 사이트는 비공개입니다</div>' +
      '<input id="gate-pw" type="password" placeholder="비밀번호" style="padding:12px 16px;border-radius:6px;border:1px solid #333;background:#17181C;color:#fff;font-size:14px;width:220px;text-align:center;outline:none;">' +
      '<button id="gate-btn" style="padding:11px 26px;border-radius:999px;border:none;background:#7D53FF;color:#fff;font-weight:600;cursor:pointer;font-size:13px;">입장하기</button>' +
      '<div id="gate-err" style="color:#ff6b6b;font-size:12px;display:none;">비밀번호가 틀렸습니다</div>';
    document.body.appendChild(overlay);
    document.documentElement.style.visibility = "visible";
    document.body.style.overflow = "hidden";

    function tryAuth() {
      var val = document.getElementById("gate-pw").value;
      if (val === "0000") {
        sessionStorage.setItem("siteAuth", "ok");
        overlay.remove();
        document.body.style.overflow = "";
      } else {
        document.getElementById("gate-err").style.display = "block";
        document.getElementById("gate-pw").value = "";
      }
    }
    document.getElementById("gate-btn").addEventListener("click", tryAuth);
    document.getElementById("gate-pw").addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryAuth();
    });
  });
})();
