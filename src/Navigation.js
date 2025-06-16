import React from 'react';

/**
 * Navigation component for switching between different AI agents
 */
function Navigation({ selectedAgent, onAgentChange, agentConfigs }) {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        {Object.entries(agentConfigs).map(([key, config]) => (
          <li key={key} className="nav-item">
            <button
              className={`nav-button ${selectedAgent === key ? 'active' : ''}`}
              onClick={() => onAgentChange(key)}
            >
              {config.title.replace(' AI', '')}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navigation;