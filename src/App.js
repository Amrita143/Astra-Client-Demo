import React, { useState } from 'react';
import VoiceChat from './VoiceChat';
import Navigation from './Navigation';

/**
 * Main App component with navigation and AI agent selection
 */
function App() {
  const [selectedAgent, setSelectedAgent] = useState('debt-collection');

  // Configuration for different AI agents
  const agentConfigs = {
    'debt-collection': {
      agentId: "24dce1c9-133f-4f49-ba53-797e86375bc0",
      title: "Debt Collection Training AI",
      description: "Practice professional debt collection conversations"
    },
    'loan-cashlane-updated': {
      agentId: "3a5537da-fba9-4c93-ad8c-0e7c84eba602", // Replace with actual loan agent ID
      title: "Loan-Cashlane Training AI",
      description: "Practice cashlane loan serve up questions"
    },
    'cds-serve-up':{
      agentId: "0717eaef-8b26-4df8-845e-8c7fccea4a9a",
      title: "Loan-CDS Training AI",
      description: "Practice CDS serve up questions"
    }
  };

  const currentConfig = agentConfigs[selectedAgent];

  return (
    <div className="app-container">
      {/* Logo and Navigation */}
      <header className="main-header">
        <div className="logo-container">
          <img 
            src="/logo-astra.png" 
            alt="ASTRA Logo" 
            className="logo"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="logo-fallback" style={{display: 'none'}}>
            <span className="logo-text">ASTRA</span>
          </div>
        </div>
        
        <Navigation 
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          agentConfigs={agentConfigs}
        />
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1>{currentConfig.title}</h1>
          <p>{currentConfig.description}</p>
        </div>
        
        <VoiceChat 
          agentId={currentConfig.agentId}
          key={selectedAgent} // Force re-render when agent changes
        />
      </main>
      
      <footer className="footer">
        <p>&copy; ASTRA GLOBAL. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App; 
