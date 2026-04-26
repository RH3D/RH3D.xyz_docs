---
title: Printing parts
layout: default
parent: Printer build
grand_parent: VIRTU E3
has_children: false
nav_order: 20
description: "Prepare to print Virtu parts with material tips, slicing settings, calibration advice, and color guides. Achieve strong and precise CoreXY prints from the start."
permalink: /virtu/build/printing_parts
---

{: .warning }
**THE SITE IS UNDER CONSTRUCTION**
{: .text-center }

# PRINTING PARTS
{: .text-center }

Before you start your first print, remember: you are building a high-speed machine. Cutting corners on part quality will directly limit how fast and precise your Virtu can be. Don't rush this stage.

Nobody enjoys reprinting parts after the printer is already assembled. To reach the performance targets of Virtu, you need to ensure your current printer is properly calibrated for dimensional accuracy and that you are using the right materials.

---
# MATERIAL SELECTION

#### ABS / ASA (Highly Recommended)
This is the only choice for a full-spec Virtu. These materials provide the necessary heat resistance and structural stiffness to handle high accelerations and enclosed environments.

ASA is preferred for its lower warping tendency and better UV resistance.

Functional Parts: All toolhead (V-ION), XY towers, and Z-axis components must be printed in ABS/ASA.

#### PETG / PLA
Use with caution. PETG is too flexible for a high-performance frame and will reduce the resonance frequency of your printer (leading to more ghosting). PLA is stiff but will warp immediately if you ever decide to enclose the printer. If you must use these, keep the printer open-frame and use them only for non-structural cosmetic parts.

---
# PRINTING PARAMETERS

All STL files are oriented in the optimal direction for strength and precision. Some parts include built-in supports (marked with ❌ in the filename)—do not add slicer supports to these.

#### RECOMMENDED SETTINGS:
<ul>
<li>Perimeters: 4 (Minimum)</li>
<li>Top/Bottom Layers: 5</li>
<li>Infill: 30% - 40%</li>
<li>Infill Type: Gyroid or Cubic (Avoid Grid/Honeycomb due to nozzle crossing)</li>
<li>Layer Height: 0.2 mm</li>
<li>Layer Width: 0.4 mm - 0.45 mm</li>
<li>Supports: None (unless explicitly mentioned)</li>
</ul>

---
# CALIBRATION & TOLERANCES

For every DIY 3D printer with 3D printed parts, it is crucial to have your parts with proper dimensionaly accuracy. To achieve that, you need to calibrate your printer for the material you will use and compensate for skew and shrinkage properly before printing your parts.

Before printing parts, it is highly recommended to print the calibration cube. It contains essential features that are related to the project parts like holes for 8mm rods, for LM8LUU bearing, M3 and M5 heat inserts and some other print features to view the print quality.

All the parts are designed with rather tight tolerances (.2mm), so depending on your print quality and precision, it might cause too tight fit mainly on linear rods/bearings. If this is your case, you should clear the holes idealy with a reamer. You can also use properly sized drill bit or even a piece of fine-grit sandpaper on a round stick. Just proceed slowly and carefully so you don’t enlarge the holes too much, the ideal situation is to hand press the parts in with no noticeable play.

[DOWNLOAD THE CALIBRATION CUBE.]{: .btn .fw-400 .text-yellow-300 .v-align-middle .pr-4 .pl-4 }

---
# COLOR SCHEME
To help you organize your build, the files are categorized by their role in the design:

[M] Main Color: The primary color for your frame and large components.

[A] Accent Color: For the toolhead accents, logos, and highlights.

[C] Clear: For LED diffusers (print in transparent PETG or PC).

Take a look at the [COLOR SCHEME] tool to visualize your build before you commit your filament!

continue to:
{: .text-right .lh-0 .pt-8 }

[FILES]{: .btn .fs-6 .fw-300 .text-yellow-300 }
{: .text-right }

[COLOR SCHEME]: https://rh3d.xyz/E3NG_v1_2/color_scheme
[DOWNLOAD THE CALIBRATION CUBE.]: https://www.printables.com/en/model/478403
[FILES]: https://rh3d.xyz/virtu/build/files
