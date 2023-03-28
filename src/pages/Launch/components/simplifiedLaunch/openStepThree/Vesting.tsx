import {Flex, useColorMode, useTheme, Text,  Button} from '@chakra-ui/react';
import {useEffect, useState, useCallback,useMemo} from 'react';
import {useFormikContext} from 'formik';
import {Projects, 
  VaultCommon,
 
  VaultSchedule,
  Step3_InfoList,
  VaultPublic,} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import {LibraryType} from 'types';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import * as VestingPublicFundAbi from 'services/abis/VestingPublicFund.json';
import * as VestingPublicFundFactoryAbi from 'services/abis/VestingPublicFundFactory.json';
import {convertNumber, convertToWei} from 'utils/number';
import commafy from 'utils/commafy';
import {convertTimeStamp} from 'utils/convertTIme';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
import bn from 'bignumber.js';


const Vesting = () => {
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
    const {data: appConfig} = useAppSelector(selectApp);
    const [infoList, setInfoList] = useState<Step3_InfoList | []>([]);
    const [infoList2, setInfoList2] = useState<Step3_InfoList | []>([]);
    const [stosTierList, setStosTierList] = useState<
      {tier: number; requiredTos: number; allocationToken: number}[] | []
    >([]);
    const {blockNumber} = useBlockNumber();
  
  const vestingVault = values.vaults[2] as VaultCommon;
  const publicVault = values.vaults[0] as VaultPublic;

  function getContract(library: LibraryType) {
    const {VestingVault} = DEPLOYED;
    const contract = new Contract(
      VestingVault,
      VestingPublicFundFactoryAbi.abi,
      library,
    );
    return contract;
  }

  const {vaultName, vaultType, index} = vestingVault;

   //check vault state from contract
   useEffect(()=> {
    async function checkIsIniailized() {
      if (
        vestingVault.vaultAddress !== '' ||
        vestingVault.vaultAddress !== undefined
      ) {
        const vualtContract = new Contract(
          vestingVault.vaultAddress as string,
          VestingPublicFundAbi.abi,
          library,
        );
        const isInitialized = await vualtContract.settingCheck();
        console.log(vestingVault.vaultName);
        console.log(isInitialized);
        return setFieldValue(
          `vaults[2].isSet`,
          isInitialized,
        );
      }
    }
    checkIsIniailized().catch((e) => {
      console.log('**checkIsIniailized err**');
      console.log(e);
    });
   },[blockNumber, vestingVault, values])

  //setVaultState
  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isLPDeployed = values.vaults[1].isDeployed;
    const isVestingDeployed = values.vaults[2].isDeployed;
    const isVaultDeployed = vestingVault?.isDeployed;
    const isSet = vestingVault?.isSet;
    const vaultDeployReady = isTokenDeployed && isLPDeployed && !isVaultDeployed
    if (isSet) {
      return setVaultState('finished');
    }

    const publicVault = values.vaults[0];
    return setVaultState(
      !vaultDeployReady && !isVaultDeployed
        ? 'notReady'
        : vaultDeployReady && !isVaultDeployed
        ? 'ready'
        : isVaultDeployed &&
          publicVault.isDeployed &&
          publicVault.vaultAddress
        ? 'readyForSet'
        : 'finished',
    );
  },[hasToken, vestingVault,  values.isTokenDeployed, blockNumber, values.vaults])

  useEffect(() => {
    const info = {
      Vault: [
        {
          title: 'Vault Name',
          content: vestingVault?.vaultName || '-',
        },
        {
          title: 'Address for receiving funds',
          //@ts-ignore
          content: `${vaultsList[0].addressForReceiving || '-'}`,
          isHref: true,
        },
        {
          title: 'Contract',
          content: `${vestingVault?.vaultAddress || '-'}`,
          isHref: true,
        },
      ],
      Claim: [
        {
          title: `Claim Round (${vestingVault?.claim?.length})`,
          content: '',
        },
        ...vestingVault?.claim?.map(
          (claimData: VaultSchedule, index: number) => {
            return {
              title: `${index + 1} ${convertTimeStamp(
                claimData.claimTime as number,
                'DD.MM.YYYY HH:mm:ss',
              )}`,
              content: `${commafy(
                claimData.claimTokenAllocation,
              )} ${'TON'}`,
            };
          },
        ),
      ],
    };
    return setInfoList(info);
  },[vestingVault,values])  
  
  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);

  const vaultDeploy = useCallback(
    async () => {
      if (account && library && vaultState === 'ready') {
        const vaultContract = getContract( library);
        const signer = getSigner(library, account);
        try {
        const tx = await vaultContract?.connect(signer).create(
          `${values.projectName}_${vestingVault?.vaultName}`,
          //@ts-ignore
          values.vaults[0].addressForReceiving,
        );

        dispatch(
          setTempHash({
            data: tx.hash,
          }),
        );

        const receipt = await tx.wait();
        const {logs} = receipt;

        const iface = new ethers.utils.Interface(
          VestingPublicFundFactoryAbi.abi,
        );

        const result = iface.parseLog(logs[logs.length - 1]);
        const {args} = result;

        if (args) {
          setFieldValue(
            `vaults[2].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[2].isDeployed`,
            true,
          );
          setVaultState('readyForSet');
        } }catch (e) {
          console.log(e);
          setFieldValue(
            `vaults[2].isDeployedErr`,
            true,
          );
        }
      }
      if (account && library && vaultState === 'readyForSet') {
        const signer = getSigner(library, account);

        try{
          const claimTimesParam = vestingVault?.claim.map(
            (claimData: VaultSchedule) => claimData.claimTime,
          );

          let tempSum = 0;

          const claimAmountsParam = vestingVault?.claim.map(
            (claimData: VaultSchedule) => {
              return (tempSum += Number(claimData.claimTokenAllocation));
            },
          );
          const VestingVaultSecondContract = new Contract(
            vestingVault.vaultAddress as string,
            VestingPublicFundAbi.abi,
            library,
          );

          const tx = await VestingVaultSecondContract?.connect(
            signer,
          ).initialize(
            values.vaults[0].vaultAddress,
            values.tokenAddress,
            claimTimesParam,
            claimAmountsParam,
            3000,
          );
          const receipt = await tx.wait();

          if (receipt) {
            setFieldValue(
              `vaults[2].isSet`,
              true,
            );
            setVaultState('finished');
          }
        }
        catch (e) {
          console.log(e);
          setFieldValue(
            `vaults[2].isDeployedErr`,
            true,
          );
        }
      }
    },[vestingVault, values, account, library, vaultState, blockNumber]
  )

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    async function fetchContractBalance() {
      if (
        ERC20_CONTRACT &&
        vestingVault?.vaultAddress &&
        vestingVault?.isDeployed === true
      ) {
        const tokenBalance = await ERC20_CONTRACT.balanceOf(
          vestingVault.vaultAddress,
        );
        if (tokenBalance && vestingVault.vaultTokenAllocation) {
          vestingVault.vaultTokenAllocation <=
          Number(convertNumber({amount: tokenBalance.toString()}))
            ? setHasToken(true)
            : setHasToken(false);
        }
      }
    }
    fetchContractBalance();
  }, [blockNumber, ERC20_CONTRACT, vestingVault]);

  useEffect(()=> {
    setBtnDisable(vaultState==='readyForToken' && !values.isAllDeployed? true:false )
  },[values.isAllDeployed, vaultState, blockNumber])

    const detailsVault = [
      {name: 'Vault Name', value: 'Vesting'},
      {name: 'Admin', value: `${shortenAddress(vestingVault.adminAddress)}`},
      {name: 'Contract', value: vestingVault.vaultAddress? shortenAddress(vestingVault.vaultAddress) : 'NA'},

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
         Vesting
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
        <Text  fontSize={'13px'}  textAlign={'left'}>Claim Rounds ({vestingVault.claim.length})</Text>
        </Flex>
       
        {vestingVault.claim.map((claim: any, index: Number) => {
          return (
            <Flex  w="100%" justifyContent={'space-between'} h="30px" alignItems={'center'}>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                     <span style={{color:'#3d495d', marginRight:'3px'}}>0{index}</span>
                {/* {claim.claimTime} */}
               {moment.unix(Number(claim.claimTime)).format('YYYY.MM.DD HH:mm:ss')}
              </Text>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                >
                {publicVault.hardCap?(publicVault.hardCap*claim.claimTokenAllocation/100).toLocaleString():0} TON ({claim.claimTokenAllocation}%)
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

export default Vesting;