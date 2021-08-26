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
  Input,
  Stack,
  useTheme,
  useColorMode,
  Select,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useUser} from 'hooks/useUser';
import {useState, useEffect, useRef} from 'react';
import {stakeTOS} from '../utils/stakeTOS';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {useCheckBalance} from 'hooks/useCheckBalance';
import moment from 'moment';
import Decimal from 'decimal.js';
import {Contract} from '@ethersproject/contracts';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import BOOST_ICON from 'assets/svgs/booster_icon.svg';

type SelectPeriod = '1 month' | '6 months' | '1 year' | '3 years';

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};

const checkPhase3StartTime = async (library: any) => {
  const {LockTOS_ADDRESS} = DEPLOYED;
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  const phase3StartTime = await LockTOSContract.phase3StartTime();
  const isBoosted =
    Date.now() / 1000 < Number(phase3StartTime.toString()) ? true : false;
  return isBoosted;
};

export const DaoStakeModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useUser();
  const {checkBalance} = useCheckBalance();

  const [boostOpt, setBoostOpt] = useState<boolean>(false);

  const [balance, setBalance] = useState('0');
  const [btnDisable, setBtnDisable] = useState(true);
  const [endDate, setEndDate] = useState('-');
  const [reward, setReward] = useState('-');

  const [selectPeriod, setSelectPeriod] = useState<string | undefined>(
    undefined,
  );
  const [dateValue, setDateValue] = useState(0);
  const [lockDateValue, setLockDateValue] = useState<string | undefined>(
    undefined,
  );
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const periods = ['1 month', '6 months', '1 year', '3 years'];

  const {btnStyle} = theme;
  const {value, setValue, onChange} = useInput('0');
  const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);

  const focusTarget = useRef<any>([]);
  const focusCustomTarget = useRef(null);

  const changeBorderColor = (index: any) => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
    current[index].style.border = 'solid 1px #2a72e5';
    setSelectPeriod(current[index].id);
  };

  const changeAllBorderColor = () => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
  };

  // set Estimated reward;
  const getEstimatedReward = useCallback(
    (diffDate: number) => {
      if (value !== '' && value !== '0' && value !== undefined) {
        const differNum = diffDate > 7 ? diffDate - 7 : diffDate;
        const maxPeriod = 1095;
        const numValue = Number(value.replaceAll(',', ''));
        const avgProfit = numValue / maxPeriod;
        const estimatedReward = avgProfit * differNum;
        const deciamlNum = new Decimal(estimatedReward);
        const resultNum = deciamlNum.toFixed(3, Decimal.ROUND_HALF_UP);
        const result = Number(resultNum).toFixed(2);
        setReward(
          boostOpt === true ? String(Number(result) * 2) : String(result),
        );
      }
      return;
    },
    [value, boostOpt],
  );

  //check Phse 3 Start Time
  useEffect(() => {
    async function isPhase3StartTime() {
      const res = await checkPhase3StartTime(library);
      setBoostOpt(res);
    }
    if (library) {
      isPhase3StartTime();
    }
  }, [library]);

  //check btn able condition
  useEffect(() => {
    const keys = [undefined, '', '0', '0.', '0.0', '0.00'];
    const btnDisabled =
      keys.indexOf(value) !== -1 || dateValue === 0 ? true : false;
    setBtnDisable(btnDisabled);
  }, [value, dateValue]);

  useEffect(() => {
    setBalance(data?.data?.userTosBalance);
  }, [data]);

  //calculate estimated end date
  useEffect(() => {
    if (dateValue === 0) {
      setReward('-');
      return setEndDate('-');
    }
    const dayForThursday = 4; // for Thursday
    const today = moment().isoWeekday();
    if (today <= dayForThursday) {
      if (dateValue === 1) {
        const date = moment().isoWeekday(4).format('MMM DD, YYYY');
        const diffDate = moment()
          .add(dateValue, 'weeks')
          .isoWeekday(dayForThursday)
          .diff(new Date(), 'days');
        getEstimatedReward(diffDate);
        setEndDate(date);
      } else {
        const date = moment()
          .add(dateValue, 'weeks')
          .isoWeekday(dayForThursday)
          .format('MMM DD, YYYY');
        const diffDate = moment()
          .add(dateValue, 'weeks')
          .isoWeekday(dayForThursday)
          .diff(new Date(), 'days');
        getEstimatedReward(diffDate);
        setEndDate(date);
      }
    } else {
      const date = moment()
        .add(dateValue, 'weeks')
        .isoWeekday(dayForThursday)
        .format('MMM DD, YYYY');
      const diffDate = moment()
        .add(dateValue, 'weeks')
        .isoWeekday(dayForThursday)
        .diff(new Date(), 'days');
      getEstimatedReward(diffDate);
      setEndDate(date);
    }
  }, [dateValue, value, getEstimatedReward]);

  useEffect(() => {
    if (selectPeriod === 'weeks' || selectPeriod === 'months') {
      if (selectPeriod === 'weeks') {
        setDateValue(Number(lockDateValue));
      }
      if (selectPeriod === 'months') {
        setDateValue(Number(lockDateValue) * 4);
      }
    }
    if (selectPeriod === '1 month') {
      setDateValue(4);
    }
    if (selectPeriod === '6 months') {
      setDateValue(26);
    }
    if (selectPeriod === '1 year') {
      setDateValue(52);
    }
    if (selectPeriod === '3 years') {
      setDateValue(156);
    }
    // return setDateValue(select)
  }, [selectPeriod, lockDateValue]);

  return (
    <Modal
      isOpen={data.modal === 'dao_stake' ? true : false}
      isCentered
      onClose={() => {
        setIsCustom(false);
        setDateValue(0);
        setReward('-');
        setReward('-');
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
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
              textAlign={'center'}>
              Stake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn sTOS
            </Text>
          </Box>

          <Stack
            pt="27px"
            as={Flex}
            flexDir={'row'}
            justifyContent={'center'}
            alignItems={'center'}
            w={'full'}>
            <Input
              variant={'outline'}
              borderWidth={0}
              textAlign={'center'}
              fontWeight={'bold'}
              fontSize={'4xl'}
              maxW={'160px'}
              minW={'20px'}
              p={0}
              ml={'29px'}
              mr="5px"
              w={value === '0' || undefined ? '20px' : `${20 * value.length}px`}
              value={value}
              onKeyDown={onKeyDown}
              onChange={onChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            <Text
              pt="6px"
              color={themeDesign.tosFont[colorMode]}
              fontWeight={600}>
              TOS
            </Text>
          </Stack>

          <Stack as={Flex} justifyContent={'center'} alignItems={'center'}>
            <Box textAlign={'center'} pt="18px" mb={'28px'}>
              <Text fontWeight={500} fontSize={'0.813em'} color={'blue.300'}>
                Available Balance
              </Text>
              <Text
                fontSize={'18px'}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {balance} TOS
              </Text>
            </Box>
          </Stack>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pb="13px">
              <Text
                fontWeight={600}
                fontSize={'0.813em'}
                color={themeDesign.font[colorMode]}
                mb="10px">
                Locking Period
              </Text>
              <Flex
                w={'320px'}
                h="26px"
                mb="10px"
                fontSize={'0.750em'}
                cursor={'pointer'}>
                {periods.map((period: string, index: number) => (
                  <Text
                    w={'80px'}
                    h="100%"
                    id={period}
                    kye={index}
                    ref={(el) => (focusTarget.current[index] = el)}
                    borderTop={themeDesign.border[colorMode]}
                    borderBottom={themeDesign.border[colorMode]}
                    borderLeft={
                      index !== 0 ? '' : themeDesign.border[colorMode]
                    }
                    borderLeftRadius={index === 0 ? 4 : 0}
                    borderRightRadius={index === periods.length - 1 ? 4 : 0}
                    borderRight={themeDesign.border[colorMode]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => {
                      changeBorderColor(index);
                      setIsCustom(false);
                    }}>
                    {period as SelectPeriod}
                  </Text>
                ))}
              </Flex>
              {!isCustom && (
                <Button
                  w={'120px'}
                  h="26px"
                  bg="transparent"
                  fontWeight={100}
                  border={themeDesign.border[colorMode]}
                  fontSize={'0.750em'}
                  _hover={{}}
                  onClick={() => {
                    setDateValue(0);
                    setIsCustom(true);
                    setSelectPeriod(undefined);
                    changeAllBorderColor();
                  }}>
                  Customized
                </Button>
              )}
              {isCustom && (
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize={'0.750em'} color="gray.250" fontWeight={600}>
                    Customized
                  </Text>
                  <Input
                    w="132px"
                    h="32px"
                    ref={focusCustomTarget}
                    onChange={(e) => {
                      const {value} = e.target;
                      setLockDateValue(value);
                    }}
                    onClick={() => changeAllBorderColor()}></Input>
                  <Select
                    w="100px"
                    h="32px"
                    fontSize={'0.750em'}
                    onChange={(e) => {
                      const type = e.target.value;
                      setSelectPeriod(type);
                    }}>
                    <option value="" disabled selected hidden>
                      Select
                    </option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                  </Select>
                </Flex>
              )}
              <Flex flexDir="column" mt={'14px'}>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="45px">
                  <Flex>
                    <Text fontSize="13px" color="gray.400" mr="5px">
                      Estimated end date
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="top"
                      label="Lock up-period is calculated  based on every Monday 00: 00 UTC."
                      color={theme.colors.white[100]}
                      bg={theme.colors.gray[375]}>
                      <Image src={tooltipIcon} />
                    </Tooltip>
                  </Flex>
                  <Text
                    fontSize="15px"
                    color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                    fontWeight={600}>
                    {endDate} (KST)
                  </Text>
                </Flex>
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  h="45px">
                  <Flex>
                    <Text fontSize="13px" color="gray.400" mr="5px">
                      Estimated reward
                    </Text>
                    <Tooltip
                      hasArrow
                      placement="top"
                      label="Lock up-period is calculated  based on every Monday 00: 00 UTC."
                      color={theme.colors.white[100]}
                      bg={theme.colors.gray[375]}>
                      <Image src={tooltipIcon} />
                    </Tooltip>
                  </Flex>
                  <Flex flexDir="row">
                    {boostOpt === true ? (
                      <img src={BOOST_ICON} alt={'BOOST_ICON'} />
                    ) : null}
                    <Text
                      ml={2}
                      color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                      fontWeight={600}>
                      {reward} sTOS
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              {...(btnDisable === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={btnDisable ? {} : {...theme.btnHover}}
              disabled={btnDisable}
              onClick={() => {
                const isBalance = checkBalance(
                  Number(value.replaceAll(',', '')),
                  Number(balance),
                );
                if (isBalance && account) {
                  handleOpenConfirmModal({
                    type: 'confirm',
                    data: {
                      from: 'dao/stake',
                      amount: value,
                      period: dateValue,
                      action: () =>
                        stakeTOS({
                          account,
                          library,
                          amount: value.replaceAll(',', ''),
                          period: dateValue,
                          handleCloseModal: handleCloseModal(),
                        }),
                    },
                  });
                }
              }}>
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
