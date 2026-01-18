/**
 * Analytics Tracking Script for ristov.xyz
 * Extended tracking: page views, scroll depth, clicks, performance, errors, UTM
 */

(function() {
    'use strict';

    // Configuration
    const SUPABASE_URL = 'https://supabase.ristov.xyz';
    const SUPABASE_ANON_KEY = '***REMOVED_SUPABASE_KEY***';
    const DISCORD_WEBHOOK_URL = 'https://discordapp.com/api/webhooks/1458594067729617012/UgB2mWf25Fb2SBT2MdNC3CN8xjxwHyI5ChJzs43NdZRlC6j846Z8EAp1SEwmA3eMhEhE';
    const PING_INTERVAL = 15000; // 15 seconds
    const GEOLOCATION_API = 'https://ipapi.co/json/';

    // Session management - use sessionStorage for true sessions
    let sessionId = sessionStorage.getItem('analytics_session_id');
    let sessionStartTime = parseInt(sessionStorage.getItem('analytics_session_start')) || Date.now();
    let pageStartTime = Date.now();
    let pingIntervalId = null;
    let scrollSendIntervalId = null;
    let geoData = null;
    let maxScrollDepth = 0;
    let lastSentScrollDepth = 0;
    let lastSentDuration = 0;
    let unloadFired = false;
    let isFirstPageInSession = !sessionStorage.getItem('analytics_not_first_page');

    // Generate session ID if not exists (now in sessionStorage - resets when browser closes)
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        sessionStorage.setItem('analytics_session_id', sessionId);
        sessionStorage.setItem('analytics_session_start', Date.now().toString());
        sessionStartTime = Date.now();
    }

    // Mark that this is not the first page anymore
    sessionStorage.setItem('analytics_not_first_page', 'true');

    // Parse User Agent
    function parseUserAgent() {
        const ua = navigator.userAgent;
        let os = 'Unknown';
        let browser = 'Unknown';
        let deviceType = 'desktop';

        // Detect OS
        if (ua.includes('Windows NT 10')) os = 'Windows 10';
        else if (ua.includes('Windows NT 11') || (ua.includes('Windows NT 10') && ua.includes('rv:'))) os = 'Windows 11';
        else if (ua.includes('Windows')) os = 'Windows';
        else if (ua.includes('Mac OS X')) os = 'macOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';

        // Detect Browser
        if (ua.includes('Firefox/')) browser = 'Firefox';
        else if (ua.includes('Edg/')) browser = 'Edge';
        else if (ua.includes('Chrome/')) browser = 'Chrome';
        else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Opera') || ua.includes('OPR/')) browser = 'Opera';

        // Detect Device Type
        if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile';
        }

        return { os, browser, deviceType };
    }

    // Country code to name mapping
    const countryNames = {
        'AF':'Afganistan','AL':'Albanija','DZ':'Alžirija','AD':'Andora','AO':'Angola','AR':'Argentina','AM':'Armenija','AU':'Avstralija','AT':'Avstrija','AZ':'Azerbajdžan',
        'BS':'Bahami','BH':'Bahrajn','BD':'Bangladeš','BY':'Belorusija','BE':'Belgija','BZ':'Belize','BJ':'Benin','BT':'Butan','BO':'Bolivija','BA':'Bosna in Hercegovina',
        'BW':'Bocvana','BR':'Brazilija','BN':'Brunej','BG':'Bolgarija','CA':'Kanada','CL':'Čile','CN':'Kitajska','CO':'Kolumbija','CR':'Kostarika','HR':'Hrvaška',
        'CU':'Kuba','CY':'Ciper','CZ':'Češka','DK':'Danska','EC':'Ekvador','EG':'Egipt','EE':'Estonija','FI':'Finska','FR':'Francija','DE':'Nemčija',
        'GR':'Grčija','HU':'Madžarska','IS':'Islandija','IN':'Indija','ID':'Indonezija','IR':'Iran','IQ':'Irak','IE':'Irska','IL':'Izrael','IT':'Italija',
        'JP':'Japonska','KZ':'Kazahstan','KE':'Kenija','KR':'Južna Koreja','KW':'Kuvajt','LV':'Latvija','LB':'Libanon','LT':'Litva','LU':'Luksemburg','MK':'Severna Makedonija',
        'MY':'Malezija','MT':'Malta','MX':'Mehika','MD':'Moldavija','MC':'Monako','ME':'Črna gora','MA':'Maroko','NL':'Nizozemska','NZ':'Nova Zelandija','NG':'Nigerija',
        'NO':'Norveška','PK':'Pakistan','PA':'Panama','PY':'Paragvaj','PE':'Peru','PH':'Filipini','PL':'Poljska','PT':'Portugalska','QA':'Katar','RO':'Romunija',
        'RU':'Rusija','SA':'Saudova Arabija','RS':'Srbija','SG':'Singapur','SK':'Slovaška','SI':'Slovenija','ZA':'Južna Afrika','ES':'Španija','SE':'Švedska','CH':'Švica',
        'TW':'Tajvan','TH':'Tajska','TR':'Turčija','UA':'Ukrajina','AE':'ZAE','GB':'Velika Britanija','US':'ZDA','UY':'Urugvaj','UZ':'Uzbekistan','VE':'Venezuela','VN':'Vietnam'
    };

    function getCountryName(code) {
        if (!code) return 'Unknown';
        return countryNames[code.toUpperCase()] || code;
    }

    // Get only IP address (for use with GPS location)
    async function getIPOnly() {
        try {
            const r = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
            if (r.ok) {
                const text = await r.text();
                const match = text.match(/ip=([^\n]+)/);
                if (match && match[1]) return match[1];
            }
        } catch(e) {}

        // Try ipwho.is as fallback
        try {
            const r = await fetch('https://ipwho.is/');
            if (r.ok) {
                const data = await r.json();
                if (data.ip) return data.ip;
            }
        } catch(e) {}

        return 'Unknown';
    }

    // Try Browser Geolocation API
    async function tryBrowserGeolocation() {
        if (!navigator.geolocation) return null;

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 300000 // Cache for 5 minutes
                });
            });

            const ip = await getIPOnly();

            return {
                ip: ip,
                country_name: 'GPS',
                city: 'GPS',
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: Math.round(position.coords.accuracy),
                location_type: 'gps'
            };
        } catch (e) {
            // User denied or error - return null to use IP fallback
            return null;
        }
    }

    // Fetch geolocation data with GPS first, then IP fallback
    async function fetchGeoData() {
        // 1. First try Browser Geolocation API (GPS)
        const gpsData = await tryBrowserGeolocation();
        if (gpsData) {
            geoData = gpsData;
            return geoData;
        }

        // 2. Fallback: IP-based geolocation
        const apis = [
            { url: 'https://ipwho.is/', transform: (d) => ({ ip: d.ip, country_name: d.country, city: d.city, location_type: 'ip' }) },
            { url: 'https://ipapi.co/json/', transform: (d) => ({ ip: d.ip, country_name: d.country_name, city: d.city, location_type: 'ip' }) }
        ];

        for (const api of apis) {
            try {
                const response = await fetch(api.url);
                if (response.ok) {
                    const data = await response.json();
                    geoData = api.transform(data);
                    if (geoData.ip && geoData.country_name) return geoData;
                }
            } catch (e) { continue; }
        }

        // 3. Final fallback: Get IP from Cloudflare, then location from ip-api.com
        try {
            const r = await fetch('https://www.cloudflare.com/cdn-cgi/trace');
            if (r.ok) {
                const text = await r.text();
                const match = text.match(/ip=([^\n]+)/);
                if (match && match[1]) {
                    const ip = match[1];
                    try {
                        const locR = await fetch(`https://ip-api.com/json/${ip}?fields=country,city`);
                        if (locR.ok) {
                            const locData = await locR.json();
                            geoData = { ip: ip, country_name: locData.country || 'Unknown', city: locData.city || 'Unknown', location_type: 'ip' };
                            return geoData;
                        }
                    } catch(e) {}
                    const locMatch = text.match(/loc=([^\n]+)/);
                    geoData = { ip: ip, country_name: locMatch ? getCountryName(locMatch[1]) : 'Unknown', city: 'Unknown', location_type: 'ip' };
                    return geoData;
                }
            }
        } catch(e) {}

        return { country_name: 'Unknown', city: 'Unknown', ip: 'Unknown', location_type: 'ip' };
    }

    // Send data to Supabase (analytics schema)
    async function sendToSupabase(table, data) {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Accept-Profile': 'analytics',
                    'Content-Profile': 'analytics',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(data)
            });
            return response.ok;
        } catch (e) {
            console.log('Analytics send failed');
            return false;
        }
    }

    // Upsert active session
    async function upsertActiveSession() {
        const { os, browser, deviceType } = parseUserAgent();
        const geo = geoData || { country_name: 'Unknown', city: 'Unknown' };

        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/active_sessions?session_id=eq.${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Accept-Profile': 'analytics',
                    'Content-Profile': 'analytics'
                }
            });

            await sendToSupabase('active_sessions', {
                session_id: sessionId,
                page_url: window.location.pathname,
                device_type: deviceType,
                os: os,
                browser: browser,
                country: geo.country_name,
                city: geo.city,
                ip_address: geo.ip || null,
                last_ping: new Date().toISOString()
            });
        } catch (e) {
            console.log('Active session update failed');
        }
    }

    // Remove active session
    async function removeActiveSession() {
        try {
            await fetch(`${SUPABASE_URL}/rest/v1/active_sessions?session_id=eq.${sessionId}`, {
                method: 'DELETE',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Accept-Profile': 'analytics',
                    'Content-Profile': 'analytics'
                }
            });
        } catch (e) {
            console.log('Active session removal failed');
        }
    }

    // Fetch IP label from database
    async function getIPLabel(ip) {
        if (!ip || ip === 'Unknown') return null;
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/ip_labels?ip_address=eq.${ip}&select=label`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Accept-Profile': 'analytics'
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                return data[0].label;
            }
        } catch(e) {}
        return null;
    }

    // Send Discord notification
    async function sendDiscordNotification(data) {
        try {
            // Check if this IP has a label (known user)
            const ipLabel = await getIPLabel(data.ip_address);

            // Skip notification for labeled IPs (known users like site owner)
            if (ipLabel) {
                console.log('Skipping Discord notification for known user:', ipLabel);
                return;
            }

            // Build title with label if exists
            let title = '🟢 LIVE obiskovalec na ristov.xyz';
            if (ipLabel) {
                title = `🟢 ${ipLabel} je na ristov.xyz`;
            }

            // Determine location display
            let locationValue = `${data.city || 'Unknown'}, ${data.country || 'Unknown'}`;
            let locationType = data.location_type === 'gps' ? '📍 GPS' : '🌐 IP';

            const embed = {
                title: title,
                color: ipLabel ? 0xf59e0b : 0x00ff00, // Orange if labeled, green otherwise
                fields: [
                    { name: '📄 Stran', value: data.page_url || '/', inline: true },
                    { name: '💻 Naprava', value: data.device_type || 'Unknown', inline: true },
                    { name: '🖥️ OS', value: data.os || 'Unknown', inline: true },
                    { name: '🌐 Brskalnik', value: data.browser || 'Unknown', inline: true },
                    { name: '🌍 Lokacija', value: locationValue, inline: true },
                    { name: '📡 Tip lokacije', value: locationType, inline: true },
                    { name: '⏰ Čas', value: new Date().toLocaleString('sl-SI'), inline: true }
                ],
                timestamp: new Date().toISOString()
            };

            // Add GPS coordinates with Google Maps link if available
            if (data.latitude && data.longitude) {
                const mapsUrl = `https://maps.google.com/?q=${data.latitude},${data.longitude}`;
                const accuracy = data.location_accuracy ? ` (±${data.location_accuracy}m)` : '';
                embed.fields.push({
                    name: '📍 GPS Koordinate',
                    value: `[${data.latitude.toFixed(5)}, ${data.longitude.toFixed(5)}](${mapsUrl})${accuracy}`,
                    inline: false
                });
            }

            // Add IP with label info
            if (data.ip_address && data.ip_address !== 'Unknown') {
                const ipDisplay = ipLabel ? `${data.ip_address} (${ipLabel})` : data.ip_address;
                embed.fields.push({ name: '🔗 IP', value: ipDisplay, inline: true });
            }

            // Add UTM info if present
            if (data.utm_source) {
                embed.fields.push({ name: '📢 Kampanja', value: `${data.utm_source} / ${data.utm_medium || '-'}`, inline: true });
            }

            await fetch(DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ embeds: [embed] })
            });
        } catch (e) {
            console.log('Discord notification failed');
        }
    }

    // Parse UTM parameters
    function parseUTMParams() {
        const params = new URLSearchParams(window.location.search);
        const utm = {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content')
        };
        // Only return if at least one UTM param exists
        if (utm.utm_source || utm.utm_medium || utm.utm_campaign) {
            return utm;
        }
        return null;
    }

    // Track UTM campaigns
    async function trackUTM() {
        const utm = parseUTMParams();
        if (utm) {
            await sendToSupabase('utm_campaigns', {
                session_id: sessionId,
                page_url: window.location.pathname,
                ...utm
            });
        }
        return utm;
    }

    // Track page view
    async function trackPageView() {
        const geo = await fetchGeoData();
        const { os, browser, deviceType } = parseUserAgent();
        const utm = parseUTMParams();

        const pageViewData = {
            session_id: sessionId,
            page_url: window.location.pathname,
            referrer: document.referrer || null,
            ip_address: geo.ip || null,
            user_agent: navigator.userAgent,
            device_type: deviceType,
            os: os,
            browser: browser,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            country: geo.country_name || null,
            city: geo.city || null,
            latitude: geo.latitude || null,
            longitude: geo.longitude || null,
            location_accuracy: geo.accuracy || null,
            location_type: geo.location_type || 'ip',
            is_entry: isFirstPageInSession
        };

        // Send to Supabase
        await sendToSupabase('page_views', pageViewData);

        // Track UTM if present
        await trackUTM();

        // Send Discord notification (include UTM source if present)
        const discordData = { ...pageViewData };
        if (utm) {
            discordData.utm_source = utm.utm_source;
            discordData.utm_medium = utm.utm_medium;
        }
        await sendDiscordNotification(discordData);

        // Start active session pinging
        await upsertActiveSession();
        pingIntervalId = setInterval(upsertActiveSession, PING_INTERVAL);
    }

    // Track page performance
    function trackPerformance() {
        // Wait for page to fully load
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perf = performance.getEntriesByType('navigation')[0];
                if (perf) {
                    sendToSupabase('page_performance', {
                        session_id: sessionId,
                        page_url: window.location.pathname,
                        load_time_ms: Math.round(perf.loadEventEnd - perf.startTime),
                        dom_ready_ms: Math.round(perf.domContentLoadedEventEnd - perf.startTime),
                        first_paint_ms: Math.round(performance.getEntriesByName('first-paint')[0]?.startTime || 0)
                    });
                }
            }, 100);
        });
    }

    // Track scroll depth
    function trackScrollDepth() {
        let ticking = false;

        function updateScrollDepth() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.offsetHeight
            );
            const winHeight = window.innerHeight;
            const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100) || 0;

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = Math.min(scrollPercent, 100);
            }
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollDepth);
                ticking = true;
            }
        });

        // Initial check
        updateScrollDepth();
    }

    // Send data using sendBeacon (more reliable for unload)
    function sendBeaconData(table, data) {
        const url = `${SUPABASE_URL}/rest/v1/${table}`;
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

        // sendBeacon doesn't support custom headers, so we use URL params for auth
        // Fall back to fetch with keepalive if headers are needed
        try {
            const success = navigator.sendBeacon(url + `?apikey=${SUPABASE_ANON_KEY}`, blob);
            if (!success) {
                // Fallback to fetch with keepalive
                fetch(url, {
                    method: 'POST',
                    keepalive: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Accept-Profile': 'analytics',
                        'Content-Profile': 'analytics',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify(data)
                }).catch(() => {});
            }
        } catch (e) {
            // Final fallback
            fetch(url, {
                method: 'POST',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Accept-Profile': 'analytics',
                    'Content-Profile': 'analytics',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify(data)
            }).catch(() => {});
        }
    }

    // Send scroll depth (can be called periodically or on unload)
    function sendScrollDepth(useBeacon = false) {
        if (maxScrollDepth > lastSentScrollDepth) {
            const data = {
                session_id: sessionId,
                page_url: window.location.pathname,
                max_depth: maxScrollDepth
            };

            if (useBeacon) {
                sendBeaconData('scroll_depth', data);
            } else {
                sendToSupabase('scroll_depth', data);
            }
            lastSentScrollDepth = maxScrollDepth;
        }
    }

    // Send duration update (can be called periodically or on unload)
    function sendDurationUpdate(useBeacon = false) {
        const duration = Math.round((Date.now() - pageStartTime) / 1000);

        if (duration > lastSentDuration) {
            const data = {
                session_id: sessionId,
                page_url: window.location.pathname,
                duration_seconds: duration
            };

            if (useBeacon) {
                sendBeaconData('session_duration', data);
            } else {
                sendToSupabase('session_duration', data);
            }
            lastSentDuration = duration;
        }
    }

    // Periodic updates (every 30 seconds)
    function startPeriodicUpdates() {
        scrollSendIntervalId = setInterval(() => {
            sendScrollDepth(false);
            sendDurationUpdate(false);
        }, 30000); // Every 30 seconds
    }

    // Track clicks
    function trackClicks() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button, [role="button"]');
            if (!target) return;

            const isLink = target.tagName === 'A';
            const href = isLink ? target.href : null;
            const isOutbound = href && !href.includes(window.location.hostname);

            // Get meaningful text
            let text = target.textContent?.trim().substring(0, 100) ||
                       target.getAttribute('aria-label') ||
                       target.getAttribute('title') || '';

            sendToSupabase('clicks', {
                session_id: sessionId,
                page_url: window.location.pathname,
                element_type: target.tagName.toLowerCase(),
                element_text: text,
                element_href: href,
                is_outbound: isOutbound
            });
        });
    }

    // Track JavaScript errors
    function trackErrors() {
        window.addEventListener('error', (e) => {
            sendToSupabase('js_errors', {
                session_id: sessionId,
                page_url: window.location.pathname,
                error_message: e.message,
                error_source: e.filename,
                error_line: e.lineno,
                error_column: e.colno
            });
        });

        window.addEventListener('unhandledrejection', (e) => {
            sendToSupabase('js_errors', {
                session_id: sessionId,
                page_url: window.location.pathname,
                error_message: 'Unhandled Promise Rejection: ' + (e.reason?.message || e.reason || 'Unknown'),
                error_source: 'Promise',
                error_line: 0,
                error_column: 0
            });
        });
    }

    // Track session duration on page unload (using sendBeacon for reliability)
    function trackSessionDuration() {
        // Prevent double-firing from both beforeunload and pagehide
        if (unloadFired) return;
        unloadFired = true;

        // Send final duration update using beacon
        sendDurationUpdate(true);

        // Send final scroll depth using beacon
        sendScrollDepth(true);

        // Clear intervals
        if (pingIntervalId) clearInterval(pingIntervalId);
        if (scrollSendIntervalId) clearInterval(scrollSendIntervalId);

        // Remove active session using fetch with keepalive (DELETE not supported by sendBeacon)
        fetch(`${SUPABASE_URL}/rest/v1/active_sessions?session_id=eq.${sessionId}`, {
            method: 'DELETE',
            keepalive: true,
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Accept-Profile': 'analytics',
                'Content-Profile': 'analytics'
            }
        }).catch(() => {});
    }

    // Initialize tracking
    function init() {
        // Don't track admin pages or bots
        if (window.location.pathname.startsWith('/admin')) return;
        if (/bot|crawler|spider|crawling/i.test(navigator.userAgent)) return;

        // Track page view on load
        trackPageView();

        // Track performance
        trackPerformance();

        // Track scroll depth
        trackScrollDepth();

        // Track clicks
        trackClicks();

        // Track JS errors
        trackErrors();

        // Start periodic updates (scroll depth & duration every 30s)
        startPeriodicUpdates();

        // Track duration and scroll on unload - use both events for maximum compatibility
        window.addEventListener('beforeunload', trackSessionDuration);

        // pagehide is more reliable on mobile browsers
        window.addEventListener('pagehide', (e) => {
            // Only run if beforeunload didn't fire (avoid double-sending)
            trackSessionDuration();
        });

        // Handle visibility change (tab switch) - also send updates when tab becomes hidden
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Send current data when tab becomes hidden (user might not come back)
                sendScrollDepth(false);
                sendDurationUpdate(false);
                clearInterval(pingIntervalId);
            } else {
                upsertActiveSession();
                pingIntervalId = setInterval(upsertActiveSession, PING_INTERVAL);
            }
        });
    }

    // Start tracking when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
