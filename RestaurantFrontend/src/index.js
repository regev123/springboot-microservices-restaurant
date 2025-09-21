import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

import { Provider } from "react-redux";   
import store from "./store/store";        

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>   {/* ✅ wrap App inside Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
