import axios from 'axios';
import { API_SERVER, DEFAULT_NETWORK } from '../../../constants/index';

type CreateReward = {
    poolName: string,
    poolAddress: string,
    rewardToken: string,
    incentiveKey: object,
    startTime: number,
    endTime: number,
    allocatedReward: string,
    numStakers: number,
    status: string,
    account: string,
    verified: boolean,
    tx: string,
    sig: string,
}

function createInstance() {
    return axios.create({
        baseURL: API_SERVER,
    });
}

const instance = createInstance();

export async function createReward(args: CreateReward) {
    console.log('came to createReward');
    
    let {
        poolName,
        poolAddress,
        rewardToken,
        incentiveKey,
        startTime,
        endTime,
        allocatedReward,
        numStakers,
        status,
        verified,
        account,
        tx,
        sig,
    } = args

    const res = await instance.post(`/reward?chainId=${DEFAULT_NETWORK}`, {
        poolName: poolName,
        poolAddress: poolAddress,
        rewardToken: rewardToken,
        incentiveKey: incentiveKey,
        startTime: startTime,
        endTime: endTime,
        account: account,
        allocatedReward: allocatedReward,
        numStakers: numStakers,
        status: status,
        verified: verified,
        tx: tx,
        sig: sig,
    });
    
    return res.data;
}

export async function getRandomKey(from: string) {
    const res = await instance.post('/randomkey', {
        account: from,
    });
    return res.data.data.randomvalue;
}