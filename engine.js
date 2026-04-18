let currentMode = 'semantic';
let currentLang = 'en';

const config = {
    en: {
        fillers: [
            { r: /could you please|can you please|i was wondering if you could/gi, t: "" },
            { r: /i would like to have|i want you to/gi, t: "Task:" },
            { r: /due to the fact that|because of the fact that/gi, t: "because" },
            { r: /at this point in time|in the current climate/gi, t: "currently" },
            { r: /give suggestions on what we could add too/gi, t: "Suggest additions" },
            { r: /so that we could/gi, t: "to" }
        ],
        shorthand: {
            "prompt engineering": "PE",
            "prompt compression": "PC",
            "efficiently": "eff.",
            "instructions": "rules"
        }
    },
    ja: {
        fillers: [
            { r: /〜ていただけますでしょうか|〜ていただけますか|〜てください/g, t: "。 " },
            { r: /お世話になっております。|よろしくお願いいたします。/g, t: "" },
            { r: /〜について教えてください/g, t: "の詳細" },
            { r: /といった形になります/g, t: "です" }
        ],
        shorthand: {
            "プロンプト": "PRMT",
            "効率的": "効率"
        }
    }
};

function setMode(m) {
    currentMode = m;
    // UI Update: Highlight active mode
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-[#4bdad8]/10', 'text-[#4bdad8]', 'border-l-4', 'border-[#4bdad8]');
    });
    const activeBtn = document.getElementById('m-' + m);
    activeBtn.classList.add('active', 'bg-[#4bdad8]/10', 'text-[#4bdad8]', 'border-l-4', 'border-[#4bdad8]');
}

function setLang(l) {
    currentLang = l;
    // UI Update: Highlight active language
    document.getElementById('l-en').className = l === 'en' ? 'lang-btn active bg-[#4bdad8] text-[#002d2d]' : 'lang-btn text-slate-500';
    document.getElementById('l-ja').className = l === 'ja' ? 'lang-btn active bg-[#4bdad8] text-[#002d2d]' : 'lang-btn text-slate-500';
}

function process() {
    let raw = document.getElementById('input').value;
    if (!raw.trim()) return;

    let optimized = raw;

    // 1. Language-Specific Pruning
    config[currentLang].fillers.forEach(item => {
        optimized = optimized.replace(item.r, item.t);
    });

    // 2. Technical Shorthand
    Object.entries(config[currentLang].shorthand).forEach(([key, val]) => {
        optimized = optimized.replace(new RegExp(key, 'gi'), val);
    });

    // 3. Mode Logic Logic
    if (currentMode === 'xml') {
        optimized = `<context>\n${optimized.trim()}\n</context>\n<task>Process concisely</task>`;
    } else if (currentMode === 'aggressive') {
        optimized = optimized.replace(/\b(the|a|an)\b/gi, "")
                             .replace(/[.,!?;:]/g, "")
                             .replace(/\s\s+/g, ' ');
    } else if (currentMode === 'semantic') {
        optimized = `[Task]: ${optimized.trim()}\n[Output]: Concise/No-filler`;
    }

    updateUI(raw, optimized.trim());
}

function updateUI(oldVal, newVal) {
    // Audit: Use a more accurate token estimate (4 chars/token for EN, 1 char/token for JA)
    const oldTokens = currentLang === 'en' ? Math.ceil(oldVal.length / 4) : oldVal.length;
    const newTokens = currentLang === 'en' ? Math.ceil(newVal.length / 4) : newVal.length;
    const pct = Math.round(((oldVal.length - newVal.length) / oldVal.length) * 100);

    document.getElementById('output').innerText = newVal;
    document.getElementById('stat-old').innerText = oldTokens;
    document.getElementById('stat-new').innerText = newTokens;
    document.getElementById('stat-pct').innerText = (pct > 0 ? pct : 0) + "%";
    document.getElementById('result-box').classList.remove('hidden');
}
