import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";

export interface ServerOptions {
  port: number;
  public_path: string;
}

export class AppServer {
  private readonly app: express.Application;
  private httpServer?: http.Server;
  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: ServerOptions) {
    const { port, public_path } = options;
    this.app = express();
    this.port = port;
    this.publicPath = public_path;
  }

  public start = (): void => {
    console.log("Starting server...");

    // Lee el certificado SSL y la clave privada
    // const options = {
    //   key: fs.readFileSync("path/to/server.key"),
    //   cert: fs.readFileSync("path/to/server.cert"),
    // };

    // Crea un servidor HTTPS usando Express
    this.httpServer = http.createServer(this.app);

    // Inicializa Socket.io usando el servidor HTTPS
    const io = new Server(this.httpServer);

    // Sirve archivos estáticos
    this.app.use(express.static(this.publicPath));

    // Eventos de Socket.io
    io.on("connection", (socket: Socket) => {
      console.log("A user connected");

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });

      socket.on("message", (message) => {
        console.log("Emited message:", message);
        io.emit("message", { message, senderId: socket.id });
      });
    });

    // Inicia el servidor HTTPS
    this.httpServer.listen(this.port, () => {
      console.log(`Server listening on http://localhost:${this.port}`);
    });
  };

  public stop = async (): Promise<void> => {
    await this.httpServer?.close();
  };

  public get invoke(): express.Application {
    return this.app;
  }
}
