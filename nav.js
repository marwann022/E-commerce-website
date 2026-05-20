document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the current page filename from the URL (defaults to 'home.html' if empty)
    const currentPath = window.location.pathname.split("/").pop() || "home.html";

    // 2. Define standard Tailwind configuration style states for clean execution
    const activeClasses = "text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1";
    const inactiveClasses = "text-on-surface-variant dark:text-outline-variant hover:text-primary border-b-2 border-transparent pb-1";

    // 3. Generate individual link styling dynamically based on what page matches
    const homeStyle = currentPath === "home.html" ? activeClasses : inactiveClasses;
    const arrivalStyle = currentPath === "arrival.html" ? activeClasses : inactiveClasses;
    const cartStyle = currentPath === "cart.html" ? activeClasses : inactiveClasses;
    const contactStyle = currentPath === "ContactUs.html" ? activeClasses : inactiveClasses;

    const navbar = `
    <header class="bg-surface/80 dark:bg-background/80 backdrop-blur-md docked full-width top-0 sticky z-50 shadow-sm dark:shadow-none">
      <div class="flex flex-col w-full max-w-container-max mx-auto px-margin-desktop py-4">
        <div class="flex flex-wrap items-center justify-between gap-3">

          <div class="text-3xl font-bold tracking-tight text-on-background dark:text-inverse-on-surface">
            AURA
          </div>  

          <nav class="hidden md:flex items-center space-x-8">
            <a class="${homeStyle} transition-colors text-label-md font-label-md" href="home.html">
              Home
            </a>

            <a class="${arrivalStyle} transition-colors text-label-md font-label-md" href="arrival.html">
              New Arrivals
            </a>

            <a class="${cartStyle} transition-colors text-label-md font-label-md" href="cart.html">
              Cart
            </a>

            <a class="${contactStyle} transition-colors text-label-md font-label-md" href="ContactUs.html">
              Contact Us
            </a>
          </nav>

          <div class="flex items-center space-x-6">

            <div class="hidden lg:block relative">
              <input
                class="bg-surface-container-low border-none rounded-full px-6 py-2 text-label-md focus:ring-2 focus:ring-primary/20 w-64 outline-none"
                placeholder="Search products..."
                type="text"
              >
            </div>

            <div class="flex items-center space-x-4">

              <button class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity duration-300 scale-100 active:scale-95 transition-transform duration-200 cursor-pointer">
                <span class="material-symbols-outlined">person</span>
              </button>

              <button class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity duration-300 scale-100 active:scale-95 transition-transform duration-200 cursor-pointer">
                <span class="material-symbols-outlined">favorite</span>
              </button>

              <button class="text-primary dark:text-primary-fixed-dim hover:opacity-80 transition-opacity duration-300 scale-100 active:scale-95 transition-transform duration-200 cursor-pointer">
                <span class="material-symbols-outlined">shopping_bag</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </header>
  `;

    document.getElementById("navbar").innerHTML = navbar;
});