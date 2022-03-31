import axios from 'axios';
import { REACT_APP_BASE_URL } from '../config';

export class LedgerProvider {
    private baseUrl = REACT_APP_BASE_URL;

    constructor() {
    }

    async getLegderKeys(contract: string, address: string) {
        const url = `${this.baseUrl}/api/ledger/keys/${contract}/${address}`
        console.log("getLegderKeys", url);
            
        // on a successful transfer the api should return use the object details so that we can display it to the user
        return axios.get(url)
            .then(res => {
                console.log("res", res);
                return res.data;
            })
            .catch(err => {
                console.error(err);
                return null;
            })
    }
}