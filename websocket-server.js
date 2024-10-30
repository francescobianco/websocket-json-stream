const WebSocket = require('ws');
const fs = require('fs');

const wss = new WebSocket.Server({ port: 3030 });
console.log('WebSocket server is running on ws://localhost:3030');

// Read the lines from lines.txt
let lines = [];
try {
    lines = fs.readFileSync('example-output.txt', 'utf-8').split('\n').filter(Boolean);
} catch (error) {
    console.error('Error reading example-output.txt:', error);
}

// Function to send lines periodically
let currentIndex = 0;
setInterval(() => {
    // Check if there are connected clients and lines to send
    if (wss.clients.size > 0 && lines.length > 0) {
        // Get the current line and increment the index
        const message = lines[currentIndex];
        currentIndex = (currentIndex + 1) % lines.length;

        // Broadcast the message to all connected clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
        console.log('Sent:', message);
    }
}, 1000); // Send a message every second

wss.on('connection', (ws) => {
    console.log('New client connected!');

    // Handle client disconnecting
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
