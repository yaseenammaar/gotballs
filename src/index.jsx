import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { Route, Switch } from "wouter";

const WarDates = React.lazy(() => import("./pages/WarDates"));

ReactDOM.render(
  <React.StrictMode>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/war-dates">
        <Suspense
          fallback={
            <div class="w-screen h-screen flex items-center justify-center">
              <h1> Loading... </h1>
            </div>
          }
        >
          <WarDates />
        </Suspense>
      </Route>

      <Route>
        <div class="w-screen h-screen flex items-center justify-center">
          <h1> 404 | Page Not Found</h1>
        </div>
      </Route>
    </Switch>
  </React.StrictMode>,
  document.getElementById("root")
);
