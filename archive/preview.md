---
#title: E3NG preview
layout: default
#has_children: true
#nav_order: 4
permalink: /temp_db_archive.html
---

{% include popup.html %}

# temp_0x771_db
{: .text-center }

<script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js"></script>

<a href="#" onclick="showPopup('popup1'); return false;">
  <span style="margin-right: 12px;">📦</span>
</a>
{: .text-center }

<div id="popup1" class="popup">
  <span class="close" onclick="hidePopup('popup1')">&times;</span>
  <model-viewer src="/assets/docs/old/E3NG_BOM_240820.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  auto-rotate
  disable-tap
  tone-mapping="neutral"
  poster="poster.webp"
  shadow-intensity="2"
  style="width: 100%; height: 720px; background-color: #27262b;"
  environment-image="legacy"
  alt="modek">
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
</model-viewer>
</div>

<model-viewer src="/assets/docs/old/E3NG_BOM_240820.glb"
  ar
  ar-modes="webxr scene-viewer quick-look"
  camera-controls
  disable-tap
  tone-mapping="neutral"
  poster="poster.webp"
  shadow-intensity="2"
  style="width: 100%; height: 640px; background-color: #27262b;"
  environment-image="legacy"
  alt="modek">
    <div class="progress-bar hide" slot="progress-bar">
        <div class="update-bar"></div>
    </div>
</model-viewer>

---
*You.*
