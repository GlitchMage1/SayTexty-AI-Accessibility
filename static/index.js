// Run when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    typingEffect();
    scrollReveal();
    quickStartPanel();
});

// 1. Typing effect in hero
function typingEffect() {
    const phrases = [
        "Live captions for every voice.",
        "Turn lectures into readable notes.",
        "Help people follow the conversation.",
        "Technology that serves understanding."
    ];
    const el = document.getElementById("typing-text");
    if (!el) return;

    let idx = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const phrase = phrases[idx];

        if (!deleting) {
            charIndex++;
            if (charIndex >= phrase.length + 3) {
                deleting = true;
                setTimeout(tick, 900);
                return;
            }
        } else {
            charIndex--;
            if (charIndex <= 0) {
                deleting = false;
                idx = (idx + 1) % phrases.length;
            }
        }

        el.textContent = phrase.slice(0, Math.max(charIndex, 0));
        const delay = deleting ? 35 : 70;
        setTimeout(tick, delay);
    }

    setTimeout(tick, 900);
}

// 2. Scroll reveal for blocks
function scrollReveal() {
    const els = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window) || !els.length) {
        els.forEach(el => el.classList.add("visible"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        }
    }, {
        threshold: 0.15
    });

    els.forEach(el => observer.observe(el));
}

// 3. Quick start panel (mode, language, button)
function quickStartPanel() {
    const modeRow = document.getElementById("mode-row");
    const langRow = document.getElementById("language-row");
    const quickStartBtn = document.getElementById("quick-start-btn");
    const titleInput = document.getElementById("session-title-input");

    if (!modeRow || !langRow || !quickStartBtn) return;

    // Init from localStorage
    const savedMode = localStorage.getItem("hearme.mode");
    const savedLang = localStorage.getItem("hearme.lang");

    if (savedMode) {
        modeRow.dataset.selectedMode = savedMode;
        modeRow.querySelectorAll(".mode-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mode === savedMode);
        });
    }

    if (savedLang) {
        langRow.dataset.selectedLang = savedLang;
        langRow.querySelectorAll(".lang-pill").forEach(pill => {
            pill.classList.toggle("active", pill.dataset.lang === savedLang);
        });
    }

    // Mode selection
    modeRow.addEventListener("click", e => {
        const btn = e.target.closest(".mode-btn");
        if (!btn) return;
        const mode = btn.dataset.mode;
        modeRow.dataset.selectedMode = mode;
        modeRow.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        localStorage.setItem("hearme.mode", mode);
    });

    // Language selection
    langRow.addEventListener("click", e => {
        const pill = e.target.closest(".lang-pill");
        if (!pill) return;
        const lang = pill.dataset.lang;
        langRow.dataset.selectedLang = lang;
        langRow.querySelectorAll(".lang-pill").forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        localStorage.setItem("hearme.lang", lang);
    });

    // Launch button
    quickStartBtn.addEventListener("click", () => {
        const mode = modeRow.dataset.selectedMode || "conversation";
        const lang = langRow.dataset.selectedLang || "en";
        const title = (titleInput && titleInput.value || "").trim();

        // Here you decide what to do:
        // Option 1: redirect with GET parameters:
        // window.location.href = `/sessions/new/?mode=${encodeURIComponent(mode)}&lang=${encodeURIComponent(lang)}&title=${encodeURIComponent(title)}`;

        // Temporary: show alert so you can see it's working
        alert(`New session\nmode: ${mode}\nlang: ${lang}\ntitle: ${title || "(no title)"}`);
    });
}
