// ==UserScript==
// @name         Fix Bad YouTube UI Decisions
// @namespace    https://github.com/GoldenLumia
// @version      2025-08-25
// @description  Remove 'AI Ask' button and adds a 'Save to Playlist' button to the horizontal bar under YT videos.
// @updateURL    https://github.com/GoldenLumia/Fix-Bad-YT-UI-Decisions/raw/master/fix-bad-yt-ui-decisions.user.js
// @downloadURL  https://github.com/GoldenLumia/Fix-Bad-YT-UI-Decisions/raw/master/fix-bad-yt-ui-decisions.user.js
// @author       Golden Lumia
// @license MIT
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // remove AI ask button (I'm never using this)
    function removeAskButton() {
        const askButton = document.querySelector('button[aria-label="Ask"]');
        if (askButton) {
            askButton.remove();
        }
    }
    // readd save to playlist button
    function addSaveToPlaylistButton() {
        // lets hope this isnt used in YT Shorts lol
        const searchedContainer = document.querySelector('#top-level-buttons-computed');
        if (!searchedContainer) return;
        // prevent duplicates
        if (document.querySelector('#gold-save-btn')) return;
        // establish a button that's close enough to youtube's styling
        const btn = document.createElement('button');
        btn.id = 'gold-save-btn';
        // im sure this will never need to be changed ever ever ever
        btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        // close enough
        btn.setAttribute('aria-label', 'Save');
        btn.setAttribute('title', 'Save');
        btn.style.marginLeft = '8px';
        // listen I dont want to do this either
        btn.innerHTML = `
            <div aria-hidden="true" class="yt-spec-button-shape-next__icon">
                <span class="ytIconWrapperHost" style="width:24px; height:24px;">
                <span class="yt-icon-shape ytSpecIconShapeHost">
                    <div style="width:100%; height:100%; display:block; fill:currentcolor;">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 24 24" focusable="false" aria-hidden="true" style="pointer-events:none; display:inherit; width:100%; height:100%;">
                        <path d="M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z"></path>
                    </svg>
                    </div>
                </span>
                </span>
            </div>
            <div class="yt-spec-button-shape-next__button-text-content">Save</div>
            <yt-touch-feedback-shape style="border-radius: inherit;">
                <div aria-hidden="true" class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response">
                <div class="yt-spec-touch-feedback-shape__stroke"></div>
                <div class="yt-spec-touch-feedback-shape__fill"></div>
                </div>
            </yt-touch-feedback-shape>
            `;
        // time to redirect our funny fake button to the real save to playlist button
        btn.onclick = () => {
            const overflowBtn = document.querySelector('button[aria-label="More actions"]');
            if (!overflowBtn) {
                console.warn('[Gold] Menu button not found! If this persists, report an issue to the dev.');
                return;
            }
            overflowBtn.click();

            const observer = new MutationObserver((mutations, obs) => {
                const saveItem = Array.from(document.querySelectorAll('ytd-menu-service-item-renderer'))
                    .find(el => el.innerText.trim() === 'Save');
                if (saveItem) {
                    saveItem.click();
                    obs.disconnect();
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        };

        searchedContainer.appendChild(btn);
    }
    // the watcherrrrrrr
    const observer = new MutationObserver(() => {
        removeAskButton();
        addSaveToPlaylistButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    removeAskButton();
    addSaveToPlaylistButton();
})();