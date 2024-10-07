import express, { Express, Request, Response, Router } from "express";
import cors from "cors";
import { query } from "./db";

const server = express();
server.use(cors());
server.use(express.json());

interface Todo {
  id: number;
  label: string;
  done: boolean;
  dueDate?: Date;
}

const monTableau: Todo[] = [
  { id: 1, label: "Apprendre Vue.js", done: false },
  { id: 2, label: "Faire le projet entreprise", done: false },
  { id: 3, label: "Faire le projet de DEV", done: false },
  { id: 4, label: "Obtenir le BTS", done: false },
];

server.get("/todos", (req: Request, res: Response) => res.send(monTableau));

server.get("/todos/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todo = monTableau.find((t) => t.id === id);
  if (todo) {
    res.send(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

server.put("/todos/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const { label, done, dueDate } = req.body;
  const todoIndex = monTableau.findIndex((t) => t.id === id);
  if (todoIndex !== -1) {
    monTableau[todoIndex] = {
      ...monTableau[todoIndex],
      label: label || monTableau[todoIndex].label,
      done: done !== undefined ? done : monTableau[todoIndex].done,
      dueDate: dueDate ? new Date(dueDate) : monTableau[todoIndex].dueDate,
    };

    res.send(monTableau[todoIndex]);
  } else {
    res.status(404).send("Todo not found");
  }
});

server.delete("/todos/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const todoIndex = monTableau.findIndex((t) => t.id === id);
  if (todoIndex !== -1) {
    const deletedTodo = monTableau.splice(todoIndex, 1);
    res.send(deletedTodo);
  } else {
    res.status(404).send("Todo not found");
  }
});

server.post("/todos", (req: Request, res: Response) => {
  const { label, done, dueDate } = req.body;
  const newId =
    monTableau.length > 0 ? monTableau[monTableau.length - 1].id + 1 : 1;
  const newTodo: Todo = {
    id: newId,
    label,
    done,
    dueDate: dueDate ? new Date(dueDate) : undefined,
  };
  monTableau.push(newTodo);
  res.status(201).send(newTodo);
});

// Route pour récupérer tous les utilisateurs
server.get("/users", async (req: Request, res: Response) => {
  try {
    // récupérer tous les utilisateurs du SGBD
    const users = await query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

server.listen(3000, () => console.log("Serveur prêt à démarer"));
