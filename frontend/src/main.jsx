import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../index.css";
import App from "./App.jsx";
//  แก้บรรทัดที่ 5 จาก { ThemeProvider } เป็น ThemeProvider
import ThemeProvider from "./context/Theme.jsx";

createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
