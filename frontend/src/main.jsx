import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/UserContext.jsx";
import { CaptainAuthProvider } from "./context/CaptainContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SocketProvider>
      <CaptainAuthProvider>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </CaptainAuthProvider>
    </SocketProvider>
  </StrictMode>
);
