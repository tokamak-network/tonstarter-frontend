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
  useTheme,
  useColorMode,
  Radio,
  RadioGroup,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useModal} from 'hooks/useModal';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useState, useEffect} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import backArrowIcon from 'assets/svgs/back_arrow_icon.svg';
import {useRef} from 'react';
import {getUserTosBalance} from 'client/getUserBalance';
import {selectUser} from 'store/app/user.reducer';
import {increaseAmount, extendPeriod} from '../../actions';
import {selectDao} from 'pages/Dao/dao.reducer';
import {TosStakeList} from '../../types/index';
import {selectModalType} from 'store/modal.reducer';
import {CustomTooltip} from 'components/Tooltip';
import {useBlockNumber} from 'hooks/useBlock';
import {getConstants, getMonth} from 'pages/Dao/utils';
import moment from 'moment';
import {useToast} from 'hooks/useToast';
import {CloseButton} from 'components/Modal';

interface Stake {
  lockId: string;
  lockedBalance: string;
  end: false;
  periodDays: number;
  periodweeks: number;
}

// type RadioSelect = 'select_amount' | 'select_period';

const themeDesign = {
  border: {
    light: 'solid 1px #f4f6f8',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  scrollNumberFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
  scrollAmountFont: {
    light: 'gray.400',
    dark: 'gray.400',
  },
  btnBorder: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  editBorder: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #535353',
  },
  inputVariant: {
    light: {
      style: {backgroundColor: '#e9edf1'},
      isDisabled: true,
      color: '#86929d',
    },
    dark: {
      // style: {backgroundColor: '#e9edf1'},
      isDisabled: true,
      color: '#ffffff',
    },
  },
  labelColor: {
    light: {
      active: '#3e495c',
      notActive: '#8f96a1',
    },
    dark: {
      active: '#ffffff',
      notActive: '#86929d',
    },
  },
};

export const DaoManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {data: stakeList} = useAppSelector(selectDao);

  const [edit, setEdit] = useState(false);
  const [selectLockId, setSelectLockId] = useState('');
  const [select, setSelect] = useState('select_amount');
  const [balance, setBalance] = useState('0');
  const [tosStakeList, setTosStakeList] = useState<TosStakeList[] | undefined>(
    undefined,
  );

  const [epochUnit, setEpochUnit] = useState(0);
  const [maxTime, setMaxTime] = useState(0);

  const [value, setValue] = useState('0');
  const [periodValue, setPeriodValue] = useState(0);
  const [btnDisable, setBtnDisable] = useState(true);
  const [availableWeeks, setAvailableWeeks] = useState(0);
  const [availableMonth, setAvailableMonth] = useState(0);

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {active, account, library} = useActiveWeb3React();
  const {btnStyle} = theme;
  const {handleCloseModal} = useModal(() => {
    setEdit(false);
    setSelectLockId('');
    setSelect('select_amount');
    setValue('0');
    setPeriodValue(0);
  });
  const {toastMsg} = useToast();
  const {blockNumber} = useBlockNumber();

  const focusTarget = useRef<any>([]);
  const amountRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const setConstants = async () => {
      const {epochUnit, maxTime} = await getConstants({library});
      setEpochUnit(epochUnit);
      setMaxTime(maxTime);
    };
    if (library) {
      setConstants();
    }
  }, [library]);

  useEffect(() => {
    if (stakeList) {
      setTosStakeList(stakeList.filter((e: TosStakeList) => e.end === false));
    }
  }, [active, account, library, stakeList]);

  useEffect(() => {
    async function getTosBalance() {
      if (account && library) {
        const res = await getUserTosBalance(account, library);
        if (res !== undefined) {
          setBalance(res);
        }
      }
    }
    if (active && account) {
      getTosBalance();
    } else {
      setBalance('-');
    }
    /*eslint-disable*/
  }, [active, account]);

  useEffect(() => {
    const checkCondition =
      (value === '0' && periodValue === 0) ||
      String(value) === '' ||
      String(periodValue) === ''
        ? true
        : false;
    setBtnDisable(checkCondition);
    setTimeout(() => {
      select === 'select_amount'
        ? amountRef.current?.focus()
        : periodRef.current?.focus();
    }, 10);
  }, [value, periodValue]);

  useEffect(() => {
    if (select) {
      setPeriodValue(0);
    }
    setValue('0');
  }, [select]);

  useEffect(() => {
    const stake = tosStakeList?.filter(
      (stake) => stake.lockId === selectLockId,
    );
    if (stake === undefined || stake?.length > 1) {
      return console.error('Stakelist selected should be one');
    }
    if (stake[0] !== undefined) {
      const {startTime, endTime} = stake[0];
      const timeLeft = endTime - moment().unix();
      const maxPeriod = maxTime - timeLeft;
      const maxWeeks = setAvailableWeeks(Math.floor(maxPeriod / epochUnit));

      const duration = moment
        .duration(Math.floor(maxPeriod / epochUnit), 'weeks')
        .asMonths();
      setAvailableMonth(Math.floor(duration));
    }
  }, [blockNumber, selectLockId, maxTime, epochUnit]);

  const {data: userData} = useAppSelector(selectUser);
  if (!userData || !userData?.balance?.tos) {
    return null;
  }
  const {
    balance: {tos, tosOrigin},
  } = userData;

  const MainScreen = () => {
    return (
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
            Manage
          </Heading>
          <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
            You can manage your Staking
          </Text>
        </Box>
        <Box borderBottomWidth={1} mb={'25px'}>
          <Scrollbars
            style={{
              width: '100%',
              height: '330px',
              display: 'flex',
              position: 'relative',
            }}
            thumbSize={50}
            renderThumbVertical={() => (
              <div
                style={{
                  background: colorMode === 'light' ? '#007aff' : '#ffffff',
                  position: 'relative',
                  right: '-2px',
                  borderRadius: '3px',
                }}></div>
            )}
            renderThumbHorizontal={() => (
              <div style={{background: 'black'}}></div>
            )}>
            <Flex
              flexDir="column"
              style={{marginTop: '0', marginBottom: '20px'}}>
              {tosStakeList?.map((stake: any, index: number) => {
                return (
                  <Flex
                    ref={(el) => (focusTarget.current[index] = el)}
                    alignItems="center"
                    h={'64px'}
                    borderBottom={
                      index !== tosStakeList.length - 1
                        ? themeDesign.border[colorMode]
                        : ''
                    }
                    key={index}>
                    <Text
                      w="60px"
                      textAlign="center"
                      fontSize={'0.813em'}
                      fontWeight={600}
                      fontColor={themeDesign.scrollNumberFont[colorMode]}>
                      {index < 10 ? '0' + (index + 1) : index}
                    </Text>
                    <Box w={'110px'} mr={'20px'}>
                      <Text
                        fontSize={'0.750em'}
                        color={themeDesign.scrollAmountFont[colorMode]}>
                        Amount
                      </Text>
                      <Text
                        fontSize={'14px'}
                        fontColor={themeDesign.scrollNumberFont[colorMode]}
                        fontWeight={'bold'}>
                        {stake.lockedBalance}
                        <span
                          style={{
                            fontSize: '0.688em',
                            paddingLeft: '0.188em',
                          }}>
                          TOS
                        </span>
                      </Text>
                    </Box>
                    <Box w={'82px'} mr="30px">
                      <Text
                        fontSize={'0.750em'}
                        color={themeDesign.scrollAmountFont[colorMode]}>
                        End time
                      </Text>
                      <Text
                        fontSize={'14px'}
                        fontColor={themeDesign.scrollNumberFont[colorMode]}
                        fontWeight={'bold'}>
                        {stake.endDate}
                      </Text>
                    </Box>
                    <Box w={'82px'} mr={'30px'}>
                      <Text
                        fontSize={'0.750em'}
                        color={themeDesign.scrollAmountFont[colorMode]}>
                        sTOS
                      </Text>
                      <Text
                        fontSize={'14px'}
                        fontColor={themeDesign.scrollNumberFont[colorMode]}
                        fontWeight={'bold'}>
                        {stake.reward}
                      </Text>
                    </Box>
                    <Button
                      w="70px"
                      h="32px"
                      bg="transparent"
                      fontSize={'0.813em'}
                      fontWeight={400}
                      border={themeDesign.btnBorder[colorMode]}
                      _hover={{}}
                      onClick={() => {
                        setEdit(true);
                        setSelectLockId(stake.lockId);
                        setValue('0');
                        setPeriodValue(0);
                      }}>
                      Edit
                    </Button>
                  </Flex>
                );
              })}
            </Flex>
          </Scrollbars>
        </Box>
        <Box as={Flex} justifyContent={'center'}>
          <Button
            {...(active
              ? {...btnStyle.btnAble()}
              : {...btnStyle.btnDisable({colorMode})})}
            w={'150px'}
            fontSize="14px"
            _hover={theme.btnHover.checkDisable({active})}
            disabled={!active}
            onClick={() => {
              setEdit(false);
              handleCloseModal();
            }}>
            Close
          </Button>
        </Box>
      </ModalBody>
    );
  };

  const EditScreen = () => {
    return (
      <ModalBody p={0}>
        <RadioGroup onChange={setSelect} value={select}>
          <Flex h="460px" flexDir="column" alignItems="center">
            <Flex
              w={'100%'}
              borderBottom={
                colorMode === 'light'
                  ? '1px solid #f4f6f8'
                  : '1px solid #373737'
              }
              pl={'1.250em'}
              pb={'1.250em'}>
              <img
                style={{
                  width: '1.375em',
                  height: '1.375em',
                  marginTop: '0.2em',
                  marginRight: '0.625em',
                  cursor: 'pointer',
                }}
                alt={'arrowBtn'}
                src={backArrowIcon}
                onClick={() => {
                  setEdit(false);
                  setSelectLockId('');
                }}></img>
              <Flex flexDir="column" alignItems="flex-start">
                <Heading
                  fontSize={'1.250em'}
                  fontWeight={'bold'}
                  fontFamily={theme.fonts.titil}
                  color={colorMode === 'light' ? 'gray.250' : 'white.100'}
                  textAlign={'center'}
                  mb={'1px'}>
                  Edit
                </Heading>
                <Text
                  color="gray.175"
                  fontSize={'0.750em'}
                  textAlign={'center'}>
                  You can edit the amount and period.
                </Text>
              </Flex>
            </Flex>
            <Flex
              alignItems="center"
              pl="20px"
              h={'64px'}
              w={'100%'}
              borderBottom={themeDesign.border[colorMode]}>
              <Radio value="select_amount" mr="14px" cursor="pointer"></Radio>
              <Text
                w={'112px'}
                fontSize={'12px'}
                fontWeight={colorMode === 'light' ? 600 : 500}
                fontColor={themeDesign.editBorder[colorMode]}>
                Increase Amount
              </Text>
              <Flex
                {...(select === 'select_period'
                  ? themeDesign.inputVariant[colorMode]
                  : '')}
                pos="relative"
                border={themeDesign.editBorder[colorMode]}
                borderRadius={4}
                w={'143px'}
                mr={'10px'}>
                <NumberInput
                  h="32px"
                  value={value}
                  cursor=""
                  onChange={(value) =>
                    value !== '-' ? setValue(value) : null
                  }>
                  <NumberInputField
                    border="none"
                    w={'143px'}
                    h="32px"
                    disabled={select === 'select_period'}
                    ref={amountRef}
                    fontSize={'0.750em'}
                    _focus={{
                      borderWidth: 0,
                    }}></NumberInputField>
                </NumberInput>
                <Flex
                  pos="absolute"
                  right={1}
                  h={'100%'}
                  alignItems="center"
                  fontSize={'12px'}
                  color={
                    themeDesign.labelColor[colorMode][
                      select === 'select_amount' ? 'active' : 'notActive'
                    ]
                  }>
                  <span>TOS</span>
                </Flex>
              </Flex>
              <Button
                w="70px"
                h="32px"
                bg="transparent"
                fontSize={'0.813em'}
                fontWeight={400}
                border={themeDesign.editBorder[colorMode]}
                _hover={{}}
                onClick={() => {
                  setValue(tos);
                }}
                isDisabled={select === 'select_period' ? true : false}>
                MAX
              </Button>
            </Flex>
            <Flex
              alignItems="center"
              pl="20px"
              h={'64px'}
              w={'100%'}
              borderBottom={themeDesign.border[colorMode]}>
              <Radio value="select_period" mr="14px" cursor="pointer"></Radio>
              <Text
                w={'112px'}
                fontSize={'12px'}
                fontWeight={colorMode === 'light' ? 600 : 500}
                fontColor={themeDesign.scrollNumberFont[colorMode]}>
                Extend Period
              </Text>
              <Flex
                {...(select === 'select_amount'
                  ? themeDesign.inputVariant[colorMode]
                  : null)}
                pos="relative"
                border={themeDesign.editBorder[colorMode]}
                borderRadius={4}
                w={'143px'}
                mr={'10px'}>
                <NumberInput
                  h="32px"
                  value={periodValue}
                  cursor=""
                  onChange={(periodValue) =>
                    periodValue !== '-' && periodValue !== '.'
                      ? setPeriodValue(Number(periodValue))
                      : null
                  }>
                  <NumberInputField
                    border="none"
                    w={'125px'}
                    h="32px"
                    disabled={select === 'select_amount'}
                    ref={periodRef}
                    fontSize={'0.750em'}
                    _focus={{
                      borderWidth: 0,
                    }}></NumberInputField>
                </NumberInput>
                <Flex
                  pos="absolute"
                  right={1}
                  h={'100%'}
                  alignItems="center"
                  fontSize={'12px'}
                  color={
                    themeDesign.labelColor[colorMode][
                      select === 'select_period' ? 'active' : 'notActive'
                    ]
                  }>
                  <span>Months</span>
                </Flex>
              </Flex>
              <Flex h={'100%'} alignItems="center" justifyContent="center">
                <CustomTooltip
                  toolTipW={150}
                  toolTipH={'50px'}
                  msg={[
                    `You can extend period within ${availableMonth} months`,
                  ]}></CustomTooltip>
              </Flex>
            </Flex>
            <Box
              pos="absolute"
              w={'91%'}
              pt={'25px'}
              bottom={'25px'}
              as={Flex}
              borderTop={themeDesign.border[colorMode]}
              justifyContent={'center'}>
              <Button
                {...(btnDisable
                  ? {...btnStyle.btnDisable({colorMode})}
                  : {...btnStyle.btnAble()})}
                w={'150px'}
                fontSize="14px"
                disabled={btnDisable}
                mr={'15px'}
                onClick={() => {
                  if (select === 'select_amount') {
                    console.log(Number(value));
                    console.log(Number(balance.replaceAll(',', '')));
                    console.log(
                      Number(value) > Number(balance.replaceAll(',', '')),
                    );
                    if (account && selectLockId !== '' && value !== '0') {
                      if (Number(value) > Number(balance.replaceAll(',', ''))) {
                        return toastMsg({
                          status: 'error',
                          title: 'Error',
                          description: `Balance is not enough`,
                          duration: 5000,
                          isClosable: true,
                        });
                      }
                      increaseAmount({
                        account,
                        library,
                        lockId: selectLockId,
                        amount: value === tos ? tosOrigin : value,
                        allBalance: value === tos,
                        handleCloseModal,
                      });
                    }
                  }
                  if (select === 'select_period') {
                    if (account && selectLockId !== '' && periodValue !== 0) {
                      if (periodValue > availableMonth) {
                        return toastMsg({
                          status: 'error',
                          title: 'Error',
                          description: `You can extend period within ${availableMonth} months`,
                          duration: 5000,
                          isClosable: true,
                        });
                      } else {
                        extendPeriod({
                          account,
                          library,
                          lockId: selectLockId,
                          lockupTime: Math.ceil(
                            moment.duration(periodValue, 'months').asWeeks(),
                          ),
                          handleCloseModal,
                        });
                      }
                    }
                  }
                }}>
                OK
              </Button>
              <Button
                bg="transparent"
                border={themeDesign.btnBorder[colorMode]}
                w={'150px'}
                fontSize="14px"
                _hover={{}}
                disabled={!active}
                onClick={() => {
                  setEdit(false);
                  setSelectLockId('');
                  setValue('0');
                  setPeriodValue(0);
                }}>
                Cancel
              </Button>
            </Box>
          </Flex>
        </RadioGroup>
      </ModalBody>
    );
  };

  return (
    <Modal
      isOpen={data.modal === 'dao_manage' ? true : false}
      isCentered
      onClose={() => {
        setEdit(false);
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="500px"
        pt="25px"
        pb="25px">
        <CloseButton
          closeFunc={() => {
            setEdit(false);
            setSelectLockId('');
            setValue('0');
            setPeriodValue(0);
            handleCloseModal();
          }}></CloseButton>
        {!edit && <MainScreen />}
        {edit && <EditScreen />}
      </ModalContent>
    </Modal>
  );
};
