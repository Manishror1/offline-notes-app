import { useEffect, useState } from "react";
import { addNote } from "./AddNotes";
import { getAllNotes } from "./GetNotes";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  async function loadNotes() {
    const allNotes = await getAllNotes();
    setNotes(allNotes);
  }

  async function handleAddNote() {
    if (note.trim() === "") {
      alert("Please enter a note");
      return;
    }

    await addNote(note);
    setNote("");
    loadNotes();
  }

  useEffect(() => {
    loadNotes();

    async function checkConnection() {
      if (!navigator.onLine) {
        setIsOnline(false);
        return;
      }

      try {
        await fetch("/favicon.ico", {
          method: "HEAD",
          cache: "no-store",
        });

        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    }

    checkConnection();

    const interval = setInterval(checkConnection, 2000);

    window.addEventListener("online", checkConnection);
    window.addEventListener("offline", checkConnection);

    return () => {
      clearInterval(interval);
      window.removeEventListener("online", checkConnection);
      window.removeEventListener("offline", checkConnection);
    };
  }, []);

  return (
    <div className="container">
      <h1>Offline Notes App</h1>

      <p className={isOnline ? "online" : "offline"}>
        Status: {isOnline ? "Online" : "Offline"}
      </p>

      <input
        type="text"
        placeholder="Enter note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button onClick={handleAddNote}>Add Note</button>

      <h2>All Notes</h2>

      <ul>
        {notes.map((item) => (
          <li key={item.id}>
            {item.text}
            <br />
            <small>{item.createdAt}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;