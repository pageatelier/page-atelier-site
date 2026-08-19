const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

function updateHeader() {
  if (!header?.classList.contains("menu-open")) {
    header?.classList.toggle("scrolled", window.scrollY > 80);
  }
}

function setMenu(open) {
  if (!header || !toggle) return;

  header.classList.toggle("menu-open", open);
  document.body.classList.toggle("menu-lock", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");

  if (!open) updateHeader();
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


// =========================================================
// PAYMENT READY + POST-PAYMENT BRIEF
// Toss Payments is connected in the next step.
// =========================================================
const checkoutLinks = document.querySelectorAll("[data-checkout]");
const briefOverlay = document.querySelector("[data-brief-overlay]");
const briefForm = document.querySelector("[data-brief-form]");
const briefDone = document.querySelector("[data-brief-done]");
const briefProduct = document.querySelector("[data-brief-product]");
const briefOrder = document.querySelector("[data-brief-order]");

const PRODUCTS = {
  START: { name: "START · 실속형 랜딩페이지", amount: 390000 },
  STANDARD: { name: "STANDARD · 브랜드 랜딩페이지", amount: 590000 }
};

function openBrief({ orderId = "", product = "", amount = "" } = {}) {
  if (!briefOverlay) return;

  const productKey = String(product || "").toUpperCase();
  const productData = PRODUCTS[productKey];

  briefOverlay.classList.add("is-open");
  briefOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("brief-lock");

  const orderIdInput = briefOverlay.querySelector("[data-order-id]");
  const productInput = briefOverlay.querySelector("[data-order-product]");
  const amountInput = briefOverlay.querySelector("[data-order-amount]");

  if (orderIdInput) orderIdInput.value = orderId;
  if (productInput) productInput.value = productKey;
  if (amountInput) amountInput.value = amount || productData?.amount || "";

  if (briefProduct) briefProduct.textContent = productData?.name || "랜딩페이지 제작";
  if (briefOrder) briefOrder.textContent = orderId ? `ORDER ID ${orderId}` : "ORDER ID —";

  briefForm?.removeAttribute("hidden");
  if (briefDone) briefDone.hidden = true;
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

checkoutLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const product = link.dataset.product;
    const amount = Number(link.dataset.amount || 0);

    // NEXT STEP:
    // Replace this notice with Toss Payments requestPayment().
    // successUrl should return to this page with payment=success,
    // orderId, product and amount query parameters.
    window.dispatchEvent(new CustomEvent("pageatelier:checkout", {
      detail: { product, amount }
    }));

    alert(`${product} (${amount.toLocaleString("ko-KR")}원) 결제 버튼 준비 완료! 다음 단계에서 토스 결제창을 연결하면 됩니다.`);
  });
});

const params = new URLSearchParams(window.location.search);
const paymentStatus = params.get("payment");

// Toss successUrl target example:
// /?payment=success&orderId=ORDER_ID&product=START&amount=390000
if (paymentStatus === "success" || params.get("brief") === "demo") {
  openBrief({
    orderId: params.get("orderId") || (params.get("brief") === "demo" ? "DEMO-20260819" : ""),
    product: params.get("product") || "START",
    amount: params.get("amount") || ""
  });
}

briefForm?.addEventListener("submit", (event) => {
  event.preventDefault();

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
  const draft = {};

  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      if (!value.name) continue;
      if (!draft.files) draft.files = [];
      draft.files.push({ name: value.name, size: value.size, type: value.type });
    } else if (draft[key]) {
      draft[key] = Array.isArray(draft[key]) ? [...draft[key], value] : [draft[key], value];
    } else {
      draft[key] = value;
    }
  }

  try {
    localStorage.setItem("pageatelier_project_brief_draft", JSON.stringify({
      ...draft,
      saved_at: new Date().toISOString()
    }));
  } catch (error) {
    console.warn("Could not save brief draft locally.", error);
  }

  // NEXT STEP:
  // Send FormData to your server/Supabase after the backend is connected.
  briefForm.hidden = true;
  if (briefDone) briefDone.hidden = false;
  briefOverlay?.scrollTo({ top: 0, behavior: "smooth" });
});
