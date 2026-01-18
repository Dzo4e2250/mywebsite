/**
 * Cookie Consent Manager for ristov.xyz
 * GDPR compliant cookie consent with analytics integration
 */

(function() {
    'use strict';

    const CONSENT_KEY = 'cookie_consent';
    const CONSENT_DATE_KEY = 'cookie_consent_date';

    // Detect language from URL or html lang attribute
    function getLanguage() {
        if (window.location.pathname.startsWith('/en')) return 'en';
        return document.documentElement.lang || 'sl';
    }

    // Translations
    const translations = {
        sl: {
            title: 'Spletna stran uporablja piskotke',
            description: 'Za izboljsanje uporabniske izkusnje in analitiko obiskov uporabljamo piskotke. Sledimo lokaciji, casu obiska in interakcijam na strani.',
            accept: 'Sprejmi',
            decline: 'Zavrni',
            manage: 'Upravljaj piskotke',
            withdraw: 'Preklici soglasje',
            withdrawConfirm: 'Soglasje preklicano. Stran se bo osvezila.',
            currentStatus: 'Trenutno stanje:',
            statusAccepted: 'Sledenje je VKLOPLJENO',
            statusDeclined: 'Sledenje je IZKLOPLJENO'
        },
        en: {
            title: 'This website uses cookies',
            description: 'We use cookies to improve user experience and analyze visits. We track location, visit duration and page interactions.',
            accept: 'Accept',
            decline: 'Decline',
            manage: 'Manage cookies',
            withdraw: 'Withdraw consent',
            withdrawConfirm: 'Consent withdrawn. Page will refresh.',
            currentStatus: 'Current status:',
            statusAccepted: 'Tracking is ON',
            statusDeclined: 'Tracking is OFF'
        }
    };

    // Get current consent status
    function getConsent() {
        return localStorage.getItem(CONSENT_KEY);
    }

    // Set consent
    function setConsent(value) {
        localStorage.setItem(CONSENT_KEY, value);
        localStorage.setItem(CONSENT_DATE_KEY, new Date().toISOString());
    }

    // Load analytics script dynamically
    function loadAnalytics() {
        if (document.querySelector('script[src*="analytics.js"]')) return;

        const script = document.createElement('script');
        const pathPrefix = window.location.pathname.startsWith('/en') ? '../' : '';
        script.src = pathPrefix + 'analytics.js?v=' + Date.now();
        script.async = true;
        document.body.appendChild(script);
    }

    // Create button element
    function createButton(text, className, onClick) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = 'cookie-btn ' + className;
        btn.addEventListener('click', onClick);
        return btn;
    }

    // Create and show cookie banner
    function showBanner(isSettingsMode) {
        // Remove existing banner if any
        const existing = document.getElementById('cookie-consent-banner');
        if (existing) existing.remove();

        const lang = getLanguage();
        const t = translations[lang] || translations.sl;
        const currentConsent = getConsent();

        // Create banner element
        const banner = document.createElement('div');
        banner.id = 'cookie-consent-banner';
        banner.className = 'cookie-banner';

        // Create content wrapper
        const content = document.createElement('div');
        content.className = 'cookie-content';

        // Create text section
        const textDiv = document.createElement('div');
        textDiv.className = 'cookie-text';

        const title = document.createElement('h4');
        title.textContent = t.title;
        textDiv.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = t.description;
        textDiv.appendChild(desc);

        content.appendChild(textDiv);

        // Create buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'cookie-buttons';

        if (isSettingsMode && currentConsent) {
            // Settings mode - show current status
            const statusDiv = document.createElement('div');
            statusDiv.className = 'cookie-status';

            const statusSpan = document.createElement('span');
            statusSpan.textContent = t.currentStatus + ' ';

            const statusStrong = document.createElement('strong');
            statusStrong.textContent = currentConsent === 'accepted' ? t.statusAccepted : t.statusDeclined;

            statusSpan.appendChild(statusStrong);
            statusDiv.appendChild(statusSpan);
            content.appendChild(statusDiv);

            // Add withdraw button if accepted
            if (currentConsent === 'accepted') {
                buttonsDiv.appendChild(createButton(t.withdraw, 'cookie-btn-withdraw', withdrawCookieConsent));
            }
        }

        // Always add accept and decline buttons
        buttonsDiv.appendChild(createButton(t.accept, 'cookie-btn-accept', acceptCookies));
        buttonsDiv.appendChild(createButton(t.decline, 'cookie-btn-decline', declineCookies));

        content.appendChild(buttonsDiv);
        banner.appendChild(content);
        document.body.appendChild(banner);

        // Animate in
        requestAnimationFrame(function() {
            banner.classList.add('cookie-banner-visible');
        });
    }

    // Hide banner
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.classList.remove('cookie-banner-visible');
            setTimeout(function() { banner.remove(); }, 300);
        }
    }

    // Accept cookies
    function acceptCookies() {
        setConsent('accepted');
        hideBanner();
        loadAnalytics();
    }

    // Decline cookies
    function declineCookies() {
        setConsent('declined');
        hideBanner();
    }

    // Withdraw consent (from settings)
    function withdrawCookieConsent() {
        const lang = getLanguage();
        const t = translations[lang] || translations.sl;

        localStorage.removeItem(CONSENT_KEY);
        localStorage.removeItem(CONSENT_DATE_KEY);

        // Clear analytics session data
        sessionStorage.removeItem('analytics_session_id');
        sessionStorage.removeItem('analytics_session_start');
        sessionStorage.removeItem('analytics_not_first_page');

        alert(t.withdrawConfirm);
        window.location.reload();
    }

    // Show cookie settings (called from footer link)
    function showCookieSettings() {
        showBanner(true);
    }

    // Expose functions globally for footer link
    window.showCookieSettings = showCookieSettings;
    window.acceptCookies = acceptCookies;
    window.declineCookies = declineCookies;

    // Initialize on DOM ready
    function init() {
        const consent = getConsent();

        if (!consent) {
            // No consent yet - show banner
            showBanner(false);
        } else if (consent === 'accepted') {
            // User accepted - load analytics
            loadAnalytics();
        }
        // If declined, do nothing - no tracking
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
