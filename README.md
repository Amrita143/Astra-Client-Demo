# Bland Voice Chat App

A simple web application that allows users to interact with a Bland AI voice agent through their browser.

## Features

- Start/stop conversation with a Bland AI voice agent
- Real-time voice interaction
- Visual feedback for agent talking status
- Transcript display

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/bland-voice-chat-app.git
cd bland-voice-chat-app
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The app uses a pre-configured Bland AI agent. If you want to use your own agent:

1. Open `src/VoiceChat.js`
2. Update the `AGENT_ID` and `API_KEY` constants with your own values

## Running the App

Start the development server:
```bash
npm start
```

This will open the app in your default browser at [http://localhost:3000](http://localhost:3000).

## Usage

1. Click the "Start Conversation" button to begin talking with the AI agent
2. Speak into your microphone when prompted
3. The agent will respond with voice
4. Click "Stop Conversation" to end the session

## Troubleshooting

- **Microphone access denied**: Make sure to grant microphone permissions when prompted by your browser
- **No sound**: Check that your speakers/headphones are connected and volume is turned up
- **Agent not responding**: Ensure you have a stable internet connection

## License

MIT 