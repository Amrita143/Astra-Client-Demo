import React, { useState, useEffect, useRef } from 'react';
import { BlandWebClient } from 'bland-client-js-sdk';

// Bland AI configuration
const API_KEY = "org_a0f3e1a51b648bb0289f5bcbe4a1d3094098e7476395cc53a9c0428091753a4fba4178933eb29ddda7b969";

/**
 * VoiceChat component that handles the interaction with Bland AI voice agent
 */
function VoiceChat({ agentId }) {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [status, setStatus] = useState('idle');
  const [sessionToken, setSessionToken] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [error, setError] = useState(null);
  
  // Reference to the Bland client instance
  const clientRef = useRef(null);
  const transcriptContainerRef = useRef(null);

  // Clear transcripts when component mounts or agent changes
  useEffect(() => {
    setTranscripts([]);
    setError(null);
    setStatus('idle');
    setIsConnected(false);
  }, [agentId]);

  /**
   * Fetch a session token from Bland AI API
   */
  const fetchSessionToken = async () => {
    try {
      const response = await fetch(`https://api.bland.ai/v1/agents/${agentId}/authorize`, {
        method: "POST",
        headers: {
          "Authorization": API_KEY
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get session token: ${response.status}`);
      }
      
      const data = await response.json();
      setSessionToken(data.token);
      return data.token;
    } catch (err) {
      setError(`Error getting session token: ${err.message}`);
      console.error("Error getting session token:", err);
      return null;
    }
  };

  /**
   * Initialize the Bland client and start a conversation
   */
  const startConversation = async () => {
    try {
      setError(null);
      // Clear previous transcripts when starting new conversation
      setTranscripts([]);
      
      const token = sessionToken || await fetchSessionToken();
      if (!token) return;
      
      const client = new BlandWebClient(
        agentId,
        token,
        { backgroundNoise: false }
      );
      
      clientRef.current = client;
      
      // Set up event listeners
      client.on('conversationStarted', () => {
        console.log('Conversation started');
        setIsConnected(true);
        setStatus('listening');
      });
      
      client.on('agentStartTalking', () => {
        console.log('Agent started talking');
        setStatus('talking');
      });
      
      client.on('agentStopTalking', () => {
        console.log('Agent stopped talking');
        setStatus('listening');
      });
      
      client.on('userStartTalking', () => {
        console.log('User started talking');
      });
      
      client.on('userStopTalking', () => {
        console.log('User stopped talking');
      });
      
      client.on('transcripts', (transcript) => {
        console.log('Transcript:', transcript);
        if (transcript && transcript.text) {
          setTranscripts(prev => [...prev, {
            type: transcript.type,
            text: transcript.text,
            processId: transcript.processId,
            complete: transcript.complete,
            timestamp: new Date().toLocaleString('en-US', { 
              timeZone: 'America/New_York', 
              hour12: false 
            }) + '.' + new Date().getMilliseconds()
          }]);
        }
      });
      
      client.on('error', (err) => {
        console.error('Bland client error:', err);
        setError(`Error: ${err.message || 'Unknown error'}`);
        stopConversation();
      });
      
      client.on('disconnect', () => {
        console.log('Disconnected from Bland AI');
        setError('Connection to Bland AI was lost. Please try again.');
        stopConversation();
      });
      
      client.on('conversationEnded', (data) => {
        console.log('Conversation ended:', data);
        setIsConnected(false);
        setStatus('idle');
      });
      
      await client.initConversation({
        sampleRate: 44100
      });
      
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError(`Error starting conversation: ${err.message}`);
      setIsConnected(false);
      setStatus('idle');
    }
  };

  /**
   * Stop the current conversation
   */
  const stopConversation = () => {
    if (clientRef.current) {
      clientRef.current.stopConversation();
      clientRef.current = null;
    }
    setIsConnected(false);
    setStatus('idle');
  };

  /**
   * Auto-scroll the transcript container when new messages arrive
   */
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts]);

  /**
   * Clean up the client when component unmounts
   */
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stopConversation();
      }
    };
  }, []);

  return (
    <div className="voice-chat">
      
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
      
      <div className="transcript" ref={transcriptContainerRef}>
        <h3>💬 Conversation</h3>
        {transcripts.length === 0 ? (
          <p className="transcript-placeholder">Your conversation will appear here...</p>
        ) : (
          transcripts.map((item, index) => (
            <div 
              key={index} 
              className={`transcript-message ${item.type}`}
            >
              <div className="message-header">
                <strong className="speaker-label">
                  {item.type === 'assistant' ? '🤖 AI Assistant' : '👤 You'}
                </strong>
                <span className="timestamp">{item.timestamp}</span>
              </div>
              <div className="message-content">
                {item.text}
                {!item.complete && (
                  <span className="typing-indicator"> (typing...)</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="controls">
        {!isConnected ? (
          <button 
            className="start-btn" 
            onClick={startConversation}
            disabled={status !== 'idle'}
          >
            {status === 'idle' ? 'Start Conversation' : 'Connecting...'}
          </button>
        ) : (
          <button 
            className="stop-btn" 
            onClick={stopConversation}
          >
            Stop Conversation
          </button>
        )}
      </div>
      
{/*       
      <div className={`status ${status}`}>
        {status === 'idle' && 'Click "Start Conversation" to begin'}
        {status === 'listening' && (
          <>
            <p>🎤 Listening to you...</p>
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </>
        )}
        {status === 'talking' && (
          <>
            <p>🤖 AI Agent is speaking...</p>
            <div className="loading-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </>
        )}
      </div>
       */}
    </div>
  );
}

export default VoiceChat; 