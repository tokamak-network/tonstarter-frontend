import {Flex, useColorMode, useTheme, Text,  Button, Link} from '@chakra-ui/react';
import {useEffect, useState, useCallback} from 'react';
import {Projects,VaultTONStarter} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import {useFormikContext} from 'formik';
import moment from 'moment';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {convertNumber} from 'utils/number';
import {selectLaunch} from '@Launch/launch.reducer';
import {
  checkIsIniailized,
  returnVaultStatus,
  deploy,
} from '@Launch/utils/deployValues';
import {BASE_PROVIDER} from 'constants/index';

const TokenLP = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();

    const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
    const tokenLPVault = values.vaults[6] as VaultTONStarter
    const [btnDisable, setBtnDisable] = useState(true);
    const {account, library} = useActiveWeb3React();
    const [vaultState, setVaultState] = useState<
      'notReady' | 'ready' | 'readyForToken' | 'readyForSet' | 'finished'
    >('notReady');
    const [hasToken, setHasToken] = useState<boolean>(false);
    const dispatch = useAppDispatch();
    // @ts-ignore
    const {blockNumber} = useBlockNumber();
    const network = BASE_PROVIDER._network.name;

    useEffect(() => {
   
      checkIsIniailized(
        tokenLPVault.vaultType,
        library,
        tokenLPVault,
        setFieldValue,
      ).catch((e) => {
        console.log('**checkIsIniailized err**');
        console.log(e);
      });
    }, [blockNumber, values, tokenLPVault]);
  
    //setVaultState
    useEffect(() => {
      returnVaultStatus(
        values,
        tokenLPVault.vaultType,
        tokenLPVault,
        hasToken,
        setVaultState,
      );
    }, [hasToken, tokenLPVault, values, blockNumber]);
    
  
    const {
      data: {hashKey},
    } = useAppSelector(selectLaunch);
  
    const vaultDeploy = useCallback(async () => {
      deploy(
        account,
        library,
        vaultState,
        tokenLPVault.vaultType,
        tokenLPVault,
        values,
        dispatch,
        setFieldValue,
        setVaultState,
      );
    }, [tokenLPVault, values, account, library, vaultState, blockNumber]);
  
    const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);
  
    useEffect(() => {
      async function fetchContractBalance() {
        if (
          ERC20_CONTRACT &&
          tokenLPVault?.vaultAddress &&
          tokenLPVault?.isDeployed === true
        ) {
          const tokenBalance = await ERC20_CONTRACT.balanceOf(
            tokenLPVault.vaultAddress,
          );
          if (tokenBalance && tokenLPVault.vaultTokenAllocation) {
            tokenLPVault.vaultTokenAllocation <=
            Number(convertNumber({amount: tokenBalance.toString()}))
              ? setHasToken(true)
              : setHasToken(false);
          }
        }
      }
      fetchContractBalance();
    }, [blockNumber, ERC20_CONTRACT, tokenLPVault]);

    const detailsVault = [
      {name: 'Vault Name', value:  `${values.tokenSymbol}-TOS LP Reward`},
      {name: 'Admin', value: `${values.ownerAddress?(values.ownerAddress) :''}`},
      {name: 'Contract', value: `${tokenLPVault.vaultAddress? (tokenLPVault.vaultAddress) : 'NA'}`},
    {name: 'Token Allocation', value: `${tokenLPVault.vaultTokenAllocation.toLocaleString()} ${values.tokenSymbol}`},
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
         {values.tokenSymbol}-TOS LP Reward
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
              {(detail.name === 'Admin' || detail.name === 'Contract') && detail.value !== 'NA'? (
                <Link
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={'blue.300'}
                  isExternal
                  href={
                    detail.value && network === 'goerli'
                      ? `https://goerli.etherscan.io/address/${detail.value}`
                      : detail.value && network !== 'goerli'
                      ? `https://etherscan.io/address/${detail.value}`
                      : ''
                  }
                  _hover={{color: '#2a72e5'}}>
                  {detail.value ? shortenAddress(detail.value) : 'NA'}
                </Link>
              ) : (
                <Text
                  fontSize={'13px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={
                    detail.name === 'Admin' || detail.name === 'Contract'
                      ? 'blue.300'
                      : colorMode === 'dark'
                      ? 'white.100'
                      : 'gray.250'
                  }>
                  {detail.value}
                </Text>
              )}
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
        <Text  fontSize={'13px'}  textAlign={'left'}>Claim Rounds ({tokenLPVault.claim.length})</Text>
        </Flex>
       
        {tokenLPVault.claim.map((claim: any, index: Number) => {
          return (
            <Flex  w="100%" justifyContent={'space-between'} h="30px" alignItems={'center'}>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                     <span style={{color:'#3d495d', marginRight:'3px'}}> {index < 10 ? '0' : ''}
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
                  ? (claim.claimTokenAllocation / values.totalSupply) * 100
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
              ? btnDisable :
              vaultState === 'readyForToken' && !values.isAllDeployed ? true
              : false
          }
          _disabled={{background: colorMode === 'dark'?'#353535':'#e9edf1',color: colorMode === 'dark'?'#838383':'#86929d', cursor:'not-allowed'}}

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

export default TokenLP;