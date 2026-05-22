/* ============================================================
   HANIF AI — Premium Chat Interface
   Powered by Puter.js (free AI: GPT-4o, Claude, Gemini, DeepSeek)
   ============================================================ */

(() => {
    'use strict';

    /* Global helpers exposed early so inline onclick can use them */
    window.HanifCloseModal = function(id) {
        const el = id ? document.getElementById(id) : document.querySelector('.modal.is-open');
        if (el) el.classList.remove('is-open');
    };
    window.HanifOpenModal = function(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('is-open');
    };

    /* Esc key closes any open modal — wired immediately */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.is-open');
            if (openModal) {
                openModal.classList.remove('is-open');
                e.stopPropagation();
            }
        }
    }, true);

    /* ================================================================
       CONFIG: Models, Personas
       ================================================================ */
    const MODELS = [
        { id: 'gpt-4o', name: 'GPT-4o', desc: 'Cepat, cerdas, all-rounder dari OpenAI', tag: 'Default', icon: 'fa-bolt', c1: '#7c5cff', c2: '#00d4ff' },
        { id: 'gpt-5-nano', name: 'GPT-5 Nano', desc: 'Ringan & super responsif', tag: 'Cepat', icon: 'fa-feather', c1: '#22c55e', c2: '#00d4ff' },
        { id: 'claude-sonnet-4', name: 'Claude Sonnet 4', desc: 'Penalaran mendalam & penulisan elegan', tag: 'Tulisan', icon: 'fa-feather-pointed', c1: '#ff8c42', c2: '#ff5cf7' },
        { id: 'claude-opus-4', name: 'Claude Opus 4', desc: 'Model paling kuat untuk tugas kompleks', tag: 'Pintar', icon: 'fa-crown', c1: '#ff5cf7', c2: '#7c5cff' },
        { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', desc: 'Multimodal & cepat dari Google', tag: 'Multimodal', icon: 'fa-google', c1: '#00d4ff', c2: '#22c55e' },
        { id: 'deepseek-chat', name: 'DeepSeek V3', desc: 'Logika & matematika luar biasa', tag: 'Logika', icon: 'fa-brain', c1: '#7c5cff', c2: '#ff5cf7' },
        { id: 'deepseek-reasoner', name: 'DeepSeek R1', desc: 'Reasoning step-by-step terbaik', tag: 'Reasoning', icon: 'fa-microchip', c1: '#ffd166', c2: '#ff8c42' },
        { id: 'meta-llama/llama-4-maverick', name: 'Llama 4 Maverick', desc: 'Open-source flagship dari Meta', tag: 'Open', icon: 'fa-meta', c1: '#22c55e', c2: '#7c5cff' }
    ];

    const PERSONAS = [
        { id: 'smart', name: 'Cerdas', desc: 'Akurat, terstruktur, dan jelas', icon: 'fa-wand-magic-sparkles', c1: '#7c5cff', c2: '#00d4ff',
          system: `Kamu adalah Hanif AI — asisten cerdas generasi baru yang menjawab dengan kualitas premium. Standar respon kamu:

1. **Selalu mulai dengan jawaban langsung** — tidak bertele-tele, tidak meminta maaf, tidak basa-basi.
2. **Format yang indah & mudah dibaca**: heading (## ###), bullet, **bold** istilah penting, emoji secukupnya.
3. **Kode**: selalu di code block dengan bahasa yang tepat (\`\`\`js, \`\`\`python).
4. **Bahasa Indonesia natural** secara default. Kecuali user pakai bahasa lain.
5. **Akurasi**: jika tidak yakin, katakan terus terang & beri opsi/asumsi.
6. **Selesai dengan nilai tambah**: saran lanjutan atau pertanyaan klarifikasi.

Tujuanmu: setiap respon terasa seperti dari pakar pribadi yang ramah, tepat, dan estetik.` },
        { id: 'creative', name: 'Kreatif', desc: 'Imajinatif, ekspresif, penuh warna', icon: 'fa-palette', c1: '#ff5cf7', c2: '#ff8c42',
          system: `Kamu Hanif AI mode Kreatif — asisten dengan imajinasi liar dan jiwa seniman. Tulis dengan metafora segar, sudut pandang tak terduga, rasa yang menyentuh. Format respon dengan indah. Kalau diminta brainstorm, beri 3-5 ide tak biasa. Bahasa Indonesia natural & ekspresif. Tutup dengan kalimat menginspirasi.` },
        { id: 'precise', name: 'Presisi', desc: 'Singkat, padat, fakta saja', icon: 'fa-bullseye', c1: '#22c55e', c2: '#00d4ff',
          system: `Kamu Hanif AI mode Presisi — asisten teknis seperti dokumen referensi. Singkat & padat, bullet points, tabel untuk komparasi, kode dalam code block, hindari kata pengisi. Langsung ke poin. Bahasa Indonesia natural. Efisiensi maksimum.` },
        { id: 'coder', name: 'Coder', desc: 'Pakar coding & arsitektur software', icon: 'fa-code', c1: '#00d4ff', c2: '#7c5cff',
          system: `Kamu Hanif AI mode Coder — senior software engineer dengan 15+ tahun pengalaman. Selalu sertakan kode lengkap yang bisa dijalankan. Pilih bahasa modern (TypeScript > JavaScript), best practice, error handling, accessibility. Penjelasan setelah kode tentang konsep penting & alasan keputusan teknis. Komentar di kode untuk bagian non-obvious. Bahasa Indonesia untuk penjelasan, kode tetap English.` },
        { id: 'tutor', name: 'Tutor', desc: 'Sabar menjelaskan dengan analogi', icon: 'fa-graduation-cap', c1: '#ffd166', c2: '#ff8c42',
          system: `Kamu Hanif AI mode Tutor — guru pribadi yang sabar dan inspiratif. Mulai dengan analogi sehari-hari sebelum konsep teknis. Bangun bertahap, gunakan 2-3 contoh konkret, ajukan 1 pertanyaan refleksi di akhir. Format dengan heading, bullet, blockquote untuk "kunci pemahaman". Bahasa hangat: "Bayangkan...", "Coba pikirkan...". Buat user merasa pintar.` },
        { id: 'business', name: 'Bisnis', desc: 'Strategis, profesional, ROI-fokus', icon: 'fa-briefcase', c1: '#7c5cff', c2: '#22c55e',
          system: `Kamu Hanif AI mode Bisnis — konsultan strategi dengan jam terbang McKinsey/BCG. Pakai framework relevan (SWOT, Porter's 5, AIDA). Data-driven, action items dengan timeline, trade-off jelas. Format: executive summary 2-3 baris, heading per area, tabel komparasi. Bahasa eksekutif: tegas, percaya diri, no fluff. Tutup dengan "Next steps" konkret 3 poin.` }
    ];

    /* ================================================================
       PROMPT LIBRARY — kategori prompt siap pakai
       ================================================================ */
    const PROMPT_CATEGORIES = [
        { id: 'all', name: 'Semua', icon: 'fa-grid-2' },
        { id: 'writing', name: 'Tulisan', icon: 'fa-pen-fancy' },
        { id: 'study', name: 'Belajar', icon: 'fa-graduation-cap' },
        { id: 'code', name: 'Coding', icon: 'fa-code' },
        { id: 'business', name: 'Bisnis', icon: 'fa-briefcase' },
        { id: 'creative', name: 'Kreatif', icon: 'fa-palette' },
        { id: 'life', name: 'Kehidupan', icon: 'fa-heart' },
        { id: 'translate', name: 'Bahasa', icon: 'fa-language' }
    ];

    const PROMPTS = [
        // Tulisan
        { cat: 'writing', icon: 'fa-envelope-open-text', c1: '#7c5cff', c2: '#00d4ff', title: 'Email profesional', desc: 'Tulis email formal yang jelas dan sopan',
          prompt: 'Bantu saya menulis email profesional ke [PENERIMA] tentang [TOPIK]. Tone: sopan tapi tegas. Maksimal 4 paragraf, subject line yang menarik.' },
        { cat: 'writing', icon: 'fa-newspaper', c1: '#ff5cf7', c2: '#ff8c42', title: 'Artikel blog SEO', desc: 'Artikel 800 kata siap publish dengan struktur SEO',
          prompt: 'Tulis artikel blog 800 kata tentang [TOPIK] dengan struktur SEO friendly: judul menarik, meta description, 5 H2 sections, bullet points, dan call to action.' },
        { cat: 'writing', icon: 'fa-comment-dots', c1: '#00d4ff', c2: '#22c55e', title: 'Caption Instagram', desc: '5 variasi caption + hashtag relevan',
          prompt: 'Buatkan 5 variasi caption Instagram untuk [PRODUK/MOMEN], masing-masing 2-3 kalimat dengan hook menarik di awal. Sertakan 10 hashtag relevan dengan campuran high & low volume.' },
        { cat: 'writing', icon: 'fa-feather', c1: '#ff8c42', c2: '#ffd166', title: 'CV / Resume', desc: 'Bantuan menulis CV yang ATS-friendly',
          prompt: 'Saya melamar posisi [POSISI] di bidang [INDUSTRI]. Pengalaman saya: [LIST]. Tulis ulang dalam format CV ATS-friendly dengan power verbs, kuantifikasi pencapaian, dan summary 3 baris di atas.' },

        // Belajar
        { cat: 'study', icon: 'fa-lightbulb', c1: '#ffd166', c2: '#ff8c42', title: 'Jelaskan untuk anak SMA', desc: 'Konsep rumit jadi mudah dengan analogi',
          prompt: 'Jelaskan [KONSEP/TOPIK] dengan analogi sehari-hari yang bisa dipahami anak SMA. Pakai 3 contoh nyata. Ajukan 1 pertanyaan refleksi di akhir.' },
        { cat: 'study', icon: 'fa-list-check', c1: '#7c5cff', c2: '#ff5cf7', title: 'Rangkuman cepat', desc: 'Ringkas materi panjang jadi poin penting',
          prompt: 'Rangkum [MATERI/BUKU] dalam: 1) Executive summary 3 baris, 2) 5 poin kunci dengan penjelasan, 3) 1 quote yang paling powerful, 4) Aksi konkret yang bisa diterapkan.' },
        { cat: 'study', icon: 'fa-flask', c1: '#22c55e', c2: '#00d4ff', title: 'Study plan 30 hari', desc: 'Jadwal belajar bertahap dengan target harian',
          prompt: 'Buatkan rencana belajar [SKILL/MATERI] selama 30 hari untuk pemula. Tabel per minggu dengan: tujuan, materi, latihan, dan ukuran kemajuan. Mulai dari fundamental ke advanced.' },
        { cat: 'study', icon: 'fa-clipboard-question', c1: '#ff5cf7', c2: '#7c5cff', title: 'Buatkan kuis', desc: '10 soal pilihan ganda + kunci & pembahasan',
          prompt: 'Buatkan 10 soal pilihan ganda tentang [TOPIK] dengan tingkat kesulitan campuran (3 mudah, 5 sedang, 2 sulit). Sertakan kunci jawaban dan pembahasan singkat untuk setiap soal.' },

        // Coding
        { cat: 'code', icon: 'fa-bug', c1: '#ef4444', c2: '#ff8c42', title: 'Debug kode error', desc: 'Cari penyebab & solusi masalah kode',
          prompt: 'Saya dapat error berikut saat menjalankan kode:\n\n```\n[ERROR]\n```\n\nKode yang bermasalah:\n```\n[KODE]\n```\n\nJelaskan: (1) penyebab error, (2) cara fix, (3) cara mencegah error serupa.' },
        { cat: 'code', icon: 'fa-recycle', c1: '#22c55e', c2: '#00d4ff', title: 'Refactor kode', desc: 'Bersihkan & optimalkan kode lama',
          prompt: 'Refactor kode berikut supaya lebih bersih, efisien, dan mengikuti best practice modern:\n\n```\n[KODE]\n```\n\nJelaskan apa yang berubah dan kenapa.' },
        { cat: 'code', icon: 'fa-magnifying-glass-chart', c1: '#7c5cff', c2: '#ff5cf7', title: 'Code review', desc: 'Review kode dengan lensa senior engineer',
          prompt: 'Review kode berikut sebagai senior engineer. Cek: bug, performa, keamanan, naming, struktur, edge case. Beri saran konkret dengan contoh kode perbaikan.\n\n```\n[KODE]\n```' },
        { cat: 'code', icon: 'fa-book', c1: '#00d4ff', c2: '#22c55e', title: 'Belajar bahasa baru', desc: 'Cheatsheet untuk pindah dari satu bahasa ke lainnya',
          prompt: 'Saya familiar dengan [BAHASA_LAMA] dan ingin belajar [BAHASA_BARU]. Buatkan cheatsheet komparasi: sintaks dasar, OOP, async/await, error handling, manajemen package, dan best practice unik.' },
        { cat: 'code', icon: 'fa-cube', c1: '#ff5cf7', c2: '#7c5cff', title: 'Generate komponen', desc: 'Komponen UI siap pakai dengan styling',
          prompt: 'Buatkan komponen [NAMA_KOMPONEN] di [FRAMEWORK: React/Vue/Svelte] dengan TypeScript. Fitur: [LIST_FITUR]. Sertakan styling (CSS modules atau Tailwind), props yang reusable, dan accessibility.' },

        // Bisnis
        { cat: 'business', icon: 'fa-chart-pie', c1: '#7c5cff', c2: '#22c55e', title: 'SWOT analysis', desc: 'Analisis Strengths, Weaknesses, Opportunities, Threats',
          prompt: 'Buatkan SWOT analysis untuk [BISNIS/PRODUK] di pasar [SEGMEN]. Setiap kategori 4-5 poin spesifik. Tutup dengan 3 rekomendasi strategis berdasarkan analisis.' },
        { cat: 'business', icon: 'fa-bullhorn', c1: '#ff5cf7', c2: '#ff8c42', title: 'Marketing plan', desc: 'Strategi marketing 90 hari yang konkret',
          prompt: 'Buatkan marketing plan 90 hari untuk [PRODUK/JASA] dengan budget [JUMLAH]. Target audience: [DEMOGRAFI]. Sertakan: positioning, channels (organic + paid), content calendar mingguan, KPI yang diukur.' },
        { cat: 'business', icon: 'fa-handshake', c1: '#00d4ff', c2: '#7c5cff', title: 'Pitch deck outline', desc: 'Struktur 10 slide untuk pitching ke investor',
          prompt: 'Buatkan outline pitch deck 10 slide untuk startup [NAMA] yang [DESKRIPSI SINGKAT]. Per slide: judul, key message, data/visual yang harus ditampilkan, dan tips delivery.' },
        { cat: 'business', icon: 'fa-money-bill-trend-up', c1: '#22c55e', c2: '#00d4ff', title: 'Hitung pricing', desc: 'Strategi harga + rasionalitas',
          prompt: 'Saya jual [PRODUK/JASA] dengan biaya pokok [JUMLAH]. Target pasar: [SEGMEN]. Saran 3 strategi pricing (penetration, value-based, premium) lengkap dengan justifikasi dan proyeksi margin.' },

        // Kreatif
        { cat: 'creative', icon: 'fa-lightbulb', c1: '#ff5cf7', c2: '#7c5cff', title: 'Brainstorm 20 ide', desc: 'Ide-ide tak terduga untuk masalah kamu',
          prompt: 'Saya butuh 20 ide tentang [TOPIK]. Variasikan: 5 yang konvensional, 10 yang out-of-the-box, 5 yang sangat radikal. Setiap ide 1 kalimat penjelasan + alasan kenapa bisa work.' },
        { cat: 'creative', icon: 'fa-tag', c1: '#7c5cff', c2: '#00d4ff', title: 'Naming brand', desc: '15 nama brand kreatif dengan rasionalitas',
          prompt: 'Bantuin saya naming untuk [BISNIS/PRODUK] di bidang [INDUSTRI]. Beri 15 opsi: 5 deskriptif, 5 metaforis, 5 abstrak. Setiap nama: makna, asosiasi yang muncul, dan availability check (gampang dicari di Google?).' },
        { cat: 'creative', icon: 'fa-quote-right', c1: '#ff8c42', c2: '#ff5cf7', title: 'Slogan & tagline', desc: '10 tagline punchy yang mudah diingat',
          prompt: 'Buatkan 10 tagline untuk brand [NAMA] yang menjual [PRODUK]. Mix antara: emotional, functional, dan provocative. Maksimal 7 kata per tagline. Beri penjelasan singkat untuk setiap pilihan.' },
        { cat: 'creative', icon: 'fa-book-open', c1: '#00d4ff', c2: '#22c55e', title: 'Cerita pendek', desc: 'Cerita 500 kata dengan plot twist',
          prompt: 'Tulis cerita pendek 500 kata dengan tema [TEMA] dan setting [LOKASI/WAKTU]. Karakter utama: [DESKRIPSI]. Wajib ada plot twist di 100 kata terakhir. Tone: [BEBAS/NOIR/FANTASY/SLICE-OF-LIFE].' },

        // Hidup
        { cat: 'life', icon: 'fa-utensils', c1: '#22c55e', c2: '#ff8c42', title: 'Meal plan seminggu', desc: 'Menu sehat 7 hari + grocery list',
          prompt: 'Buatkan meal plan 7 hari untuk [JUMLAH_ORANG] dengan budget [JUMLAH] per minggu. Preferensi: [DIET/ALERGI]. Sertakan grocery list yang terorganisir per kategori dan estimasi waktu masak per resep.' },
        { cat: 'life', icon: 'fa-dumbbell', c1: '#7c5cff', c2: '#ff5cf7', title: 'Workout plan', desc: 'Jadwal latihan 4 minggu sesuai goal',
          prompt: 'Saya [USIA] tahun, level [PEMULA/MENENGAH/MAHIR], goal [HILANGKAN_LEMAK/BULKING/MAINTAIN]. Akses: [GYM/RUMAH_TANPA_ALAT/RUMAH_DENGAN_DUMBBELL]. Buatkan workout plan 4 minggu, 4-5 hari per minggu, dengan progressive overload.' },
        { cat: 'life', icon: 'fa-plane', c1: '#00d4ff', c2: '#7c5cff', title: 'Itinerary travel', desc: 'Rencana perjalanan hari per hari',
          prompt: 'Buatkan itinerary [JUMLAH_HARI] hari ke [DESTINASI] dengan budget [JUMLAH]. Style: [BUDGET/MID-RANGE/LUXURY]. Per hari: aktivitas pagi-siang-malam, transportasi, kuliner lokal, tips & must-see. Tutup dengan packing list.' },
        { cat: 'life', icon: 'fa-piggy-bank', c1: '#ffd166', c2: '#22c55e', title: 'Budget bulanan', desc: 'Cara atur uang dengan metode 50/30/20',
          prompt: 'Penghasilan saya [JUMLAH] per bulan. Pengeluaran tetap: [LIST]. Bantu buat budget bulanan dengan metode 50/30/20 (kebutuhan/keinginan/saving). Sertakan saran emergency fund dan investasi untuk pemula.' },

        // Bahasa / Translate
        { cat: 'translate', icon: 'fa-language', c1: '#7c5cff', c2: '#ff5cf7', title: 'Translate natural', desc: 'Terjemahan yang terdengar native, bukan kaku',
          prompt: 'Translate teks berikut ke [BAHASA_TUJUAN] dengan tone [FORMAL/CASUAL/BISNIS]. Bukan literal, tapi natural seperti diucapkan native speaker:\n\n[TEKS]' },
        { cat: 'translate', icon: 'fa-spell-check', c1: '#22c55e', c2: '#00d4ff', title: 'Cek grammar Inggris', desc: 'Perbaiki tata bahasa & gaya tulisan',
          prompt: 'Cek dan perbaiki grammar, tense, dan word choice di teks Inggris berikut. Beri tabel "before vs after" untuk perubahan, dan tips supaya tidak mengulang kesalahan:\n\n[TEKS]' },
        { cat: 'translate', icon: 'fa-comments', c1: '#ff8c42', c2: '#ff5cf7', title: 'Practice conversation', desc: 'Role-play percakapan untuk belajar bahasa',
          prompt: 'Saya mau practice [BAHASA] level [PEMULA/MENENGAH]. Role-play sebagai [PERAN: barista/teman lama/dokter/dll] dalam situasi [SITUASI]. Mulai percakapannya, koreksi grammar saya halus, dan jelaskan idiom yang muncul.' }
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
        attachment: null,
        imageMode: false
    };

    /* ================================================================
       DOM
       ================================================================ */
    const $ = (id) => document.getElementById(id);
    const els = {
        app: $('app'), sidebar: $('sidebar'), sidebarOpen: $('sidebarOpen'), sidebarCollapse: $('sidebarCollapse'),
        newChatBtn: $('newChatBtn'), topNewChat: $('topNewChat'),
        searchInput: $('searchInput'), conversationList: $('conversationList'),
        exportBtn: $('exportBtn'), clearAllBtn: $('clearAllBtn'), shortcutsBtn: $('shortcutsBtn'), themeToggle: $('themeToggle'),
        modelPill: $('modelPill'), modelPillName: $('modelPillName'),
        personaPill: $('personaPill'), personaPillName: $('personaPillName'),
        modelPicker: $('modelPicker'), modelList: $('modelList'),
        personaPicker: $('personaPicker'), personaList: $('personaList'),
        chatArea: $('chatArea'), welcome: $('welcome'), suggestions: $('suggestions'),
        messages: $('messages'), scrollBottom: $('scrollBottom'),
        composer: $('composer'), composerInput: $('composerInput'),
        sendBtn: $('sendBtn'), stopBtn: $('stopBtn'),
        attachBtn: $('attachBtn'), fileInput: $('fileInput'),
        imageBtn: $('imageBtn'), micBtn: $('micBtn'),
        composerPromptBtn: $('composerPromptBtn'), promptLibBtn: $('promptLibBtn'),
        promptLibModal: $('promptLibModal'), promptLibTabs: $('promptLibTabs'),
        promptLibList: $('promptLibList'), promptLibSearch: $('promptLibSearch'),
        modeBanner: $('modeBanner'),
        shareBtn: $('shareBtn'), shortcutsModal: $('shortcutsModal'),
        toastStack: $('toastStack'), brandHome: $('brandHome')
    };

    /* ================================================================
       UTILITIES
       ================================================================ */
    const uid = () => 'c_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    const escapeHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const fmtTime = (ts) => new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const fmtDay = (ts) => new Date(ts).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const fmtSize = (b) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(1) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

    function toast(msg, type = 'info', duration = 2800) {
        const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
        const t = document.createElement('div');
        t.className = `toast ${type}`;
        t.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${escapeHtml(msg)}</span>`;
        els.toastStack.appendChild(t);
        setTimeout(() => { t.classList.add('removing'); setTimeout(() => t.remove(), 250); }, duration);
    }

    /* ================================================================
       STORAGE
       ================================================================ */
    function saveState() {
        try {
            const conversations = state.conversations.map(c => ({
                ...c,
                messages: c.messages.map(m => {
                    if (!m.attachmentDataUrl) return m;
                    const { attachmentDataUrl, ...rest } = m;
                    return rest;
                })
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                conversations, currentId: state.currentId, modelId: state.modelId, personaId: state.personaId
            }));
        } catch (e) { console.warn('Storage save failed:', e); }
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
        } catch (e) { console.warn('Storage load failed:', e); }
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
       MARKDOWN
       ================================================================ */
    function configureMarked() {
        if (typeof marked === 'undefined') return;
        marked.setOptions({
            gfm: true, breaks: true,
            highlight: function(code, lang) {
                if (typeof hljs !== 'undefined') {
                    try {
                        if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
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
        return (typeof DOMPurify !== 'undefined') ? DOMPurify.sanitize(raw, { ADD_ATTR: ['target', 'rel'] }) : raw;
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
                    setTimeout(() => { btn.classList.remove('copied'); btn.innerHTML = '<i class="fas fa-copy"></i> Salin'; }, 1600);
                } catch (e) { toast('Gagal menyalin', 'error'); }
            });
        });
        container.querySelectorAll('a[href^="http"]').forEach(a => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    }

    /* ================================================================
       PICKERS
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
            </div>`).join('');
        els.modelList.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                state.modelId = item.dataset.id;
                const m = MODELS.find(x => x.id === state.modelId);
                els.modelPillName.textContent = m.name;
                buildModelPicker(); closePickers(); saveState();
                toast(`Model: ${m.name}`, 'info', 1800);
            });
        });
    }
    function buildPersonaPicker() {
        els.personaList.innerHTML = PERSONAS.map(p => `
            <div class="picker-item ${p.id === state.personaId ? 'selected' : ''}" data-id="${p.id}">
                <div class="pi-icon" style="--c1:${p.c1};--c2:${p.c2}"><i class="fas ${p.icon}"></i></div>
                <div class="pi-text"><div class="pi-name">${p.name}</div><div class="pi-desc">${p.desc}</div></div>
                <div class="pi-check"><i class="fas fa-check-circle"></i></div>
            </div>`).join('');
        els.personaList.querySelectorAll('.picker-item').forEach(item => {
            item.addEventListener('click', () => {
                state.personaId = item.dataset.id;
                const p = PERSONAS.find(x => x.id === state.personaId);
                els.personaPillName.textContent = p.name;
                buildPersonaPicker(); closePickers(); saveState();
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
    function getCurrent() { return state.conversations.find(c => c.id === state.currentId); }
    function newConversation(autoSwitch = true) {
        const conv = {
            id: uid(), title: 'Chat baru', messages: [],
            createdAt: Date.now(), updatedAt: Date.now(),
            modelId: state.modelId, personaId: state.personaId
        };
        state.conversations.unshift(conv);
        if (autoSwitch) state.currentId = conv.id;
        saveState(); renderConversationList(); renderMessages();
        return conv;
    }
    function switchConversation(id) {
        state.currentId = id;
        saveState(); renderConversationList(); renderMessages();
        if (window.innerWidth <= 920) els.app.classList.add('sidebar-collapsed');
    }
    function deleteConversation(id) {
        state.conversations = state.conversations.filter(c => c.id !== id);
        if (state.currentId === id) state.currentId = null;
        saveState(); renderConversationList(); renderMessages();
        toast('Percakapan dihapus', 'success', 1600);
    }
    function renameConversation(id, title) {
        const c = state.conversations.find(x => x.id === id);
        if (!c) return;
        c.title = title.trim().slice(0, 60) || 'Chat baru';
        c.updatedAt = Date.now();
        saveState(); renderConversationList();
    }
    function clearAllConversations() {
        if (!confirm('Hapus semua percakapan? Tindakan ini tidak bisa dibatalkan.')) return;
        state.conversations = []; state.currentId = null;
        saveState(); renderConversationList(); renderMessages();
        toast('Semua percakapan dihapus', 'success');
    }
    function autoTitleFromMessage(text) {
        return String(text || '').replace(/\s+/g, ' ').trim().slice(0, 48) || 'Chat baru';
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
            els.conversationList.innerHTML = `<div class="empty-history"><i class="fas fa-comments"></i><div>${q ? 'Tidak ada hasil' : 'Belum ada percakapan'}</div></div>`;
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
            el.addEventListener('click', (e) => { if (e.target.closest('.ci-action')) return; switchConversation(el.dataset.id); });
            el.querySelector('[data-act="delete"]').addEventListener('click', (e) => { e.stopPropagation(); deleteConversation(el.dataset.id); });
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
            els.welcome.hidden = false; els.messages.hidden = true; els.messages.innerHTML = '';
            return;
        }
        els.welcome.hidden = true; els.messages.hidden = false;
        els.messages.innerHTML = conv.messages.map((m, idx) => renderMessageHTML(m, idx === conv.messages.length - 1)).join('');
        els.messages.querySelectorAll('.msg-bubble').forEach(b => decorateCodeBlocks(b));
        wireMessageActions();
        scrollToBottom();
    }
    function renderMessageHTML(m) {
        const isUser = m.role === 'user';
        const avatarChar = isUser ? '<i class="fas fa-user"></i>' : 'H';
        const model = MODELS.find(mm => mm.id === (m.modelId || state.modelId));

        // Attachment preview (user only)
        let attHTML = '';
        if (isUser && m.attachment) {
            if (m.attachment.kind === 'image' && m.attachmentDataUrl) {
                attHTML = `<div class="msg-attachment image"><img src="${m.attachmentDataUrl}" alt="${escapeHtml(m.attachment.name)}" loading="lazy"></div>`;
            } else {
                const icon = m.attachment.kind === 'image' ? 'fa-image' : (m.attachment.fileType || 'fa-file-lines');
                attHTML = `<div class="msg-attachment file"><i class="fas ${icon}"></i><span>${escapeHtml(m.attachment.name)}</span></div>`;
            }
        }

        // Generated image (assistant only)
        let genImgHTML = '';
        if (!isUser && m.imageUrl) {
            genImgHTML = `<div class="generated-image-wrap">
                <img src="${m.imageUrl}" alt="Hasil generate AI" onclick="window.open(this.src,'_blank')">
                <div class="generated-image-actions">
                    <a class="gi-btn" href="${m.imageUrl}" download="hanif-ai-${Date.now()}.png" title="Unduh"><i class="fas fa-download"></i></a>
                    <button type="button" class="gi-btn" onclick="navigator.clipboard.writeText('${m.imageUrl}').then(()=>window.HanifToast&&window.HanifToast('URL disalin','success'))" title="Salin URL"><i class="fas fa-link"></i></button>
                </div>
            </div>`;
        }

        const bubbleHTML = isUser
            ? `<div class="msg-bubble">${attHTML}${m.content ? escapeHtml(m.content).replace(/\n/g, '<br>') : ''}</div>`
            : `<div class="msg-bubble">${genImgHTML}${m.content ? renderMarkdown(m.content) : (m.imageUrl ? '' : '<div class="thinking"><span></span><span></span><span></span></div>')}</div>`;

        const meta = isUser
            ? `<div class="msg-meta"><span>${fmtTime(m.ts)}</span><strong>Anda</strong></div>`
            : `<div class="msg-meta"><strong>Hanif AI</strong>${model ? `<span class="msg-model">${escapeHtml(model.name)}</span>` : ''}<span>${fmtTime(m.ts)}</span></div>`;

        const hasContent = m.content || m.imageUrl;
        const actions = !isUser && hasContent ? `
            <div class="msg-actions">
                ${m.content ? `<button class="msg-action-btn" data-act="copy" data-idx="${m.idx}"><i class="fas fa-copy"></i> Salin</button>` : ''}
                ${m.content ? `<button class="msg-action-btn" data-act="speak" data-idx="${m.idx}" title="Dengar"><i class="fas fa-volume-high"></i></button>` : ''}
                <button class="msg-action-btn" data-act="regen" data-idx="${m.idx}"><i class="fas fa-rotate"></i> Ulangi</button>
                ${m.content ? `<button class="msg-action-btn" data-act="like" data-idx="${m.idx}"><i class="far fa-thumbs-up"></i></button>` : ''}
            </div>` : '';

        return `<div class="message ${m.role} ${m.completed ? 'completed' : ''}" data-idx="${m.idx}">
            <div class="msg-avatar">${avatarChar}</div>
            <div class="msg-body">${meta}${bubbleHTML}${actions}</div>
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
                        setTimeout(() => { btn.classList.remove('success'); btn.innerHTML = '<i class="fas fa-copy"></i> Salin'; }, 1600);
                    }).catch(() => toast('Gagal menyalin', 'error'));
                } else if (act === 'speak') {
                    speakMessage(m.content, btn);
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
       SCROLL
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
       TEXT-TO-SPEECH
       ================================================================ */
    let currentUtterance = null;
    function speakMessage(text, btnEl) {
        if (!('speechSynthesis' in window)) {
            toast('Browser kamu tidak support pembaca suara', 'error');
            return;
        }
        // Clean markdown for cleaner speech
        const cleanText = String(text || '')
            .replace(/```[\s\S]*?```/g, ' (block kode) ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/[*_~#>]/g, '')
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            .replace(/!\[([^\]]*)\]\([^)]+\)/g, '($1)')
            .replace(/\n+/g, '. ')
            .trim();

        // Toggle: if already speaking, stop
        if (currentUtterance && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            currentUtterance = null;
            document.querySelectorAll('.msg-action-btn.speaking').forEach(b => {
                b.classList.remove('speaking');
                b.innerHTML = '<i class="fas fa-volume-high"></i>';
            });
            return;
        }

        const u = new SpeechSynthesisUtterance(cleanText);
        u.lang = 'id-ID';
        u.rate = 1; u.pitch = 1;
        // Try to find an Indonesian voice
        const voices = speechSynthesis.getVoices();
        const idVoice = voices.find(v => v.lang.startsWith('id'));
        if (idVoice) u.voice = idVoice;

        u.onstart = () => {
            if (btnEl) {
                btnEl.classList.add('speaking');
                btnEl.innerHTML = '<i class="fas fa-stop"></i>';
            }
        };
        u.onend = u.onerror = () => {
            currentUtterance = null;
            if (btnEl) {
                btnEl.classList.remove('speaking');
                btnEl.innerHTML = '<i class="fas fa-volume-high"></i>';
            }
        };
        currentUtterance = u;
        speechSynthesis.speak(u);
    }

    /* ================================================================
       FILE READING — PDF, Excel, Word, CSV, Text, Image
       ================================================================ */
    function fileToDataUrl(file) {
        return new Promise((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => resolve(r.result);
            r.onerror = () => reject(r.error || new Error('FileReader error'));
            r.readAsDataURL(file);
        });
    }

    async function readPDF(file) {
        if (typeof pdfjsLib === 'undefined') throw new Error('PDF reader belum siap, refresh halaman.');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        const max = Math.min(pdf.numPages, 50); // cap untuk PDF besar
        for (let i = 1; i <= max; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map(it => it.str).join(' ');
            text += `--- Halaman ${i} ---\n${pageText}\n\n`;
        }
        if (pdf.numPages > 50) text += `\n[... Total ${pdf.numPages} halaman, hanya 50 pertama yang dibaca]`;
        return text;
    }

    async function readExcel(file) {
        if (typeof XLSX === 'undefined') throw new Error('Excel reader belum siap, refresh halaman.');
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, { type: 'array' });
        let result = '';
        wb.SheetNames.forEach(name => {
            const sheet = wb.Sheets[name];
            const csv = XLSX.utils.sheet_to_csv(sheet);
            // Limit each sheet to 200 rows for sanity
            const lines = csv.split('\n');
            const limited = lines.slice(0, 200).join('\n');
            const truncated = lines.length > 200 ? `\n[... ${lines.length - 200} baris lain di sheet ini]` : '';
            result += `## Sheet: ${name}\n\`\`\`csv\n${limited}${truncated}\n\`\`\`\n\n`;
        });
        return result;
    }

    async function readWord(file) {
        if (typeof mammoth === 'undefined') throw new Error('Word reader belum siap, refresh halaman.');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }

    async function readFileSmart(file) {
        const name = file.name.toLowerCase();
        const ext = name.split('.').pop();

        // Image
        if (file.type.startsWith('image/')) {
            return { kind: 'image', dataUrl: await fileToDataUrl(file), fileType: 'fa-image' };
        }
        // PDF
        if (ext === 'pdf' || file.type === 'application/pdf') {
            const text = await readPDF(file);
            return { kind: 'text', text, fileType: 'fa-file-pdf' };
        }
        // Excel
        if (ext === 'xlsx' || ext === 'xls' || file.type.includes('spreadsheet') || file.type.includes('excel')) {
            const text = await readExcel(file);
            return { kind: 'text', text, fileType: 'fa-file-excel' };
        }
        // Word
        if (ext === 'docx' || file.type.includes('wordprocessingml')) {
            const text = await readWord(file);
            return { kind: 'text', text, fileType: 'fa-file-word' };
        }
        // CSV
        if (ext === 'csv') {
            const text = await file.text();
            return { kind: 'text', text, fileType: 'fa-file-csv' };
        }
        // Text/code
        if (file.type.startsWith('text/') || /\.(txt|md|json|html|css|js|jsx|ts|tsx|py|java|c|cpp|h|hpp|go|rs|rb|php|sql|yaml|yml|xml|sh|env|conf|ini|toml|log|swift|kt|m|r|lua|dart)$/i.test(name)) {
            const text = await file.text();
            return { kind: 'text', text, fileType: 'fa-file-code' };
        }
        return null;
    }

    function renderAttachmentChip() {
        const existing = document.getElementById('attachmentChipWrap');
        if (!state.attachment) { if (existing) existing.remove(); return; }
        const att = state.attachment;
        const wrap = existing || document.createElement('div');
        wrap.id = 'attachmentChipWrap';
        wrap.className = 'attachment-chip-wrap';

        const preview = (att.kind === 'image' && att.dataUrl)
            ? `<img class="ac-thumb" src="${att.dataUrl}" alt="">`
            : `<i class="fas ${att.fileType || 'fa-file-lines'}"></i>`;

        wrap.innerHTML = `<div class="attachment-chip">
            ${preview}
            <div class="ac-info">
                <span class="ac-name">${escapeHtml(att.name)}</span>
                <span class="ac-meta">${fmtSize(att.size || 0)} · ${att.kind === 'image' ? 'Gambar' : 'Dokumen'}</span>
            </div>
            <button type="button" class="ac-remove" aria-label="Hapus lampiran" onclick="window.HanifClearAttachment && window.HanifClearAttachment()">
                <i class="fas fa-times" style="pointer-events:none"></i>
            </button>
        </div>`;
        if (!existing) els.composer.parentNode.insertBefore(wrap, els.composer);
    }
    window.HanifClearAttachment = function() { state.attachment = null; renderAttachmentChip(); };

    /* ================================================================
       IMAGE GENERATION MODE
       ================================================================ */
    function setImageMode(on) {
        state.imageMode = !!on;
        els.modeBanner.hidden = !state.imageMode;
        els.imageBtn.classList.toggle('image-mode-active', state.imageMode);
        els.composerInput.placeholder = state.imageMode
            ? 'Deskripsikan gambar yang ingin dibuat... (mis: kucing astronot di luar angkasa, gaya cat air)'
            : 'Tanyakan apa saja ke Hanif AI...';
        if (state.imageMode) els.composerInput.focus();
    }
    window.HanifToggleImageMode = function(forceState) {
        const next = typeof forceState === 'boolean' ? forceState : !state.imageMode;
        setImageMode(next);
    };

    async function generateImage(conv, aiIdx, prompt) {
        const messageEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"] .msg-bubble`);
        const aiMsg = conv.messages[aiIdx];
        if (messageEl) {
            messageEl.innerHTML = `<div class="image-loading">
                <i class="fas fa-paintbrush"></i>
                Sedang melukis gambar Anda...<br><small>Bisa makan waktu 10-30 detik</small>
            </div>`;
        }
        try {
            if (typeof puter === 'undefined' || !puter.ai || !puter.ai.txt2img) {
                throw new Error('Puter image generation belum siap. Refresh halaman.');
            }
            const result = await puter.ai.txt2img(prompt);
            // result bisa berupa string URL atau HTMLImageElement
            let url = '';
            if (typeof result === 'string') url = result;
            else if (result && result.src) url = result.src;
            else if (result && result.toString) url = result.toString();

            aiMsg.imageUrl = url;
            aiMsg.content = `🎨 Gambar dihasilkan dari prompt: *"${prompt}"*`;
            aiMsg.completed = true;
            if (messageEl) {
                messageEl.innerHTML = `<div class="generated-image-wrap">
                    <img src="${url}" alt="${escapeHtml(prompt)}" onclick="window.open(this.src,'_blank')">
                    <div class="generated-image-actions">
                        <a class="gi-btn" href="${url}" download="hanif-ai-${Date.now()}.png" title="Unduh"><i class="fas fa-download"></i></a>
                        <button type="button" class="gi-btn" onclick="navigator.clipboard.writeText('${url}').then(()=>window.HanifToast&&window.HanifToast('URL disalin','success'))" title="Salin URL"><i class="fas fa-link"></i></button>
                    </div>
                </div>${renderMarkdown(aiMsg.content)}`;
            }
            toast('Gambar berhasil dibuat!', 'success', 1800);
        } catch (err) {
            console.error('Image gen error:', err);
            const errMsg = err && err.message ? err.message : String(err);
            aiMsg.content = `**⚠️ Gagal membuat gambar.**\n\n${errMsg.includes('Permission') || errMsg.includes('auth') ? 'Login Puter dulu via popup yang muncul, lalu coba lagi.' : 'Coba prompt yang berbeda atau lebih spesifik. Hindari konten sensitif.'}`;
            aiMsg.completed = true;
            if (messageEl) messageEl.innerHTML = renderMarkdown(aiMsg.content);
            toast('Gagal generate gambar', 'error');
        } finally {
            state.streaming = false;
            toggleSendStop(false);
            const msgEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"]`);
            if (msgEl) msgEl.classList.add('completed');
            saveState();
            renderConversationList();
            wireMessageActions();
        }
    }

    /* ================================================================
       SEND / STREAM
       ================================================================ */
    async function sendMessage(text) {
        text = (text || '').trim();
        const att = state.attachment;
        if ((!text && !att) || state.streaming) return;

        let conv = getCurrent();
        if (!conv) conv = newConversation();

        const wasImageMode = state.imageMode;

        const userIdx = conv.messages.length;
        const userMsg = { role: 'user', content: text, ts: Date.now(), idx: userIdx };
        if (att) {
            userMsg.attachment = { name: att.name, type: att.type, kind: att.kind, fileType: att.fileType };
            if (att.kind === 'text') userMsg.attachmentText = att.text;
            if (att.kind === 'image') userMsg.attachmentDataUrl = att.dataUrl;
        }
        if (wasImageMode) userMsg.imagePrompt = true;
        conv.messages.push(userMsg);

        if (conv.messages.length === 1) {
            conv.title = autoTitleFromMessage(text || (att ? att.name : 'Lampiran'));
        }
        conv.updatedAt = Date.now();

        state.attachment = null;
        renderAttachmentChip();

        const aiIdx = conv.messages.length;
        conv.messages.push({
            role: 'assistant', content: '', ts: Date.now(), idx: aiIdx,
            modelId: state.modelId, personaId: state.personaId, completed: false,
            isImage: wasImageMode
        });

        saveState();
        renderConversationList();
        renderMessages();

        state.streaming = true;
        toggleSendStop(true);

        if (wasImageMode) {
            await generateImage(conv, aiIdx, text);
            // Setelah generate, kembali ke mode chat
            setImageMode(false);
        } else {
            await streamFromAI(conv, aiIdx);
        }
    }

    async function regenerateFrom(aiIdx) {
        const conv = getCurrent();
        if (!conv) return;
        const aiMsg = conv.messages[aiIdx];
        if (!aiMsg || aiMsg.role !== 'assistant') return;
        aiMsg.content = ''; aiMsg.imageUrl = null;
        aiMsg.completed = false; aiMsg.ts = Date.now();
        aiMsg.modelId = state.modelId; aiMsg.personaId = state.personaId;
        saveState();
        renderMessages();
        state.streaming = true;
        toggleSendStop(true);

        // If original was an image prompt, regenerate as image
        const userMsg = conv.messages[aiIdx - 1];
        if (userMsg && userMsg.imagePrompt) {
            await generateImage(conv, aiIdx, userMsg.content);
        } else {
            await streamFromAI(conv, aiIdx);
        }
    }

    function buildPuterMessages(conv, uptoIdx) {
        const persona = PERSONAS.find(p => p.id === state.personaId) || PERSONAS[0];
        const msgs = [{ role: 'system', content: persona.system }];
        for (let i = 0; i < uptoIdx; i++) {
            const m = conv.messages[i];
            if (!m) continue;
            // Skip image-prompt user messages and image assistant messages from history
            if (m.imagePrompt || m.isImage || m.imageUrl) continue;

            // Image attachment → multimodal
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
            // File attachment → prepend content
            if (m.role === 'user' && m.attachment && m.attachmentText) {
                const filePart = `[Lampiran: ${m.attachment.name}]\n\`\`\`\n${m.attachmentText}\n\`\`\`\n\n`;
                msgs.push({ role: 'user', content: filePart + (m.content || 'Tolong analisa file ini.') });
                continue;
            }
            if (!m.content) continue;
            msgs.push({ role: m.role, content: m.content });
        }
        return msgs;
    }

    async function streamFromAI(conv, aiIdx) {
        const messageEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"] .msg-bubble`);
        const aiMsg = conv.messages[aiIdx];
        if (messageEl) messageEl.innerHTML = '<div class="thinking"><span></span><span></span><span></span></div>';

        const messages = buildPuterMessages(conv, aiIdx);
        let aborted = false;
        state.abortStream = () => { aborted = true; };

        try {
            if (typeof puter === 'undefined' || !puter.ai || !puter.ai.chat) {
                throw new Error('Puter SDK belum siap. Refresh halaman lalu coba lagi.');
            }
            const opts = { model: state.modelId, stream: true };
            let response;
            try {
                response = await puter.ai.chat(messages, false, opts);
            } catch (errStream) {
                console.warn('Stream init failed, fallback non-stream:', errStream);
                const r = await puter.ai.chat(messages, false, { model: state.modelId });
                aiMsg.content = extractText(r);
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
                state.streaming = false; toggleSendStop(false); saveState(); wireMessageActions();
                return;
            }

            if (response && typeof response[Symbol.asyncIterator] === 'function') {
                let buffer = '', firstChunk = true;
                for await (const part of response) {
                    if (aborted) break;
                    const piece = extractText(part);
                    if (!piece) continue;
                    buffer += piece;
                    aiMsg.content = buffer;
                    if (firstChunk) { firstChunk = false; if (messageEl) messageEl.innerHTML = ''; }
                    renderStreamingChunk(messageEl, buffer, false);
                }
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
            } else {
                aiMsg.content = extractText(response);
                renderStreamingChunk(messageEl, aiMsg.content, true);
                aiMsg.completed = true;
            }
        } catch (err) {
            console.error('AI error:', err);
            const errMsg = err && err.message ? err.message : String(err);
            aiMsg.content = `**⚠️ Maaf, terjadi kendala saat menghubungi AI.**\n\n${errMsg.includes('Permission') || errMsg.includes('auth') || errMsg.includes('sign')
                ? 'Sepertinya Puter meminta autentikasi. Silakan buka popup yang muncul untuk login (gratis), lalu coba kirim pesan lagi.'
                : 'Silakan coba lagi atau pilih model lain.'}\n\n> **Tips**: refresh halaman atau ganti model.`;
            aiMsg.completed = true;
            if (messageEl) { messageEl.innerHTML = renderMarkdown(aiMsg.content); decorateCodeBlocks(messageEl); }
            toast('Gagal mendapat respon AI', 'error');
        } finally {
            state.streaming = false; state.abortStream = null;
            toggleSendStop(false);
            const msgEl = els.messages.querySelector(`.message[data-idx="${aiIdx}"]`);
            if (msgEl) msgEl.classList.add('completed');
            saveState(); renderConversationList(); wireMessageActions();
        }
    }

    function extractText(part) {
        if (!part) return '';
        if (typeof part === 'string') return part;
        if (typeof part.text === 'string') return part.text;
        if (part.message && typeof part.message.content === 'string') return part.message.content;
        if (part.message && Array.isArray(part.message.content)) return part.message.content.map(c => c && c.text ? c.text : '').join('');
        if (part.delta && typeof part.delta.content === 'string') return part.delta.content;
        if (part.choices && part.choices[0]) {
            const ch = part.choices[0];
            if (ch.delta && typeof ch.delta.content === 'string') return ch.delta.content;
            if (ch.message && typeof ch.message.content === 'string') return ch.message.content;
        }
        if (typeof part.content === 'string') return part.content;
        if (Array.isArray(part.content)) return part.content.map(c => c && c.text ? c.text : '').join('');
        return '';
    }

    function renderStreamingChunk(messageEl, text, completed) {
        if (!messageEl) return;
        const html = renderMarkdown(text);
        messageEl.innerHTML = completed ? html : html + '<span class="typing-cursor"></span>';
        decorateCodeBlocks(messageEl);
        const dist = els.chatArea.scrollHeight - els.chatArea.scrollTop - els.chatArea.clientHeight;
        if (dist < 240) scrollToBottom(false);
    }

    function toggleSendStop(streaming) {
        if (streaming) { els.sendBtn.hidden = true; els.stopBtn.hidden = false; }
        else { els.sendBtn.hidden = false; els.stopBtn.hidden = true; updateSendDisabled(); }
    }
    function updateSendDisabled() { els.sendBtn.disabled = !els.composerInput.value.trim() && !state.attachment; }
    function autoResizeComposer() {
        els.composerInput.style.height = 'auto';
        els.composerInput.style.height = Math.min(els.composerInput.scrollHeight, 220) + 'px';
    }

    /* ================================================================
       VOICE INPUT
       ================================================================ */
    let recognition = null;
    function initVoice() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            els.micBtn.title = 'Browser tidak support voice input. Coba Chrome/Edge.';
            els.micBtn.addEventListener('click', () => toast('Browser kamu belum support voice. Pakai Chrome/Edge ya.', 'info', 2400));
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
            updateSendDisabled(); autoResizeComposer();
        };
        recognition.onerror = (e) => {
            els.micBtn.classList.remove('active');
            const msg = e.error === 'not-allowed' ? 'Akses mikrofon ditolak. Izinkan di pengaturan browser.'
                      : e.error === 'no-speech' ? 'Tidak ada suara terdeteksi'
                      : 'Tidak bisa mendengar suara';
            toast(msg, 'error');
        };
        recognition.onend = () => { els.micBtn.classList.remove('active'); els.micBtn.title = 'Input suara'; };
        els.micBtn.addEventListener('click', () => {
            if (els.micBtn.classList.contains('active')) { try { recognition.stop(); } catch (e) {} }
            else { try { recognition.start(); toast('🎤 Silakan bicara...', 'info', 1600); } catch (e) {} }
        });
    }

    /* ================================================================
       EXPORT / SHARE
       ================================================================ */
    function exportCurrent() {
        const conv = getCurrent();
        if (!conv || !conv.messages.length) { toast('Tidak ada percakapan untuk diekspor', 'info'); return; }
        const lines = [`# ${conv.title}`, `_${fmtDay(conv.createdAt)} — Hanif AI_`, ''];
        conv.messages.forEach(m => {
            lines.push(`## ${m.role === 'user' ? '🙋 Anda' : '🤖 Hanif AI'} _(${fmtTime(m.ts)})_`);
            if (m.imageUrl) lines.push(`![Generated](${m.imageUrl})`);
            if (m.content) lines.push(m.content);
            lines.push('');
        });
        const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `hanif-${conv.title.replace(/[^\w\s-]/g, '').slice(0, 40)}.md`;
        document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(a.href);
        toast('Diekspor sebagai Markdown', 'success');
    }
    function shareCurrent() {
        const conv = getCurrent();
        if (!conv || !conv.messages.length) { toast('Tidak ada percakapan untuk dibagikan', 'info'); return; }
        const text = conv.messages.map(m => `${m.role === 'user' ? 'Anda' : 'Hanif AI'}: ${m.content || (m.imageUrl ? '[Gambar]' : '')}`).join('\n\n');
        if (navigator.share) navigator.share({ title: conv.title, text }).catch(() => {});
        else navigator.clipboard.writeText(text).then(() => toast('Percakapan disalin ke clipboard', 'success')).catch(() => toast('Tidak bisa membagikan', 'error'));
    }

    /* ================================================================
       PROMPT LIBRARY
       ================================================================ */
    let promptLibActiveCat = 'all';
    function buildPromptLibTabs() {
        els.promptLibTabs.innerHTML = PROMPT_CATEGORIES.map(c => `
            <button type="button" class="plt-tab ${c.id === promptLibActiveCat ? 'active' : ''}" data-cat="${c.id}">
                <i class="fas ${c.icon}"></i> ${c.name}
            </button>`).join('');
        els.promptLibTabs.querySelectorAll('.plt-tab').forEach(b => {
            b.addEventListener('click', () => {
                promptLibActiveCat = b.dataset.cat;
                buildPromptLibTabs();
                renderPromptLibList();
            });
        });
    }
    function renderPromptLibList() {
        const q = (els.promptLibSearch.value || '').toLowerCase().trim();
        const list = PROMPTS.filter(p => {
            if (promptLibActiveCat !== 'all' && p.cat !== promptLibActiveCat) return false;
            if (!q) return true;
            return p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q);
        });
        if (!list.length) {
            els.promptLibList.innerHTML = `<div class="pl-empty"><i class="fas fa-magnifying-glass"></i>Tidak ada prompt yang cocok</div>`;
            return;
        }
        els.promptLibList.innerHTML = list.map((p, idx) => `
            <div class="pl-item" data-idx="${PROMPTS.indexOf(p)}">
                <div class="pl-icon" style="--c1:${p.c1};--c2:${p.c2}"><i class="fas ${p.icon}"></i></div>
                <div class="pl-text">
                    <div class="pl-title">${escapeHtml(p.title)}</div>
                    <div class="pl-desc">${escapeHtml(p.desc)}</div>
                </div>
            </div>`).join('');
        els.promptLibList.querySelectorAll('.pl-item').forEach(it => {
            it.addEventListener('click', () => {
                const p = PROMPTS[Number(it.dataset.idx)];
                if (!p) return;
                els.composerInput.value = p.prompt;
                autoResizeComposer();
                updateSendDisabled();
                els.promptLibModal.classList.remove('is-open');
                els.composerInput.focus();
                toast(`Prompt "${p.title}" siap. Edit bagian [DALAM_KURUNG] sebelum kirim.`, 'info', 2800);
            });
        });
    }
    function openPromptLibrary() {
        buildPromptLibTabs();
        renderPromptLibList();
        els.promptLibModal.classList.add('is-open');
        setTimeout(() => els.promptLibSearch.focus(), 200);
    }

    /* ================================================================
       FILE PICKER HANDLER
       ================================================================ */
    async function handleFileSelected(file) {
        // Limit: 10MB images, 5MB documents
        const isImage = file.type.startsWith('image/');
        const maxSize = isImage ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast(`File terlalu besar (max ${isImage ? '10MB' : '5MB'})`, 'error');
            return;
        }
        try {
            toast(`Membaca file ${file.name}...`, 'info', 1400);
            const parsed = await readFileSmart(file);
            if (!parsed) {
                toast('Tipe file ini belum didukung', 'error');
                return;
            }
            const att = { name: file.name, type: file.type, size: file.size, ...parsed };
            // Truncate text if too long
            if (att.text && att.text.length > 80000) {
                att.text = att.text.slice(0, 80000) + '\n\n[... file dipotong, terlalu panjang]';
            }
            state.attachment = att;
            renderAttachmentChip();
            updateSendDisabled();
            toast(`✓ ${file.name}`, 'success', 1800);
        } catch (err) {
            console.error('File read error:', err);
            toast('Gagal membaca file: ' + (err.message || 'unknown'), 'error');
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
        els.newChatBtn.addEventListener('click', () => newConversation());
        els.topNewChat.addEventListener('click', () => newConversation());
        els.searchInput.addEventListener('input', renderConversationList);
        els.exportBtn.addEventListener('click', exportCurrent);
        els.clearAllBtn.addEventListener('click', clearAllConversations);
        els.shortcutsBtn.addEventListener('click', () => els.shortcutsModal.classList.add('is-open'));
        els.themeToggle.addEventListener('click', toggleTheme);
        els.shareBtn.addEventListener('click', shareCurrent);

        // Modal close (data-close delegation)
        document.addEventListener('click', (e) => {
            const closer = e.target.closest('[data-close]');
            if (!closer) return;
            const modal = closer.closest('.modal');
            if (modal) modal.classList.remove('is-open');
        });

        // Pickers
        els.modelPill.addEventListener('click', (e) => { e.stopPropagation(); togglePicker(els.modelPicker, els.modelPill, els.personaPicker, els.personaPill); });
        els.personaPill.addEventListener('click', (e) => { e.stopPropagation(); togglePicker(els.personaPicker, els.personaPill, els.modelPicker, els.modelPill); });
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.picker') && !e.target.closest('.model-pill') && !e.target.closest('.persona-pill')) closePickers();
        });

        // Suggestions
        els.suggestions.querySelectorAll('.suggestion').forEach(btn => {
            btn.addEventListener('click', () => {
                els.composerInput.value = btn.dataset.prompt;
                autoResizeComposer(); updateSendDisabled();
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
            if (!text && !state.attachment) return;
            if (state.imageMode && !text) { toast('Tulis deskripsi gambar dulu', 'info'); return; }
            els.composerInput.value = '';
            autoResizeComposer(); updateSendDisabled();
            sendMessage(text);
        });

        // Stop
        els.stopBtn.addEventListener('click', () => {
            if (state.abortStream) state.abortStream();
            toast('Respon dihentikan', 'info', 1400);
        });

        // Attach button
        els.attachBtn.addEventListener('click', () => els.fileInput.click());
        els.fileInput.addEventListener('change', async (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) await handleFileSelected(file);
            e.target.value = '';
        });

        // Image generation mode toggle
        els.imageBtn.addEventListener('click', () => setImageMode(!state.imageMode));

        // Prompt library
        els.promptLibBtn.addEventListener('click', openPromptLibrary);
        els.composerPromptBtn.addEventListener('click', openPromptLibrary);
        els.promptLibSearch.addEventListener('input', renderPromptLibList);

        // Scroll
        els.chatArea.addEventListener('scroll', updateScrollBtn);
        els.scrollBottom.addEventListener('click', () => scrollToBottom(true));

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const meta = e.ctrlKey || e.metaKey;
            if (meta && e.key.toLowerCase() === 'k') { e.preventDefault(); newConversation(); els.composerInput.focus(); }
            else if (meta && e.key.toLowerCase() === 'b') { e.preventDefault(); els.app.classList.toggle('sidebar-collapsed'); }
            else if (meta && e.key === '/') { e.preventDefault(); els.shortcutsModal.classList.add('is-open'); }
            else if (meta && e.key.toLowerCase() === 'p') { e.preventDefault(); openPromptLibrary(); }
            else if (meta && e.key.toLowerCase() === 'i') { e.preventDefault(); setImageMode(!state.imageMode); }
            else if (meta && e.shiftKey && e.key.toLowerCase() === 'l') { e.preventDefault(); toggleTheme(); }
            else if (e.key === 'Escape') {
                if (state.abortStream) { state.abortStream(); toast('Respon dihentikan', 'info', 1200); }
                else if (els.shortcutsModal.classList.contains('is-open')) els.shortcutsModal.classList.remove('is-open');
                else if (els.promptLibModal.classList.contains('is-open')) els.promptLibModal.classList.remove('is-open');
                else if (els.modelPicker.classList.contains('open') || els.personaPicker.classList.contains('open')) closePickers();
                else if (state.imageMode) setImageMode(false);
            }
            else if (!meta && !e.shiftKey && e.key === '/' && document.activeElement !== els.composerInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                e.preventDefault();
                els.composerInput.focus();
            }
        });

        // Mobile sidebar backdrop close
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 920 && !els.app.classList.contains('sidebar-collapsed')) {
                if (!e.target.closest('.sidebar') && !e.target.closest('#sidebarOpen')) {
                    els.app.classList.add('sidebar-collapsed');
                }
            }
        });
    }

    /* Expose toast for inline calls */
    window.HanifToast = toast;

    /* ================================================================
       INIT
       ================================================================ */
    function init() {
        initTheme();
        loadState();
        configureMarked();

        const m = MODELS.find(x => x.id === state.modelId) || MODELS[0];
        const p = PERSONAS.find(x => x.id === state.personaId) || PERSONAS[0];
        state.modelId = m.id; state.personaId = p.id;
        els.modelPillName.textContent = m.name;
        els.personaPillName.textContent = p.name;

        buildModelPicker();
        buildPersonaPicker();

        if (window.innerWidth <= 920) els.app.classList.add('sidebar-collapsed');

        wireEvents();
        initVoice();

        renderConversationList();
        renderMessages();
        setTimeout(() => els.composerInput.focus(), 200);
    }

    document.addEventListener('DOMContentLoaded', init);
})();
