// RKH Store

const RKH_WHATSAPP = "201144587972";
const RKH_FACEBOOK = "https://www.facebook.com/share/1522eGSgJz7/";

const products = [
  {
    name: "Elegant Gold Necklace",
    category: "Stainless Steel",
    badge: "NEW",
    description: "A delicate stainless steel piece."
  },
  {
    name: "Pearl Hair Clip",
    category: "Hair Accessories",
    badge: "NEW",
    description: "A feminine everyday hair accessory."
  },
  {
    name: "Beauty Care Set",
    category: "Beauty Care",
    badge: "NEW",
    description: "Selected care essentials."
  },
  {
    name: "Everyday Makeup Set",
    category: "Makeup",
    badge: "POPULAR",
    description: "A simple set for your beauty routine."
  },
  {
    name: "Soft Makeup Brush Set",
    category: "Makeup Tools",
    badge: "NEW",
    description: "Practical tools for easy application."
  },
  {
    name: "Elegant Lingerie Set",
    category: "Lingerie",
    badge: "NEW",
    description: "A selected feminine essential."
  },
  {
    name: "Kitchen Organizer",
    category: "Kitchen Essentials",
    badge: "NEW",
    description: "A useful little addition for home."
  },
  {
    name: "Stainless Steel Bracelet",
    category: "Stainless Steel",
    badge: "POPULAR",
    description: "A clean, timeless accessory."
  }
];

const grid = document.getElementById("productGrid");
const activeFilter = document.getElementById("activeFilter");

function escapeHtml(text) {
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

function renderProducts(category = "", images = []) {
  const list = category
    ? products.filter(p => p.category === category)
    : products;

  activeFilter.textContent = category ? `Showing: ${category}` : "";

  grid.innerHTML = list.map((p, index) => {
    const image = images[index % images.length];

    return `
      <article class="product-card">
        <div class="product-image">
          ${
            image
              ? `<img src="${image}" alt="${escapeHtml(p.name)}" loading="lazy">`
              : `<div class="rkh-image-placeholder">RKH</div>`
          }
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
        </div>

        <div class="product-info">
          <h3>${escapeHtml(p.name)}</h3>
          <p>${escapeHtml(p.description)}</p>

          <button
            class="price-btn"
            data-product="${escapeHtml(p.name)}"
          >
            ASK FOR PRICE →
          </button>
        </div>
      </article>
    `;
  }).join("");
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

    const images = files
      .filter(file =>
        file.type === "file" &&
        /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name)
      )
      .map(file => file.download_url);

    renderProducts("", images);

    document.querySelectorAll("[data-category]").forEach(categoryCard => {
      categoryCard.addEventListener("click", () => {
        const category = categoryCard.dataset.category;
        renderProducts(category, images);
      });
    });

  } catch (error) {
    console.error(error);
    renderProducts("", []);
  }
}

function bindContactLinks() {
  document.querySelectorAll("[data-whatsapp]").forEach(a => {
    a.href = whatsappUrl("Hello RKH, I'd like to ask about your products.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  document.querySelectorAll("[data-facebook]").forEach(a => {
    a.href = RKH_FACEBOOK;
    a.target = "_blank";
    a.rel = "noopener";
  });
}

document.addEventListener("click", e => {
  const categoryCard = e.target.closest("[data-category]");

  if (categoryCard) {
    const category = categoryCard.dataset.category;
    loadImages().then(() => {});
  }

  const priceBtn = e.target.closest("[data-product]");

  if (priceBtn) {
    const product = priceBtn.dataset.product;
    window.open(
      whatsappUrl(`Hello RKH, I'd like to know the current price of "${product}".`),
      "_blank"
    );
  }
});

document.getElementById("resetFilter").addEventListener("click", () => {
  loadImages();
});

const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");

document.getElementById("menuBtn").addEventListener("click", () => {
  menu.classList.add("open");
  overlay.classList.add("show");
});

function closeMenu() {
  menu.classList.remove("open");
  overlay.classList.remove("show");
}

document.getElementById("closeMenu").addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);

document.querySelectorAll(".mobile-nav a").forEach(a => {
  a.addEventListener("click", closeMenu);
});

bindContactLinks();
loadImages();
