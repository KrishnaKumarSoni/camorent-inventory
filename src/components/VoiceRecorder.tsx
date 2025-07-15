import React, { useState, useRef, useEffect } from 'react';
import { Microphone, Stop, Play, X } from 'phosphor-react';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onCancel: () => void;
}

type RecordingState = 'idle' | 'recording' | 'stopped' | 'playing';

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete, onCancel }) => {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [duration, setDuration] = useState(0);
  const [audioURL, setAudioURL] = useState<string>('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MAX_DURATION = 120; // 2 minutes in seconds

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    console.log('startRecording called');
    try {
      console.log('Requesting microphone permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      console.log('Microphone permission granted');
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Stop all tracks to free up the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecordingState('recording');
      setDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          if (prev >= MAX_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('stopped');
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioURL && audioRef.current) {
      audioRef.current.play();
      setRecordingState('playing');
    }
  };

  const handleAudioEnded = () => {
    setRecordingState('stopped');
  };

  const restartRecording = () => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
      setAudioURL('');
    }
    setDuration(0);
    setRecordingState('idle');
  };

  const handleComplete = () => {
    if (audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      onRecordingComplete(audioBlob);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getButtonContent = () => {
    switch (recordingState) {
      case 'recording':
        return <Stop size={48} color="white" weight="fill" />;
      case 'stopped':
        return <Play size={48} color="white" weight="fill" />;
      case 'playing':
        return <Microphone size={48} color="white" weight="fill" />;
      default:
        return <Microphone size={48} color="white" weight="fill" />;
    }
  };

  const getButtonAction = () => {
    console.log('getButtonAction called, current state:', recordingState);
    switch (recordingState) {
      case 'idle':
        console.log('Returning startRecording function');
        return startRecording;
      case 'recording':
        console.log('Returning stopRecording function');
        return stopRecording;
      case 'stopped':
      case 'playing':
        console.log('Returning playRecording function');
        return playRecording;
      default:
        console.log('Default: Returning startRecording function');
        return startRecording;
    }
  };

  const isRecording = recordingState === 'recording';
  const hasRecording = recordingState === 'stopped' || recordingState === 'playing';

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px'}}>
      {/* Microphone Button */}
      <div style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <button
          onClick={() => {
            console.log('Button clicked! Current state:', recordingState);
            const action = getButtonAction();
            console.log('Action function:', action);
            if (action) {
              action();
            }
          }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isRecording ? '#EF4444' : '#8B5CF6',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: isRecording 
              ? '0 8px 32px rgba(239, 68, 68, 0.4)' 
              : '0 8px 32px rgba(139, 92, 246, 0.3)',
            transform: isRecording ? 'scale(1.05)' : 'scale(1)',
            pointerEvents: 'auto'
          }}
          disabled={recordingState === 'playing'}
        >
          {getButtonContent()}
        </button>
        
        {isRecording && (
          <div style={{
            position: 'absolute',
            inset: '-8px',
            borderRadius: '50%',
            border: '3px solid #FCA5A5',
            animation: 'pulse 2s infinite'
          }}></div>
        )}
      </div>

      {/* Timer Display */}
      <div style={{textAlign: 'center'}}>
        <div style={{
          fontSize: '32px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: isRecording ? '#EF4444' : '#374151',
          marginBottom: '8px'
        }}>
          {formatTime(duration)}
        </div>
        <p style={{
          fontSize: '14px',
          color: '#6b7280',
          margin: '0'
        }}>
          {isRecording ? 'Recording...' : hasRecording ? 'Tap to play' : 'Tap to start recording'}
        </p>
        {duration > 0 && (
          <div style={{
            width: '200px',
            backgroundColor: '#e5e7eb',
            borderRadius: '10px',
            height: '6px',
            marginTop: '12px',
            margin: '12px auto 0'
          }}>
            <div style={{
              height: '6px',
              borderRadius: '10px',
              backgroundColor: isRecording ? '#EF4444' : '#8B5CF6',
              transition: 'all 0.3s',
              width: `${(duration / MAX_DURATION) * 100}%`
            }}></div>
          </div>
        )}
      </div>

      {/* Controls */}
      {(isRecording || hasRecording) && (
        <div style={{display: 'flex', gap: '16px', justifyContent: 'center'}}>
          {isRecording && (
            <button
              onClick={stopRecording}
              style={{
                backgroundColor: '#374151',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              <Stop size={16} />
              Stop Recording
            </button>
          )}
          
          {hasRecording && (
            <>
              <button
                onClick={restartRecording}
                style={{
                  backgroundColor: '#8B5CF6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                <X size={16} />
                Start Over
              </button>
              <button
                onClick={handleComplete}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Continue
              </button>
            </>
          )}
        </div>
      )}

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        style={{
          color: '#6b7280',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '14px',
          transition: 'color 0.2s'
        }}
      >
        Cancel
      </button>

      {/* Hidden Audio Element */}
      {audioURL && (
        <audio
          ref={audioRef}
          src={audioURL}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Instructions */}
      {recordingState === 'idle' && (
        <div className="text-center max-w-sm">
          <h3 className="font-semibold text-primary mb-2">Recording Tips:</h3>
          <ul className="text-sm text-gray-medium space-y-1 text-left">
            <li>• Speak clearly and mention brand and model</li>
            <li>• Describe the physical condition</li>
            <li>• Include serial numbers if visible</li>
            <li>• Mention any accessories included</li>
            <li>• Maximum recording time: 2 minutes</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;