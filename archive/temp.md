---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---
rev 0.39

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

  /* STYLING BOTH ELEMENTS */
  .ui-element {
    position: absolute;
    top: 15px;
    z-index: 999; /* High priority */
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1); 
    color: rgba(255, 255, 255, 0.8);      
    border: 1px solid rgba(255, 255, 255, 0.3); 
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 11px;
    backdrop-filter: blur(2px);
    transition: all 0.2s;
    appearance: none; 
    -webkit-appearance: none;
    outline: none;
    pointer-events: auto; /* Ensure clicks register */
  }

  .ui-element:hover {
    background: rgba(255, 255, 255, 0.9); 
    color: #000;                          
    border-color: #fff;                   
  }

  #src { left: 15px; }
  #fs-button { right: 15px; }

  #src option {
    background: #27262b;
    color: #fff;
  }

  .progress-bar { display: block; width: 33%; height: 2%; position: absolute; left: 50%; top: 50%; transform: translate3d(-50%, -50%, 0); border-radius: 25px; box-shadow: 0px 3px 10px 3px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); background-color: rgba(0,0,0,0.5); }
  .update-bar { background-color: rgba(255,255,255,0.9); width: 0%; height: 100%; border-radius: 25px; transition: width 0.3s; }
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
    shadow-intensity="2"
    exposure="1.5"
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr">

    <select id="src" class="ui-element" onchange="document.getElementById('model-view').src = this.value">
      <option value="/assets/docs/old/E3NG_BOM_240820_tmp.xlsm">MODEL: HEAD</option>
      <option value="/assets/docs/old/E3NG_BOM_240820_temp.xlsm">MODEL: MONKEY</option>
    </select>

    <button id="fs-button" class="ui-element">FS_MODE_⛶</button>
    
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>

  </model-viewer>
</div>

<script>
  const mv = document.getElementById('model-view');
  const container = document.getElementById('main-container');
  const btn = document.getElementById('fs-button');

  // Direct onclick for the Fullscreen button
  btn.onclick = function() {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.log("FS Error: " + err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // State sync for button text
  document.onfullscreenchange = function() {
    if (document.fullscreenElement) {
      btn.textContent = "EXIT_✕";
    } else {
      btn.textContent = "FS_MODE_⛶";
    }
  };
</script>
