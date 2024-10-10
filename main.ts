import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

const users = [{ username: 'user', password: bcrypt.hashSync('password', 8) }];

app.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, 'secret', { expiresIn: '1h' });
  res.json({ token });
});

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, 'secret', (err: any, decoded: any) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id; // TypeScript reconnaît maintenant `userId`
    next();
  });
};

app.get('/todolist', verifyToken, (req: Request, res: Response) => {
  res.json({ todos: ['Buy milk', 'Learn TypeScript'] });
});

app.listen(3000, () => {
  console.log('Backend running on port 3000');
});