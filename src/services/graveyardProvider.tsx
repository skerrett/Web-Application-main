import { GraveyardEntry } from "../components/Graveyard/Graveyard";
import { REACT_APP_BASE_URL } from "../config";

export class GraveyardProvider {
    private baseUrl = REACT_APP_BASE_URL;

    constructor() {
    }

    private sanitizeEntries(entries: GraveyardEntry[]): GraveyardEntry[] {
        return entries.filter(entry => {
            return entry.walletAddress && entry.timestamp && entry.enemy && entry.location
        })
    }

    public async getGraveyardEntries() {
        return await fetch(`${this.baseUrl}/api/graveyard`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(async (result) => {
            return await result.json();

            const entries = await result.json();

            return this.sanitizeEntries(entries);
        }).catch((reason) => {
            return {errorMessage: reason}
        });
    }

    public async setGraveyardEntry(name: string, score: string) {
        const enemies = ["Filthy Punk", "Swamp Toad", "Not So Cool Cat", "Corporate Ape"];
        const locations = ["Flat Fields", "Southern Swamps", "Funky Forest", "Creepy Caves"];

        const entry = {
            walletAddress: name,
            timestamp: new Date(),
            // TODO: Get following data from Unity
            enemy: enemies[enemies.length * Math.random() | 0],
            location: locations[locations.length * Math.random() | 0],
        }
        return await fetch(`${this.baseUrl}/api/graveyard/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        }).then(async (result) => {
            return await result.json()
        }).catch((reason) => {
            return {errorMessage:"Error retrieving graveyard entries"}
        });
    }
}