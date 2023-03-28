import {Flex, useColorMode, useTheme, Text,  Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, useCallback} from 'react';
import {Projects,VaultTONStarter} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import {useFormikContext} from 'formik';
import moment from 'moment';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';
import {useActiveWeb3React} from 'hooks/useWeb3';

import {selectLaunch, } from '@Launch/launch.reducer';
import {
  checkIsIniailized,
  returnVaultStatus,
  deploy,
} from '@Launch/utils/deployValues';

const TosStaker = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
    const [btnDisable, setBtnDisable] = useState(true);
    const {account, library} = useActiveWeb3React();
    const [vaultState, setVaultState] = useState<
      'notReady' | 'ready' | 'readyForToken' | 'readyForSet' | 'finished'
    >('notReady');
    const [hasToken, setHasToken] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    // @ts-ignore
  
    const {blockNumber} = useBlockNumber();

    const tosVault = values.vaults[4] as VaultTONStarter
useEffect(() => {
   
    checkIsIniailized(
      tosVault.vaultType,
      library,
      tosVault,
      setFieldValue,
    ).catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
  }, [blockNumber, values, tosVault]);

  //setVaultState
  useEffect(() => {
    returnVaultStatus(
      values,
      tosVault.vaultType,
      tosVault,
      hasToken,
      setVaultState,
    );
  }, [hasToken, tosVault, values, blockNumber]);


  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(async () => {
    deploy(
      account,
      library,
      vaultState,
      tosVault.vaultType,
      tosVault,
      values,
      dispatch,
      setFieldValue,
      setVaultState,
    );
  }, [tosVault, values, account, library, vaultState, blockNumber]);

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        tosVault?.vaultAddress &&
        tosVault?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          tosVault.vaultAddress,
        );
        if (tokenBalance && tosVault.vaultTokenAllocation) {
          tosVault.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, tosVault]);

  useEffect(() => {
    setBtnDisable(
      vaultState === 'readyForToken' && !values.isAllDeployed ? true : false,
    );
  }, [values.isAllDeployed, vaultState, blockNumber]);


    const detailsVault = [
      {name: 'Vault Name', value:  `${tosVault.vaultName}`},
      {name: 'Admin', value: `${values.ownerAddress?shortenAddress(values.ownerAddress) :''}`},
      {name: 'Contract', value: `${tosVault.vaultAddress? shortenAddress(tosVault.vaultAddress) : 'NA'}`},
    {name: 'Token Allocation', value: `${tosVault.vaultTokenAllocation.toLocaleString()} ${values.tokenSymbol}`},
    ];

    return (
        <Flex
      mt="30px"
      h="100%"
      w="350px"
      flexDir={'column'}
      borderRadius={'15px'}
      alignItems="center"
      border={colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'}>
      <Flex
        h="71px"
        w="100%"
        alignItems={'center'}
        justifyContent="center"
        borderBottom={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Text
        lineHeight={1.5}
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          mt='19px'
          mb='21px'
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
         TOS Staker
        </Text>
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text h='18px' mb="10px" fontSize={'13px'}>
          Vault
        </Text>
        {detailsVault.map((detail: any) => {
          return (
            <Flex w="100%" justifyContent={'space-between'} h="45px" alignItems={'center'} >
              <Text
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                {detail.name}
              </Text>
              <Text
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={detail.name === 'Admin' || detail.name === 'Contract'? 'blue.300': colorMode === 'dark' ? 'white.100' : 'gray.250'}>
                {detail.value}
              </Text>
            </Flex>
          );
        })}
      
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text mb="10px" fontSize={'13px'} h='18px' >
          Claim
        </Text>
        <Flex w='100%' h='45px' alignItems={'center'}>
        <Text  fontSize={'13px'}  textAlign={'left'}>Claim Rounds ({tosVault.claim.length})</Text>
        </Flex>
       
        {tosVault.claim.map((claim: any, index: Number) => {
          return (
            <Flex  w="100%" justifyContent={'space-between'} h="30px" alignItems={'center'}>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                     <span style={{color:'#3d495d', marginRight:'3px'}}>{index < 10 ? '0' : ''}
                  {index}</span>
                     {moment
                  .unix(Number(claim.claimTime))
                  .format('YYYY.MM.DD HH:mm:ss')}
               
              </Text>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                >
                {claim.claimTokenAllocation.toLocaleString()} (
                {values.totalSupply
                  ?( (claim.claimTokenAllocation / values.totalSupply) * 100).toLocaleString()
                  : 0}
                %)
              </Text>
            </Flex>
          );
        })}
      
      </Flex>
      <Flex
        mt="24px"
        w="100%"
        h="88px"
        justifyContent={'center'}
        alignItems="center"
        borderTop={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Button
          type="submit"
          w={'150px'}
          h={'38px'}
          bg={'blue.500'}
          fontSize={14}
          color={'white.100'}
          mr={'12px'}
          _hover={{}}
          isDisabled={
            vaultState === 'notReady' || vaultState === 'finished'
              ? btnDisable
              : false
          }
          onClick={() => {
            vaultDeploy();
          }}
          borderRadius={4}>
         {vaultState !== 'readyForToken'
            ? vaultState === 'ready' || vaultState === 'notReady'
              ? 'Deploy'
              : 'Initialize'
            : 'Send Token'}
        </Button>
      </Flex>
    </Flex>
    )
}

export default TosStaker;