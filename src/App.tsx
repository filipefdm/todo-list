import "./global.css";
import todoLogo from "./assets/todo-logo.svg";
import "./index.css";
import addButton from "./assets/add-button.svg";
import { Trash } from "phosphor-react";
import clipboard from "./assets/clipboard.svg";
import { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTasks] = useState("");
  const [isCompletedTask, setIsCompletedTask] = useState(() => {
    const stored = localStorage.getItem("tasks") ?? "[]";
    const parsed = JSON.parse(stored) as Task[];

    if (!stored) {
      return 0;
    }

    const completed = parsed.filter((task) => task.isComplete);
    return completed.length;
  });

  function addTask() {
    if (!newTask) return;

    const newTaskTitle = {
      id: Math.random(),
      title: newTask,
      isComplete: false,
    };

    const newTasks = [...tasks, newTaskTitle];
    setTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setNewTasks("");
  }

  function completedTasks(tasks: Task[]) {
    const filterCompletedTasks = tasks.filter((task) => task.isComplete).length;

    setIsCompletedTask(filterCompletedTasks);
  }

  function handleToggleTaskCompletion(id: number) {
    const newTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            isComplete: !task.isComplete,
          }
        : task
    );

    completedTasks(newTasks);
    localStorage.setItem("tasks", JSON.stringify(newTasks));
    setTasks(newTasks);
  }

  function deleteTask(id: number) {
    const filteredTasks = tasks.filter((task) => task.id !== id);

    completedTasks(filteredTasks);
    setTasks(filteredTasks);
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  }

  useEffect(() => {
    const tasksStoraged = JSON.parse(localStorage.getItem("tasks") ?? "[]");
    console.log(tasksStoraged);
    setTasks((prevTasks) => [...prevTasks, ...tasksStoraged]);
  }, []);

  return (
    <div>
      <header className="headerContainer">
        <img src={todoLogo} alt="Logotipo do Todo" />
      </header>

      <div className="inputContainer">
        <input
          type="text"
          className="input"
          placeholder="Adicione uma nova tarefa"
          value={newTask}
          onChange={(e) => setNewTasks(e.target.value)}
        />
        <button onClick={addTask} className="button" title="Criar tarefa">
          Criar <img src={addButton} alt="Ícone de criar uma nova tarefa" />
        </button>
      </div>

      <div className="tasksContainer">
        <header>
          <strong>
            Tarefas criadas <span>{tasks.length}</span>
          </strong>
          <strong>
            Concluídas{" "}
            <span>
              {isCompletedTask} de {tasks.length}
            </span>
          </strong>
        </header>

        {tasks.length > 0 ? (
          tasks.map((task) => (
            <main className="taskContainer">
              <ul>
                <li key={task.id}>
                  <div className={task.isComplete ? "completed" : ""}>
                    <label className="checkBoxContainer">
                      <input
                        type="checkbox"
                        readOnly
                        checked={task.isComplete}
                        onClick={() => handleToggleTaskCompletion(task.id)}
                      />
                      <span className="checkmark">
                        <span className="checkmarkInside"></span>
                      </span>
                    </label>
                    <p>{task.title}</p>
                    <button
                      onClick={() => deleteTask(task.id)}
                      title="Deletar tarefa"
                    >
                      <Trash size={20} />
                    </button>
                  </div>
                </li>
              </ul>
            </main>
          ))
        ) : (
          <div className="clipboardContainer">
            <div>
              <img src={clipboard} alt="Clipboard" />

              <p className="bold-paragraph">
                Você ainda não tem tarefas cadastradas
              </p>
              <p>Crie tarefas e organize seus itens a fazer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
