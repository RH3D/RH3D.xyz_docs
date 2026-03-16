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
  /* Kontejner pro model a tlačítko */
  .model-wrapper {
    position: relative;
    width: 100%;
    height: 640px; /* Tvoje původní výška */
    background-color: #27262b;
    border-radius: 4px;
    overflow: hidden;
  }

  model-viewer {
    width: 100%;
    height: 100%;
    --poster-color: transparent;
  }

  /* Nenápadné tlačítko pro Fullscreen */
.fs-toggle {
    position: absolute;
    top: 15px;         /* Přesunuto nahoru */
    right: 15px;        /* Zůstává vpravo */
    background: rgba(0, 0, 0, 0.5); /* Tmavší pozadí pro lepší čitelnost */
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-family: monospace;
    font-size: 11px;
    z-index: 100;
    transition: all 0.2s;
    backdrop-filter: blur(4px); /* Efekt rozmazaného skla za tlačítkem */
  }

.fs-toggle:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    border-color: #fff;
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
    src="/assets/docs/old/E3NG_BOM_240820.glb"
    ar
    ar-modes="webxr scene-viewer quick-look"
    camera-controls
    disable-tap
    tone-mapping="neutral"
    poster="poster.webp"
    shadow-intensity="2"
    environment-image="legacy"
    alt="E3NG BOM Preview">
    
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>

    <button class="fs-toggle" id="fs-button">FS_MODE_⛶</button>
  </model-viewer>
</div>

<script>
  const container = document.getElementById('main-container');
  const btn = document.getElementById('fs-button');

  btn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error: ${err.message}`);
      });
      btn.textContent = "EXIT_✕";
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
      btn.textContent = "FS_MODE_⛶";
    }
  });
</script>

---
*Pro zobrazení v plném rozlišení klikněte na FS_MODE.*
