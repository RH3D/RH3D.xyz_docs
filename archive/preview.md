---
#title: E3NG preview
layout: default
#has_children: true
#nav_order: 4
permalink: /preview.html
---
# PREVIEW
{: .text-center }

díky za ty fíky

<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>

<model-viewer 
  src="/assets/docs/old/E3NG_BOM_240820.glb" 
  ar 
  camera-controls 
  touch-action="pan-y" 
  style="width: 100%; height: 500px; background-color: #27262b;"
  alt="3D model pro patrony">
</model-viewer>


<model-viewer src="/assets/docs/old/E3NG_BOM_240820.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  tone-mapping="neutral"
  poster="poster.webp"
  shadow-intensity="2"
  style="background-color:#2b2b2b;"
  environment-image="legacy">
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
    <button slot="ar-button" id="ar-button">
        View in your space
    </button>
    <div id="ar-prompt">
        <img src="https://modelviewer.dev/shared-assets/icons/hand.png">
    </div>
</model-viewer>

---
*Prosím, nesdílejte tento odkaz veřejně.*
