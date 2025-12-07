// helpers
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

// ========== MODE TOGGLE STANDARD / PRO (с AJAX) ==========
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

            
            buttons.forEach((b) => b.classList.remove("hm-mode-toggle-active"));
            btn.classList.add("hm-mode-toggle-active");

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

            
            saveModeToServer(view);
        });
    });
}


function triggerAvatarCharge(selector) {
    const orbit = $(selector);
    if (!orbit) return;

    orbit.classList.remove("hm-avatar-charging");
    void orbit.offsetWidth; 
    orbit.classList.add("hm-avatar-charging");
    setTimeout(() => {
        orbit.classList.remove("hm-avatar-charging");
    }, 600);
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

// =======================
// AJAX:  SAVE MODE
// =======================
function saveModeToServer(mode) {
    fetch("/set-mode/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: `mode=${encodeURIComponent(mode)}`,
    }).then((res) => {
        if (!res.ok) {
            console.warn("Failed to save mode", res.status);
        }
    }).catch((err) => {
        console.error("Error saving mode", err);
    });
}

// CSRF helper 
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
