const footer = `
<footer class="bg-surface-container-low dark:bg-inverse-surface full-width mt-20">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-margin-desktop py-16">
        <div class="col-span-1 md:col-span-1">
            <div class="text-headline-md font-headline-md font-bold text-on-surface dark:text-inverse-on-surface mb-6">
                AURA
            </div>

            <p class="text-body-md font-body-md text-on-surface-variant dark:text-surface-variant mb-6">
                Elevating your daily tech experience through thoughtful design and premium performance.
            </p>

            <div class="flex space-x-4">
                <span class="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity">
                    public
                </span>

                <span class="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity">
                    mail
                </span>

                <span class="material-symbols-outlined text-primary cursor-pointer hover:opacity-70 transition-opacity">
                    share
                </span>
            </div>
        </div>

        <div>
            <h4 class="text-label-md font-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-widest mb-6">
                Shop
            </h4>

            <ul class="space-y-4">
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">All Products</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Best Sellers</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Refurbished</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Corporate Gift</a></li>
            </ul>
        </div>

        <div>
            <h4 class="text-label-md font-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-widest mb-6">
                Help
            </h4>

            <ul class="space-y-4">
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Customer Service</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Shipping</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Returns</a></li>
                <li><a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary hover:underline transition-all cursor-pointer" href="#">Warranty</a></li>
            </ul>
        </div>

        <div>
            <h4 class="text-label-md font-label-md text-on-surface dark:text-inverse-on-surface uppercase tracking-widest mb-6">
                Newsletter
            </h4>

            <p class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant mb-4">
                Join our list for exclusive releases and tech insights.
            </p>

            <div class="flex">
                <input
                    class="bg-surface dark:bg-background border-none rounded-l-lg px-4 py-2 w-full text-label-sm focus:ring-1 focus:ring-primary"
                    placeholder="Email address"
                    type="email"
                >

                <button class="bg-primary text-on-primary px-4 py-2 rounded-r-lg text-label-sm font-bold hover:opacity-90">
                    Join
                </button>
            </div>
        </div>
    </div>

    <div class="max-w-container-max mx-auto px-margin-desktop py-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant">
            © 2024 AURA Minimalist Tech. All rights reserved.
        </p>

        <div class="flex space-x-6">
            <a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all" href="#">
                Privacy Policy
            </a>

            <a class="text-label-sm font-label-sm text-on-surface-variant dark:text-surface-variant hover:text-primary transition-all" href="#">
                Terms of Use
            </a>
        </div>
    </div>
</footer>
`;

document.getElementById("footer").innerHTML = footer;