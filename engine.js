let currentMode = 'semantic';
let currentLang = 'en';

const config = {
    en: {
        fillers: [/could you please/gi, /i was wondering if/gi, /i would like you to/gi, /at this point in time/gi],
        shorthand: {
            "aws certified cloud practitioner": "AWS-CP",
            "root directory": "ROOT_DIR",
            "solution architect": "AWS-SA",
            "identity and access management": "IAM"
        }
    },
    ja: {
        fillers: [/ていただけますでしょうか/g, /よろしくお願いいたします/g, /お世話になっております/g],
        shorthand: {
            "をご確認ください": "確認求む",
            "〜だと思います": "、"
        }
    }
};

function setMode(m) {
    currentMode = m;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('m-' + m).classList.add('active');
}

function setLang(l) {
    currentLang = l;
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('l-' + l).classList.add('active');
}

function process() {
    let raw = document.getElementById('input').value;
    if (!raw.trim()) return;

    let optimized = raw;

    // 1. Semantic Pruning
    config[currentLang].fillers.forEach(regex => {
        optimized = optimized.replace(regex, "");
    });

    // 2. Technical Namespacing (The $Path Rule)
    optimized = optimized.replace(/(?:in|inside)\s(?:the\s)?([\w\-\/]+)\sfolder/gi, "[$1]:");

    // 3. Technical Shorthand
    Object.entries(config[currentLang].shorthand).forEach(([key, val]) => {
        optimized = optimized.replace(new RegExp(key, 'gi'), val);
    });

    // 4. Mode Logic
    if (currentMode === 'xml') {
        optimized = `<context>\n${optimized}\n</context>\n<task>Execute precisely. No preamble.</task>`;
    } else if (currentMode === 'aggressive') {
        optimized = optimized.replace(/\b(the|a|an)\b/gi, "").replace(/\s\s+/g, ' ');
    } else if (currentMode === 'semantic') {
        optimized = `[ROLE: Expert]\n[TASK]: ${optimized}\n[FORMAT: Concise]`;
    }

    updateUI(raw, optimized);
}

function updateUI(oldVal, newVal) {
    const oldTokens = Math.ceil(oldVal.length / 4);
    const newTokens = Math.ceil(newVal.length / 4);
    const pct = Math.round(((oldTokens - newTokens) / oldTokens) * 100);

    document.getElementById('output').innerText = newVal;
    document.getElementById('stat-old').innerText = oldTokens;
    document.getElementById('stat-new').innerText = newTokens;
    document.getElementById('stat-pct').innerText = (pct > 0 ? pct : 0) + "%";
    document.getElementById('result-box').classList.remove('hidden');
}

function copyResult() {
    const text = document.getElementById('output').innerText;
    navigator.clipboard.writeText(text);
    alert("Optimized prompt copied!");
}

// Live Char Count
document.getElementById('input').addEventListener('input', (e) => {
    document.getElementById('char-count').innerText = e.target.value.length + " Chars";
});
