// --- Basic UI Logic ---
document.addEventListener('DOMContentLoaded', function () {

  // Initialize Lucide Icons
  window.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
  });

  // 1. Thumbnail Gallery
  var mainImage = document.getElementById('main-image');
  var thumbnails = document.querySelectorAll('.thumbnail-btn');

  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('click', function () {
      var img = this.querySelector('img');
      if (!img) return; // Ignore if no image (like video button)

      mainImage.src = img.src;

      // Update active border
      for (var j = 0; j < thumbnails.length; j++) {
        thumbnails[j].classList.remove('border-primary');
        thumbnails[j].classList.add('border-transparent');
      }
      this.classList.remove('border-transparent');
      this.classList.add('border-primary');
    });
  }

  // 2. Quantity Logic
  var qtyMinus = document.getElementById('qty-minus');
  var qtyPlus = document.getElementById('qty-plus');
  var qtyValue = document.getElementById('qty-value');
  var quantity = 1;

  qtyMinus.addEventListener('click', function () {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  qtyPlus.addEventListener('click', function () {
    if (quantity < 10) {
      quantity++;
      qtyValue.textContent = quantity;
    }
  });

  // 3. Color Selection
  var colorBtns = document.querySelectorAll('.color-btn-wrapper');

  for (var k = 0; k < colorBtns.length; k++) {
    colorBtns[k].addEventListener('click', function () {
      // If already active, do nothing
      if (this.classList.contains('active')) return;

      // Remove active class from all swatches
      for (var l = 0; l < colorBtns.length; l++) {
        colorBtns[l].classList.remove('active');
      }

      // Add active class to clicked swatch
      this.classList.add('active');

      // Trigger ripple wave animation reset
      var ripple = this.querySelector('.color-ripple-effect');
      if (ripple) {
        var newRipple = ripple.cloneNode(true);
        ripple.parentNode.replaceChild(newRipple, ripple);
      }

      // Dynamic Image Swap with smooth premium fade transition
      var newImageSrc = this.getAttribute('data-image');
      if (newImageSrc && mainImage) {
        // Start fade out
        mainImage.classList.add('opacity-0');

        setTimeout(function () {
          // Swap image source while hidden
          mainImage.src = newImageSrc;

          // Fade back in
          setTimeout(function () {
            mainImage.classList.remove('opacity-0');
          }, 50);
        }, 200); // 200ms fade transition point
      }
    });
  }

  // 4. Model & Price Selection
  var modelBtns = document.querySelectorAll('.model-btn');
  var priceDisplay = document.getElementById('product-price');

  for (var m = 0; m < modelBtns.length; m++) {
    modelBtns[m].addEventListener('click', function () {
      var newPrice = this.getAttribute('data-price');
      priceDisplay.textContent = '$' + parseFloat(newPrice).toFixed(2);

      for (var n = 0; n < modelBtns.length; n++) {
        modelBtns[n].classList.remove('border-primary', 'bg-primary/5', 'text-primary');
        modelBtns[n].classList.add('border-outline-variant', 'text-on-surface-variant');
      }

      this.classList.remove('border-outline-variant', 'text-on-surface-variant');
      this.classList.add('border-primary', 'bg-primary/5', 'text-primary');
    });
  }

  // 5. Tabs
  var tabBtns = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  for (var p = 0; p < tabBtns.length; p++) {
    tabBtns[p].addEventListener('click', function () {
      var targetId = 'tab-' + this.getAttribute('data-tab');

      // Update buttons
      for (var q = 0; q < tabBtns.length; q++) {
        tabBtns[q].classList.remove('border-primary', 'text-primary');
        tabBtns[q].classList.add('border-transparent', 'text-on-surface-variant');
      }
      this.classList.remove('border-transparent', 'text-on-surface-variant');
      this.classList.add('border-primary', 'text-primary');

      // Show content
      for (var r = 0; r < tabContents.length; r++) {
        if (tabContents[r].id === targetId) {
          tabContents[r].classList.remove('hidden');
        } else {
          tabContents[r].classList.add('hidden');
        }
      }
    });
  }

  // 6. Add to Cart
  var addToCartBtn = document.getElementById('add-to-cart-btn');
  var addToCartText = document.getElementById('add-to-cart-text');
  var addToCartIcon = document.getElementById('add-to-cart-icon');
  var cartBadge = document.getElementById('cart-badge');
  var cartCount = 2;

  addToCartBtn.addEventListener('click', function () {
    if (this.disabled) return;

    this.disabled = true;

    cartCount += quantity;
    cartBadge.textContent = cartCount;

    addToCartText.textContent = "Successfully Added";
    if (addToCartIcon) {
      addToCartIcon.outerHTML = '<i id="add-to-cart-icon" data-lucide="check" class="w-5 h-5"></i>';
      lucide.createIcons();
      addToCartIcon = document.getElementById('add-to-cart-icon');
    }
    this.classList.remove('bg-primary', 'text-on-primary');
    this.classList.add('bg-on-background', 'text-background');

    var btnRef = this;
    setTimeout(function () {
      addToCartText.textContent = "Add to Cart";
      if (addToCartIcon) {
        addToCartIcon.outerHTML = '<i id="add-to-cart-icon" data-lucide="shopping-bag" class="w-5 h-5"></i>';
        lucide.createIcons();
        addToCartIcon = document.getElementById('add-to-cart-icon');
      }
      btnRef.classList.remove('bg-on-background', 'text-background');
      btnRef.classList.add('bg-primary', 'text-on-primary');
      btnRef.disabled = false;
    }, 2000);
  });

  // 7. Review Modal
  var writeReviewBtn = document.getElementById('write-review-btn');
  var reviewModal = document.getElementById('review-modal');
  var closeReviewBtn = document.getElementById('close-review-modal');
  var reviewBackdrop = document.getElementById('review-modal-backdrop');
  var reviewForm = document.getElementById('review-form');
  var ratingInput = document.getElementById('rating-value');
  var submitReviewBtn = document.getElementById('submit-review-btn');
  var currentRating = 5;

  function openModal() {
    reviewModal.classList.remove('hidden');
    reviewModal.classList.remove('opacity-0');
  }

  function closeModal() {
    reviewModal.classList.add('hidden');
    reviewModal.classList.add('opacity-0');
  }

  if (writeReviewBtn) writeReviewBtn.addEventListener('click', openModal);
  if (closeReviewBtn) closeReviewBtn.addEventListener('click', closeModal);
  if (reviewBackdrop) reviewBackdrop.addEventListener('click', closeModal);

  // Stars - Dynamic Interaction & Hover Preview
  var ratingStarsContainer = document.getElementById('rating-stars');

  function updateStars(rating) {
    if (!ratingStarsContainer) return;
    var stars = ratingStarsContainer.querySelectorAll('[data-value]');
    for (var s = 0; s < stars.length; s++) {
      var val = parseInt(stars[s].getAttribute('data-value'), 10);
      if (val <= rating) {
        stars[s].setAttribute('fill', '#825100');
        stars[s].classList.add('text-tertiary', 'fill-tertiary');
        stars[s].classList.remove('text-outline-variant', 'fill-none');
      } else {
        stars[s].setAttribute('fill', '#ffffff');
        stars[s].classList.remove('text-tertiary', 'fill-tertiary');
        stars[s].classList.add('text-outline-variant', 'fill-none');
      }
    }
  }

  if (ratingStarsContainer) {
    // Initialize stars to currentRating (5 stars)
    updateStars(currentRating);

    // Click handling (delegated)
    ratingStarsContainer.addEventListener('click', function (e) {
      var star = e.target.closest('[data-value]');
      if (!star) return;
      currentRating = parseInt(star.getAttribute('data-value'), 10);
      ratingInput.value = currentRating;
      updateStars(currentRating);
    });

    // Hover preview (mousemove)
    ratingStarsContainer.addEventListener('mousemove', function (e) {
      var star = e.target.closest('[data-value]');
      if (!star) return;
      var hoverRating = parseInt(star.getAttribute('data-value'), 10);
      updateStars(hoverRating);
    });

    // Restore on mouse leave
    ratingStarsContainer.addEventListener('mouseleave', function () {
      updateStars(currentRating);
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var originalText = submitReviewBtn.textContent;
      submitReviewBtn.textContent = "Review Submitted!";
      submitReviewBtn.classList.remove('bg-primary', 'text-on-primary');
      submitReviewBtn.classList.add('bg-on-background', 'text-background');
      submitReviewBtn.disabled = true;

      setTimeout(function () {
        closeModal();
        reviewForm.reset();
        currentRating = 5;
        updateStars(5);
        ratingInput.value = 5;

        submitReviewBtn.textContent = originalText;
        submitReviewBtn.classList.remove('bg-on-background', 'text-background');
        submitReviewBtn.classList.add('bg-primary', 'text-on-primary');
        submitReviewBtn.disabled = false;
      }, 1500);
    });
  }

  // 8. FAQ Accordion
  var faqTriggers = document.querySelectorAll('.faq-trigger');

  for (var i = 0; i < faqTriggers.length; i++) {
    faqTriggers[i].addEventListener('click', function () {
      var item = this.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isOpen = item.classList.contains('open');

      // Close all other FAQ items for a neat accordion behavior
      var allItems = document.querySelectorAll('.faq-item');
      for (var j = 0; j < allItems.length; j++) {
        allItems[j].classList.remove('open');
        allItems[j].querySelector('.faq-answer').style.maxHeight = null;
      }

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  }
});
