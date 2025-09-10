import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import '../microphone.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

async function sendTranscriptToServer(transcript) {
  try {
    const response = await fetch('http://localhost:5000/transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audio URL");
    }

    const data = await response.json();
    return data.audioUrl; // return the short URL
  } catch (error) {
    console.error('Error sending transcript:', error);
    return null;
  }
}

const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const previousListening = useRef(listening);
  const hasTranscript = useRef(false);

  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (previousListening.current && !listening && transcript.trim()) {
      (async () => {
        setLoading(true);
        const url = await sendTranscriptToServer(transcript);
        setLoading(false);
        if (url) {
          setAudioUrl(`http://localhost:5000${url}`);
        }
      })();
      hasTranscript.current = true;
    }
    previousListening.current = listening;
  }, [listening, transcript]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Autoplay failed:", err);
      });
    }
  }, [audioUrl]);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const handleStart = () => {
    if (hasTranscript.current) {
      resetTranscript();
      setAudioUrl(null);
      hasTranscript.current = false;
    }

    SpeechRecognition.startListening({
      continuous: false,
      interimResults: false,
    });
  };

  const handleReset = () => {
    resetTranscript();
    setAudioUrl(null);
    hasTranscript.current = false;
  };

  // Function to delete audio from server
  const deleteAudioFromServer = async (audioUrl) => {
    try {
      // Extract the path after the domain
      const urlPath = audioUrl.replace('http://localhost:5000', '');
      await fetch(`http://localhost:5000/clear-audio?path=${encodeURIComponent(urlPath)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  // Handler for when audio playback ends
  const handleAudioEnded = async () => {
    if (audioUrl) {
      await deleteAudioFromServer(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div style={{ background: "none" }} >
      <MicButton handleStart={handleStart} listening={listening} />
      
      {loading && <p><em>Processing...</em></p>}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onEnded={handleAudioEnded}
        />
      )}
    </div>
  );
};

const MicButton = ({ handleStart, listening }) => {
  return (
    <button 
      className={`mic ${listening ? "listening" : ""}`} 
      type='button' 
      onClick={handleStart} 
      disabled={listening}
    >
      <FontAwesomeIcon icon={faMicrophone} />
    </button>
  );
};

export default Dictaphone;


