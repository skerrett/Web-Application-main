import { compose, TezosToolkit } from "@taquito/taquito";
import { TokenMetadata, tzip12 } from "@taquito/tzip12";
import { tzip16 } from "@taquito/tzip16";
import { ItemType } from "../components/Unity/UnityComponent";
import { REACT_APP_INITCOIN_CONTRACT, REACT_APP_OBJKT_CONTRACT } from "../config";
import { IExtendedMetaDataToken } from "../models/common";
import { LedgerProvider } from "./ledgerProvider";


export interface Metadata {
    token_id: number;
    decimals: number;
    name?: string;
    symbol?: string;
    displayUri? : string;
}
export interface TokenInfo {
    tokenId: number,
    metadata: Metadata,
    amount: number,
}

export class CommonProvider {
    public requestedItemArray = [{ value: "Beets Token", tokenId: 10000, contract: "k1...." }];
    public utilityItemMapper = [{ value: 0, tokenId: 1, description: "Health potion" }];

    private ledgerProvider = new LedgerProvider();

    constructor() {
    }

    public findInitialCoin = async (Tezos: TezosToolkit, userAddress: string) => {
        let coin: { name: string; imageSrc: string; alt: string; id: number }[] = []
        // Contract Hard Coded here
        const contractAddress = REACT_APP_INITCOIN_CONTRACT;
        const tokenId = 1;
        const contract = await Tezos.contract.at(contractAddress, compose(tzip16, tzip12));

        console.log(`Fetching the token metadata for the token ID ${tokenId}...`);
        // const metatData = await contract.tzip12().getTokenMetadata(1);
        const storage: any = await contract.storage();
        const ledger = storage.ledger || storage.accounts;
        // Token ID (1)
        const val = await ledger.get({ 0: userAddress, 1: 1 });
        // Token ID (3)
        const val2 = await ledger.get({ 0: userAddress, 1: 3 });
        if (!val && !val2) { return }
        if (val2) {
            coin.push({
                name: "entry token",
                imageSrc: "https://cloudflare-ipfs.com/ipfs/QmeHk5t7csY793KM9sRiWwsGENhzhf5jJoiZrjweSw2AQB",
                alt: "entry Token",
                id: 1,
            })
        }
        if (val) {
            coin.push({
                alt: "Entry Coin for PiXL RPG\nCreated by Lex (@LexUnity)\n\nHOW IT WORKS\nIn order to gain access to the PiXL game world you need to have at least one of these coins in your wallet. You can only use one, so having more than one will not help you, share/sell your extra coins if you have a few. \n\nThe aim of PiXL is to be a play-to-earn game that’s accessible to all. Once a week, (Fridays at 5p PST) the top offers and random offers will be accepted and receive a coin. There will be tons of opportunities to get an entry coin. For the latest - follow @PiXLtez \n\n----\n\nPlay PiXL: PiXL.xyz\n\nEntry Coin concept adapted from Beets (@wideawakebeets)\n\nCoin design by: Elin Hohler \n",
                imageSrc: "https://cloudflare-ipfs.com/ipfs/QmPTFsFgEYfS3VV9uaTWfWUQGVqbaHa1t2npBUQZ4NiAvP",
                name: "PiXL Entry Coin: 1st Edition | Ultra-Rare",
                id: 0
            })
        }
        return coin
    }

    public findInitialCoinFallback = async (Tezos: TezosToolkit, userAddress: string) => {
        const result = await fetch("https://api.better-call.dev/v1/account/mainnet/" + userAddress + "/token_balances?" + new URLSearchParams({
            contract: REACT_APP_INITCOIN_CONTRACT,
        }),
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }).catch((err) => {
                return [];
            })
        if (!Array.isArray(result)) {
            return await result.json()
        } else {
            return
        }
    }

    public findItems = async (Tezos: TezosToolkit, userAddress: string) => {
        const contractAddress = REACT_APP_OBJKT_CONTRACT;
        console.log("findItems", contractAddress);
        
        try {
            const keysRes = await this.ledgerProvider.getLegderKeys(contractAddress, userAddress);
            console.log("ledger-keys", keysRes);
            if (!keysRes || !keysRes.success) {
                return null;
            }
            const tokenIds = keysRes.keys.map((it: any) => it.key.nat);

            const contract = await Tezos.contract.at(contractAddress, compose(tzip16, tzip12));
            const storage: any = await contract.storage();
            const ledger = storage.ledger || storage.accounts;

            const tokenList: TokenInfo[] = [];
            for (let tokenId of tokenIds) {
                const amount = await ledger.get({ 0: userAddress, 1: tokenId });
                if (amount) {
                    console.log(`tokenId: ${tokenId}, value: ${amount}`);
                    // Get val [bigmap], Find Quantity, create object to return. 
                    const metadata = await contract.tzip12().getTokenMetadata(tokenId);
                    tokenList.push({
                        tokenId,
                        metadata: metadata as Metadata,
                        amount: amount.toNumber(),
                    } as TokenInfo)
                }
            }
            return tokenList;
        }
        catch(err) {
            console.error(err);
            return null;
        }
    }

    public counter = (count: number) => {
        return new Array(count).fill(0);
    }

    public buildCards = (tokenList: TokenInfo[]) => {
        return tokenList.reduce((prev: ItemType[], token: TokenInfo) => {
            const { metadata } = token;
            const cards = this.counter(token.amount).map((value: number, index: number) => {
                console.log("~~~~~~~~~~", value, index)
                return {
                    name: metadata.name as string,
                    imageSrc: this.createImageSrc(metadata.displayUri) as string,
                    alt: `${metadata.token_id.toString()}_${index}`,
                    unityCardIdentifier: this.findUnityCardIdentifier(metadata.token_id),
                } as ItemType
            })
            console.log("cards", cards)
            return prev.concat(cards);
        }, [])
    }

    public createImageSrc = (artifactUri: string | undefined) => {
        if (artifactUri) {
            return "https://cloudflare-ipfs.com/ipfs/" + artifactUri.split("//")[1]
        } else {
            return "error"
        }
    }

    public findUnityCardIdentifier = (id: number) => {
        return this.utilityItemMapper.find((item)=> item.value === id)?.tokenId || undefined;
    }

    public reInsertCard(sentItemId: string) {
        const element = document.getElementById(sentItemId);
        if (element) {
            element.className = "card animate__animated animate__backInDown"
        }
    }

    public async getRequestedItem(Tezos: TezosToolkit, userAddress: string, requestedToken: string) {
        const requestedTokenArray = this.requestedItemArray.find((item) => item.value === requestedToken);
        if (requestedTokenArray) {
            let coin: { name: string; imageSrc: string; alt: string; id: number }[] = []
            const contractAddress = REACT_APP_INITCOIN_CONTRACT;
            const tokenId = 1;
            const contract = await Tezos.contract.at(contractAddress, compose(tzip16, tzip12));

            console.log(`Fetching the token metadata for the token ID ${tokenId}...`);
            // const metatData = await contract.tzip12().getTokenMetadata(1);
            const storage: any = await contract.storage();
            const ledger = storage.ledger || storage.accounts;
            const val2 = await ledger.get({ 0: userAddress, 1: 3 });
            if (!val2) { return }
            if (val2) {
                coin.push({
                    name: "entry token",
                    imageSrc: "https://cloudflare-ipfs.com/ipfs/QmeHk5t7csY793KM9sRiWwsGENhzhf5jJoiZrjweSw2AQB",
                    alt: "entry Token",
                    id: 1,
                })
            }
            return coin
        } else {
            return undefined;
        }
    }
}