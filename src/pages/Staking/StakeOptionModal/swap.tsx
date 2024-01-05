import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Button,
  Flex,
  Tooltip,
  Stack,
  useTheme,
  Image,
  useColorMode,
  Avatar,
  NumberInput,
  NumberInputField,
  Link,
  Input,
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect, useMemo} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {swapWTONtoTOS} from '../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useModal} from 'hooks/useModal';
import {useCheckBalance} from 'hooks/useCheckBalance';
import {CloseButton} from 'components/Modal/CloseButton';
import {convertToRay} from 'utils/number';
// import {LoadingDots} from 'components/Loader/LoadingDots';
import swapArrow from 'assets/svgs/swap-arrow-icon.svg';
import commafy from 'utils/commafy';
import TON_SYMBOL from 'assets/tokens/TON_symbol_nobg.svg';
import TOS_SYMBOL from 'assets/tokens/TOS_symbol.svg';
import TOS_symbolDark from 'assets/tokens/TOS_symbolDark.svg';
import {useSwapModal} from '@Launch/hooks/useSwapModal';
// import {useSwapMax} from '@Launch/hooks/useSwapMax';
import {useSwapStake} from '../hooks/useSwapStake';
import {useStable} from '../hooks/useStable';
import SettingIcon from 'assets/svgs/setting_icon_normal.svg';
import SettingHoverIcon from 'assets/svgs/setting_icon_hover.svg';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import BackButtonIcon from 'assets/back_arrow_icon.svg';

const SwapTab = ({setIsSwapTab}: {setIsSwapTab: any}) => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [max, setMax] = useState<string>('0');

  const {
    data: {
      contractAddress,
      swapBalance,
      originalSwapBalance,
      currentTosPrice,
      unstakeL2Disable,
      withdrawDisable,
      swapDisabled,
      stakedL2,
      stakedRatio,
      canWithdralAmount,
      name,
      canUnstakedL2,
      unstakeAll,
      withdrawTooltip,
    },
  } = sub;

  const {handleOpenConfirmModal} = useModal();

  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  const maxAmount = useSwapStake(Number(swapBalance));
  const maxInput = useSwapStake(Number(inputAmount.replaceAll(',', '')));

  const stableAmount = useStable();

  useEffect(() => {
    setMax(maxAmount);
  }, [maxAmount]);

  const {tosAmountOut: basicPrice} = useSwapModal(1);

  const {tosAmountOut} = useSwapModal(
    isNaN(Number(inputAmount.replaceAll(',', ''))) ||
      Number(inputAmount.replaceAll(',', '')) === 0
      ? 0
      : Number(inputAmount.replaceAll(',', '')),
  );

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setInputAmount('0');
  };

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

  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <Flex flexDir={'column'}>
      <Stack
        pt="15px"
        as={Flex}
        justifyContent={'center'}
        alignItems={'center'}
        w={'full'}>
        <Text
          mt={'15px'}
          fontSize={13}
          color={colorMode === 'dark' ? 'white.200' : '#353c48'}
          fontWeight={700}
          h={'18px'}>
          TOS Mining Seignorage Swap
        </Text>
        <Flex
          w={'300px'}
          border={
            colorMode === 'light' ? '1px solid #D7D9DF' : '1px solid #535353'
          }
          flexDir={'column'}
          borderRadius={10}
          pt="12px"
          pl={'25px'}
          pr={'14px'}>
          <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            pt={'16px'}>
            <Avatar
              src={TON_SYMBOL}
              backgroundColor={'transparent'}
              bg="transparent"
              color="#c7d1d8"
              name={'token_image'}
              border={
                colorMode === 'light'
                  ? '1px solid #e7edf3'
                  : '1px solid #3c3c3c'
              }
              borderRadius={25}
              h="26px"
              w="26px"
              mr="6px"
            />

            <Text
              fontSize={16}
              fontWeight={600}
              color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
              textAlign={'center'}
              lineHeight={'24px'}>
              TON
            </Text>
            <NumberInput
              h="26px"
              ml="10px"
              borderRadius={'4px'}
              border={
                Number(inputAmount) > Number(maxAmount) ? '1px solid red' : ''
              }
              value={Number(inputAmount) <= 0 ? 0 : inputAmount}
              onChange={(value: string) => {
                if ((value === '0' || value === '00') && value.length <= 2) {
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
                // errorBorderColor="red.300"
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
          <Flex justifyContent={'flex-end'} pb={'14px'} pt={'13px'}>
            <Button
              w={'60px'}
              h={'20px'}
              fontSize={12}
              fontWeight={600}
              onClick={() => setInputAmount(stableAmount.replace(/,/g, ''))}
              type={'button'}
              variant="outline"
              mr="6px"
              borderColor={colorMode === 'dark' ? '#535353' : '#D7D9DF'}
              _focus={{
                outline: 'none',
              }}>
              STABLE
            </Button>
            <Button
              w={'60px'}
              h={'20px'}
              fontSize={12}
              fontWeight={600}
              onClick={() => setInputAmount(max.replace(/,/g, ''))}
              type={'button'}
              variant="outline"
              borderColor={colorMode === 'dark' ? '#535353' : '#D7D9DF'}
              _focus={{
                outline: 'none',
              }}>
              MAX
            </Button>
          </Flex>
          <Box
            w={'100%'}
            h={'1px'}
            borderWidth={1}
            borderColor={colorMode === 'dark' ? '#363636' : '#f4f6f8'}
            mt={'12px'}
            mb={'9px'}></Box>
          <Flex justifyContent={'space-between'} mb={'9px'}>
            <Text
              fontSize={12}
              color={colorMode === 'dark' ? 'gray.475' : '#808992'}
              fontWeight={600}>
              Available Seignorage
            </Text>
            <Flex alignItems={'center'}>
              <Text
                fontSize={12}
                color={colorMode === 'dark' ? 'gray.475' : '#808992'}
                fontWeight={600}
                mr={'3px'}>
                {Number(swapBalance).toLocaleString() || '-'} TON
              </Text>
              <Image
                src={isHovered ? SettingHoverIcon : SettingIcon}
                alt={'SettingIcon'}
                cursor={'pointer'}
                onClick={() => setIsSwapTab(false)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            </Flex>
          </Flex>
        </Flex>
      </Stack>
      <Flex
        flexDir={'column'}
        mt={'15px'}
        pt={'9px'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        w={'100%'}>
        <Text
          fontSize={12}
          color={colorMode === 'dark' ? 'gray.475' : '#808992'}
          fontWeight={600}
          mb={'9px'}>
          Summary
        </Text>
        <Flex
          justifyContent={'space-between'}
          pl={'25px'}
          pr={'39px'}
          w={'100%'}>
          <Flex alignItems={'center'}>
            <Text
              fontSize={12}
              color={colorMode === 'dark' ? 'gray.475' : '#808992'}
              fontWeight={600}
              mr={'3px'}>
              Your share from swap
            </Text>
            <Tooltip
              hasArrow
              placement="top"
              label={
                <Flex
                  flexDir="column"
                  fontSize="12px"
                  pt="6px"
                  pl="5px"
                  pr="5px">
                  <Text textAlign="center" fontSize="12px">
                    This is the amount of TOS that you will be able to claim at
                    the end of the mining date.
                  </Text>
                </Flex>
              }
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}
              p={0}
              w="227px"
              h="65px"
              borderRadius={3}
              fontSize="12px">
              <img src={tooltipIcon} alt={'tooltipIcon'} />
            </Tooltip>
          </Flex>
          <Flex flexDir={'column'} alignItems={'end'}>
            <Text
              fontSize={13}
              color={colorMode === 'dark' ? 'white.200' : '#3d495d'}
              fontWeight={600}
              h={'18px'}>
              {' '}
              {Number(tosAmountOut) <= 0 ||
              isNaN((Number(tosAmountOut) / 100) * Number(stakedRatio))
                ? '0.00'
                : ((Number(tosAmountOut) / 100) * Number(stakedRatio)).toFixed(
                    2,
                  )}
              <span
                style={{
                  fontSize: 11,
                  color: colorMode === 'dark' ? '#f3f4f1' : '#3d495d',
                  fontWeight: 'bold',
                }}>
                {' '}
                {' TOS'}
              </span>
            </Text>
            <Text
              fontSize={11}
              color={colorMode === 'dark' ? 'white.200' : '#808992'}
              h={'15px'}>
              ({stakedRatio} % of{' '}
              {Number(inputAmount) <= 0 ? '0.00' : commafy(tosAmountOut)}
              TOS)
            </Text>
          </Flex>
        </Flex>
        <Flex
          mt={'21px'}
          px={'25px'}
          fontSize={12}
          color={colorMode === 'dark' ? 'gray.475' : '#808992'}
          h={'80px'}
          lineHeight={1.33}>
          <Text>
            <span
              style={{
                fontWeight: 'bold',
                color: colorMode === 'dark' ? 'gray.475' : '#353c48',
              }}>
              WTON-TOS
            </span>{' '}
            pool swaps seigniorage to TOS. Sandwich attck check is done before
            swapping to verify that the price hasn’t changed significantly (+/-
            4.8%) compared to the 2-minute moving average. The maximum slippage
            allowed is 5.5%.
          </Text>
        </Flex>
      </Flex>
      <Box
        w={'320px'}
        h={'1px'}
        borderWidth={1}
        borderColor={colorMode === 'dark' ? '#363636' : '#f4f6f8'}
        mt={'35px'}
        mb={'25px'}
        px={'15px'}
        alignSelf={'center'}></Box>
      <Button
        w={'150px'}
        bg={
          swapDisabled || Number(inputAmount) === 0
            ? colorMode === 'dark'
              ? '#353535'
              : '#e9edf1'
            : 'blue.500'
        }
        color={
          swapDisabled || Number(inputAmount) === 0
            ? colorMode === 'dark'
              ? '#838383'
              : '#86929d'
            : 'white.100'
        }
        alignSelf={'center'}
        fontSize="14px"
        _hover={{...theme.btnHover}}
        disabled={
          Number(maxAmount) === 0 ||
          Number(inputAmount) === 0 ||
          Number(inputAmount) > Number(maxAmount) ||
          swapDisabled
        }
        onClick={() => {
          const isBalance = checkBalance(
            Number(inputAmount),
            Number(swapBalance),
          );
          if (isBalance) {
            const amountRay = convertToRay(inputAmount.toString());
            swapWTONtoTOS({
              userAddress: account,
              amount:
                isBalance !== 'balanceAll'
                  ? amountRay
                  : originalSwapBalance.toString(),
              contractAddress,
              library,
            });
            //   .then(() => {
            //   handleCloseModal();
            // });
          }
        }}>
        Swap
      </Button>
    </Flex>
  );
};

export const SwapModal = () => {
  const {sub} = useAppSelector(selectModalType);
  const {account, library} = useActiveWeb3React();
  const [inputAmount, setInputAmount] = useState<string>('0');
  const [max, setMax] = useState<string>('0');

  const {
    data: {
      contractAddress,
      swapBalance,
      originalSwapBalance,
      currentTosPrice,
      unstakeL2Disable,
      withdrawDisable,
      swapDisabled,
      stakedL2,
      stakedRatio,
      canWithdralAmount,
      name,
      canUnstakedL2,
      unstakeAll,
      withdrawTooltip,
    },
  } = sub;

  const {handleOpenConfirmModal, openAnyModal} = useModal();

  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {handleCloseConfirmModal} = useModal();
  const {checkBalance} = useCheckBalance();

  const maxAmount = useSwapStake(Number(swapBalance));
  const maxInput = useSwapStake(Number(inputAmount.replaceAll(',', '')));

  const stableAmount = useStable();

  useEffect(() => {
    setMax(maxAmount);
  }, [maxAmount]);

  const {tosAmountOut: basicPrice} = useSwapModal(1);

  const {tosAmountOut} = useSwapModal(
    isNaN(Number(inputAmount.replaceAll(',', ''))) ||
      Number(inputAmount.replaceAll(',', '')) === 0
      ? 0
      : Number(inputAmount.replaceAll(',', '')),
  );

  const [isSwapTab, setIsSwapTab] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleCloseModal = () => {
    handleCloseConfirmModal();
    setInputAmount('0');
    setIsSwapTab(true);
  };

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

  const SeignorageTab = () => {
    const {colorMode} = useColorMode();

    return (
      <Flex mt={'30px'} flexDir={'column'}>
        <Text
          fontSize={12}
          color={colorMode === 'dark' ? 'white.200' : '#353c48'}
          mb={'24px'}
          px={'40px'}
          textAlign={'center'}>
          Seignorage earned by TOS mining can be swapped TOS after it is
          unstaked and withdrawn from level layer2.
        </Text>
        <Flex flexDir={'column'} px={'20px'} alignItems={'center'}>
          <Text
            fontSize={13}
            fontWeight={600}
            color={colorMode === 'dark' ? 'white.200' : '#304156'}
            mb={'12px'}>
            TOS Mining Seignorage Status
          </Text>
          <Flex
            w={'300px'}
            h={'115px'}
            borderWidth={1}
            borderColor={colorMode === 'dark' ? '#535353' : '#d7d9df'}
            borderRadius={'10px'}
            justifyContent={'space-between'}>
            <Flex
              flexDir={'column'}
              alignItems={'center'}
              w={'50%'}
              h={'100%'}
              justifyContent={'center'}>
              <Flex alignItems={'center'} mb={'9px'}>
                <Text
                  fontSize={12}
                  color={colorMode === 'dark' ? 'gray.475' : '#808992'}
                  h={'16px'}
                  mr={'3px'}>
                  Staked
                </Text>
                <Tooltip
                  hasArrow
                  placement="top"
                  label={
                    <Flex
                      flexDir="column"
                      fontSize="12px"
                      pt="6px"
                      pl="5px"
                      pr="5px">
                      <Text textAlign="center" fontSize="12px">
                        The total amount of TON staked in TOS mining, including
                        the seignorage
                      </Text>
                    </Flex>
                  }
                  color={theme.colors.white[100]}
                  bg={theme.colors.gray[375]}
                  p={0}
                  w="227px"
                  h="47px"
                  borderRadius={3}
                  fontSize="12px">
                  <img src={tooltipIcon} alt={'tooltipIcon'} />
                </Tooltip>
              </Flex>
              <Flex
                fontSize={12}
                fontWeight={'bold'}
                color={colorMode === 'dark' ? 'white.200' : '#3d495d'}
                mb={'18px'}
                alignItems={'center'}>
                <Text mr={'2px'}>{commafy(stakedL2)}</Text>
                <Text fontSize={10} mt={'1px'}>
                  TON
                </Text>
              </Flex>
              <Button
                w={'70px'}
                h={'20px'}
                fontSize={12}
                bgColor={
                  unstakeL2Disable
                    ? colorMode === 'dark'
                      ? '#353535'
                      : '#e9edf1'
                    : '#257eee'
                }
                color={
                  unstakeL2Disable
                    ? colorMode === 'dark'
                      ? '#838383'
                      : '#86929d'
                    : '#fff'
                }
                _hover={{}}
                isDisabled={unstakeL2Disable}
                onClick={() =>
                  handleOpenConfirmModal({
                    type: 'manage_unstakeL2',
                    data: {
                      canUnstakedL2,
                      contractAddress,
                      unstakeAll,
                      name,
                    },
                  })
                }>
                Unstake
              </Button>
            </Flex>
            <Box
              h={'30px'}
              borderWidth={1}
              borderColor={colorMode === 'dark' ? '#535353' : '#f4f6f8'}
              mt={'24px'}></Box>
            <Flex
              flexDir={'column'}
              alignItems={'center'}
              w={'50%'}
              h={'100%'}
              justifyContent={'center'}>
              <Flex mb={'9px'} alignItems={'center'}>
                <Text
                  fontSize={12}
                  color={colorMode === 'dark' ? 'gray.475' : '#808992'}
                  h={'16px'}
                  mr={'3px'}>
                  Withdrawable
                </Text>
                <Tooltip
                  hasArrow
                  placement="top"
                  label={withdrawTooltip}
                  color={theme.colors.white[100]}
                  bg={theme.colors.gray[375]}
                  p={0}
                  w="227px"
                  h="47px"
                  borderRadius={3}
                  fontSize="12px">
                  <img src={tooltipIcon} alt={'tooltipIcon'} />
                </Tooltip>
              </Flex>
              <Flex
                fontSize={12}
                fontWeight={'bold'}
                color={colorMode === 'dark' ? 'white.200' : '#3d495d'}
                mb={'18px'}
                alignItems={'center'}>
                <Text mr={'2px'}>
                  {canWithdralAmount === undefined
                    ? '0.00'
                    : commafy(canWithdralAmount) ?? '0.00'}
                </Text>
                <Text fontSize={10} mt={'1px'}>
                  TON
                </Text>
              </Flex>
              <Button
                w={'70px'}
                h={'20px'}
                fontSize={12}
                bgColor={
                  withdrawDisable
                    ? colorMode === 'dark'
                      ? '#353535'
                      : '#e9edf1'
                    : '#257eee'
                }
                color={
                  withdrawDisable
                    ? colorMode === 'dark'
                      ? '#838383'
                      : '#86929d'
                    : '#fff'
                }
                _hover={{}}
                isDisabled={withdrawDisable}
                onClick={() =>
                  handleOpenConfirmModal({
                    type: 'manage_withdraw',
                    data: {
                      contractAddress,
                      pendingL2Balance: canWithdralAmount,
                    },
                  })
                }>
                Withdraw
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    );
  };

  if (true) {
    return (
      <Modal
        isOpen={sub.type === 'manage_swap' ? true : false}
        isCentered
        onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent
          fontFamily={theme.fonts.roboto}
          bg={colorMode === 'light' ? 'white.100' : 'black.200'}
          w="350px"
          pb="25px">
          <CloseButton closeFunc={handleCloseModal}></CloseButton>
          <ModalBody p={0} minH={'603px'}>
            <Flex flexDir={'column'} alignItems={'center'}>
              <Box
                textAlign="center"
                w={'100%'}
                pt={'20px'}
                pb={'15px'}
                mb={'15px'}
                borderBottom={
                  colorMode === 'light'
                    ? '1px solid #f4f6f8'
                    : '1px solid #373737'
                }
                pos={'relative'}
                cursor={'pointer'}>
                <Image
                  src={BackButtonIcon}
                  alt={'BackButtonIcon'}
                  pos="absolute"
                  pt={'3px'}
                  pl={'20px'}
                  onClick={() => {
                    handleCloseModal();
                    openAnyModal('manage', sub.data);
                  }}
                />
                <Heading
                  fontSize={'1.250em'}
                  fontWeight={'bold'}
                  fontFamily={theme.fonts.titil}
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  h={'31px'}
                  textAlign={'center'}>
                  Manage
                </Heading>
                {/* <Text color="gray.175" fontSize={'0.750em'}>
                  You can manage {name} Product
                </Text> */}
              </Box>

              <Flex
                borderRadius={'5px'}
                w={'272px'}
                h={'26px'}
                fontSize={12}
                fontWeight={'bold'}
                textAlign={'center'}
                verticalAlign={'middle'}
                lineHeight={'26px'}>
                <Box
                  w={'50%'}
                  borderWidth={1}
                  borderColor={
                    isSwapTab
                      ? '#2a72e5'
                      : colorMode === 'dark'
                      ? 'gray.75'
                      : '#d7d9df'
                  }
                  color={isSwapTab ? '#2A72E5' : ''}
                  borderLeftRadius={'5px'}
                  borderRightWidth={isSwapTab ? 1 : 0}
                  cursor={'pointer'}
                  onClick={() => setIsSwapTab(true)}>
                  Swap
                </Box>
                <Box
                  w={'50%'}
                  borderWidth={1}
                  borderColor={
                    !isSwapTab
                      ? '#2a72e5'
                      : colorMode === 'dark'
                      ? 'gray.75'
                      : '#d7d9df'
                  }
                  borderRightRadius={'5px'}
                  borderLeftWidth={!isSwapTab ? 1 : 0}
                  color={!isSwapTab ? '#2A72E5' : ''}
                  cursor={'pointer'}
                  onClick={() => setIsSwapTab(false)}>
                  Seignorage
                </Box>
              </Flex>
              {isSwapTab ? (
                <SwapTab setIsSwapTab={setIsSwapTab} />
              ) : (
                <SeignorageTab />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={sub.type === 'manage_swap' ? true : false}
      isCentered
      onClose={handleCloseModal}>
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
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}
              mb={'3px'}>
              Swap
            </Heading>
          </Box>

          <Stack
            pt="15px"
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Flex
              w={'300px'}
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              flexDir={'column'}
              borderRadius={10}
              pt="12px"
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Avatar
                  src={TON_SYMBOL}
                  backgroundColor={'transparent'}
                  bg="transparent"
                  color="#c7d1d8"
                  name={'token_image'}
                  border={
                    colorMode === 'light'
                      ? '1px solid #e7edf3'
                      : '1px solid #3c3c3c'
                  }
                  borderRadius={25}
                  h="26px"
                  w="26px"
                  mr="6px"
                />

                <Text
                  fontSize={16}
                  fontWeight={600}
                  color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                  textAlign={'center'}
                  lineHeight={'24px'}>
                  TON
                </Text>
                <NumberInput
                  h="26px"
                  ml="10px"
                  borderRadius={'4px'}
                  border={
                    Number(inputAmount) > Number(maxAmount)
                      ? '1px solid red'
                      : ''
                  }
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
                    // errorBorderColor="red.300"
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
              <Flex alignItems={'center'} pb={'14px'} pt={'13px'}>
                <Text
                  fontSize={'12px'}
                  fontWeight={500}
                  color={colorMode === 'dark' ? '#9d9ea5' : '#808992'}
                  lineHeight={1.33}
                  mr={'10px'}>
                  Balance: {Number(swapBalance).toLocaleString() || '-'} TON
                </Text>

                <Button
                  w={'50px'}
                  h={'20px'}
                  fontSize={12}
                  fontWeight={600}
                  onClick={() => setInputAmount(max.replace(/,/g, ''))}
                  type={'button'}
                  variant="outline"
                  mr="6px"
                  borderColor={colorMode === 'dark' ? '#535353' : '#9d9ea5'}
                  _focus={{
                    outline: 'none',
                  }}>
                  Max
                </Button>
                <Button
                  w={'50px'}
                  h={'20px'}
                  fontSize={12}
                  fontWeight={600}
                  onClick={() => setInputAmount(stableAmount.replace(/,/g, ''))}
                  type={'button'}
                  variant="outline"
                  borderColor={colorMode === 'dark' ? '#535353' : '#9d9ea5'}
                  _focus={{
                    outline: 'none',
                  }}>
                  Stable
                </Button>
              </Flex>
            </Flex>
          </Stack>
          <Stack
            pt="20px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Image src={swapArrow} w={5} h={5} alt="" />
          </Stack>
          <Stack
            pt="20px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Flex
              w={'300px'}
              border={
                colorMode === 'light'
                  ? '1px solid #d7d9df'
                  : '1px solid #535353'
              }
              flexDir={'column'}
              borderRadius={10}
              pl={'25px'}
              pr={'14px'}>
              <Flex
                justifyContent={'space-between'}
                alignItems={'center'}
                pt={'16px'}>
                <Flex>
                  <Avatar
                    src={colorMode === 'light' ? TOS_SYMBOL : TOS_symbolDark}
                    backgroundColor={'transparent'}
                    bg="transparent"
                    color="#c7d1d8"
                    name={'token_image'}
                    border={
                      colorMode === 'light'
                        ? '1px solid #e7edf3'
                        : '1px solid #3c3c3c'
                    }
                    borderRadius={25}
                    h="26px"
                    w="26px"
                    mr="6px"
                  />
                  <Text
                    fontSize={16}
                    fontWeight={600}
                    color={colorMode === 'dark' ? '#ffffff' : '#3d495d'}
                    textAlign={'center'}
                    lineHeight={'24px'}>
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
              <Flex alignItems={'center'} pb={'16px'} pt={'13px'}>
                <Flex flexDir={'column'} h={'30px'}>
                  <Text
                    fontSize={'12px'}
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
                  {/* <Text fontSize={12} fontWeight={600} color={'#808992'}>
                    Minimum amount TOS : {commafy(swapValue * 0.95 * 0.9)}
                  </Text> */}
                </Flex>
              </Flex>
            </Flex>
          </Stack>
          {/* <Text
            color="gray.175"
            fontSize={'0.750em'}
            textAlign={'center'}
            w={'100%'}>
            Current price{' '}
            {currentTosPrice === '0' ? <LoadingDots /> : currentTosPrice} TOS
            per TON
          </Text> */}
          {/* <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}></Stack> */}
          <Flex h="73px" w="100%" justifyContent="center">
            {Number(priceImpact) >= 5.5 ? (
              <Text
                margin={'0px 25px 25px'}
                fontSize="12px"
                textAlign={'center'}
                color={'#ff3b3b'}
                mt="30px">
                Price impact has to be less than 5.5%
              </Text>
            ) : (
              <Text
                margin={'0px 25px 25px'}
                fontSize="12px"
                textAlign={'center'}
                color={'#ff3b3b'}
                mt="30px"></Text>
            )}
          </Flex>

          <Text margin={'0px 25px 25px'} fontSize="12px" textAlign={'center'}>
            Swap will take place in Uniswap V3's{' '}
            <Link
              isExternal={true}
              href={
                'https://info.uniswap.org/#/pools/0x1c0ce9aaa0c12f53df3b4d8d77b82d6ad343b4e4'
              }
              color={'blue.100'}>
              WTON-TOS pool
            </Link>
            , but will not be executed if the last 2-minute average price
            differs from the current price by more than 4.8%. Slippage is
            designed to be a maximum of 5.5%.
          </Text>
          <Box
            as={Flex}
            justifyContent={'center'}
            pt={'25px'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              disabled={
                Number(maxAmount) === 0 ||
                Number(inputAmount) === 0 ||
                Number(inputAmount) > Number(maxAmount)
              }
              onClick={() => {
                const isBalance = checkBalance(
                  Number(inputAmount),
                  Number(swapBalance),
                );
                if (isBalance) {
                  const amountRay = convertToRay(inputAmount.toString());
                  swapWTONtoTOS({
                    userAddress: account,
                    amount:
                      isBalance !== 'balanceAll'
                        ? amountRay
                        : originalSwapBalance.toString(),
                    contractAddress,
                    library,
                  }).then(() => {
                    handleCloseModal();
                  });
                }
              }}>
              Swap
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
