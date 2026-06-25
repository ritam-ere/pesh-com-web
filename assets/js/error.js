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
})();
