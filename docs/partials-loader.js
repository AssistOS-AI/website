document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([...document.querySelectorAll('[data-include]')].map(async (host) => {
        const response = await fetch(host.dataset.include);
        if (!response.ok) throw new Error(`Could not load ${host.dataset.include}`);
        host.innerHTML = await response.text();
    }));
    initSiteNavigation();
    addEvent();
});
