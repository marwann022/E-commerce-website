// --- Basic UI Logic ---
document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Thumbnail Gallery
  var mainImage = document.getElementById('main-image');
  var thumbnails = document.querySelectorAll('.thumbnail-btn');

  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('click', function() {
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

  qtyMinus.addEventListener('click', function() {
    if (quantity > 1) {
      quantity--;
      qtyValue.textContent = quantity;
    }
  });

  qtyPlus.addEventListener('click', function() {
    if (quantity < 10) {
      quantity++;
      qtyValue.textContent = quantity;
    }
  });

  // 3. Color Selection
  var colorBtns = document.querySelectorAll('.color-btn');

  for (var k = 0; k < colorBtns.length; k++) {
    colorBtns[k].addEventListener('click', function() {
      for (var l = 0; l < colorBtns.length; l++) {
        colorBtns[l].classList.remove('border-primary', 'ring-2', 'ring-offset-2');
        colorBtns[l].classList.add('border-transparent');
      }
      this.classList.remove('border-transparent');
      this.classList.add('border-primary', 'ring-2', 'ring-offset-2');
    });
  }

  // 4. Model & Price Selection
  var modelBtns = document.querySelectorAll('.model-btn');
  var priceDisplay = document.getElementById('product-price');

  for (var m = 0; m < modelBtns.length; m++) {
    modelBtns[m].addEventListener('click', function() {
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
    tabBtns[p].addEventListener('click', function() {
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
  var cartBadge = document.getElementById('cart-badge');
  var cartCount = 2;

  addToCartBtn.addEventListener('click', function() {
    if (this.disabled) return;
    
    this.disabled = true;
    
    cartCount += quantity;
    cartBadge.textContent = cartCount;

    addToCartText.textContent = "Successfully Added";
    this.classList.remove('bg-primary', 'text-on-primary');
    this.classList.add('bg-on-background', 'text-background');

    var btnRef = this;
    setTimeout(function() {
      addToCartText.textContent = "Add to Cart";
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
  var stars = document.querySelectorAll('#rating-stars span');
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

  // Stars
  function updateStars(rating) {
    for (var s = 0; s < stars.length; s++) {
      if (s < rating) {
        stars[s].style.fontVariationSettings = "'FILL' 1";
        stars[s].classList.add('text-tertiary');
      } else {
        stars[s].style.fontVariationSettings = "'FILL' 0";
        stars[s].classList.remove('text-tertiary');
      }
    }
  }

  for (var t = 0; t < stars.length; t++) {
    stars[t].addEventListener('click', function() {
      currentRating = parseInt(this.getAttribute('data-value'), 10);
      ratingInput.value = currentRating;
      updateStars(currentRating);
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      var originalText = submitReviewBtn.textContent;
      submitReviewBtn.textContent = "Review Submitted!";
      submitReviewBtn.classList.remove('bg-primary', 'text-on-primary');
      submitReviewBtn.classList.add('bg-on-background', 'text-background');
      submitReviewBtn.disabled = true;

      setTimeout(function() {
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
});
