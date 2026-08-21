function addEvent() {
    const hamburger = document.querySelector("#hamburger");
    const secondaryMenu = document.querySelector('.secondary-menu');
    if (!hamburger || !secondaryMenu) return;

    const closeMobileMenu = () => {
        secondaryMenu.classList.remove('toggle');
        hamburger.setAttribute('aria-expanded', 'false');
    };

    hamburger.addEventListener('click', () => {
        secondaryMenu.classList.toggle('toggle');
        hamburger.setAttribute('aria-expanded', String(secondaryMenu.classList.contains('toggle')));
    });

    document.addEventListener('click', event => {
        if (!hamburger.contains(event.target) && !secondaryMenu.contains(event.target)) {
            closeMobileMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeMobileMenu();
    });
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
    initSiteNavigation();
    addEvent();
    initIframeSwitcher();
    initResearchEmbed();
}

function initSiteNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    const page = window.location.pathname.split('/').pop() || 'index.html';
    const prefix = window.location.pathname.includes('/whitepaper/') ? '../' : '';
    const homeActive = ['index.html', 'vision.html', 'developers.html', 'embed.html'].includes(page) || window.location.pathname.includes('/whitepaper/');
    const researchActive = ['research.html', 'toolchain.html', 'wormhole.html', 'archive.html'].includes(page);
    const homeClass = homeActive ? ' active-nav' : '';
    const researchClass = researchActive ? ' active-nav' : '';
    const toolLinks = [
        ['AGISystem2', 'agisystem'], ['AchillesAgentLib', 'agentlib'], ['Ploinky', 'ploinky'],
        ['Achilles IDE', 'ide'], ['Achilles CLI (Copilot)', 'cli'], ['SOPlang Pipeline', 'soplang'],
        ['AchillesCopilotBasicSkills', 'basicskills']
    ].map(([label, tool]) => `<li><a href="${prefix}research.html?tool=${tool}">${label}</a></li>`).join('');

    nav.innerHTML = `
        <div class="logo-img"><a href="${prefix}index.html"><img src="${prefix}assets/images/assistos-logo.svg" alt="AssistOS" class="logo"></a></div>
        <ul class="main-menu menu-desktop">
            <li class="nav-dropdown"><button class="nav-trigger${homeClass}" type="button" aria-expanded="false">Home <span aria-hidden="true">⌄</span></button>
                <ul class="nav-submenu">
                    <li><a href="${prefix}vision.html">Vision</a></li>
                    <li><a href="${prefix}whitepaper/index.html">Whitepaper</a></li>
                    <li><a href="${prefix}developers.html">Developers</a></li>
                </ul>
            </li>
            <li class="nav-dropdown"><button class="nav-trigger${researchClass}" type="button" aria-expanded="false">Research <span aria-hidden="true">⌄</span></button>
                <ul class="nav-submenu nav-submenu-wide">
                    <li><a href="${prefix}research.html">Research Foundation</a></li>
                    <li><a href="${prefix}toolchain.html">Integrated Toolchain</a></li>
                    <li><a href="${prefix}wormhole.html">Ploinky Wormhole</a></li>
                    <li class="nav-submenu-label">Ecosystem tools</li>${toolLinks}
                </ul>
            </li>
            <li><a href="${prefix}index.html#contact" class="nav-contact">Contact us</a></li>
        </ul>
        <button class="hamburger-lines" id="hamburger" type="button" aria-label="Open navigation" aria-expanded="false"><span class="line"></span><span class="line"></span><span class="line"></span></button>
        <ul class="secondary-menu">
            <li class="mobile-menu-title">Home</li>
            <li><a href="${prefix}vision.html">Vision</a></li><li><a href="${prefix}whitepaper/index.html">Whitepaper</a></li><li><a href="${prefix}developers.html">Developers</a></li>
            <li class="mobile-menu-title">Research</li>
            <li><a href="${prefix}research.html">Research Foundation</a></li><li><a href="${prefix}toolchain.html">Integrated Toolchain</a></li><li><a href="${prefix}wormhole.html">Ploinky Wormhole</a></li>
            ${toolLinks}
            <li><a href="${prefix}index.html#contact" class="nav-contact">Contact us</a></li>
        </ul>`;

}

function initResearchEmbed() {
    const host = document.querySelector('[data-research-embed]');
    if (!host) return;
    const tools = {
        agisystem: ['AGISystem2', 'https://agisystem2.com/', 'Logical reasoning and validation environment.'],
        agentlib: ['AchillesAgentLib', 'https://assistos-ai.github.io/AchillesAgentLib/', 'Cognitive architecture patterns for building agents.'],
        ploinky: ['Ploinky', 'https://ploinky.com/', 'Runtime and deployment environment for AI agents.'],
        ide: ['Achilles IDE', 'https://assistos-ai.github.io/AssistOSExplorer/', 'A workspace for building and inspecting agentic projects.'],
        cli: ['Achilles CLI (Copilot)', 'https://assistos-ai.github.io/AchillesCLI/', 'Command-line automation for the AssistOS ecosystem.'],
        soplang: ['SOPlang Pipeline', 'https://assistos-ai.github.io/soplang/', 'Specification-oriented language and pipeline research.'],
        basicskills: ['AchillesCopilotBasicSkills', 'https://assistos-ai.github.io/AchillesCopilotBasicSkills/', 'Reusable core skills for AssistOS agents.']
    };
    const tool = tools[new URLSearchParams(window.location.search).get('tool')];
    if (!tool) return;
    const [title, url, description] = tool;
    document.title = `${title} — AssistOS Research`;
    host.innerHTML = `<div class="embed-heading"><p class="eyebrow">AssistOS Research / Ecosystem tool</p><h1>${title}</h1><p>${description}</p><a href="${url}" target="_blank" rel="noopener">Open in a new window <span aria-hidden="true">↗</span></a></div><div class="research-iframe-shell"><iframe src="${url}" title="${title}" loading="lazy"></iframe></div>`;
    const defaultContent = document.querySelector('[data-research-default]');
    if (defaultContent) defaultContent.hidden = true;
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
        
        iframe.src = "https://www.youtube.com/embed/25bR9o8iWa4?autoplay=1";
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
