import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadTasks() {
    try {
      const response = await fetch(API);
      const data = await response.json();
      setTasks(data);
    } catch {
      alert("Could not connect to backend. Please keep the backend running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function addTask(e) {
    e.preventDefault();

    if (!title.trim()) return;

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority })
      });

      if (!response.ok) throw new Error("Could not add task");

      const task = await response.json();
      setTasks(previous => [...previous, task]);
      setTitle("");
      setDescription("");
      setPriority("Medium");
    } catch {
      alert("Could not add task. Check that the backend is running.");
    }
  }

  async function updateTask(task, changes) {
    try {
      const response = await fetch(`${API}/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes)
      });

      if (!response.ok) throw new Error("Update failed");

      const updated = await response.json();
      setTasks(previous =>
        previous.map(item => item.id === updated.id ? updated : item)
      );
    } catch {
      alert("Could not update task.");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Delete failed");

      setTasks(previous => previous.filter(task => task.id !== id));
    } catch {
      alert("Could not delete task.");
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const completed = tasks.filter(task => task.status === "Completed").length;
  const inProgress = tasks.filter(task => task.status === "In Progress").length;
  const pending = tasks.filter(task => task.status === "Pending").length;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon">✓</span> TaskFlow</div>
        <p className="nav-heading">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; My Tasks</div>
        <div className="nav-item">◷ &nbsp; In Progress</div>
        <div className="nav-item">✓ &nbsp; Completed</div>
        <div className="sidebar-bottom">
          <div className="avatar">S</div>
          <div><strong>Shubham Paul</strong><small>Workspace Member</small></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div><span className="eyebrow">WORKSPACE / OVERVIEW</span><h1>My Tasks</h1></div>
          <span className="online"><span /> Backend connected</span>
        </header>

        <section className="welcome">
          <div>
            <p className="eyebrow">YOUR PRODUCTIVITY SPACE</p>
            <h2>Get things done, one task at a time.</h2>
            <p>Plan your work, track progress, and celebrate every win.</p>
          </div>
          <div className="welcome-art">✦</div>
        </section>

        <section className="stats">
          <div className="stat-card"><span>Total Tasks</span><strong>{tasks.length}</strong><small>All your tasks</small></div>
          <div className="stat-card"><span>In Progress</span><strong>{inProgress}</strong><small>Currently working</small></div>
          <div className="stat-card"><span>Completed</span><strong>{completed}</strong><small>Tasks finished</small></div>
          <div className="stat-card"><span>Pending</span><strong>{pending}</strong><small>Waiting to start</small></div>
        </section>

        <section className="task-panel">
          <div className="panel-heading">
            <div><h2>All Tasks</h2><p>Manage and organize your work</p></div>
            <span className="task-count">{tasks.length} tasks</span>
          </div>

          <form className="task-form" onSubmit={addTask}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter a new task title..." required />
            <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (optional)" />
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
            <button className="primary-btn" type="submit">+ Add Task</button>
          </form>

          <div className="toolbar">
            <input className="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Search tasks..." />
            <span className="eyebrow">TASK LIST</span>
          </div>

          {loading ? <p className="empty">Loading tasks...</p> :
            filteredTasks.length === 0 ? <div className="empty"><span>✦</span><h3>No tasks yet</h3><p>Add your first task above to get started.</p></div> :
            <div className="task-list">
              {filteredTasks.map(task => (
                <article className="task-row" key={task.id}>
                  <button className={`check ${task.status === "Completed" ? "checked" : ""}`} onClick={() => updateTask(task, { status: task.status === "Completed" ? "Pending" : "Completed" })} aria-label="Toggle completed">{task.status === "Completed" ? "✓" : ""}</button>
                  <div className="task-info">
                    <strong className={task.status === "Completed" ? "task-done" : ""}>{task.title}</strong>
                    {task.description && <p>{task.description}</p>}
                    <div className="task-meta"><span className={`priority ${task.priority.toLowerCase()}`}>{task.priority} priority</span></div>
                  </div>
                  <select className="status-select" value={task.status} onChange={e => updateTask(task, { status: e.target.value })}>
                    <option>Pending</option><option>In Progress</option><option>Completed</option>
                  </select>
                  <button className="delete-btn" onClick={() => deleteTask(task.id)} aria-label="Delete task">×</button>
                </article>
              ))}
            </div>
          }
        </section>
        <footer>TaskFlow · Task Management Application</footer>
      </main>
    </div>
  );
}

export default App;