const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3000 }, () => {
  console.log('WebSocket on port 3000');
});

wss.on('connection', (ws) => {
  ws.on('message', (message, isBinary) => {
    console.log('=====', message.toString());
    const messages = isBinary ? message : message.toString();
    const response = { data: messages };
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(response));
      }
    });
  });
});
