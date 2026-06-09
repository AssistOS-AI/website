function addEvent() {
    const hamburger = document.querySelector("#hamburger");
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            document.querySelector('.secondary-menu').classList.toggle("toggle");
        });
    }
}

function initIframeSwitcher() {
    const navButtons = document.querySelectorAll("button.iframe-nav-button");
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

function toggleMore(element) {
    const paragraph = element.previousElementSibling;
    if (paragraph.classList.contains('truncated')) {
        paragraph.classList.remove('truncated');
        paragraph.classList.add('expanded');
        element.textContent = 'Less';
    } else {
        paragraph.classList.remove('expanded');
        paragraph.classList.add('truncated');
        element.textContent = 'More...';
    }
}

function copyCurrentLink() {
    const activeButton = document.querySelector('.iframe-nav-button.active');
    if (activeButton) {
        const url = activeButton.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(() => {
            const copyBtn = document.querySelector('.copy-link-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 1500);
        });
    }
}

function initPage() {
    addEvent();
    initIframeSwitcher();
}

// Run initialization when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    initPage();
    initVideoPrompt();
});

// --- Video Modal Logic ---
function initVideoPrompt() {
    // Only show on the index page where the modal exists
    const promptModal = document.getElementById('video-prompt-modal');
    if (!promptModal) return;

    const hasBeenAsked = localStorage.getItem('assistos_video_asked');
    if (!hasBeenAsked) {
        // Show prompt after a short delay
        setTimeout(() => {
            promptModal.classList.add('show');
        }, 1000);
    }
}

function closeVideoPrompt(playVideo) {
    localStorage.setItem('assistos_video_asked', 'true');
    const promptModal = document.getElementById('video-prompt-modal');
    if (promptModal) {
        promptModal.classList.remove('show');
    }
    
    if (playVideo) {
        openVideoModal();
    }
}

function openVideoModal() {
    const videoModal = document.getElementById('video-player-modal');
    const iframe = document.getElementById('youtube-iframe');
    if (videoModal && iframe) {
        // Automatically mark as asked if they open it manually
        localStorage.setItem('assistos_video_asked', 'true');
        
        iframe.src = "https://www.youtube.com/embed/-mTZYD3n07I?autoplay=1";
        videoModal.classList.add('show');
    }
}

function closeVideoModal() {
    const videoModal = document.getElementById('video-player-modal');
    const iframe = document.getElementById('youtube-iframe');
    if (videoModal && iframe) {
        videoModal.classList.remove('show');
        // Stop video playback
        iframe.src = "";
    }
}


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
