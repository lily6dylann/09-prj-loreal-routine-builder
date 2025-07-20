/* --- Product Data --- */
// This array is used by your app!
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
  // Add more products here!
];

/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
// async function loadProducts() {
//   const response = await fetch("products.json");
//   const products = [
//     {
//       id: 1,
//       name: "Hydra Genius Moisturizer",
//       brand: "L'Oréal Paris",
//       category: "moisturizer",
//       // Updated to a working L'Oréal moisturizer image
//       image:
//         "https://www.lorealparisusa.com/-/media/project/loreal/brand-sites/oap/americas/us/products/skin-care/facial-moisturizers/bright-reveal-vitamin-c-glow-moisturizer/071249704233-t1-v2.png",
//       description: "Lightweight moisturizer for daily hydration.",
//     },
//     // ...more products
//   ];
//   const data = await response.json();
//   return data.products;
// }

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" width="80" height="80"/>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.brand}</p>
        <div class="product-description">${product.description}</div>
      </div>
    </div>
  `
    )
    .join("");
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Chat form submission handler - placeholder for OpenAI integration */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  chatWindow.innerHTML = "Connect to the OpenAI API for a response!";
});

/* This script lets users select/unselect products by clicking cards,
// visually marks selected cards, and updates the "Selected Products" section. */

// Store selected product IDs
let selectedProductIds = [];

// Store currently visible description overlay
let openDescriptionId = null;

// Render all products in the grid
function renderProducts() {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <button class="info-btn" aria-label="Show description for ${
          product.name
        }">More Info</button>
      </div>
      <div class="product-desc-overlay${
        openDescriptionId === product.id ? " show" : ""
      }">
        <div class="desc-content">
          <p>${product.description}</p>
          <button class="close-desc-btn" aria-label="Close description">&times;</button>
        </div>
      </div>
    `
    )
    .join("");

  products.forEach((product) => {
    const card = document.querySelector(
      `.product-card[data-id="${product.id}"]`
    );

    // Highlight if selected
    if (selectedProductIds.includes(product.id)) {
      card.classList.add("selected");
    }

    // Click to select/unselect (but not when clicking info or overlay)
    card.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("info-btn") ||
        e.target.classList.contains("close-desc-btn") ||
        e.target.closest(".product-desc-overlay")
      ) {
        return;
      }
      toggleProductSelection(product.id);
    });

    // Show description overlay
    card.querySelector(".info-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openDescriptionId = product.id;
      renderProducts();
    });

    // Close overlay with close button
    card.querySelector(".close-desc-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openDescriptionId = null;
      renderProducts();
    });

    // Close overlay by clicking outside the content
    card
      .querySelector(".product-desc-overlay")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("product-desc-overlay")) {
          openDescriptionId = null;
          renderProducts();
        }
      });
  });
}

// Add a search field for product name/keyword search
// 1. Create the search input and insert it above the products grid
const searchSection = document.querySelector(".search-section");
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.id = "productSearch";
searchInput.placeholder = "Search products by name or keyword...";
searchInput.style.marginLeft = "16px";
searchInput.style.flex = "1";
searchInput.style.maxWidth = "320px";
searchSection.appendChild(searchInput);

// 2. Store the current search and category filter values
let currentCategory = "";
let currentSearch = "";

// 3. Load products from JSON (or use your products array if not using JSON)
let allProducts = products; // fallback if not using async load

// 4. Update the filter and search logic
async function filterAndDisplayProducts() {
  // If using async loading, uncomment below:
  // allProducts = await loadProducts();

  let filtered = allProducts;

  // Filter by category if selected
  if (currentCategory) {
    filtered = filtered.filter(
      (product) => product.category === currentCategory
    );
  }

  // Filter by search keyword if entered
  if (currentSearch) {
    const keyword = currentSearch.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        (product.description &&
          product.description.toLowerCase().includes(keyword)) ||
        (product.brand && product.brand.toLowerCase().includes(keyword))
    );
  }

  renderProductsGrid(filtered);
}

// 5. Render products grid with selection and overlays
function renderProductsGrid(productsToShow) {
  productsContainer.innerHTML = "";
  productsToShow.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.dataset.id = product.id;

    if (selectedProductIds.includes(product.id)) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-info">
        <h3>${product.name}</h3>
        <button class="info-btn" aria-label="Show description for ${
          product.name
        }">More Info</button>
      </div>
      <div class="product-desc-overlay${
        openDescriptionId === product.id ? " show" : ""
      }">
        <div class="desc-content">
          <p>${product.description}</p>
          <button class="close-desc-btn" aria-label="Close description">&times;</button>
        </div>
      </div>
    `;

    card.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("info-btn") ||
        e.target.classList.contains("close-desc-btn") ||
        e.target.closest(".product-desc-overlay")
      ) {
        return;
      }
      toggleProductSelection(product.id);
    });

    card.querySelector(".info-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openDescriptionId = product.id;
      filterAndDisplayProducts();
    });

    card.querySelector(".close-desc-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openDescriptionId = null;
      filterAndDisplayProducts();
    });

    card
      .querySelector(".product-desc-overlay")
      .addEventListener("click", (e) => {
        if (e.target.classList.contains("product-desc-overlay")) {
          openDescriptionId = null;
          filterAndDisplayProducts();
        }
      });

    productsContainer.appendChild(card);
  });

  // If no products match, show a message
  if (productsToShow.length === 0) {
    productsContainer.innerHTML = `
      <div class="placeholder-message">No products found. Try a different search or category.</div>
    `;
  }
}

// 6. Update event listeners for filters and search
categoryFilter.addEventListener("change", (e) => {
  currentCategory = e.target.value;
  filterAndDisplayProducts();
});

searchInput.addEventListener("input", (e) => {
  currentSearch = e.target.value;
  filterAndDisplayProducts();
});

// 7. On page load, show all products
filterAndDisplayProducts();

// Store selected product IDs in localStorage so they persist across reloads
function saveSelectedProducts() {
  localStorage.setItem(
    "selectedProductIds",
    JSON.stringify(selectedProductIds)
  );
}

// Load selected product IDs from localStorage
function loadSelectedProducts() {
  const saved = localStorage.getItem("selectedProductIds");
  if (saved) {
    try {
      selectedProductIds = JSON.parse(saved);
    } catch {
      selectedProductIds = [];
    }
  }
}

// Update renderSelectedProducts to allow removing individual items and clearing all
function renderSelectedProducts() {
  selectedProductsList.innerHTML = "";

  // If there are selected products, show them
  if (selectedProductIds.length > 0) {
    selectedProductIds.forEach((id) => {
      const product = products.find((p) => p.id === id);
      if (product) {
        const item = document.createElement("div");
        item.className = "selected-product-item";
        item.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <span>${product.name}</span>
          <button class="remove-btn" title="Remove">&times;</button>
        `;
        // Remove button for this product
        item.querySelector(".remove-btn").addEventListener("click", () => {
          toggleProductSelection(product.id);
        });
        selectedProductsList.appendChild(item);
      }
    });

    // Add a "Clear All" button
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear All";
    clearBtn.className = "generate-btn";
    clearBtn.style.marginLeft = "16px";
    clearBtn.addEventListener("click", () => {
      selectedProductIds = [];
      saveSelectedProducts();
      renderProducts();
      renderSelectedProducts();
    });
    selectedProductsList.appendChild(clearBtn);
  }
}

// Toggle selection of a product
function toggleProductSelection(productId) {
  const index = selectedProductIds.indexOf(productId);
  if (index === -1) {
    selectedProductIds.push(productId);
  } else {
    selectedProductIds.splice(index, 1);
  }
  saveSelectedProducts();
  renderProducts();
  renderSelectedProducts();
}

// Get reference to the "Generate Routine" button and selected products list
const generateRoutineBtn = document.getElementById("generateRoutine");
const selectedProductsList = document.getElementById("selectedProductsList");

// Update the system prompt to instruct the AI to use web search for current info
let chatHistory = [
  {
    role: "system",
    content:
      "You are a helpful skincare and beauty advisor. Use web search to provide current information about L'Oréal products, routines, and beauty topics. Include links or citations if available. Only answer questions about the generated routine, skincare, haircare, makeup, fragrance, or related beauty topics. If asked about anything else, politely say you can only answer beauty-related questions.",
  },
];

// When the "Generate Routine" button is clicked
generateRoutineBtn.addEventListener("click", async () => {
  // Find the selected products by their IDs
  const selectedProducts = products.filter((product) =>
    selectedProductIds.includes(product.id)
  );

  // If no products are selected, show a message and stop
  if (selectedProducts.length === 0) {
    chatWindow.innerHTML = `<div class="placeholder-message">Please select at least one product to generate a routine.</div>`;
    return;
  }

  // Add the user's request to the chat history
  chatHistory = [
    chatHistory[0], // system prompt
    {
      role: "user",
      content: `Here are the selected products:\n${JSON.stringify(
        selectedProducts,
        null,
        2
      )}\nPlease generate a routine using these products.`,
    },
  ];

  // Show a loading message in the chat window
  chatWindow.innerHTML = `<div class="placeholder-message">Generating your routine...</div>`;

  try {
    // Call the OpenAI API using fetch and async/await
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai_api_key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: chatHistory,
        max_tokens: 400,
      }),
    });

    const data = await response.json();

    // Check if the API returned a valid response
    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      // Add the assistant's reply to the chat history
      chatHistory.push({
        role: "assistant",
        content: data.choices[0].message.content,
      });

      // Display the AI-generated routine in the chat window
      chatWindow.innerHTML = `<div class="ai-message">${data.choices[0].message.content.replace(
        /\n/g,
        "<br>"
      )}</div>`;
    } else {
      chatWindow.innerHTML = `<div class="placeholder-message">Sorry, I couldn't generate a routine. Please try again.</div>`;
    }
  } catch (error) {
    chatWindow.innerHTML = `<div class="placeholder-message">Error: Could not connect to OpenAI API.</div>`;
  }
});

// Handle follow-up chat questions
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's question from the input field
  const userInput = document.getElementById("userInput").value.trim();
  if (!userInput) return;

  // Add the user's question to the chat history
  chatHistory.push({
    role: "user",
    content: userInput,
  });

  // Show the user's message and a loading message
  chatWindow.innerHTML = `
    <div class="user-message">${userInput}</div>
    <div class="placeholder-message">Thinking...</div>
  `;

  try {
    // If using OpenAI's web-enabled model via Cloudflare Worker, update the endpoint:
    // Example: const response = await fetch("https://your-worker-url.workers.dev", { ... });
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openai_api_key}`,
      },
      body: JSON.stringify({
        model: "gpt-4o", // Use a web-enabled model or your worker endpoint
        messages: chatHistory,
        max_tokens: 400,
        // If using a worker, you may need to add a "tools": ["web_search"] or similar parameter
      }),
    });

    const data = await response.json();

    // Check if the API returned a valid response
    if (
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
    ) {
      // Add the assistant's reply to the chat history
      chatHistory.push({
        role: "assistant",
        content: data.choices[0].message.content,
      });

      // Display the conversation (user + assistant)
      chatWindow.innerHTML = `
        <div class="user-message">${userInput}</div>
        <div class="ai-message">${data.choices[0].message.content.replace(
          /\n/g,
          "<br>"
        )}</div>
      `;
    } else {
      chatWindow.innerHTML = `<div class="placeholder-message">Sorry, I couldn't answer that. Please try again.</div>`;
    }
  } catch (error) {
    chatWindow.innerHTML = `<div class="placeholder-message">Error: Could not connect to OpenAI API.</div>`;
  }

  // Clear the input field
  document.getElementById("userInput").value = "";
});

// Example render function for beginners
function renderProducts(productsToShow) {
  productsContainer.innerHTML = productsToShow
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.brand}</p>
      <div class="product-description">${product.description}</div>
    </div>
  `
    )
    .join("");
}

// Show all products by default
renderProducts(products);

// Render the initial product list
renderProducts(products);
// On page load, restore selections and render
loadSelectedProducts();
renderProducts();
renderSelectedProducts();

// Add this function to toggle RTL mode for the whole app
function setRTLMode(isRTL) {
  if (isRTL) {
    document.documentElement.setAttribute("dir", "rtl");
  } else {
    document.documentElement.setAttribute("dir", "ltr");
  }
}

// Example: Detect RTL language (like Arabic or Hebrew) and enable RTL mode
// You can call setRTLMode(true) manually, or use this auto-detect:
const rtlLangs = ["ar", "he", "fa", "ur"];
const userLang = navigator.language || navigator.userLanguage || "en";
if (rtlLangs.some((lang) => userLang.startsWith(lang))) {
  setRTLMode(true);
}

// Optionally, add a toggle button for users to switch direction manually:
// const rtlToggle = document.createElement("button");
// rtlToggle.textContent = "Toggle RTL";
// rtlToggle.onclick = () => setRTLMode(document.documentElement.dir !== "rtl");
// document.body.appendChild(rtlToggle);

// Beginner carousel: shows 2 products at a time
let carouselIndex = 0;
const productsPerPage = 2;

const carouselContainer = document.getElementById("carouselContainer");
const carouselPrev = document.getElementById("carouselPrev");
const carouselNext = document.getElementById("carouselNext");

// Render carousel products
function renderCarousel() {
  const visibleProducts = products.slice(
    carouselIndex,
    carouselIndex + productsPerPage
  );

  carouselContainer.innerHTML = visibleProducts
    .map(
      (product) => `
    <div class="product-card">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.brand}</p>
      <div class="product-description">${product.description}</div>
    </div>
  `
    )
    .join("");

  carouselPrev.disabled = carouselIndex === 0;
  carouselNext.disabled = carouselIndex + productsPerPage >= products.length;
}

carouselPrev.addEventListener("click", () => {
  if (carouselIndex > 0) {
    carouselIndex -= productsPerPage;
    renderCarousel();
  }
});
carouselNext.addEventListener("click", () => {
  if (carouselIndex + productsPerPage < products.length) {
    carouselIndex += productsPerPage;
    renderCarousel();
  }
});

renderCarousel();
