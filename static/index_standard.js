// helper
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

window.addEventListener("load", () => {
    // PRELOADER
    const preloader = $("#hm-preloader");
    const page = $(".hm-page");

    if (page) {
        page.classList.remove("hidden-preloader");
    }

    if (preloader) {
        preloader.classList.add("hm-preloader-hide");
        setTimeout(() => {
            preloader.style.display = "none";
        }, 400);
    }

    // INIT
    initModeToggle();
    initModeCards();
    initProModeCards();
    initFadeCards();
});

// ========== MODE TOGGLE STANDARD / PRO ==========
function initModeToggle() {
    const buttons = $$(".hm-mode-toggle-btn");
    const layouts = {
        standard: $(".hm-layout-standard"),
        pro: $(".hm-layout-pro"),
    };

    if (!buttons.length || !layouts.standard || !layouts.pro) return;

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const view = btn.getAttribute("data-view");
            if (!view) return;

            // активная кнопка
            buttons.forEach((b) => b.classList.remove("hm-mode-toggle-active"));
            btn.classList.add("hm-mode-toggle-active");

            // активный layout
            layouts.standard.classList.remove("hm-layout-active");
            layouts.pro.classList.remove("hm-layout-active");

            if (view === "standard") {
                layouts.standard.classList.add("hm-layout-active");
                document.body.classList.remove("hm-pro-active");
                triggerAvatarCharge(".hm-avatar-orbit-standard");
            } else {
                layouts.pro.classList.add("hm-layout-active");
                document.body.classList.add("hm-pro-active");
                triggerAvatarCharge(".hm-avatar-orbit-pro");
            }
        });
    });
}

// маленькая вспышка при смене режима
function triggerAvatarCharge(selector) {
    const orbit = $(selector);
    if (!orbit) return;

    orbit.classList.remove("hm-avatar-charging");
    void orbit.offsetWidth; // restart animation
    orbit.classList.add("hm-avatar-charging");
    setTimeout(() => {
        orbit.classList.remove("hm-avatar-charging");
    }, 500);
}

// ========== STANDARD: cards active by radio ==========
function initModeCards() {
    const cards = $$(".hm-mode-card");
    if (!cards.length) return;

    const updateActive = () => {
        cards.forEach((card) => {
            const input = card.querySelector(".hm-mode-radio");
            if (!input) return;
            if (input.checked) {
                card.classList.add("hm-mode-card-active");
            } else {
                card.classList.remove("hm-mode-card-active");
            }
        });
    };

    cards.forEach((card) => {
        const input = card.querySelector(".hm-mode-radio");
        if (!input) return;

        card.addEventListener("click", () => {
            input.checked = true;
            updateActive();
        });

        input.addEventListener("change", updateActive);
    });

    // initial state
    updateActive();
}

// ========== PRO: cards active by radio ==========
function initProModeCards() {
    const cards = $$(".hm-mode-card-pro");
    if (!cards.length) return;

    const updateActive = () => {
        cards.forEach((card) => {
            const input = card.querySelector(".hm-mode-radio-pro");
            if (!input) return;
            if (input.checked) {
                card.classList.add("hm-mode-card-pro-active");
            } else {
                card.classList.remove("hm-mode-card-pro-active");
            }
        });
    };

    cards.forEach((card) => {
        const input = card.querySelector(".hm-mode-radio-pro");
        if (!input) return;

        card.addEventListener("click", () => {
            input.checked = true;
            updateActive();
        });

        input.addEventListener("change", updateActive);
    });

    updateActive();
}

// ========== FADE-IN для .fade-card ==========
function initFadeCards() {
    const cards = $$(".fade-card");
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add("fade-card-show");
        }, 100 + index * 120);
    });
}
