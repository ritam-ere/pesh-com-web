(function () {
    "use strict";

    var root = document.documentElement;
    var body = document.body;

    var ITEMS = [
        { code: "Зелёный спуск", loc: "61°22″04′", desc: "Альпинистское устройство, найдено в рюкзаке без хозяина у подножия хребта.", photo: "belay" },
        { code: "Сапоги ливня", loc: "12°48″19′", desc: "Резиновые боты цвета мокрого неба. Не промокают даже в мыслях.", photo: "boots" },
        { code: "Стеклянный узел", loc: "88°04″12′", desc: "Прозрачная присоска с тяжёлым сердечником. Держится там, где не за что держаться.", photo: "suction" },
        { code: "Оранжевые плечики", loc: "33°57″70′", desc: "Вешалка, на которой одежда сохнет быстрее. Проверено ходоками.", photo: "hanger" },
        { code: "Бирка Ланга", loc: "45°00″00′", desc: "Брелок с гравировкой и кольцом без ключей. Ключи найдёшь сам.", photo: "keytag" },
        { code: "Ведро для всего", loc: "76°19″88′", desc: "Пластиковая корзина с тиснёным гербом. Вмещает больше, чем кажется.", photo: "basket" },
        { code: "Монета на букву E", loc: "09°48″55′", desc: "Серебряный жетон с завтраком и литерой. Реверс стёрт до блеска.", photo: "coin" },
        { code: "Кружка стрекозы", loc: "53°12″40′", desc: "Керамика с проявленной стрекозой. По утрам пахнет дождём.", photo: "mug" },
        { code: "Хромовый слепок", loc: "138°26″67′", desc: "Металлическая подушка в мелкую точку. Тёплая на ощупь без причины.", photo: "cushion" },
        { code: "Розовый шар", loc: "162°07″21′", desc: "Анодированная сфера с резьбой внутри. Перекатывается строго к северу.", photo: "sphere" },
        { code: "Белый патрон", loc: "14°55″73′", desc: "Гладкий наконечник без оружия. Пишет по памяти, а не по бумаге.", photo: "nib" },
        { code: "Кольцо с державой", loc: "127°10″80′", desc: "Розовая эмаль и серебряный орб. Носившие не сворачивали с пути.", photo: "ring" },
        { code: "Скрепка тишины", loc: "201°33″09′", desc: "Изогнутая проволока, что скрепляет несовместимое. Лёгкая до невесомости.", photo: "pin" },
        { code: "Столбик MOTHER", loc: "88°11″02′", desc: "Розовый колпачок на стальной ножке. Стоит ровно на любой поверхности.", photo: "cap" },
        { code: "Ценник-трафарет", loc: "06°08″06′", desc: "Жёлтая бирка с выцветшей ценой. Срок годности давно условен.", photo: "tag" },
        { code: "Поднос с песком", loc: "124°11″33′", desc: "Стальная чаша с чёрным песком и прорезью. Хранит то, что просыпали.", photo: "tray" }
    ];

    var TOP = [2, 10, 3, 1, 0, 11];
    var BOTTOM = [13, null, 9, 12, 8, null];
    var HINT_BOTTOM = 2;
    var HINT_TOP = 3;

    var trackTop = document.getElementById("track-top");
    var trackBottom = document.getElementById("track-bottom");
    var action = document.getElementById("action");
    var note = document.getElementById("note");
    var exchangeBtn = document.getElementById("exchange");

    var pick = { give: null, receive: null };

    var NOTE_GIVE = "Нажмите на слот в инвентаре ↓,\nчтобы выставить свой айтем на обмен";
    var NOTE_RECEIVE = "Нажмите на слот в инвентаре ↑,\nчтобы получить айтем pesh.com взамен";

    var NBSP = String.fromCharCode(160);
    var STICKY = /(^|[\s(«])(в|во|с|со|к|ко|на|за|из|от|у|о|об|до|по|над|под|при|про|для|без|через|около|между|не|а|и|что|где|чем)\s/gi;
    function glue(text) {
        return text.replace(STICKY, function (m, lead, word) {
            return lead + word + NBSP;
        });
    }

    function makeItemCard(item) {
        var card = document.createElement("button");
        card.type = "button";
        card.className = "item";
        card.innerHTML =
            '<span class="item__inner">' +
                '<span class="item__face item__photo" style="background-image:url(assets/images/items/' + item.photo + '.webp)"></span>' +
                '<span class="item__face item__info">' +
                    "<dt>код</dt><dd>" + item.code + "</dd>" +
                    "<dt>описание</dt><dd>" + glue(item.desc) + "</dd>" +
                    "<dt>локация</dt><dd>" + item.loc + "</dd>" +
                "</span>" +
            "</span>";
        return card;
    }

    function buildRibbon(track, layout, side) {
        track.innerHTML = "";
        var n = layout.length;
        var centerA = Math.floor(n / 2) - 1;
        var centerB = Math.floor(n / 2);

        layout.forEach(function (idx, slotIndex) {
            var slot = document.createElement("div");
            slot.className = "slot";
            slot.dataset.slot = String(slotIndex);

            if (slotIndex === centerA || slotIndex === centerB) {
                slot.classList.add("slot--wide");
            }

            if (idx === null) {
                slot.classList.add("slot--empty");
                slot.innerHTML = '<span class="item item--empty"><span class="slot__plus"></span></span>';
            } else {
                var card = makeItemCard(ITEMS[idx]);
                card.addEventListener("click", function () {
                    onPick(side, slotIndex);
                });
                slot.appendChild(card);
            }
            track.appendChild(slot);
        });

    }

    function centerRibbons() {
        [trackTop, trackBottom].forEach(function (track) {
            var ribbon = track.parentNode;
            ribbon.scrollLeft = Math.max(0, (track.scrollWidth - ribbon.clientWidth) / 2);
        });
    }

    var dot = document.createElement("span");
    dot.className = "dot";
    var onboarded = false;

    function removeDot() {
        if (dot.parentNode) {
            dot.parentNode.removeChild(dot);
        }
    }

    function updateDot() {
        removeDot();
        if (onboarded) {
            return;
        }
        var track = pick.give === null ? trackBottom : (pick.receive === null ? trackTop : null);
        var hint = pick.give === null ? HINT_BOTTOM : HINT_TOP;
        if (track) {
            var slot = track.querySelector('[data-slot="' + hint + '"]');
            if (slot) {
                slot.appendChild(dot);
            }
        }
    }

    function onPick(side, slotIndex) {
        var track = side === "bottom" ? trackBottom : trackTop;
        var key = side === "bottom" ? "give" : "receive";

        setPicked(track, pick[key], false);
        pick[key] = slotIndex;
        setPicked(track, slotIndex, true);

        note.textContent = pick.give === null ? NOTE_GIVE : NOTE_RECEIVE;
        updateDot();
        updateReady();
    }

    function setPicked(track, slotIndex, on) {
        if (slotIndex === null) {
            return;
        }
        var card = track.querySelector('[data-slot="' + slotIndex + '"] .item');
        if (card) {
            card.classList.toggle("is-picked", on);
        }
    }

    function updateReady() {
        var ready = pick.give !== null && pick.receive !== null;
        exchangeBtn.disabled = !ready;
        action.classList.toggle("is-collapsed", ready);
    }

    var modal = document.getElementById("modal");
    var form = document.getElementById("form");
    var modalBody = document.getElementById("modal-body");
    var modalSuccess = document.getElementById("modal-success");
    var fields = Array.prototype.slice.call(form.querySelectorAll(".field"));
    var successTimer = null;

    function openModal() {
        modal.hidden = false;
    }

    function closeModal() {
        modal.hidden = true;
        if (successTimer) {
            window.clearTimeout(successTimer);
            successTimer = null;
        }
    }

    exchangeBtn.addEventListener("click", function () {
        if (!exchangeBtn.disabled) {
            openModal();
        }
    });

    modal.addEventListener("click", function (event) {
        if (event.target.hasAttribute("data-close")) {
            closeModal();
            if (!modalSuccess.hidden) {
                finishExchange();
            }
        }
    });

    fields.forEach(function (field) {
        var input = field.querySelector(".field__input");
        var clear = field.querySelector(".field__clear");

        function sync() {
            field.classList.toggle("has-value", input.value.length > 0);
        }

        input.addEventListener("input", sync);

        clear.addEventListener("click", function () {
            input.value = "";
            sync();
            input.focus();
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!form.reportValidity()) {
            return;
        }
        modalBody.hidden = true;
        modalSuccess.hidden = false;
        successTimer = window.setTimeout(function () {
            closeModal();
            finishExchange();
        }, 5000);
    });

    function finishExchange() {

        if (pick.give !== null && pick.receive !== null) {
            var g = BOTTOM[pick.give];
            BOTTOM[pick.give] = TOP[pick.receive];
            TOP[pick.receive] = g;
        }

        onboarded = true;
        pick = { give: null, receive: null };
        note.textContent = NOTE_GIVE;

        form.reset();
        fields.forEach(function (field) {
            field.classList.remove("has-value");
        });
        modalBody.hidden = false;
        modalSuccess.hidden = true;

        render();
        updateReady();
        updateDot();
    }

    function render() {
        buildRibbon(trackTop, TOP, "top");
        buildRibbon(trackBottom, BOTTOM, "bottom");
        centerRibbons();
        updateDot();
    }

    function updateScale() {

        var w = document.documentElement.clientWidth;
        root.style.setProperty("--scale", String(w / 1280));
        root.style.setProperty("--stage-width", "1280px");
        centerRibbons();
    }

    render();
    updateScale();
    updateReady();
    window.addEventListener("resize", updateScale, { passive: true });

    function playIntro() {
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                body.classList.remove("is-preload");
            });
        });
    }

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(playIntro);
    } else {
        window.addEventListener("load", playIntro);
    }

    var mStage = document.getElementById("m-stage");
    if (mStage) {
        mobileInit();
    }

    function mobileInit() {
        var mCross = document.querySelector(".m-cross");
        var mGrid = document.getElementById("m-grid");
        var mCards = document.getElementById("m-cards");
        var mMatrix = document.getElementById("m-matrix");
        var mLabel = document.getElementById("m-plate-label");
        var mIndex = document.getElementById("m-plate-index");
        var mContent = document.getElementById("m-content");
        var mPanel = document.getElementById("m-panel");
        var mBtn = document.getElementById("m-btn");
        var mForm = document.getElementById("m-form");
        var mSubmit = document.getElementById("m-submit");

        var GIVE = [
            [14, 9, null, 8, 7],
            [13, 12, 5, 4, 6],
            [null, 1, 3, 15, 0]
        ];
        var RECEIVE = [
            [11, 3, 15, 6, 7],
            [2, 1, 4, 5, 13],
            [10, 0, null, 9, 14]
        ];

        var STEPS = {
            give: {
                cls: "is-give", label: "я обменяю...", index: "(1)", matrix: GIVE,
                note: "Нажмите на слот в инвентаре,\nчтобы выставить свой айтем на обмен",
                btn: "хочу обменять это"
            },
            receive: {
                cls: "is-receive", label: "я получу взамен...", index: "(2)", matrix: RECEIVE,
                note: "Нажмите на слот в инвентаре,\nчтобы получить айтем pesh.com взамен",
                btn: "хочу получить это"
            },
            form: { cls: "is-form", label: "мои данные", index: "(3)" }
        };

        var state = "give";
        var pick = { give: null, receive: null };

        [18, 89, 160, 89, 18].forEach(function (w) {
            var col = document.createElement("span");
            col.style.flexGrow = String(w);
            mGrid.appendChild(col);
        });

        function buildMatrix(step) {
            mCards.innerHTML = "";
            var rows = STEPS[step].matrix;
            var cols = rows[0].length;

            for (var c = 0; c < cols; c++) {
                for (var r = 0; r < 3; r++) {
                    var idx = rows[r][c];
                    var cell = document.createElement("button");
                    cell.type = "button";
                    if (idx === null) {
                        cell.className = "m-card m-card--empty";
                        cell.innerHTML = '<span class="slot__plus"></span>';
                    } else {
                        cell.className = "m-card";
                        cell.style.backgroundImage = "url(assets/images/items/" + ITEMS[idx].photo + ".webp)";
                        cell.dataset.item = String(idx);
                        cell.addEventListener("click", onPickMobile);
                    }
                    mCards.appendChild(cell);
                }
            }

            mMatrix.scrollLeft = Math.max(0, (mCards.scrollWidth - mMatrix.clientWidth) / 2);
        }

        function onPickMobile() {
            var prev = mCards.querySelector(".m-card.is-picked");
            if (prev) {
                prev.classList.remove("is-picked");
            }
            this.classList.add("is-picked");
            pick[state] = parseInt(this.dataset.item, 10);
            showInfo(ITEMS[pick[state]]);
            mBtn.disabled = false;
        }

        function showPlaceholder(step) {
            var p = document.createElement("p");
            p.className = "m-note";
            p.style.whiteSpace = "pre-line";
            p.textContent = STEPS[step].note;
            mContent.innerHTML = "";
            mContent.appendChild(p);
        }

        function showInfo(item) {
            mContent.innerHTML =
                '<dl class="m-info">' +
                    '<div class="m-info__row"><dt>код</dt><dd>' + item.code + "</dd></div>" +
                    '<div class="m-info__row"><dt>описание</dt><dd>' + glue(item.desc) + "</dd></div>" +
                    '<div class="m-info__row"><dt>локация</dt><dd>' + item.loc + "</dd></div>" +
                "</dl>";
        }

        function applyStep(step) {
            state = step;
            var s = STEPS[step];
            mCross.classList.remove("is-give", "is-receive", "is-form");
            mCross.classList.add(s.cls);
            mLabel.textContent = s.label;
            mIndex.textContent = s.index;

            if (step === "form") {
                mMatrix.hidden = true;
                mPanel.hidden = true;
                mForm.hidden = false;
                return;
            }
            mForm.hidden = true;
            mMatrix.hidden = false;
            mPanel.hidden = false;
            mBtn.textContent = s.btn;
            mBtn.disabled = pick[step] === null;
            showPlaceholder(step);
        }

        function swapMatrixTo(step) {

            mMatrix.classList.add("is-leaving");
            window.setTimeout(function () {
                applyStep(step);
                buildMatrix(step);
                mMatrix.classList.remove("is-leaving");
                mMatrix.classList.add("is-entering");
                requestAnimationFrame(function () {
                    requestAnimationFrame(function () {
                        mMatrix.classList.remove("is-entering");
                        mMatrix.classList.add("is-entered");
                    });
                });
                window.setTimeout(function () {
                    mMatrix.classList.remove("is-entered");
                }, 650);
            }, 500);
        }

        mBtn.addEventListener("click", function () {
            if (mBtn.disabled) {
                return;
            }
            if (state === "give") {
                swapMatrixTo("receive");
            } else if (state === "receive") {
                applyStep("form");
            }
        });

        var mFields = Array.prototype.slice.call(mForm.querySelectorAll(".m-field"));
        mFields.forEach(function (field) {
            var input = field.querySelector(".m-field__input");
            var clear = field.querySelector(".m-field__clear");
            input.addEventListener("input", function () {
                field.classList.toggle("has-value", input.value.length > 0);
            });
            clear.addEventListener("click", function () {
                input.value = "";
                field.classList.remove("has-value");
                input.focus();
            });
        });

        mForm.addEventListener("submit", function (event) {
            event.preventDefault();
            if (!mForm.reportValidity()) {
                return;
            }
            mSubmit.classList.add("is-busy");
            mSubmit.disabled = true;
            mSubmit.textContent = "обмен...";
            window.setTimeout(function () {
                mSubmit.textContent = "поздравляем!";
                window.setTimeout(resetMobile, 1400);
            }, 900);
        });

        function resetMobile() {

            if (pick.give !== null && pick.receive !== null) {

            }
            pick = { give: null, receive: null };
            mForm.reset();
            mFields.forEach(function (f) { f.classList.remove("has-value"); });
            mSubmit.classList.remove("is-busy");
            mSubmit.disabled = false;
            mSubmit.textContent = "обменять айтем";
            applyStep("give");
            buildMatrix("give");
        }

        window.addEventListener("resize", function () {
            if (!mMatrix.hidden) {
                mMatrix.scrollLeft = Math.max(0, (mCards.scrollWidth - mMatrix.clientWidth) / 2);
            }
        }, { passive: true });

        applyStep("give");
        buildMatrix("give");
    }
})();
