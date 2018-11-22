export async function getAudioMediaStream() {
    return new Promise((resolve, reject) => navigator.getUserMedia({audio: true}, resolve, reject));
}

export async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
export function genPoint(cnt) {
    let mi = 1.1;
    // 最大20kHz
    // 取log2，然后按照等比均分，再取幂
    let max = Math.log(20000) / Math.log(mi);
    let unit = max / (cnt - 1);
    let arr = [];
    for (var i = 0; i < cnt; i++) {
        arr.push(
            parseInt(
                Math.pow(mi, i * unit),
                10
            )
        );
    }
    return arr.filter(item => item > 20);
}
