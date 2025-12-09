document.addEventListener("DOMContentLoaded", () => {
    const settingsDrawer  = document.getElementById("settings_drawer");
    const settingsToggle  = document.getElementById("settings_toggle");
    const drawerCloseBtn  = document.getElementById("settings_drawer_close");

    if (!settingsDrawer || !settingsToggle || !drawerCloseBtn) return;

    const settingButtons = settingsDrawer.querySelectorAll(".settings_drawer_setting > button");
    const root           = document.documentElement;

    /* ------------------------ Drawer open / close ------------------------ */

    function openDrawer() {
        settingsDrawer.classList.add("active");
    }

    function closeDrawer() {
        settingsDrawer.classList.remove("active");
        closeAllSettingDrawers();
    }

    settingsToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        openDrawer();
    });

    drawerCloseBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        closeDrawer();
    });

    // Close on Esc
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });

    // Close when clicking anywhere outside the drawer & toggle
    document.addEventListener("click", (e) => {
        const clickedInsideDrawer = e.target.closest("#settings_drawer");
        const clickedToggle       = e.target.closest("#settings_toggle");

        if (
            settingsDrawer.classList.contains("active") &&
            !clickedInsideDrawer &&
            !clickedToggle
        ) {
            closeDrawer();
        }
    });

    /* ------------------------ Helpers ------------------------ */

    function closeAllSettingDrawers(except = null) {
        settingsDrawer
            .querySelectorAll(".settings_drawer_setting_drawer")
            .forEach((drawer) => {
                if (drawer !== except) drawer.classList.remove("open");
            });
    }

    function updateButtonLabelFromOption(button, optionEl) {
        const labelEl = optionEl.querySelector("p");
        if (!labelEl) return;

        const newText = labelEl.textContent.trim();

        // text node directly inside the button (before SVG/div)
        const textNode = Array.from(button.childNodes).find(
            (node) =>
                node.nodeType === Node.TEXT_NODE &&
                node.textContent.trim() !== ""
        );

        if (textNode) {
            textNode.textContent = " " + newText + " ";
        }
    }

    /* ------------------------ THEME LOGIC ------------------------ */

    function applyTheme(label) {
        // label is exactly one of: "System Settings", "Dark Mode", "Light Mode"
        if (label === "Dark Mode") {
            root.setAttribute("data-theme", "dark");
        } else if (label === "Light Mode") {
            root.setAttribute("data-theme", "light");
        } else {
            // System: follow OS (no explicit data-theme, CSS + prefers-color-scheme handles it)
            root.removeAttribute("data-theme");
        }
    }

    function applyScrollMode(label) {
        // label: "Default" | "Only Once" | "Off"
        const normalised = label.toLowerCase().replace(/\s+/g, "-"); // default, only-once, off

        const root = document.documentElement;
        root.dataset.scrollAnimations = normalised;

        // Tell animateOnScroll.js to switch modes, if it has been loaded
        if (window.setScrollAnimationMode) {
            window.setScrollAnimationMode(normalised);
        }
    }

    function restoreSetting(labelTitle, savedValue) {
        if (!savedValue) return;

        const settingEl = Array.from(
            settingsDrawer.querySelectorAll(".settings_drawer_setting")
        ).find((li) => {
            const titleEl = li.querySelector(".settings_drawer_setting_label h2");
            return titleEl && titleEl.textContent.trim() === labelTitle;
        });

        if (!settingEl) return;

        const button = settingEl.querySelector("button");
        const drawer = settingEl.querySelector(".settings_drawer_setting_drawer");
        if (!button || !drawer) return;

        const option = Array.from(
            drawer.querySelectorAll(".settings_drawer_setting_drawer_setting")
        ).find((opt) => {
            const p = opt.querySelector("p");
            return p && p.textContent.trim() === savedValue;
        });

        if (!option) return;

        // visually mark as selected
        drawer
            .querySelectorAll(".settings_drawer_setting_drawer_setting")
            .forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // update button label text
        updateButtonLabelFromOption(button, option);
    }

    /* ------------------------ Restore from localStorage ------------------------ */

    const savedTheme  = localStorage.getItem("settings_background_theme");
    const savedScroll = localStorage.getItem("settings_scroll_animations");

    if (savedTheme) {
        applyTheme(savedTheme);
        restoreSetting("Background Theme", savedTheme);
    }

    if (savedScroll) {
        applyScrollMode(savedScroll);
        restoreSetting("Scroll Animations", savedScroll);
    }

    /* ------------------------ Wire up setting buttons ------------------------ */

    settingButtons.forEach((button) => {
        const drawer = button.querySelector(".settings_drawer_setting_drawer");
        if (!drawer) return;

        // Open/close this dropdown
        button.addEventListener("click", (e) => {
            const clickedInsideDropdown = e.target.closest(".settings_drawer_setting_drawer");
            if (clickedInsideDropdown) return; // option clicks handled separately

            const isOpen = drawer.classList.contains("open");
            closeAllSettingDrawers(drawer);

            if (!isOpen) drawer.classList.add("open");
            else drawer.classList.remove("open");
        });

        const options = drawer.querySelectorAll(".settings_drawer_setting_drawer_setting");

        options.forEach((option) => {
            option.addEventListener("click", () => {
                // visual selected state
                options.forEach((opt) => opt.classList.remove("selected"));
                option.classList.add("selected");

                // update button label
                updateButtonLabelFromOption(button, option);

                // identify which setting this is
                const settingWrapper = button.closest(".settings_drawer_setting");
                const titleEl = settingWrapper?.querySelector(".settings_drawer_setting_label h2");
                const settingTitle = titleEl ? titleEl.textContent.trim() : "";

                const valueEl = option.querySelector("p");
                const value = valueEl ? valueEl.textContent.trim() : "";

                if (settingTitle === "Background Theme") {
                    applyTheme(value);
                    localStorage.setItem("settings_background_theme", value);
                }

                if (settingTitle === "Scroll Animations") {
                    applyScrollMode(value);
                    localStorage.setItem("settings_scroll_animations", value);
                }

                drawer.classList.remove("open");
            });
        });
    });
});