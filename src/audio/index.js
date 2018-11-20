import {getAudioMediaStream} from './util';
import {init} from 'echarts';

export class Recorder {

    async init() {
        this.context = new AudioContext();
        // this.node = this.context.createScriptProcessor(4096, 2, 2);
        this.mediaStream= await getAudioMediaStream();

        this.input = this.context.createMediaStreamSource(this.mediaStream);

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 256;
        this.processor = this.context.createScriptProcessor(4096, 2, 2);

        this.gain = this.context.createGain();
        this.gain.gain.value = 1;

        this.analyser.connect(this.context.destination);

        this.processor.onaudioprocess = e => {
            let bufferLength = this.analyser.frequencyBinCount;
            let dataArray = new Uint8Array(bufferLength);
            this.analyser.getByteFrequencyData(dataArray);
            // console.log(dataArray);

            this.ondata(dataArray);
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

    ondata() {
    }

}

function initEcharts(node) {
    return init(node);
}

function getOptions(data = []) {
    return {
        xAxis: {
            type: 'category',
            data: (new Array(data.length)).fill(0)
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 256
        },
        series: [{
            data,
            type: 'bar'
        }]
    };

}

export async function getRecorder(node) {
    let chart = initEcharts(node);
    let recorder = new Recorder();
    recorder.ondata = function (data) {
        let arr = Array.from(data);
        let option = getOptions(arr);
        chart.setOption(option);
        console.log(arr);
    }
    return await recorder.init();
}
