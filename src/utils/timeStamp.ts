import {BigNumber, ethers} from 'ethers';
import moment from 'moment';

let provider = ethers.getDefaultProvider('rinkeby');
 
export const period = (startBlockNum: BigNumber, endBlockNum: BigNumber) => {
let startBlock = Number(startBlockNum);
let endBlock = Number(endBlockNum);

let seconds = (endBlock - startBlock) * 13; 
const periodHumanized = moment.duration(seconds, "seconds").humanize();

    return periodHumanized;
}

export const formatStartTime = async (blockNum: BigNumber) => {
    const blockNumber = Number(blockNum);
    const block = await provider.getBlock(blockNumber);
    const timeStamp = block.timestamp;
    return moment.unix(timeStamp).format('MMM DD, YYYY HH:mm:ss');
}

export const formatEndTime = async (startBlockNum: BigNumber, endBlockNum: BigNumber) => {
    let startB = Number(startBlockNum);
    let endB = Number(endBlockNum);
    let currentBlock = await provider.getBlockNumber();
    
    if (Number(currentBlock > endB)) {
        const endBlock = await provider.getBlock(endB);
        const timeStamp = endBlock.timestamp;
        return moment.unix(timeStamp).format('MMM DD, YYYY HH:mm:ss');
    }
    else {
        let seconds = (endB - startB) * 13;
        const startBlock = await provider.getBlock(startB);
        const startTimeStamp = startBlock.timestamp;
        const timestamp = startTimeStamp + seconds; 
        return moment.unix(timestamp).format('MMM DD, YYYY HH:mm:ss');
    }
}
