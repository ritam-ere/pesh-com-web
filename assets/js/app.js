(function () {
    "use strict";

    var DESKTOP_BASE = 1280;
    var MOBILE_BASE = 390;
    var MOBILE_MAX = 767;

    var root = document.documentElement;
    var body = document.body;

    var THREE_AND_HALF = 838;

    function updateScale() {
        var width = window.innerWidth;
        var base = width <= MOBILE_MAX ? MOBILE_BASE : DESKTOP_BASE;
        var scale = width / base;

        root.style.setProperty("--scale", String(scale));
        root.style.setProperty("--stage-width", base + "px");

        if (base === DESKTOP_BASE) {
            var visibleRef = window.innerHeight / scale;
            var lift = Math.max(-130, Math.min(240, THREE_AND_HALF - visibleRef));
            root.style.setProperty("--hero-lift", lift + "px");
        } else {
            root.style.setProperty("--hero-lift", "0px");
        }
    }

    function playIntro() {

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                body.classList.remove("is-preload");
            });
        });

        window.setTimeout(recomputePanels, 1700);
    }

    function initSmoothScroll() {
        var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        var isTouch = window.matchMedia("(hover: none)").matches;
        if (reduceMotion || isTouch) {
            return;
        }

        var SENSITIVITY = 0.85;
        var EASE = 0.11;
        var target = window.scrollY;
        var current = target;
        var running = false;

        function maxScroll() {
            return Math.max(0, root.scrollHeight - window.innerHeight);
        }

        function step() {
            current += (target - current) * EASE;
            if (Math.abs(target - current) < 0.4) {
                current = target;
                running = false;
            }
            window.scrollTo(0, current);
            if (running) {
                requestAnimationFrame(step);
            }
        }

        window.addEventListener(
            "wheel",
            function (event) {
                event.preventDefault();
                var delta = event.deltaY * (event.deltaMode === 1 ? 16 : 1);
                target = Math.min(maxScroll(), Math.max(0, target + delta * SENSITIVITY));
                if (!running) {
                    running = true;
                    current = window.scrollY;
                    requestAnimationFrame(step);
                }
            },
            { passive: false }
        );

        window.addEventListener(
            "scroll",
            function () {
                if (!running) {
                    target = window.scrollY;
                    current = window.scrollY;
                }
            },
            { passive: true }
        );
    }

    var recomputePanels = function () {};

    function watchPanels() {
        var panels = document.getElementById("panels");
        var lead = document.querySelector(".hero__lead");
        if (!panels || !lead) {
            return;
        }

        var threshold = Infinity;
        var ticking = false;

        function apply() {
            ticking = false;
            var active = window.scrollY >= threshold - 4;
            panels.classList.toggle("is-active", active);
            body.classList.toggle("is-panels", active);
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(apply);
            }
        }

        recomputePanels = function () {

            threshold = lead.getBoundingClientRect().bottom + window.scrollY;
            apply();
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        recomputePanels();
    }

    function initAccordion() {
        var accordion = document.getElementById("accordion");
        if (!accordion) {
            return;
        }

        var items = Array.prototype.slice.call(accordion.querySelectorAll(".menu-item"));

        items.forEach(function (item) {
            var header = item.querySelector(".menu-item__header");
            header.addEventListener("click", function () {
                var willOpen = !item.classList.contains("is-open");

                items.forEach(function (other) {
                    other.classList.toggle("is-open", other === item && willOpen);
                    other
                        .querySelector(".menu-item__header")
                        .setAttribute("aria-expanded", String(other === item && willOpen));
                });
            });
        });
    }

    if ("scrollRestoration" in history) {
        history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    watchPanels();
    initAccordion();
    initSmoothScroll();

    updateScale();
    window.addEventListener(
        "resize",
        function () {
            updateScale();
            recomputePanels();
        },
        { passive: true }
    );

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(playIntro);
    } else {
        window.addEventListener("load", playIntro);
    }
})();
