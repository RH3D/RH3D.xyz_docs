---
#title: Cli-Kli
layout: default
has_toc: false
has_children: false
nav_order: 50
description: "Klipper config builder for your printer."
permalink: /cli-kli
---
# <span style="font-weight:800; font-size: 125%; font-style:italic;">CLI-KLI</span>
{: .text-center }

**Nothing to look for here**
{: .text-center }

{: .warning }
THIS TOOL IS A HEAVY WORK IN PROGRESS AND IS NOT MEANT TO BE USED BY ANYONE YET! CLICK AT YOUR OWN RISK!

<div id="rh3d-configurator">
<div class="config-section">
    <h2>1. Main Hardware</h2>
    <div class="grid-2-col" id="main-hardware-container"></div>
</div>

<div class="config-section" id="section-steppers" style="display: none;">
    <h2>2. Stepper Motors Configuration</h2>
    <div class="grid-3-col" id="steppers-current-container"></div>
    <div class="grid-3-col" id="steppers-driver-container" style="margin-top: 15px;"></div>
</div>

<div class="config-section" id="section-features" style="display: none;">
    <h2>3. Additional Features</h2>
    <div class="grid-3-col" id="dynamic-features-container"></div>
</div>

<div id="action-generate-container" class="action-bar">
    <button type="button" id="btn-generate" class="btn-primary" disabled>Generate Configuration</button>
</div>

<div id="action-results-container" class="action-bar" style="display: none;">
    <h3>Configuration Ready!</h3>
    <p class="result-info">Review the files or download them directly to your PC.</p>
    <div id="result-buttons-container" class="result-buttons"></div>
    </div>
</div>

<div id="code-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modal-title">preview.cfg</h3>
            <div class="modal-actions">
                <button type="button" id="btn-modal-copy" class="btn-secondary">Copy to Clipboard</button>
                <button type="button" id="btn-modal-close" class="btn-close">✖</button>
            </div>
        </div>
        <pre><code id="modal-code-body" class="language-klipper"></code></pre>
    </div>
</div>
