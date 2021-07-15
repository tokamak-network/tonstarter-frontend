import { getTokamakContract } from '../../../utils/contract';
import { convertNumber } from '../../../utils/number';

export const fetchAirdropPayload = async (account: any) => {
  
  const AirdropVault = getTokamakContract('Airdrop');
  
  const tgeCount = await AirdropVault.currentRound();
  let roundInfo: any = [];
  let claimedAmount;
  if (account) {
    try {
      for (let i=1; i <= tgeCount; i++) {
        const result = await AirdropVault.getTgeInfos(i)
        let whitelist
        let airdropInfo
        
          whitelist = await AirdropVault.getWhitelistInfo(i, account);
          if (whitelist[0]) {
            airdropInfo = {
              roundNumber: i,
              allocatedAmount: convertNumber({amount: result.allocatedAmount}),
              amount: convertNumber({amount: result.amount}),
              myAmount: convertNumber({amount: result.amount})
            }
          } else {
            airdropInfo = {
              roundNumber: i,
              allocatedAmount: convertNumber({amount: result.allocatedAmount}),
              amount: convertNumber({amount: result.amount}),
              myAmount: convertNumber({amount: '0'}),
            }
          }
        roundInfo.push(airdropInfo);
        //  else {
        //   break;
        // }
      }
    } catch (e) {
      console.log(e);
    }
    claimedAmount = await AirdropVault.userClaimedAmount(account);
  }
  return {
    roundInfo: roundInfo,
    claimedAmount: convertNumber({ amount: claimedAmount })
  }
  // try {
    //   unclaimedInfos = await AirdropVault.unclaimedInfos();
    //   tgeInfo = await AirdropVault.getTgeInfos(1);
    //   totalAmount = await AirdropVault.totalAllocatedAmount();
    //   const tgeCount = await AirdropVault.totalTgeCount();
    //   const startTime = await AirdropVault.startTime();
    //   const periodTimesPerClaim = await AirdropVault.periodTimesPerCliam();
    //   const endTime = await AirdropVault.endTime();
      
    //   console.log(tgeCount.toString())
    //   console.log(totalAmount.toString())

    //   console.log(periodTimesPerClaim.toString());
    //   console.log(endTime.toString())
    //   console.log(startTime.toString());
      
    //   console.log(tgeInfo.started);
    //   console.log(tgeInfo.amount.toString());
    //   console.log(tgeInfo.allocatedAmount.toString())
    //   // console.log(allocated.toString())
    // } catch (err) {
    //   console.log(err);
    // }
}
