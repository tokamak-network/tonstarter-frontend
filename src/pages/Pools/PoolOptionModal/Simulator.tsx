import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Input,
  Button,
  Flex,
  Stack,
  useTheme,
  useColorMode,
} from '@chakra-ui/react';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {closeModal, selectModalType} from 'store/modal.reducer';
import {useCallback, useEffect, useState} from 'react';
import {CloseButton} from 'components/Modal/CloseButton';
import {selectUser} from 'store/app/user.reducer';
import {fetchSwapPayload, getEstimatedReward} from '../utils/simulator';
import {convertToWei, convertFromRayToWei} from 'utils/number';
import LiquidityChartRangeInput from '../components/LiquidityChartRangeInput/index';
import {FeeAmount} from '@uniswap/v3-sdk';
import {useCurrency} from '../../../hooks/Tokens';
import {
  useV3DerivedMintInfo,
  useV3MintActionHandlers,
  useRangeHopCallbacks,
  useV3MintState,
} from '../../../store/mint/v3/hooks';
import {Bound} from '../components/LiquidityChartRangeInput/Bound';
import {formatTickPrice} from '../utils/formatTickPrice';
import minus_icon_Normal from 'assets/svgs/minus_icon_Normal.svg';
import Plus_icon_Normal from 'assets/svgs/Plus_icon_Normal.svg';
import {CustomInput, CustomSelectBox} from 'components/Basic/index';
import {TOKENS} from 'constants/index';
import {useWeb3React} from '@web3-react/core';
import RangeSelector from '../components/RangeSelector/index';

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
    dark: 'solid 1px #535353',
  },
  selectBorder: 'solid 1px #2a72e5',
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};

const borderLineStyle = '1px solid #d7d9df';

export const Title = (prop: {title: string; fontSize: number}) => {
  const {title, fontSize} = prop;
  return (
    <Text color="black.300" fontSize={fontSize} fontWeight={600}>
      {title}
    </Text>
  );
};

export const Simulator = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();

  const {data} = useAppSelector(selectModalType);
  const {data: userData} = useAppSelector(selectUser);

  const dispatch = useAppDispatch();

  //input values
  const [estimatedReward, setEstimatedReward] = useState<number>(0);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [wtonValue, setWtonValue] = useState<number>(0);
  const [tosValue, setTosValue] = useState<number>(0);
  // const [minPrice, setMinPrice] = useState<number>(0);
  // const [maxPrice, setMaxPrice] = useState<number>(0);

  //select value
  type Duration = 'Day' | 'Month' | 'Year';
  const durationType: Duration[] = ['Day', 'Month', 'Year'];
  const [selectDurationType, setSelectDurationType] = useState<Duration>('Day');
  const [durationValue, setDurationValue] = useState<number>(0);

  // const [LP, setLP] = useState<number>(0);
  const {chainId} = useWeb3React();

  const {TOS, WTON} = TOKENS;

  const tosAddr = TOS.address[chainId || 1];
  const wtonAddr = WTON.address[chainId || 1];

  // Select Mode
  const [baseToken, setBaseToken] = useState<'WTON' | 'TOS'>('WTON');

  const handleCloseModal = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const baseCurrency = useCurrency(tosAddr.toLowerCase());
  const currencyB = useCurrency(wtonAddr.toLowerCase());
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped)
      ? undefined
      : currencyB;
  const feeAmount: FeeAmount | undefined =
    '3000' && Object.values(FeeAmount).includes(parseFloat('3000'))
      ? parseFloat('3000')
      : undefined;

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    parsedAmounts,
    // currencyBalances,
    position,
    noLiquidity,
    // currencies,
    // errorMessage,
    // invalidPool,
    // invalidRange,
    // outOfRange,
    // depositADisabled,
    // depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    undefined,
  );

  const {
    onFieldAInput,
    onFieldBInput,
    onLeftRangeInput,
    onRightRangeInput,
    onStartPriceInput,
  } = useV3MintActionHandlers(noLiquidity);

  const {[Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper} = ticks;
  const {[Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper} = pricesAtTicks;

  const {
    getDecrementLower,
    getIncrementLower,
    getDecrementUpper,
    getIncrementUpper,
    getSetFullRange,
  } = useRangeHopCallbacks(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    tickLower,
    tickUpper,
    pool,
  );

  const {leftRangeTypedValue, rightRangeTypedValue} = useV3MintState();

  useEffect(() => {
    async function init() {
      const swapPrice = await fetchSwapPayload();
      setCurrentPrice(Number(swapPrice) || 0);

      if (swapPrice) {
        const test = await getEstimatedReward({
          token_0: baseToken === 'WTON' ? wtonValue : tosValue,
          token_1: baseToken === 'WTON' ? tosValue : wtonValue,
          cPrice: Number(swapPrice),
          lower: Number(leftRangeTypedValue),
          upper: Number(rightRangeTypedValue),
          unit:
            selectDurationType === 'Month'
              ? durationValue * 30
              : selectDurationType === 'Year'
              ? durationValue * 365
              : Number(durationValue),
        });
        setEstimatedReward(test);
      }
    }
    init();
  }, [
    baseToken,
    dispatch,
    wtonValue,
    tosValue,
    leftRangeTypedValue,
    rightRangeTypedValue,
    selectDurationType,
    durationValue,
  ]);

  if (!userData || !userData.balance) {
    return null;
  }

  const {
    balance: {wton, tos},
  } = userData;

  return (
    <Modal
      isOpen={data.modal === 'pool_simulator' ? true : false}
      isCentered
      onClose={handleCloseModal}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        pt="25px"
        pb="25px"
        maxW={650}>
        <CloseButton closeFunc={handleCloseModal}></CloseButton>
        <ModalBody p={0}>
          <Box
            pb={'1.250em'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Box pos="absolute" d="flex" w={'140px'} h={'26px'} right={30}>
              <Text
                w={'50%'}
                fontSize={'0.750em'}
                color={baseToken === 'WTON' ? 'blue.300' : ''}
                textAlign="center"
                lineHeight="26px"
                verticalAlign="middle"
                onClick={() => setBaseToken('WTON')}
                cursor={'pointer'}
                borderTop={
                  baseToken === 'WTON'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderBottom={
                  baseToken === 'WTON'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderLeft={
                  baseToken === 'WTON'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderLeftRadius={4}
                borderRight={
                  baseToken === 'WTON' ? themeDesign.selectBorder : ''
                }>
                WTON
              </Text>
              <Text
                w={'50%'}
                fontSize={'0.750em'}
                color={baseToken === 'TOS' ? 'blue.300' : ''}
                textAlign="center"
                lineHeight="26px"
                verticalAlign="middle"
                onClick={() => setBaseToken('TOS')}
                cursor={'pointer'}
                borderTop={
                  baseToken === 'TOS'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderBottom={
                  baseToken === 'TOS'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderRight={
                  baseToken === 'TOS'
                    ? themeDesign.selectBorder
                    : themeDesign.border[colorMode]
                }
                borderRightRadius={4}
                borderLeft={
                  baseToken === 'TOS' ? themeDesign.selectBorder : ''
                }>
                TOS
              </Text>
            </Box>
            <Heading
              fontSize={'1.250em'}
              fontWeight={'bold'}
              fontFamily={theme.fonts.titil}
              color={colorMode === 'light' ? 'gray.250' : 'white.100'}
              textAlign={'center'}>
              LP Reward Simulator
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can calculate how much WTON and TOS
            </Text>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              you need to provide LP & Expected APY
            </Text>
          </Box>
          <Flex flexDir="column" pl={30} pr={30}>
            <Flex pt={'16px'} flexDir="column" alignItems="center">
              <Text color="gray.400" fontSize={'1em'}>
                Price Range
              </Text>
              <Text color="gray.250" fontSize={'1.125em'} textAlign={'center'}>
                Price Range Current Price: {currentPrice} TOS per WTON
              </Text>
            </Flex>
            <Flex>
              <Box w={340} h={'166px'}>
                <LiquidityChartRangeInput
                  currencyA={baseCurrency ?? undefined}
                  currencyB={quoteCurrency ?? undefined}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                  price={
                    price
                      ? parseFloat(
                          (invertPrice ? price.invert() : price).toSignificant(
                            8,
                          ),
                        )
                      : undefined
                  }
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  onLeftRangeInput={onLeftRangeInput}
                  onRightRangeInput={onRightRangeInput}
                  interactive={!false}
                />
              </Box>
              <Flex flexDir="column" ml={'20px'} pt={'23px'}>
                {/* <Flex
                  w={230}
                  h={'78px'}
                  border={borderLineStyle}
                  borderRadius={10}
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  pl={15}
                  pr={15}
                  mb={'10px'}>
                  <Text>Min Price</Text>
                  <Flex justifyContent="space-around" alignItems="center">
                    <Flex
                      w={'24px'}
                      h={'24px'}
                      border={borderLineStyle}
                      alignItems="center"
                      justifyContent="center">
                      <img src={minus_icon_Normal} alt="minus_icon"></img>
                    </Flex>
                    <CustomInput
                      w={'150px'}
                      value={minPrice}
                      setValue={setMinPrice}></CustomInput>
                    <Flex
                      w={'24px'}
                      h={'24px'}
                      border={borderLineStyle}
                      alignItems="center"
                      justifyContent="center">
                      <img src={Plus_icon_Normal} alt="plus_icon"></img>
                    </Flex>
                  </Flex>
                </Flex> */}
                <RangeSelector
                  priceLower={priceLower}
                  priceUpper={priceUpper}
                  getDecrementLower={getDecrementLower}
                  getIncrementLower={getIncrementLower}
                  getDecrementUpper={getDecrementUpper}
                  getIncrementUpper={getIncrementUpper}
                  onLeftRangeInput={onLeftRangeInput}
                  onRightRangeInput={onRightRangeInput}
                  currencyA={baseCurrency}
                  currencyB={quoteCurrency}
                  feeAmount={feeAmount}
                  ticksAtLimit={ticksAtLimit}
                />
                {/* <Flex
                  w={230}
                  h={'78px'}
                  border={borderLineStyle}
                  borderRadius={10}
                  flexDir="column"
                  alignItems="center"
                  justifyContent="center"
                  pl={15}
                  pr={15}>
                  <Text>Max Price</Text>
                  <Flex justifyContent="space-around" alignItems="center">
                    <Flex
                      w={'24px'}
                      h={'24px'}
                      border="1px solid #e6eaee"
                      alignItems="center"
                      justifyContent="center">
                      <img src={minus_icon_Normal} alt="minus_icon"></img>
                    </Flex>
                    <CustomInput
                      w={'150px'}
                      value={maxPrice}
                      setValue={setMaxPrice}></CustomInput>
                    <Flex
                      w={'24px'}
                      h={'24px'}
                      border="1px solid #e6eaee"
                      alignItems="center"
                      justifyContent="center">
                      <img src={Plus_icon_Normal} alt="plus_icon"></img>
                    </Flex>
                  </Flex>
                </Flex> */}
              </Flex>
            </Flex>
          </Flex>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'22px'}
            pr="30px"
            pl="30px">
            <Title title={'Deposited Amount'} fontSize={15}></Title>
            <Flex
              mt="12px"
              w={'100%'}
              justifyContent={'space-between'}
              flexDir={baseToken === 'WTON' ? 'row' : 'row-reverse'}>
              <Box
                w="285px"
                h="78px"
                border={borderLineStyle}
                py={'0.875em'}
                pl={'1.563em'}
                pr={'0.938em'}
                borderRadius={10}>
                <Box
                  d="flex"
                  justifyContent="space-between"
                  h={'21px'}
                  mb={'11px'}>
                  <Title title={'WTON'} fontSize={16}></Title>
                  <CustomInput
                    value={wtonValue}
                    setValue={setWtonValue}
                    numberOnly={true}
                  />
                </Box>
                <Box>
                  <Text fontSize={'12px'}>Balance : {wton} WTON</Text>
                </Box>
              </Box>
              <Box
                w="285px"
                h="78px"
                border={borderLineStyle}
                py={'0.875em'}
                pl={'1.563em'}
                pr={'0.938em'}
                borderRadius={10}>
                <Box
                  d="flex"
                  justifyContent="space-between"
                  h={'21px'}
                  mb={'11px'}>
                  <Title title={'TOS'} fontSize={16}></Title>
                  <CustomInput
                    value={tosValue}
                    setValue={setTosValue}
                    numberOnly={true}
                  />
                </Box>
                <Box>
                  <Text fontSize={'12px'}>Balance : {tos} TOS</Text>
                </Box>
              </Box>
            </Flex>
            <Flex
              mt="19px"
              w={'100%'}
              justifyContent="space-between"
              borderBottom="1px solid #f4f6f8"
              pb={'26px'}>
              <Box w="285px" h="32px" borderRadius={10}>
                <Box
                  d="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  h={'100%'}>
                  <Title title={'Duration'} fontSize={13}></Title>
                  <Box
                    w="80px"
                    h="100%"
                    border={borderLineStyle}
                    borderRadius={4}>
                    <CustomInput
                      w={'100%'}
                      h={'100%'}
                      value={durationValue}
                      setValue={setDurationValue}
                      numberOnly={true}
                    />
                  </Box>
                  <CustomSelectBox
                    w={'125px'}
                    h={'32px'}
                    list={durationType}
                    setValue={setSelectDurationType}></CustomSelectBox>
                </Box>
              </Box>
              <Box w="285px" h="32px" borderRadius={10}>
                <Box
                  d="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  h={'100%'}>
                  <Title title={'Estimated Reward'} fontSize={13}></Title>
                  <Text fontSize={'1.125em'} color="black.300" fontWeight={600}>
                    {estimatedReward}{' '}
                    <span style={{fontSize: '12px'}}>TOS</span>
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
