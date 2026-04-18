const i18n = {
    en: {
        "version": "Semantic Engine v3.1",
        "mode-semantic": "Semantic",
        "mode-xml": "XML (Claude)",
        "mode-aggressive": "Aggressive",
        "lang-label": "LANGUAGE",
        "title": "Optimize Prompt",
        "subtitle": "Compressing logic to save tokens and prevent 3-hour lockouts.",
        "placeholder": "Paste your idea or code request here...",
        "btn-run": "COMPRESS & OPTIMIZE",
        "result-head": "Result",
        "copy": "Copy",
        "stat-old": "Original",
        "stat-new": "Compressed",
        "stat-saved": "Saved"
    },
    ja: {
        "version": "セマンティックエンジン v3.1",
        "mode-semantic": "セマンティック",
        "mode-xml": "XML (Claude用)",
        "mode-aggressive": "徹底圧縮",
        "lang-label": "言語切り替え",
        "title": "プロンプト最適化",
        "subtitle": "トークンを節約し、3時間の利用制限を回避します。",
        "placeholder": "ここにアイデアやコードのリクエストを貼り付けてください...",
        "btn-run": "圧縮して最適化する",
        "result-head": "結果",
        "copy": "コピー",
        "stat-old": "元サイズ",
        "stat-new": "圧縮後",
        "stat-saved": "節約率"
    }
};

let currentMode = 'semantic';
let currentLang = 'en';

function setLang(l) {
    currentLang = l;
    
    // 1. Update UI Buttons Highlighting
    document.getElementById('l-en').className = l === 'en' ? 'lang-btn active bg-[#4bdad8] text-[#002d2d] flex-1 py-2 rounded font-bold transition-all' : 'lang-btn flex-1 py-2 rounded text-slate-500 transition-all';
    document.getElementById('l-ja').className = l === 'ja' ? 'lang-btn active bg-[#4bdad8] text-[#002d2d] flex-1 py-2 rounded font-bold transition-all' : 'lang-btn flex-1 py-2 rounded text-slate-500 transition-all';

    // 2. Loop through all data-key elements and translate
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (i18n[l][key]) {
            el.innerText = i18n[l][key];
        }
    });

    // 3. Update Placeholder
    const input = document.getElementById('input');
    input.placeholder = i18n[l]["placeholder"];
}

function setMode(m) {
    currentMode = m;
    // Audit: Fix highlighting logic
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-[#4bdad8]/10', 'text-[#4bdad8]', 'border-l-4', 'border-[#4bdad8]');
        btn.classList.add('text-slate-400');
    });
    
    const activeBtn = document.getElementById('m-' + m);
    activeBtn.classList.remove('text-slate-400');
    activeBtn.classList.add('active', 'bg-[#4bdad8]/10', 'text-[#4bdad8]', 'border-l-4', 'border-[#4bdad8]');
}

// Ensure the initial state is set on load
window.onload = () => {
    setLang('en');
    setMode('semantic');
};
