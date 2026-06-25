(function () {
    "use strict";

    var root = document.documentElement;

    function update() {
        var w = root.clientWidth;
        var h = window.innerHeight;
        root.style.setProperty("--scale", String(w / 1280));
        root.style.setProperty("--sp-scale", String(Math.min(w / 1280, h / 832)));
        root.style.setProperty("--spm-scale", String(w / 390));
    }

    update();
    window.addEventListener("resize", update, { passive: true });

    function playIntro() {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.classList.remove("is-preload");
            });
        });
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(playIntro);
    } else {
        window.addEventListener("load", playIntro);
    }

    var COORDS = ["(124°11”)", "(56°48”)", "(212°07”)", "(09°33”)", "(88°15”)", "(140°02”)"];
    var els = [
        document.querySelector(".space__coords"),
        document.querySelector(".space-m__coords")
    ].filter(Boolean);

    if (!els.length) {
        return;
    }

    var index = 0;

    function roll() {
        index = (index + 1) % COORDS.length;

        els.forEach(function (el) {
            el.style.opacity = "0";
            el.style.transform = "translateY(-0.45em)";
        });

        window.setTimeout(function () {
            els.forEach(function (el) {
                el.textContent = COORDS[index];
                el.style.transition = "none";
                el.style.transform = "translateY(0.45em)";
                el.style.opacity = "0";
                void el.offsetWidth;
                el.style.transition = "";
                el.style.transform = "translateY(0)";
                el.style.opacity = "1";
            });
        }, 500);
    }

    window.setInterval(roll, 5000);
})();
