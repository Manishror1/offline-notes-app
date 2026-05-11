export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("NotesDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function () {
      reject("Database error");
    };
  });
}