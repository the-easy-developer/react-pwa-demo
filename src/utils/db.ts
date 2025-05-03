const DB_NAME = "journals_db";

const OBJECT_STORE_NAME = "journals_object_store";

const KEY_PATH = "title";

let db: IDBDatabase | null = null;

export const createDb = () => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(DB_NAME, 2);

    dbRequest.onerror = (event) => {
      console.error("Error: dbRequest failed", event);
      reject("could not create DB");
    };

    dbRequest.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      console.log("DB: upgradeneeded event fired.");

      db = dbRequest.result;

      if (event.oldVersion < 1) {
        console.log("DB: creating journals objectstore.");

        db.createObjectStore(OBJECT_STORE_NAME, { keyPath: KEY_PATH });

        console.log("DB: object store created.");
      }

      if (event.oldVersion < 2) {
        console.log("DB: creating index on title.");
        const txn = dbRequest.transaction; // db.transaction(OBJECT_STORE_NAME, "versionchange");

        if (!txn) {
          console.error("Error: in onupgradeneeded, txn is null");
          return;
        }

        const objectStore = txn.objectStore(OBJECT_STORE_NAME);

        objectStore.createIndex("title_index", KEY_PATH, { unique: true });
        console.log("DB: title_index created.");
      }
    };

    dbRequest.onsuccess = () => {
      db = dbRequest.result;
      resolve("db created");
    };
  });
};

type JournalType = { title: string; content: string };

export const addJournal = (arg: JournalType) => {
  const { title, content } = arg;

  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db is null");
      return;
    }

    if (!title) {
      reject("title is required");
      return;
    }

    const txn = db.transaction(OBJECT_STORE_NAME, "readwrite");

    const objectStore = txn.objectStore(OBJECT_STORE_NAME);

    const addRequest = objectStore.add({ title, content });

    addRequest.onerror = (e) => {
      console.error("Error: addJournal failed", e);
      reject("add journal failed");
    };

    addRequest.onsuccess = () => {
      resolve("journal added");
    };
  });
};

export const fetchTitles: () => Promise<string[]> = () => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db is null");
      return;
    }

    const titles: string[] = [];

    const txn = db.transaction(OBJECT_STORE_NAME, "readonly");

    const objectStore = txn.objectStore(OBJECT_STORE_NAME);

    const titleIndex = objectStore.index("title_index");

    const keyCursor = titleIndex.openKeyCursor();

    keyCursor.onerror = (e) => {
      console.error("Error: can't open key cursor in fetchTitles", e);
      reject("can't open key cursor");
    };

    keyCursor.onsuccess = (e) => {
      const cursor = keyCursor.result;
      if (!cursor) {
        console.log("Cursor null");
        resolve(titles);
        return;
      }

      titles.push(cursor.key as string);

      cursor.continue();
    };
  });
};

export const getJournal: (t: string) => Promise<JournalType> = (
  title: string
) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db is null");
      return;
    }

    if (!title) {
      reject("title is required");
      return;
    }

    const txn = db.transaction(OBJECT_STORE_NAME, "readonly");

    const objectStore = txn.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.get(title);

    request.onerror = (event) => {
      console.error("Error: journal not found", event);
      reject("journal not found");
    };

    request.onsuccess = () => {
      const data = request.result;
      console.log("Journal found");
      resolve(data);
    };
  });
};

export const updateJournal = (arg: JournalType) => {
  const { title, content } = arg;

  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db is null");
      return;
    }

    if (!title) {
      reject("title is required");
      return;
    }

    const txn = db.transaction(OBJECT_STORE_NAME, "readwrite");

    const objectStore = txn.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.get(title);

    request.onerror = (event) => {
      console.error("Error: while editing journal not found", event);
      reject("journal not found");
    };

    request.onsuccess = () => {
      const data = request.result;
      data.content = content;

      const requestUpdate = objectStore.put(data);

      requestUpdate.onerror = (event) => {
        console.error("Error: while editing journal", event);
        reject("journal update failed");
      };

      requestUpdate.onsuccess = (event) => {
        console.log("Journal updated", event);
        resolve("journal updated");
      };
    };
  });
};

export const deleteJournal = (title: string) => {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject("db is null");
      return;
    }
    const request = db
      .transaction(OBJECT_STORE_NAME, "readwrite")
      .objectStore(OBJECT_STORE_NAME)
      .delete(title);

    request.onsuccess = (event) => {
      resolve("journal deleted");
      console.log("Journal deleted", event);
    };

    request.onerror = (event) => {
      console.error("Error: journal not deleted", event);
      reject("journal could not be deleted");
    };
  });
};

export const getDbInstance = () => db;
