// RKH Store - Continuous All Products Grid

const RKH_WHATSAPP = "201144587972";
const RKH_FACEBOOK = "https://www.facebook.com/share/1522eGSgJz7/";

const grid = document.getElementById("productGrid");
const activeFilter = document.getElementById("activeFilter");

function escapeHtml(text) {
  if (!text) return "";
  return text.replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

function whatsappUrl(message) {
  return `https://wa.me/${RKH_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function detectCategory(filename) {
  const name = filename.toLowerCase();
  if (name.includes("steel") || name.includes("stainless") || name.includes("acc")) return "Stainless Steel";
  if (name.includes("hair") || name.includes("clip") || name.includes("tok")) return "Hair Accessories";
  if (name.includes("beauty") || name.includes("care") || name.includes("skin")) return "Beauty Care";
  if (name.includes("makeup_tool") || name.includes("brush")) return "Makeup Tools";
  if (name.includes("makeup")) return "Makeup";
  if (name.includes("lingerie") || name.includes("night")) return "Lingerie";
  if (name.includes("kitchen") || name.includes("matbakh") || name.includes("cup") || name.includes("set")) return "Kitchen Essentials";
  return "تشكيلة راقية";
}

function formatProductName(filename, index) {
  const cleanName = filename.replace(/\.(jpg|jpeg|png|webp|gif)$/i, "").replace(/[-_]/g, " ");
  if (cleanName.toLowerCase().startsWith("img")) {
    return `منتج RKH #${index + 1}`;
  }
  return cleanName;
}

let allProducts = [];

// عرض جميع المنتجات متتالية دون فلترة
function renderProducts() {
  if (!grid) return;

  if (activeFilter) {
    activeFilter.style.display = "none";
  }

  if (allProducts.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">لا توجد منتجات حالياً</div>`;
    return;
  }

  grid.innerHTML = allProducts.map(p => `
    <article class="product-card">
      <div class="product-image" style="width: 100%; height: 320px; overflow: hidden; position: relative; margin: 0; padding: 0; background: #f0f0f0;">
        <img src="${p.imageUrl}" alt="${escapeHtml(p.name)}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
      </div>

      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p style="font-weight: 500; color: #888;">القسم: ${escapeHtml(p.category)}</p>

        <button
          class="price-btn"
          data-product="${escapeHtml(p.name)}"
        >
          ASK FOR PRICE →
        </button>
      </div>
    </article>
  `).join("");
}

async function loadImages() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/ali01141091027-del/rkh-store/contents/?ref=main&per_page=100"
    );

    if (!response.ok) {
      throw new Error("Could not load GitHub images.");
    }

    const files = await response.json();

    const imageFiles = files.filter(file =>
      file.type === "file" &&
      /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
    );

    allProducts = imageFiles.map((file, idx) => ({
      id: file.name,
      name: formatProductName(file.name, idx),
      category: detectCategory(file.name),
      imageUrl: file.download_url,
      badge: idx < 3 ? "NEW" : ""
    }));

    renderProducts();

  } catch (error) {
    console.error("Error loading images:", error);
    if (grid) {
      grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 20px;">تعذر تحميل الصور، يرجى المحاولة لاحقاً.</div>`;
    }
  }
}

function bindContactLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(a => {
    a.href = whatsappUrl("مرحباً RKH Store، أود الاستفسار عن المنتجات.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  document.querySelectorAll("[data-facebook]").forEach(a => {
    a.href = RKH_FACEBOOK;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

// فتح الواتساب عند طلب السعر
document.addEventListener("click", e => {
  const priceBtn = e.target.closest("[data-product]");

  if (priceBtn) {
    const product = priceBtn.dataset.product;
    window.open(
      whatsappUrl(`مرحباً RKH Store، أود معرفة سعر المنتج: "${product}"`),
      "_blank"
    );
  }
});

const resetBtn = document.getElementById("resetFilter");
if (resetBtn) {
  resetBtn.style.display = "none";
}

// قائمة الموبايل
const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

const menuBtn = document.getElementById("menuBtn");
if (menuBtn && menu && overlay) {
  menuBtn.addEventListener("click", () => {
    menu.classList.add("open");
    overlay.classList.add("show");
  });
}

function closeMenu() {
  if (menu && overlay) {
    menu.classList.remove("open");
    overlay.classList.remove("show");
  }
}

const closeMenuBtn = document.getElementById("closeMenu");
if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
if (overlay) overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-nav a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

bindContactLinks();
loadImages();
