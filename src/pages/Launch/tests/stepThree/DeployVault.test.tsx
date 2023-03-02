import DeployVault from "@Launch/components/stepThree/DeployVault";import {
    Flex,
    useTheme,
    Box,
    GridItem,
    useColorMode,
    Text,
    Button,
    Link,
  } from '@chakra-ui/react';
  import {
    Projects,
    VaultAny,
    VaultCommon,
    VaultType,
    VaultSchedule,
    Step3_InfoList,
    VaultPublic,
  } from '@Launch/types';
  import {DEPLOYED} from 'constants/index';
  import {useFormikContext} from 'formik';
  import {useCallback, useEffect, useMemo, useState} from 'react';
  import {LibraryType} from 'types';
  import {shortenAddress} from 'utils';
  import {Contract} from '@ethersproject/contracts';
  import {useActiveWeb3React} from 'hooks/useWeb3';
  import {openModal} from 'store/modal.reducer';
  import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
  import {selectApp} from 'store/app/app.reducer';
  import useVaultSelector from '@Launch/hooks/useVaultSelector';
  import {getSigner} from 'utils/contract';
  import {ethers} from 'ethers';
  import {useBlockNumber} from 'hooks/useBlock';
  import {useContract} from 'hooks/useContract';
  import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
  import Vault_InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
  import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
  import * as LiquidityIncentiveAbi from 'services/abis/LiquidityIncentiveAbi.json';
  import * as PublicSaleVaultCreateAbi from 'services/abis/PublicSaleVaultCreateAbi.json';
  import * as PublicSaleVaultAbi from 'services/abis/PublicSaleVault.json';
  import * as PublicSale from 'services/abis/PublicSale.json';
  
  import * as TONStakerAbi from 'services/abis/TONStakerAbi.json';
  import * as TONStakerInitializeAbi from 'services/abis/TONStakerInitializeAbi.json';
  import * as TOSStakerAbi from 'services/abis/TOSStakerAbi.json';
  import * as TOSStakerInitializeAbi from 'services/abis/TOSStakerInitializeAbi.json';
  import * as LPrewardVaultAbi from 'services/abis/LPrewardVaultAbi.json';
  import * as LPRewardInitializeAbi from 'services/abis/LPRewardInitializeAbi.json';
  import * as VaultCFactoryAbi from 'services/abis/VaultCFactoryAbi.json';
  import * as VaultCLogicAbi from 'services/abis/VaultCLogicAbi.json';
  import * as DAOVaultAbi from 'services/abis/DAOVaultAbi.json';
  import * as InitialLiquidityVault from 'services/abis/InitialLiquidityVault.json';
  import VaultLPRewardLogicAbi from 'services/abis/VaultLPRewardLogicAbi.json';
  import * as VestingPublicFundAbi from 'services/abis/VestingPublicFund.json';
  import * as VestingPublicFundFactoryAbi from 'services/abis/VestingPublicFundFactory.json';
  import {convertNumber, convertToWei} from 'utils/number';
  import commafy from 'utils/commafy';
  import {convertTimeStamp} from 'utils/convertTIme';
  import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
  import bn from 'bignumber.js';

  // Unit Test Code
describe('getContract', () => {
    it('should return a contract for Public vault type', () => {
      const library = 'LibraryType';
      const vaultType = 'Public';
  
      const expectedContract = new Contract(
        PublicSaleVault,
        PublicSaleVaultCreateAbi.abi,
        library,
      );
  
      expect(getContract(vaultType, library)).toEqual(expectedContract);
    });
  
    it('should return a contract for Initial Liquidity vault type', () => {
      const library = 'LibraryType';
      const vaultType = 'Initial Liquidity';
  
      const expectedContract = new Contract(
        InitialLiquidityVault,
        InitialLiquidityAbi.abi,
        library,
      );
  
      expect(getContract(vaultType, library)).toEqual(expectedContract);
    });
  
    it('should return a contract for Vesting vault type', () => {
      const library = 'LibraryType';
      const vaultType = 'Vesting';
  
      const expectedContract = new Contract(
        VestingVault,
        VestingPublicFundFactoryAbi.abi,
        library,
      );
  
      expect(getContract(vaultType, library)).toEqual(expectedContract);					   
    
    });
  
    it('should return a contract for Liquidity Incentive vault type', () => {
        const library = 'LibraryType';     
        const vaultType = 'Liquidity Incentive';     
        const expectedContract = new Contract(LiquidityIncentiveVault, LiquidityIncentiveAbi.abi, library); 

         expect(getContract(vaultType, library)).toEqual(expectedContract);   
        
    });
  
    it('should return a contract for TON Staker vault type', () => { 
            
        const library = 'LibraryType';     
        const vaultType = 'TON Staker';     
        const expectedContract = new Contract(TonStakerVault,TONStakerAbi.abi,library);     
        
        expect(getContract(vaultType, library)).toEqual(expectedContract);   
    });
  
    // it('should return a contract for TOS Staker
});