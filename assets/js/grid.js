(function () {
    "use strict";

    var PATTERNS = {
        desktop: [20, 47, 74, 101, 128, 155, 182, 155, 128, 101, 74, 47, 20],
        mobile: [18, 89, 160, 89, 18]
    };

    var MOBILE_QUERY = window.matchMedia("(max-width: 767px)");
    var grid = document.getElementById("grid");
    var currentMode = null;

    function build(mode) {
        if (mode === currentMode) {
            return;
        }
        currentMode = mode;

        var fragment = document.createDocumentFragment();
        PATTERNS[mode].forEach(function (width) {
            var column = document.createElement("span");
            column.className = "grid__col";
            column.style.flexGrow = String(width);
            fragment.appendChild(column);
        });

        grid.replaceChildren(fragment);
    }

    function render() {
        build(MOBILE_QUERY.matches ? "mobile" : "desktop");
    }

    render();
    MOBILE_QUERY.addEventListener("change", render);
})();
