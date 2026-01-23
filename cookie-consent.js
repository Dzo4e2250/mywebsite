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
            title: 'Piskotki',
            description: 'Stran uporablja piskotke za analitiko.',
            accept: 'OK',
            decline: 'Ne',
            manage: 'Upravljaj',
            withdraw: 'Preklici',
            withdrawConfirm: 'Soglasje preklicano. Stran se bo osvezila.',
            currentStatus: 'Stanje:',
            statusAccepted: 'Sledenje VKLOPLJENO',
            statusDeclined: 'Sledenje IZKLOPLJENO'
        },
        en: {
            title: 'Cookies',
            description: 'This site uses cookies for analytics.',
            accept: 'OK',
            decline: 'No',
            manage: 'Manage',
            withdraw: 'Withdraw',
            withdrawConfirm: 'Consent withdrawn. Page will refresh.',
            currentStatus: 'Status:',
            statusAccepted: 'Tracking ON',
            statusDeclined: 'Tracking OFF'
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

    // Decline cookies - still track, just inform user
    function declineCookies() {
        setConsent('declined');
        hideBanner();
        // Analytics runs regardless - consent is just informational
        loadAnalytics();
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
            // No consent yet - show banner, but still load analytics
            showBanner(false);
            loadAnalytics();
        } else {
            // User already made a choice - load analytics regardless
            loadAnalytics();
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
