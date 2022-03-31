import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import { Link } from "react-router-dom";
import { Route, Routes, Outlet } from "react-router-dom";
import "./App.css";
import Navbar from "../src/components/Navbar/Navbar";
import BetaBanner from "./components/BetaBanner/BetaBanner";

import { routes } from ".";
import { REACT_APP_RPC, REACT_APP_INITCOIN_CONTRACT } from "./config";

enum BeaconConnection {
  NONE = "",
  LISTENING = "Listening to P2P channel",
  CONNECTED = "Channel connected",
  PERMISSION_REQUEST_SENT = "Permission request sent, waiting for response",
  PERMISSION_REQUEST_SUCCESS = "Wallet is connected"
}

const App = () => {  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {routes.map(route => <Route path={route.path} key={route.path} element={route.component} />)}

        {/* Using path="*"" means "match anything", so this route
              acts like a catch-all for URLs that we don't have explicit
              routes for. */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

const Layout = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit(REACT_APP_RPC)
  );
  const [contract, setContract] = useState<any>(undefined);
  const [publicToken, setPublicToken] = useState<string | null>("");
  const [wallet, setWallet] = useState<any>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [storage, setStorage] = useState<number>(0);
  const [copiedPublicToken, setCopiedPublicToken] = useState<boolean>(false);
  const [beaconConnection, setBeaconConnection] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("transfer");
  const [render, setRerender] = useState<number>(0);//probably a better way to force a re-render of the coponent but this works for now

  const contractAddress: string = REACT_APP_INITCOIN_CONTRACT;

  return (
    <>
      <Navbar
        Tezos={Tezos}
        setContract={setContract}
        setPublicToken={setPublicToken}
        setWallet={setWallet}
        setUserAddress={setUserAddress}
        setUserBalance={setUserBalance}
        setStorage={setStorage}
        contractAddress={contractAddress}
        setBeaconConnection={setBeaconConnection}
        wallet={wallet}
        publicToken={publicToken}
        userAddress={userAddress}
        userBalance={userBalance}
        setTezos={setTezos} 
      />
      <BetaBanner />

      <Outlet context={[Tezos, publicToken, userAddress, userBalance, setRerender]} />
    </>
  )
};

function NotFound() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}

export default App;
