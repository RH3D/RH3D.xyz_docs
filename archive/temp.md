---
title: V-E3prv
layout: default
nav_exclude: true
search_exclude: true
permalink: /PT2603prv.html
---
{: .warning }
*If you are lucky to find this page (not coming from Patreon), please keep it for yourself.*

*Thank you :)*
{: .text-right }

<style>
  .model-wrapper {
    position: relative;
    width: 100%;
    height: 640px; 
    background-image: radial-gradient(circle at 50% 45%, #4f4f4a 0%, #27262b 60%);
    border-radius: 20px;
    overflow: hidden;
  }

  model-viewer {
    width: 100%;
    height: 100%;
    --poster-color: transparent;
  }

  /* BUTTON STYLING */
  .fs-toggle, #src {
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
    appearance: none; 
    -webkit-appearance: none;
    outline: none;
  }

  .fs-toggle:hover, #src:hover {
    background: rgba(255, 255, 255, 0.9); 
    color: #000;                          
    border-color: #fff;                   
  }

  /* POSITIONS */
  .fs-toggle {
    top: 15px;
    right: 15px;
  }

  #src {
    top: 15px;
    left: 15px;
  }

  #src option {
    background: #27262b;
    color: #fff;
  }

  .progress-bar {
    display: none;
    width: 33%;
    height: 12px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    border-radius: 25px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2000;
  }
  
  .update-bar {
    background-color: rgba(255, 255, 255, 0.9);
    width: 0%;
    height: 100%;
    border-radius: 25px;
    transition: width 0.3s;
  }
  
  .progress-bar.hide {
    display: none;
  }
</style>

<div class="model-wrapper" id="main-container">
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>

  <model-viewer 
    id="model-view"
    src="/assets/docs/old/E3NG_BOM_240820.xlsm"
    ar
    camera-controls
    camera-orbit="-30deg auto auto"
    tone-mapping="aces"
    shadow-intensity="2"
    exposure="1.5"
    environment-image="/assets/images/HDR/brown_photostudio_06_1k.hdr">

   <select id="src" onchange="document.getElementById('model-view').src = this.value">
      <option value="/assets/docs/old/E3NG_BOM_240820.xlsm">MODEL: VIRTU E3</option>
      <option value="/assets/docs/old/E3NG_BOM_240820_tmp.xlsm">MODEL: V-ION</option>
   </select>

   <button class="fs-toggle" id="fs-button">FULLSCREEN</button>

   <div class="progress-bar" slot="progress-bar">
        <div class="update-bar"></div>
   </div>

  </model-viewer>
</div>

<script>
  const mv = document.getElementById('model-view');
  const container = document.getElementById('main-container');
  const btn = document.getElementById('fs-button');

// 1. IMPROVED MODEL SELECTION (Resets bar immediately)
srcSelect.addEventListener('change', (e) => {
  const progressBar = document.querySelector('.progress-bar');
  const updatingBar = document.querySelector('.update-bar');
  
  // Reset the bar to 0% and show it immediately before the model even starts asking for the file
  updatingBar.style.width = '0%';
  progressBar.style.display = 'block';
  
  mv.src = e.target.value;
});

// 2. REFINED PROGRESS LOGIC
const onProgress = (event) => {
  const progressBar = event.target.querySelector('.progress-bar');
  const updatingBar = event.target.querySelector('.update-bar');
  const progress = event.detail.totalProgress;

  // Update the width based on actual progress
  updatingBar.style.width = `${progress * 100}%`;

  // Only hide when TRULY finished (1.0)
  if (progress === 1) {
    setTimeout(() => {
      progressBar.style.display = 'none';
    }, 300); // Slightly faster exit for better feel
  } else if (progress > 0 && progressBar.style.display === 'none') {
    // Safety: If the bar was hidden but progress is happening, show it
    progressBar.style.display = 'block';
  }
};

mv.addEventListener('progress', onProgress);

// 3. THE "FIRST LOAD" FIX
// This ensures that on page refresh, the bar doesn't act glitchy
window.addEventListener('load', () => {
  const progressBar = document.querySelector('.progress-bar');
  const updatingBar = document.querySelector('.update-bar');
  if (mv.loaded) {
     progressBar.style.display = 'none';
  } else {
     progressBar.style.display = 'block';
     updatingBar.style.width = '0%';
  }
});
  
  
  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        alert("Fullscreen failed: Use a direct click.");
      });
      btn.textContent = "EXIT_✕";
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      btn.textContent = "FULLSCREEN";
    }
  });
</script>

*page rev 0.61*
