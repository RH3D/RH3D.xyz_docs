---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---

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
  }

  /* MATCHING YOUR FS_MODE STYLE */
  .fs-toggle, .model-btn {
    position: absolute;
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

  .fs-toggle { top: 15px; right: 15px; }

  /* CONTAINER FOR THE TWO BUTTONS */
  #controls {
    position: absolute;
    top: 15px;
    left: 15px;
    display: flex;
    gap: 8px;
    z-index: 100;
  }

  /* HOVER STYLE */
  .fs-toggle:hover, .model-btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.9);
    color: #000;
    border-color: #fff;
  }

  /* GREYED OUT / ACTIVE STATE */
  .model-btn:disabled {
    background: rgba(0, 0, 0, 0.4);
    color: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
    cursor: default;
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
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr">

    <div id="controls">
      <button class="model-btn" id="btn-1" value="/assets/docs/old/E3NG_BOM_240820_tmp.xlsm" disabled>HEAD</button>
      <button class="model-btn" id="btn-2" value="/assets/docs/old/E3NG_BOM_240820_temp.xlsm">MONKEY</button>
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
  const fsBtn = document.getElementById('fs-button');
  const b1 = document.getElementById('btn-1');
  const b2 = document.getElementById('btn-2');

  // Simple function that works exactly like your dropdown did
  function changeModel(clicked, other) {
    modelViewer.src = clicked.value;
    clicked.disabled = true;
    other.disabled = false;
  }

  b1.onclick = () => changeModel(b1, b2);
  b2.onclick = () => changeModel(b2, b1);

  // Fullscreen logic
  fsBtn.onclick = () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen();
      fsBtn.textContent = "EXIT_✕";
    } else {
      document.exitFullscreen();
    }
  };

  document.onfullscreenchange = () => {
    if (!document.fullscreenElement) fsBtn.textContent = "FS_MODE_⛶";
  };
</script>
