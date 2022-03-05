import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import WarDates from "./pages/WarDates";
import { Route, Switch } from "wouter";

ReactDOM.render(
  <React.StrictMode>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/war-dates" component={WarDates} />

      <Route>
        <div class="w-screen h-screen flex items-center justify-center">
          <h1> 404 | Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  </React.StrictMode>,
  document.getElementById("root")
);
