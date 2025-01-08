import path from 'path';
import fs from 'fs';

interface Task {
  id: number;
  text: string;
  summary: string | null;
  lang: string;
}

export class TasksRepository {
  private tasks: Task[] = [];
  private currentId: number = 1;
  private tasksFilePath: string = path.resolve(__dirname, 'tasks.json');

//Caso um arquivo de tarefas exista, ele e lido e busca o maior id para incrementar
  constructor() {
    if (fs.existsSync(this.tasksFilePath)) {
      const tasks = fs.readFileSync(this.tasksFilePath, 'utf8');
      this.tasks = JSON.parse(tasks);
      this.currentId = this.tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
    }
  }

  private saveTasks() {
    fs.writeFileSync(this.tasksFilePath, JSON.stringify(this.tasks, null, 2));
  }

  createTask(text: string, lang: string): Task {
    const task: Task = {
      id: this.currentId++,
      text,
      summary: null,
      lang
    };
    this.tasks.push(task);
    this.saveTasks();
    return task;
  }

  updateTask(id: number, summary: string): Task | null {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks[taskIndex].summary = summary;
      this.saveTasks();
      return this.tasks[taskIndex];
    }
    return null;
  }

  deleteTask(id: number): boolean {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
      this.tasks.splice(taskIndex, 1);
      this.saveTasks();
      return true;
    }
    return false;
  }

  getTaskById(id: number): Task | null {
    return this.tasks.find(t => t.id === id) || null;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }
}