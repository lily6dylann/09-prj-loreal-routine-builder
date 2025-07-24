/* --- Product Data --- */
const products = [
  {
    id: 1,
    name: "Hydra Genius Moisturizer",
    brand: "L'Oréal Paris",
    category: "moisturizer",
    image:
      "https://www.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/products/skin-care/facial-moisturizers/bright-reveal-vitamin-c-glow-moisturizer/071249704233-t1-v2.png",
    description: "Lightweight moisturizer for daily hydration.",
  },
  {
    id: 2,
    name: "Revitalift Derm Intensives Glycolic Acid Cleanser",
    brand: "L'Oréal Paris",
    category: "cleanser",
    image:
      "https://www.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/products/skin-care/facial-cleansers/revitalift-derm-intensives-glycolic-acid-cleanser/071249419854_t1-new.png",
    description:
      "Glycolic acid cleanser for gentle exfoliation and brighter skin.",
  },
  {
    id: 3,
    name: "Elvive Glycolic Gloss Leave-In Serum",
    brand: "L'Oréal Paris",
    category: "haircare",
    image:
      "https://www.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/products/hair-care/hair-serum/elvive-glycolic-gloss-leave-in-serum/071249701553-t1.png",
    description:
      "A leave-in serum that helps resurface hair, boost shine, and protect against heat for glossy, healthy-looking hair.",
  },
  {
    id: 4,
    name: "Infallible Skin-ink Foundconcealer",
    brand: "L'Oréal Paris",
    category: "makeup",
    image:
      "https://www.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/products/makeup/face/foundation-makeup/infallible-skin-ink-foundconcealer/071249700495/071249700495_t1.png",
    description:
      "A longwear hybrid foundation-concealer that provides full coverage and a natural matte finish.",
  },
];

/* DOM Elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const generateRoutineBtn = document.getElementById("generateRoutine");
const selectedProductsList = document.getElementById("selectedProductsList");
const searchInput = document.createElement("input");

/* Search Input Setup */
searchInput.type = "text";
searchInput.id = "productSearch";
searchInput.placeholder = "Search products by name or keyword...";
searchInput.style.marginLeft = "16px";
searchInput.style.flex = "1";
searchInput.style.maxWidth = "320px";
document.querySelector(".search-section").appendChild(searchInput);

/* State Variables */
let selectedProductIds = [];
let currentCategory = "";
let currentSearch = "";

/* Render Products */
function renderProducts(productsToShow) {
  productsContainer.innerHTML = productsToShow
    .map(
      (product) => `
      <div class="product-card" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-info">
          <h3>${product.name}</h3>
          <p>${product.brand}</p>
          <div class="product-description">${product.description}</div>
        </div>
      </div>
    `
    )
    .join("");

  // Add click event to each product card
  document.querySelectorAll(".product-card").forEach((card) => {
    const productId = parseInt(card.dataset.id, 10);
    card.addEventListener("click", () => toggleProductSelection(productId));
  });
}

/* Handle Product Selection */
function toggleProductSelection(productId) {
  const index = selectedProductIds.indexOf(productId);
  if (index === -1) {
    selectedProductIds.push(productId);
  } else {
    selectedProductIds.splice(index, 1);
  }
  renderSelectedProducts();
}

/* Render Selected Products */
function renderSelectedProducts() {
  selectedProductsList.innerHTML = selectedProductIds
    .map((id) => {
      const product = products.find((p) => p.id === id);
      return `<div>${product.name}</div>`;
    })
    .join("");
}

/* Filter and Display Products */
function filterAndDisplayProducts() {
  let filtered = products;

  if (currentCategory) {
    filtered = filtered.filter(
      (product) => product.category === currentCategory
    );
  }

  if (currentSearch) {
    const keyword = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword)
    );
  }

  renderProducts(filtered);
}

/* Event Listeners */
categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  filterAndDisplayProducts();
});

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  filterAndDisplayProducts();
});

/* Generate Routine */
generateRoutineBtn.addEventListener("click", () => {
  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id)
  );

  if (selectedProducts.length === 0) {
    chatWindow.innerHTML =
      "<div class='placeholder-message'>Please select products to generate a routine.</div>";
    return;
  }

  const routineHTML = selectedProducts
    .map(
      (product, index) => `
        <div class='routine-step'>
          <h3>Step ${index + 1}: ${product.name}</h3>
          <p>${product.description}</p>
        </div>
      `
    )
    .join("");

  chatWindow.innerHTML = `
    <div class='routine-container'>
      <h2>Your Personalized Routine</h2>
      ${routineHTML}
    </div>
  `;
});

/* Initialize */
renderProducts(products);
