const listEl = document.getElementById("project-list");

function coverHTML(p) {
  if (p.video) {
    return `<video class="panel-fill" data-lazy-src="${p.video}" muted loop playsinline></video>`;
  }
  if (p.cover && p.cover.startsWith("http")) {
    return `<div class="panel-fill" data-lazy-bg="${p.cover}"></div>`;
  }
  return `<div class="panel-fill ${p.cover}"></div>`;
}

listEl.innerHTML = PROJECTS.map(p => `
  <a class="project-panel" href="project.html?id=${p.id}" data-id="${p.id}">
    ${coverHTML(p)}
    <div class="panel-overlay">
      <div class="panel-title">${p.name}</div>
      <div class="panel-tagline">${p.tagline}</div>
    </div>
  </a>
`).join("");

// 지연 로딩: 화면에 가까워질 때(약 500px 전)만 실제 사진/영상을 불러옴
const lazyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    if (el.dataset.lazyBg) {
      el.style.backgroundImage = `url('${el.dataset.lazyBg}')`;
      el.style.backgroundSize = "cover";
      el.style.backgroundPosition = "center";
      el.removeAttribute("data-lazy-bg");
    }
    if (el.dataset.lazySrc) {
      el.src = el.dataset.lazySrc;
      el.autoplay = true;
      el.removeAttribute("data-lazy-src");
    }
    lazyObserver.unobserve(el);
  });
}, { rootMargin: "500px 0px" });

document.querySelectorAll(".panel-fill[data-lazy-bg], .panel-fill[data-lazy-src]").forEach(el => lazyObserver.observe(el));

// ===== 편집 모드: 홈 그리드 (커버 사진 교체 + 텍스트 편집) =====
const homeParams = new URLSearchParams(window.location.search);

function ensureImgbbKeyHome() {
  let key = localStorage.getItem("imgbb_key");
  if (!key) {
    key = prompt("imgbb API Key를 입력해주세요 (upload.html에서 쓴 것과 같은 키):");
    if (key) localStorage.setItem("imgbb_key", key.trim());
  }
  return key ? key.trim() : null;
}

function initHomeEditMode() {
  const changes = {}; // { "cover-{id}": url, "title-{id}": text, "tagline-{id}": text }

  const toggle = document.createElement("button");
  toggle.id = "edit-mode-toggle";
  toggle.textContent = "🔧 편집 모드";
  toggle.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 999;
    background: #7D53FF; color: #fff; border: none; border-radius: 999px;
    padding: 12px 20px; font-size: 13px; font-weight: 600; cursor: pointer;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3); font-family: inherit;
  `;
  document.body.appendChild(toggle);

  const panel = document.createElement("div");
  panel.style.cssText = `
    position: fixed; bottom: 70px; right: 20px; z-index: 999; display: none;
    background: #17181C; border: 1px solid #33343C; border-radius: 10px;
    padding: 16px; width: 320px; max-height: 300px; overflow-y: auto;
    color: #EDEDEA; font-size: 11px; font-family: ui-monospace, monospace;
  `;
  document.body.appendChild(panel);

  let editMode = false;
  let sizeSlider = null;
  let gapSlider = null;

  toggle.addEventListener("click", () => {
    editMode = !editMode;
    toggle.textContent = editMode ? "✕ 편집 모드 끄기" : "🔧 편집 모드";

    // 이미지(패널) 크기 조절 슬라이더
    if (editMode && !sizeSlider) {
      sizeSlider = document.createElement("div");
      sizeSlider.style.cssText = `
        position: fixed; bottom: 70px; left: 20px; z-index: 999;
        background: #17181C; border: 1px solid #33343C; border-radius: 10px;
        padding: 14px 16px; color: #EDEDEA; font-size: 11px; font-family: ui-monospace, monospace;
        width: 220px;
      `;
      const label = document.createElement("div");
      label.style.cssText = "margin-bottom:8px; color:#9A9A94;";
      label.textContent = "이미지 크기 (세로 높이)";
      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = "3";
      slider.max = "12";
      slider.step = "0.5";
      slider.value = "6";
      slider.style.width = "100%";
      const valLabel = document.createElement("div");
      valLabel.style.cssText = "margin-top:6px; color:#DFFF3C;";
      valLabel.textContent = "21 / 6 (기본값)";

      slider.addEventListener("input", () => {
        const ratio = slider.value;
        document.querySelectorAll(".project-panel").forEach(p => {
          p.style.aspectRatio = `21 / ${ratio}`;
        });
        valLabel.textContent = `21 / ${ratio}`;
        changes["panelAspectRatio"] = `21 / ${ratio}`;
        renderPanel();
      });

      sizeSlider.appendChild(label);
      sizeSlider.appendChild(slider);
      sizeSlider.appendChild(valLabel);
      document.body.appendChild(sizeSlider);
    } else if (!editMode && sizeSlider) {
      sizeSlider.remove();
      sizeSlider = null;
    }

    // 패널 사이 간격 조절 슬라이더
    if (editMode && !gapSlider) {
      gapSlider = document.createElement("div");
      gapSlider.style.cssText = `
        position: fixed; bottom: 190px; left: 20px; z-index: 999;
        background: #17181C; border: 1px solid #33343C; border-radius: 10px;
        padding: 14px 16px; color: #EDEDEA; font-size: 11px; font-family: ui-monospace, monospace;
        width: 220px;
      `;
      const gLabel = document.createElement("div");
      gLabel.style.cssText = "margin-bottom:8px; color:#9A9A94;";
      gLabel.textContent = "패널 사이 간격";
      const gSlider = document.createElement("input");
      gSlider.type = "range";
      gSlider.min = "0";
      gSlider.max = "60";
      gSlider.step = "1";
      const currentGap = parseInt(window.getComputedStyle(document.querySelector(".project-panel")).marginBottom, 10) || 4;
      gSlider.value = String(currentGap);
      gSlider.style.width = "100%";
      const gValLabel = document.createElement("div");
      gValLabel.style.cssText = "margin-top:6px; color:#DFFF3C;";
      gValLabel.textContent = `${currentGap}px`;

      gSlider.addEventListener("input", () => {
        const px = gSlider.value;
        document.querySelectorAll(".project-panel").forEach(p => {
          p.style.marginBottom = `${px}px`;
        });
        gValLabel.textContent = `${px}px`;
        changes["panelGap"] = `${px}px`;
        renderPanel();
      });

      gapSlider.appendChild(gLabel);
      gapSlider.appendChild(gSlider);
      gapSlider.appendChild(gValLabel);
      document.body.appendChild(gapSlider);
    } else if (!editMode && gapSlider) {
      gapSlider.remove();
      gapSlider = null;
    }

    // 프로젝트 사이사이에 "+" 삽입 버튼 (새 프로젝트 통째로 추가)
    document.querySelectorAll(".insert-project-btn").forEach(b => b.remove());
    if (editMode) {
      const panels = [...listEl.querySelectorAll(".project-panel")];
      const positions = panels.length + 1;
      for (let i = 0; i < positions; i++) {
        const insertBtn = document.createElement("button");
        insertBtn.className = "insert-project-btn";
        insertBtn.textContent = "+ 새 프로젝트 추가";
        insertBtn.style.cssText = `
          display: block; width: fit-content; margin: 10px auto;
          padding: 8px 16px; border-radius: 999px; border: none;
          background: #DFFF3C; color: #14151A; font-size: 12px; font-weight: 700;
          cursor: pointer;
        `;
        insertBtn.addEventListener("click", () => triggerInsertProject(i));
        if (i === 0) {
          listEl.insertBefore(insertBtn, listEl.firstChild);
        } else {
          panels[i - 1].insertAdjacentElement("afterend", insertBtn);
        }
      }
    }

    document.querySelectorAll(".project-panel").forEach(panelEl => {
      const pid = panelEl.dataset.id;

      // 편집 중엔 클릭해도 페이지 이동 안 되게
      panelEl.onclick = (e) => { if (editMode) e.preventDefault(); };

      if (editMode && !panelEl.querySelector(".swap-btn")) {
        const btn = document.createElement("button");
        btn.className = "swap-btn";
        btn.textContent = "커버 사진 교체";
        btn.style.cssText = `
          position: absolute; top: 12px; left: 12px; z-index: 10;
          background: #7D53FF; color: #fff; border: none; border-radius: 6px;
          padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
        `;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          triggerCoverSwap(panelEl, pid);
        });
        panelEl.appendChild(btn);
      }

      const titleEl = panelEl.querySelector(".panel-title");
      const tagEl = panelEl.querySelector(".panel-tagline");
      [
        { el: titleEl, key: "title-" + pid, colorKey: "titleColor-" + pid, pickerClass: "picker-title" },
        { el: tagEl, key: "tagline-" + pid, colorKey: "taglineColor-" + pid, pickerClass: "picker-tagline" }
      ].forEach(({ el, key, colorKey, pickerClass }) => {
        el.contentEditable = editMode;
        el.style.outline = editMode ? "1px dashed #DFFF3C" : "none";
        el.style.cursor = editMode ? "text" : "default";
        el.oninput = () => {
          changes[key] = el.textContent.trim();
          renderPanel();
        };
        attachColorPicker(el, colorKey, pickerClass, editMode);
        attachFontStepper(el, key + "FontSize", "stepper-" + key, editMode);
        attachWeightStepper(el, key + "FontWeight", "weight-" + key, editMode);
      });
    });

    // 헤더 텍스트(로고, 직함, 네비게이션) 편집
    const headerTargets = [
      { el: document.querySelector(".logo"), key: "logo", colorKey: "logoColor", pickerClass: "picker-logo" },
      { el: document.querySelector(".role"), key: "role", colorKey: "roleColor", pickerClass: "picker-role" },
      ...[...document.querySelectorAll(".site-nav a")].map((el, i) => ({ el, key: "nav-" + i, colorKey: "navColor-" + i, pickerClass: "picker-nav-" + i }))
    ];
    const logoBlockLink = document.querySelector(".logo-block");
    if (logoBlockLink) {
      if (editMode) {
        if (!logoBlockLink.dataset.origHref) logoBlockLink.dataset.origHref = logoBlockLink.getAttribute("href") || "";
        logoBlockLink.removeAttribute("href");
      } else if (logoBlockLink.dataset.origHref !== undefined) {
        logoBlockLink.setAttribute("href", logoBlockLink.dataset.origHref);
      }
    }

    headerTargets.forEach(({ el, key, colorKey, pickerClass }) => {
      if (!el) return;
      el.contentEditable = editMode;
      el.style.outline = editMode ? "1px dashed #DFFF3C" : "none";
      el.style.cursor = editMode ? "text" : "default";
      el.oninput = () => {
        changes[key] = el.textContent.trim();
        renderPanel();
      };
      if (editMode) {
        el.onclick = (e) => e.preventDefault();
      } else {
        el.onclick = null;
      }
      attachColorPicker(el, colorKey, pickerClass, editMode);
      attachFontStepper(el, key + "FontSize", "stepper-" + key, editMode);
      attachWeightStepper(el, key + "FontWeight", "weight-" + key, editMode);
    });

    panel.style.display = editMode && (Object.keys(changes).length || insertedCodes.length) ? "block" : "none";
  });

  function attachFontStepper(el, sizeKey, stepperClass, editMode) {
    let stepper = el.parentElement.querySelector("." + stepperClass);
    if (editMode) {
      if (!stepper) {
        stepper = document.createElement("div");
        stepper.className = stepperClass;
        stepper.style.cssText = `
          display: inline-flex; gap: 4px; margin-top: 4px; align-items: center;
        `;
        const minus = document.createElement("button");
        const plus = document.createElement("button");
        const label = document.createElement("span");
        [minus, plus].forEach(b => {
          b.style.cssText = `
            background: #7D53FF; color: #fff; border: none; border-radius: 4px;
            width: 18px; height: 18px; font-size: 11px; cursor: pointer; font-weight: 700;
            line-height: 1; padding: 0;
          `;
        });
        label.style.cssText = "font-size:9px; color:#9A9A94; font-family:ui-monospace,monospace;";
        minus.textContent = "−";
        plus.textContent = "+";

        function currentPx() {
          return parseInt(window.getComputedStyle(el).fontSize, 10);
        }
        function updateLabel() { label.textContent = currentPx() + "px"; }

        minus.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const size = Math.max(6, currentPx() - 1);
          el.style.fontSize = size + "px";
          changes[sizeKey] = size;
          updateLabel();
          renderPanel();
        });
        plus.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const size = currentPx() + 1;
          el.style.fontSize = size + "px";
          changes[sizeKey] = size;
          updateLabel();
          renderPanel();
        });

        stepper.appendChild(minus);
        stepper.appendChild(label);
        stepper.appendChild(plus);
        el.insertAdjacentElement("afterend", stepper);
        updateLabel();
      }
    } else if (stepper) {
      stepper.remove();
    }
  }

  function attachWeightStepper(el, weightKey, stepperClass, editMode) {
    let stepper = el.parentElement.querySelector("." + stepperClass);
    if (editMode) {
      if (!stepper) {
        stepper = document.createElement("div");
        stepper.className = stepperClass;
        stepper.style.cssText = `
          display: inline-flex; gap: 4px; margin-top: 4px; align-items: center;
        `;
        const minus = document.createElement("button");
        const plus = document.createElement("button");
        const label = document.createElement("span");
        [minus, plus].forEach(b => {
          b.style.cssText = `
            background: #DFFF3C; color: #14151A; border: none; border-radius: 4px;
            width: 18px; height: 18px; font-size: 11px; cursor: pointer; font-weight: 700;
            line-height: 1; padding: 0;
          `;
        });
        label.style.cssText = "font-size:9px; color:#9A9A94; font-family:ui-monospace,monospace;";
        minus.textContent = "−";
        plus.textContent = "+";

        function currentWeight() {
          const w = window.getComputedStyle(el).fontWeight;
          return Math.round(parseInt(w, 10) / 100) * 100 || 400;
        }
        function updateLabel() { label.textContent = "W" + currentWeight(); }

        minus.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const w = Math.max(100, currentWeight() - 100);
          el.style.fontWeight = w;
          changes[weightKey] = w;
          updateLabel();
          renderPanel();
        });
        plus.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const w = Math.min(900, currentWeight() + 100);
          el.style.fontWeight = w;
          changes[weightKey] = w;
          updateLabel();
          renderPanel();
        });

        stepper.appendChild(minus);
        stepper.appendChild(label);
        stepper.appendChild(plus);
        el.insertAdjacentElement("afterend", stepper);
        updateLabel();
      }
    } else if (stepper) {
      stepper.remove();
    }
  }

  function attachColorPicker(el, colorKey, pickerClass, editMode) {
    let picker = el.parentElement.querySelector("." + pickerClass);
    if (editMode) {
      if (!picker) {
        picker = document.createElement("input");
        picker.type = "color";
        picker.className = pickerClass;
        picker.value = rgbToHex(window.getComputedStyle(el).color);
        picker.style.cssText = `
          display: block; width: 22px; height: 22px; border: none; border-radius: 4px;
          cursor: pointer; margin: 6px auto 0; z-index: 20;
        `;
        picker.addEventListener("input", (e) => {
          e.stopPropagation();
          el.style.color = picker.value;
          changes[colorKey] = picker.value;
          renderPanel();
        });
        picker.addEventListener("click", (e) => e.stopPropagation());
        el.insertAdjacentElement("afterend", picker);
      }
    } else if (picker) {
      picker.remove();
    }
  }

  function rgbToHex(rgb) {
    const m = rgb.match(/\d+/g);
    if (!m) return "#ffffff";
    return "#" + m.slice(0, 3).map(x => (+x).toString(16).padStart(2, "0")).join("");
  }

  const insertedCodes = []; // [{ position, code }]

  function triggerInsertProject(position) {
    const name = prompt("새 프로젝트 이름을 입력하세요 (예: BMW Z-E):");
    if (!name) return;
    const tagline = prompt("태그라인(한 줄 설명)을 입력하세요:") || "";
    const key = ensureImgbbKeyHome();
    if (!key) return;

    const id = name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);

      fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.url) {
            // 화면에 즉시 미리보기 삽입
            const newPanel = document.createElement("a");
            newPanel.className = "project-panel";
            newPanel.href = "#";
            newPanel.dataset.id = id;
            newPanel.innerHTML = `
              <div class="panel-fill" style="background-image:url('${data.data.url}');background-size:cover;background-position:center;"></div>
              <div class="panel-overlay">
                <div class="panel-title">${name}</div>
                <div class="panel-tagline">${tagline}</div>
              </div>
            `;
            const btns = listEl.querySelectorAll(".insert-project-btn");
            btns[position].insertAdjacentElement("afterend", newPanel);

            const code = `{
    id: "${id}",
    name: "${name}",
    tagline: "${tagline}",
    cover: "${data.data.url}",
    images: [
      "${data.data.url}"
    ]
  },`;
            insertedCodes.push({ position, code });
            renderPanel();
            toggle.click();
            toggle.click();
          } else {
            alert("업로드 실패, 다시 시도해주세요.");
          }
        })
        .catch(() => alert("네트워크 오류, 다시 시도해주세요."));
    };
    input.click();
  }

  function triggerCoverSwap(panelEl, pid) {
    const key = ensureImgbbKeyHome();
    if (!key) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const btn = panelEl.querySelector(".swap-btn");
      btn.textContent = "업로드 중...";

      const formData = new FormData();
      formData.append("image", file);

      fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.url) {
            let fill = panelEl.querySelector(".panel-fill");
            const newFill = document.createElement("div");
            newFill.className = "panel-fill";
            newFill.style.cssText = `background-image:url('${data.data.url}');background-size:cover;background-position:center;`;
            fill.replaceWith(newFill);
            btn.textContent = "✓ 교체됨";
            changes["cover-" + pid] = data.data.url;
            renderPanel();
          } else {
            btn.textContent = "실패, 다시 시도";
          }
        })
        .catch(() => { btn.textContent = "실패, 다시 시도"; });
    };
    input.click();
  }

  function renderPanel() {
    panel.style.display = "block";
    const lines = Object.entries(changes).map(([key, val]) => {
      if (key === "panelAspectRatio") return `<div style="margin-bottom:8px; color:#DFFF3C;">css .project-panel aspect-ratio → ${val}</div>`;
      if (key === "panelGap") return `<div style="margin-bottom:8px; color:#DFFF3C;">css .project-panel margin-bottom → ${val}</div>`;
      if (key.endsWith("FontSize")) return `<div style="margin-bottom:8px; color:#7DD3FF;">[${key.replace("FontSize","")}] 폰트 크기 → ${val}px</div>`;
      if (key.endsWith("FontWeight")) return `<div style="margin-bottom:8px; color:#DFFF3C;">[${key.replace("FontWeight","")}] 폰트 굵기 → font-weight: ${val}</div>`;
      if (key === "logo") return `<div style="margin-bottom:8px; color:#7DD3FF;">로고 텍스트 → "${val}" (index.html/project.html/about.html의 .logo 부분 수동 반영)</div>`;
      if (key === "role") return `<div style="margin-bottom:8px; color:#7DD3FF;">직함 텍스트 → "${val}" (.role 부분)</div>`;
      if (key === "logoColor") return `<div style="margin-bottom:8px; color:${val};">로고 색상 → ${val} (css .logo color)</div>`;
      if (key === "roleColor") return `<div style="margin-bottom:8px; color:${val};">직함 색상 → ${val} (css .role color)</div>`;
      if (key.startsWith("navColor-")) return `<div style="margin-bottom:8px; color:${val};">네비 ${key.split("-")[1]}번째 색상 → ${val} (css .site-nav a color)</div>`;
      if (key.startsWith("nav-")) return `<div style="margin-bottom:8px; color:#7DD3FF;">네비 ${key.split("-")[1]}번째 → "${val}"</div>`;
      if (key.startsWith("titleColor-")) return `<div style="margin-bottom:8px; color:${val};">[${key.split("-")[1]}] 제목 색상 → ${val} (css .panel-title color)</div>`;
      if (key.startsWith("taglineColor-")) return `<div style="margin-bottom:8px; color:${val};">[${key.split("-")[1]}] 태그라인 색상 → ${val} (css .panel-tagline color)</div>`;
      const [type, pid] = key.split(/-(.+)/);
      if (type === "cover") return `<div style="margin-bottom:8px; color:#A8FFB0;">[${pid}] cover → "${val}"</div>`;
      if (type === "title") return `<div style="margin-bottom:8px; color:#FFD27D;">[${pid}] name → "${val}"</div>`;
      if (type === "tagline") return `<div style="margin-bottom:8px; color:#FFD27D;">[${pid}] tagline → "${val}"</div>`;
      return "";
    }).join("");
    panel.innerHTML = `<div style="color:#9A9A94; margin-bottom:10px; font-family:sans-serif;">아래 내용을 반영하세요:</div>` + lines +
      insertedCodes.map(c => `
        <div style="margin-top:14px; padding-top:10px; border-top:1px solid #33343C;">
          <div style="color:#DFFF3C; margin-bottom:6px; font-family:sans-serif;">PROJECTS 배열의 ${c.position}번째 자리에 이 코드 삽입:</div>
          <pre style="white-space:pre-wrap; background:#101116; padding:8px; border-radius:6px; color:#A8FFB0; font-size:10px;">${c.code}</pre>
        </div>
      `).join("");
  }
}

let homeEditModeInitialized = false;
function ensureHomeEditModeInit() {
  if (!homeEditModeInitialized) {
    initHomeEditMode();
    homeEditModeInitialized = true;
  }
}

if (homeParams.get("edit") === "juheon") {
  ensureHomeEditModeInit();
}

document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.altKey && (e.key === "a" || e.key === "A")) {
    const pw = prompt("편집 모드 비밀번호를 입력하세요:");
    if (pw === "0000") {
      ensureHomeEditModeInit();
      document.getElementById("edit-mode-toggle").click();
    } else if (pw !== null) {
      alert("비밀번호가 틀렸습니다.");
    }
  }
});
