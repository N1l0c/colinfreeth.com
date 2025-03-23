import React, { useState, useRef } from 'react';

const STTComparison = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [whisperText, setWhisperText] = useState('');
  const [wav2vecText, setWav2vecText] = useState('');
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleMicStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    recordedChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: 'audio/webm' });
      const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
      setAudioFile(file);
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const handleMicStop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const handleSubmit = async () => {
    if (!audioFile) return;

    const formData = new FormData();
    formData.append('audio', audioFile);

    const whisperRes = await fetch('http://localhost:8000/transcribe/whisper', {
      method: 'POST',
      body: formData,
    });

    const wav2vecRes = await fetch('http://localhost:8000/transcribe/wav2vec', {
      method: 'POST',
      body: formData,
    });

    const whisperData = await whisperRes.json();
    const wav2vecData = await wav2vecRes.json();

    setWhisperText(whisperData.transcription);
    setWav2vecText(wav2vecData.transcription);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Speech-to-Text Comparison: ⚒️ In development!!</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input type="file" accept="audio/*" onChange={handleFileChange} />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={recording ? handleMicStop : handleMicStart}>
          {recording ? 'Stop Recording' : 'Start Mic Recording'}
        </button>
      </div>

      <button onClick={handleSubmit} disabled={!audioFile}>
        Compare Transcriptions
      </button>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
        <div>
          <h3>Whisper</h3>
          <pre>{whisperText}</pre>
        </div>
        <div>
          <h3>wav2vec 2.0</h3>
          <pre>{wav2vecText}</pre>
        </div>
      </div>
      <div style={{ marginTop: '4rem', maxWidth: '700px' }}>
      <h3>Manifesto</h3>
        <p>
          This tool is part of an ongoing exploration into adaptive, personalized speech-to-text systems designed
          for individuals who are often misheard, misunderstood, or left out entirely by mainstream voice
          recognition technologies. In mental health contexts, especially, clear understanding can be life-changing.
          This is a first step toward restoring dignity, voice, and agency where it matters most.
        </p>

        <p style={{ marginTop: '1rem' }}>
          If you're interested in collaborating, contributing training data, or deploying this in a clinical or care
          setting, please reach out.
        </p>

        <p style={{ marginTop: '1rem' }}>
          📬 Contact: <a href="mailto:colin.freeth@protonmail.com">colin.freeth@protonmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default STTComparison;