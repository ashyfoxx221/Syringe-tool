class SyringeRenderer {
    static draw(instance) {
        const ctx = instance.ctx;
        
        // FIXED SYNCHRONIZATION MARGIN: pX now represents the absolute FORWARD (LEFT) edge of the rubber stopper
        const frontStopperEdgeX = instance.getPlungerPixelPosition(); 
        const pX = frontStopperEdgeX + instance.stopperWidthPx; // Back edge of the rubber stopper
        
        const midY = instance.barrelTopPx + (instance.barrelHeightPx / 2);
        const bWidth = instance.barrelEndPx - instance.barrelStartPx;
        
        ctx.clearRect(0, 0, instance.canvas.width, instance.canvas.height);
        
        // 1. DYNAMIC 3D FLUID LIQUID INJECTION CHAMBER
        if (instance.currentVolume > 0) {
            let liquidGrad = ctx.createLinearGradient(0, instance.barrelTopPx, 0, instance.barrelTopPx + instance.barrelHeightPx);
            liquidGrad.addColorStop(0.0, instance.liquidColor.replace('0.35', '0.55')); 
            liquidGrad.addColorStop(0.25, instance.liquidColor.replace('0.35', '0.20')); 
            liquidGrad.addColorStop(0.65, instance.liquidColor.replace('0.35', '0.45')); 
            liquidGrad.addColorStop(1.0, instance.liquidColor.replace('0.35', '0.65')); 
            ctx.fillStyle = liquidGrad;
            ctx.fillRect(instance.barrelStartPx, instance.barrelTopPx + 2, frontStopperEdgeX - instance.barrelStartPx, instance.barrelHeightPx - 4);
        }

        // 2. BRAND-SPECIFIC SCALE GRADUATIONS & NUMBERS
        ctx.fillStyle = "#1a202c";
        ctx.strokeStyle = "rgba(45, 55, 72, 0.75)";
        ctx.lineWidth = 1;
        ctx.textAlign = "center";

        if (instance.syringeType === '1ml') {
            // 1 mL Syringe: 0.1 to 1.0 Increments
            ctx.font = "bold 9px sans-serif";
            for (let i = 0; i <= 10; i++) {
                let tickX = instance.barrelStartPx + (i / 10) * bWidth;
                ctx.beginPath();
                ctx.moveTo(tickX, instance.barrelTopPx);
                ctx.lineTo(tickX, instance.barrelTopPx + (i % 2 === 0 ? 11 : 6));
                ctx.stroke();
                
                if (i > 0 && i % 2 === 0) {
                    let label = i === 10 ? "1ml" : `0.${i}`;
                    ctx.fillText(label, tickX, instance.barrelTopPx + 22);
                }
            }
        } else if (instance.syringeType === '3ml') {
            // 3 mL Syringe: Fractions (½, 1, 1½, 2, 2½, 3ml) with Circling around 2
            ctx.font = "bold 10px sans-serif";
            const labels3ml = ["", "½", "1", "1½", "2", "2½", "3ml"];
            for (let i = 0; i <= 6; i++) {
                let tickX = instance.barrelStartPx + (i / 6) * bWidth;
                ctx.beginPath();
                ctx.moveTo(tickX, instance.barrelTopPx);
                ctx.lineTo(tickX, instance.barrelTopPx + (i % 2 === 0 ? 12 : 7));
                ctx.stroke();
                
                if (i > 0) {
                    if (i === 4) { // Highlight/Circle the ② mL mark exactly like the brand style
                        ctx.strokeStyle = "#1a202c"; ctx.lineWidth = 1.5;
                        ctx.beginPath(); ctx.arc(tickX, instance.barrelTopPx + 20, 7, 0, Math.PI * 2); ctx.stroke();
                        ctx.fillText("2", tickX, instance.barrelTopPx + 23);
                        ctx.strokeStyle = "rgba(45, 55, 72, 0.75)"; ctx.lineWidth = 1;
                    } else {
                        ctx.fillText(labels3ml[i], tickX, instance.barrelTopPx + 23);
                    }
                }
            }
        } else if (instance.syringeType === '5ml') {
            // 5 mL Syringe: 1 to 5 Integers with micro divisions
            ctx.font = "bold 10px sans-serif";
            for (let i = 0; i <= 5; i++) {
                let majorTickX = instance.barrelStartPx + (i / 5) * bWidth;
                ctx.beginPath(); ctx.moveTo(majorTickX, instance.barrelTopPx); ctx.lineTo(majorTickX, instance.barrelTopPx + 12); ctx.stroke();
                
                if (i > 0) {
                    ctx.fillText(i === 5 ? "5ml" : i, majorTickX, instance.barrelTopPx + 23);
                }
                
                if (i < 5) { // Intermediary micro lines
                    for (let j = 1; j < 5; j++) {
                        let subTickX = majorTickX + (j / 5) * (bWidth / 5);
                        ctx.beginPath(); ctx.moveTo(subTickX, instance.barrelTopPx); ctx.lineTo(subTickX, instance.barrelTopPx + 5); ctx.stroke();
                    }
                }
            }
        }

        // 3. BRAND REAR THREAD CAPS NOZZLES
        let capGrad = ctx.createLinearGradient(0, midY - 12, 0, midY + 12);
        capGrad.addColorStop(0, "#cbd5e0"); capGrad.addColorStop(0.3, "#ffffff"); capGrad.addColorStop(1, "#94a3b8");
        ctx.fillStyle = capGrad; ctx.strokeStyle = "#1a202c"; ctx.lineWidth = 2;
        ctx.fillRect(instance.barrelStartPx - 24, midY - 10, 24, 20);
        ctx.strokeRect(instance.barrelStartPx - 24, midY - 10, 24, 20);
        
        // Ridged lock profiles caps details
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(instance.barrelStartPx - 24, midY - 13, 6, 26);
        ctx.strokeRect(instance.barrelStartPx - 24, midY - 13, 6, 26);

        // 4. 3D ROUNDED PLUNGER SHAFT CORE
        let rHeight = Math.max(6, instance.barrelHeightPx * 0.35);
        let shaftGrad = ctx.createLinearGradient(0, midY - (rHeight / 2), 0, midY + (rHeight / 2));
        shaftGrad.addColorStop(0.0, "#718096"); shaftGrad.addColorStop(0.25, "#ffffff"); shaftGrad.addColorStop(0.6, "rgba(241, 245, 249, 0.8)"); shaftGrad.addColorStop(1.0, "#2d3748");
        ctx.fillStyle = shaftGrad; ctx.strokeStyle = "#4a5568"; ctx.lineWidth = 1;
        ctx.fillRect(pX, midY - (rHeight / 2), instance.plungerLengthPx, rHeight);
        ctx.strokeRect(pX, midY - (rHeight / 2), instance.plungerLengthPx, rHeight);

        // 5. CYLINDRICAL FLAT-TOP BLACK RUBBER STOPPER (Correctly rendered using matched coordinates)
        let rubberGrad = ctx.createLinearGradient(0, instance.barrelTopPx + 2, 0, instance.barrelTopPx + instance.barrelHeightPx - 2);
        rubberGrad.addColorStop(0.0, "#000000"); rubberGrad.addColorStop(0.2, "#4a5568"); rubberGrad.addColorStop(0.5, "#1a202c"); rubberGrad.addColorStop(1.0, "#000000");
        ctx.fillStyle = rubberGrad; ctx.strokeStyle = "#000000"; ctx.lineWidth = 1.5;
        ctx.fillRect(frontStopperEdgeX, instance.barrelTopPx + 2, instance.stopperWidthPx, instance.barrelHeightPx - 4);
        ctx.strokeRect(frontStopperEdgeX, instance.barrelTopPx + 2, instance.stopperWidthPx, instance.barrelHeightPx - 4);

        // Intrabarrel seal rings tracks details
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)"; ctx.lineWidth = 1.5; ctx.beginPath();
        ctx.moveTo(frontStopperEdgeX + 4, instance.barrelTopPx + 3); ctx.lineTo(frontStopperEdgeX + 4, instance.barrelTopPx + instance.barrelHeightPx - 3);
        ctx.moveTo(frontStopperEdgeX + 9, instance.barrelTopPx + 3); ctx.lineTo(frontStopperEdgeX + 9, instance.barrelTopPx + instance.barrelHeightPx - 3);
        ctx.moveTo(frontStopperEdgeX + 13, instance.barrelTopPx + 3); ctx.lineTo(frontStopperEdgeX + 13, instance.barrelTopPx + instance.barrelHeightPx - 3);
        ctx.stroke();

        // 6. THUMB REST LEVER DISC
        let handleX = pX + instance.plungerLengthPx; 
        let handleGrad = ctx.createLinearGradient(0, instance.barrelTopPx - 11, 0, instance.barrelTopPx + instance.barrelHeightPx + 11);
        handleGrad.addColorStop(0.0, "#4a5568"); handleGrad.addColorStop(0.25, "#ffffff"); handleGrad.addColorStop(0.6, "#cbd5e0"); handleGrad.addColorStop(1.0, "#1a202c");
        ctx.fillStyle = handleGrad; ctx.strokeStyle = "#1a202c"; ctx.lineWidth = 2;
        ctx.fillRect(handleX, instance.barrelTopPx - 11, 8, instance.barrelHeightPx + 22);
        ctx.strokeRect(handleX, instance.barrelTopPx - 11, 8, instance.barrelHeightPx + 22);

        // 7. HIGH-GLOSS SHINY TRANSPARENT PLASTIC BARREL (Top Masking Layer)
        let barrelGrad = ctx.createLinearGradient(0, instance.barrelTopPx, 0, instance.barrelTopPx + instance.barrelHeightPx);
        barrelGrad.addColorStop(0.0, "rgba(148, 163, 184, 0.45)");
        barrelGrad.addColorStop(0.12, "rgba(255, 255, 255, 0.85)"); 
        barrelGrad.addColorStop(0.45, "rgba(248, 250, 252, 0.05)"); 
        barrelGrad.addColorStop(0.85, "rgba(248, 250, 252, 0.15)");
        barrelGrad.addColorStop(1.0, "rgba(71, 85, 105, 0.55)");

        ctx.fillStyle = barrelGrad; ctx.strokeStyle = "#1a202c"; ctx.lineWidth = 2.5;
        ctx.fillRect(instance.barrelStartPx, instance.barrelTopPx, bWidth, instance.barrelHeightPx);
        ctx.strokeRect(instance.barrelStartPx, instance.barrelTopPx, bWidth, instance.barrelHeightPx);

        // 8. BRANDED FLAT FINGER FLANGES PLATFORMS
        let flangeGrad = ctx.createLinearGradient(0, instance.barrelTopPx - 16, 0, instance.barrelTopPx + instance.barrelHeightPx + 16);
        flangeGrad.addColorStop(0.0, "#4a5568"); flangeGrad.addColorStop(0.25, "#ffffff"); flangeGrad.addColorStop(0.6, "rgba(241, 245, 249, 0.9)"); flangeGrad.addColorStop(1.0, "#1a202c");
        ctx.fillStyle = flangeGrad;
        ctx.fillRect(instance.barrelEndPx, instance.barrelTopPx - 16, 6, instance.barrelHeightPx + 32);
        ctx.strokeRect(instance.barrelEndPx, instance.barrelTopPx - 16, 6, instance.barrelHeightPx + 32);

        ctx.fillStyle = "#4a5568"; ctx.font = "bold 8px sans-serif"; ctx.textAlign = "right";
        ctx.fillText("BD", instance.barrelEndPx - 8, instance.barrelTopPx + instance.barrelHeightPx - 4);
    }
}
window.SyringeRenderer = SyringeRenderer;
