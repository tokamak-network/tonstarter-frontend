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
import React, {useCallback, useEffect, useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import {DEPLOYED} from 'constants/index';
import {useERC20Token} from 'hooks/useERC20Token';
import {useActiveWeb3React} from 'hooks/useWeb3';
import swapArrow from 'assets/svgs/swap_arrow_icon.svg';
import Line from '../common/Line';
import {useContract} from 'hooks/useContract';
import * as vestingAbi from 'services/abis/VestingPublicFund.json';
import {TokenImage} from '@Admin/components/TokenImage';
import TON_SYMBOL from 'assets/tokens/TON_symbol_nobg.svg';
import {shortenAddress} from 'utils/address';
import {fetchUsdPriceURL, fetchTonPriceURL} from 'constants/index';

const VestingClaimModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {TON_ADDRESS, WTON_ADDRESS} = DEPLOYED;
  const {account, library} = useActiveWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [tonInDollars, setTonInDollars] = useState(0);


  useEffect(() => {
    async function getTonPrice() {
      const usdPriceObj = await fetch(fetchUsdPriceURL).then((res) =>
        res.json(),
      );
      const tonPriceObj = await fetch(fetchTonPriceURL).then((res) =>
        res.json(),
      );
      const tonPriceKRW = tonPriceObj[0].trade_price;
      const krwInUsd = usdPriceObj.rates.USD;

      const tonPriceInUsd = tonPriceKRW * krwInUsd;
      console.log(tonPriceInUsd);
      setTonInDollars(tonPriceInUsd);
    }
    getTonPrice();
  }, []);


  const VestingVaultContract = useContract(
    data?.data?.vestingVaultAddress,
    vestingAbi.abi,
  );

  const claim = useCallback(() => {
    if (VestingVaultContract) {
      return VestingVaultContract.claim();
    }
  }, [VestingVaultContract]);
  
  return (
    <Modal
      isOpen={data.modal === 'Launch_Vesting' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        minH={'574px'}
        maxHeight={'574px'}
        pt="20px"
        pb="25px">
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Flex flexDir={'column'}>
            <Box display="flex" justifyContent={'center'}>
              <Text
                fontSize={20}
                fontWeight={'bold'}
                color={colorMode === 'light' ? '#3d495d' : '#ffffff'}>
                Claim Rounds
              </Text>
            </Box>
            <Box mt={'20px'} mb={'30px'}>
              <Line></Line>
            </Box>
            <Box
              d="flex"
              flexDir={'column'}
              justifyContent={'center'}
              alignItems={'center'}>
              <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mb={'35px'}>
                <Text
                  fontSize={20}
                  fontWeight={'bold'}
                  color={colorMode === 'dark' ? 'white.100' : '#3d495d'}
                  h={'26px'}
                  mb={'6px'}>
                  Round {data?.data?.currentRnd}
                </Text>
                <Text
                  fontSize={13}
                  fontWeight={500}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#86929d'}>
                  of {data?.data?.totalRounds} Rounds
                </Text>
              </Flex>
              <Flex
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                mb={'30px'}>
                <Text
                  fontSize={13}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'white.100' : '#304156'}
                  h={'18px'}
                  mb={'12px'}>
                  Claim Amount
                </Text>
                <Flex
                  w={'300px'}
                  h={'78px'}
                  border={
                    colorMode === 'dark'
                      ? '1px solid #535353'
                      : '1px solid #d7d9df'
                  }
                  borderRadius={'10px'}
                  p={'14px 14px 16px 25px'}
                  flexDir={'column'}
                  mb={'15px'}>
                  <Box d="flex" justifyContent={'space-between'} w={'100%'}>
                    <Flex>
                      <Flex
                        h="26px"
                        w="26px"
                        borderRadius={'50%'}
                        border={'1px solid'}
                        mr='6px'
                        borderColor={
                          colorMode === 'dark' ? '#3c3c3c' : '#e7edf3'
                        }>
                        <Image src={TON_SYMBOL}></Image>
                      </Flex>

                      <Text
                        fontWeight={500}
                        fontSize={16}
                        color={colorMode === 'dark' ? 'white.100' : '#3d495d'}>
                        TON
                      </Text>
                    </Flex>

                    <Text fontSize={20}>{data?.data?.currentClaimAmount?data?.data?.currentClaimAmount.toLocaleString():0}</Text>
                  </Box>
                  <Box
                    fontSize={12}
                    color={colorMode === 'light' ? '#808992' : '#9d9ea5'}>
                    Current Value: ${(tonInDollars * Number(data?.data?.currentClaimAmount)).toLocaleString()}
                  </Box>
                </Flex>
                <Flex
                  w={'100%'}
                  h={'45px'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <Text color={colorMode === 'dark' ? '#949494' : '#808992'}>
                    Vault Contract Address
                  </Text>
                  <Text color={colorMode === 'dark' ? 'white.100' : '#3d495d'}>
                    {shortenAddress(
                      data?.data?.vestingVaultAddress
                        ? data?.data?.vestingVaultAddress
                        : '',
                    )}
                  </Text>
                </Flex>
                <Flex
                  w={'100%'}
                  h={'45px'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center"
                  mb={'px'}>
                  <Text color={colorMode === 'dark' ? '#949494' : '#808992'}>
                    Address for Receiving Funds <br />
                    from the Vesting Vault
                  </Text>
                  <Text color={colorMode === 'dark' ? 'white.100' : '#3d495d'}>
                    {shortenAddress(
                      data?.data?.fundsAddress ? data?.data?.fundsAddress : '',
                    )}
                  </Text>
                </Flex>
                {/* progress bar part */}
                <Flex
                  mt="30px"
                  flexDir={'column'}
                  w={'100%'}
                  fontSize={13}
                  justifyContent={'space-between'}
                  alignItems="center">
                  <Box
                    d="flex"
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    h={'19px'}
                    w="100%"
                    mb={'5px'}>
                    <Flex
                      alignItems={'center'}
                      h={'19px'}
                      fontFamily={'Rajdhani'}>
                      <Text
                        fontSize={'15px'}
                        lineHeight={1.27}
                        color={colorMode === 'dark' ? '#dee4ef' : '#3f536e'}
                        h={'19px'}>
                        Expected Progress
                      </Text>
                      <Text
                        ml={'8px'}
                        fontSize={'13px'}
                        color={'#0070ed'}
                        height={'23px'}
                        lineHeight={'27px'}
                        verticalAlign={'bottom'}>
                      {(((data?.data?.accRound+Number(data?.data?.currentClaimAmount) )/data?.data?.accTotal)*100).toLocaleString()}%
                      </Text>
                    </Flex>
                    <Text
                      fontSize={'12px'}
                      color={colorMode === 'dark' ? '#9d9ea5' : '#3a495f'}
                      height={'23px'}
                      lineHeight={'27px'}
                      fontFamily={'Rajdhani'}
                      verticalAlign={'bottom'}>
                      {data?.data?.accRound && (data?.data?.accRound+Number(data?.data?.currentClaimAmount) ).toLocaleString() } /{data?.data?.accTotal && data?.data?.accTotal.toLocaleString()}TON
                    </Text>
                  </Box>
                  <Progress
                    value={(data?.data?.accRound/data?.data?.accTotal)*100}
                    w={'100%'}
                    h={'6px'}
                    mt={'5px'}
                    bg={colorMode === 'dark' ? '#353d48' : '#e7edf3'}
                    borderRadius={'100px'}></Progress>
                </Flex>
              </Flex>
            </Box>
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
            onClick={() => claim()}>
            Claim
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VestingClaimModal;
