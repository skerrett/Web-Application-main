import React, { useState } from "react";
import { TezosToolkit } from "@taquito/taquito";
import UnityComponent from "../Unity/UnityComponent";
import { useOutletContext } from "react-router";
import "./Game.css";

type GameInfo = {
    Tezos: any;
    publicToken: any;
    userAddress: any;
    userBalance: any;
    setRerender: any;
    
}

export const Game = () => {
    // @ts-ignore
    const [Tezos, publicToken, userAddress, userBalance, setRerender] = useOutletContext<GameInfo>();
  
    return(
        <div className="min-h-screen game-container">
            <UnityComponent
              Tezos={Tezos}
              publicToken={publicToken}
              userAddress={userAddress}
              userBalance={userBalance}
              setRerender={setRerender}
            />
        </div>
    );
}