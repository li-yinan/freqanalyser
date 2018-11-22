export async function getAudioMediaStream() {
    return new Promise((resolve, reject) => navigator.getUserMedia({audio: true}, resolve, reject));
}

export async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}
