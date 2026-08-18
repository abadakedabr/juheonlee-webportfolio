const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const project = PROJECTS.find(p => p.id === id) || PROJECTS[0];

document.getElementById("page-title").textContent = `${project.name} — Juheon Lee`;
document.getElementById("detail-name").textContent = project.name;
document.getElementById("detail-tagline").textContent = project.tagline;

const imgs = (project.images && project.images.length ? project.images : [project.cover]);

function isVideo(src) {
  return /\.(mp4|webm|mov)(\?.*)?$/i.test(src || "");
}

function getYouTubeId(src) {
  if (!src) return null;
  const m = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

const placeholderTokens = ["p1", "p2", "p3", "p4"];

document.getElementById("detail-images").innerHTML = imgs.map((src, idx) => {
  const ytId = getYouTubeId(src);
  if (ytId) {
    return `<div class="detail-img-frame clip-slide" data-idx="${idx}"><div class="clip-holder"><iframe src="https://www.youtube-nocookie.com/embed/${ytId}" title="video" frameborder="0" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div></div>`;
  }
  if (isVideo(src)) {
    return `<div class="detail-img-frame" data-idx="${idx}"><video src="${src}" autoplay muted loop playsinline controls></video></div>`;
  }
  if (!src || placeholderTokens.includes(src)) {
    return `<div class="project-panel" data-idx="${idx}"><div class="panel-fill ${src || project.cover}"></div></div>`;
  }
  return `<div class="detail-img-frame" data-idx="${idx}"><img src="${src.trim()}" loading="lazy"></div>`;
}).join("");

// 스크롤 리빌 애니메이션
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      // 이미 화면에 보이는 상태로 시작한 요소는, 브라우저가 초기(투명) 상태를
      // 한 번 그릴 시간을 준 뒤에 클래스를 붙여야 트랜지션이 스킵되지 않고 재생됨
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          target.classList.add("reveal-visible");
        });
      });
      revealObserver.unobserve(target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".detail-img-frame").forEach(el => revealObserver.observe(el));

// ===== 편집 모드: 이미지 교체 + 텍스트/폰트 크기 편집 =====
const changes = {}; // { key: value } — key: "image-0", "title", "tagline", "titleFontSize"

function ensureImgbbKey() {
  let key = localStorage.getItem("imgbb_key");
  if (!key) {
    key = prompt("imgbb API Key를 입력해주세요 (upload.html에서 쓴 것과 같은 키):");
    if (key) localStorage.setItem("imgbb_key", key.trim());
  }
  return key ? key.trim() : null;
}

function initEditMode() {
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
  const titleEl = document.getElementById("detail-name");
  const taglineEl = document.getElementById("detail-tagline");

  toggle.addEventListener("click", () => {
    editMode = !editMode;
    toggle.textContent = editMode ? "✕ 편집 모드 끄기" : "🔧 편집 모드";

    // 이미지 교체 버튼
    document.querySelectorAll(".detail-img-frame, .project-panel").forEach(frame => {
      frame.classList.toggle("edit-active", editMode);
      if (editMode && !frame.querySelector(".swap-btn")) {
        const btn = document.createElement("button");
        btn.className = "swap-btn";
        btn.textContent = "이미지 교체";
        btn.style.cssText = `
          position: absolute; top: 12px; left: 12px; z-index: 10;
          background: #7D53FF; color: #fff; border: none; border-radius: 6px;
          padding: 8px 14px; font-size: 12px; font-weight: 600; cursor: pointer;
        `;
        frame.style.position = "relative";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          triggerSwap(frame);
        });
        frame.appendChild(btn);
      }
    });

    // 이미지 사이사이에 "+" 삽입 버튼
    document.querySelectorAll(".insert-btn").forEach(b => b.remove());
    if (editMode) {
      const container = document.getElementById("detail-images");
      const frames = [...container.querySelectorAll(".detail-img-frame, .project-panel")];
      const positions = frames.length + 1; // 맨앞, 사이사이, 맨뒤
      for (let i = 0; i < positions; i++) {
        const insertBtn = document.createElement("button");
        insertBtn.className = "insert-btn";
        insertBtn.textContent = "+";
        insertBtn.title = "여기에 새 이미지 삽입";
        insertBtn.style.cssText = `
          display: flex; align-items: center; justify-content: center;
          width: 34px; height: 34px; border-radius: 50%; border: none;
          background: #7D53FF; color: #fff; font-size: 18px; font-weight: 700;
          cursor: pointer; margin: 10px auto; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        `;
        insertBtn.addEventListener("click", () => triggerInsert(i));
        if (i === 0) {
          container.insertBefore(insertBtn, container.firstChild);
        } else {
          frames[i - 1].insertAdjacentElement("afterend", insertBtn);
        }
      }
    }

    // 텍스트 편집 (제목/태그라인 직접 클릭해서 수정)
    [
      { el: titleEl, key: "title", colorKey: "titleColor", pickerClass: "picker-title" },
      { el: taglineEl, key: "tagline", colorKey: "taglineColor", pickerClass: "picker-tagline" }
    ].forEach(({ el, key, colorKey, pickerClass }) => {
      el.contentEditable = editMode;
      el.style.outline = editMode ? "1px dashed #7D53FF" : "none";
      el.style.cursor = editMode ? "text" : "default";
      el.oninput = () => {
        changes[key] = el.textContent.trim();
        renderPanel();
      };
      attachColorPicker(el, colorKey, pickerClass, editMode);
      attachFontStepper(el, key + "FontSize", "stepper-" + key, editMode);
      attachWeightStepper(el, key + "FontWeight", "weight-" + key, editMode);
    });

    panel.style.display = editMode && Object.keys(changes).length ? "block" : "none";
  });

  function attachFontStepper(el, sizeKey, stepperClass, editMode) {
    let stepper = el.parentElement.querySelector("." + stepperClass);
    if (editMode) {
      if (!stepper) {
        stepper = document.createElement("div");
        stepper.className = stepperClass;
        stepper.style.cssText = `
          display: inline-flex; gap: 6px; margin-top: 8px; align-items: center;
        `;
        const minus = document.createElement("button");
        const plus = document.createElement("button");
        const label = document.createElement("span");
        [minus, plus].forEach(b => {
          b.style.cssText = `
            background: #7D53FF; color: #fff; border: none; border-radius: 6px;
            width: 24px; height: 24px; font-size: 14px; cursor: pointer; font-weight: 700;
            line-height: 1; padding: 0;
          `;
        });
        label.style.cssText = "font-size:11px; color:#9A9A94; font-family:ui-monospace,monospace;";
        minus.textContent = "−";
        plus.textContent = "+";

        function currentPx() {
          return parseInt(window.getComputedStyle(el).fontSize, 10);
        }
        function updateLabel() { label.textContent = currentPx() + "px"; }

        minus.addEventListener("click", (e) => {
          e.stopPropagation();
          const size = Math.max(8, currentPx() - 2);
          el.style.fontSize = size + "px";
          changes[sizeKey] = size;
          updateLabel();
          renderPanel();
        });
        plus.addEventListener("click", (e) => {
          e.stopPropagation();
          const size = currentPx() + 2;
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
          display: inline-flex; gap: 6px; margin-top: 8px; align-items: center;
        `;
        const minus = document.createElement("button");
        const plus = document.createElement("button");
        const label = document.createElement("span");
        [minus, plus].forEach(b => {
          b.style.cssText = `
            background: #DFFF3C; color: #14151A; border: none; border-radius: 6px;
            width: 24px; height: 24px; font-size: 14px; cursor: pointer; font-weight: 700;
            line-height: 1; padding: 0;
          `;
        });
        label.style.cssText = "font-size:11px; color:#9A9A94; font-family:ui-monospace,monospace;";
        minus.textContent = "−";
        plus.textContent = "+";

        function currentWeight() {
          const w = window.getComputedStyle(el).fontWeight;
          return Math.round(parseInt(w, 10) / 100) * 100 || 400;
        }
        function updateLabel() { label.textContent = "W" + currentWeight(); }

        minus.addEventListener("click", (e) => {
          e.stopPropagation();
          const w = Math.max(100, currentWeight() - 100);
          el.style.fontWeight = w;
          changes[weightKey] = w;
          updateLabel();
          renderPanel();
        });
        plus.addEventListener("click", (e) => {
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

  function triggerInsert(position) {
    const key = ensureImgbbKey();
    if (!key) return;

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
            const container = document.getElementById("detail-images");
            const newFrame = document.createElement("div");
            newFrame.className = "detail-img-frame";
            newFrame.innerHTML = `<img src="${data.data.url}">`;

            const btns = container.querySelectorAll(".insert-btn");
            const targetBtn = btns[position];
            targetBtn.insertAdjacentElement("afterend", newFrame);

            changes["insertAt-" + position] = data.data.url;
            renderPanel();
            toggle.click(); // 편집모드 껐다 켜서 삽입버튼/스왑버튼 재정렬
            toggle.click();
          } else {
            alert("업로드 실패, 다시 시도해주세요.");
          }
        })
        .catch(() => alert("네트워크 오류, 다시 시도해주세요."));
    };
    input.click();
  }

  function triggerSwap(frame) {
    const key = ensureImgbbKey();
    if (!key) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const idx = frame.dataset.idx;
      const btn = frame.querySelector(".swap-btn");
      btn.textContent = "업로드 중...";

      const formData = new FormData();
      formData.append("image", file);

      fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data && data.data.url) {
            const media = frame.querySelector("img, video");
            if (media) media.src = data.data.url;
            if (!media) {
              const img = document.createElement("img");
              img.src = data.data.url;
              frame.innerHTML = "";
              frame.appendChild(img);
              frame.appendChild(btn);
            }
            btn.textContent = "✓ 교체됨";
            changes["image-" + idx] = data.data.url;
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
      if (key.startsWith("image-")) {
        return `<div style="margin-bottom:8px; color:#A8FFB0;">images[${key.split("-")[1]}] → "${val}"</div>`;
      }
      if (key.startsWith("insertAt-")) {
        return `<div style="margin-bottom:8px; color:#7DFFB0;">images 배열의 ${key.split("-")[1]}번째 자리에 새로 삽입 → "${val}"</div>`;
      }
      if (key === "title") return `<div style="margin-bottom:8px; color:#FFD27D;">name → "${val}"</div>`;
      if (key === "tagline") return `<div style="margin-bottom:8px; color:#FFD27D;">tagline → "${val}"</div>`;
      if (key.endsWith("FontSize")) return `<div style="margin-bottom:8px; color:#7DD3FF;">[${key.replace("FontSize","")}] 폰트 크기 → ${val}px</div>`;
      if (key.endsWith("FontWeight")) return `<div style="margin-bottom:8px; color:#DFFF3C;">[${key.replace("FontWeight","")}] 폰트 굵기 → font-weight: ${val}</div>`;
      if (key === "titleColor") return `<div style="margin-bottom:8px; color:${val};">css .detail-title color → ${val}</div>`;
      if (key === "taglineColor") return `<div style="margin-bottom:8px; color:${val};">css .detail-tagline color → ${val}</div>`;
      return "";
    }).join("");
    panel.innerHTML = `<div style="color:#9A9A94; margin-bottom:10px; font-family:sans-serif;">아래 내용을 data.js(또는 style.css)에 반영하세요:</div>` + lines;
  }
}

// 편집 모드는 본인만 아는 주소(?edit=juheon)로 들어오거나, Shift+Alt+A 단축키로 활성화됨
let projectEditModeInitialized = false;
function ensureProjectEditModeInit() {
  if (!projectEditModeInitialized) {
    initEditMode();
    projectEditModeInitialized = true;
  }
}

if (params.get("edit") === "juheon") {
  ensureProjectEditModeInit();
}

document.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.altKey && (e.key === "a" || e.key === "A")) {
    const pw = prompt("편집 모드 비밀번호를 입력하세요:");
    if (pw === "0000") {
      ensureProjectEditModeInit();
      document.getElementById("edit-mode-toggle").click();
    } else if (pw !== null) {
      alert("비밀번호가 틀렸습니다.");
    }
  }
});
