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
        "Meet Sam. He writes books and promotes them with his marketing team. He also leads research into machine learning. Today, a chapter and a book launch need his attention. So do an LLM study and a European project budget. He keeps switching teams and searching for the right files. Even with AI chat, he has to explain the same context again. His own writing and research keep getting pushed aside."
    ],
    [
        "ASSISTOS COPILOT",
        "A place for each team.",
        "Each workspace has a different RoboTeam.",
        "Sam opens WebChat, the interface to the AssistOS Copilot. He describes what needs doing in each team's workspace. Books, Marketing, and Research each have a separate workspace. Each workspace has different Robots, roles, and access rules. Copilot assigns tasks to that workspace's RoboTeam and tracks their progress. Changing workspace brings Sam that team's Robots and colleagues."
    ],
    [
        "BUILD YOUR TEAM",
        "Choose tools. Define a role.",
        "Sam configures packaged agents to create the Robots in his RoboTeam.",
        "Sam first sets up the Books RoboTeam. He chooses agents from the AssistOS catalog. These are software packages that run in Linux containers. His own IT team can also prepare custom agents. Each Robot is a configured instance of that software. Sam sets its subscriptions, preferences, permitted skills, and instructions. He also defines its role and workspace access. SCRIPTA drafts chapters, Proof reviews them, and Layout prepares the pages. Sam remains the author."
    ],
    [
        "BOOKS / WEBCHAT",
        "Background work, in view.",
        "WebChat keeps background tasks visible and under control.",
        "With his team ready, Sam asks Copilot to prepare a book preview. He also asks it to check the references. WebChat shows what each Robot is doing in the background. Robots can run CLI commands, coding agents, or custom agents. Robots can also use agents that check sources and results for trustworthy AI. Sam can redirect, pause, or stop a task from WebChat. He can then return to his work while the Robots continue."
    ],
    [
        "BOOKS / MANUSCRIPT",
        "AssistOS as an IDE.",
        "AssistOS as an IDE: write, check and review in one workspace.",
        "The preview is ready, so Sam opens the book in Explorer. This is AssistOS as an IDE, an integrated development environment. Developers use one to keep their files, editor, and checks together. Sam does the same for his book. He compares SCRIPTA's edits with the original chapter. He reads Proof's notes before accepting the revision. When Sam approves the finished book, SCRIPTA publishes it on scriptahub.com."
    ],
    [
        "MARKETING / BOOK LAUNCH",
        "Scout researches the launch.",
        "Sam watches Scout research publications in its browser.",
        "Sam switches to Marketing to help readers discover his book. Scout uses its browser to research relevant publications. Meanwhile, Studio prepares material for the book campaign. Sam can watch the browser, pause Scout, or take control himself. He reviews the outreach draft and decides whether to send it."
    ],
    [
        "RESEARCH / EU PROJECT BUDGET",
        "Hugo works in the spreadsheet.",
        "Sam follows Hugo's work in the desktop spreadsheet.",
        "Sam next opens the Research team's European project budget. The budget has its own AssistOS workspace. Hugo prepares staff, travel, and equipment costs in a desktop spreadsheet. This is computer use: a Robot working in an application Sam can watch. Sam can take control at any point. He reviews the figures with the project coordinator before submission."
    ],
    [
        "RESEARCH / LLM STUDY",
        "Compare. Test. Keep the evidence.",
        "The researchers compare results and review changes through GitHub.",
        "Sam then opens the workspace for the LLM study. Atlas compares baseline and smoothed LLM outputs. Vera evaluates the results. The team keeps its scripts, data, and notes together. Any workspace folder can stay local or use a GitHub repository. Here, the researchers use GitHub to review and share their changes."
    ],
    [
        "RESEARCH / REVIEW ROOM",
        "The whole team joins the call.",
        "WebMeet brings colleagues and the RoboTeam into one room.",
        "Sam joins Lee and Robin in the study's WebMeet room. Atlas, Vera, and Hugo join as visible Robot participants. Lee asks Vera to add a held-out test to the shared plan. Everyone sees the change as they discuss it. The room uses the study's approved context. The meeting and its work stay with the right project."
    ],
    [
        "SWITCH WORKSPACE",
        "A different team. Its own context.",
        "Switching workspace brings Sam a different RoboTeam.",
        "After the meeting, Sam switches workspace and RoboTeam. Books has SCRIPTA, Proof, and Layout. Marketing has Scout, Studio, and Pulse. Research has Atlas, Vera, and Hugo. Each workspace keeps its own Robot settings, files, and meeting rooms. Colleagues with access can connect from a laptop or phone. They can manage Robots together and follow work across subprojects. Folders can stay local or connect to GitHub."
    ],
    [
        "ASSISTOS / ORGANIZING THE WORK",
        "Why an operating layer?",
        "AssistOS gives the virtual team a place to work and a history to keep.",
        "Linux containers help isolate agent code and protect the host machine. AssistOS can run on your computer or a cloud server shared by a team. Axiologic developed the open-source platform in the European Achilles project. The research project created an environment for controlling AI agents. Individual agents can have different licenses. This is the OS idea applied to virtual workers. AssistOS manages their homes, tasks, and permissions. Your project files and history remain when you change models or agents."
    ],
    [
        "START YOUR OWN WORKSPACE",
        "Thank you!",
        "Bring your own workflows. The AssistOS team can help you integrate them.",
        "Sam's day is just one example. Robots can help with many kinds of intellectual work. They can control browsers, use desktop apps, or run CLI tools. You give them those capabilities through their configured agents. The AssistOS team is happy to help you build your own integrations. AssistOS is open source and easy to install. Visit the Installation page to set up your first workspace. Open the Research menu for technical documentation. Thank you!"
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
    const nextSteps = film.querySelector('.film-next-steps');
    const voiceButton = film.querySelector('.film-voice');
    const subtitlesButton = film.querySelector('.film-subtitles-toggle');
    const subtitle = film.querySelector('.film-subtitle');
    const cues = scenes.map(scene => splitNarration(scene[3]));
    let subtitlesEnabled = true;
    let cueIndex = 0;
    let subtitleCueIndex = 0;
    const synth = window.speechSynthesis;
    const volumeSlider = film.querySelector('.voice-volume');
    const volumeOutput = film.querySelector('.volume-value');
    const volumeStorageKey = 'assistos.film.narrationVolume';
    const voiceSupported = Boolean(synth && window.SpeechSynthesisUtterance);
    let preferredVolume = readNarrationVolume();
    let volume = voiceSupported ? preferredVolume : 0;
    let voiceEnabled = voiceSupported;
    let voiceFailed = false;
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
            cueIndex = subtitleCueIndex = timedCueIndex();
            nextSteps.hidden = index !== scenes.length - 1;
            film.querySelector('.film-current-scene').textContent = `${String(index + 1).padStart(2, '0')} / ${scenes.length} · ${sceneLabels[index]}`;
            chapters.forEach((button, chapter) => {
                if (chapter === index) button.setAttribute('aria-current', 'step');
                else button.removeAttribute('aria-current');
            });
        }
        updateSubtitles();
        seek.value = String(position);
        seek.setAttribute('aria-valuetext', `Scene ${index + 1} of ${scenes.length}. ${scenes[index][2]}`);
        // Progress represents scenes, not a fixed running time. Both speech and
        // the reading fallback determine how long each sentence stays visible.
        time.hidden = true;
        if (usesSpeechClock() && canAnimate() && !utterance && narratedScene !== currentScene) speakScene();
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

    function usesSpeechClock() {
        // Muting changes audibility only. Speech at zero volume still keeps
        // captions and scene changes on the same clock as audible narration.
        return voiceSupported && !voiceFailed;
    }

    function synchronizePlayback() {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = null;
        lastFrame = 0;
        film.dataset.playing = String(canAnimate());
        playLabel.textContent = playing ? 'Pause' : position >= duration ? 'Replay' : 'Play';
        playSymbol.textContent = playing ? 'Ⅱ' : '▶';
        play.setAttribute('aria-label', playing ? 'Pause film' : position >= duration ? 'Replay film' : 'Play film');
        if (usesSpeechClock()) {
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
            const elapsed = Math.min(now - lastFrame, 250) / 1000;
            if (usesSpeechClock()) {
                const cueEnd = (currentScene + (cueIndex + 1) / cues[currentScene].length) * sceneDuration;
                const limit = narratedScene !== currentScene ? cueEnd - 0.001 : duration;
                position = Math.min(limit, position + elapsed);
            } else {
                // Without a working voice, allow roughly 144 words per minute
                // and a short pause. Even a brief sentence gets 2.8 seconds.
                const text = cues[currentScene][timedCueIndex()];
                const readingSeconds = Math.max(2.8, text.split(/\s+/).length / 2.4 + 0.6);
                const progressPerSecond = sceneDuration / cues[currentScene].length / readingSeconds;
                position = Math.min((currentScene + 1) * sceneDuration, position + elapsed * progressPerSecond);
            }
        }
        lastFrame = now;
        render();
        if (position >= duration) {
            playing = false;
            synchronizePlayback();
            announcement.textContent = 'Film finished. Visit the Installation page to set up AssistOS, or open the Research menu for technical documentation.';
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
        // Give the sentence that was on screen a full reading interval if the
        // speech service fails partway through it.
        position = (currentScene + visibleCueIndex() / cues[currentScene].length) * sceneDuration;
        voiceEnabled = false;
        voiceFailed = true;
        volume = 0;
        cancelNarration();
        updateVolumeControls();
        announcement.textContent = 'No working English voice is available in this browser. Subtitles will advance at a reading pace.';
        render();
        synchronizePlayback();
    }

    // Keep screen labels intact. Spell selected initialisms only in speech;
    // leave IDE intact so the narrator reads the acronym naturally.
    function narrationText(text) {
        return text.replace(/\bAssistOS\b/gi, 'Assist O S').replace(/\bSCRIPTA\b/g, 'Scripta').replace(/scriptahub\.com/gi, 'Scripta Hub dot com').replace(/\b(?:OS|AI|IT|EU|ML|LLMs?|MCP|API|CPU|GPU|CLI|PDF)\b/g, abbreviation => {
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
        if (!usesSpeechClock() || !canAnimate() || film.dataset.transitioning === 'true') return;
        const token = ++voiceToken;
        const spokenScene = currentScene;
        const spokenCue = cueIndex;
        voiceStarted = false;
        // Phrase-sized utterances keep subtitles synchronized even when a voice
        // does not emit word-boundary events. Only onstart reveals the next cue.
        utterance = new SpeechSynthesisUtterance(narrationText(cues[spokenScene][spokenCue]));
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
            subtitleCueIndex = spokenCue;
            updateSubtitles();
            clearTimeout(voiceWatchdog);
            voiceWatchdog = null;
        };
        utterance.onend = () => {
            if (token !== voiceToken) return;
            clearTimeout(voiceWatchdog);
            if (spokenCue + 1 < cues[spokenScene].length) {
                cueIndex = spokenCue + 1;
                utterance = null;
                render();
                return;
            }
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

    function readNarrationVolume() {
        try {
            const saved = Number(localStorage.getItem(volumeStorageKey));
            if (saved > 0 && saved <= 100 && saved % 5 === 0) return saved / 100;
        } catch { /* Storage may be unavailable; playback still works. */ }
        return 0.35;
    }

    function rememberNarrationVolume() {
        try { localStorage.setItem(volumeStorageKey, String(Math.round(preferredVolume * 100))); }
        catch { /* Keep the preference for this page when storage is blocked. */ }
    }

    function updateVolumeControls() {
        const percent = Math.round(volume * 100);
        volumeSlider.value = String(percent);
        volumeOutput.textContent = `${percent}%`;
        volumeSlider.setAttribute('aria-valuetext', `${percent} percent`);
        updateVoiceButton();
    }

    function updateVoiceButton() {
        voiceButton.disabled = !voiceSupported;
        voiceButton.setAttribute('aria-pressed', String(voiceEnabled));
        voiceButton.dataset.silent = String(!voiceEnabled || volume === 0);
        voiceButton.setAttribute('aria-label', voiceSupported ? 'Spoken narration' : 'Narration unavailable');
        voiceButton.title = !voiceSupported ? 'Narration is unavailable. Use CC to read the subtitles.'
            : voiceFailed ? 'Narration unavailable. Click to try again.'
            : voiceEnabled ? 'Mute narration' : 'Unmute narration';
    }

    function splitNarration(text) {
        // Captions and speech share complete sentences. Keep names such as
        // scriptahub.com intact and let CSS wrap long captions without pausing speech.
        return (text.match(/.+?(?:[.!?](?=\s+[A-Z])|$)/g) || [text])
            .map(sentence => sentence.trim());
    }

    function timedCueIndex(sceneIndex = currentScene) {
        const fraction = (position - sceneIndex * sceneDuration) / sceneDuration;
        return Math.min(cues[sceneIndex].length - 1, Math.max(0, Math.floor(fraction * cues[sceneIndex].length)));
    }

    function visibleCueIndex() {
        return usesSpeechClock() ? subtitleCueIndex : timedCueIndex();
    }

    function updateSubtitles() {
        const text = cues[currentScene][visibleCueIndex()];
        if (subtitle.textContent !== text) subtitle.textContent = text;
    }

    subtitlesButton.addEventListener('click', () => {
        subtitlesEnabled = !subtitlesEnabled;
        film.dataset.subtitles = String(subtitlesEnabled);
        subtitlesButton.setAttribute('aria-pressed', String(subtitlesEnabled));
        subtitlesButton.title = subtitlesEnabled ? 'Hide subtitles' : 'Show subtitles';
    });

    updateVolumeControls();
    voiceButton.addEventListener('click', () => {
        cueIndex = visibleCueIndex();
        voiceEnabled = !voiceEnabled;
        voiceFailed = false;
        volume = voiceEnabled ? preferredVolume : 0;
        rememberNarrationVolume();
        cancelNarration();
        narratedScene = -1;
        updateVolumeControls();
        if (voiceEnabled) setPlaying(true);
        else { render(); synchronizePlayback(); }
    });
    volumeSlider.disabled = !voiceSupported;
    volumeSlider.addEventListener('input', () => {
        const wasEnabled = voiceEnabled;
        cueIndex = visibleCueIndex();
        volume = Number(volumeSlider.value) / 100;
        voiceEnabled = voiceSupported && volume > 0;
        voiceFailed = false;
        if (volume > 0) {
            preferredVolume = volume;
            rememberNarrationVolume();
        }
        updateVolumeControls();
        if (wasEnabled !== voiceEnabled) {
            cancelNarration();
            narratedScene = -1;
            render();
            synchronizePlayback();
        }
    });
    volumeSlider.addEventListener('change', () => {
        // Some speech engines only read volume when an utterance starts.
        cancelNarration();
        narratedScene = -1;
        if (usesSpeechClock() && canAnimate()) speakScene();
    });
    window.addEventListener('pagehide', cancelNarration);

    start.addEventListener('click', () => setPlaying(true));
    play.addEventListener('click', () => setPlaying(!playing));
    film.querySelector('.film-restart').addEventListener('click', () => {
        cancelNarration();
        narratedScene = -1;
        position = 0;
        cueIndex = subtitleCueIndex = 0;
        playing = !reducedMotion.matches;
        render(true);
        synchronizePlayback();
    });
    chapters.forEach((button, index) => button.addEventListener('click', () => {
        cancelNarration();
        narratedScene = -1;
        position = index * sceneDuration;
        cueIndex = subtitleCueIndex = 0;
        start.hidden = true;
        playing = false;
        render(true);
        synchronizePlayback();
    }));
    seek.addEventListener('input', () => {
        cancelNarration();
        narratedScene = -1;
        position = Math.max(0, Math.min(duration, Number(seek.value)));
        cueIndex = subtitleCueIndex = timedCueIndex(Math.min(scenes.length - 1, Math.floor(position / sceneDuration)));
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
