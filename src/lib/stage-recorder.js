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
            - addSound: if true sound will be added
        */
        const vm = this.vm;
        const canvas = vm.renderer && vm.renderer.canvas;

        if (!canvas) throw new Error("Canvas not ready");
        if (!window.MediaRecorder) throw new Error("MediaRecorder is not available");
        if (!MediaRecorder.isTypeSupported("video/webm")) throw new Error("WebM format is not supported")
        const fps = vm.runtime.turboMode ? 60 : 30;

        const newOptions = Object.assign({
            noCamera: true,
            addSound: true
        }, options)
        if (newOptions.noCamera) vm.postIOData('video', {forceTransparentPreview: true});

        let recordStream = canvas.captureStream(fps);

        let audioStream;
        if (newOptions.addSound) {
            const audio = vm.runtime.audioEngine;
            const context = audio.audioContext;
            const node = audio.inputNode;

            const destination = context.createMediaStreamDestination();
            node.connect(destination);

            // Without it blank will be cut
            const oscillator = context.createOscillator();
            oscillator.connect(destination);

            const audioStream = destination.stream;

            // Bad practice but shorter
            const stageStream = recordStream;
            recordStream = new MediaStream();
            for (stream of [stageStream, audioStream]) {
                stream.getTracks().forEach(track => recordStream.addTrack(track));
            }
        }

        const recorder = this.recorder = new MediaRecorder(recordStream, {mimeType: 'video/webm'});
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
        this.vm.postIOData('video', {forceTransparentPreview: false});
        return new Blob(this.chunks, {type: 'video/webm'})
    }
}
