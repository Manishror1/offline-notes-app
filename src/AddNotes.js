import { openDB } from "./db";

export async function addNote(noteText) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("notes", "readwrite");
    const store = transaction.objectStore("notes");

    const note = {
      text: noteText,
      createdAt: new Date().toLocaleString(),
    };

    const request = store.add(note);

    request.onsuccess = () => resolve();
    request.onerror = () => reject("Note not added");
  });
}