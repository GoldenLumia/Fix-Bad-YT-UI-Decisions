// ==UserScript==
// @name         Fix Bad YouTube UI Decisions
// @namespace    https://github.com/GoldenLumia
// @version      2025-08-27
// @description  Removes 'AI Ask' button and adds a 'Save to Playlist' button to the horizontal bar under YT videos.
// @updateURL    https://github.com/GoldenLumia/Fix-Bad-YT-UI-Decisions/raw/refs/heads/main/fix-bad-yt-ui-decisions.user.js
// @downloadURL  https://github.com/GoldenLumia/Fix-Bad-YT-UI-Decisions/raw/refs/heads/main/fix-bad-yt-ui-decisions.user.js
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

        // im sure this will never need to be changed ever ever ever
        // btn.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        // lol it only lasted two days, dont hardcode classnames kids

        // better idea, lets just clone an existing button
        const existingButton = searchedContainer.querySelector('button');
        if (!existingButton) {
            return;
        }

        // but not the fucking segmented like/dislike button
        let clonedButton = existingButton;
        if (existingButton.classList.contains('ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper') ||
            existingButton.classList.contains('yt-spec-button-shape-next--segmented-start') ||
            existingButton.classList.contains('yt-spec-button-shape-next--segmented-end')) {
            const funnyButtonList = searchedContainer.querySelectorAll('button');
            for (let i = 0; i < funnyButtonList.length; i++) {
                const btn = funnyButtonList[i];
                if (!btn.classList.contains('ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper') &&
                    !btn.classList.contains('yt-spec-button-shape-next--segmented-start') &&
                    !btn.classList.contains('yt-spec-button-shape-next--segmented-end')) {
                    clonedButton = btn;
                    break;
                }
            }
        }

        // do the thing
        const btn = clonedButton.cloneNode(true);
        btn.id = 'gold-save-btn';
        btn.className = clonedButton.className;
        btn.innerHTML = '';
        btn.onclick = null;

        // close enough
        btn.setAttribute('aria-label', 'Save');
        btn.setAttribute('title', 'Save');
        btn.style.marginLeft = '8px';

        // listen I dont want to do this either
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 12px;">
                <path d="M18 4v15.06l-5.42-3.87-.58-.42-.58.42L6 19.06V4h12m1-1H5v18l7-5 7 5V3z"></path>
            </svg>
            <span>Save</span>
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