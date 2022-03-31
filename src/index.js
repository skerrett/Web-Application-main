import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import 'animate.css';
import './index.css';
import App from "./App.tsx";
import { About } from './components/About/About.tsx';
import { Graveyard } from './components/Graveyard/Graveyard.tsx';
import { Game } from './components/Game/Game.tsx';
import { FAQ } from './components/FAQ/FAQ.tsx';
import * as serviceWorker from "./serviceWorker";

export const routes = [
  {
    path: '/',
    component: <Game />,
    label: 'Home',
  },
  {
    path: 'about',
    component: <About />,
    label: 'About',
  },
  {
    path: 'faq',
    component: <FAQ />,
    label: 'FAQ',
  },
  {
    path: 'graveyard',
    component: <Graveyard />,
    label: 'Graveyard',
  },
];

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
