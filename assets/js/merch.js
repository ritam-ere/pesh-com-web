(function () {
    "use strict";

    var MOBILE_MAX = 767;
    var root = document.documentElement;
    var body = document.body;

    var POSTERS = [
        { group: "Lost in web", n: 1, file: "lost-in-web-1", x: 200, y: 687, rot: 115.4, mx: 175, my: 360, mrot: -11, z: 2, side: "left", order: 0 },
        { group: "Lost in web", n: 2, file: "lost-in-web-2", x: 241, y: 458, rot: 61.6, mx: 180, my: 360, mrot: -8, z: 1, side: "left", order: 3 },
        { group: "Lost in web", n: 3, file: "lost-in-web-3", x: 312, y: 245, rot: 120, mx: 185, my: 360, mrot: -5, z: 3, side: "left", order: 6 },
        { group: "Сны", n: 1, file: "dreams-1", x: 607, y: 299, rot: -15, mx: 190, my: 360, mrot: -2, z: 4, side: "top", order: 1 },
        { group: "Сны", n: 2, file: "dreams-2", x: 741, y: 385, rot: 6, mx: 195, my: 360, mrot: 1, z: 5, side: "top", order: 4 },
        { group: "Сны", n: 3, file: "dreams-3", x: 760, y: 575, rot: -150, mx: 200, my: 360, mrot: 4, z: 6, side: "top", order: 7 },
        { group: "LEG party", n: 1, file: "leg-party-1", x: 1117, y: 256, rot: -45.5, mx: 205, my: 360, mrot: 7, z: 7, side: "right", order: 2 },
        { group: "LEG party", n: 2, file: "leg-party-2", x: 1098, y: 529, rot: 75.8, mx: 210, my: 360, mrot: 10, z: 9, side: "right", order: 5 },
        { group: "LEG party", n: 3, file: "leg-party-3", x: 1068, y: 659, rot: 49.6, mx: 215, my: 360, mrot: 13, z: 8, side: "right", order: 8 }
    ];

    var STAGGER = 0.3;
    var LEAD_IN = 0.2;

    var stage = document.getElementById("stage");
    var controls = stage.querySelector(".merch-controls");
    var titleEl = document.getElementById("title");
    var downloadEl = document.getElementById("download");

    var cards = [];
    var current = 0;

    function isMobile() {
        return window.innerWidth <= MOBILE_MAX;
    }

    POSTERS.forEach(function (data, i) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "poster";
        card.dataset.side = data.side;
        card.dataset.index = String(i);
        card.style.setProperty("--z", String(data.z));
        card.style.transitionDelay = (LEAD_IN + data.order * STAGGER) + "s";
        card.setAttribute("aria-label", "Постер «" + data.group + "» (" + data.n + ")");

        var img = document.createElement("img");
        img.className = "poster__img";
        img.src = "assets/images/posters/" + data.file + ".webp";
        img.width = 312;
        img.height = 440;
        img.alt = "Постер «" + data.group + "» (" + data.n + ")";
        card.appendChild(img);

        card.addEventListener("click", function () {
            select(i);
        });

        stage.insertBefore(card, controls);
        cards.push(card);
    });

    function layout() {
        var mobile = isMobile();
        cards.forEach(function (card, i) {
            var d = POSTERS[i];
            card.style.setProperty("--x", (mobile ? d.mx : d.x) + "px");
            card.style.setProperty("--y", (mobile ? d.my : d.y) + "px");
            card.style.setProperty("--rot", (mobile ? d.mrot : d.rot) + "deg");
        });
    }

    function select(index) {
        current = (index + POSTERS.length) % POSTERS.length;
        cards.forEach(function (card, i) {
            card.classList.toggle("is-selected", i === current);
        });
        var data = POSTERS[current];
        titleEl.innerHTML = "Постер «" + data.group + "» (" + data.n + ")";
        downloadEl.href = "assets/images/posters/" + data.file + ".webp";
    }

    document.getElementById("prev").addEventListener("click", function () {
        select(current - 1);
    });
    document.getElementById("next").addEventListener("click", function () {
        select(current + 1);
    });

    function updateScale() {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var mobile = isMobile();
        var baseW = mobile ? 390 : 1280;
        var baseH = mobile ? 844 : 832;

        body.classList.toggle("is-mobile", mobile);
        root.style.setProperty("--scale", String(w / baseW));
        root.style.setProperty("--stage-width", baseW + "px");
        root.style.setProperty("--merch-scale", String(Math.min(w / baseW, h / baseH)));
    }

    function playIntro() {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                body.classList.remove("is-preload");
            });
        });

        window.setTimeout(function () {
            cards.forEach(function (card) {
                card.style.transitionDelay = "";
            });
        }, 3600);
    }

    updateScale();
    layout();
    select(0);

    var wasMobile = isMobile();
    window.addEventListener(
        "resize",
        function () {
            updateScale();
            if (isMobile() !== wasMobile) {
                wasMobile = isMobile();
                layout();
            }
        },
        { passive: true }
    );

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(playIntro);
    } else {
        window.addEventListener("load", playIntro);
    }
})();
