import React, { useEffect, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Waveform } from 'ldrs/react'
import 'ldrs/react/Waveform.css'
import '../microphone.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { useUser } from "@clerk/clerk-react";

async function sendTranscriptToServer(transcript, user) {
  try {
    console.log(user?.firstName)
    const response = await fetch('https://ai-girlfriend-o8zk.onrender.com/transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, firstName: user?.firstName })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audio URL");
    }

    const data = await response.json();
    return data.audioUrl;
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

  const { user } = useUser();

  const previousListening = useRef(listening);
  const hasTranscript = useRef(false);

  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const audioRef = useRef(null);

  // Check microphone permissions on component mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({ name: 'microphone' });
          setPermissionGranted(permission.state === 'granted');
          
          permission.onchange = () => {
            setPermissionGranted(permission.state === 'granted');
          };
        }
      } catch (err) {
        console.log('Permission API not supported');
        // Fallback: assume we need to request permission
        setPermissionGranted(false);
      }
    };

    checkMicrophonePermission();
  }, []);

  useEffect(() => {
    if (previousListening.current && !listening && transcript.trim()) {
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const url = await sendTranscriptToServer(transcript, user);
          if (url) {
            setAudioUrl(`https://ai-girlfriend-o8zk.onrender.com${url}`);
          } else {
            setError('Failed to process your message. Please try again.');
          }
        } catch (err) {
          setError('Network error. Please check your connection.');
        } finally {
          setLoading(false);
        }
      })();
      hasTranscript.current = true;
    }
    previousListening.current = listening;
  }, [listening, transcript, user]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play().catch(err => {
        console.error("Autoplay failed:", err);
        setError('Audio playback failed. Please check your browser settings.');
      });
    }
  }, [audioUrl]);

  // Request microphone permission explicitly
  const requestMicrophonePermission = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setPermissionGranted(true);
      return true;
    } catch (err) {
      console.error('Microphone permission denied:', err);
      setError('Microphone access denied. Please allow microphone access and try again.');
      setPermissionGranted(false);
      return false;
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <div style={{ background: "none", color: "white", textAlign: "center", padding: "20px" }}>
        <p>Speech recognition is not supported in this browser.</p>
        <p>Please try using Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  const handleStart = async () => {
    setError(null);
    
    // Check if we have microphone permission
    if (permissionGranted === false) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }

    if (hasTranscript.current) {
      resetTranscript();
      setAudioUrl(null);
      hasTranscript.current = false;
    }

    try {
      await SpeechRecognition.startListening({
        continuous: false,
        interimResults: false,
        language: 'en-US' // Explicitly set language
      });
    } catch (err) {
      console.error('Failed to start listening:', err);
      setError('Failed to start voice recognition. Please try again.');
      
      // Try to request permission again
      await requestMicrophonePermission();
    }
  };

  const handleReset = () => {
    resetTranscript();
    setAudioUrl(null);
    hasTranscript.current = false;
    setError(null);
  };

  const deleteAudioFromServer = async (audioUrl) => {
    try {
      const urlPath = audioUrl.replace('https://ai-girlfriend-o8zk.onrender.com', '');
      await fetch(`https://ai-girlfriend-o8zk.onrender.com/clear-audio?path=${encodeURIComponent(urlPath)}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting audio:', error);
    }
  };

  const handleAudioEnded = async () => {
    if (audioUrl) {
      await deleteAudioFromServer(audioUrl);
      setAudioUrl(null);
    }
  };

  return (
    <div style={{ background: "none" }}>
      {/* Permission request UI */}
      {permissionGranted === false && (
        <div style={{ color: "white", textAlign: "center", marginBottom: "10px" }}>
          <p>Microphone access required</p>
          <button 
            onClick={requestMicrophonePermission}
            style={{ 
              padding: "8px 16px", 
              marginBottom: "10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Allow Microphone Access
          </button>
        </div>
      )}

      <MicButton 
        handleStart={handleStart} 
        listening={listening} 
        disabled={permissionGranted === false}
      />

      {/* Error display */}
      {error && (
        <div style={{ color: "#ff6b6b", textAlign: "center", marginTop: "10px", fontSize: "14px" }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{ 
              marginLeft: "10px", 
              padding: "4px 8px", 
              fontSize: "12px",
              backgroundColor: "transparent",
              color: "#ff6b6b",
              border: "1px solid #ff6b6b",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center" }}>
          <Waveform
            size="35"
            stroke="3.5"
            speed="0.8"
            color="white" 
          />
        </p>
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onEnded={handleAudioEnded}
          onError={() => setError('Audio playback failed')}
        />
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ color: "white", fontSize: "12px", marginTop: "10px" }}>
          <p>Permission: {permissionGranted?.toString()}</p>
          <p>Listening: {listening.toString()}</p>
          <p>Has transcript: {hasTranscript.current.toString()}</p>
          <p>Transcript: {transcript}</p>
        </div>
      )}
    </div>
  );
};

const MicButton = ({ handleStart, listening, disabled }) => {
  return (
    <button 
      className={`mic ${listening ? "listening" : ""} ${disabled ? "disabled" : ""}`} 
      type='button' 
      onClick={handleStart} 
      disabled={listening || disabled}
      title={disabled ? "Please allow microphone access first" : listening ? "Listening..." : "Click to speak"}
    >
      <FontAwesomeIcon icon={faMicrophone} />
    </button>
  );
};

export default Dictaphone;