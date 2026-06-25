(function () {
    "use strict";

    var triggers = document.querySelectorAll(".m-dice, .space-m__nav, .err-m__nav, .mobile-bar__menu");
    if (!triggers.length) {
        return;
    }

    var SECTIONS = [
        { name: "о нас", index: "(1)", href: "index.html" },
        { name: "мерч", index: "(2)", href: "merch.html" },
        { name: "айтем-кросс", index: "(3)", href: "item-cross.html" },
        { name: "о пространстве", index: "(4)", href: "space.html" }
    ];
    var FACE_TO_PAGE = {
        1: "index.html", 2: "merch.html", 3: "item-cross.html",
        4: "space.html", 5: "merch.html", 6: "item-cross.html"
    };
    var TARGET = {
        1: { x: 0, y: 0 }, 6: { x: 0, y: 180 }, 3: { x: 0, y: -90 },
        4: { x: 0, y: 90 }, 2: { x: -90, y: 0 }, 5: { x: 90, y: 0 }
    };

    var mnav = document.createElement("div");
    mnav.className = "mnav";
    mnav.hidden = true;

    var links = SECTIONS.map(function (s) {
        return '<li><a class="mnav__link" href="' + s.href + '">' +
            '<span class="mnav__idx">' + s.index + "</span>" +
            '<span class="mnav__name">' + s.name + "</span></a></li>";
    }).join("");

    mnav.innerHTML =
        '<button class="mnav__catch" type="button" aria-label="Закрыть"></button>' +
        '<div class="mnav__panel">' +
            '<div class="mnav__head">' +
                '<span class="mnav__bureau">bureau</span>' +
                '<button class="mnav__close" type="button" aria-label="Закрыть"></button>' +
                '<span class="mnav__est">est.2026</span>' +
            "</div>" +
            '<ul class="mnav__list">' + links + "</ul>" +
            '<button class="mnav__roll" type="button">бросить кубик</button>' +
        "</div>" +
        '<div class="mnav__throw" hidden></div>';

    document.body.appendChild(mnav);

    var panel = mnav.querySelector(".mnav__panel");
    var throwLayer = mnav.querySelector(".mnav__throw");
    var rolling = false;

    function open() {
        mnav.hidden = false;
    }

    function close() {
        mnav.hidden = true;
        throwLayer.hidden = true;
        throwLayer.innerHTML = "";
        panel.hidden = false;
        rolling = false;
    }

    triggers.forEach(function (t) {
        t.addEventListener("click", open);
    });
    mnav.querySelector(".mnav__close").addEventListener("click", close);
    mnav.querySelector(".mnav__catch").addEventListener("click", close);
    mnav.querySelector(".mnav__roll").addEventListener("click", throwDice);

    function buildCube() {
        var PIPS = {
            1: [5], 2: [1, 9], 3: [1, 5, 9],
            4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9]
        };
        var FACES = [["f", 1], ["b", 6], ["r", 3], ["l", 4], ["u", 2], ["d", 5]];
        var wrap = document.createElement("div");
        wrap.className = "mnav__dice";
        var inner = document.createElement("div");
        inner.className = "dice3d";
        var cube = document.createElement("div");
        cube.className = "dice3d__cube";
        FACES.forEach(function (def) {
            var face = document.createElement("div");
            face.className = "dice3d__face dice3d__face--" + def[0];
            var set = PIPS[def[1]];
            for (var c = 1; c <= 9; c++) {
                var pip = document.createElement("span");
                if (set.indexOf(c) !== -1) {
                    pip.className = "dice3d__pip";
                }
                face.appendChild(pip);
            }
            cube.appendChild(face);
        });
        inner.appendChild(cube);
        wrap.appendChild(inner);
        cube.style.transform = "rotateX(-35.264deg) rotateY(-45deg)";
        return { wrap: wrap, cube: cube };
    }

    function throwDice() {
        if (rolling) {
            return;
        }
        rolling = true;
        var value = 1 + Math.floor(Math.random() * 6);
        var dice = buildCube();
        throwLayer.innerHTML = "";
        throwLayer.appendChild(dice.wrap);
        panel.hidden = true;
        throwLayer.hidden = false;

        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                var t = TARGET[value];
                dice.cube.style.transform =
                    "rotateX(" + (t.x + 720) + "deg) rotateY(" + (t.y + 720) + "deg)";
            });
        });

        window.setTimeout(function () {
            window.location.href = FACE_TO_PAGE[value];
        }, 1600);
    }
})();
