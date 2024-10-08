// uploadHandler.js

// Convert SRT file to VTT format
export function convertSRTtoVTT(srtContent) {
    const vttContent = 'WEBVTT\n\n' + srtContent.replace(/(\d{2}):(\d{2}):(\d{2}),(\d{3})/g, '$1:$2:$3.$4');
    const blob = new Blob([vttContent], { type: 'text/vtt' });
    return URL.createObjectURL(blob);
}

// Handle audio file upload
export function handleAudioUpload(file, setAudioSrc, audioSrc) {
    if (!file.type.startsWith('audio/')) {
        throw new Error(`${file.name} is not a valid audio file.`);
    }

    if (audioSrc) {
        URL.revokeObjectURL(audioSrc);
    }

    const audioURL = URL.createObjectURL(file);
    setAudioSrc(audioURL);
}

// Handle subtitle file upload, including SRT to VTT conversion
export function handleTranscriptUpload(file, setTranscriptSrc, transcriptSrc, convertSRTtoVTT) {
    if (file.name.endsWith('.vtt')) {
        if (transcriptSrc) {
            URL.revokeObjectURL(transcriptSrc);
        }
        const vttURL = URL.createObjectURL(file);
        setTranscriptSrc(vttURL);
    } else if (file.name.endsWith('.srt')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const srtContent = e.target.result;
            const vttURL = convertSRTtoVTT(srtContent);

            if (transcriptSrc) {
                URL.revokeObjectURL(transcriptSrc);
            }

            setTranscriptSrc(vttURL);
        };
        reader.readAsText(file);
    } else {
        throw new Error(`${file.name} is not a valid subtitle file.`);
    }
}
