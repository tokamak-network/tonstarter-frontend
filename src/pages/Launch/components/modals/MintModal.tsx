import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useTheme,
  useColorMode,
  Input,
  NumberInput,
  NumberInputField,
  Image,
} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {DEPLOYED} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import swapArrow from 'assets/svgs/swap_arrow_icon.svg';
import {Contract} from '@ethersproject/contracts';
import {convertNumber} from 'utils/number';
// import {fetchSwapPayload} from 'pages/Staking/StakeOptionModal/utils/fetchSwapPayload';
import commafy from 'utils/commafy';
import * as ERC20 from 'services/abis/ERC20.json';
import {getSigner} from 'utils/contract';
import InitialLiquidityComputeAbi from 'services/abis/Vault_InitialLiquidityCompute.json';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {setTxPending} from 'store/tx.reducer';
import {openToast} from 'store/app/toast.reducer';
import {utils} from 'ethers';

const MintModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {TON_ADDRESS, WTON_ADDRESS, TOS_ADDRESS} = DEPLOYED;
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal, handleOpenConfirmModal} = useModal();
  const [distributable, setDistributable] = useState<number>(0);
  const [programDuration, setProgramDuration] = useState<any[]>([0, 0]);
  const [balance, setBalance] = useState('0');
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [tosBalance, setTosBalance] = useState<string>('0');
  const themeDesign = {
    border: {
      light: 'solid 1px #e6eaee',
      dark: 'solid 1px #373737',
    },
    font: {
      light: 'black.300',
      dark: 'gray.475',
    },
    tosFont: {
      light: '#2a72e5',
      dark: 'black.100',
    },
    borderDashed: {
      light: 'dashed 1px #dfe4ee',
      dark: 'dashed 1px #535353',
    },
    buttonColorActive: {
      light: 'gray.225',
      dark: 'gray.0',
    },
    buttonColorInactive: {
      light: '#c9d1d8',
      dark: '#777777',
    },
  };

  const {symbol, amount, project, vault} = data?.data;

  const mint = async () => {
    if (account === null || account === undefined || library === undefined) {
      return;
    }
    const signer = getSigner(library, account);
    const InitialLiquidityCompute = new Contract(
      vault.vaultAddress,
      InitialLiquidityComputeAbi.abi,
      library,
    );
    const mintAmount = utils.parseUnits(tosBalance,18)
   
    
    try {
      const receipt = await InitialLiquidityCompute.connect(signer).mint(mintAmount);
      store.dispatch(setTxPending({tx: true}));
      handleCloseMintModal();
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, 'Launch');
        await receipt.wait();
      
      }
    } catch (e) {
      console.log(e);

      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  };
  useEffect(() => {
    async function getTOSBalance() {

      if (
        account === null ||
        account === undefined ||
        library === undefined ||
        data.data.vault === undefined
      ) {
        return;
      }
      const contract = new Contract(TOS_ADDRESS, ERC20.abi, library);
      const vaultBalance = await contract.balanceOf(
        data.data.vault?.vaultAddress,
      );

      const convertedBalance = convertNumber({
        amount: vaultBalance.toString(),
        localeString: true,
        round: false,
        type: 'custom',
        decimalPoints: 18,
      }) as string;

      setBalance(convertedBalance);
    }
    getTOSBalance();
  }, [data]);

  useEffect(() => {
    if (inputAmount.length > 1 && inputAmount.startsWith('0')) {
      setInputAmount(inputAmount.slice(1, inputAmount.length));
    }
    if (inputAmount.split('.')[1] !== undefined) {
      return setInputAmount(
        `${inputAmount.split('.')[0]}.${inputAmount.split('.')[1].slice(0, 2)}`,
      );
    }
  }, [inputAmount, setInputAmount]);

  useEffect(() => {
    setTosBalance((Number(inputAmount) * project?.tosPrice).toLocaleString());
  }, [inputAmount, data]);
  const handleCloseMintModal = () => {
    setInputAmount('0');
    handleCloseModal();
  };
  return (
    <Modal
      isOpen={data.modal === 'Launch_Mint' ? true : false}
      isCentered
      onClose={() => {
        handleCloseMintModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseMintModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Heading
              fontSize={'20px'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              Mint
            </Heading>
          </Box>
          <Flex justifyContent={'center'} alignItems="center" flexDir="column">
            <Flex
              w="300px"
              h="78px"
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              borderRadius="10px"
              mt="15px"
              pt={'16px'}
              pl="25px"
              pr="14px"
              flexDir={'column'}>
              <Flex justifyContent={'space-between'} alignItems="center">
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  fontSize="16px">
                  TOS
                </Text>
                <NumberInput
                  h="24px"
                  value={Number(inputAmount) <= 0 ? 0 : inputAmount}
                  onChange={(value) => {
                    if (
                      (value === '0' || value === '00') &&
                      value.length <= 2
                    ) {
                      return null;
                    }
                    if (value === '') {
                      return setInputAmount('0');
                    }
                    return setInputAmount(value);
                  }}>
                  <NumberInputField
                    placeholder="0.00"
                    h="24px"
                    textAlign={'right'}
                    errorBorderColor="red.300"
                    verticalAlign={'sub'}
                    border="none"
                    _focus={{
                      borderWidth: 0,
                    }}
                    pr="0px"
                    _active={{
                      borderWidth: 0,
                    }}></NumberInputField>
                </NumberInput>
              </Flex>
              <Flex alignItems="center" mt="6px">
                <Text
                  fontSize={'12px'}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}>
                  Balance: {balance} TOS
                </Text>
                <Button
                  fontSize={'12px'}
                  w={'50px'}
                  h={'20px'}
                  ml={'11px'}
                  bg="transparent"
                  _hover={{bg: 'transparent'}}
                  _focus={{bg: 'transparent'}}
                  _active={{bg: 'transparent'}}
                  color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                  border={
                    colorMode === 'dark'
                      ? '1px solid #535353'
                      : '1px solid #d7d9df'
                  }
                  onClick={() => setInputAmount(balance.replace(/,/g, ''))}>
                  MAX
                </Button>
              </Flex>
            </Flex>
            <Image m={'20px 0px'} src={swapArrow}></Image>
            <Flex
              w="300px"
              h="52px"
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              borderRadius="10px"
              pt={'14px'}
              pl="25px"
              pr="14px"
              flexDir={'column'}>
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                h="24px">
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  fontSize="16px">
                  {symbol}
                </Text>
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  lineHeight={1.5}
                  fontSize="20px">
                  {tosBalance}
                </Text>
              </Flex>
            </Flex>
            <Text
              margin={'35px 25px 25px'}
              fontSize="12px"
              textAlign={'center'}>
              Depending on the liquidity of the WTON-TOS pool, slippage may
              occur.
              <span style={{color: '#ff3b3b'}}>
                {' '}
                If slippage of 10% or more occurs, the operation will be
                cancelled. Therefore, it is recommended to input an appropriate
                amount of TON according to the liquidity of the pool.{' '}
              </span>
              If the exchange rate of WTON-TOS is not within the range of the
              average exchange rate of the last 2 minutes + -5% of the exchange
              rate of WTON-TOS, the operation will be canceled.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter
          justifyContent={'center'}
          p="0px"
          borderTop={
            colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
          }>
          <Button
            mt="25px"
            w="150px"
            h="38px"
            bg={'#257eee'}
            _hover={{background: ''}}
            _active={{background: ''}}
            _focus={{background: ''}}
            fontSize="14px"
            color="white"
            onClick={mint}>
            Mint
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MintModal;
