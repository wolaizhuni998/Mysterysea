import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';
import { attachSocket } from './src/server/socket';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT || 3000);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handle(req, res));
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });
  attachSocket(io);
  httpServer.listen(port, () => {
    console.log(`[mysterysea] ready on http://localhost:${port} (${dev ? 'dev' : 'production'})`);
  });
});
