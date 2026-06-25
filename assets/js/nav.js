(function () {
    "use strict";

    var pill = document.querySelector(".nav-pill");
    if (!pill) {
        return;
    }

    var SECTIONS = [
        { name: "бюро", index: "(1)", href: "index.html", key: "index" },
        { name: "мерч", index: "(2)", href: "merch.html", key: "merch" },
        { name: "айтем-кросс", index: "(3)", href: "item-cross.html", key: "item-cross" },
        { name: "пространство", index: "(4)", href: "space.html", key: "space" }
    ];

    var FACE_TO_PAGE = {
        1: "index.html", 2: "merch.html", 3: "item-cross.html",
        4: "space.html", 5: "merch.html", 6: "item-cross.html"
    };

    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var current = file.replace(".html", "") || "index";

    var trigger = pill.querySelector(".nav-pill__trigger");
    var plateText = document.createElement("span");
    plateText.className = "nav-pill__plate";
    plateText.textContent = "Чтобы исследовать сайт, бросьте кубик";
    trigger.appendChild(plateText);

    var bodyEl = document.createElement("div");
    bodyEl.className = "nav-panel__body";

    var diceWell = document.createElement("div");
    diceWell.className = "nav-panel__dice";
    diceWell.appendChild(buildDice());
    bodyEl.appendChild(diceWell);

    var list = document.createElement("ul");
    list.className = "nav-panel__list";
    SECTIONS.forEach(function (s) {
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.className = "nav-link" + (s.key === current ? " is-current" : "");
        a.href = s.href;
        a.innerHTML =
            '<span class="nav-link__index">' + s.index + "</span>" +
            '<span class="nav-link__name">' + s.name + "</span>";
        li.appendChild(a);
        list.appendChild(li);
    });
    bodyEl.appendChild(list);

    pill.appendChild(bodyEl);

    function buildDice() {

        var PIPS = {
            1: [5], 2: [1, 9], 3: [1, 5, 9],
            4: [1, 3, 7, 9], 5: [1, 3, 5, 7, 9], 6: [1, 3, 4, 6, 7, 9]
        };
        var FACES = [["f", 1], ["b", 6], ["r", 3], ["l", 4], ["u", 2], ["d", 5]];

        var wrap = document.createElement("div");
        wrap.className = "dice3d";
        var cube = document.createElement("div");
        cube.className = "dice3d__cube";

        FACES.forEach(function (def) {
            var face = document.createElement("div");
            face.className = "dice3d__face dice3d__face--" + def[0];
            var set = PIPS[def[1]];
            for (var cell = 1; cell <= 9; cell++) {
                var c = document.createElement("span");
                if (set.indexOf(cell) !== -1) {
                    c.className = "dice3d__pip";
                }
                face.appendChild(c);
            }
            cube.appendChild(face);
        });
        wrap.appendChild(cube);

        var REST = { x: -35.264, y: -45 };
        var TARGET = {
            1: { x: 0, y: 0 }, 6: { x: 0, y: 180 }, 3: { x: 0, y: -90 },
            4: { x: 0, y: 90 }, 2: { x: -90, y: 0 }, 5: { x: 90, y: 0 }
        };
        var turns = 0;
        var rolling = false;

        cube.addEventListener("click", function () {
            if (rolling) {
                return;
            }
            rolling = true;
            var value = 1 + Math.floor(Math.random() * 6);
            turns += 2;
            var t = TARGET[value];
            cube.style.transform =
                "rotateX(" + (t.x + 360 * turns) + "deg) rotateY(" + (t.y + 360 * turns) + "deg)";

            var go = function () {
                window.location.href = FACE_TO_PAGE[value];
            };
            cube.addEventListener("transitionend", go, { once: true });

            window.setTimeout(go, 1500);
        });

        cube.style.transform = "rotateX(" + REST.x + "deg) rotateY(" + REST.y + "deg)";
        return wrap;
    }
})();
