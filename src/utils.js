import axios from "axios";

/**
 * get api string given the name of the key if it exists otherwise null
 * intended to be purely internal usage, never to be exposed publically
 * @param {*} keyName 
 */
export async function getApiKey(keyName){
    const response = await axios.get(`http://api:3001/api_key`, {
        params: {name: keyName}
    });
    return response?.data ?? null;
}