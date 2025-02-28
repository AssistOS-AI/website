function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function readMore(button) {
    const chevronDown = "<i class=\"fa-solid fa-chevron-down \"></i>"
    const chevronUp = "<i class=\"fa-solid fa-chevron-up \"></i>"
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
        button.innerHTML = "Show Less"
        items.forEach((item) => {
            item.classList.toggle("hidden", false);
        })
    } else {
        button.innerHTML = "View All " + name;
        items.forEach((item, index) => {
            if (index > 1) {
                item.classList.toggle("hidden", true);
            }

        })

    }

}

function showModal(options = {}) {
    const buttonsHTML = (options.buttons || []).map(button => {
        if (!button) {
            return
        }
        return `<button type="button" class="modal_action_button" button-type="${button.type}">${button.text}</button>`;
    }).join('')
    const dialogHTML = `
        <dialog class="axiologic_modal ${options.className}" modal-type="${options.type || "error"}">
            <div class="dialog_header">
                 <div class="dialog_title">${options.title || ""}</div>
                 <button class="dialog_close_btn pointer" aria-label="Close"></button>
            </div>
             <section class="dialog_content">
                <div class="dialog_message_container">${options.modalTxt}</div>
                <div class="dialog_actions_container">${buttonsHTML}</div>
            </section>
        </dialog>`;
    document.body.insertAdjacentHTML('afterbegin', dialogHTML);
    const dialog = document.querySelector('dialog.axiologic_modal');
    const actionButtons = dialog.querySelectorAll('.modal_action_button');
    actionButtons.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            if (options.buttons && options.buttons[index].onClick) {
                await options.buttons[index].onClick();
            }
            dialog.close();
            dialog.remove();
        });
    });
    const closeButton = dialog.querySelector('.dialog_close_btn');
    closeButton.addEventListener('click', () => {
        dialog.close();
        dialog.remove();
    });

    // Show the dialog
    dialog.showModal();
    return dialog;
}

function addEvent() {
    document.querySelector("#hamburger").addEventListener('click', (element) => {
        document.querySelector('.secondary-menu').classList.toggle("toggle")
    })
}

function closeCookiesAgreement() {
    let video = document.querySelector('#home_video');
    document.querySelector('#video_placeholder').style.display = 'none';
    video.style.display = "block";
    video.play();
    video.muted = false;
    sessionStorage.setItem("user_agree", "true");
    /* document.querySelector("#mute_btn").click();*/
}

function closePopup() {
    const agreeModal = document.querySelector('dialog.axiologic_modal');
    agreeModal.close();
    agreeModal.style.display = "none";
    document.querySelector('#privacy_link').click();
}

function showCookieAgreement() {
    if (!sessionStorage.getItem("user_agree")) {
        let agreeModal = showModal({
            type: "",
            className: "site_cookies_info",
            modalTxt: 'Our website does not use cookies or any similar tracking technologies. We do not collect, store, or process any personal data from our visitors.',
            buttons: [{
                text: "Ok",
                type: "main_action",
                onClick: closeCookiesAgreement
            }]
        });
        agreeModal.querySelector('.dialog_close_btn').style.display = "none";
        agreeModal.addEventListener('cancel', (event) => {
            agreeModal.close();
            agreeModal.style.display = "none";
        });
    } else {
        closeCookiesAgreement();
    }
}

/*document.addEventListener("scroll", () => {
    document.querySelector('.secondary-menu').classList.toggle("toggle", false);
})

window.onresize = function () {
    if (window.innerWidth > 900) {
        document.querySelector(".secondary-menu").classList.toggle("toggle", false);
    }
}*/
