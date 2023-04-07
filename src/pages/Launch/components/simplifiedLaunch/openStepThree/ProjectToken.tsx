import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Image,
  Button,
} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {useFormikContext} from 'formik';
import {Projects} from '@Launch/types';
import {DEPLOYED} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useContract} from 'hooks/useContract';
import * as ERC20_FACTORY_A_ABI from 'services/abis/ERC20AFactory.json';
import {convertToWei} from 'utils/number';
import {selectLaunch, setTempHash} from '@Launch/launch.reducer';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {ethers} from 'ethers';
import {createToken} from 'pages/Reward/components/api';
import {openModal} from 'store/modal.reducer';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

const ProjectToken = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const {ERC20AFACTORY_ADDRESS, ERC20BFACTORY_ADDRESS, ERC20CFACTORY_ADDRESS} =
    DEPLOYED;
  const {account} = useActiveWeb3React();
  const ERC20_FACTORY_A = useContract(
    ERC20AFACTORY_ADDRESS,
    ERC20_FACTORY_A_ABI.abi,
  );

  const dispatch: any = useAppDispatch();

  const details = [
    {
      name: 'Token Name',
      value: `${values.tokenName}`,
    },
    {
      name: 'Token Symbol',
      value: `${values.tokenSymbol}`,
    },
    {
      name: 'Total Supply',
      value: `${values.totalSupply?.toLocaleString()} ${values.tokenSymbol}`,
    },
  ];

  const {isTokenDeployed, tokenName, totalSupply, tokenAddress, tokenSymbol} =
    values;

  async function deployToken() {
    try {
      const {tokenName, tokenSymbol, totalSupply, ownerAddress} = values;
      const tx = await ERC20_FACTORY_A?.create(
        tokenName,
        tokenSymbol,
        convertToWei(String(totalSupply)),
        ownerAddress,
      );

      dispatch(
        setTempHash({
          data: tx.hash,
        }),
      );
      store.dispatch(setTxPending({tx: true}));
      toastWithReceipt(tx, setTxPending, 'Launch');
      const receipt = await tx.wait();
      const {logs} = receipt;
      const iface = new ethers.utils.Interface(ERC20_FACTORY_A_ABI.abi);
      const result = iface.parseLog(logs[logs.length - 1]);
      const {args} = result;
      setFieldValue('tokenAddress', args[0]);
      setFieldValue('isTokenDeployed', true);

      createToken(args[0], values.tokenSymbolImage || '');
    } catch (e) {
      setFieldValue('isTokenDeployedErr', true);
    }
  }

  return (
    <Flex
      mt="30px"
      h="489px"
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
          mt="19px"
          mb="21px"
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Project Token
        </Text>
      </Flex>
      <Flex mt="30px" flexDir={'column'} px="20px" w="100%">
        {details.map((detail: any, index: number) => {
          return (
            <Flex
              key={index}
              w="100%"
              justifyContent={'space-between'}
              h="45px">
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
                color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
                {detail.value}
              </Text>
            </Flex>
          );
        })}
        <Text
          mt="35px"
          textAlign={'center'}
          fontWeight={500}
          fontSize="13px"
          color={'#ff3b3b'}>
          Warning
        </Text>
        <Text
          textAlign={'center'}
          mt="10px"
          fontWeight={500}
          fontSize="12px"
          color={colorMode === 'dark' ? 'white.200' : 'gray.225'}>
          The team will create a TOS Reward Program (TOS) fund by buying $100
          worth of TOS tokens on a daily basis. The fund will be used to reward
          to the contributors who have worked on the following categories:
        </Text>
      </Flex>
      <Flex
        mt="26px"
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
          _hover={isTokenDeployed? {}:{bg:'#2a72e5'}}
          _focus={isTokenDeployed? {}:{bg:'#2a72e5'}}
          _active={isTokenDeployed? {}:{bg:'#2a72e5'}}
          _disabled={{
            background: colorMode === 'dark' ? '#353535' : '#e9edf1',
            color: colorMode === 'dark' ? '#838383' : '#86929d',
            cursor: 'not-allowed',
          }}
          isDisabled={isTokenDeployed}
          borderRadius={4}
          onClick={() => {
            deployToken();
            // dispatch(
            //   openModal({
            //     type: 'Launch_ConfirmTokenSimplified',
            //     data: {
            //       tokenInfo: {tokenName, totalSupply, tokenSymbol},
            //       func: () => deployToken(),
            //     },
            //   }),
            // );
          }}>
          {isTokenDeployed ? 'Done' : 'Deploy'}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProjectToken;
