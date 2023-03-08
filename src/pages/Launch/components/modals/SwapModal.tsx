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
  Progress,
} from '@chakra-ui/react';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {DEPLOYED} from 'constants/index';
import {useActiveWeb3React} from 'hooks/useWeb3';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';
import {useSwapModal} from '@Launch/hooks/useSwapModal';

import TokamakSymbol from 'assets/svgs/tokamak_favicon.svg';
import TosSymbol from 'assets/svgs/tos_symbol.svg';
import commafy from 'utils/commafy';
import {selectTransactionType} from 'store/refetch.reducer';
import * as PublicSaleLogicAbi from 'services/abis/PublicSaleLogic.json';
import {useContract} from 'hooks/useContract';
import {convertToRay, convertToWei} from 'utils/number';
import * as LibPublicSale from 'services/abis/LibPublicSale.json';
import {useSwapMax} from '@Launch/hooks/useSwapMax';
const SwapModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {pools} = DEPLOYED;
  const {account, library} = useActiveWeb3React();
  const [balance, setBalance] = useState<string>('0');
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [inputAmount, setInputAmount] = useState<string>('0');
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const [max, setMax] = useState<string>('0');
  const PublicVaultContract = useContract(
    data?.data?.publicVaultAddress,
    PublicSaleLogicAbi.abi,
  );

  const {WTON_BALANCE, tosAmountOut: basicPrice} = useSwapModal(
    1,
    data?.data?.publicVaultAddress,
  );

  useEffect(() => {
    const getDetails = async () => {
      if (PublicVaultContract && WTON_BALANCE !== '-') {
        const isExchangeTOS = await PublicVaultContract.exchangeTOS();

        const bal = isExchangeTOS
          ? WTON_BALANCE
          : (data?.data?.hardcap).toString();
        setBalance(bal);
      }
    };

    getDetails();
  }, [PublicVaultContract, WTON_BALANCE, data, transactionType, blockNumber]);

  const maxAmount = useSwapMax(Number(balance.replaceAll(',', '')));
  const maxInput = useSwapMax(Number(inputAmount.replaceAll(',', '')));

  const {tosAmountOut} = useSwapModal(
    isNaN(Number(inputAmount.replaceAll(',', ''))) ||
      Number(inputAmount.replaceAll(',', '')) === 0
      ? 0
      : Number(inputAmount.replaceAll(',', '')),
    data?.data?.publicVaultAddress,
  );

  useEffect(() => {
    if (Number(inputAmount.replaceAll(',', '')) !== 0) {
      setMax(maxInput);
    } else {
      setMax(maxAmount);
    }
  }, [inputAmount, maxAmount, maxInput]);

  const priceImpact = useMemo(() => {
    const numTosAmountOut = Number(tosAmountOut.replaceAll(',', ''));

    const numBasicPrice = Number(basicPrice.replaceAll(',', ''));

    const numInputAmount = Number(inputAmount.replaceAll(',', ''));

    const theoreticalValue = numInputAmount * numBasicPrice;

    const priceDiff = (theoreticalValue - numTosAmountOut) / theoreticalValue;
    const result = priceDiff * 100;

    return isNaN(result) || result === Infinity || result === -Infinity
      ? '-'
      : commafy(result);
  }, [tosAmountOut, basicPrice, inputAmount]);

  const exchangeTonToTos = useCallback(() => {
    console.log('go');
    console.log(data);

    //https://www.notion.so/onther/PublicSale-Front-interface-b139403abc0f41df9af75559eba87e58
    try {
      if (PublicVaultContract && inputAmount && pools) {
        const inputAmountRay = convertToRay(inputAmount);
        const {TOS_WTON_POOL} = pools;

        return PublicVaultContract.exchangeWTONtoTOS(
          inputAmountRay,
          TOS_WTON_POOL,
        );
      }
    } catch (e) {
      console.log(e);
    }
  }, [PublicVaultContract, inputAmount, pools]);

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

  return (
    <Modal
      isOpen={data.modal === 'Launch_Swap' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
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
              Swap TON to TOS
              <Text
                color={colorMode === 'light' ? '#86929d' : '#9d9ea5'}
                fontSize={'12px'}
                fontWeight="normal"
                mt="2px">
                & Send TOS to Initial Liquidity Vault
              </Text>
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
                <Flex w={'18.2px'} h={'18.2px'} mr={'9.6px'}>
                  <Image src={TokamakSymbol}></Image>
                </Flex>
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  fontSize="16px">
                  TON
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
                    fontSize={20}
                    fontWeight={'bold'}
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
                  Balance: {balance} {'WTON'}
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
                  onClick={() => setInputAmount(max.replace(/,/g, ''))}>
                  MAX
                </Button>
              </Flex>
            </Flex>
            <Image m={'20px 0px'} src={swapArrow}></Image>
            <Flex
              w="300px"
              h="110px"
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              borderRadius="10px"
              pt={'14px'}
              pl="25px"
              pr="14px"
              pb={'16px'}
              flexDir={'column'}>
              <Flex
                justifyContent={'space-between'}
                alignItems="center"
                h="24px">
                <Flex alignItems={'center'}>
                  <Flex w={'18.2px'} h={'18.2px'} mr={'9.6px'}>
                    <Image src={TosSymbol}></Image>
                  </Flex>
                  <Text
                    fontFamily={theme.fonts.roboto}
                    color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                    fontWeight={'bold'}
                    fontSize="16px">
                    TOS
                  </Text>
                </Flex>
                <Text
                  fontFamily={theme.fonts.roboto}
                  color={colorMode === 'light' ? '#3d495d' : '#ffffff'}
                  fontWeight={'bold'}
                  lineHeight={1.5}
                  fontSize="20px">
                  {Number(inputAmount) <= 0 ? '0.00' : commafy(tosAmountOut)}
                </Text>
              </Flex>
              <Text
                fontSize={'12px'}
                mt={'10px'}
                fontWeight={500}
                color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                lineHeight={1.33}>
                1 TON = {commafy(basicPrice)} TOS
              </Text>
              <Text
                fontSize={'12px'}
                fontWeight={500}
                color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                lineHeight={1.33}>
                Price Impact : {priceImpact}%
              </Text>
              {/* <Text
                fontSize={'12px'}
                fontWeight={500}
                color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                lineHeight={1.33}>
                Average Price Impact : 5%
              </Text> */}
            </Flex>
            {/* progress bar part                                   */}
            <Flex
              flexDir={'column'}
              w={'100%'}
              mt={'25px'}
              mb={'30px'}
              px={'25px'}
              fontSize={13}
              justifyContent={'space-between'}
              alignItems="center">
              <Box
                d="flex"
                justifyContent={'space-between'}
                alignItems={'center'}
                w={'100%'}
                h={'19px'}
                mb={'5px'}
                fontFamily={theme.fonts.fld}>
                <Flex alignItems={'center'} h={'19px'}>
                  <Text fontSize={15} color={'#3f536e'} h={'19px'}>
                    Expected Progress
                  </Text>
                  <Text
                    ml={'8px'}
                    fontSize={13}
                    color={'#0070ed'}
                    height={'23px'}
                    lineHeight={'27px'}
                    verticalAlign={'bottom'}>
                    {(
                      ((Number(data?.data?.transferredTon) +
                        Number(inputAmount)) /
                        data?.data?.hardcap) *
                      100
                    ).toLocaleString()}{' '}
                    %
                  </Text>
                </Flex>
                <Text
                  fontSize={12}
                  color={'#3a495f'}
                  height={'23px'}
                  lineHeight={'27px'}
                  verticalAlign={'bottom'}>
                  {Number(data?.data?.transferredTon) + Number(inputAmount)} /
                  {data?.data?.hardcap} TON
                </Text>
              </Box>
              <Progress
                w={'100%'}
                h={'6px'}
                mt={'5px'}
                borderRadius={'100px'}
                value={
                  ((data?.data?.transferredTon + Number(inputAmount)) /
                    data?.data?.hardcap) *
                  100
                }></Progress>
            </Flex>
            <Text margin={'0px 25px 25px'} fontSize="12px" textAlign={'center'}>
              This interface is designed to prevent sandwich attack. The txn
              will revert if the conditions for the price impact and the average
              price are not met.
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
            disabled={Number(balance) < Number(inputAmount)}
            onClick={() => exchangeTonToTos()}>
            Swap & Send
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SwapModal;
