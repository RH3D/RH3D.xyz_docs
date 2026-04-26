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

Before we dive into downloading all the files and starting to print, it is important to be as prepared as possible. Nobody enjoys reprinting parts after the printer is already assembled and running. You'll need to choose the right material, ensure your printer is properly calibrated, and have the correct setup for printing. This all takes some time and effort, but it will save you plenty during the build and when using the printer. Try not to cut corners here and follow read the following.

---
# MATERIAL SELECTION

#### ABS/ASA
The most recommended and best choice material for printing parts. It has great properties to withstand increased temperatures, repeated stress and continuous pressure.
<details>
    <summary><h4 style="display:inline-block;margin-left:1.5em;margin-top:0.4em;color:#0096FF"> ABS PRINTING TIPS </h4></summary>
<ol style="margin-left:2em;font-size:14px">
<li>Use enclosure! - the best and the most effective step, even if you use some temporary solution to help eliminating drafts and increasing the ambient air temperature.</li>
<li>Use draft shield - without enclosure, draft shield will help to separate the cold air from the part itself. Draft shield may help even in enclosure when the air temperature is not high enough.</li>
<li>Clean the build plate - no alcohol wiping, use warm water with a dish soap and rub the build plate thoroughly. Wash it well too. Using rough side of the sponge helps.</li>
<li>Clamp your build plate - for magnetic flexible build plates. Your magnet may not be as strong as it used to be and bigger parts can lift the plate corners. Clamp the edges/corners of the build plate to the bed.</li>
<li>Use brim or mouse ears for better adhesion to the build plate.</li>
<li>Less is more - play with the print settings, you may need to decrease the fan speed and print speed.</li>
<li>More is more - try increasing the hotend temperature to properly melt the filament. Try increasing the bed temperature for better sticking parts and hotter environment for the print.</li>
<li>Use ABS+, ASA or a different brand - some filaments are more prone to warping, ASA overall tends to warp less. Do your research or testing to find better filament for you that could warp less.</li>
<li>Use adhesive - if your parts still don't stick to the surface, use some kind of bed adhesive suitable for ABS.</li>
<li>Avoid printing big parts, build the upgraded frame version with 2040 aluminium extrusions, build the "stock E3" or metal bed carriage.</li>
</ol>
</details>

#### PETG
Is significantly more flexible and has lower temperature resistance so enclosing the printer will get risky as some of the parts will most likely warp. If you do so, try using bed insulation and print at least the toolhead parts from ABS. It also helps if you only print lower temperature materials like PLA and PETG.

#### PLA
Can be used on an open frame printer but not with an enclosure as the parts will definitely warp. The toolhead and bed carriage still need to be printer with higher temperature resistant material.

---
# PRINTING PARAMETERS

All STL files are prepared for direct import-and-slice, they are properly oriented, there are built-in supports where needed and some have notes embeded - follow if needed.

#### RECOMMENDED PRINT SETTINGS:
<ul>
<li>4 perimeters</li>
<li>5 top and bottom layers</li>
<li>30% infill</li>
<li>infill type: cubic, gyroid, grid, honeycomb, 3D honeycomb, triangles, stars</li>
<li>0.2 mm layer height</li>
<li>0.4 - 0.5 mm layer width</li>
<li>Arachne slicing mode</li>
<li>No supports</li>
</ul>

---
# CALIBRATION PRINT AND TOLERANCES

Even though the base of Virtu is the all-metal frame, which gives you the precision needed, it is still crucial to use dimensionally accurate 3D printed parts to experience a smooth build process with a great result. To achieve it, you need to calibrate your printer for the material used and compensate for skew and shrinkage properly before printing your parts.

For proper calibration, there are more steps involved:
1) General printer calibration - [ELLIS' PRINT TUNING GUIDE](https://ellis3dp.com/Print-Tuning-Guide/)
2) Skew and shrinkage calibration - [CALISTAR](https://github.com/dirtdigger/fleur_de_cali) / [CALIFLOWER](https://vector3d.shop/products/califlower-calibration-tool-mk2) / [CALILANTERN](https://vector3d.shop/products/calilantern-calibration)

---
# PRINTING PARTS IN COLOR

STL file names will give you the color code to follow the default color scheme.
 - **Filename_[M...]** = **Main color** - the primary color for structural and larger components
 - **Filename_[A...]** = **Accent color** - smaller details to give your printer cubtle color accent
 - **Filename_[X...]** = Part will not stay on the printer, color is not important (temporary parts or build helpers)
But this is your printer, be creative and make your own color combination and design as you like it.

continue to:
{: .text-right .lh-0 .pt-8 }

[FILES]{: .btn .fs-6 .fw-300 .text-yellow-300 }
{: .text-right }

[COLOR SCHEME]: https://rh3d.xyz/E3NG_v1_2/color_scheme
[DOWNLOAD THE CALIBRATION CUBE.]: https://www.printables.com/en/model/478403
[FILES]: https://rh3d.xyz/virtu/build/files
