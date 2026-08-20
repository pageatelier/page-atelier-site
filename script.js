const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function updateHeader() {
  if (!header?.classList.contains("menu-open")) {
    header?.classList.toggle("scrolled", window.scrollY > 80);
  }
}

let menuLockScrollY = 0;

function setMenu(open) {
  if (!header || !toggle) return;

  header.classList.toggle("menu-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");

  // overflow:hidden alone doesn't stop iOS Safari's rubber-band scroll —
  // pinning the body with position:fixed at its current scroll offset does.
  if (open) {
    menuLockScrollY = window.scrollY;
    document.body.style.top = `-${menuLockScrollY}px`;
    document.body.classList.add("menu-lock");
  } else {
    document.body.classList.remove("menu-lock");
    document.body.style.top = "";
    // Setting scrollTop directly is always instant, unlike scrollTo(), which
    // some mobile browsers still animate even when behavior:"auto" is passed.
    document.documentElement.scrollTop = menuLockScrollY;
    document.body.scrollTop = menuLockScrollY;
    updateHeader();
  }
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

toggle?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  setMenu(!header.classList.contains("menu-open"));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.querySelector(".wordmark")?.addEventListener("click", () => {
  if (header?.classList.contains("menu-open")) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && header?.classList.contains("menu-open")) {
    setMenu(false);
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });

  revealItems.forEach((el) => io.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

// Show the Kakao floating button only once the visitor has scrolled past
// the hero (which already has its own CTA, and short viewports in in-app
// browsers can reveal the next section right under the fold, so showing
// the floating button there just overlaps it), hide it again while the
// final CTA section is in view (it has its own buttons — the floating one
// just sits on top of its headline/buttons), and hide it once the footer
// scrolls into view so it doesn't sit on top of the footer content.
const kakaoFloat = document.querySelector(".kakao-float");
const hero = document.querySelector(".hero");
const finalCta = document.querySelector(".final");
const footer = document.querySelector(".footer");

if (kakaoFloat && "IntersectionObserver" in window) {
  const state = { inHero: true, inFinal: false, inFooter: false };

  const applyKakaoVisibility = () => {
    kakaoFloat.classList.toggle("is-hidden", state.inHero || state.inFinal || state.inFooter);
  };

  if (hero) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.inHero = entry.isIntersecting;
        applyKakaoVisibility();
      });
    }, { threshold: 0, rootMargin: "0px 0px -20% 0px" }).observe(hero);
  } else {
    state.inHero = false;
  }

  if (finalCta) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.inFinal = entry.isIntersecting;
        applyKakaoVisibility();
      });
    }, { threshold: 0.15 }).observe(finalCta);
  }

  if (footer) {
    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        state.inFooter = entry.isIntersecting;
        applyKakaoVisibility();
      });
    }, { threshold: 0, rootMargin: "0px 0px -10% 0px" }).observe(footer);
  }

  applyKakaoVisibility();
}


// =========================================================
// FREE PREVIEW REQUEST
// =========================================================
const previewLinks = document.querySelectorAll("[data-preview]");
const briefOverlay = document.querySelector("[data-brief-overlay]");
const briefForm = document.querySelector("[data-brief-form]");
const briefDone = document.querySelector("[data-brief-done]");
const briefProduct = document.querySelector("[data-brief-product]");
const productSelect = document.querySelector("[data-product-select]");
const introKicker = document.querySelector("[data-brief-intro-kicker]");
const introTitle = document.querySelector("[data-brief-intro-title]");
const introLead = document.querySelector("[data-brief-intro-lead]");
const introHelp = document.querySelector("[data-brief-intro-help]");

const INTRO_DEFAULT = {
  kicker: "FREE PREVIEW REQUEST",
  title: "무료 시안 <br>신청하기",
  lead: "브랜드를 확인할 수 있는 링크만 남겨주세요. <br>자료가 많지 않아도 괜찮아요."
};

function setIntroDone(done) {
  if (introKicker) introKicker.textContent = done ? "REQUEST RECEIVED" : INTRO_DEFAULT.kicker;
  if (introTitle) introTitle.innerHTML = done ? "THANK <br>YOU." : INTRO_DEFAULT.title;
  if (introLead) introLead.innerHTML = done
    ? "신청해주셔서 감사합니다."
    : INTRO_DEFAULT.lead;
  if (introHelp) introHelp.hidden = done;
}

const PRODUCTS = {
  START: "START · 39만원",
  STANDARD: "STANDARD · 59만원",
  UNSURE: "아직 잘 모르겠어요 · 추천받기"
};

function updatePreviewProduct(product = "") {
  const key = String(product || "").toUpperCase();
  if (productSelect) productSelect.value = PRODUCTS[key] ? key : "";
  if (briefProduct) {
    briefProduct.textContent = PRODUCTS[key] || "아직 정하지 않아도 괜찮아요";
  }
}

function openBrief({ product = "" } = {}) {
  if (!briefOverlay) return;

  updatePreviewProduct(product);
  briefOverlay.classList.add("is-open");
  briefOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("brief-lock");

  briefForm?.removeAttribute("hidden");
  if (briefDone) briefDone.hidden = true;
  setIntroDone(false);
  briefOverlay.scrollTop = 0;
}

function closeBrief() {
  if (!briefOverlay) return;
  briefOverlay.classList.remove("is-open");
  briefOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("brief-lock");
}

document.querySelectorAll("[data-brief-close]").forEach((button) => {
  button.addEventListener("click", closeBrief);
});

previewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openBrief({ product: link.dataset.product || "" });
  });
});

productSelect?.addEventListener("change", () => {
  updatePreviewProduct(productSelect.value);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && briefOverlay?.classList.contains("is-open")) {
    closeBrief();
  }
});

const params = new URLSearchParams(window.location.search);
if (params.get("preview") === "demo") {
  openBrief({ product: params.get("product") || "START" });
} else if (window.location.hash === "#preview") {
  // Someone opened a "무료 시안 받아보기" link in a new tab / visited the
  // href directly, bypassing the click handler below. #preview is the
  // brief overlay's own id (position:fixed, display:none until opened),
  // so without this the browser just scrolls to a hidden element and the
  // page looks blank. Open it the same way a real click would.
  openBrief({});
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

// Safety net: if anything ever links to #preview without the click handler
// above catching it (missing data-preview, browser back/forward, etc.),
// opening #preview via a same-page hash change doesn't reload the page —
// so the load-time check above won't see it. Watch for it directly instead.
window.addEventListener("hashchange", () => {
  if (window.location.hash === "#preview") {
    openBrief({});
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }
});

briefForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const status = document.querySelector("[data-brief-status]");
  const submitButton = briefForm.querySelector(".brief-submit");

  briefForm.querySelectorAll(".field.is-invalid").forEach((field) => field.classList.remove("is-invalid"));

  if (!briefForm.checkValidity()) {
    [...briefForm.elements].forEach((el) => {
      if (el instanceof HTMLElement && "checkValidity" in el && !el.checkValidity()) {
        el.closest(".field")?.classList.add("is-invalid");
      }
    });
    briefForm.reportValidity();
    return;
  }

  const formData = new FormData(briefForm);

  // Web3Forms 메일에서 읽기 쉽도록 선택값을 한글로 보냅니다.
  const productLabels = {
    START: "START · 39만원",
    STANDARD: "STANDARD · 59만원",
    UNSURE: "잘 모르겠어요 · 추천받기"
  };
  const goalLabels = {
    inquiry: "문의·상담 늘리기",
    booking: "예약 늘리기",
    branding: "브랜드 이미지 개선",
    information: "서비스 정보 정리",
    renewal: "기존 홈페이지 리뉴얼",
    other: "기타"
  };

  const productValue = formData.get("product");
  const goalValue = formData.get("goal");
  if (productValue && productLabels[productValue]) formData.set("관심 패키지", productLabels[productValue]);
  if (goalValue && goalLabels[goalValue]) formData.set("원하는 결과", goalLabels[goalValue]);

  // 영문 내부 필드와 별개로 메일에서 바로 읽을 수 있는 한글 항목도 추가합니다.
  formData.set("브랜드명", formData.get("brand_name") || "");
  formData.set("담당자 이름", formData.get("customer_name") || "");
  formData.set("휴대폰 번호", formData.get("phone") || "");
  formData.set("이메일", formData.get("email") || "미입력");
  formData.set("인스타그램", formData.get("instagram") || "미입력");
  formData.set("네이버 블로그", formData.get("blog") || "미입력");
  formData.set("네이버 플레이스", formData.get("naver_place") || "미입력");
  formData.set("기존 홈페이지", formData.get("website") || "미입력");
  formData.set("추가 요청", formData.get("message") || "없음");

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.dataset.originalText = submitButton.innerHTML;
    submitButton.innerHTML = "전송 중입니다…";
  }
  if (status) status.textContent = "신청 내용을 안전하게 전송하고 있어요.";

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });
    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Web3Forms submission failed");
    }

    try {
      localStorage.setItem("pageatelier_free_preview_draft", JSON.stringify({
        brand_name: formData.get("brand_name"),
        customer_name: formData.get("customer_name"),
        phone: formData.get("phone"),
        product: formData.get("product"),
        submitted_at: new Date().toISOString()
      }));
    } catch (error) {
      console.warn("Could not save submission locally.", error);
    }

    briefForm.reset();
    updatePreviewProduct("");
    briefForm.hidden = true;
    if (briefDone) briefDone.hidden = false;
    setIntroDone(true);
    briefOverlay?.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Web3Forms submission error:", error);
    if (status) status.textContent = "전송 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = submitButton.dataset.originalText || "무료 시안 신청하기 <span>↗</span>";
    }
  }
});
