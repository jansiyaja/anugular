import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import mysql from 'mysql2/promise';

const app = express();
const angularApp = new AngularNodeAppEngine();
const browserDistFolder = join(import.meta.dirname, '../browser');

app.use(express.json()); // ✅ Parse incoming JSON

// ✅ Setup MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Root@123', // Change to your real MySQL password
  database: 'auth',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ✅ Login API using stored procedure (LoginUser)
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' });
    return;
  }

  try {
    const [rows]: any = await pool.query('CALL LoginUser(?, ?)', [email, password]);

    if (rows && rows[0] && rows[0].length > 0) {
      res.json({ success: true, user: rows[0][0] });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Login error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ✅ Serve Angular static files
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// ✅ Handle all Angular routes via SSR
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next()
    )
    .catch(next);
});

// ✅ Start the server
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`✅ Express + Angular SSR running at http://localhost:${port}`);
  });
}

// ✅ Export handler for Firebase SSR support (if needed)
export const reqHandler = createNodeRequestHandler(app);