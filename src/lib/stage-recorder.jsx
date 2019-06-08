class StageRecorder {
    constructor (vm) {
        this.vm = vm;
        this.chunks = [];
        this.stopped = false;
    }

    start (duration, options) {
        /*
            supposed params for options:
            - noCamera: if true it hides the video motion camera when it starts recording
        */
        const vm = this.vm;
        const canvas = vm.renderer && vm.renderer.canvas;

        if (!canvas) throw new Error("Canvas not ready");
        if (!window.MediaRecorder) throw new Error("MediaRecorder is not available; maybe Edge?");
        if (!MediaRecorder.isTypeSupported("video/webm")) throw new Error("WebM format not supported;")
        const fps = vm.runtime.turboMode ? 60 : 30;

        const newOptions = Object.assign({
            noCamera: true
        }, options)
        if (newOptions.noCamera) vm.postIOData('video', {forceTransparentPreview: true});
        const stream = canvas.captureStream(fps);
        const recorder = this.recorder = new MediaRecorder(stream, {mimeType: 'video/webm'});
        this.chunks = [];
        recorder.ondataavailable = this.handleDataAvailable;
        recorder.start();
        return new Promise(resolve => setTimeout(() => resolve(this.stop), duration));
    }

    handleDataAvailable (ev) {
        const data = ev.data;
        if (data.size > 0) this.chunks.push(data);
    }

    stop () {
        if (this.stopped) return;
        this.stopped = true;
        this.recorder.stop();
        return new Blob(this.chunks, {type: 'video/webm'})
    }
}
