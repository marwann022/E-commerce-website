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

  function initWishlistButtons() {
    document.querySelectorAll(".wishlist-btn:not([data-wishlist-init])").forEach((btn) => {
      const icon = btn.querySelector(".wishlist-icon");
      btn.dataset.wishlistInit = "true";

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();

        icon.classList.toggle("active");
        icon.classList.toggle("text-red-500");
        icon.classList.toggle("fill-red-500");
        icon.classList.toggle("text-on-background");
        icon.classList.toggle("scale-110");

        const isActive = icon.classList.contains("active");

        if (isActive) {
          setTimeout(() => icon.classList.remove("scale-110"), 200);
        } else {
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
  }

  initWishlistButtons();

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

  const productGrid = document.getElementById("product-grid");
  const sortSelect = document.querySelector(".flex-1 select");
  const searchBtn = document.querySelector(".sidebar-search-btn");
  const countSpans = document.querySelectorAll(
    ".flex-1 > .flex span.text-on-surface.font-semibold"
  );
  const categorySection = document.querySelector("aside section");
  const paginationRoot = document.getElementById("product-pagination");
  const paginationPrev = document.getElementById("pagination-prev");
  const paginationNext = document.getElementById("pagination-next");
  const paginationPages = document.getElementById("pagination-pages");

  const ITEMS_PER_PAGE = 6;
  const PAGE_BTN_BASE =
    "w-10 h-10 flex items-center justify-center rounded-lg transition-all font-label-md active:scale-95";
  const PAGE_BTN_ACTIVE = "bg-primary text-on-primary";
  const PAGE_BTN_INACTIVE =
    "border border-outline-variant text-on-surface-variant hover:bg-surface-container";

  let currentPage = 1;
  let isPaginating = false;
  const CARD_TRANSITION_MS = 320;

  const CATEGORY_BY_TITLE = {
    "Aura Sound P1": "Audio",
    "Horizon Timepiece": "Wearables",
    "Aura Pad X": "Home Office",
    "Vector Frames": "Accessories",
    "Linear Core KB": "Home Office",
    "Flow Mouse": "Home Office",
    "Pulse Air Max": "Audio",
    "Nova Watch S": "Wearables",
    "Cipher Pro 75": "Home Office",
    "Lucent Optics": "Accessories",
    "Slate Tab Pro": "Home Office",
    "ZenLink Hub": "Accessories",
  };

  const FILTER_COLOR_MAP = {
    "bg-on-background": "black",
    "bg-surface-variant": "white",
    "bg-primary": "primary",
    "bg-secondary-container": "secondary",
    "bg-red-600": "red",
    "bg-green-600": "green",
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
    if (swatch.dataset.color) return swatch.dataset.color;
    if (swatch.classList.contains("bg-black")) return "black";
    if (swatch.classList.contains("bg-white")) return "white";
    if (swatch.classList.contains("bg-slate-400")) return "silver";
    if (swatch.classList.contains("bg-blue-600")) return "blue";
    if (swatch.classList.contains("bg-primary")) return "primary";
    if (swatch.classList.contains("bg-secondary-container")) return "secondary";
    if (swatch.classList.contains("bg-red-600")) return "red";
    if (swatch.classList.contains("bg-green-600")) return "green";
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
    return activeBtn ? activeBtn.dataset.color || null : null;
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
      '<i data-lucide="package-open" class="w-12 h-12 text-outline mb-4 mx-auto"></i><p class="text-headline-md font-headline-md text-on-surface">No products found</p><p class="text-body-md font-body-md text-on-surface-variant mt-2">Try adjusting your filters and search again.</p>';
    productGrid.appendChild(emptyStateEl);
  }

  function updateCounter(pageVisibleCount, totalMatching) {
    if (countSpans.length < 2) return;
    countSpans[0].textContent = String(pageVisibleCount);
    countSpans[1].textContent = String(totalMatching);
  }

  function getTotalPages(itemCount) {
    return Math.max(1, Math.ceil(itemCount / ITEMS_PER_PAGE));
  }

  function clampPage(page, totalPages) {
    return Math.min(Math.max(1, page), totalPages);
  }

  function getPageSlice(list, page) {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  }

  function setPageButtonState(button, isActive) {
    button.className = `${PAGE_BTN_BASE} ${
      isActive ? PAGE_BTN_ACTIVE : PAGE_BTN_INACTIVE
    }`;
    button.setAttribute("aria-current", isActive ? "page" : "false");
  }

  function setArrowState(button, enabled) {
    if (!button) return;
    button.disabled = !enabled;
    button.setAttribute("aria-disabled", String(!enabled));
  }

  function renderPaginationControls(totalPages) {
    if (!paginationPages) return;

    paginationPages.innerHTML = "";

    for (let page = 1; page <= totalPages; page += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(page);
      button.setAttribute("aria-label", `Go to page ${page}`);
      setPageButtonState(button, page === currentPage);
      button.addEventListener("click", () => goToPage(page));
      paginationPages.appendChild(button);
    }

    setArrowState(paginationPrev, currentPage > 1);
    setArrowState(paginationNext, currentPage < totalPages);

    if (paginationRoot) {
      paginationRoot.classList.toggle("hidden", totalPages <= 1);
    }
  }

  function cleanupSlideClasses(card) {
    card.classList.remove(
      "slide-out-left",
      "slide-out-right",
      "slide-in-from-right",
      "slide-in-from-left",
      "slide-in-active"
    );
  }

  function getVisibleProductCards() {
    return products
      .map((p) => p.element)
      .filter((card) => !card.classList.contains("hidden"));
  }

  function animatePageChange(targetPage, sorted) {
    if (!productGrid || isPaginating) return;

    const direction = targetPage > currentPage ? "next" : "prev";
    const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
    const inFromClass =
      direction === "next" ? "slide-in-from-right" : "slide-in-from-left";
    const exiting = getVisibleProductCards();

    isPaginating = true;

    exiting.forEach((card) => {
      cleanupSlideClasses(card);
      card.classList.add(outClass);
    });

    window.setTimeout(() => {
      exiting.forEach((card) => {
        cleanupSlideClasses(card);
        card.classList.add("is-hidden", "hidden");
      });

      currentPage = targetPage;
      const pageItems = getPageSlice(sorted, currentPage);
      const entering = pageItems.map((p) => p.element);
      const visibleSet = new Set(entering);

      sorted.forEach((product) => {
        productGrid.appendChild(product.element);
      });

      products.forEach((product) => {
        const card = product.element;
        if (visibleSet.has(card)) return;
        cleanupSlideClasses(card);
        if (!exiting.includes(card)) {
          card.classList.add("is-hidden", "hidden");
        }
      });

      entering.forEach((card) => {
        card.classList.remove("hidden", "is-hidden");
        card.classList.add(inFromClass);
      });

      requestAnimationFrame(() => {
        entering.forEach((card) => card.classList.add("slide-in-active"));
      });

      window.setTimeout(() => {
        entering.forEach((card) => cleanupSlideClasses(card));
        updateCounter(pageItems.length, sorted.length);
        renderPaginationControls(getTotalPages(sorted.length));
        isPaginating = false;
      }, CARD_TRANSITION_MS);
    }, CARD_TRANSITION_MS);
  }

  function goToPage(page, { animate = true } = {}) {
    const list = filtersApplied ? getFilteredProducts() : [...products];
    const sorted = sortProducts(list);
    const totalPages = getTotalPages(sorted.length);
    const targetPage = clampPage(page, totalPages);

    if (targetPage === currentPage) return;

    if (animate) {
      animatePageChange(targetPage, sorted);
    } else {
      currentPage = targetPage;
      renderProducts(sorted, { preservePage: true });
    }
  }

  function setCardVisibility(card, visible) {
    cleanupSlideClasses(card);

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
      }, CARD_TRANSITION_MS);
    }
  }

  function renderProducts(list, { preservePage = false } = {}) {
    if (!productGrid) return;
    ensureEmptyState();
    const sorted = sortProducts(list);
    const totalPages = getTotalPages(sorted.length);

    if (!preservePage) {
      currentPage = 1;
    }
    currentPage = clampPage(currentPage, totalPages);

    const pageItems = getPageSlice(sorted, currentPage);
    const visibleSet = new Set(pageItems.map((p) => p.element));

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

    updateCounter(pageItems.length, list.length);
    renderPaginationControls(totalPages);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function applyFilters() {
    filtersApplied = true;
    currentPage = 1;
    const filtered = getFilteredProducts();
    renderProducts(filtered);
  }

  function applySort() {
    currentPage = 1;
    const list = filtersApplied ? getFilteredProducts() : [...products];
    renderProducts(list);
  }

  function initPagination() {
    if (paginationPrev) {
      paginationPrev.addEventListener("click", () => {
        if (currentPage > 1) goToPage(currentPage - 1);
      });
    }

    if (paginationNext) {
      paginationNext.addEventListener("click", () => {
        const list = filtersApplied ? getFilteredProducts() : [...products];
        const totalPages = getTotalPages(sortProducts(list).length);
        if (currentPage < totalPages) goToPage(currentPage + 1);
      });
    }
  }

  async function loadNewProductCards() {
    if (!productGrid) return;
    try {
      const response = await fetch("new-product-cards.html");
      if (!response.ok) return;
      const html = await response.text();
      productGrid.insertAdjacentHTML("beforeend", html);
    } catch (_) {}
  }

  async function initProductGrid() {
    await loadNewProductCards();
    products = extractProducts();
    initWishlistButtons();
    applySort();
  }

  initProductGrid();
  initPagination();

  if (searchBtn) {
    searchBtn.addEventListener("click", applyFilters);
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", applySort);
  }
});