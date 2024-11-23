import React from "react";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";


function App() {
    const role = localStorage.getItem("role") || "user";

    return (
        <div className="App">
                <AppRoutes role={role} />
        </div>
    );
}

export default App;
