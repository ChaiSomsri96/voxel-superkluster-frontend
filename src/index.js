import React from "react";
import ReactDOM from "react-dom/client";
import { Web3ReactProvider } from "@web3-react/core";
import { Provider } from "react-redux";

import "./assets/animated.css";
import "../node_modules/elegant-icons/style.css";
import "../node_modules/et-line/style.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "antd/dist/antd.css" ;
import "./assets/stylesheets/style.scss";
import "./assets/stylesheets/style_grey.scss";

import App from "./app";
import { MetaMaskProvider } from "./components/wallet-connect/metamask";
import store from "./store";
import * as serviceWorker from "./serviceWorker";
import { ethers } from "ethers";
import { PriceModeContextProvider } from "./contexts/PriceModeContext";

function getLibrary(provider) {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 8000; // frequency provider is polling
  return library;
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider>
        <PriceModeContextProvider>
            <App />
        </PriceModeContextProvider>
      </MetaMaskProvider>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
