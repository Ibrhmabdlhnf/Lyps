/* ============================================================
   LYPS AI — Premium Chat Interface
   Powered by Puter.js (free AI: GPT-4o, Claude, Gemini, DeepSeek)
   ============================================================ */

(() => {
    'use strict';

    /* Expose a global modal closer as a defensive fallback —
       so inline onclick handlers always work regardless of init timing. */
    window.HanifCloseModal = function(id) {
        const el = id ? document.getElementById(id) : document.querySelector('.modal.is-open');
        if (el) el.classList.remove('is-open');
    };
    window.HanifOpenModal = function(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('is-open');
    };

    /* Esc key — wired immediately, doesn't wait for DOMContentLoaded */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.is-open');
            if (openModal) {
                openModal.classList.remove('is-open');
                e.stopPropagation();
            }
        }
    }, true); // capture phase to win over other handlers

    /* ================================================================
       CONFIGURATION
       ================================================================ */
    const MODELS = [
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            desc: 'Cepat, cerdas, all-rounder dari OpenAI',
            tag: 'Default',
            icon: 'fa-bolt',
            c1: '#7c5cff', c2: '#00d4ff'
        },
        {
            id: 'gpt-5-nano',
            name: 'GPT-5 Nano',
            desc: 'Ringan & super responsif',
            tag: 'Cepat',
            icon: 'fa-feather',
            c1: '#22c55e', c2: '#00d4ff'
        },
        {
            id: 'claude-sonnet-4',
            name: 'Claude Sonnet 4',
            desc: 'Penalaran mendalam & penulisan elegan',
            tag: 'Tulisan',
            icon: 'fa-feather-pointed',
            c1: '#ff8c42', c2: '#ff5cf7'
        },
        {
            id: 'claude-opus-4',
            name: 'Claude Opus 4',
            desc: 'Model paling kuat untuk tugas kompleks',
            tag: 'Pintar',
            icon: 'fa-crown',
            c1: '#ff5cf7', c2: '#7c5cff'
        },
        {
            id: 'google/gemini-2.5-flash',
            name: 'Gemini 2.5 Flash',
            desc: 'Multimodal & cepat dari Google',
            tag: 'Multimodal',
            icon: 'fa-google',
            c1: '#00d4ff', c2: '#22c55e'
        },
        {
            id: 'deepseek-chat',
            name: 'DeepSeek V3',
            desc: 'Logika & matematika luar biasa',
            tag: 'Logika',
            icon: 'fa-brain',
            c1: '#7c5cff', c2: '#ff5cf7'
        },
        {
            id: 'deepseek-reasoner',
            name: 'DeepSeek R1',
            desc: 'Reasoning step-by-step terbaik',
            tag: 'Reasoning',
            icon: 'fa-microchip',
            c1: '#ffd166', c2: '#ff8c42'
        },
        {
            id: 'meta-llama/llama-4-maverick',
            name: 'Llama 4 Maverick',
            desc: 'Open-source flagship dari Meta',
            tag: 'Open',
            icon: 'fa-meta',
            c1: '#22c55e', c2: '#7c5cff'
        }
    ];

    const PERSONAS = [
        {
            id: 'smart',
            name: 'Cerdas',
            desc: 'Akurat, terstruktur, dan jelas',
            icon: 'fa-wand-magic-sparkles',
            c1: '#7c5cff', c2: '#00d4ff',
            system: `Kamu adalah Hanif AI — asisten cerdas generasi baru yang menjawab dengan kualitas premium yang melampaui asisten AI lainnya. Standar respon kamu:

1. **Selalu mulai dengan jawaban langsung** — tidak bertele-tele, tidak meminta maaf, tidak basa-basi.
2. **Format yang indah & mudah dibaca**:
   - Pakai heading (## atau ###) untuk struktur jika respon >150 kata
   - Pakai bullet points atau tabel saat ada list/komparasi
   - Pakai **bold** untuk istilah penting, *italic* untuk penekanan halus
   - Pakai blockquote untuk catatan/tips
   - Pakai emoji secukupnya & relevan (tidak berlebihan)
3. **Kode**: selalu di code block dengan bahasa yang tepat (\`\`\`js, \`\`\`python, dll). Tambah komentar singkat di poin-poin penting.
4. **Bahasa Indonesia natural** secara default, kecuali user pakai bahasa lain — ikuti bahasa user.
5. **Akurasi**: jika tidak yakin, katakan terus terang & beri opsi/asumsi. Jangan mengarang fakta.
6. **Selesai dengan nilai tambah**: tutup dengan saran lanjutan, pertanyaan klarifikasi, atau langkah berikutnya yang relevan — buat user merasa tergerak untuk lanjut.

Tujuanmu: setiap respon harus terasa seperti dari pakar pribadi yang ramah, tepat, dan estetik.`
        },
        {
            id: 'creative',
            name: 'Kreatif',
            desc: 'Imajinatif, ekspresif, penuh warna',
            icon: 'fa-palette',
            c1: '#ff5cf7', c2: '#ff8c42',
            system: `Kamu Hanif AI mode Kreatif — asisten dengan imajinasi liar dan jiwa seniman. Kamu menulis dengan metafora yang segar, sudut pandang yang tak terduga, dan rasa yang menyentuh. Pakai gaya bahasa puitis tapi tetap jelas. Format respon dengan indah (heading, bullet, kutipan). Kalau diminta brainstorm, beri 3-5 ide tak biasa dengan penjelasan singkat. Bahasa Indonesia natural & ekspresif. Tutup dengan kalimat yang menginspirasi.`
        },
        {
            id: 'precise',
            name: 'Presisi',
            desc: 'Singkat, padat, fakta saja',
            icon: 'fa-bullseye',
            c1: '#22c55e', c2: '#00d4ff',
            system: `Kamu Hanif AI mode Presisi — asisten teknis yang menjawab seperti dokumen referensi. Standar:
- Respon singkat & padat, tanpa basa-basi
- Pakai bullet points & numbered list untuk struktur
- Kode dalam code block dengan bahasa yang tepat
- Tabel untuk komparasi
- Hindari kata pengisi ("Tentu!", "Tentu saja", "Saya akan", dll)
- Langsung ke poin
- Bahasa Indonesia kalau user pakai Indonesia, English kalau user pakai English

Tujuan: efisiensi maksimum tanpa mengorbankan kelengkapan informasi penting.`
        },
        {
            id: 'coder',
            name: 'Coder',
            desc: 'Pakar coding & arsitektur software',
            icon: 'fa-code',
            c1: '#00d4ff', c2: '#7c5cff',
            system: `Kamu Hanif AI mode Coder — senior software engineer dengan 15+ tahun pengalaman. Standar respon:

1. **Selalu sertakan kode lengkap yang bisa dijalankan**, bukan pseudocode
2. **Pilih bahasa & framework modern**: TypeScript > JavaScript, gunakan ES modules, async/await
3. **Best practice**: type safety, error handling, edge cases, accessibility
4. **Penjelasan setelah kode**: bukan baris-per-baris, tapi konsep penting & alasan keputusan teknis
5. **Performa & keamanan**: sebutkan trade-off jika ada
6. **Tampilan kode**:
   - Pakai code block dengan bahasa yang benar (\`\`\`tsx, \`\`\`python, dll)
   - Komentar untuk bagian non-obvious
   - Nama variabel deskriptif
7. **Saran lanjutan**: testing, refactor, atau improvement yang masuk akal

Bahasa Indonesia untuk penjelasan, kode tetap dalam English. Buat user merasa belajar, bukan cuma copy-paste.`
        },
        {
            id: 'tutor',
            name: 'Tutor',
            desc: 'Sabar menjelaskan dengan analogi',
            icon: 'fa-graduation-cap',
            c1: '#ffd166', c2: '#ff8c42',
            system: `Kamu Hanif AI mode Tutor — guru pribadi yang sabar dan inspiratif. Cara mengajar:

1. **Mulai dengan analogi sehari-hari** sebelum konsep teknis
2. **Bangun bertahap**: dari yang familiar ke yang baru
3. **Gunakan contoh konkret**, idealnya 2-3
4. **Cek pemahaman**: ajukan 1 pertanyaan refleksi di akhir
5. **Format**:
   - Heading untuk setiap konsep
   - Bullet untuk poin-poin
   - Blockquote (>) untuk "kunci pemahaman"
   - Emoji edukatif yang relevan
6. **Bahasa hangat & mengundang**: "Bayangkan...", "Coba pikirkan...", "Menarik kan?"

Bahasa Indonesia natural, hangat, tidak menggurui. Buat user merasa pintar setelah selesai membaca.`
        },
        {
            id: 'business',
            name: 'Bisnis',
            desc: 'Strategis, profesional, ROI-fokus',
            icon: 'fa-briefcase',
            c1: '#7c5cff', c2: '#22c55e',
            system: `Kamu Hanif AI mode Bisnis — konsultan strategi dengan jam terbang McKinsey/BCG. Standar respon:

1. **Framework dulu**: pakai struktur yang relevan (SWOT, Porter's 5, AIDA, RACE, dll)
2. **Data-driven**: sebutkan asumsi dan metrik yang harus dipantau
3. **Action items**: setiap rekomendasi harus actionable dengan timeline
4. **Trade-off jelas**: sebutkan risiko & alternatif
5. **Format profesional**:
   - Executive summary 2-3 baris di awal
   - Heading per area
   - Tabel untuk komparasi opsi
   - Bullet untuk rekomendasi
6. **Bahasa eksekutif**: tegas, percaya diri, no fluff

Bahasa Indonesia formal-profesional. Tutup dengan "Next steps" konkret 3 poin.`
        }
    ];

    const STORAGE_KEY = 'lyps-ai-data-v1';
    const THEME_KEY = 'lyps-theme';

    /* ================================================================
       STATE
       ================================================================ */
    const state = {
        conversations: [],
        currentId: null,
        modelId: 'gpt-4o',
        personaId: 'smart',
        streaming: false,
        abortStream: null,
        attachment: null
    };

    /* ================================================================
       DOM
       ================================================================ */
    const $ = (id) => document.getElementById(id);
    const els = {
        app: $('app'),
        sidebar: $('sidebar'),
        sidebarOpen: $('sidebarOpen'),
        sidebarCollapse: $('sidebarCollapse'),
        newChatBtn: $('newChatBtn'),
        topNewChat: $('topNewChat'),
        searchInput: $('searchInput'),
        conversationList: $('conversationList'),
        exportBtn: $('exportBtn'),
        clearAllBtn: $('clearAllBtn'),
        shortcutsBtn: $('shortcutsBtn'),
        themeToggle: $('themeToggle'),
        modelPill: $('modelPill'),
        modelPillName: $('modelPillName'),
        personaPill: $('personaPill'),
        personaPillName: $('personaPillName'),
        modelPicker: $('modelPicker'),
        modelList: $('modelList'),
        personaPicker: $('personaPicker'),
        personaList: $('personaList'),
        chatArea: $('chatArea'),
        welcome: $('welcome'),
        suggestions: $('suggestions'),
        messages: $('messages'),
        scrollBottom: $('scrollBottom'),
        composer: $('composer'),
        composerInput: $('composerInput'),
        sendBtn: $('sendBtn'),
        stopBtn: $('stopBtn'),
        attachBtn: $('attachBtn'),
        fileInput: $('fileInput'),
        micBtn: $('micBtn'),
        shareBtn: $('shareBtn'),
        shortcutsModal: $('shortcutsModal'),
        toastStack: $('toastStack'),
        brandHome: $('brandHome')
    };

    /* ================================================================
       UTILITIES
       ================================================================ */
    const uid = () => 'c_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const fmtTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };
    const fmtDay = (ts) => new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    function toast(msg, type = 'info', duration = 2800) {
        const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${escapeHtml(msg)}</span>`;
        els.toastStack.appendChild(t);
        setTimeout(() => {
            t.classList.add('removing');
            setTimeout(() => t.remove(), 250);
        }, duration);
    }

    /* ================================================================
       STORAGE
       ================================================================ */
    function saveState() {
        try {
            // Strip large dataUrls (image base64) before saving — too big for localStorage
            const conversations = state.conversations.map(c => ({
                ...c,
                messages: c.messages.map(m => {
                    if (!m.attachmentDataUrl) return m;
                    const { attachmentDataUrl, ...rest } = m;
                    return rest;
                })
            }));
            const data = {
                conversations,
                currentId: state.currentId,
                modelId: state.modelId,
                personaId: state.personaId
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Storage save failed:', e);
        }
    }
    function loadState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            state.conversations = data.conversations || [];
            state.currentId = data.currentId || null;
            state.modelId = data.modelId || 'gpt-4o';
            state.personaId = data.personaId || 'smart';
        } catch (e) {
            console.warn('Storage load failed:', e);
        }
    }

    /* ================================================================
       THEME
       ================================================================ */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a0a14' : '#f7f7fb');
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
    }
    function toggleTheme() {
        const cur = document.documentElement.getAttribute('data-theme');
        applyTheme(cur === 'dark' ? 'light' : 'dark');
    }
    function initTheme() {
        let theme = 'dark';
        try {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved) theme = saved;
            else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) theme = 'light';
        } catch (e) {}
        applyTheme(theme);
    }

    /* ================================================================
       MARKDOWN RENDERING
       ================================================================ */
    function configureMarked() {
        if (typeof marked === 'undefined') return;
        marked.setOptions({
            gfm: true,
            breaks: true,
            highlight: function(code, lang) {
                if (typeof hljs !== 'undefined') {
                    try {
                        if (lang && hljs.getLanguage(lang)) {
                            return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
                        }
                        return hljs.highlightAuto(code).value;
                    } catch (e) { return escapeHtml(code); }
                }
                return escapeHtml(code);
            }
        });
    }
    function renderMarkdown(text) {
        if (typeof marked === 'undefined') return escapeHtml(text).replace(/\n/g, '<br>');
        const raw = marked.parse(text);
        const clean = (typeof DOMPurify !== 'undefined')
            ? DOMPurify.sanitize(raw, { ADD_ATTR: ['target', 'rel'] })
            : raw;
        return clean;
    }
    function decorateCodeBlocks(container) {
        container.querySelectorAll('pre').forEach(pre => {
            if (pre.dataset.decorated) return;
            pre.dataset.decorated = '1';
            const code = pre.querySelector('code');
            if (!code) return;
            const langClass = (code.className || '').split(' ').find(c => c.startsWith('language-'));
            const lang = langClass ? langClass.replace('language-', '') : 'text';
            const header = document.createElement('div');
            header.className = 'code-header';
            header.innerHTML = `<span><i class="fas fa-code"></i> ${escapeHtml(lang)}</span>
                <button class="code-copy" type="button"><i class="fas fa-copy"></i> Salin</button>`;
            pre.insertBefore(header, code);
            const btn = header.querySelector('.code-copy');
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(code.innerText);
                    btn.classList.add('copied');
                    btn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                    setTimeout(() => {
                        btn.classList.remove('copied');
                        btn.innerHTML = '<i class="fas fa-copy"></i> Salin';
                    }, 1600);
                } catch (e) { toast('Gagal menyalin', 'error'); }
            });
        });
        // Open links in new tab
        container.querySelectorAll('a[href^="http"]').forEach(a => {
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        });
    }

    /* ================================================================
       MODEL & PERSONA PICKERS
       ================================================================ */
    function buildModelPicker() {
        els.modelList.innerHTML = MODELS.map(m => `
            <div class="picker-item ${m.id === state.modelId ? 'selected' : ''}" data-id="${m.id}">
                <div class="pi-icon" style="--c1:${m.c1};--c2:${m.c2}"><i class="fas ${m.icon}"></i></div>
                <div class="pi-text">
                    <div class="pi-name">${m.name} ${m.tag ? `<span class="pi-tag">${m.tag}</span>` : ''}</div>
                    <div class="pi-desc">${m.desc}</div>
                </div>
                <div class="pi-check"><i class="fas fa-check-circle"></i></div>
            </div>
        `).join('');
        els.modelList.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                state.modelId = item.dataset.id;
                const m = MODELS.find(x => x.id === state.modelId);
                els.modelPillName.textContent = m.name;
                buildModelPicker();
                closePickers();
                saveState();
                toast(`Model: ${m.name}`, 'info', 1800);
            });
        });
    }
    function buildPersonaPicker() {
        els.personaList.innerHTML = PERSONAS.map(p => `
            <div class="picker-item ${p.id === state.personaId ? 'selected' : ''}" data-id="${p.id}">
                <div class="pi-icon" style="--c1:${p.c1};--c2:${p.c2}"><i class="fas ${p.icon}"></i></div>
                <div class="pi-text">
                    <div class="pi-name">${p.name}</div>
                    <div class="pi-desc">${p.desc}</div>
                </div>
                <div class="pi-check"><i class="fas fa-check-circle"></i></div>
            </div>
        `).join('');
        els.personaList.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                state.personaId = item.dataset.id;
                const p = PERSONAS.find(x => x.id === state.personaId);
                els.personaPillName.textContent = p.name;
                buildPersonaPicker();
                closePickers();
                saveState();
                toast(`Persona: ${p.name}`, 'info', 1800);
            });
        });
    }
    function closePickers() {
        els.modelPicker.classList.remove('open');
        els.personaPicker.classList.remove('open');
        els.modelPill.setAttribute('aria-expanded', 'false');
        els.personaPill.setAttribute('aria-expanded', 'false');
        setTimeout(() => {
            if (!els.modelPicker.classList.contains('open')) els.modelPicker.hidden = true;
            if (!els.personaPicker.classList.contains('open')) els.personaPicker.hidden = true;
        }, 250);
    }
    function togglePicker(picker, pill, otherPicker, otherPill) {
        const isOpen = picker.classList.contains('open');
        otherPicker.classList.remove('open');
        otherPill.setAttribute('aria-expanded', 'false');
        if (isOpen) {
            picker.classList.remove('open');
            pill.setAttribute('aria-expanded', 'false');
            setTimeout(() => { picker.hidden = true; }, 250);
        } else {
            picker.hidden = false;
            requestAnimationFrame(() => picker.classList.add('open'));
            pill.setAttribute('aria-expanded', 'true');
        }
    }

    /* ================================================================
       CONVERSATIONS
       ================================================================ */
    function getCurrent() {
        return state.conversations.find(c => c.id === state.currentId);
    }
    function newConversation(autoSwitch = true) {
        const conv = {
            id: uid(),
            title: 'Chat baru',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
            modelId: state.modelId,
            personaId: state.personaId
        };
        state.conversations.unshift(conv);
        if (autoSwitch) state.currentId = conv.id;
        saveState();
        renderConversationList();
        renderMessages();
        return conv;
    }
    function switchConversation(id) {
        state.currentId = id;
        saveState();
        renderConversationList();
        renderMessages();
        if (window.innerWidth <= 920) els.app.classList.add('sidebar-collapsed');
    }
    function deleteConversation(id) {
        state.conversations = state.conversations.filter(c => c.id !== id);
        if (state.currentId === id) state.currentId = null;
        saveState();
        renderConversationList();
        renderMessages();
        toast('Percakapan dihapus', 'success', 1600);
    }
    function renameConversation(id, title) {
        const c = state.conversations.find(x => x.id === id);
        if (!c) return;
        c.title = title.trim().slice(0, 60) || 'Chat baru';
        c.updatedAt = Date.now();
        saveState();
        renderConversationList();
    }
    function clearAllConversations() {
        if (!confirm('Hapus semua percakapan? Tindakan ini tidak bisa dibatalkan.')) return;
        state.conversations = [];
        state.currentId = null;
        saveState();
        renderConversationList();
        renderMessages();
        toast('Semua percakapan dihapus', 'success');
    }
    function autoTitleFromMessage(text) {
        return text.replace(/\s+/g, ' ').trim().slice(0, 48) || 'Chat baru';
    }

    function renderConversationList() {
        const q = (els.searchInput.value || '').toLowerCase().trim();
        const list = state.conversations.filter(c => {
            if (!q) return true;
            const inTitle = c.title.toLowerCase().includes(q);
            const inMsg = c.messages.some(m => (m.content || '').toLowerCase().includes(q));
            return inTitle || inMsg;
        });

        if (!list.length) {
            els.conversationList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-comments"></i>
                    <div>${q ? 'Tidak ada hasil' : 'Belum ada percakapan'}</div>
                </div>`;
            return;
        }

        els.conversationList.innerHTML = list.map(c => `
            <div class="conversation-item ${c.id === state.currentId ? 'active' : ''}" data-id="${c.id}" title="${escapeHtml(c.title)}">
                <div class="ci-icon"><i class="fas fa-comment"></i></div>
                <div class="ci-title">${escapeHtml(c.title)}</div>
                <div class="ci-actions">
                    <button class="ci-action" data-act="rename" title="Ganti nama"><i class="fas fa-pen"></i></button>
                    <button class="ci-action danger" data-act="delete" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </div>`).join('');

        els.conversationList.querySelectorAll('.conversation-item').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('.ci-action')) return;
                switchConversation(el.dataset.id);
            });
            el.querySelector('[data-act="delete"]').addEventListener('click', (e) => {
                e.stopPropagation();
                deleteConversation(el.dataset.id);
            });
            el.querySelector('[data-act="rename"]').addEventListener('click', (e) => {
                e.stopPropagation();
                const cur = state.conversations.find(c => c.id === el.dataset.id);
                const name = prompt('Ganti nama percakapan:', cur.title);
                if (name !== null) renameConversation(el.dataset.id, name);
            });
        });
    }

    /* ================================================================
       MESSAGES RENDER
       ================================================================ */
    function renderMessages() {
        const conv = getCurrent();
        if (!conv || conv.messages.length === 0) {
            els.welcome.hidden = false;
            els.messages.hidden = true;
            els.messages.innerHTML = '';
            return;
        }
        els.welcome.hidden = true;
        els.messages.hidden = false;
        els.messages.innerHTML = conv.messages.map((m, idx) => renderMessageHTML(m, idx === conv.messages.length - 1)).join('');
        els.messages.querySelectorAll('.msg-bubble').forEach(b => decorateCodeBlocks(b));
        wireMessageActions();
        scrollToBottom();
    }
    function renderMessageHTML(m, isLast) {
        const isUser = m.role === 'user';
        const avatarChar = isUser ? '<i class="fas fa-user"></i>' : 'H';
        const persona = PERSONAS.find(p => p.id === (m.personaId || state.personaId));
        const model = MODELS.find(mm => mm.id === (m.modelId || state.modelId));

        // Attachment preview (only for user messages)
        let attHTML = '';
        if (isUser && m.attachment) {
            if (m.attachment.kind === 'image' && m.attachmentDataUrl) {
                attHTML = `<div class="msg-attachment image">
                    <img src="${m.attachmentDataUrl}" alt="${escapeHtml(m.attachment.name)}" loading="lazy">
                </div>`;
            } else {
                const icon = m.attachment.kind === 'image' ? 'fa-image' : 'fa-file-lines';
                attHTML = `<div class="msg-attachment file">
                    <i class="fas ${icon}"></i>
                    <span>${escapeHtml(m.attachment.name)}</span>
                </div>`;
            }
        }

        const bubbleHTML = isUser
            ? `<div class="msg-bubble">${attHTML}${m.content ? escapeHtml(m.content).replace(/\n/g, '<br>') : ''}</div>`
            : `<div class="msg-bubble">${m.content ? renderMarkdown(m.content) : '<div class="thinking"><span></span><span></span><span></span></div>'}</div>`;

        const meta = isUser
            ? `<div class="msg-meta"><span>${fmtTime(m.ts)}</span><strong>Anda</strong></div>`
            : `<div class="msg-meta"><strong>Hanif AI</strong>${model ? `<span class="msg-model">${escapeHtml(model.name)}</span>` : ''}<span>${fmtTime(m.ts)}</span></div>`;

        const actions = !isUser && m.content ? `
            <div class="msg-actions">
                <button class="msg-action-btn" data-act="copy" data-idx="${m.idx}"><i class="fas fa-copy"></i> Salin</button>
                <button class="msg-action-btn" data-act="regen" data-idx="${m.idx}"><i class="fas fa-rotate"></i> Ulangi</button>
                <button class="msg-action-btn" data-act="like" data-idx="${m.idx}"><i class="far fa-thumbs-up"></i></button>
            </div>` : '';

        return `<div class="message ${m.role} ${m.completed ? 'completed' : ''}" data-idx="${m.idx}">
            <div class="msg-avatar">${avatarChar}</div>
            <div class="msg-body">
                ${meta}
                ${bubbleHTML}
                ${actions}
            </div>
        </div>`;
    }
    function wireMessageActions() {
        els.messages.querySelectorAll('.msg-action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const act = btn.dataset.act;
                const idx = Number(btn.dataset.idx);
                const conv = getCurrent();
                if (!conv) return;
                const m = conv.messages[idx];
                if (!m) return;

                if (act === 'copy') {
                    navigator.clipboard.writeText(m.content).then(() => {
                        btn.classList.add('success');
                        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                        setTimeout(() => {
                            btn.classList.remove('success');
                            btn.innerHTML = '<i class="fas fa-copy"></i> Salin';
                        }, 1600);
                    }).catch(() => toast('Gagal menyalin', 'error'));
                } else if (act === 'regen') {
                    if (state.streaming) { toast('Tunggu respon selesai dulu', 'info'); return; }
                    regenerateFrom(idx);
                } else if (act === 'like') {
                    btn.classList.add('success');
                    btn.innerHTML = '<i class="fas fa-thumbs-up"></i>';
                    toast('Terima kasih atas feedback-nya!', 'success', 1600);
                }
            });
        });
    }

    /* ================================================================
       SCROLL HANDLING
       ================================================================ */
    function scrollToBottom(smooth = true) {
        els.chatArea.scrollTo({ top: els.chatArea.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    }
    function updateScrollBtn() {
        const dist = els.chatArea.scrollHeight - els.chatArea.scrollTop - els.chatArea.clientHeight;
        if (dist > 200) els.scrollBottom.classList.add('show');
        else els.scrollBottom.classList.remove('show');
    }

    /* ================================================================
       SEND / STREAM (Puter.js)
       ================================================================ */
    async function sendMessage(text) {
        text = (text || '').trim();
        const att = state.attachment;
        if ((!text && !att) || state.streaming) return;

        let conv = getCurrent();
        if (!conv) conv = newConversation();

        // Idx assignment
        const userIdx = conv.messages.length;
        const userMsg = { role: 'user', content: text, ts: Date.now(), idx: userIdx };
        if (att) {
            userMsg.attachment = { name: att.name, type: att.type, kind: att.kind };
            if (att.kind === 'text') userMsg.attachmentText = att.text;
            if (att.kind === 'image') userMsg.attachmentDataUrl = att.dataUrl;
        }
        conv.messages.push(userMsg);

        if (conv.messages.length === 1) {
            conv.title = autoTitleFromMessage(text || (att ? att.name : 'Lampiran'));
        }
        conv.updatedAt = Date.now();

        // Clear attachment from state after attaching to message
        state.attachment = null;
        renderAttachmentChip();

        const aiIdx = conv.messages.length;
        conv.messages.push({
            role: 'assistant',
            content: '',
            ts: Date.now(),
            idx: aiIdx,
            modelId: state.modelId,
            personaId: state.personaId,
            completed: false
        });

        saveState();
        renderConversationList();
        renderMessages();

        await streamFromAI(conv, aiIdx);
    }

    async function regenerateFrom(aiIdx) {
        const conv = getCurrent();
        if (!conv) return;
        const aiMsg = conv.messages[aiIdx];
        if (!aiMsg || aiMsg.role !== 'assistant') return;
        aiMsg.content = '';
        aiMsg.completed = false;
        aiMsg.ts = Date.now();
        aiMsg.modelId = state.modelId;
        aiMsg.personaId = state.personaId;
        saveState();
        renderMessages();
        await streamFromAI(conv, aiIdx);
    }

    function buildPuterMessages(conv, uptoIdx) {
        const persona = PERSONAS.find(p => p.id === state.personaId) || PERSONAS[0];
        const msgs = [{ role: 'system', content: persona.system }];
        for (let i = 0; i < uptoIdx; i++) {
            const m = conv.messages[i];
            if (!m) continue;
            // Image attachment → multimodal content array
            if (m.role === 'user' && m.attachment && m.attachment.kind === 'image' && m.attachmentDataUrl) {
                msgs.push({
                    role: 'user',
                    content: [
                        { type: 'text', text: m.content || 'Tolong analisa gambar ini.' },
                        { type: 'image_url', image_url: { url: m.attachmentDataUrl } }
                    ]
                });
                continue;
            }
            // Text file attachment → prepend file content
            if (m.role === 'user' && m.attachment && m.attachment.kind === 'text' && m.attachmentText) {
                const filePart = `[Lampiran: ${m.attachment.name}]\n\`\`\`\n${m.attachmentText}\n\`\`\`\n\n`;
                msgs.push({ role: 'user', content: filePart + (m.content || 'Tolong analisa file ini.') });
                continue;
            }
            // Plain message
            if (!m.content) continue;
            msgs.push({ role: m.role, content: m.content });
        }
        return msgs;
    }

    async function streamFromAI(conv, aiIdx) {
        state.streaming = true;
        toggleSendStop(true);

        const messageEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"] .msg-bubble`);
        const aiMsg = conv.messages[aiIdx];

        // Show thinking
        if (messageEl) {
            messageEl.innerHTML = '<div class="thinking"><span></span><span></span><span></span></div>';
        }

        const messages = buildPuterMessages(conv, aiIdx);
        let aborted = false;
        state.abortStream = () => { aborted = true; };

        try {
            if (typeof puter === 'undefined' || !puter.ai || !puter.ai.chat) {
                throw new Error('Puter SDK belum siap. Refresh halaman lalu coba lagi.');
            }

            // Try streaming first
            const opts = { model: state.modelId, stream: true };
            let response;
            try {
                response = await puter.ai.chat(messages, false, opts);
            } catch (errStream) {
                console.warn('Stream init failed, fallback non-stream:', errStream);
                // Fallback: non-stream
                const r = await puter.ai.chat(messages, false, { model: state.modelId });
                const txt = extractText(r);
                aiMsg.content = txt;
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
                state.streaming = false;
                toggleSendStop(false);
                saveState();
                wireMessageActions();
                return;
            }

            if (response && typeof response[Symbol.asyncIterator] === 'function') {
                let buffer = '';
                let firstChunk = true;
                for await (const part of response) {
                    if (aborted) break;
                    const piece = extractText(part);
                    if (!piece) continue;
                    buffer += piece;
                    aiMsg.content = buffer;
                    if (firstChunk) {
                        firstChunk = false;
                        if (messageEl) messageEl.innerHTML = '';
                    }
                    renderStreamingChunk(messageEl, buffer, false);
                }
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
            } else {
                // Non-iterable response
                const txt = extractText(response);
                aiMsg.content = txt;
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
            }

        } catch (err) {
            console.error('AI error:', err);
            const errMsg = err && err.message ? err.message : String(err);
            aiMsg.content = `**⚠️ Maaf, terjadi kendala saat menghubungi AI.**

${errMsg.includes('Permission') || errMsg.includes('auth') || errMsg.includes('sign')
    ? 'Sepertinya Puter meminta autentikasi. Silakan buka popup yang muncul untuk login (gratis), lalu coba kirim pesan lagi.'
    : 'Silakan coba lagi atau pilih model lain dari pilihan di atas.'}

> **Tips**: jika error berlanjut, refresh halaman atau coba ganti model.`;
            aiMsg.completed = true;
            if (messageEl) {
                messageEl.innerHTML = renderMarkdown(aiMsg.content);
                decorateCodeBlocks(messageEl);
            }
            toast('Gagal mendapat respon AI', 'error');
        } finally {
            state.streaming = false;
            state.abortStream = null;
            toggleSendStop(false);
            const msgEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"]`);
            if (msgEl) msgEl.classList.add('completed');
            saveState();
            renderConversationList();
            wireMessageActions();
        }
    }

    function extractText(part) {
        if (!part) return '';
        if (typeof part === 'string') return part;
        // Puter may emit different shapes
        if (typeof part.text === 'string') return part.text;
        if (part.message && typeof part.message.content === 'string') return part.message.content;
        if (part.message && Array.isArray(part.message.content)) {
            return part.message.content.map(c => c && c.text ? c.text : '').join('');
        }
        if (part.delta && typeof part.delta.content === 'string') return part.delta.content;
        if (part.choices && part.choices[0]) {
            const ch = part.choices[0];
            if (ch.delta && typeof ch.delta.content === 'string') return ch.delta.content;
            if (ch.message && typeof ch.message.content === 'string') return ch.message.content;
        }
        if (typeof part.content === 'string') return part.content;
        if (Array.isArray(part.content)) {
            return part.content.map(c => c && c.text ? c.text : '').join('');
        }
        return '';
    }

    function renderStreamingChunk(messageEl, text, completed) {
        if (!messageEl) return;
        const html = renderMarkdown(text);
        messageEl.innerHTML = completed ? html : html + '<span class="typing-cursor"></span>';
        decorateCodeBlocks(messageEl);
        // Auto scroll only if user is near bottom
        const dist = els.chatArea.scrollHeight - els.chatArea.scrollTop - els.chatArea.clientHeight;
        if (dist < 240) scrollToBottom(false);
    }

    function toggleSendStop(streaming) {
        if (streaming) {
            els.sendBtn.hidden = true;
            els.stopBtn.hidden = false;
        } else {
            els.sendBtn.hidden = false;
            els.stopBtn.hidden = true;
            updateSendDisabled();
        }
    }
    function updateSendDisabled() {
        els.sendBtn.disabled = !els.composerInput.value.trim();
    }
    function autoResizeComposer() {
        els.composerInput.style.height = 'auto';
        els.composerInput.style.height = Math.min(els.composerInput.scrollHeight, 220) + 'px';
    }

    /* ================================================================
       FILE ATTACHMENT
       ================================================================ */
    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => reject(r.error || new Error('FileReader error'));
            r.readAsDataURL(file);
        });
    }

    function renderAttachmentChip() {
        const existing = document.getElementById('attachmentChipWrap');
        if (!state.attachment) {
            if (existing) existing.remove();
            return;
        }
        const att = state.attachment;
        const wrap = existing || document.createElement('div');
        wrap.id = 'attachmentChipWrap';
        wrap.className = 'attachment-chip-wrap';

        const icon = att.kind === 'image' ? 'fa-image' : 'fa-file-lines';
        const preview = (att.kind === 'image' && att.dataUrl)
            ? `<img class="ac-thumb" src="${att.dataUrl}" alt="">`
            : `<i class="fas ${icon}"></i>`;
        const sizeKB = (att.size / 1024).toFixed(1);

        wrap.innerHTML = `
            <div class="attachment-chip">
                ${preview}
                <div class="ac-info">
                    <span class="ac-name">${escapeHtml(att.name)}</span>
                    <span class="ac-meta">${sizeKB} KB · ${att.kind === 'image' ? 'Gambar' : 'Teks'}</span>
                </div>
                <button type="button" class="ac-remove" aria-label="Hapus lampiran" onclick="window.HanifClearAttachment && window.HanifClearAttachment()">
                    <i class="fas fa-times" style="pointer-events:none"></i>
                </button>
            </div>
        `;

        if (!existing) {
            // Insert above the composer
            els.composer.parentNode.insertBefore(wrap, els.composer);
        }
    }

    // Global so the inline onclick works
    window.HanifClearAttachment = function() {
        state.attachment = null;
        renderAttachmentChip();
    };

    /* ================================================================
       VOICE INPUT
       ================================================================ */
    let recognition = null;
    function initVoice() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            // Browser tidak support — tampilkan tooltip, jangan sembunyikan
            els.micBtn.title = 'Browser kamu tidak support voice input. Coba pakai Chrome.';
            els.micBtn.addEventListener('click', () => {
                toast('Browser kamu belum support voice input. Pakai Chrome/Edge ya.', 'info', 2400);
            });
            return;
        }
        recognition = new SR();
        recognition.lang = 'id-ID';
        recognition.continuous = false;
        recognition.interimResults = true;

        let finalTranscript = '';
        recognition.onstart = () => {
            finalTranscript = els.composerInput.value;
            if (finalTranscript && !finalTranscript.endsWith(' ')) finalTranscript += ' ';
            els.micBtn.classList.add('active');
            els.micBtn.title = 'Klik untuk berhenti';
        };
        recognition.onresult = (e) => {
            let interim = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const tr = e.results[i][0].transcript;
                if (e.results[i].isFinal) finalTranscript += tr + ' ';
                else interim += tr;
            }
            els.composerInput.value = (finalTranscript + interim).trim();
            updateSendDisabled();
            autoResizeComposer();
        };
        recognition.onerror = (e) => {
            els.micBtn.classList.remove('active');
            const msg = e.error === 'not-allowed'
                ? 'Akses mikrofon ditolak. Izinkan di pengaturan browser.'
                : e.error === 'no-speech'
                    ? 'Tidak ada suara terdeteksi'
                    : 'Tidak bisa mendengar suara';
            toast(msg, 'error');
        };
        recognition.onend = () => {
            els.micBtn.classList.remove('active');
            els.micBtn.title = 'Input suara';
        };

        els.micBtn.addEventListener('click', () => {
            if (els.micBtn.classList.contains('active')) {
                try { recognition.stop(); } catch (e) {}
            } else {
                try {
                    recognition.start();
                    toast('🎤 Silakan bicara...', 'info', 1600);
                } catch (e) {
                    console.warn('Voice start error:', e);
                }
            }
        });
    }

    /* ================================================================
       EXPORT
       ================================================================ */
    function exportCurrent() {
        const conv = getCurrent();
        if (!conv || !conv.messages.length) { toast('Tidak ada percakapan untuk diekspor', 'info'); return; }
        const lines = [`# ${conv.title}`, `_${fmtDay(conv.createdAt)} — Hanif AI_`, ''];
        conv.messages.forEach(m => {
            lines.push(`## ${m.role === 'user' ? '🙋 Anda' : '🤖 Hanif AI'} _(${fmtTime(m.ts)})_`);
            lines.push(m.content);
            lines.push('');
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `lyps-${conv.title.replace(/[^\w\s-]/g, '').slice(0, 40)}.md`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(a.href);
        toast('Diekspor sebagai Markdown', 'success');
    }

    function shareCurrent() {
        const conv = getCurrent();
        if (!conv || !conv.messages.length) { toast('Tidak ada percakapan untuk dibagikan', 'info'); return; }
        const text = conv.messages.map(m => `${m.role === 'user' ? 'Anda' : 'Hanif AI'}: ${m.content}`).join('\n\n');
        if (navigator.share) {
            navigator.share({ title: conv.title, text }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text).then(() => toast('Percakapan disalin ke clipboard', 'success'))
                .catch(() => toast('Tidak bisa membagikan', 'error'));
        }
    }

    /* ================================================================
       EVENT WIRING
       ================================================================ */
    function wireEvents() {
        // Sidebar
        els.sidebarOpen.addEventListener('click', () => els.app.classList.remove('sidebar-collapsed'));
        els.sidebarCollapse.addEventListener('click', () => els.app.classList.add('sidebar-collapsed'));
        els.brandHome.addEventListener('click', (e) => { e.preventDefault(); newConversation(); });

        // New chat
        els.newChatBtn.addEventListener('click', () => newConversation());
        els.topNewChat.addEventListener('click', () => newConversation());

        // Search
        els.searchInput.addEventListener('input', renderConversationList);

        // Footer
        els.exportBtn.addEventListener('click', exportCurrent);
        els.clearAllBtn.addEventListener('click', clearAllConversations);
        els.shortcutsBtn.addEventListener('click', () => { els.shortcutsModal.classList.add('is-open'); });
        els.themeToggle.addEventListener('click', toggleTheme);
        els.shareBtn.addEventListener('click', shareCurrent);

        // Modal close — pakai event delegation di level document supaya tombol X & backdrop selalu kebaca
        document.addEventListener('click', (e) => {
            const closer = e.target.closest('[data-close]');
            if (!closer) return;
            const modal = closer.closest('.modal');
            if (modal) modal.classList.remove('is-open');
        });

        // Pickers
        els.modelPill.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePicker(els.modelPicker, els.modelPill, els.personaPicker, els.personaPill);
        });
        els.personaPill.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePicker(els.personaPicker, els.personaPill, els.modelPicker, els.modelPill);
        });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.picker') && !e.target.closest('.model-pill') && !e.target.closest('.persona-pill')) {
                closePickers();
            }
        });

        // Suggestions
        els.suggestions.querySelectorAll('.suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                els.composerInput.value = btn.dataset.prompt;
                autoResizeComposer();
                updateSendDisabled();
                els.composer.dispatchEvent(new Event('submit', { cancelable: true }));
            });
        });

        // Composer
        els.composerInput.addEventListener('input', () => { autoResizeComposer(); updateSendDisabled(); });
        els.composerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
                e.preventDefault();
                els.composer.dispatchEvent(new Event('submit', { cancelable: true }));
            }
        });
        els.composer.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = els.composerInput.value.trim();
            if (!text) return;
            els.composerInput.value = '';
            autoResizeComposer();
            updateSendDisabled();
            sendMessage(text);
        });

        // Stop
        els.stopBtn.addEventListener('click', () => {
            if (state.abortStream) state.abortStream();
            toast('Respon dihentikan', 'info', 1400);
        });

        // Attachment: open file picker when paperclip clicked
        els.attachBtn.addEventListener('click', () => {
            els.fileInput.click();
        });

        els.fileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            // Limit: 5MB for images, 1MB for text
            const maxSize = file.type.startsWith('image/') ? 5 * 1024 * 1024 : 1 * 1024 * 1024;
            if (file.size > maxSize) {
                toast(`File terlalu besar (max ${file.type.startsWith('image/') ? '5MB' : '1MB'})`, 'error');
                e.target.value = '';
                return;
            }

            try {
                const att = { name: file.name, type: file.type, size: file.size };

                if (file.type.startsWith('image/')) {
                    att.kind = 'image';
                    att.dataUrl = await fileToDataUrl(file);
                } else if (
                    file.type.startsWith('text/') ||
                    /\.(txt|md|json|csv|html|css|js|jsx|ts|tsx|py|java|c|cpp|h|hpp|go|rs|rb|php|sql|yaml|yml|xml|sh)$/i.test(file.name)
                ) {
                    att.kind = 'text';
                    att.text = await file.text();
                    if (att.text.length > 50000) {
                        att.text = att.text.slice(0, 50000) + '\n\n[... file dipotong, terlalu panjang]';
                    }
                } else {
                    toast('Tipe file ini belum didukung. Coba gambar atau file teks.', 'error');
                    e.target.value = '';
                    return;
                }

                state.attachment = att;
                renderAttachmentChip();
                toast(`Lampiran: ${att.name}`, 'success', 1600);
            } catch (err) {
                console.error('File read error:', err);
                toast('Gagal membaca file', 'error');
            } finally {
                e.target.value = ''; // reset input supaya bisa pilih file yang sama lagi
            }
        });

        // Scroll
        els.chatArea.addEventListener('scroll', updateScrollBtn);
        els.scrollBottom.addEventListener('click', () => scrollToBottom(true));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const meta = e.ctrlKey || e.metaKey;
            // Ctrl+K: new chat
            if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); newConversation(); els.composerInput.focus(); }
            // Ctrl+B: toggle sidebar
            else if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); els.app.classList.toggle('sidebar-collapsed'); }
            // Ctrl+/ : open shortcuts
            else if (meta && e.key === '/') { e.preventDefault(); els.shortcutsModal.classList.add('is-open'); }
            // Ctrl+Shift+L: toggle theme
            else if (meta && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); toggleTheme(); }
            // Esc: stop streaming or close modals
            else if (e.key === 'Escape') {
                if (state.abortStream) { state.abortStream(); toast('Respon dihentikan', 'info', 1200); }
                else if (els.shortcutsModal.classList.contains('is-open')) els.shortcutsModal.classList.remove('is-open');
                else if (els.modelPicker.classList.contains('open') || els.personaPicker.classList.contains('open')) closePickers();
            }
            // "/" : focus input
            else if (!meta && !e.shiftKey && e.key === '/' && document.activeElement !== els.composerInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                els.composerInput.focus();
            }
        });

        // Close sidebar when clicking backdrop on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 920 && !els.app.classList.contains('sidebar-collapsed')) {
                if (!e.target.closest('.sidebar') && !e.target.closest('#sidebarOpen')) {
                    els.app.classList.add('sidebar-collapsed');
                }
            }
        });
    }

    /* ================================================================
       INIT
       ================================================================ */
    function init() {
        initTheme();
        loadState();
        configureMarked();

        // Apply pill labels
        const m = MODELS.find(x => x.id === state.modelId) || MODELS[0];
        const p = PERSONAS.find(x => x.id === state.personaId) || PERSONAS[0];
        state.modelId = m.id;
        state.personaId = p.id;
        els.modelPillName.textContent = m.name;
        els.personaPillName.textContent = p.name;

        buildModelPicker();
        buildPersonaPicker();

        // Default sidebar state on mobile
        if (window.innerWidth <= 920) els.app.classList.add('sidebar-collapsed');

        wireEvents();
        initVoice();

        // Render initial state
        if (!getCurrent()) {
            // No active conv — show welcome
            renderConversationList();
            renderMessages();
        } else {
            renderConversationList();
            renderMessages();
        }

        // Focus input
        setTimeout(() => els.composerInput.focus(), 200);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
