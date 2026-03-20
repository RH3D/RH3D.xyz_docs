---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---
rev 0.26

*If you are lucky to find this page (not coming from Patreon), please keep it for yourself.*
{: .text-center }
*Thank you :)*
{: .text-center }
---
For full screen, click the FS_MODE_⛶ button.
{: .text-center }

<style>
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

  .fs-toggle { position: absolute; top: 15px; right: 15px; }
  #controls { position: absolute; top: 15px; left: 15px; z-index: 100; display: flex; gap: 10px; }

  .fs-toggle:hover, .model-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    border-color: #fff;
  }

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
    camera-controls
    camera-orbit="-30deg auto auto"
    tone-mapping="aces"
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr">

    <div id="controls">
      <button class="model-btn" id="btn-head" onclick="loadModel('head')" disabled>HEAD_MOD</button>
      <button class="model-btn" id="btn-monkey" onclick="loadModel('monkey')">MONKEY_MOD</button>
    </div>
    
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>

    <button class="fs-toggle" id="fs-button" onclick="toggleFS()">FS_MODE_⛶</button>
  </model-viewer>
</div>

<script>
  // Move logic outside of any wrappers so they are globally accessible
  const viewer = document.getElementById('model-view');
  const bHead = document.getElementById('btn-head');
  const bMonkey = document.getElementById('btn-monkey');
  const fsBtn = document.getElementById('fs-button');

  function loadModel(type) {
    if (type === 'head') {
      viewer.src = "/assets/docs/old/E3NG_BOM_240820_tmp.xlsm";
      bHead.disabled = true;
      bMonkey.disabled = false;
    } else {
      viewer.src = "/assets/docs/old/E3NG_BOM_240820_temp.xlsm";
      bMonkey.disabled = true;
      bHead.disabled = false;
    }
  }

  function toggleFS() {
    const container = document.getElementById('main-container');
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      fsBtn.textContent = "EXIT_✕";
    } else {
      document.exitFullscreen();
      fsBtn.textContent = "FS_MODE_⛶";
    }
  }

  // Handle the ESC key or browser Exit FS button
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      fsBtn.textContent = "FS_MODE_⛶";
    }
  });
</script>
