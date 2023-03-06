import {
  Flex,
  useTheme,
  Box,
  GridItem,
  useColorMode,
  Text,
  Button,
  Link,
} from '@chakra-ui/react';
import {shortenAddress} from 'utils';
import * as ERC20_FACTORY_A_ABI from 'services/abis/ERC20AFactory.json';
import * as ERC20_FACTORY_B_ABI from 'services/abis/ERC20_FACTORY_B_ABI.json';
import * as ERC20_FACTORY_C_ABI from 'services/abis/ERC20_FACTORY_C_ABI.json';

import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {convertToWei} from 'utils/number';
import {ethers} from 'ethers';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectApp} from 'store/app/app.reducer';
import {openModal} from 'store/modal.reducer';
import commafy from 'utils/commafy';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {createToken} from 'pages/Reward/components/api';
import { deployVaults } from '@Launch/tests/initVaults';

const DeployToken = () => {
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const {ERC20AFACTORY_ADDRESS, ERC20BFACTORY_ADDRESS, ERC20CFACTORY_ADDRESS} =
    DEPLOYED;

  const TOKEN_FACTORY_ADDRESS =
    values.tokenType === 'A'
      ? ERC20AFACTORY_ADDRESS
      : values.tokenType === 'B'
      ? ERC20BFACTORY_ADDRESS
      : ERC20CFACTORY_ADDRESS;

  const ERC20_FACTORY_A = useContract(
    TOKEN_FACTORY_ADDRESS,
    ERC20_FACTORY_A_ABI.abi,
  );
  // @ts-ignore
  const {data: appConfig} = useAppSelector(selectApp);
  const {
    data: {hashKey},
  } = useAppSelector(selectLaunch);
  const dispatch = useAppDispatch();

  const {isTokenDeployed, tokenName, totalSupply, tokenAddress, tokenSymbol} =
    values;
  const {account} = useActiveWeb3React();

  async function deployToken() {
    try {
      const {tokenName, tokenSymbol, totalSupply, owner} = values;
      const tx = await ERC20_FACTORY_A?.create(
        tokenName,
        tokenSymbol,
        convertToWei(String(totalSupply)),
        owner,
      );

      dispatch(
        setTempHash({
          data: tx.hash,
        }),
      );

      const receipt = await tx.wait();
      const {logs} = receipt;

      const iface = new ethers.utils.Interface(
        values.tokenType === 'A'
          ? ERC20_FACTORY_A_ABI.abi
          : values.tokenType === 'B'
          ? ERC20_FACTORY_B_ABI.abi
          : ERC20_FACTORY_C_ABI.abi,
      );
      const result = iface.parseLog(logs[logs.length - 1]);
      const {args} = result;

      //args[0] : token address
      //args[1] : token name
      //args[2] : token symbol
      setFieldValue('tokenAddress', args[0]);
      setFieldValue('isTokenDeployed', true);
      createToken(args[0], values.tokenSymbolImage || '');
      // TODO: run script to deploy all vaults
    } catch (e) {
      console.log(e);
      //need to add change states
      setFieldValue('isTokenDeployedErr', true);
    }
  }

  return (
    <GridItem
      {...OpenCampaginDesign.border({colorMode})}
      borderRadius={4}
      gridColumnStart={1}
      gridColumnEnd={3}
      rowStart={1}
      rowEnd={3}
      bg={isTokenDeployed ? 'blue.500' : 'none'}
      w={'684px'}
      h={'472px'}
      pl={'40px'}
      pr={'30px'}
      pt={'30px'}
      pb={'35px'}>
      <Flex flexDir={'column'}>
        <Box d="flex" justifyContent={'space-between'}>
          <Text
            color={isTokenDeployed ? 'white.100' : 'gray.400'}
            fontSize={18}
            h={'24px'}>
            Token {values.tokenType}
          </Text>
          <Text
            color={isTokenDeployed ? 'white.100' : '#03c4c6'}
            fontSize={16}
            h={'21px'}>
            {isTokenDeployed ? 'Completed' : 'Ready to deploy'}
          </Text>
        </Box>
        <Text
          fontSize={60}
          h={'79px'}
          color={
            isTokenDeployed
              ? 'white.100'
              : colorMode === 'light'
              ? 'black.300'
              : 'white.100'
          }
          fontWeight={600}
          mb={'186px'}>
          {tokenName}
        </Text>
        <Box d="flex" flexDir={'column'} mb={'20px'}>
          <Text
            color={isTokenDeployed ? 'white.100' : 'gray.400'}
            opacity={isTokenDeployed ? 0.5 : 1}
            fontSize={15}
            h={'20px'}>
            Address
          </Text>
          <Link
            w={'100%'}
            isExternal={true}
            outline={'none'}
            _focus={{
              outline: 'none',
            }}
            _hover={{
              color: isTokenDeployed ? '#0070ed' : {},
            }}
            href={`${appConfig.explorerLink}${tokenAddress}`}
            color={
              isTokenDeployed
                ? 'white.100'
                : colorMode === 'light'
                ? 'gray.250'
                : 'white.100'
            }
            fontSize={22}
            h={'29px'}
            fontWeight={600}
            textDecoration={isTokenDeployed ? 'underline' : {}}
            // borderBottom={'1px solid #fff'}
          >
            {tokenAddress ? shortenAddress(tokenAddress) : '-'}
          </Link>
        </Box>
        <Box d="flex" justifyContent={'space-between'}>
          <Flex flexDir={'column'}>
            <Text
              color={isTokenDeployed ? 'white.100' : 'gray.400'}
              opacity={isTokenDeployed ? 0.5 : 1}
              fontSize={15}
              h={'20px'}>
              Total Supply
            </Text>
            <Text
              color={
                isTokenDeployed
                  ? 'white.100'
                  : colorMode === 'light'
                  ? 'gray.250'
                  : 'white.100'
              }
              fontSize={22}
              h={'29px'}
              fontWeight={600}>
              {commafy(totalSupply)}
            </Text>
          </Flex>
          <Button
            w={'180px'}
            h={'45px'}
            bg={'blue.500'}
            mt={'auto'}
            color={'white.100'}
            opacity={isTokenDeployed ? 0.5 : 1}
            border={isTokenDeployed ? '1px solid #ffffff' : ''}
            fontSize={14}
            fontWeight={500}
            _hover={{}}
            isDisabled={isTokenDeployed}
            // onClick={() => deployToken()}
            onClick={() => {
              dispatch(
                openModal({
                  type: 'Launch_ConfirmToken',
                  data: {
                    tokenInfo: {tokenName, totalSupply, tokenSymbol},
                    func: () => deployToken(),
                  },
                }),
              );
            }}>
            {isTokenDeployed ? 'Done' : 'Deploy'}
          </Button>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default DeployToken;
