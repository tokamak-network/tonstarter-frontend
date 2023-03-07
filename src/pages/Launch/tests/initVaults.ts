 // TODO: Write a an automation script to auto deploy + send tokens + init vaults after deploying the token
// 1. IsTokenDeployed? -> yes -> Start deploying vaults
//    IsTokenDeployed? -> no -> Deploy the token
// 2. Start Deploying vaults
// 3. Finish deploying all vaults
// 3. Send tokens to all vaults
// 4. Initialize all vaults

import {useActiveWeb3React} from 'hooks/useWeb3';
import { getContract, getSigner } from 'utils/contract';
import {DEPLOYED} from 'constants/index'
import {LibraryType} from 'types';
import { VaultType } from '@Launch/types';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import {Contract} from '@ethersproject/contracts';

// 1 steps

// module??
export const getILContract = (vaultType: VaultType, library: LibraryType) => { 
    // get contract of initialize liquidity vault?
    const {InitialLiquidityVault} = DEPLOYED;
      const contract = new Contract(
        InitialLiquidityVault,
        InitialLiquidityAbi.abi,
        library,
      );
      console.log(contract);
      return contract;
}

const IsTokenDeployed = (): boolean => {
    return 
}

export const DeployVaults = () => {
    async () => {
        const {account, library} = useActiveWeb3React();  
        // const signer = getSigner(account, library);
        const vaultContractIL = getILContract('Initial Liquidity', library);
        // Deploy
        // 1. Init Liquidity
    
    }
   
}