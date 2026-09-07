/* Portable concept film with optional browser speech. No external player or rendering library. */
(() => {
    'use strict';
    const film = document.querySelector('.film');
    if (!film) return;

    const views = ["today", "dispatch", "configure", "background", "editor", "browser", "computer", "research", "meeting", "switch", "os", "results"];
    const sceneLabels = ["Meet Sam", "WebChat and Copilot", "Build the RoboTeam", "Background tasks", "Write and publish", "Browser use", "Computer use", "Research", "WebMeet", "Switch teams", "Why an OS?", "Results"];
    const scenes = [
    [
        "MONDAY / SAM'S OFFICE",
        "Meet Sam.",
        "Sam has three teams, four deadlines, and one pair of hands.",
        "Meet Sam. He writes books, coordinates marketing for his books, and leads machine-learning research. Today, a chapter, a book launch, an LLM study, and a European project budget all need his attention. He keeps switching teams, finding files, and explaining the same context again. There is little time left for the work he actually wants to do."
    ],
    [
        "ASSISTOS COPILOT",
        "A place for each team.",
        "WebChat is the interface to the AssistOS Copilot.",
        "Sam brings these teams into AssistOS and opens WebChat, the interface to its Copilot. He describes what each project needs. Copilot helps him assign tasks to Robots and follow their progress. Books, Marketing, and Research each have their own workspace, with their own people, projects, and access rules."
    ],
    [
        "BUILD YOUR TEAM",
        "Choose tools. Define a role.",
        "Sam or his IT team builds the Books RoboTeam.",
        "Before the work starts, Sam sets up his Books RoboTeam. He can choose agent packages from the AssistOS catalog or use custom code prepared by his IT team. For each Robot, he defines a role, permitted skills, and project access. SCRIPTA helps draft the chapters, Proof reviews them, and Layout prepares the pages. Sam remains the author."
    ],
    [
        "BOOKS / WEBCHAT",
        "Background work, in view.",
        "WebChat keeps background tasks visible and under control.",
        "With his team in place, Sam asks Copilot to build a book preview and check the references. He follows the work in WebChat. Robots can run CLI commands, coding agents, agents for trustworthy AI checks, or other packaged and custom agents. Copilot keeps the background tasks visible, so Sam can redirect the work, pause it, or stop it without staying beside a terminal."
    ],
    [
        "BOOKS / MANUSCRIPT",
        "The chapter is ready to review.",
        "An IDE for writing, research and other work.",
        "When the preview is ready, Sam returns to the manuscript. He opens a chapter beside its sources and revision history, then reviews the proposed edits. This is the IDE idea applied beyond code: one environment for creating work and checking it. When Sam approves the finished book, SCRIPTA publishes it on scriptahub.com."
    ],
    [
        "MARKETING / BOOK LAUNCH",
        "Scout researches the launch.",
        "Sam watches Scout research publications in its browser.",
        "Now Sam switches to Marketing to help readers discover the book. Scout uses its browser to research relevant publications, while Studio prepares campaign material. Sam can watch the browser, pause the Robot, or take control himself. Once the outreach draft is ready, he reviews the message and decides whether to send it."
    ],
    [
        "RESEARCH / EU PROJECT BUDGET",
        "Pip works in the spreadsheet.",
        "Sam follows Pip's work in the desktop spreadsheet.",
        "His next stop is Research, where the European project budget has its own AssistOS workspace. Pip works through staff, travel, and equipment costs in a desktop spreadsheet. This is computer use, with the Robot operating an application Sam can watch. Sam can take control at any point. He and the project officer review the figures before submission."
    ],
    [
        "RESEARCH / LLM STUDY",
        "Compare. Test. Keep the evidence.",
        "The researchers compare results and review changes through GitHub.",
        "In another Research project, Ada compares baseline and smoothed LLM outputs, while Check evaluates the results. The team keeps the scripts and notes together. Any workspace folder can be put in a GitHub repository, or kept local. For this study, the researchers choose GitHub so colleagues can review proposed changes and contribute their own work."
    ],
    [
        "RESEARCH / REVIEW ROOM",
        "The whole team joins the call.",
        "WebMeet brings colleagues and the RoboTeam into one room.",
        "To discuss those results, Sam joins Lee and Robin in the study's WebMeet room. Ada, Check, and Pip join as visible Robot participants. Lee asks Check to add a held-out test to the shared plan, and everyone can see the change. The room uses the study's approved context, so the discussion stays with the right project."
    ],
    [
        "SWITCH WORKSPACE",
        "A different team. Its own context.",
        "Sam changes workspace. The right people and work come with it.",
        "After the call, Sam returns to Books or continues with Marketing. Each workspace brings together the right colleagues, RoboTeam, projects, and meeting rooms. With the right access, colleagues can connect from a laptop or phone, manage Robots together, and follow each other's work across subprojects. Folders can stay local or connect to GitHub. Sam moves between responsibilities without mixing the teams' work."
    ],
    [
        "ASSISTOS / ORGANIZING THE WORK",
        "Why an operating layer?",
        "AssistOS gives the virtual team a place to work and a history to keep.",
        "Underneath, Linux containers help isolate agent code and protect the host machine. AssistOS can run on your computer or on a cloud server shared by a team. Its open-source platform was developed in Achilles, a European research project, to control AI agents. Individual agents can have different licenses. This is the OS idea: managing workers, tasks, and permissions while project files and history survive a change of model or agent."
    ],
    [
        "SAM'S NEXT WORKING DAY",
        "Less coordination. More decisions.",
        "Sam leads the work and makes the decisions.",
        "Sam can now review what each team has accomplished. SCRIPTA has published his approved book on scriptahub.com. Marketing has prepared the outreach, and Research has experiment records and a budget to review. He still writes and researches, but spends less time carrying information between tools. With Robots taking on the supporting tasks, he becomes a manager of the work and keeps responsibility for the decisions."
    ]
];
    const sceneDuration = 8;
    const duration = scenes.length * sceneDuration;
    const viewport = film.querySelector('.film-viewport');
    const world = film.querySelector('.film-world');
    const play = film.querySelector('.film-play');
    const start = film.querySelector('.film-start');
    const playLabel = film.querySelector('.play-label');
    const playSymbol = film.querySelector('.play-symbol');
    const seek = film.querySelector('#film-seek');
    const time = film.querySelector('.film-time');
    const chapters = [...film.querySelectorAll('[data-chapter]')];
    const announcement = film.querySelector('.film-announcement');
    const voiceButton = film.querySelector('.film-voice');
    const synth = window.speechSynthesis;
    const volumeSlider = film.querySelector('.voice-volume');
    const volumeOutput = film.querySelector('.volume-value');
    let volume = 0.35;
    const voiceSupported = Boolean(synth && window.SpeechSynthesisUtterance);
    let voiceEnabled = voiceSupported;
    let utterance = null;
    let narratedScene = -1;
    let voiceToken = 0;
    let voiceWatchdog = null;
    let voiceStarted = false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const portrait = window.matchMedia('(max-width: 680px)');
    let position = 0;
    let currentScene = -1;
    let sceneTransition = null;
    let narrationTail = null;
    let playing = false;
    let lastFrame = 0;
    let frame = null;
    let inView = true;

    function resize() {
        const stageWidth = portrait.matches ? 620 : 1000;
        const stageHeight = portrait.matches ? 690 : 470;
        const scale = Math.min(viewport.clientWidth / stageWidth, 1);
        world.style.transform = `scale(${scale})`;
        world.style.left = `${(viewport.clientWidth - stageWidth * scale) / 2}px`;
        viewport.style.height = `${stageHeight * scale}px`;
        // Fit the rendered panels inside the wall frame, including at narrow widths.
        const projection = film.querySelector('.projection-screen');
        film.querySelectorAll('.scene-panel, .os-scene, .results-scene').forEach(panel => {
            const panelScale = Math.min(1, (projection.clientWidth - 40) / panel.offsetWidth, (projection.clientHeight - 30) / panel.offsetHeight);
            panel.style.transform = `scale(${panelScale})`;
            panel.style.transformOrigin = 'top left';
            panel.style.left = `${projection.offsetLeft + projection.clientLeft + (projection.clientWidth - panel.offsetWidth * panelScale) / 2}px`;
            panel.style.top = `${projection.offsetTop + projection.clientTop + (projection.clientHeight - panel.offsetHeight * panelScale) / 2}px`;
        });
    }

    function formatTime(value) {
        const seconds = Math.floor(value);
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    }

    function render(announce = false) {
        const index = Math.min(scenes.length - 1, Math.floor(position / sceneDuration));
        const sceneTime = position - index * sceneDuration;
        film.dataset.reveal = String(!playing ? 3 : sceneTime < 1 ? 0 : sceneTime < 3 ? 1 : sceneTime < 5 ? 2 : 3);
        if (index !== currentScene) {
            cancelNarration();
            currentScene = index;
            narratedScene = -1;
            const [stamp, title, caption, description] = scenes[index];
            film.dataset.scene = String(index);
            showProjection(views[index]);
            film.querySelector('.stamp-time').textContent = stamp;
            film.querySelector('.stamp-title').textContent = title;
            film.querySelector('#film-caption-title').textContent = caption;
            film.querySelector('#film-caption-text').textContent = description;
            film.querySelector('.film-current-scene').textContent = `${String(index + 1).padStart(2, '0')} / ${scenes.length} · ${sceneLabels[index]}`;
            chapters.forEach((button, chapter) => {
                if (chapter === index) button.setAttribute('aria-current', 'step');
                else button.removeAttribute('aria-current');
            });
        }
        seek.value = String(position);
        seek.setAttribute('aria-valuetext', voiceEnabled ? `Scene ${index + 1} of ${scenes.length}. ${scenes[index][2]}` : `${formatTime(position)} of ${formatTime(duration)}. Scene ${index + 1}`);
        time.hidden = voiceEnabled;
        time.textContent = `${formatTime(position)} / ${formatTime(duration)}`;
        if (voiceEnabled && canAnimate() && !utterance && narratedScene !== currentScene) speakScene();
        if (announce) announcement.textContent = `Scene ${index + 1}. ${scenes[index][2]} ${scenes[index][3]}`;
    }

    function showProjection(view) {
        clearTimeout(sceneTransition);
        if (reducedMotion.matches || film.dataset.view === view) {
            film.dataset.view = view;
            delete film.dataset.transitioning;
            return;
        }
        film.dataset.transitioning = 'true';
        sceneTransition = setTimeout(() => {
            film.dataset.view = view;
            delete film.dataset.transitioning;
            sceneTransition = null;
            render();
        }, 180);
    }

    function canAnimate() {
        return playing && inView && !document.hidden;
    }

    function synchronizePlayback() {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        lastFrame = 0;
        film.dataset.playing = String(canAnimate());
        playLabel.textContent = playing ? 'Pause' : position >= duration ? 'Replay' : 'Play';
        playSymbol.textContent = playing ? 'Ⅱ' : '▶';
        play.setAttribute('aria-label', playing ? 'Pause film' : position >= duration ? 'Replay film' : 'Play film');
        if (voiceEnabled) {
            if (canAnimate()) {
                if (utterance) {
                    synth.resume();
                    if (!voiceStarted) watchVoiceStart(voiceToken);
                }
                else if (narratedScene !== currentScene) speakScene();
            } else if (utterance) {
                synth.pause();
                clearTimeout(voiceWatchdog);
                voiceWatchdog = null;
            }
        }
        if (canAnimate()) frame = requestAnimationFrame(tick);
    }

    function tick(now) {
        frame = null;
        if (!canAnimate()) return;
        if (lastFrame) {
            const limit = voiceEnabled && narratedScene !== currentScene ? (currentScene + 1) * sceneDuration - 0.001 : duration;
            position = Math.min(limit, position + (now - lastFrame) / 1000);
        }
        lastFrame = now;
        render();
        if (position >= duration) {
            playing = false;
            synchronizePlayback();
            announcement.textContent = 'Film finished. Replay it, choose a chapter, or read the story below.';
        } else {
            frame = requestAnimationFrame(tick);
        }
    }

    function setPlaying(value) {
        start.hidden = true;
        if (value && position >= duration) {
            position = 0;
            narratedScene = -1;
        }
        playing = value;
        render();
        synchronizePlayback();
    }

    // Voice uses the browser's installed speech service. Each scene waits for its
    // narration before advancing. Pause, seeking and backgrounding control both.
    function cancelNarration() {
        voiceToken += 1;
        clearTimeout(narrationTail);
        clearTimeout(voiceWatchdog);
        voiceWatchdog = null;
        if (utterance && synth) synth.cancel();
        utterance = null;
    }

    function voiceUnavailable() {
        voiceEnabled = false;
        cancelNarration();
        voiceButton.textContent = 'Voice unavailable';
        voiceButton.setAttribute('aria-pressed', 'false');
        voiceButton.title = 'No working English voice is available in this browser. The film and transcript still work.';
        announcement.textContent = voiceButton.title;
        render();
        synchronizePlayback();
    }

    // Keep screen labels intact. Spell initialisms only in the speech payload.
    function narrationText(text) {
        return text.replace(/\bAssistOS\b/gi, 'Assist O S').replace(/\bSCRIPTA\b/g, 'Scripta').replace(/scriptahub\.com/gi, 'Scripta Hub dot com').replace(/\b(?:OS|IDE|AI|IT|EU|ML|LLMs?|MCP|API|CPU|GPU|CLI|PDF)\b/g, abbreviation => {
            const plural = abbreviation.endsWith('s');
            const letters = plural ? abbreviation.slice(0, -1) : abbreviation;
            return letters.split('').join(' ') + (plural ? 's' : '');
        });
    }

    function watchVoiceStart(token) {
        clearTimeout(voiceWatchdog);
        voiceWatchdog = setTimeout(() => {
            if (token === voiceToken && canAnimate() && !voiceStarted) voiceUnavailable();
        }, 8000);
    }

    function selectNarrator(voices) {
        // Browser voices have no gender field. Prefer known English male voices
        // when installed, then fall back to the available English narrator.
        const maleName = /\b(?:male|andrew|guy|ryan|brian|christopher|eric|roger|steffan|david|mark|george|james|daniel|alex|oliver|thomas|arthur|fred|gordon|rishi|aaron)\b/i;
        const english = voices.filter(voice => /^en(?:-|_)/i.test(voice.lang));
        const score = voice => (maleName.test(voice.name) ? 100 : 0)
            + (/natural|neural|premium|enhanced/i.test(voice.name) ? 10 : 0)
            + (/google/i.test(voice.name) ? 8 : 0)
            + (voice.localService ? 2 : 0) + (voice.default ? 1 : 0);
        return english.sort((a, b) => score(b) - score(a))[0];
    }

    function speakScene() {
        if (!voiceSupported || !voiceEnabled || !canAnimate() || film.dataset.transitioning === 'true') return;
        const token = ++voiceToken;
        const spokenScene = currentScene;
        voiceStarted = false;
        utterance = new SpeechSynthesisUtterance(narrationText(scenes[currentScene][3]));
        const voices = synth.getVoices();
        const voice = selectNarrator(voices);
        if (voices.length && !voice) { voiceUnavailable(); return; }
        if (voice) utterance.voice = voice;
        utterance.lang = voice?.lang || 'en-US';
        utterance.rate = 0.96;
        utterance.volume = volume;
        utterance.onstart = () => {
            if (token !== voiceToken) return;
            voiceStarted = true;
            clearTimeout(voiceWatchdog);
            voiceWatchdog = null;
        };
        utterance.onend = () => {
            if (token !== voiceToken) return;
            clearTimeout(voiceWatchdog);
            narrationTail = setTimeout(() => {
                if (token !== voiceToken) return;
                narratedScene = spokenScene;
                utterance = null;
            }, 450);
        };
        utterance.onerror = event => {
            if (token !== voiceToken || ['canceled', 'interrupted'].includes(event.error)) return;
            voiceUnavailable();
        };
        watchVoiceStart(token);
        synth.resume();
        synth.speak(utterance);
    }

    voiceButton.disabled = !voiceSupported;
    voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
    if (!voiceSupported) voiceButton.textContent = 'Voice unavailable';
    voiceButton.addEventListener('click', () => {
        voiceEnabled = !voiceEnabled;
        cancelNarration();
        narratedScene = -1;
        voiceButton.textContent = voiceEnabled ? 'Voice on' : 'Voice off';
        voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
        voiceButton.title = voiceEnabled ? 'Turn off narration' : 'Read the story aloud using a browser voice';
        if (voiceEnabled) setPlaying(true);
        else { render(); synchronizePlayback(); }
    });
    volumeSlider.disabled = !voiceSupported;
    volumeSlider.addEventListener('input', () => {
        volume = Number(volumeSlider.value) / 100;
        volumeOutput.textContent = `${volumeSlider.value}%`;
        volumeSlider.setAttribute('aria-valuetext', `${volumeSlider.value} percent`);
    });
    volumeSlider.addEventListener('change', () => {
        // Some speech engines only read volume when an utterance starts.
        cancelNarration();
        narratedScene = -1;
        if (voiceEnabled && canAnimate()) speakScene();
    });
    window.addEventListener('pagehide', cancelNarration);

    start.addEventListener('click', () => setPlaying(true));
    play.addEventListener('click', () => setPlaying(!playing));
    film.querySelector('.film-restart').addEventListener('click', () => {
        cancelNarration();
        narratedScene = -1;
        position = 0;
        playing = !reducedMotion.matches;
        render(true);
        synchronizePlayback();
    });
    chapters.forEach((button, index) => button.addEventListener('click', () => {
        cancelNarration();
        narratedScene = -1;
        position = index * sceneDuration;
        start.hidden = true;
        playing = false;
        render(true);
        synchronizePlayback();
    }));
    seek.addEventListener('input', () => {
        cancelNarration();
        narratedScene = -1;
        position = Math.max(0, Math.min(duration, Number(seek.value)));
        playing = false;
        render();
        synchronizePlayback();
    });
    seek.addEventListener('change', () => render(true));
    document.addEventListener('visibilitychange', synchronizePlayback);
    reducedMotion.addEventListener('change', () => {
        if (reducedMotion.matches) {
            playing = false;
            synchronizePlayback();
        }
    });
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            synchronizePlayback();
        }, { threshold: 0.15 });
        observer.observe(viewport);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(viewport);
    else window.addEventListener('resize', resize);
    portrait.addEventListener('change', resize);
    film.querySelector('.film-controls').hidden = false;
    film.querySelector('.film-chapters').hidden = false;
    resize();
    render();
    // Narration is on by default. A user gesture starts audio and animation together.
})();
