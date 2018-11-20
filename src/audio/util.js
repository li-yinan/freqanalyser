export async function getAudioMediaStream() {
    return new Promise((resolve, reject) => navigator.getUserMedia({audio: true}, resolve, reject));
}
