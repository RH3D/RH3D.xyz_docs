---
title: Printing parts
layout: default
parent: v1.2 - (advanced)
grand_parent: E3NG v1.2
has_children: false
nav_order: 30
description: "Print parts for your advanced E3NG v1.2 CoreXY build with expert slicing settings, material tips, calibration guides, and color customization advice."
permalink: /E3NG_v1_2/advanced/printing_parts
---
# PRINTING PARTS
{: .text-center }

Before we dive into downloading all the files and starting the prints, it's important to be as prepared as possible. Nobody enjoys reprinting parts after the printer is already assembled and running. You'll need to choose the right material, ensure your printer is properly calibrated, and have the correct setup for printing. This all takes some time and effort, but it will save you plenty during the build and when using the printer, so try not to cut corners here.

And one of the least important things - you, of course, need to choose your colour combination.

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
Is significantly more flexible which will reduce stiffness of the frame. It has lower temperature resistance so enclosing the printer will get risky as some of the parts will most likely warp. If you do so, try using bed insulation and print at least the toolhead parts from ABS. It helps if you only print lower temperature materials like PLA and PETG.

#### PLA
Can be used on an open frame printer but not with an enclosure as the parts will definitely warp. The toolhead and bed
carriage should still be printer with higher temperature resistant material.

---
# PRINTING PARAMETERS

All STL files are properly oriented for printing. Some parts include built-in supports, they are marked with ❌.

Depending on your configuration and print settings (brim, draft, purge line), you may need to print bigger parts that require up to 235x235 mm print area. Default print size for Ender 3 is 220x220 mm but you can set it to 235x235 mm in slicer without issues.

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

Before printing parts, it is highly recommended to print the calibration cube. It contains essential features that are related to the project parts like holes for 8mm rods, for LM8LUU bearing, M3 and M5 heat inserts and some other print features to view the print quality.

All the parts are designed with rather tight tolerances (.2mm), so depending on your print quality and precision, it might cause too tight fit mainly on linear rods/bearings. If this is your case, you should clear the holes idealy with a reamer. You can also use properly sized drill bit or even a piece of fine-grit sandpaper on a round stick. Just proceed slowly and carefully so you don’t enlarge the holes too much, the ideal situation is to hand press the parts in with no noticeable play.

[DOWNLOAD THE CALIBRATION CUBE.]{: .btn .fw-400 .text-yellow-300 .v-align-middle .pr-4 .pl-4 }

---
# PRINTING PARTS IN COLOR

If you need help with choosing the colors for your printer, have a look at the [COLOR SCHEME] tool!

To follow the main/recommended color scheme, see the file names where each is marked either with **[A]** (accent) or **[M]** (main) as a color marker. But this is your printer, be creative and make your own color combination and design.

If you are installing LED lights, there are also diffusers that need to be printed with clean/transparent filament. These are marked with **[C]** (clear).

continue to:
{: .text-right .lh-0 .pt-8 }

[FILES]{: .btn .fs-6 .fw-300 .text-yellow-300 }
{: .text-right }

[COLOR SCHEME]: https://rh3d.xyz/E3NG_v1_2/color_scheme
[DOWNLOAD THE CALIBRATION CUBE.]: https://www.printables.com/en/model/478403
[FILES]: https://rh3d.xyz/E3NG_v1_2/advanced/files
