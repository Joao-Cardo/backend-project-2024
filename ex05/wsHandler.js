import { WebSocket } from "ws";

// Set where the client connections are stored
const connectedClients = new Set();

export const initializeWebSocket = (server) => {
  // Start and initialize the server here and handle new connections and disconnections
  const wss = new WebSocket.Server({ server });

  // Handle new client connections
  wss.on("connection", (ws) => {
    console.log("WebSocket connection established.");
    connectedClients.add(ws);
    // send welcome to the client
    ws.send("Welcome to the WebSocket server!");

    // Handle incoming messages
    ws.on("message", (message) => {
      console.log("Message received from a client.");
      connectedClients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    // Handle disconnects
    ws.on("close", () => {
      console.log("WebSocket client connection closed.");
      connectedClients.delete(ws);
    });

    // Handle possible errors
    ws.on("error", (error) => {
      console.error("WebSocket Error: ", error);
    });
  });
};
