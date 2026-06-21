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
    validateCurrents(); // Check RMS limits dynamically
}

function attachChangeListener(element) {
    element.addEventListener('change', handleInputChange);
    element.addEventListener('input', handleInputChange);
}

function validateCurrents() {
    // Clear previous warnings
    document.querySelectorAll('.rms-warning').forEach(el => el.remove());
    
    const axes = ['xy', 'z', 'e'];
    
    axes.forEach(axis => {
        const currentInput = document.getElementById(`feature-default_current_${axis}`);
        const driverSelect = document.getElementById(`feature-default_driver_${axis}`);
        
        if (currentInput && driverSelect) {
            const driverKey = driverSelect.value;
            const driverData = globalData.drivers[driverKey];
            const currentVal = parseFloat(currentInput.value);
            
            if (driverData && currentVal) {
                let warningText = '';
                let warningLevel = '';
                
                if (driverData.max_rms_current && currentVal >= driverData.max_rms_current) {
                    warningText = driverData.warning_max_rms || `WARNING: Exceeds absolute max current of ${driverData.max_rms_current}A!`;
                    warningLevel = 'error';
                } else if (driverData.high_rms_current && currentVal >= driverData.high_rms_current) {
                    warningText = driverData.warning_high_rms || `Warning: High current! Ensure cooling over ${driverData.high_rms_current}A.`;
                    warningLevel = 'warn';
                }
                
                if (warningText) {
                    const warningSpan = document.createElement('div');
                    warningSpan.className = `rms-warning ${warningLevel}`;
                    warningSpan.textContent = `⚠ ${warningText}`;
                    currentInput.parentElement.appendChild(warningSpan);
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
    validateCurrents(); // Run initial validation based on default values
}

// ============================================================================
// COMPILATION ENGINE & MOTOR MAPPING
// ============================================================================

function evaluateCondition(conditionStr, flatConfig) {
    // 1. Split the condition by OR (||)
    // The .some() method ensures that if ANY of the OR blocks are true, the entire # IF is true.
    const orChunks = conditionStr.split('||');
    
    return orChunks.some(orChunk => {
        // 2. Inside each OR block, split by AND (&&)
        // The .every() method ensures that ALL conditions within this block must be true.
        const andChunks = orChunk.split('&&');
        
        return andChunks.every(chunk => {
            let expr = chunk.trim().toUpperCase();
            let isNegated = false;
            
            // Check for NOT (!)
            if (expr.startsWith('!')) { 
                isNegated = true; 
                expr = expr.substring(1).trim(); 
            }
            
            let result = false;

            // Evaluate the specific expression
            if (expr.startsWith('HAS_')) {
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

    // --- PRE-PHASE: Generate the motor map BEFORE processing # IF blocks ---
    const motorMap = buildMotorMap(flat);
    
    // Inject active motor flags (e.g., STEPPER_X: true, EXTRUDER: true)
    Object.keys(motorMap).forEach(motorName => {
        flat[motorName.toUpperCase()] = true; 
    });

    // --- PHASE 1: # IF block removal ---
    result = result.replace(/^[ \t]*#[ \t]*IF[ \t]+(.*?)\r?\n([\s\S]*?)^[ \t]*#[ \t]*ENDIF[ \t]*\r?\n?/gm, 
        (m, cond, block) => evaluateCondition(cond, flat) ? block : ''
    );

    // --- PHASE 2: Motor Mapping & Dynamic Driver Generation ---
    let currentMotorIndex = null;
    let processedLines = [];
    
    result.split('\n').forEach(line => {
        // 2A: Detect hidden motor anchor (e.g., [[MOTOR: stepper_x]] or # [[MOTOR: stepper_x]])
        const motorMatch = line.match(/^[ \t]*(?:#\s*)?\[\[MOTOR:\s*([a-zA-Z0-9_]+)\]\]/);
        if (motorMatch) {
            const motorName = motorMatch[1].toLowerCase();
            currentMotorIndex = motorMap[motorName] || null;
            return; // Delete the anchor line from the final output
        }
        
        // 2B: Generate Stepper Drivers dynamically from drivers.json
        if (line.includes('[[GENERATE_STEPPER_DRIVERS]]')) {
            let driverBlocks = [];
            
            Object.keys(motorMap).forEach(motorName => {
                const mIndex = motorMap[motorName];
                
                // STRICT Axis detection to prevent "extruder" from triggering "x" logic
                let axisKey = 'E';
                if (motorName.startsWith('stepper_x') || motorName.startsWith('stepper_y')) {
                    axisKey = 'XY';
                } else if (motorName.startsWith('stepper_z')) {
                    axisKey = 'Z';
                } else if (motorName.startsWith('extruder')) {
                    axisKey = 'E';
                }
                
                const driverId = flat[`DRIVER_${axisKey}`];
                const motorCurrent = flat[`CURRENT_${axisKey}`];
                
                if (driverId && globalData.drivers[driverId.toLowerCase()]) {
                    const dData = globalData.drivers[driverId.toLowerCase()];
                    let block = dData.config_template || '';
                    
                    // Replace variables in the driver template
                    block = block.replace(/\[\[MOTOR_NAME\]\]/g, motorName);
                    block = block.replace(/\[\[MOTOR_CURRENT\]\]/g, motorCurrent);
                    
                    // Assign the specific M-port number (e.g., [[M_CS_UART]] -> [[M1_CS_UART]])
                    block = block.replace(/\[\[M_/g, `[[M${mIndex}_`);
                    
                    driverBlocks.push(block);
                }
            });
            processedLines.push(driverBlocks.join('\n'));
            return;
        }
        
        // 2C: Contextual pin replacement inside Stepper blocks
        if (currentMotorIndex && line.includes('[[M_')) {
            processedLines.push(line.replace(/\[\[M_/g, `[[M${currentMotorIndex}_`));
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
        if (flat[key] !== undefined) {
            return flat[key];
        }
        return '# UNDEFINED'; // Fallback if missing
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
        ...globalData.boards[boardId].pins
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
