import {
    sleep,
    genPoint,
    getAudioMediaStream
} from './util';
import echarts from 'echarts';

export class Recorder {

    async init() {
        this.context = new AudioContext();
        await this.createRecordNodes();
        await this.createPlayNodes();
    }
    
    async createRecordNodes() {
        this.mediaStream= await getAudioMediaStream();

        this.input = this.context.createMediaStreamSource(this.mediaStream);

        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 32;
        this.analyser.smoothingTimeConstant = 0;

        this.gain = this.context.createGain();
        this.gain.gain.value = 1;


        this.connect([
            this.input,
            this.gain,
            this.analyser,
        ]);

    }

    async createPlayNodes() {
        this.oscillator = this.context.createOscillator();
        this.oscillator.start();
        this.connect([
            this.oscillator,
            this.context.destination
        ]);
    }

    play(hz) {
        this.oscillator.frequency.value = hz;
    }

    stop() {
        this.oscillator.stop();
    }

    connect(nodes) {
        for (var i = 0; i < nodes.length; i++) {
            let from = nodes[i];
            let to = nodes[i + 1];
            if (from && to) {
                from.connect(to);
            }
        }
    }

    getFreqArr() {
        let bufferLength = this.analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        return Array.from(dataArray);

    }

    async getFreqValue(freq) {
        let sampleRate = this.context.sampleRate;
        let fbc = this.analyser.frequencyBinCount;
        let unit = sampleRate / fbc;
        this.play(freq);
        await sleep(1000);
        let freqArr = this.getFreqArr();
        let index = parseInt(freq / unit, 10);
        return freqArr[index];
    }

}

function initEcharts(node) {
    return echarts.init(node);
}

function getOptions(x = [], data = []) {
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

let recorder;
let chart;

export async function init(node) {
    recorder = new Recorder();
    chart = initEcharts(node);

    await recorder.init();
    // setInterval(() => {
    //     let arr = recorder.getFreqArr();
    //     let option = getOptions(arr);
    //     chart.setOption(option);
    //     // console.log(arr);
    // }, 200);
}

export async function run() {
    // let arr = [100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    let arr = genPoint(40);
    console.log(arr);
    let graphArr = [];
    for (var i = 0; i < arr.length; i++) {
        console.log('playing ',arr[i]);
        let value = await recorder.getFreqValue(arr[i]);
        graphArr.push(value);
    }
    console.log(graphArr);
    chart.setOption({
        xAxis: {
            type: 'category',
            data: arr
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: graphArr,
            type: 'line',
            smooth: true
        }]
    });
    return;
}
