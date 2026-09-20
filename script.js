class SyringeSimulator {
    constructor(containerElement) {
        this.container = containerElement;
        this.canvas = containerElement.querySelector('.syringe-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.input = containerElement.querySelector('.volume-input');
        this.readout = containerElement.querySelector('.live-readout');
        this.downloadBtn = containerElement.querySelector('.download-btn');
        
        this.canvas.width = 550;
        this.canvas.height = 140;

        this.syringeType = this.canvas.getAttribute('data-type');
        this.maxCapacity = parseFloat(this.canvas.getAttribute('data-max'));
        this.unit = this.canvas.getAttribute('data-unit');
        this.liquidColor = this.canvas.getAttribute('data-color');
        this.currentVolume = 0;
        
        // Dynamic Branded Track Boundaries Matrix
        this.stopperWidthPx = 14;
        this.barrelStartPx = 160; 
        this.barrelEndPx = 360;   
        this.trackLength = this.barrelEndPx - this.barrelStartPx;
        this.plungerLengthPx = 215; 

        const dimensionsMap = {
            '1ml': { top: 56, height: 24 },
            '3ml': { top: 48, height: 40 },
            '5ml': { top: 38, height: 58 }
        };
        const layout = dimensionsMap[this.syringeType] || { top: 45, height: 42 };
        this.barrelTopPx = layout.top;
        this.barrelHeightPx = layout.height;

        this.isDragging = false;
        this.init();
    }

    init() {
        this.input.addEventListener('input', (e) => {
            let val = parseFloat(e.target.value);
            this.currentVolume = Math.max(0, Math.min(this.maxCapacity, isNaN(val) ? 0 : val));
            this.updateUIElements(false);
            this.render();
        });

        this.canvas.addEventListener('mousedown', (e) => this.startDrag(e));
        window.addEventListener('mousemove', (e) => this.dragMove(e));
        window.addEventListener('mouseup', () => this.endDrag());

        // TRIGGER EXTENSION FILE CAPTURE: Processes canvas pipeline extraction securely
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadAsPNG());
        }

        this.render();
    }

    startDrag(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        
        const frontStopperEdgeX = this.getPlungerPixelPosition();
        const currentHandleX = frontStopperEdgeX + this.stopperWidthPx + this.plungerLengthPx;
        
        if (clickX >= currentHandleX - 5 && clickX <= currentHandleX + 18 &&
            clickY >= this.barrelTopPx - 15 && clickY <= this.barrelTopPx + this.barrelHeightPx + 15) {
            this.isDragging = true;
            e.preventDefault();
        }
    }

    dragMove(e) {
        if (!this.isDragging) return;
        const rect = this.canvas.getBoundingClientRect();
        const currentX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        
        const targetFrontStopperEdgeX = currentX - this.plungerLengthPx - this.stopperWidthPx;
        const currentPercentage = (targetFrontStopperEdgeX - this.barrelStartPx) / this.trackLength;
        const clampedPercentage = Math.max(0, Math.min(1, currentPercentage));
        
        this.currentVolume = clampedPercentage * this.maxCapacity;
        this.updateUIElements(true);
        this.render();
    }

    endDrag() { this.isDragging = false; }

    updateUIElements(updateInputBox) {
        if (updateInputBox) {
            this.input.value = this.currentVolume.toFixed(2);
        }
        this.readout.textContent = `Current: ${this.currentVolume.toFixed(2)} ${this.unit} / ${this.maxCapacity} ${this.unit}`;
    }

    getPlungerPixelPosition() {
        return this.barrelStartPx + ((this.currentVolume / this.maxCapacity) * this.trackLength);
    }

    // NEW LOGIC COMPONENT: Bypasses file path constraints to extract instant image links
    downloadAsPNG() {
        // Force a fresh, clean render pass before exporting
        this.render();
        
        // Extract canvas contents as a base64 image data-url string
        const imageURL = this.canvas.toDataURL('image/png');
        
        // Generate an in-memory virtual link element to trigger the browser's download core
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        
        // Define a clear descriptive naming format for student skills submissions
        downloadLink.download = `Syringe_${this.syringeType}_Calibration_${this.currentVolume.toFixed(2)}mL.png`;
        
        // Click and cleanly remove the hook from page context arrays
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    render() {
        if (window.SyringeRenderer) {
            window.SyringeRenderer.draw(this);
        }
    }
}

function initializeAllSyringes() {
    window.syringeInstances = [];
    document.querySelectorAll('.syringe-workspace').forEach(workspace => {
        window.syringeInstances.push(new SyringeSimulator(workspace));
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAllSyringes);
} else {
    initializeAllSyringes();
}

setTimeout(() => {
    if (window.syringeInstances) {
        window.syringeInstances.forEach(s => s.render());
    }
}, 200);
