// RKH Store — replace the two values below with the real accounts.
const RKH_WHATSAPP = "201144587972"; // Example: 2010XXXXXXXX
const RKH_FACEBOOK = "https://www.facebook.com/share/1522eGSgJz7/";

const products = [
  {name:"Elegant Gold Necklace", category:"Stainless Steel", badge:"NEW", description:"A delicate stainless steel piece."},
  {name:"Pearl Hair Clip", category:"Hair Accessories", badge:"NEW", description:"A feminine everyday hair accessory."},
  {name:"Beauty Care Set", category:"Beauty Care", badge:"", description:"Selected care essentials."},
  {name:"Everyday Makeup Set", category:"Makeup", badge:"POPULAR", description:"A simple set for your beauty routine."},
  {name:"Soft Makeup Brush Set", category:"Makeup Tools", badge:"", description:"Practical tools for easy application."},
  {name:"Elegant Lingerie Set", category:"Lingerie", badge:"NEW", description:"A selected feminine essential."},
  {name:"Kitchen Organizer", category:"Kitchen Essentials", badge:"", description:"A useful little addition for home."},
  {name:"Stainless Steel Bracelet", category:"Stainless Steel", badge:"POPULAR", description:"A clean, timeless accessory."}
];

const grid = document.getElementById("productGrid");
const activeFilter = document.getElementById("activeFilter");

function renderProducts(category = "") {
  const list = category ? products.filter(p => p.category === category) : products;
  activeFilter.textContent = category ? `Showing: ${category}` : "";
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ""}
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <button class="price-btn" data-product="${escapeHtml(p.name)}">ASK FOR PRICE →</button>
      </div>
    </article>
  `).join("");
}

function escapeHtml(text){
  return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

function whatsappUrl(message){
  return `https://wa.me/${RKH_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

function bindContactLinks(){
  document.querySelectorAll("[data-whatsapp]").forEach(a => {
    a.href = whatsappUrl("Hello RKH, I’d like to ask about your products.");
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
  if(categoryCard){
    renderProducts(categoryCard.dataset.category);
  }
  const priceBtn = e.target.closest("[data-product]");
  if(priceBtn){
    const product = priceBtn.dataset.product;
    window.open(whatsappUrl(`Hello RKH, I’d like to know the current price of "${product}".`), "_blank");
  }
});

document.getElementById("resetFilter").addEventListener("click", () => renderProducts());

const menu = document.getElementById("mobileMenu");
const overlay = document.getElementById("menuOverlay");
document.getElementById("menuBtn").addEventListener("click", () => {menu.classList.add("open");overlay.classList.add("show");});
document.getElementById("closeMenu").addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);
document.querySelectorAll(".mobile-menu a").forEach(a => a.addEventListener("click", closeMenu));
function closeMenu(){menu.classList.remove("open");overlay.classList.remove("show");}

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
bindContactLinks();
