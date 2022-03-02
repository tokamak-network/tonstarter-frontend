import {
  Flex,
  useTheme,
  Box,
  GridItem,
  useColorMode,
  Text,
  Button,
} from '@chakra-ui/react';
import {shortenAddress} from 'utils';
import * as ERC20_FACTORY_A_ABI from 'services/abis/ERC20AFactory.json';
import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {convertToWei} from 'utils/number';
import {ethers} from 'ethers';
import {useState} from 'react';

const DeployToken = () => {
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {ERC20AFACTORY_ADDRESS} = DEPLOYED;
  const ERC20_FACTORY_A = useContract(
    ERC20AFACTORY_ADDRESS,
    ERC20_FACTORY_A_ABI.abi,
  );
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const isTokenDeployed = values.isTokenDeployed;

  async function deployToken() {
    try {
      //@ts-ignore
      const {tokenName, tokenSymbol, totalSupply, owner} = values;
      console.log(tokenName, tokenSymbol, totalSupply, owner);
      const tx = await ERC20_FACTORY_A?.create(
        tokenName,
        tokenSymbol,
        convertToWei(totalSupply),
        owner,
      );
      const receipt = await tx.wait();
      const {logs} = receipt;
      const iface = new ethers.utils.Interface(ERC20_FACTORY_A_ABI.abi);
      const result = iface.parseLog(logs[10]);
      const {args} = result;
      //args[0] : token address
      //args[1] : token name
      //args[2] : token symbol
      setFieldValue('tokenAddress', args[0]);
      setFieldValue('isTokenDeployed', true);
    } catch (e) {
      console.log(e);
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
            Token
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
          color={isTokenDeployed ? 'white.100' : 'black.300'}
          fontWeight={600}
          mb={'186px'}>
          TON
        </Text>
        <Box d="flex" flexDir={'column'} mb={'20px'}>
          <Text
            color={isTokenDeployed ? 'white.100' : 'gray.400'}
            opacity={isTokenDeployed ? 0.5 : 1}
            fontSize={15}
            h={'20px'}>
            Address
          </Text>
          <Text
            color={isTokenDeployed ? 'white.100' : 'gray.250'}
            fontSize={22}
            h={'29px'}
            fontWeight={600}>
            {shortenAddress('0x0000000000000000')}
          </Text>
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
              color={isTokenDeployed ? 'white.100' : 'gray.250'}
              fontSize={22}
              h={'29px'}
              fontWeight={600}>
              50,000,000
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
            onClick={() => deployToken()}>
            {isTokenDeployed ? 'Done' : 'Deploy'}
          </Button>
        </Box>
      </Flex>
    </GridItem>
  );
};

export default DeployToken;
