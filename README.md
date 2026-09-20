# Syringe-tool

# Clinical Syringe Calibration Matrix (Virtual Lab Simulator)

An interactive, responsive 3D web-based simulation platform designed to teach medication measurement, scale calibration, and aseptic handling techniques in accordance with **Alberta Nursing Curriculum Standards** (Mount Royal University, University of Calgary, MacEwan University skills lab frameworks).

---

## 🚀 Key Features

* **3D Cylindrical Texturing:** Leverages multi-stop linear gradients to realistically render high-gloss transparent plastic barrels, ground glass textures, and cylindrical matte-black rubber stoppers.
* **True-Zone Interaction Hit-Testing:** Students **must strictly click and drag the outermost Thumb Rest disk** to adjust volumes. Clicking or dragging the inner sterile plunger shaft or barrel casing does nothing, reinforcing safety competencies.
* **Zero Line Lockout:** Mathematical coordinate tracking prevents the rubber piston from slipping past the inner front nozzle wall or sliding out the back of the syringe casing. When empty, the forward face edge reads an unyielding `0.00 mL`.
* **Brand-Perfect Scale Replications:** 
  * **01 mL Precision:** Fine 0.01 mL increments with bold decimal markers (`0.2`, `0.4`, up to `1ml`).
  * **03 mL Standard:** Features accurate fractional indicators (`½`, `1`, `1½`, etc.) and highlights the unique circling ring accent around the **② mL mark** matching the actual BD hardware.
  * **05 mL Capacity:** Built with a wider diameter cylinder template, macro division notches, and integer text settings.
* **Instant PNG Snapshot Export:** Features a `.toDataURL()` extraction mechanism. Clicking "Download PNG" instantly saves a pixel-perfect snapshot labeled with the exact measured dosage (e.g., `Syringe_3ml_Calibration_2.40mL.png`) for assignment grading.

---

## 📂 Project Architecture

The simulator is built entirely with clean, decoupled frontend web technologies. It is fully serverless and runs directly inside any modern browser without compiling steps:

📁 Syringe-Calibration-Workspace/
├── 📄 Syringe.html         # Core UI structure, anatomy index, and canvas grids
├── 📄 style.css            # 100% responsive grid overrides, card borders, & flex alignment 
├── 📄 syringeRenderer.js   # 3D HTML5 linear canvas drawing engine pipeline
└── 📄 script.js            # Unified data state calculations, math tracking, & constraints

---

## 📋 Aseptic Technique Standards (Alberta Lab Integration)

Instructors should direct students to study the integrated **Syringe Anatomy Reference Grid** at the top of the interface prior to interaction. 

### Sterile Areas (DO NOT TOUCH):
1. **Needle Core Shaft & Bevel Tip**
2. **Needle Hub / Tip Nozzle Core Joint Connector**
3. **Inner Plunger Shaft (Spine Bar)**
4. **Rubber Stopper Gasket Seal Layers**

### Touch-Safe Areas (Grip Points):
1. **Clear Outer Cylinder Barrel Casing**
2. **Rear Wing Finger Flanges Platforms**
3. **Outermost Plunger Thumb Rest Disc Plate**

---

## 🛠️ Setup & Local Deployment Guide

Because the code uses **JavaScript Module deferral tags** inside the HTML head, it completely bypasses traditional browser cross-file blocking rules when opened directly off local disk arrays.

### Local Deployment (Offline):
1. Download or move `Syringe.html`, `style.css`, `script.js`, and `syringeRenderer.js` into a shared workspace folder on your desktop.
2. Double-click `Syringe.html`. It will load instantly inside your default web browser (Chrome, Edge, Safari, Firefox).
