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

export const getDbInstance = () => db;
