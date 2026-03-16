---
title: temp_0x771_db
layout: default
nav_exclude: true
search_exclude: true
permalink: /temp_db_archive.html
---

# temp_0x771_db
{: .text-center }

<style>
  /* Kontejner, který je v základu neviditelný */
  #main-container {
    display: none; 
    width: 100%;
    height: 640px;
    background-color: #27262b;
  }

  /* Styl pro "falešný" zaváděcí prvek (vypadá jako systémová chyba nebo log) */
  .placeholder-box {
    border: 1px dashed #444;
    padding: 40px;
    text-align: center;
    color: #666;
    font-family: monospace;
    cursor: pointer;
    transition: all 0.3s;
  }

  .placeholder-box:hover {
    color: #aaa;
    border-color: #888;
    background: rgba(255,255,255,0.02);
  }

  /* Fullscreen tlačítko (stejné jako předtím) */
  .fs-toggle {
    position: absolute;
    top: 15px;
    right: 15px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    z-index: 100;
  }
</style>

<div class="placeholder-box" id="trigger-box">
  [ RUN_DATA_STREAM_0x771 ]
  <br><small style="font-size: 10px;">Click to initialize secure preview...</small>
</div>

<div id="main-container">
  <script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>

  <model-viewer 
    id="model-view"
    src="/assets/docs/old/E3NG_BOM_240820.glb"
    ar
    camera-controls
    tone-mapping="neutral"
    shadow-intensity="2"
    environment-image="legacy"
    style="width: 100%; height: 100%;">
    
    <button class="fs-toggle" id="fs-button">EXIT_STREAM_✕</button>
  </model-viewer>
</div>

<script>
  const container = document.getElementById('main-container');
  const trigger = document.getElementById('trigger-box');
  const btn = document.getElementById('fs-button');

  // Funkce pro spuštění
  const launchModel = () => {
    container.style.display = 'block'; // Zobrazíme kontejner
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    }
  };

  trigger.addEventListener('click', launchModel);

  // Když uživatel vyskočí z fullscreenu, model zase schováme
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      container.style.display = 'none';
      trigger.style.display = 'block';
    } else {
      trigger.style.display = 'none';
    }
  });

  // Tlačítko uvnitř pro ukončení
  btn.addEventListener('click', () => {
    document.exitFullscreen();
  });
</script>
