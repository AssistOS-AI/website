function addEvent() {
    const hamburger = document.querySelector("#hamburger");
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.querySelector('.secondary-menu').classList.toggle("toggle");
        });
    }
}

function initIframeSwitcher() {
    const navButtons = document.querySelectorAll(".iframe-nav-button");
    const iframes = document.querySelectorAll(".integration-iframe");

    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");

            // Deactivate all buttons and iframes
            navButtons.forEach(btn => btn.classList.remove("active"));
            iframes.forEach(iframe => iframe.classList.remove("active"));

            // Activate the clicked button and corresponding iframe
            button.classList.add("active");
            const targetIframe = document.getElementById(targetId);
            if (targetIframe) {
                targetIframe.classList.add("active");
            }
        });
    });
}

function initPage() {
    addEvent();
    initIframeSwitcher();
}

// Run initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", initPage);

// --- Potentially Unused Functions (Kept for reference) ---

function readMore(button) {
    const chevronDown = "<i class=\"fa-solid fa-chevron-down \"></i>";
    const chevronUp = "<i class=\"fa-solid fa-chevron-up \"></i>";
    let text = button.innerHTML.split(" ").slice(0, 2).join(" ");
    const parent = button.parentNode;
    if (text == "Read More") {
        button.innerHTML = "Read Less " + chevronUp;
    }
    if (text == "Read Less") {
        button.innerHTML = "Read More " + chevronDown;
    }
    parent.children.item(0).classList.toggle("truncate-4lines");
}

function viewMoreItems(className, name) {
    let button = event.target;
    const items = Array.from(document.getElementsByClassName(className));
    if (button.innerHTML.includes("View All")) {
        button.innerHTML = "Show Less";
        items.forEach((item) => {
            item.classList.toggle("hidden", false);
        });
    } else {
        button.innerHTML = "View All " + name;
        items.forEach((item, index) => {
            if (index > 1) {
                item.classList.toggle("hidden", true);
            }
        });
    }
}

function showModal(options = {}) {
    const buttonsHTML = (options.buttons || []).map(button => {
        if (!button) {
            return;
        }
        return `<button type=\"button\" class=\"modal_action_button\" button-type=\"${button.type}\">${button.text}</button>`;
    }).join('');
    const dialogHTML = `
        <dialog class=\"axiologic_modal ${options.className}\" modal-type=\"${options.type || \