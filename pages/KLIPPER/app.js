// ============================================================================
// GLOBAL STATE & CONFIGURATION
// ============================================================================

const globalData = {};
let userConfig = {};
let generatedFilesData = {};
let isGenerated = false;

// STRICT ABSOLUTE PATHS
const configFiles = {
    printers: '/pages/KLIPPER/data/printers.json',
    boards: '/pages/KLIPPER/data/boards.json',
    drivers: '/pages/KLIPPER/data/drivers.json',
    others: '/pages/KLIPPER/data/others.json',
    labels: '/pages/KLIPPER/data/labels.json'
};

const templatesToCompile = ['printer.cfg', 'user_variables.cfg', 'macro.cfg'];

// ============================================================================
// INITIALIZATION
// ============================================================================

async function initializeApp() {
    try {
        const keys = Object.keys(configFiles);
        for (const key of keys) {
            try {
                const res = await fetch(configFiles[key]);
                if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
                const text = await res.text();
                globalData[key] = JSON.parse(text);
            } catch (jsonError) {
                alert(`🚨 JSON ERROR in ${configFiles[key]}\nDetails: ${jsonError.message}`);
                return;
            }
        }
        renderMainSelections();
    } catch (error) {
        console.error("Critical Error loading data", error);
    }
}

// ============================================================================
// UI STATE MANAGEMENT
// ============================================================================

function handleInputChange() {
    if (isGenerated) {
        isGenerated = false;
        document.getElementById('action-results-container').style.display = 'none';
        document.getElementById('action-generate-container').style.display = 'block';
        generatedFilesData = {};
    }
}

function attachChangeListener(element) {
    element.addEventListener('change', handleInputChange);
    element.addEventListener('input', handleInputChange);
}

// ============================================================================
// FORM RENDERING
// ============================================================================

function createFormGroup(key, inputElement) {
    const labelData = globalData.labels[key] || { title: key, description: "" };
    const wrapper = document.createElement('div');
    wrapper.className = 'form-group';

    const label = document.createElement('label');
    label.setAttribute('for', inputElement.id);
    label.textContent = labelData.title;

    // Elegant Hover Tooltip with SVG Icon
    if (labelData.description) {
        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon-wrapper';
        infoIcon.dataset.tooltip = labelData.description;
        // Clean SVG Information Circle
        infoIcon.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
        label.appendChild(infoIcon);
    }

    wrapper.appendChild(label);
    wrapper.appendChild(inputElement);
    attachChangeListener(inputElement);
    return wrapper;
}

function renderMainSelections() {
    const container = document.getElementById('main-hardware-container');
    
    const printerSelect = document.createElement('select');
    printerSelect.id = 'select-printer';
    printerSelect.innerHTML = `<option value="" disabled selected>-- Select Printer --</option>`;
    Object.keys(globalData.printers).forEach(k => {
        printerSelect.innerHTML += `<option value="${k}">${globalData.printers[k].name}</option>`;
    });

    const boardSelect = document.createElement('select');
    boardSelect.id = 'select-board';
    boardSelect.disabled = true;
    boardSelect.innerHTML = `<option value="" disabled selected>-- Select Printer First --</option>`;

    container.appendChild(createFormGroup('printer', printerSelect));
    container.appendChild(createFormGroup('motherboard', boardSelect));

    printerSelect.addEventListener('change', (e) => {
        handleInputChange();
        const printer = globalData.printers[e.target.value];
        
        boardSelect.disabled = false;
        boardSelect.innerHTML = '';
        printer.compatible_boards.forEach(bId => {
            const isSelected = bId === printer.features.default_board ? 'selected' : '';
            boardSelect.innerHTML += `<option value="${bId}" ${isSelected}>${globalData.boards[bId].name}</option>`;
        });

        renderCategorizedFeatures(printer.features);
        
        document.getElementById('section-steppers').style.display = 'block';
        document.getElementById('section-features').style.display = 'block';
        document.getElementById('btn-generate').disabled = false;
    });
}

function renderCategorizedFeatures(features) {
    const currentContainer = document.getElementById('steppers-current-container');
    const driverContainer = document.getElementById('steppers-driver-container');
    const featuresContainer = document.getElementById('dynamic-features-container');

    currentContainer.innerHTML = '';
    driverContainer.innerHTML = '';
    featuresContainer.innerHTML = '';

    for (const [key, value] of Object.entries(features)) {
        if (key === 'default_board') continue;

        const isArray = Array.isArray(value);
        const isNumber = typeof value === 'number';
        const isDriver = typeof value === 'string' && key.includes('driver');

        if (!isArray && !isNumber && !isDriver) continue;

        let inputEl;

        if (isArray) {
            inputEl = document.createElement('select');
            inputEl.id = `feature-${key}`;
            const isBool = typeof value[0] === 'boolean';
            inputEl.dataset.type = isBool ? 'boolean' : 'string';
            
            value.forEach(opt => {
                const optEl = document.createElement('option');
                optEl.value = opt;
                optEl.textContent = isBool ? (opt ? 'Enabled' : 'Disabled') : String(opt).toUpperCase();
                inputEl.appendChild(optEl);
            });
        } 
        else if (isNumber) {
            inputEl = document.createElement('input');
            inputEl.type = 'number';
            inputEl.step = '0.05';
            inputEl.id = `feature-${key}`;
            inputEl.value = value;
            inputEl.dataset.type = 'number';
        }
        else if (isDriver) {
            inputEl = document.createElement('select');
            inputEl.id = `feature-${key}`;
            inputEl.dataset.type = 'string';
            Object.keys(globalData.drivers).forEach(dKey => {
                const optEl = document.createElement('option');
                optEl.value = dKey;
                optEl.textContent = globalData.drivers[dKey].name;
                if (dKey === value) optEl.selected = true;
                inputEl.appendChild(optEl);
            });
        }

        const formGroup = createFormGroup(key, inputEl);

        if (key.includes('current')) {
            currentContainer.appendChild(formGroup);
        } else if (key.includes('driver')) {
            driverContainer.appendChild(formGroup);
        } else {
            featuresContainer.appendChild(formGroup);
        }
    }
}

// ============================================================================
// COMPILATION ENGINE
// ============================================================================

function evaluateCondition(conditionStr, flatConfig) {
    const chunks = conditionStr.split('&&');
    return chunks.every(chunk => {
        let expr = chunk.trim().toUpperCase();
        let isNegated = false;
        if (expr.startsWith('!')) { isNegated = true; expr = expr.substring(1).trim(); }
        let result = false;

        if (expr.startsWith('HAS_')) result = !!flatConfig[expr.replace('HAS_', '')];
        else if (expr.includes('_IS_')) {
            const [k, v] = expr.split('_IS_');
            result = String(flatConfig[k.trim()]).toUpperCase() === v.trim();
        } 
        else if (expr.startsWith('PRINTER_IS_') || expr.startsWith('BOARD_IS_')) {
            result = !!flatConfig[expr];
        }
        return isNegated ? !result : result;
    });
}

function compileTemplate(template, config) {
    let result = template;
    const flat = {};
    for (const [k, v] of Object.entries(config)) flat[k.toUpperCase()] = v;

    result = result.replace(/^[ \t]*#[ \t]*IF[ \t]+(.*?)\r?\n([\s\S]*?)^[ \t]*#[ \t]*ENDIF[ \t]*\r?\n?/gm, 
        (m, cond, block) => evaluateCondition(cond, flat) ? block : ''
    );

    result = result.replace(/\[\[EXPR:(.*?)\]\]/g, (m, math) => {
        let expr = math.toUpperCase();
        for (const [k, v] of Object.entries(flat)) expr = expr.replace(new RegExp(`\\b${k}\\b`,'g'), v);
        try { return Number(new Function(`return (${expr})`)()).toFixed(3).replace(/\.?0+$/, ""); } 
        catch (e) { return m; }
    });

    result = result.replace(/\[\[(.*?)\]\]/g, (m, varName) => {
        const key = varName.trim().toUpperCase();
        return flat[key] !== undefined ? flat[key] : m;
    });

    return result;
}

// ============================================================================
// GENERATION, MODALS & DOWNLOAD
// ============================================================================

function triggerDownload(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function syntaxHighlight(text) {
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/^(\[.*?\])/gm, '<span class="hl-section">$1</span>');
    html = html.replace(/(#.*)$/gm, '<span class="hl-comment">$1</span>');
    html = html.replace(/^([a-zA-Z0-9_]+)\s*:/gm, '<span class="hl-key">$1</span>:');
    return html;
}

function openModal(fileName, text) {
    document.getElementById('modal-title').textContent = fileName;
    document.getElementById('modal-code-body').innerHTML = syntaxHighlight(text);
    document.getElementById('code-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('code-modal').style.display = 'none';
}

function buildResultUI() {
    const container = document.getElementById('result-buttons-container');
    container.innerHTML = '';

    Object.keys(generatedFilesData).forEach(fileName => {
        const text = generatedFilesData[fileName];
        
        // This wrapper ensures the View and Save buttons for each file are stacked vertically
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column'; // Vertical stacking!
        wrapper.style.gap = '8px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '250px'; // Restricts button width so they don't stretch too far

        const btnPreview = document.createElement('button');
        btnPreview.className = 'rh-btn-secondary';
        btnPreview.innerHTML = `View ${fileName}`;
        btnPreview.onclick = () => openModal(fileName, text);

        const btnDownload = document.createElement('button');
        btnDownload.className = 'rh-btn-primary';
        btnDownload.innerHTML = `Save ${fileName}`;
        btnDownload.onclick = () => triggerDownload(fileName, text);

        wrapper.appendChild(btnPreview);
        wrapper.appendChild(btnDownload);
        container.appendChild(wrapper);
    });

    document.getElementById('action-generate-container').style.display = 'none';
    document.getElementById('action-results-container').style.display = 'block';
    isGenerated = true;
}

function generateFirmware() {
    const printerId = document.getElementById('select-printer').value;
    const boardId = document.getElementById('select-board').value;
    const pConfig = globalData.printers[printerId];
    
    userConfig = {
        [`PRINTER_IS_${printerId.toUpperCase()}`]: true,
        [`BOARD_IS_${boardId.toUpperCase()}`]: true,
        PRINTER: printerId.toUpperCase(),
        BOARD: boardId.toUpperCase(),
        ...pConfig.config,
        ...globalData.boards[boardId].pins
    };

    for (const [key, val] of Object.entries(pConfig.features)) {
        if (key === 'default_board') continue;
        const el = document.getElementById(`feature-${key}`);
        if (el) {
            let v = el.value;
            if (el.dataset.type === 'boolean') v = (v === 'true');
            else if (el.dataset.type === 'number') v = parseFloat(v);
            userConfig[key] = v;
        } else {
            userConfig[key] = val;
        }
    }

    userConfig['CURRENT_XY'] = userConfig['default_current_xy'];
    userConfig['CURRENT_Z'] = userConfig['default_current_z'];
    userConfig['CURRENT_E'] = userConfig['default_current_e'];
    userConfig['DRIVER_XY'] = userConfig['default_driver_xy'];
    userConfig['DRIVER_Z'] = userConfig['default_driver_z'];
    userConfig['DRIVER_E'] = userConfig['default_driver_e'];

    // STRICT ABSOLUTE PATHS FOR CONFIG FETCHING
    const promises = templatesToCompile.map(fName => 
        fetch(`/pages/KLIPPER/config/${fName}`)
            .then(res => res.ok ? res.text() : Promise.reject(`Missing: ${fName}`))
            .then(txt => { generatedFilesData[fName] = compileTemplate(txt, userConfig); })
    );

    Promise.all(promises)
        .then(buildResultUI)
        .catch(err => alert("Error compiling: " + err));
}

// Attach Events
document.getElementById('btn-generate').addEventListener('click', generateFirmware);
document.getElementById('btn-modal-close').addEventListener('click', closeModal);

// Close modal when clicking outside of it
document.getElementById('code-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('code-modal')) {
        closeModal();
    }
});

document.getElementById('btn-modal-copy').addEventListener('click', () => {
    const text = document.getElementById('modal-code-body').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('btn-modal-copy');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy to Clipboard', 2000);
    });
});

initializeApp();
