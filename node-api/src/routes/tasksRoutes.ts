import { Router, Request, Response } from "express";
import { TasksRepository } from "../repositories/tasksRepository";
import { getSummaryPython } from "../services/pythonService";

const router = Router();
const tasksRepository = new TasksRepository();

// POST: Cria uma tarefa e solicita resumo ao serviço Python
router.post("/", async (req: Request, res: Response) => {
  try {
    const { text, lang } = req.body;
    const supportedLanguages = ['pt', 'en', 'es'];
    if (!lang || !text) {
      return res.status(400).json({ error: 'Campo "text" e "lang" sao obrigatorios' });
    }

    if (!supportedLanguages.includes(lang)) {
      return res.status(400).json({ error: 'A lingua selecionada nao esta disponivel' });
    }

    // Cria a "tarefa"
    //utilizando o texto e o idioma
    const task = tasksRepository.createTask(text, lang);

    // Deve solicitar o resumo do texto ao serviço Python
    const summary = await getSummaryPython.getSummary(text, lang);

    // Atualiza a tarefa com o resumo
    tasksRepository.updateTask(task.id, summary);

    return res.status(201).json({
      message: "Tarefa criada com sucesso!",
      task: tasksRepository.getTaskById(task.id),
    });
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    return res
      .status(500)
      .json({ error: "Ocorreu um erro ao criar a tarefa." });
  }
});

// GET: Lista todas as tarefas
router.get("/", (req, res) => {
  const tasks = tasksRepository.getAllTasks();
  return res.json(tasks);
});

//GET: Permite o acesso ao resumo de uma tarefa atraves do id
router.get("/:id", (req: Request, res: Response) => { 
  const id = parseInt(req.params.id);
  const task = tasksRepository.getTaskById(id);
  
  if (task) {
    return res.json(task);
  }
  else {
    return res.status(404).json({ error: "Tarefa nao encontrada" });
  } 
});

//DELETE: Remove uma tareda atraves do endpoint de id
router.delete("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const task = tasksRepository.getTaskById(id);
  if (task) {
    tasksRepository.deleteTask(id);
    return res.json({ message: "Tarefa removida com sucesso" });
  } 
  
  else {
    return res.status(404).json({ error: "Tarefa nao encontrada" });
  }
});

export default router;
