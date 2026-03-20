---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---

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
    height: 640px; 
    background-image: radial-gradient(circle at 50% 45%, #5f5f5a 0%, #27262b 60%);
    border-radius: 20px;
    overflow: hidden;
  }

  model-viewer {
    width: 100%;
    height: 100%;
    --poster-color: transparent;
  }

  /* BUTTON STYLES */
  .fs-toggle, .model-btn {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 11px;
    z-index: 100;
    transition: all 0.2s;
    backdrop-filter: blur(2px);
  }

  .fs-toggle {
    position: absolute;
    top: 15px;
    right: 15px;
  }

  #controls {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 100;
    display: flex;
    gap: 10px;
  }

  .fs-toggle:hover, .model-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    border-color: #fff;
  }

  /* ACTIVE/DISABLED STATE */
  .model-btn:disabled {
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
    cursor: default;
    pointer-events: none;
  }

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
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr">

    <div id="controls">
      <button class="model-btn" id="btn-head" disabled>HEAD_MOD</button>
      <button class="model-btn" id="btn-monkey">MONKEY_MOD</button>
    </div>
    
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>

    <button class="fs-toggle" id="fs-button">FS_MODE_⛶</button>
  </model-viewer>
</div>

<script>
  // Ensure script runs after elements are created
  window.onload = () => {
    const modelViewer = document.getElementById('model-view');
    const container = document.getElementById('main-container');
    const fsBtn = document.getElementById('fs-button');
    const btnHead = document.getElementById('btn-head');
    const btnMonkey = document.getElementById('btn-monkey');

    // Define the paths here so it's easy to change
    const pathHead = "/assets/docs/old/E3NG_BOM_240820_tmp.xlsm";
    const pathMonkey = "/assets/docs/old/E3NG_BOM_240820_temp.xlsm";

    // Switch to Head
    btnHead.onclick = () => {
      modelViewer.src = pathHead;
      btnHead.disabled = true;
      btnMonkey.disabled = false;
    };

    // Switch to Monkey
    btnMonkey.onclick = () => {
      modelViewer.src = pathMonkey;
      btnMonkey.disabled = true;
      btnHead.disabled = false;
    };
    
    // Fullscreen Logic
    fsBtn.onclick = () => {
      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error(`Error: ${err.message}`);
        });
        fsBtn.textContent = "EXIT_✕";
      } else {
        document.exitFullscreen();
      }
    };

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        fsBtn.textContent = "FS_MODE_⛶";
      }
    });
  };
</script>
