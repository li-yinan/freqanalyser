import {getAudioMediaStream} from './util';

export class Recorder {

    async init() {
        this.context = new AudioContext();
        // this.node = this.context.createScriptProcessor(4096, 2, 2);
        this.mediaStream= await getAudioMediaStream();

        this.input = this.context.createMediaStreamSource(this.mediaStream);

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 32;
        this.processor = this.context.createScriptProcessor(4096, 2, 2);

        
        this.gain = this.context.createGain();
        this.gain.gain.value = 30;

        this.analyser.connect(this.context.destination);

        this.processor.onaudioprocess = e => {
            let bufferLength = this.analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            console.log(dataArray);
        };
        this.nodes = [
            this.input,
            this.gain,
            this.analyser,
            this.processor,
            this.context.destination
        ];

        for (var i = 0; i < this.nodes.length; i++) {
            let from = this.nodes[i];
            let to = this.nodes[i + 1];
            if (from && to) {
                from.connect(to);
            }
        }


    }

}

export async function getRecorder() {
    let recorer = new Recorder();
    return await recorer.init();
}
