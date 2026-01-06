/* ==========================================================================
   GEORGE BUILDS THINGS - JavaScript (Clean Version)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initSmoothScroll();
    initFormHandler();
    initNavHighlight();
    initNavScroll();
    initExpandableCards();
});

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
                if (currentText.includes('Več')) {
                    expandBtnText.textContent = 'Skrij podrobnosti ←';
                } else {
                    expandBtnText.textContent = currentText.includes('vlogi')
                        ? 'Več o tej vlogi →'
                        : 'Več o tej poti →';
                }
            }

            // Update large button text
            if (expandBtnLarge) {
                const span = expandBtnLarge.querySelector('span');
                if (span) {
                    span.textContent = isExpanded
                        ? 'Poglej tehnične podrobnosti'
                        : 'Skrij podrobnosti';
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
                    Namesto da bi se pritoževal nad omejitvami n8n, sem se naučil Python in zgradil pravo rešitev.
                </p>
            </div>
        `,

        tablespro: `
            <div class="modal-header">
                <h2>TablesPro - Nextcloud CRM</h2>
                <p>Fork Nextcloud Tables z Monday.com-inspired dizajnom. Kombinacija treh orodij v enem.</p>
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
                    <h4>📱 Mat Tracker PWA</h4>
                    <ul>
                        <li><strong>Potreba:</strong> Sledenje inventarja predpražnikov pri Lindström</li>
                        <li><strong>Rešitev:</strong> Progressive Web App s QR skeniranjem</li>
                        <li><strong>Tech:</strong> HTML, CSS, JavaScript, LocalStorage</li>
                        <li><strong>Rezultat:</strong> Deluje offline, instalacija na telefon</li>
                    </ul>
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
                        <span>PWA</span>
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

    // Open modal
    function openModal(projectId) {
        if (modalTemplates[projectId]) {
            modalContent.innerHTML = modalTemplates[projectId];
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
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Initialize modal on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initModalSystem();
});

/* ==========================================================================
   CONSOLE MESSAGE
   ========================================================================== */

console.log('%cPozdravljeni!', 'font-size: 20px; font-weight: bold; color: #0d9488;');
console.log('%cIscete nekoga ki gradi resitve? Kontaktirajte me!', 'font-size: 14px; color: #475569;');
