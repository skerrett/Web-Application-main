import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "../../App.css";
import Unity, { UnityContext } from "react-unity-webgl";
import { setTimeout } from "timers";
import { compose, TezosToolkit, MichelsonMap } from "@taquito/taquito";
import { Tzip12Module, tzip12, TokenMetadata } from "@taquito/tzip12";
import { Tzip16Module, tzip16 } from "@taquito/tzip16";
import { MintProvider } from "../../services/mintProvider";
import { QuestProvider } from "../../services/questProvider";
import { GraveyardProvider } from "../../services/graveyardProvider";
import toast, { Toaster } from 'react-hot-toast';
import LoadingComponent from "./loading";
import Items from "./Items";
import HelpMessage from "./HelpMessage";
import EntryCoin from "./EntryCoin";
import LoadingBar from "./LoadingBar";
import { CommonProvider, TokenInfo } from "../../services/common";

type ButtonProps = {
    Tezos: TezosToolkit;
    publicToken: string | null;
    userAddress: string;
    userBalance: number;
    setRerender: Dispatch<SetStateAction<number>>;
};

export type ItemType = {
    name: string,
    imageSrc: string,
    alt: string,
    id?: number,
    unityCardIdentifier?:number,
}

const unityContext = new UnityContext({
    loaderUrl: "Build/1.loader.js",
    dataUrl: "Build/1.data",
    frameworkUrl: "Build/1.framework.js",
    codeUrl: "Build/1.wasm",
});

const UnityComponent = ({
    Tezos,
    publicToken,
    userAddress,
    userBalance,
    setRerender,
}: ButtonProps): JSX.Element => {
    let isCalled = false;
    const mintProvider = new MintProvider()
    const questProvider = new QuestProvider()
    const graveyardProvider = new GraveyardProvider()
    const commonProvider = new CommonProvider()
    const [walletLinked, setWalletLinked] = useState<boolean>(false);
    const [walletReady, setWhereWallet] = useState<boolean>(false);
    const [isLoadingCards, setIsLoadingCards] = useState<boolean>(false);
    const [progression, setProgression] = useState(0);
    const [isInventoryFull, setInventoryFull] = useState(false);
    const [sentItemId, setSentItemId] = useState("");
    const [coin, setCoin] = useState<Array<ItemType>>([]);
    const [items, setItem] = useState<Array<ItemType>>([]);
    document.onfullscreenchange = function (event) {
        unityContext.setFullscreen(false);
    };
    unityContext.on("WhereWallet", function (userName, score) {
        if (userAddress && !walletLinked) {
            unityContext.send("AccessController", "ConnectWallet", userAddress);
            setWalletLinked(true);
        } else if (!walletReady) {
            setWhereWallet(true);
        }
    });
    unityContext.on("GameOver", function (userName, score) {
        gameOver(userName, score);
        // findOtherCards();  // game is over so look for users items again
    });
    unityContext.on("MintThis", function (item_id: number) {
        if (item_id) {
            mintContract(item_id);
        }
    });
    unityContext.on("ShareQuest", function (questDetails, Id) {
        shareQuest(questDetails, Id);
    });
    unityContext.on("progress", function (progression) {
        setProgression(progression);
    });
    unityContext.on("QuestCompleted", function (quest_id: string) {
        // QuestCompleted(quest_id);
        toast.error("Invalid Quest not saved");
    });
    unityContext.on("GotItem", function (item_id: number) {
        const tempItems = items.filter((item) => item.alt !== item_id.toString());
        setTimeout(() => {
            setItem(tempItems);
        }, 1000);
        toast.success("Item has been added your inventory")
        setInventoryFull(false);
    });
    unityContext.on("InventoryFull", function () {
        // setInventoryFull(true); //not sure if this is needed
        commonProvider.reInsertCard(sentItemId);
    });

    unityContext.on("RequestItem", function (item: string) {
        GetRequestedItem(item);
    });

    const gameOver = async (userName: string, score: string) => {
        const result = await graveyardProvider.setGraveyardEntry(userName, score).catch((error) => {
            // toast.error("Graveyard is having issues");
        });

        if (result) {
            alert("Your death has been added to The Graveyard")
        }
    }

    const GetRequestedItem = async (requestedItem: string) => {
        // toast.error("Requested item not available")
        toast.success("Looking for Beets Entry Token");
        const result = await commonProvider.getRequestedItem(Tezos, userAddress, requestedItem);
        if (result) {
            unityContext.send("GameController", "ActivateEvent", "Has Beets Token");
        }
        toast.success("Beets Entry token found click on the token to enter");
        setItem([{
            alt: "Entry Coin for PiXL RPG\nCreated by Lex (@LexUnity)\n\nHOW IT WORKS\nIn order to gain access to the PiXL game world you need to have at least one of these coins in your wallet. You can only use one, so having more than one will not help you, share/sell your extra coins if you have a few. \n\nThe aim of PiXL is to be a play-to-earn game that’s accessible to all. Once a week, (Fridays at 5p PST) the top offers and random offers will be accepted and receive a coin. There will be tons of opportunities to get an entry coin. For the latest - follow @PiXLtez \n\n----\n\nPlay PiXL: PiXL.xyz\n\nEntry Coin concept adapted from Beets (@wideawakebeets)\n\nCoin design by: Elin Hohler \n",
            imageSrc: "https://cloudflare-ipfs.com/ipfs/QmeHk5t7csY793KM9sRiWwsGENhzhf5jJoiZrjweSw2AQB",
            name: "PiXL Entry Coin: 1st Edition | Ultra-Rare",
            id: 1,
        }]);
        // setTimeout(() => {
        //     unityContext.send("GameController", "ActivateEvent", "Push Beets Token");
        // }, 5000);
    }

    const QuestCompleted = async (quest_id: string) => {
        const isQuestValid = await questProvider.isQuestValid(quest_id);
        if (isQuestValid) {
            const result = await questProvider.updateQuestStatus(quest_id, userAddress);
            if (result.errorMessage) {
                // toast.error(result.errorMessage);

            } else {
                toast.success("Quest " + result.questName + " completed and saved")
            }
        } else {
            // toast.error("Invalid Quest not saved");
        }
    }

    const mintContract = async (item_id: number) => {
        toast.error("minting is currently unavailable")
        // const result = await mintProvider.mintItem().catch((error) => {
        //     toast.error("Server Didn't Respond, contact the admin");
        // });
        // if (result) {
        //     const tempItems = items;
        //     tempItems.push(result);
        //     setItem(tempItems);
        //     setRerender(Math.random());
        // } // used to rerender Todo replace with better method
    }

    const shareQuest = async (questDetails: any, Id: any) => {
        const result = await mintProvider.shareQuest(questDetails, Id).catch((error) => {
            toast.error("Server Didn't Respond, contact the admin");
        });
        if (result) {
            alert("Quest has been shared")
        }
    }

    const buildCards = async (tokenList: TokenInfo[]) => {
        console.log("metaDataArray", tokenList)
        const cards = commonProvider.buildCards(tokenList)
        console.log("metaDataArray-cards", cards)
        setItem(cards)
    }

    const findOtherCards = async () => {
        setIsLoadingCards(true)
        console.log("findOtherCards");
        const tokenList: TokenInfo[] | null = await commonProvider.findItems(Tezos, userAddress);
        if (tokenList && tokenList.length > 0) {
            console.log("findOtherCards", tokenList);
            buildCards(tokenList);
            setIsLoadingCards(false);
        }
    }

    const addCard = (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>, cardId: number | undefined) => {
        if (!isInventoryFull && cardId) {
            const element = document.getElementById(id);
            if (element) {
                element.className = "card animate__animated animate__backOutUp"
            }
            unityContext.send("GameController", "AddItem", cardId);
            setSentItemId(id);
            setInventoryFull(true);
        } else {
            toast.error("Inventory is full could not complete request")
        }
    }

    const sendCoin = (id: string, e: React.MouseEvent<HTMLElement, MouseEvent>, cardId: string, cardNumber: number | undefined) => {        
        const element = document.getElementById(id);
        if (element) {
            element.className = "card animate__animated animate__backOutUp"
        }
        unityContext.send("AccessController", "InsertCoin", cardNumber);
        findOtherCards();//don't look for other coins on this build
        if (cardNumber === 0) {
            setTimeout(() => {
                setCoin([]);
            }, 1000);
        }
    }

    const findInitialCoin = async () => {
        setIsLoadingCards(true);
        Tezos.addExtension(new Tzip16Module());
        Tezos.addExtension(new Tzip12Module());
        let coin = await commonProvider.findInitialCoin(Tezos, userAddress)
            .catch(async (error) => {
                toast.error("Error connecting to tezos mainnet")
                // const x = await commonProvider.findInitialCoinFallback(Tezos, userAddress)
                // if (x) {
                //     return [{
                //         alt: "Entry Coin for PiXL RPG\nCreated by Lex (@LexUnity)\n\nHOW IT WORKS\nIn order to gain access to the PiXL game world you need to have at least one of these coins in your wallet. You can only use one, so having more than one will not help you, share/sell your extra coins if you have a few. \n\nThe aim of PiXL is to be a play-to-earn game that’s accessible to all. Once a week, (Fridays at 5p PST) the top offers and random offers will be accepted and receive a coin. There will be tons of opportunities to get an entry coin. For the latest - follow @PiXLtez \n\n----\n\nPlay PiXL: PiXL.xyz\n\nEntry Coin concept adapted from Beets (@wideawakebeets)\n\nCoin design by: Elin Hohler \n",
                //         imageSrc: "https://cloudflare-ipfs.com/ipfs/QmPTFsFgEYfS3VV9uaTWfWUQGVqbaHa1t2npBUQZ4NiAvP",
                //         name: "PiXL Entry Coin: 1st Edition | Ultra-Rare",
                //     }]
                // } else {
                //     toast.error("Fallaback failed experiencing server error")
                // }
            });
        if (coin && coin.length > 0) {
            setCoin(coin)
            setIsLoadingCards(false);
            setRerender(Math.random());
        } else {
            toast.error("No entry coin found in wallet")
        }
    }

    useEffect(() => {
        if (userAddress?.length > 1 && !isCalled) {
            isCalled = true;
            findInitialCoin();
        }
    }, [userAddress]);

    return (
        <>
            <div className="flex flex-col items-center ml-auto mr-auto unity-container">
                <Toaster />
                <Unity unityContext={unityContext} style={{
                    height: "100%",
                    width: 950,
                    border: "2px solid black",
                    background: "grey",
                }} />
                {progression < 1 && <LoadingBar progression={progression} />}
            </div>
            {/* show coin */}
            {coin.length > 0 && progression === 1 && walletLinked &&
                <EntryCoin coin={coin} sendCoin={sendCoin}></EntryCoin>
            }
            {/* show other Items */}
            {items.length > 0 && progression === 1 && walletLinked &&
                <Items items={items} addCard={addCard}></Items>
            }
            {((isLoadingCards || progression < 1) || !walletReady) &&
                <LoadingComponent></LoadingComponent>
            }
            {progression === 1 && walletReady && !walletLinked &&
                <HelpMessage></HelpMessage>
            }
        </>
    );
}

export default UnityComponent