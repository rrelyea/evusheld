// index.js
import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Guide from "./Guide.js";
import App from "./App.js";
import * as constantsSite from './constants-site.js';


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path={constantsSite.siteLower + "/"} element={<App />} />
      <Route path={constantsSite.siteLower + "/guide"} element={<Guide />} />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);