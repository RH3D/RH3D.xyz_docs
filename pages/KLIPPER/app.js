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
// UI STATE MANAGEMENT & VALIDATION
// ============================================================================

function handleInputChange() {
    if (isGenerated) {
        isGenerated = false;
        document.getElementById('action-results-container').style.display = 'none';
        document.getElementById('action-generate-container').style.display = 'block';
        generatedFilesData = {};
    }
    validateHardware(); // Check RMS limits dynamically
}

function attachChangeListener(element) {
    element.addEventListener('change', handleInputChange);
    element.addEventListener('input', handleInputChange);
}

function validateHardware() {
    // Clear previous warnings
    document.querySelectorAll('.hw-warning').forEach(el => el.remove());
    const generateBtn = document.getElementById('btn-generate');
    generateBtn.disabled = false; // Default to enabled
    
    const printerId = document.getElementById('select-printer').value;
    const boardId = document.getElementById('select-board').value;
    
    if (!printerId || !boardId) return;

    const pConfig = globalData.printers[printerId];
    const boardData = globalData.boards[boardId];

    // --- 1. DRIVER SLOT VALIDATION (Hard Limit) ---
    // Build a temporary config from UI to count required motors
    const tempConfig = { ...pConfig.config };
    for (const [key, val] of Object.entries(pConfig.features)) {
        if (key === 'default_board') continue;
        const el = document.getElementById(`feature-${key}`);
        if (el) tempConfig[key] = (el.dataset.type === 'boolean') ? (el.value === 'true') : el.value;
        else tempConfig[key] = val;
    }

    const motorMap = buildMotorMap(tempConfig);
    const requiredDrivers = Object.keys(motorMap).length;
    const availableDrivers = boardData.drivers || 99; // Fallback if missing in JSON

    if (requiredDrivers > availableDrivers) {
        const warn = document.createElement('div');
        warn.className = 'rms-warning error hw-warning';
        warn.textContent = `⚠ ERROR: Board supports ${availableDrivers} drivers, but configuration requires ${requiredDrivers}. Disable some motors (e.g. 4WD) or select another board.`;
        document.getElementById('select-board').parentElement.appendChild(warn);
        generateBtn.disabled = true; // LOCK GENERATION
    }

    // --- 2. RMS CURRENT VALIDATION (Soft Limit) ---
    const axes = ['xy', 'z', 'e'];
    axes.forEach(axis => {
        const currentInput = document.getElementById(`feature-default_current_${axis}`);
        const driverSelect = document.getElementById(`feature-default_driver_${axis}`);
        
        if (currentInput && driverSelect) {
            const driverKey = driverSelect.value;
            const dData = globalData.drivers[driverKey];
            const currentVal = parseFloat(currentInput.value);
            
            if (dData && currentVal) {
                let wText = ''; let wLevel = '';
                if (dData.max_rms_current && currentVal >= dData.max_rms_current) {
                    wText = dData.warning_max_rms || `WARNING: Exceeds absolute max current of ${dData.max_rms_current}A!`;
                    wLevel = 'error';
                } else if (dData.high_rms_current && currentVal >= dData.high_rms_current) {
                    wText = dData.warning_high_rms || `Warning: Ensure cooling over ${dData.high_rms_current}A.`;
                    wLevel = 'warn';
                }
                
                if (wText) {
                    const wSpan = document.createElement('div');
                    wSpan.className = `rms-warning hw-warning ${wLevel}`;
                    wSpan.textContent = `⚠ ${wText}`;
                    currentInput.parentElement.appendChild(wSpan);
                }
            }
        }
    });
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

    if (labelData.description) {
        const infoIcon = document.createElement('span');
        infoIcon.className = 'info-icon-wrapper';
        infoIcon.dataset.tooltip = labelData.description;
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

    // Handle Printer Change
    printerSelect.addEventListener('change', (e) => {
        handleInputChange();
        const printer = globalData.printers[e.target.value];
        
        boardSelect.innerHTML = '';
        printer.compatible_boards.forEach(bId => {
            const isSelected = bId === printer.features.default_board ? 'selected' : '';
            boardSelect.innerHTML += `<option value="${bId}" ${isSelected}>${globalData.boards[bId].name}</option>`;
        });

        // LOCK BOARD SELECT if there is only 1 compatible board
        if (printer.compatible_boards.length === 1) {
            boardSelect.disabled = true;
        } else {
            boardSelect.disabled = false;
        }

        renderCategorizedFeatures(printer.features, boardSelect.value);
        
        document.getElementById('section-steppers').style.display = 'block';
        document.getElementById('section-features').style.display = 'block';
        document.getElementById('btn-generate').disabled = false;
    });

    // Handle Board Change (Updates compatible drivers dynamically)
    boardSelect.addEventListener('change', (e) => {
        handleInputChange();
        const printer = globalData.printers[printerSelect.value];
        // Re-render features based on the newly selected board
        renderCategorizedFeatures(printer.features, e.target.value);
    });
}

function renderCategorizedFeatures(features, boardId) {
    const currentContainer = document.getElementById('steppers-current-container');
    const driverContainer = document.getElementById('steppers-driver-container');
    const featuresContainer = document.getElementById('dynamic-features-container');

    currentContainer.innerHTML = '';
    driverContainer.innerHTML = '';
    featuresContainer.innerHTML = '';

    // Fetch the active board data to determine compatible drivers
    const boardData = globalData.boards[boardId];
    // If board doesn't restrict drivers, allow all of them
    const allowedDrivers = boardData.compatible_drivers || Object.keys(globalData.drivers);

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

            // LOCK SELECT if there is only 1 option
            if (value.length === 1) {
                inputEl.disabled = true;
            }
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
            
            let validOptionsCount = 0;
            
            Object.keys(globalData.drivers).forEach(dKey => {
                if (allowedDrivers.includes(dKey)) {
                    const optEl = document.createElement('option');
                    optEl.value = dKey;
                    optEl.textContent = globalData.drivers[dKey].name;
                    if (dKey === value) optEl.selected = true;
                    inputEl.appendChild(optEl);
                    validOptionsCount++;
                }
            });

            // Fallback: If printer's default driver isn't supported by the board, select the first available one
            if (!allowedDrivers.includes(value) && validOptionsCount > 0) {
                inputEl.selectedIndex = 0;
            }

            // LOCK DRIVER SELECT if the board only supports 1 driver type (e.g. integrated TMC2209)
            if (validOptionsCount === 1) {
                inputEl.disabled = true;
            }
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
    validateHardware(); // Run initial validation based on default values
}

// ============================================================================
// COMPILATION ENGINE & MOTOR MAPPING
// ============================================================================

function evaluateCondition(conditionStr, flatConfig) {
    const orChunks = conditionStr.split('||');
    
    return orChunks.some(orChunk => {
        const andChunks = orChunk.split('&&');
        
        return andChunks.every(chunk => {
            let expr = chunk.trim().toUpperCase();
            let isNegated = false;
            
            if (expr.startsWith('!')) { 
                isNegated = true; 
                expr = expr.substring(1).trim(); 
            }
            
            let result = false;

            // NEW: Mathematical Operators (>, <, >=, <=, ==)
            const mathMatch = expr.match(/^(.+?)\s*(>=|<=|>|<|==)\s*(.+)$/);
            if (mathMatch) {
                const leftKey = mathMatch[1].trim();
                const operator = mathMatch[2].trim();
                const rightVal = parseFloat(mathMatch[3].trim());
                const leftVal = parseFloat(flatConfig[leftKey]) || 0;

                if (operator === '>') result = leftVal > rightVal;
                else if (operator === '>=') result = leftVal >= rightVal;
                else if (operator === '<') result = leftVal < rightVal;
                else if (operator === '<=') result = leftVal <= rightVal;
                else if (operator === '==') result = leftVal === rightVal;
            } 
            // EXISTING: Boolean variables
            else if (expr.startsWith('HAS_')) {
                result = !!flatConfig[expr.replace('HAS_', '')];
            } else if (expr.includes('_IS_')) {
                const [k, v] = expr.split('_IS_');
                result = String(flatConfig[k.trim()]).toUpperCase() === v.trim();
            } else if (expr.startsWith('PRINTER_IS_') || expr.startsWith('BOARD_IS_')) {
                result = !!flatConfig[expr];
            }
            
            return isNegated ? !result : result;
        });
    });
}

function buildMotorMap(flatConfig) {
    const activeMotors = ['stepper_x'];
    
    if (flatConfig['4WD']) activeMotors.push('stepper_x1');
    activeMotors.push('stepper_y');
    if (flatConfig['4WD']) activeMotors.push('stepper_y1');
    activeMotors.push('stepper_z');
    
    const hasZtilt = flatConfig['Z_TILT'];
    const hasDualZ = flatConfig['DUAL_Z'];
    const hasQuadGantry = flatConfig['QUAD_GANTRY_LEVEL'];
    
    if (hasDualZ || hasZtilt || hasQuadGantry) activeMotors.push('stepper_z1');
    if (hasZtilt || hasQuadGantry) activeMotors.push('stepper_z2');
    if (hasQuadGantry) activeMotors.push('stepper_z3');
    
    const numExtruders = flatConfig['EXTRUDER_COUNT'] || 1;
    activeMotors.push('extruder');
    for (let i = 1; i < numExtruders; i++) {
        activeMotors.push(`extruder${i}`);
    }
    
    const map = {};
    activeMotors.forEach((motor, index) => {
        map[motor] = index + 1;
    });
    
    return map;
}

function compileTemplate(template, config) {
    let result = template;
    const flat = {};
    for (const [k, v] of Object.entries(config)) flat[k.toUpperCase()] = v;

    // --- PRE-PHASE: Motor Map ---
    const motorMap = buildMotorMap(flat);
    Object.keys(motorMap).forEach(motorName => { flat[motorName.toUpperCase()] = true; });

    // --- PHASE 1: # IF block removal ---
    result = result.replace(/^[ \t]*#[ \t]*IF[ \t]+(.*?)\r?\n([\s\S]*?)^[ \t]*#[ \t]*ENDIF[ \t]*\r?\n?/gm, 
        (m, cond, block) => evaluateCondition(cond, flat) ? block : ''
    );

    // --- PHASE 1.5: DYNAMIC FAN ALLOCATOR ---
    // 1. Scan remaining text to see which fans survived the # IF blocks
    const fanRegex = /^[ \t]*(?:#\s*)?\[\[FAN:\s*([a-zA-Z0-9_]+)\]\]/gm;
    const activeFans = [];
    let match;
    while ((match = fanRegex.exec(result)) !== null) {
        activeFans.push(match[1].toLowerCase());
    }

    // 2. Sort active fans strictly by priority
    const fanPriority = ['part_cooling', 'hotend_cooling', 'controller_fan', 'driver_fan', 'stepper_fan', 'filter_fan', 'aux_fan'];
    activeFans.sort((a, b) => {
        let idxA = fanPriority.indexOf(a);
        let idxB = fanPriority.indexOf(b);
        if (idxA === -1) idxA = 99;
        if (idxB === -1) idxB = 99;
        return idxA - idxB;
    });

    // 3. Create the mapping
    const fanMap = {};
    activeFans.forEach((fanName, index) => { fanMap[fanName] = index; });
    const maxFans = flat['BOARD_FANS'] || 99;
    const maxMfans = flat['BOARD_MFANS'] || 0; // The spillover capacity

    // --- PHASE 2: Object Mapping & Generation ---
    let currentMotorIndex = null;
    let currentFanIndex = null;
    let processedLines = [];
    
    result.split('\n').forEach(line => {
        // Detect Motor Anchor
        const motorMatch = line.match(/^[ \t]*(?:#\s*)?\[\[MOTOR:\s*([a-zA-Z0-9_]+)\]\]/);
        if (motorMatch) {
            currentMotorIndex = motorMap[motorMatch[1].toLowerCase()] || null;
            currentFanIndex = null; 
            return; 
        }

        // Detect Fan Anchor
        const fanMatch = line.match(/^[ \t]*(?:#\s*)?\[\[FAN:\s*([a-zA-Z0-9_]+)\]\]/);
        if (fanMatch) {
            const fName = fanMatch[1].toLowerCase();
            currentFanIndex = fanMap[fName] !== undefined ? fanMap[fName] : null;
            currentMotorIndex = null; 
            return;
        }
        
        // Generate Stepper Drivers
        if (line.includes('[[GENERATE_STEPPER_DRIVERS]]')) {
            let driverBlocks = [];
            Object.keys(motorMap).forEach(motorName => {
                const mIndex = motorMap[motorName];
                let axisKey = 'E';
                if (motorName.startsWith('stepper_x') || motorName.startsWith('stepper_y')) axisKey = 'XY';
                else if (motorName.startsWith('stepper_z')) axisKey = 'Z';
                
                const driverId = flat[`DRIVER_${axisKey}`];
                if (driverId && globalData.drivers[driverId.toLowerCase()]) {
                    const dData = globalData.drivers[driverId.toLowerCase()];
                    let block = dData.config_template || '';
                    block = block.replace(/\[\[MOTOR_NAME\]\]/g, motorName);
                    block = block.replace(/\[\[MOTOR_CURRENT\]\]/g, flat[`CURRENT_${axisKey}`]);
                    block = block.replace(/\[\[M_/g, `[[M${mIndex}_`);
                    driverBlocks.push(block);
                }
            });
            processedLines.push(driverBlocks.join('\n'));
            return;
        }
        
        // Contextual M-Port replacement
        if (currentMotorIndex && line.includes('[[M_')) {
            processedLines.push(line.replace(/\[\[M_/g, `[[M${currentMotorIndex}_`));
            return;
        }

        // Contextual FAN replacement with MFAN Spillover
        // Matches any variable containing "FAN" inside the brackets (e.g., [[2W_FAN]], [[4W_FAN_CTRL]])
        if (currentFanIndex !== null && line.match(/\[\[.*?FAN.*?\]\]/)) {
            if (currentFanIndex < maxFans) {
                // Captures prefix ($1) and suffix ($2) and injects the index dynamically
                // E.g., [[2W_FAN]] -> [[2W_FAN0]], [[4W_FAN_CTRL]] -> [[4W_FAN0_CTRL]]
                processedLines.push(line.replace(/\[\[(.*?)FAN(.*?)\]\]/g, `[[$1FAN${currentFanIndex}$2]]`));
            } 
            else if (currentFanIndex < maxFans + maxMfans) {
                // SPILLOVER: Forces the prefix to M_FAN and drops the original prefix (e.g. 2W_ or 4W_)
                const mFanIndex = currentFanIndex - maxFans;
                // E.g., [[2W_FAN]] -> [[M_FAN0]], [[4W_FAN_CTRL]] -> [[M_FAN0_CTRL]]
                processedLines.push(line.replace(/\[\[.*?FAN(.*?)\]\]/g, `[[M_FAN${mFanIndex}$1]]`));
            } 
            else {
                // Out of ALL ports fallback
                processedLines.push(line.replace(/\[\[.*?FAN.*?\]\]/g, '# UNDEFINED (USE OTHER SUITABLE FREE PIN, Y SPLITTER FOR OTHER FAN OR WIRE IT SEPARATELY)'));
            }
            return;
        }
        
        processedLines.push(line);
    });
    
    result = processedLines.join('\n');

    // --- PHASE 3: Math Evaluations ---
    result = result.replace(/\[\[EXPR:(.*?)\]\]/g, (m, math) => {
        let expr = math.toUpperCase();
        for (const [k, v] of Object.entries(flat)) expr = expr.replace(new RegExp(`\\b${k}\\b`,'g'), v);
        try { return Number(new Function(`return (${expr})`)()).toFixed(3).replace(/\.?0+$/, ""); } 
        catch (e) { return m; }
    });

    // --- PHASE 4: Direct Variables & Undefined Fallback ---
    result = result.replace(/\[\[(.*?)\]\]/g, (m, varName) => {
        const key = varName.trim().toUpperCase();
        if (flat[key] !== undefined) return flat[key];
        return '# UNDEFINED';
    });

    return result;
}


// ============================================================================
// MODALS & DOWNLOAD
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

    // Enforce STRICT ordering based on the templatesToCompile array
    templatesToCompile.forEach(fileName => {
        const text = generatedFilesData[fileName];
        
        // Safety check just in case a file failed to download
        if (!text) return; 

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = 'column';
        wrapper.style.gap = '8px';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = '250px'; 

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
        ...globalData.boards[boardId].pins,
        BOARD_DRIVERS: globalData.boards[boardId].drivers || 99,
        BOARD_FANS: globalData.boards[boardId].fan || 99,
        BOARD_MFANS: globalData.boards[boardId].mfan || 0
    };

    // 1. Gather all direct inputs from the form
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

    // 2. DYNAMIC OTHERS.JSON DATA EXTRACTION
    // Loop through all saved user configurations to find hidden variables in others.json
    Object.keys(userConfig).forEach(key => {
        const selectedValue = userConfig[key];
        
        // If the feature exists in others.json (e.g. key="z_rails", selectedValue="mgn12h")
        if (typeof selectedValue === 'string' && globalData.others[key] && globalData.others[key][selectedValue]) {
            const extraData = globalData.others[key][selectedValue];
            
            // Extract all nested properties (like Z_TRAVEL_MODIFIER) and push them to userConfig
            Object.keys(extraData).forEach(extraKey => {
                if (extraKey !== 'name') {
                    userConfig[extraKey] = extraData[extraKey];
                }
            });
        }
    });

    // 3. Unification aliases for steppers
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
document.getElementById('code-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('code-modal')) closeModal();
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
