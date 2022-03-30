import {
  Flex,
  useTheme,
  Box,
  GridItem,
  useColorMode,
  Text,
  Button,
} from '@chakra-ui/react';
import {Projects, VaultAny, VaultType} from '@Launch/types';
import {DEPLOYED} from 'constants/index';
import {useFormikContext} from 'formik';
import {useCallback, useEffect, useState} from 'react';
import {LibraryType} from 'types';
import {shortenAddress} from 'utils';
import {Contract} from '@ethersproject/contracts';
import InitialLiquidityAbi from 'services/abis/Vault_InitialLiquidity.json';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {openModal} from 'store/modal.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {getSigner} from 'utils/contract';
import {ethers} from 'ethers';

type DeployVaultProp = {
  vault: VaultAny;
};

function getContract(vaultType: VaultType, library: LibraryType) {
  switch (vaultType) {
    case 'Public':
      // const {} = DEPLOYED;
      // const contract = new Contract(TON_ADDRESS, ERC20.abi, library);
      break;
    case 'Initial Liquidity':
      const {InitialLiquidityVault} = DEPLOYED;
      const contract = new Contract(
        InitialLiquidityVault,
        InitialLiquidityAbi.abi,
        library,
      );
      return contract;
    case 'TON Staker':
      break;
    case 'TOS Staker':
      break;
    case 'WTON-TOS LP Reward':
      break;
    case 'DAO':
      break;
    case 'C':
      break;
    default:
      break;
  }
}

const DeployVault: React.FC<DeployVaultProp> = ({vault}) => {
  const {vaultName, vaultType} = vault;
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const [btnDisable, setBtnDisable] = useState(true);
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const {account, library} = useActiveWeb3React();
  const [vaultState, setVaultState] = useState<
    'notReady' | 'ready' | 'finished'
  >('notReady');
  const dispatch = useAppDispatch();
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const [infoList, setInfoList] = useState<
    {title: string; content: string | number}[] | []
  >([]);
  const {selectedVaultDetail, selectedVaultName} = useVaultSelector();

  useEffect(() => {
    const isTokenDeployed = values.isTokenDeployed;
    const isLPDeployed = values.vaults[1].isDeployed;
    const isVaultDeployed = false;
    const vaultDeployReady =
      vaultType === 'Initial Liquidity'
        ? isTokenDeployed && !isVaultDeployed
        : isTokenDeployed && isLPDeployed && !isVaultDeployed;
    setVaultState(
      isTokenDeployed && isLPDeployed && isVaultDeployed
        ? 'finished'
        : vaultDeployReady
        ? 'ready'
        : 'notReady',
    );
  }, [values, vaultType]);

  useEffect(() => {
    switch (vaultType) {
      case 'Initial Liquidity':
        //@ts-ignore
        // const {adminAddress} = selectedVaultDetail;
        console.log(selectedVaultDetail);
        const info = [
          {
            title: 'adminAddress',
            content: selectedVaultDetail?.adminAddress || '',
          },
          {
            title: 'Token Price',
            content: `1TOS : ${values?.tosPrice}${values?.tokenSymbol}` || '',
          },
        ];
        setInfoList(info);
    }
  }, [vaultType, selectedVaultDetail, values]);

  const vaultDeploy = useCallback(async () => {
    if (account && library) {
      const vaultContract = getContract(vaultType, library);
      const signer = getSigner(library, account);

      switch (vaultType) {
        case 'Initial Liquidity':
          console.log(
            selectedVaultName,
            values.tokenAddress,
            selectedVaultDetail?.adminAddress,
            1,
            values.tosPrice,
          );
          const tx = await vaultContract
            ?.connect(signer)
            .create(
              selectedVaultName,
              values.tokenAddress,
              selectedVaultDetail?.adminAddress,
              1,
              values.tosPrice,
            );
          const receipt = await tx.wait();
          const {logs} = receipt;
          console.log(logs);

          const iface = new ethers.utils.Interface(InitialLiquidityAbi.abi);

          const result = iface.parseLog(logs[11]);
          console.log(result);
          const {args} = result;
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].vaultAddress`,
            args[0],
          );
          setFieldValue(
            `vaults[${selectedVaultDetail?.index}].isDeployed`,
            true,
          );
          break;
        default:
          break;
      }
    }
  }, [
    vaultType,
    account,
    library,
    selectedVaultDetail,
    selectedVaultName,
    values,
  ]);

  return (
    <GridItem
      {...OpenCampaginDesign.border({colorMode})}
      bg={vaultState === 'finished' ? '#26c1c9' : 'none'}
      w={'338px'}
      h={'232px'}
      pl={'30px'}
      pr={'20px'}
      pt={'20px'}
      pb={'25px'}
      color={vaultState === 'finished' ? 'white.100' : 'gray.400'}>
      <Flex flexDir={'column'}>
        <Box d="flex" justifyContent={'space-between'}>
          <Text fontSize={13} h={'18px'}>
            Vauts
          </Text>
          <Text
            fontSize={12}
            h={'16px'}
            color={vaultState === 'notReady' ? 'gray.400' : '#03c4c6'}>
            {vaultState === 'finished'
              ? 'Completed'
              : vaultState === 'ready'
              ? 'Ready to deploy'
              : 'Status'}
          </Text>
        </Box>
        <Text
          fontSize={28}
          h={'37px'}
          color={vaultState === 'finished' ? 'white.100' : 'black.300'}
          fontWeight={600}
          mb={'48px'}>
          {vaultName}
        </Text>
        <Box d="flex" flexDir={'column'} mb={'12px'}>
          <Text fontSize={11} h={'15px'}>
            Address
          </Text>
          <Text
            color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
            fontSize={15}
            h={'20px'}
            fontWeight={600}>
            {shortenAddress('0x0000000000000000')}
          </Text>
        </Box>
        <Box d="flex" justifyContent={'space-between'}>
          <Flex flexDir={'column'}>
            <Text fontSize={11} h={'15px'}>
              Total Supply
            </Text>
            <Text
              color={vaultState === 'finished' ? 'white.100' : 'gray.250'}
              fontSize={15}
              h={'20px'}
              fontWeight={600}>
              50,000,000
            </Text>
          </Flex>
          <Button
            w={'100px'}
            h={'32px'}
            bg={vaultState === 'ready' ? 'blue.500' : 'none'}
            mt={'auto'}
            color={vaultState === 'ready' ? 'white.100' : 'gray.175'}
            // color={'white.100'}
            border={vaultState === 'ready' ? '' : '1px solid #dfe4ee'}
            isDisabled={vaultState !== 'ready' ? btnDisable : false}
            fontSize={13}
            fontWeight={500}
            _hover={{}}
            onClick={() => {
              dispatch(
                openModal({
                  type: 'Launch_ConfirmVault',
                  data: {
                    vaultName,
                    infoList,
                    func: () => vaultDeploy(),
                  },
                }),
              );
            }}>
            Deploy
          </Button>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default DeployVault;
