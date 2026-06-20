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

**Nothing to see here :)**
{: .text-center }

{: .warning }
HI! THIS TOOL IS A HEAVY WORK IN PROGRESS AND IT MAY CONTAIN FATAL ISSUES, IT IS NOT MEANT TO BE USED BY ANYONE YET! CLICK AND USE AT YOUR OWN RISK!

<div id="rh3d-configurator">
    <div class="config-section">
        <h3>MAIN HARDWARE</h3>
        <div class="section-content">
            <div class="grid-2-col" id="main-hardware-container">
                </div>
        </div>
    </div>

<div class="config-section" id="section-steppers" style="display: none;">
        <h3>STEPPER MOTORS CONFIGURATION</h3>
        <div class="section-content">
            <div class="grid-3-col" id="steppers-current-container"></div>
            <div class="grid-3-col" id="steppers-driver-container" style="margin-top: 15px;"></div>
        </div>
    </div>

<div class="config-section" id="section-features" style="display: none;">
        <h3>ADDITIONAL FEATURES</h3>
        <div class="section-content">
            <div class="grid-3-col" id="dynamic-features-container"></div>
        </div>
    </div>

<div id="action-generate-container" class="action-bar">
        <h3>Compile Klipper Configuration</h3>
        <div class="section-content">
            <button type="button" id="btn-generate" class="rh-btn-primary" disabled>GENERATE KLIPPER .CFG FILES</button>
        </div>
    </div>

<div id="action-results-container" class="action-bar" style="display: none;">
        <h3>Configuration Ready!</h3>
        <div class="section-content">
            <p class="result-info">Review the files or download them directly to your PC.</p>
            <div id="result-buttons-container" class="result-buttons">
                </div>
        </div>
    </div>
</div>

<div id="code-modal" class="modal-overlay" style="display: none;">
    <div class="modal-content">
        <div class="modal-header">
            <h3 id="modal-title">preview.cfg</h3>
            <div class="modal-actions">
                <button type="button" id="btn-modal-copy" class="rh-btn-secondary">Copy to Clipboard</button>
                <button type="button" id="btn-modal-close" class="btn-close">
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
        </div>
        <pre><code id="modal-code-body" class="language-klipper"></code></pre>
    </div>
</div>
<script src="/pages/KLIPPER/app.js" defer></script>
