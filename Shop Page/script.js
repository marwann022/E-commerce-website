document.addEventListener("DOMContentLoaded", () => {
  const priceSlider = document.getElementById("price-slider");
  const priceDisplay = document.getElementById("current-price-display");

  if (priceSlider && priceDisplay) {
    priceSlider.addEventListener("input", (e) => {
      const value = e.target.value;
      priceDisplay.textContent = `$${value}`;
      priceDisplay.classList.add("scale-105", "opacity-90");
      setTimeout(() => {
        priceDisplay.classList.remove("scale-105", "opacity-90");
      }, 100);
    });
  }

  document.querySelectorAll(".wishlist-btn").forEach((btn) => {
    const icon = btn.querySelector(".wishlist-icon");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      icon.classList.toggle("active");
      icon.classList.toggle("text-red-500");
      icon.classList.toggle("text-on-background");
      icon.classList.toggle("scale-110");

      const isActive = icon.classList.contains("active");

      if (isActive) {
        icon.style.fontVariationSettings = "'FILL' 1";
        setTimeout(() => icon.classList.remove("scale-110"), 200);
      } else {
        icon.style.fontVariationSettings = "'FILL' 0";
        icon.classList.remove("scale-110");
      }

      btn.setAttribute("aria-pressed", String(isActive));
      btn.setAttribute(
        "aria-label",
        isActive ? "Remove from wishlist" : "Add to wishlist"
      );
      btn.blur();
    });
  });

  const sizeButtons = document.querySelectorAll(".size-btn");
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((button) => {
        button.classList.remove("border-primary", "bg-primary/5", "text-primary");
        button.classList.add("border-outline-variant");
      });

      btn.classList.remove("border-outline-variant");
      btn.classList.add("border-primary", "bg-primary/5", "text-primary");
      btn.blur();
    });
  });


  const colorButtons = document.querySelectorAll(".color-btn");

  function isColorBtnActive(btn) {
    return btn.classList.contains("ring-2") && btn.classList.contains("ring-primary");
  }

  function clearColorSelection() {
    colorButtons.forEach((button) => {
      button.classList.remove("ring-2", "ring-primary", "scale-105");
      button.classList.add("ring-1", "ring-outline-variant");
    });
  }

  function selectColorBtn(btn) {
    clearColorSelection();
    btn.classList.remove("ring-1", "ring-outline-variant");
    btn.classList.add("ring-2", "ring-primary", "scale-105");
  }

  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (isColorBtnActive(btn)) {
        clearColorSelection();
      } else {
        selectColorBtn(btn);
      }
      btn.blur();
    });
  });


  const ratingButtons = document.querySelectorAll(".rating-btn");
  ratingButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      ratingButtons.forEach((button) => {
        button.classList.remove("text-tertiary", "opacity-100", "scale-105", "bg-surface-variant/30");
        button.classList.add("text-tertiary/70", "opacity-70", "scale-100");
      });

      btn.classList.remove("text-tertiary/70", "opacity-70", "scale-100");
      btn.classList.add("text-tertiary", "opacity-100", "scale-105", "bg-surface-variant/30");
      btn.blur();
    });
  });

  const productGrid = document.querySelector(".flex-1 > .grid");
  const sortSelect = document.querySelector(".flex-1 select");
  const searchBtn = document.querySelector(".sidebar-search-btn");
  const countSpans = document.querySelectorAll(
    ".flex-1 > .flex span.text-on-surface.font-semibold"
  );
  const categorySection = document.querySelector("aside section");

  const CATEGORY_BY_TITLE = {
    "Aura Sound P1": "Audio",
    "Horizon Timepiece": "Wearables",
    "Aura Pad X": "Home Office",
    "Vector Frames": "Accessories",
    "Linear Core KB": "Home Office",
    "Flow Mouse": "Home Office",
  };

  const FILTER_COLOR_MAP = {
    "bg-on-background": "black",
    "bg-surface-variant": "white",
    "bg-primary": "primary",
    "bg-secondary-container": "secondary",
  };

  let products = [];
  let filtersApplied = false;
  let emptyStateEl = null;

  function parsePrice(card) {
    const priceEl = card.querySelector(".text-headline-md.text-primary");
    if (!priceEl) return 0;
    const match = priceEl.textContent.replace(/,/g, "").match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  }

  function parseColor(card) {
    const swatch = card.querySelector(".p-6 .rounded-full");
    if (!swatch) return null;
    if (swatch.classList.contains("bg-black")) return "black";
    if (swatch.classList.contains("bg-white")) return "white";
    return null;
  }

  function extractProducts() {
    if (!productGrid) return [];
    return Array.from(productGrid.children)
      .filter((node) => node.querySelector("h3"))
      .map((element) => {
        const title = element.querySelector("h3")?.textContent.trim() || "";
        element.classList.add("product-card");
        return {
          element,
          title,
          category: CATEGORY_BY_TITLE[title] || element.dataset.category || "",
          price: parsePrice(element),
          color: parseColor(element),
        };
      });
  }

  const allCategoryCheckbox = categorySection?.querySelector(
    '.category-checkbox[value="all"]'
  );
  const specificCategoryCheckboxes = categorySection
    ? categorySection.querySelectorAll('.category-checkbox:not([value="all"])')
    : [];

  function isAllCategoriesActive() {
    return Boolean(allCategoryCheckbox?.checked);
  }

  function getSelectedCategories() {
    if (!categorySection || isAllCategoriesActive()) return [];
    return Array.from(
      categorySection.querySelectorAll(
        '.category-checkbox:checked:not([value="all"])'
      )
    )
      .map((input) => input.nextElementSibling?.textContent.trim())
      .filter(Boolean);
  }

  function handleCategoryCheckboxChange(changed) {
    if (!allCategoryCheckbox) return;

    if (changed === allCategoryCheckbox && allCategoryCheckbox.checked) {
      specificCategoryCheckboxes.forEach((cb) => {
        cb.checked = false;
      });
    } else if (changed !== allCategoryCheckbox && changed.checked) {
      allCategoryCheckbox.checked = false;
    }

    const anySpecificChecked = Array.from(specificCategoryCheckboxes).some(
      (cb) => cb.checked
    );

    if (!allCategoryCheckbox.checked && !anySpecificChecked) {
      allCategoryCheckbox.checked = true;
    }
  }

  if (categorySection) {
    categorySection.querySelectorAll(".category-checkbox").forEach((cb) => {
      cb.addEventListener("change", () => handleCategoryCheckboxChange(cb));
    });
  }

  function getActiveFilterColor() {
    const activeBtn = document.querySelector(".color-btn.ring-2.ring-primary");
    if (!activeBtn) return null;
    const bgClass = Array.from(activeBtn.classList).find(
      (cls) => FILTER_COLOR_MAP[cls]
    );
    return bgClass ? FILTER_COLOR_MAP[bgClass] : null;
  }

  function getMaxPrice() {
    return priceSlider ? Number(priceSlider.value) : Infinity;
  }

  function productMatchesFilters(
    product,
    allCategories,
    categories,
    filterColor,
    maxPrice
  ) {
    if (product.price > maxPrice) return false;
    if (
      !allCategories &&
      categories.length &&
      !categories.includes(product.category)
    ) {
      return false;
    }
    if (filterColor && product.color !== filterColor) return false;
    return true;
  }

  function getFilteredProducts() {
    const allCategories = isAllCategoriesActive();
    const categories = getSelectedCategories();
    const filterColor = getActiveFilterColor();
    const maxPrice = getMaxPrice();
    return products.filter((p) =>
      productMatchesFilters(
        p,
        allCategories,
        categories,
        filterColor,
        maxPrice
      )
    );
  }

  function sortProducts(list) {
    if (!sortSelect) return [...list];
    const mode = sortSelect.value;
    const sorted = [...list];
    if (mode === "A to Z") {
      sorted.sort((a, b) =>
        a.title.localeCompare(b.title, "en", { sensitivity: "base" })
      );
    } else if (mode === "Price: Low to High") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (mode === "Price: High to Low") {
      sorted.sort((a, b) => b.price - a.price);
    }
    return sorted;
  }

  function ensureEmptyState() {
    if (!productGrid || emptyStateEl) return;
    emptyStateEl = document.createElement("div");
    emptyStateEl.className =
      "col-span-full hidden flex flex-col items-center justify-center py-20 text-center transition-opacity duration-300";
    emptyStateEl.innerHTML =
      '<span class="material-symbols-outlined text-5xl text-outline mb-4">inventory_2</span><p class="text-headline-md font-headline-md text-on-surface">No products found</p><p class="text-body-md font-body-md text-on-surface-variant mt-2">Try adjusting your filters and search again.</p>';
    productGrid.appendChild(emptyStateEl);
  }

  function updateCounter(visibleCount) {
    if (countSpans.length < 2) return;
    countSpans[0].textContent = String(visibleCount);
    countSpans[1].textContent = String(products.length);
  }

  function setCardVisibility(card, visible) {
    if (visible) {
      card.classList.remove("hidden");
      requestAnimationFrame(() => {
        card.classList.remove("is-hidden");
      });
    } else {
      card.classList.add("is-hidden");
      window.setTimeout(() => {
        if (card.classList.contains("is-hidden")) {
          card.classList.add("hidden");
        }
      }, 300);
    }
  }

  function renderProducts(list) {
    if (!productGrid) return;
    ensureEmptyState();
    const visibleSet = new Set(list.map((p) => p.element));
    const sorted = sortProducts(list);

    sorted.forEach((product) => {
      productGrid.appendChild(product.element);
    });

    products.forEach((product) => {
      const show = visibleSet.has(product.element);
      setCardVisibility(product.element, show);
    });

    if (emptyStateEl) {
      if (list.length === 0) {
        emptyStateEl.classList.remove("hidden");
        productGrid.appendChild(emptyStateEl);
      } else {
        emptyStateEl.classList.add("hidden");
      }
    }

    updateCounter(list.length);
  }

  function applyFilters() {
    filtersApplied = true;
    const filtered = getFilteredProducts();
    renderProducts(filtered);
  }

  function applySort() {
    const list = filtersApplied ? getFilteredProducts() : [...products];
    renderProducts(list);
  }

  products = extractProducts();
  applySort();

  if (searchBtn) {
    searchBtn.addEventListener("click", applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applySort);
  }
});