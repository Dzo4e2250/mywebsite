/* ==========================================================================
   GEORGE BUILDS THINGS - JavaScript (Clean Version)
   ========================================================================== */

// Language detection
const isEnglish = window.location.pathname.startsWith('/en');

/* ==========================================================================
   DYNAMIC YEARS CALCULATION
   ========================================================================== */

function initDynamicYears() {
    const currentYear = new Date().getFullYear();
    const techStartYear = 2013;
    const salesStartYear = 2020;

    const techYears = currentYear - techStartYear;
    const salesYears = currentYear - salesStartYear;

    const techEl = document.getElementById('tech-years');
    const salesEl = document.getElementById('sales-years');

    if (techEl) techEl.textContent = techYears;
    if (salesEl) salesEl.textContent = salesYears;

    // Fetch GitHub repos count
    const githubEl = document.getElementById('github-repos');
    if (githubEl) {
        fetch('https://api.github.com/users/Dzo4e2250')
            .then(response => response.json())
            .then(data => {
                if (data.public_repos) {
                    githubEl.textContent = data.public_repos + '+';
                }
            })
            .catch(() => {
                // Keep fallback value on error
            });
    }
}

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.approach-card, .project-card, .skill-category, .project-featured, .quote-card, .contact-form'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

/* ==========================================================================
   SMOOTH SCROLL
   ========================================================================== */

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   NAVIGATION HIGHLIGHT
   ========================================================================== */

function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.btn-nav)');

    function highlightNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.style.color = '';
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.style.color = 'var(--accent-primary)';
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav();
}

/* ==========================================================================
   NAVIGATION SCROLL EFFECT
   ========================================================================== */

function initNavScroll() {
    const nav = document.querySelector('.nav');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
    });
}

/* ==========================================================================
   FORM HANDLER
   ========================================================================== */

function initFormHandler() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.btn-primary');
        const btnTextSpan = submitBtn.childNodes[0];
        const originalText = btnTextSpan.textContent.trim();

        // Loading state
        btnTextSpan.textContent = 'Pošiljam...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate sending (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success state
        btnTextSpan.textContent = 'Poslano!';
        submitBtn.style.background = 'var(--accent-success)';
        submitBtn.style.opacity = '1';

        // Reset form
        form.reset();

        // Reset button after delay
        setTimeout(() => {
            btnTextSpan.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    });
}

/* ==========================================================================
   EXPANDABLE CARDS
   ========================================================================== */

function initExpandableCards() {
    const expandables = document.querySelectorAll('.expandable');

    expandables.forEach(card => {
        // Find all clickable elements within the card
        const preview = card.querySelector('.card-preview');
        const expandBtn = card.querySelector('.expand-btn');
        const expandBtnLarge = card.querySelector('.expand-btn-large');
        const expandBtnText = card.querySelector('.expand-btn-text');
        const extraToggle = card.querySelector('.extra-toggle');

        // Toggle function
        const toggleExpand = (e) => {
            // Don't toggle if clicking on a link inside
            if (e.target.tagName === 'A') return;

            const isExpanded = card.getAttribute('data-expanded') === 'true';
            card.setAttribute('data-expanded', !isExpanded);

            // Update button text if it's the text button
            if (expandBtnText) {
                const currentText = expandBtnText.textContent;
                if (currentText.includes('Več') || currentText.includes('More')) {
                    expandBtnText.textContent = isEnglish ? 'Hide details ←' : 'Skrij podrobnosti ←';
                } else {
                    expandBtnText.textContent = isEnglish ? 'More about this role →' : 'Več o tej vlogi →';
                }
            }

            // Update large button text
            if (expandBtnLarge) {
                const span = expandBtnLarge.querySelector('span');
                if (span) {
                    span.textContent = isExpanded
                        ? (isEnglish ? 'See technical details' : 'Poglej tehnične podrobnosti')
                        : (isEnglish ? 'Hide details' : 'Skrij podrobnosti');
                }
            }
        };

        // Add click handlers
        if (preview) {
            preview.addEventListener('click', toggleExpand);
        }
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleExpand(e);
            });
        }
        if (expandBtnLarge) {
            expandBtnLarge.addEventListener('click', toggleExpand);
        }
        if (expandBtnText) {
            expandBtnText.addEventListener('click', toggleExpand);
        }
        if (extraToggle) {
            extraToggle.addEventListener('click', toggleExpand);
        }
    });
}

/* ==========================================================================
   MODAL SYSTEM
   ========================================================================== */

function initModalSystem() {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    const modalContent = document.getElementById('modalContent');
    const modalClose = modal.querySelector('.modal-close');

    // Modal content templates
    const modalTemplates = {
        eva: `
            <div class="modal-header">
                <h2>Eva Chatbot za eTutee</h2>
                <p>AI asistentka za slovensko tutorsko podjetje. Od n8n prototipa do custom FastAPI rešitve.</p>
            </div>

            <div class="modal-architecture">
                <img src="eva-architecture.svg" alt="Eva Chatbot Arhitektura">
            </div>

            <div class="modal-block" style="margin-bottom: var(--space-lg);">
                <h4>🏗️ Kako deluje</h4>
                <p>
                    Uporabnik pošlje sporočilo preko spletnega vmesnika, ki je povezan s FastAPI backendom preko WebSocket povezave – to omogoča takojšen odziv in typing indikator.
                    Ko pride vprašanje, sistem najprej poišče relevantne dokumente v Supabase PostgreSQL bazi z uporabo pgvector razširitve za vektorsko iskanje.
                    Najdeni dokumenti skupaj z uporabnikovim vprašanjem gredo v OpenAI API, ki generira odgovor.
                    Redis skrbi za session management in caching pogostih poizvedb.
                    Če Eva ne zna odgovoriti, eskalira vprašanje v Slack, kjer ekipa odgovori – ta odgovor se nato shrani nazaj v bazo za prihodnja podobna vprašanja.
                </p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🚫 Problem z n8n</h4>
                    <ul>
                        <li>3-5 sekund za odgovor (vsak korak = HTTP request)</li>
                        <li>Ni real-time občutka - kot email, ne chat</li>
                        <li>Debugging hell - workflow je postal špageti</li>
                        <li>Stroški bi hitro narasli z večjim volumnom</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>✅ Custom rešitev</h4>
                    <ul>
                        <li><strong>WebSocket</strong> - instant odziv, typing indicator</li>
                        <li><strong>RAG sistem</strong> - pgvector search za relevantne dokumente</li>
                        <li><strong>Fine-tuning</strong> - 200 primerov za slovenski ton</li>
                        <li><strong>Self-learning</strong> - uči se iz Slack eskalacij</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📊 Rezultati</h4>
                    <ul>
                        <li>Odzivni čas: <strong>&lt;1 sekunda</strong> (prej 3-5s)</li>
                        <li>Eskalacije: <strong>samo 3%</strong> vprašanj potrebuje človeka</li>
                        <li>Stroški: <strong>€5/mesec</strong> (prej bi bilo €20+)</li>
                        <li>Real-time typing indicator za boljši UX</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>FastAPI</span>
                        <span>Python</span>
                        <span>WebSocket</span>
                        <span>Redis</span>
                        <span>Supabase</span>
                        <span>pgvector</span>
                        <span>OpenAI</span>
                        <span>Slack API</span>
                        <span>Docker</span>
                    </div>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 Kaj sem se naučil</h4>
                <p>
                    Da low-code ni vedno dovolj. Da razumevanje arhitekture je pomembnejše od poznavanja sintakse.
                    In da z AI pomočjo lahko zgradiš karkoli - če veš kaj hočeš.
                </p>
            </div>
        `,

        tablespro: `
            <div class="modal-header">
                <h2>TablesPro - Nextcloud CRM</h2>
                <p>Fork Nextcloud Tables z Monday.com-inspired dizajnom. Kombinacija treh orodij v enem.</p>
            </div>

            <div class="modal-architecture">
                <img src="tablespro-architecture.svg" alt="TablesPro Arhitektura">
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🚫 Problem</h4>
                    <ul>
                        <li>Za VK Masaže sem potreboval CRM sistem</li>
                        <li>Monday.com je deloval odlično - dokler nisem dosegel brezplačne limite</li>
                        <li>Plačljiva verzija predraga za moj obseg</li>
                        <li>Iskal sem open source alternative</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🔍 Raziskava</h4>
                    <ul>
                        <li><strong>NocoDB</strong> - odlična funkcionalnost deljenja</li>
                        <li><strong>Nextcloud Tables</strong> - dobra integracija, basic funkcije</li>
                        <li><strong>Nextcloud Deck</strong> - kolega mi je pokazal kanban boards</li>
                        <li>Nobena rešitev ni imela vsega kar sem potreboval</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>✅ Rešitev: Fork + AI</h4>
                    <ul>
                        <li>Forkal sem Nextcloud Tables iz GitHuba</li>
                        <li>Z AI pomočjo dodal Monday.com-like dizajn</li>
                        <li>Integriral Deck funkcionalnosti</li>
                        <li>Dodal NocoDB sharing features</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🎯 Dodane funkcije</h4>
                    <ul>
                        <li><strong>Compact Row Design</strong> - večja gostota podatkov</li>
                        <li><strong>Summary Rows</strong> - SUM, AVG, MIN, MAX, COUNT</li>
                        <li><strong>Column Resize</strong> - drag-to-resize z persistent width</li>
                        <li><strong>Progress Bars</strong> - vizualni indikatorji</li>
                        <li><strong>Activity Tracking</strong> - sledenje sprememb</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>Vue.js 2</span>
                        <span>Pinia</span>
                        <span>PHP</span>
                        <span>Nextcloud API</span>
                        <span>SCSS</span>
                        <span>Vite</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Rezultat</h4>
                    <ul>
                        <li>Popoln CRM sistem za €0/mesec</li>
                        <li>100% self-hosted na mojem strežniku</li>
                        <li>Vse funkcije ki sem jih potreboval</li>
                        <li>Open source - lahko ga uporablja kdorkoli</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 Kaj sem se naučil</h4>
                <p>
                    Da če potrebuješ nekaj specifičnega, lahko vzameš obstoječo open source rešitev
                    in jo prilagodiš svojim potrebam. Z AI pomočjo sem lahko modificiral Vue.js kodo
                    čeprav nisem Vue developer. Razumel sem kaj hočem doseči - AI je napisal kodo.
                </p>
            </div>
        `,

        webprojects: `
            <div class="modal-header">
                <h2>Spletni projekti</h2>
                <p>Od WordPress strani za stranke do custom aplikacij za lastne potrebe. Gradim kar potrebujem.</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Motivacija</h4>
                    <p>
                        Nisem čakal da me nekdo nauči. Ko sem potreboval spletno stran za VK Masaže,
                        sem se naučil WordPress. Ko sem potreboval interno aplikacijo, sem jo zgradil.
                    </p>
                </div>

                <div class="modal-block">
                    <h4>💆 VK Masaže Website</h4>
                    <ul>
                        <li><strong>Cilj:</strong> Pridobivanje novih strank organsko</li>
                        <li><strong>Pristop:</strong> WordPress + SEO strategija</li>
                        <li><strong>Rezultat:</strong> Od 14 na 150 strank/mesec</li>
                        <li><strong>Konverzija:</strong> 70% iz brezplačnih konzultacij</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🌐 Ostali projekti</h4>
                    <ul>
                        <li><strong>DIY3D.si</strong> - WordPress za 3D printing storitve</li>
                        <li><strong>Hosekra strani</strong> - Vzdrževanje in optimizacija</li>
                        <li><strong>Ta stran</strong> - Čisti HTML/CSS/JS, brez frameworkov</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>WordPress</span>
                        <span>HTML5</span>
                        <span>CSS3</span>
                        <span>JavaScript</span>
                        <span>PHP</span>
                        <span>SEO</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Številke</h4>
                    <ul>
                        <li><strong>10+</strong> spletnih strani</li>
                        <li><strong>5+ let</strong> WordPress izkušenj</li>
                        <li><strong>100%</strong> self-hosted</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 Kaj sem se naučil</h4>
                <p>
                    Da ni pomembno katero orodje uporabljaš - pomembno je da rešiš problem.
                    WordPress za marketing strani, custom koda za specifične potrebe.
                    Vedno izberem pravo orodje za nalogo, ne najnovejšega hype-a.
                </p>
            </div>
        `,

        automations: `
            <div class="modal-header">
                <h2>Avtomatizacije</h2>
                <p>Workflow-i ki delajo namesto mene. Od CRM integracij do WhatsApp obvestil - vse kar se da avtomatizirati.</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Filozofija</h4>
                    <p>
                        Če nekaj delam več kot dvakrat, to avtomatiziram. Čas je omejen vir -
                        zakaj bi ga tratil na ponavljajoče naloge?
                    </p>
                </div>

                <div class="modal-block">
                    <h4>⚡ n8n Workflow-i</h4>
                    <ul>
                        <li><strong>Eva Chatbot MVP</strong> - začetni prototip pred custom rešitvijo</li>
                        <li><strong>CRM integracije</strong> - sinhronizacija podatkov med sistemi</li>
                        <li><strong>Email avtomatizacija</strong> - follow-up sekvence</li>
                        <li><strong>Webhook procesiranje</strong> - real-time odzivi na dogodke</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📱 WhatsApp & SMS</h4>
                    <ul>
                        <li><strong>Opomniki za stranke</strong> - avtomatska sporočila pred termini</li>
                        <li><strong>Potrditve rezervacij</strong> - takojšnje obvestilo</li>
                        <li><strong>Twilio integracija</strong> - za SMS kampanje</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🔄 API Integracije</h4>
                    <ul>
                        <li><strong>Slack obvestila</strong> - alerting za kritične dogodke</li>
                        <li><strong>Google Sheets</strong> - avtomatski reporti</li>
                        <li><strong>Custom webhooks</strong> - povezovanje različnih sistemov</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Orodja</h4>
                    <div class="modal-tech-stack">
                        <span>n8n</span>
                        <span>Make.com</span>
                        <span>Zapier</span>
                        <span>Twilio</span>
                        <span>WhatsApp API</span>
                        <span>Slack API</span>
                        <span>Webhooks</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Rezultat</h4>
                    <ul>
                        <li><strong>10+ ur/teden</strong> prihranjenega časa</li>
                        <li><strong>0 pozabljenih</strong> follow-up-ov</li>
                        <li><strong>Real-time</strong> obveščanje o dogodkih</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 Kaj sem se naučil</h4>
                <p>
                    Da avtomatizacija ni samo za velike firme. Z n8n in Make.com lahko kdorkoli
                    zgradi kompleksne workflow-e brez programiranja. Ampak včasih low-code ni dovolj -
                    takrat se naučiš programirati (kot pri Eva chatbotu).
                </p>
            </div>
        `,

        selfhosted: `
            <div class="modal-header">
                <h2>Self-hosted Stack</h2>
                <p>15+ servisov na lastnih strežnikih. Ker zakaj plačevati mesečne naročnine, če lahko hostaš sam?</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Zakaj self-hosting?</h4>
                    <ul>
                        <li><strong>Kontrola</strong> - moji podatki, moja infrastruktura</li>
                        <li><strong>Učenje</strong> - razumem kako vse deluje</li>
                        <li><strong>Prihranek</strong> - €0/mesec za večino storitev</li>
                        <li><strong>Prilagodljivost</strong> - lahko spremenim karkoli</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🐳 Docker Kontejnerji</h4>
                    <ul>
                        <li><strong>Nextcloud</strong> - oblak za datoteke + TablesPro</li>
                        <li><strong>WordPress (x4)</strong> - DIY3D, George CV, Hosekra, VK</li>
                        <li><strong>Open WebUI</strong> - lokalni AI chat z Ollama</li>
                        <li><strong>phpMyAdmin</strong> - database management</li>
                        <li><strong>Nginx Proxy Manager</strong> - reverse proxy + SSL</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🤖 AI & ML Stack</h4>
                    <ul>
                        <li><strong>Ollama</strong> - lokalni LLM-ji (Llama, Mistral)</li>
                        <li><strong>Open WebUI</strong> - ChatGPT-like interface</li>
                        <li><strong>n8n</strong> - AI workflow avtomatizacija</li>
                        <li><strong>Custom RAG</strong> - vector search z pgvector</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📊 Monitoring & Backup</h4>
                    <ul>
                        <li><strong>Uptime Kuma</strong> - monitoring vseh servisov</li>
                        <li><strong>Duplicati</strong> - avtomatski backupi</li>
                        <li><strong>Watchtower</strong> - avtomatske Docker posodobitve</li>
                        <li><strong>Portainer</strong> - container management UI</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Infrastruktura</h4>
                    <div class="modal-tech-stack">
                        <span>Proxmox</span>
                        <span>Docker</span>
                        <span>Linux</span>
                        <span>UFW</span>
                        <span>Let's Encrypt</span>
                        <span>MariaDB</span>
                        <span>PostgreSQL</span>
                        <span>Redis</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📈 Statistika</h4>
                    <ul>
                        <li><strong>12 let</strong> uptime strežnika</li>
                        <li><strong>15+</strong> Docker kontejnerjev</li>
                        <li><strong>99.9%</strong> availability</li>
                        <li><strong>€15/mesec</strong> stroški (elektrika + internet)</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 Kaj sem se naučil</h4>
                <p>
                    Da self-hosting ni samo za "gike". Je praktična veščina ki te nauči kako
                    infrastruktura resnično deluje. Ko nekaj hostaš sam, razumeš backup strategije,
                    varnost, networking - vse kar IT administrator mora znati.
                    Moj strežnik je moja najboljša referenca.
                </p>
            </div>
        `
    };

    // English modal templates
    const modalTemplatesEN = {
        eva: `
            <div class="modal-header">
                <h2>Eva Chatbot for eTutee</h2>
                <p>AI assistant for a Slovenian tutoring company. From n8n prototype to custom FastAPI solution.</p>
            </div>

            <div class="modal-architecture">
                <img src="${isEnglish ? '../' : ''}eva-architecture.svg" alt="Eva Chatbot Architecture">
            </div>

            <div class="modal-block" style="margin-bottom: var(--space-lg);">
                <h4>🏗️ How it works</h4>
                <p>
                    User sends a message through the web interface connected to FastAPI backend via WebSocket - enabling instant response and typing indicator.
                    When a question arrives, the system first searches for relevant documents in Supabase PostgreSQL database using pgvector extension for vector search.
                    Found documents together with user's question go to OpenAI API, which generates a response.
                    Redis handles session management and caching of frequent queries.
                    If Eva can't answer, it escalates the question to Slack where the team responds - this answer is then saved back to the database for future similar questions.
                </p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🚫 Problem with n8n</h4>
                    <ul>
                        <li>3-5 seconds per response (each step = HTTP request)</li>
                        <li>No real-time feel - like email, not chat</li>
                        <li>Debugging hell - workflow became spaghetti</li>
                        <li>Costs would quickly rise with higher volume</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>✅ Custom solution</h4>
                    <ul>
                        <li><strong>WebSocket</strong> - instant response, typing indicator</li>
                        <li><strong>RAG system</strong> - pgvector search for relevant documents</li>
                        <li><strong>Fine-tuning</strong> - 200 examples for Slovenian tone</li>
                        <li><strong>Self-learning</strong> - learns from Slack escalations</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📊 Results</h4>
                    <ul>
                        <li>Response time: <strong>&lt;1 second</strong> (was 3-5s)</li>
                        <li>Escalations: <strong>only 3%</strong> of questions need human</li>
                        <li>Costs: <strong>€5/month</strong> (would be €20+)</li>
                        <li>Real-time typing indicator for better UX</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>FastAPI</span>
                        <span>Python</span>
                        <span>WebSocket</span>
                        <span>Redis</span>
                        <span>Supabase</span>
                        <span>pgvector</span>
                        <span>OpenAI</span>
                        <span>Slack API</span>
                        <span>Docker</span>
                    </div>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 What I learned</h4>
                <p>
                    That low-code isn't always enough. That understanding architecture is more important than knowing syntax.
                    And that with AI help you can build anything - if you know what you want.
                </p>
            </div>
        `,

        tablespro: `
            <div class="modal-header">
                <h2>TablesPro - Nextcloud CRM</h2>
                <p>Fork of Nextcloud Tables with Monday.com-inspired design. Combination of three tools in one.</p>
            </div>

            <div class="modal-architecture">
                <img src="${isEnglish ? '../' : ''}tablespro-architecture.svg" alt="TablesPro Architecture">
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🚫 Problem</h4>
                    <ul>
                        <li>For VK Massage I needed a CRM system</li>
                        <li>Monday.com worked great - until I hit the free tier limit</li>
                        <li>Paid version too expensive for my scale</li>
                        <li>Started looking for open source alternatives</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🔍 Research</h4>
                    <ul>
                        <li><strong>NocoDB</strong> - excellent sharing functionality</li>
                        <li><strong>Nextcloud Tables</strong> - good integration, basic features</li>
                        <li><strong>Nextcloud Deck</strong> - colleague showed me kanban boards</li>
                        <li>No solution had everything I needed</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>✅ Solution: Fork + AI</h4>
                    <ul>
                        <li>Forked Nextcloud Tables from GitHub</li>
                        <li>With AI help added Monday.com-like design</li>
                        <li>Integrated Deck functionalities</li>
                        <li>Added NocoDB sharing features</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🎯 Added features</h4>
                    <ul>
                        <li><strong>Compact Row Design</strong> - higher data density</li>
                        <li><strong>Summary Rows</strong> - SUM, AVG, MIN, MAX, COUNT</li>
                        <li><strong>Column Resize</strong> - drag-to-resize with persistent width</li>
                        <li><strong>Progress Bars</strong> - visual indicators</li>
                        <li><strong>Activity Tracking</strong> - change tracking</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>Vue.js 2</span>
                        <span>Pinia</span>
                        <span>PHP</span>
                        <span>Nextcloud API</span>
                        <span>SCSS</span>
                        <span>Vite</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Result</h4>
                    <ul>
                        <li>Complete CRM system for €0/month</li>
                        <li>100% self-hosted on my server</li>
                        <li>All features I needed</li>
                        <li>Open source - anyone can use it</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 What I learned</h4>
                <p>
                    That if you need something specific, you can take an existing open source solution
                    and adapt it to your needs. With AI help I could modify Vue.js code
                    even though I'm not a Vue developer. I understood what I wanted to achieve - AI wrote the code.
                </p>
            </div>
        `,

        webprojects: `
            <div class="modal-header">
                <h2>Web Projects</h2>
                <p>From WordPress sites for clients to custom applications for my own needs. I build what I need.</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Motivation</h4>
                    <p>
                        I didn't wait for someone to teach me. When I needed a website for VK Massage,
                        I learned WordPress. When I needed an internal application, I built it.
                    </p>
                </div>

                <div class="modal-block">
                    <h4>💆 VK Massage Website</h4>
                    <ul>
                        <li><strong>Goal:</strong> Acquire new clients organically</li>
                        <li><strong>Approach:</strong> WordPress + SEO strategy</li>
                        <li><strong>Result:</strong> From 14 to 150 clients/month</li>
                        <li><strong>Conversion:</strong> 70% from free consultations</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🌐 Other projects</h4>
                    <ul>
                        <li><strong>DIY3D.si</strong> - WordPress for 3D printing services</li>
                        <li><strong>Hosekra sites</strong> - Maintenance and optimization</li>
                        <li><strong>This site</strong> - Pure HTML/CSS/JS, no frameworks</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Tech Stack</h4>
                    <div class="modal-tech-stack">
                        <span>WordPress</span>
                        <span>HTML5</span>
                        <span>CSS3</span>
                        <span>JavaScript</span>
                        <span>PHP</span>
                        <span>SEO</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Numbers</h4>
                    <ul>
                        <li><strong>10+</strong> websites</li>
                        <li><strong>5+ years</strong> WordPress experience</li>
                        <li><strong>100%</strong> self-hosted</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 What I learned</h4>
                <p>
                    That it doesn't matter which tool you use - what matters is solving the problem.
                    WordPress for marketing sites, custom code for specific needs.
                    I always choose the right tool for the job, not the newest hype.
                </p>
            </div>
        `,

        automations: `
            <div class="modal-header">
                <h2>Automations</h2>
                <p>Workflows that work instead of me. From CRM integrations to WhatsApp notifications - everything that can be automated.</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Philosophy</h4>
                    <p>
                        If I do something more than twice, I automate it. Time is a limited resource -
                        why waste it on repetitive tasks?
                    </p>
                </div>

                <div class="modal-block">
                    <h4>⚡ n8n Workflows</h4>
                    <ul>
                        <li><strong>Eva Chatbot MVP</strong> - initial prototype before custom solution</li>
                        <li><strong>CRM integrations</strong> - data synchronization between systems</li>
                        <li><strong>Email automation</strong> - follow-up sequences</li>
                        <li><strong>Webhook processing</strong> - real-time event responses</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📱 WhatsApp & SMS</h4>
                    <ul>
                        <li><strong>Client reminders</strong> - automatic messages before appointments</li>
                        <li><strong>Booking confirmations</strong> - instant notification</li>
                        <li><strong>Twilio integration</strong> - for SMS campaigns</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🔄 API Integrations</h4>
                    <ul>
                        <li><strong>Slack notifications</strong> - alerting for critical events</li>
                        <li><strong>Google Sheets</strong> - automatic reports</li>
                        <li><strong>Custom webhooks</strong> - connecting different systems</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Tools</h4>
                    <div class="modal-tech-stack">
                        <span>n8n</span>
                        <span>Make.com</span>
                        <span>Zapier</span>
                        <span>Twilio</span>
                        <span>WhatsApp API</span>
                        <span>Slack API</span>
                        <span>Webhooks</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📊 Result</h4>
                    <ul>
                        <li><strong>10+ hours/week</strong> saved time</li>
                        <li><strong>0 forgotten</strong> follow-ups</li>
                        <li><strong>Real-time</strong> event notifications</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 What I learned</h4>
                <p>
                    That automation isn't just for big companies. With n8n and Make.com anyone can
                    build complex workflows without programming. But sometimes low-code isn't enough -
                    that's when you learn to program (like with Eva chatbot).
                </p>
            </div>
        `,

        selfhosted: `
            <div class="modal-header">
                <h2>Self-hosted Stack</h2>
                <p>15+ services on my own servers. Because why pay monthly subscriptions when you can host yourself?</p>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🎯 Why self-hosting?</h4>
                    <ul>
                        <li><strong>Control</strong> - my data, my infrastructure</li>
                        <li><strong>Learning</strong> - I understand how everything works</li>
                        <li><strong>Savings</strong> - €0/month for most services</li>
                        <li><strong>Flexibility</strong> - I can change anything</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🐳 Docker Containers</h4>
                    <ul>
                        <li><strong>Nextcloud</strong> - cloud storage + TablesPro</li>
                        <li><strong>WordPress (x4)</strong> - DIY3D, George CV, Hosekra, VK</li>
                        <li><strong>Open WebUI</strong> - local AI chat with Ollama</li>
                        <li><strong>phpMyAdmin</strong> - database management</li>
                        <li><strong>Nginx Proxy Manager</strong> - reverse proxy + SSL</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>🤖 AI & ML Stack</h4>
                    <ul>
                        <li><strong>Ollama</strong> - local LLMs (Llama, Mistral)</li>
                        <li><strong>Open WebUI</strong> - ChatGPT-like interface</li>
                        <li><strong>n8n</strong> - AI workflow automation</li>
                        <li><strong>Custom RAG</strong> - vector search with pgvector</li>
                    </ul>
                </div>

                <div class="modal-block">
                    <h4>📊 Monitoring & Backup</h4>
                    <ul>
                        <li><strong>Uptime Kuma</strong> - monitoring all services</li>
                        <li><strong>Duplicati</strong> - automatic backups</li>
                        <li><strong>Watchtower</strong> - automatic Docker updates</li>
                        <li><strong>Portainer</strong> - container management UI</li>
                    </ul>
                </div>
            </div>

            <div class="modal-grid">
                <div class="modal-block">
                    <h4>🛠️ Infrastructure</h4>
                    <div class="modal-tech-stack">
                        <span>Proxmox</span>
                        <span>Docker</span>
                        <span>Linux</span>
                        <span>UFW</span>
                        <span>Let's Encrypt</span>
                        <span>MariaDB</span>
                        <span>PostgreSQL</span>
                        <span>Redis</span>
                    </div>
                </div>

                <div class="modal-block">
                    <h4>📈 Statistics</h4>
                    <ul>
                        <li><strong>12 years</strong> server uptime</li>
                        <li><strong>15+</strong> Docker containers</li>
                        <li><strong>99.9%</strong> availability</li>
                        <li><strong>€15/month</strong> costs (electricity + internet)</li>
                    </ul>
                </div>
            </div>

            <div class="modal-lesson">
                <h4>💡 What I learned</h4>
                <p>
                    That self-hosting isn't just for "geeks". It's a practical skill that teaches you how
                    infrastructure really works. When you host something yourself, you understand backup strategies,
                    security, networking - everything an IT administrator needs to know.
                    My server is my best reference.
                </p>
            </div>
        `
    };

    // Select correct templates based on language
    const templates = isEnglish ? modalTemplatesEN : modalTemplates;

    // Open modal
    function openModal(projectId) {
        if (templates[projectId]) {
            modalContent.innerHTML = templates[projectId];
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for modal triggers
    document.querySelectorAll('[data-modal]').forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            // Don't open if clicking the button directly (it has its own handler)
            if (e.target.closest('.btn-modal-open')) return;
            openModal(trigger.dataset.modal);
        });
    });

    // Button specific handler
    document.querySelectorAll('.btn-modal-open').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const trigger = btn.closest('[data-modal]');
            if (trigger) {
                openModal(trigger.dataset.modal);
            }
        });
    });

    // Close handlers
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}


/* ==========================================================================
   GITHUB REPOS
   ========================================================================== */

const GITHUB_USERNAME = 'Dzo4e2250';

// Language colors mapping
const languageColors = {
    'Python': 'lang-python',
    'JavaScript': 'lang-javascript',
    'TypeScript': 'lang-typescript',
    'HTML': 'lang-html',
    'CSS': 'lang-css',
    'PHP': 'lang-php',
    'Shell': 'lang-shell',
    'Vue': 'lang-vue'
};

function getLanguageClass(language) {
    return languageColors[language] || 'lang-default';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(isEnglish ? 'en-US' : 'sl-SI', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Localized strings
const i18n = {
    noDescription: isEnglish ? 'No description' : 'Brez opisa',
    updated: isEnglish ? 'Updated:' : 'Posodobljeno:',
    openOnGitHub: isEnglish ? 'Open on GitHub' : 'Odpri na GitHub',
    moreAboutRole: isEnglish ? 'More about this role →' : 'Več o tej vlogi →',
    hideDetails: isEnglish ? 'Hide details ←' : 'Skrij podrobnosti ←',
    loadingRepos: isEnglish ? 'Loading repositories...' : 'Nalagam repozitorije...',
    errorLoading: isEnglish ? 'Error loading repositories. Please try again later.' : 'Napaka pri nalaganju repozitorijev. Poskusite znova pozneje.',
    openGitHubProfile: isEnglish ? 'Open GitHub profile directly' : 'Odpri GitHub profil direktno',
    noReposFound: isEnglish ? 'No repositories found.' : 'Ni najdenih repozitorijev.'
};

function createSvgElement(pathData, viewBox = '0 0 24 24') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', viewBox);
    svg.setAttribute('fill', 'currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    svg.appendChild(path);
    return svg;
}

function createRepoCard(repo) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    // Header
    const header = document.createElement('div');
    header.className = 'repo-card-header';

    const icon = document.createElement('div');
    icon.className = 'repo-icon';
    const githubSvg = createSvgElement('M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z');
    icon.appendChild(githubSvg);

    const titleWrapper = document.createElement('div');
    const title = document.createElement('h3');
    title.className = 'repo-title';
    title.textContent = repo.name;

    const visibility = document.createElement('span');
    visibility.className = 'repo-visibility';
    visibility.textContent = repo.private ? 'Private' : 'Public';

    titleWrapper.appendChild(title);
    titleWrapper.appendChild(visibility);
    header.appendChild(icon);
    header.appendChild(titleWrapper);

    // Description
    const description = document.createElement('p');
    description.className = 'repo-description';
    description.textContent = repo.description || i18n.noDescription;

    // Meta
    const meta = document.createElement('div');
    meta.className = 'repo-meta';

    if (repo.language) {
        const langItem = document.createElement('span');
        langItem.className = 'repo-meta-item';
        const langDot = document.createElement('span');
        langDot.className = 'repo-language-dot ' + getLanguageClass(repo.language);
        const langText = document.createTextNode(repo.language);
        langItem.appendChild(langDot);
        langItem.appendChild(langText);
        meta.appendChild(langItem);
    }

    if (repo.stargazers_count > 0) {
        const starsItem = document.createElement('span');
        starsItem.className = 'repo-meta-item';
        const starSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        starSvg.setAttribute('width', '16');
        starSvg.setAttribute('height', '16');
        starSvg.setAttribute('viewBox', '0 0 24 24');
        starSvg.setAttribute('fill', 'none');
        starSvg.setAttribute('stroke', 'currentColor');
        starSvg.setAttribute('stroke-width', '2');
        const starPath = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        starPath.setAttribute('points', '12,2 15,9 22,9 17,14 19,21 12,17 5,21 7,14 2,9 9,9');
        starSvg.appendChild(starPath);
        starsItem.appendChild(starSvg);
        starsItem.appendChild(document.createTextNode(' ' + repo.stargazers_count));
        meta.appendChild(starsItem);
    }

    const dateItem = document.createElement('span');
    dateItem.className = 'repo-meta-item';
    dateItem.textContent = i18n.updated + ' ' + formatDate(repo.updated_at);
    meta.appendChild(dateItem);

    // Actions
    const actions = document.createElement('div');
    actions.className = 'repo-actions';

    const githubLink = document.createElement('a');
    githubLink.href = repo.html_url;
    githubLink.target = '_blank';
    githubLink.rel = 'noopener noreferrer';
    githubLink.className = 'repo-link';

    const linkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    linkSvg.setAttribute('viewBox', '0 0 24 24');
    linkSvg.setAttribute('fill', 'none');
    linkSvg.setAttribute('stroke', 'currentColor');
    linkSvg.setAttribute('stroke-width', '2');
    const linkPath1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linkPath1.setAttribute('d', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6');
    const linkPath2 = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    linkPath2.setAttribute('points', '15 3 21 3 21 9');
    const linkPath3 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    linkPath3.setAttribute('x1', '10');
    linkPath3.setAttribute('y1', '14');
    linkPath3.setAttribute('x2', '21');
    linkPath3.setAttribute('y2', '3');
    linkSvg.appendChild(linkPath1);
    linkSvg.appendChild(linkPath2);
    linkSvg.appendChild(linkPath3);

    githubLink.appendChild(linkSvg);
    githubLink.appendChild(document.createTextNode(' ' + i18n.openOnGitHub));
    actions.appendChild(githubLink);

    // Assemble card
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(actions);

    return card;
}

function showError() {
    const reposContainer = document.getElementById('reposContainer');
    if (!reposContainer) return;
    reposContainer.replaceChildren();
    const errorDiv = document.createElement('div');
    errorDiv.className = 'repos-error';
    const errorText = document.createElement('p');
    errorText.textContent = i18n.errorLoading;
    const linkWrapper = document.createElement('p');
    linkWrapper.style.marginTop = '1rem';
    const directLink = document.createElement('a');
    directLink.href = 'https://github.com/' + GITHUB_USERNAME;
    directLink.target = '_blank';
    directLink.rel = 'noopener noreferrer';
    directLink.style.color = 'inherit';
    directLink.style.textDecoration = 'underline';
    directLink.textContent = i18n.openGitHubProfile;
    linkWrapper.appendChild(directLink);
    errorDiv.appendChild(errorText);
    errorDiv.appendChild(linkWrapper);
    reposContainer.appendChild(errorDiv);
}

function showEmpty() {
    const reposContainer = document.getElementById('reposContainer');
    if (!reposContainer) return;
    reposContainer.replaceChildren();
    const emptyDiv = document.createElement('div');
    emptyDiv.className = 'repos-empty';
    const emptyText = document.createElement('p');
    emptyText.textContent = i18n.noReposFound;
    emptyDiv.appendChild(emptyText);
    reposContainer.appendChild(emptyDiv);
}

async function fetchRepos() {
    const reposContainer = document.getElementById('reposContainer');
    if (!reposContainer) return;
    try {
        const response = await fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=100');

        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }

        const repos = await response.json();

        if (repos.length === 0) {
            showEmpty();
            return;
        }

        // Filter out forked repos and sort by most recently updated
        const ownRepos = repos.filter(function(repo) {
            return !repo.fork;
        });

        reposContainer.replaceChildren();
        ownRepos.forEach(function(repo) {
            reposContainer.appendChild(createRepoCard(repo));
        });

    } catch (error) {
        console.error('Error fetching repos:', error);
        showError();
    }
}

/* ==========================================================================
   CONSOLE MESSAGE
   ========================================================================== */

console.log('%cPozdravljeni!', 'font-size: 20px; font-weight: bold; color: #0d9488;');
console.log('%cIscete nekoga ki gradi resitve? Kontaktirajte me!', 'font-size: 14px; color: #475569;');