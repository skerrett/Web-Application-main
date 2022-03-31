import { INotification } from "../models/common"
import { ItemType } from "../components/Unity/UnityComponent"

export class QuestProvider {
    public questArray = [{ value: "Talk to mom" },{value:"Finish Beets 1"}];
    constructor() {
    }

    public async updateQuestStatus(quest_id: string, userAddress: string) {
        const body = {
            walletAddress: userAddress,
            timestamp: new Date(),
            status: "COMPLETED",
            questName: quest_id,
        }
        return await fetch("https://pixl-backend.herokuapp.com/api/quest/update", {
            method: 'Post',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        }).then(async (result)=>{
            return await result.json()
        }).catch((reason)=>{
            return {errorMessage:"Error saving completed quest"}
        });
    }

    public async isQuestValid(questId: string) {
        const x = this.questArray.find((item) => item.value === questId);
        if (x) {
            return true
        } else {
            return false
        }
    }
}