import { useEffect, useState } from "react";

import { Shell } from "./components/Shell";
import PWABadge from "./PWABadge.tsx";
import { createDb } from "./utils/db.ts";

import "./App.css";

function App() {

  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    createDb()
    .then(() => {
      setDbInitialized(true);
    })
    .catch(e => {
      console.error(e);
    });
  }, []);

  if (!dbInitialized) {
    return null;
  }

  return (
    <>
      <Shell />
      <PWABadge />
    </>
  );
}

export default App;
