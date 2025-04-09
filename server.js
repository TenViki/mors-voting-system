process.env.TURBOPACK = "1";

const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const connectedClients = new Map(); // Store connected clients
const registeredCallbacks = new Map(); // Store registered callbacks

app.prepare().then(() => {
  const httpServer = createServer(handler);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("New client connected");
    connectedClients.set(socket.id, socket); // Store the connected client

    io.emit("clients:count", connectedClients.size); // Emit the count of connected clients

    // Register event listeners for the connected client
    for (const [event, callbacks] of registeredCallbacks.entries()) {
      for (const callback of callbacks) {
        socket.on(event, (...args) => {
          callback(socket, ...args); // Call the registered callback
        });
      }
    }

    socket.on("disconnect", () => {
      connectedClients.delete(socket.id); // Remove the client on disconnect
      console.log("Client disconnected");
      io.emit("clients:count", connectedClients.size); // Emit the count of connected clients
    });
  });

  // Export functions to be used elsewhere in your application
  const socketService = {
    getConnectedClients: () => {
      return connectedClients;
    },
    getClientCount: () => {
      return connectedClients.size;
    },
    broadcastToAll: (event, ...args) => {
      io.emit(event, ...args);
    },
    broadcastToRoom: (roomId, event, ...args) => {
      io.to(roomId).emit(event, ...args);
    },
    registerCallback: (event, callback) => {
      console.log("Registering callback for event:", event);
      if (!registeredCallbacks.has(event)) {
        registeredCallbacks.set(event, []);
      }
      registeredCallbacks.get(event).push(callback);
    },
    getSocket: (socketId) => {
      return connectedClients.get(socketId);
    },
  };

  // Make socketService globally available
  global.socketService = socketService;

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});
