---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---
rev 0.29

*If you are lucky to find this page (not coming from Patreon), please keep it for yourself.*
{: .text-center }
*Thank you :)*
{: .text-center }
---
For full screen, click the FS_MODE_⛶ button.
{: .text-center }

<style>
  /* MODEL AND BUTTON CONTAINER */
  .model-wrapper {
    position: relative;
    width: 100%;
    height: 640px; /* CUSTOM HEIGHT ON PAGE */
    background-image: radial-gradient(circle at 50% 45%, #5f5f5a 0%, #27262b 60%);
    border-radius: 20px;
    overflow: hidden;
  }

  model-viewer {
    width: 100%;
    height: 100%;
    --poster-color: transparent;
  }

  /* COMMON BUTTON STYLE (Applies to both FS and Model buttons) */
  .fs-toggle, .model-btn {
    background: rgba(255, 255, 255, 0.1); /* BRIGHTER BACKGROUND */
    color: rgba(255, 255, 255, 0.8);      /* WHITE TEXT */
    border: 1px solid rgba(255, 255, 255, 0.3); /* THIN WHITE EDGE */
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 11px;
    z-index: 100;
    transition: all 0.2s;
    backdrop-filter: blur(2px); /* BG BLURR */
  }

  /* MOUSE HOVER STYLE CHANGE (Ignores disabled buttons) */
  .fs-toggle:hover, .model-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.9); /* BRIGHTEN BUTTON */
    color: #000;                          /* DARKEN TEXT */
    border-color: #fff;                   /* FULL WHITE EDGE LINE */
  }

  /* DISABLED (ACTIVE MODEL) STATE */
  .model-btn:disabled {
    opacity: 0.4;
    cursor: default;
    background: rgba(128, 128, 128, 0.1);
    color: rgba(255, 255, 255, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }

  /* SPECIFIC POSITIONING: FULLSCREEN BUTTON */
  .fs-toggle {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  /* SPECIFIC POSITIONING: MODEL CONTROLS */
  .model-controls {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    gap: 10px;
    z-index: 100;
  }

  /* Styl pro progress bar z tvého původního kódu */
  .progress-bar { display: block; width: 33%; height: 10%; max-height: 2%; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); border-radius: 25px; box-shadow: 0px 3px 10px 3px rgba(0, 0, 0, 0.5), 0px 0px 5px 1px rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); background-color: rgba(0, 0, 0, 0.5); }
  .update-bar { background-color: rgba(255, 255, 255, 0.9); width: 0%; height: 100%; border-radius: 25px; transition: width 0.3s; }
  .hide { display: none; }
</style>

<div class="model-wrapper" id="main-container">
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>

  <model-viewer 
    id="model-view"
    src="/assets/docs/old/E3NG_BOM_240820_tmp.xlsm"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    camera-orbit="-30deg auto auto"
    disable-tap
    tone-mapping="aces"
    shadow-intensity="2"
    exposure="1.5"
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr"
    alt="E3NG BOM Preview">

  <div class="model-controls">
    <button class="model-btn" id="btn-head" value="/assets/docs/old/E3NG_BOM_240820_tmp.xlsm" disabled>Head</button>
    <button class="model-btn" id="btn-monkey" value="/assets/docs/old/E3NG_BOM_240820_temp.xlsm">Monkey</button>
  </div>
    
  <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
  </div>

  <button class="fs-toggle" id="fs-button">FS_MODE_⛶</button>
  </model-viewer>
</div>

<script>
  const modelViewer = document.querySelector('#model-view');
  const container = document.getElementById('main-container');
  const btnFs = document.getElementById('fs-button');
  const btnHead = document.getElementById('btn-head');
  const btnMonkey = document.getElementById('btn-monkey');

  // Function to switch model and toggle disabled states
  function switchModel(newSrc, activeBtn, inactiveBtn) {
    modelViewer.src = newSrc;
    activeBtn.disabled = true;
    inactiveBtn.disabled = false;
  }

  // Event Listeners for Model Buttons
  btnHead.addEventListener('click', () => {
    switchModel(btnHead.value, btnHead, btnMonkey);
  });

  btnMonkey.addEventListener('click', () => {
    switchModel(btnMonkey.value, btnMonkey, btnHead);
  });
  
  // Fullscreen Logic
  btnFs.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error: ${err.message}`);
      });
      btnFs.textContent = "EXIT_✕";
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      btnFs.textContent = "FS_MODE_⛶";
    }
  });
</script>
