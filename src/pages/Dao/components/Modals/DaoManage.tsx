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
  Wrap,
  useTheme,
  useColorMode,
  Input,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useUser} from 'hooks/useUser';
import {useState, useEffect} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import backArrowIcon from 'assets/svgs/back_arrow_icon.svg';
import {useRef} from 'react';
import {increaseAmount, extendPeriod} from '../utils';
import {getUserTosBalance} from 'client/getUserBalance';

interface Stake {
  lockId: string;
  lockedBalance: string;
  end: false;
  periodDays: number;
  periodweeks: number;
}

type TosStakeList = Stake[] | undefined;

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
    dark: 'solid 1px #dfe4ee',
  },
  editBorder: {
    light: 'solid 1px #dfe4ee',
    dark: 'solid 1px #dfe4ee',
  },
  inputVariant: {
    light: {
      style: {backgroundColor: '#e9edf1'},
      isDisabled: true,
    },
    dark: {
      style: {backgroundColor: '#e9edf1'},
      isDisabled: true,
    },
  },
};

export const DaoManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {stakeList} = data.data;
  const [edit, setEdit] = useState(false);
  const [selectLockId, setSelectLockId] = useState('');
  const [select, setSelect] = useState('select_amount');
  const [balance, setBalance] = useState('0');
  const [tosStakeList, setTosStakeList] = useState<TosStakeList>(undefined);
  const {value, setValue, onChange} = useInput('0');
  const {value: periodValue, onChange: periodOnchange} = useInput('0');

  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {signIn, account, library} = useUser();
  const {btnStyle} = theme;
  const {handleCloseModal} = useModal();

  const focusTarget = useRef<any>([]);

  useEffect(() => {
    if (stakeList) {
      setTosStakeList(stakeList);
    }
  }, [signIn, account, library, stakeList]);

  useEffect(() => {
    async function getTosBalance() {
      if (account !== undefined) {
        const res = await getUserTosBalance(account, library);
        if (res !== undefined) {
          setBalance(res);
        }
      }
    }
    if (signIn) {
      getTosBalance();
    } else {
      setBalance('-');
    }
    /*eslint-disable*/
  }, []);

  const [test, setTest] = useState('');

  const testOnChange = (e: any) => {
    const {
      target: {value},
    } = e;
    setTest(value);
  };

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
            <Wrap display="flex" style={{marginTop: '0', marginBottom: '20px'}}>
              {tosStakeList?.map((stake: any, index: number) => {
                return (
                  <Flex
                    ref={(el) => (focusTarget.current[index] = el)}
                    alignItems="center"
                    pl="1.438em"
                    h={'64px'}
                    borderBottom={themeDesign.border[colorMode]}
                    key={index}>
                    <Text
                      w="3.750em"
                      fontSize={'0.813em'}
                      fontWeight={600}
                      fontColor={themeDesign.scrollNumberFont[colorMode]}>
                      {index + 1}
                    </Text>
                    <Box w={'7em'}>
                      <Text
                        fontSize={'0.750em'}
                        color={themeDesign.scrollAmountFont[colorMode]}>
                        Amount
                      </Text>
                      <Text
                        fontSize={'1em'}
                        fontColor={themeDesign.scrollNumberFont[colorMode]}
                        fontWeight={'bold'}>
                        {Number(stake.lockedBalance).toLocaleString()}
                        <span
                          style={{
                            fontSize: '0.688em',
                            paddingLeft: '0.188em',
                          }}>
                          TOS
                        </span>
                      </Text>
                    </Box>
                    <Box w={'5em'}>
                      <Text
                        fontSize={'0.750em'}
                        color={themeDesign.scrollAmountFont[colorMode]}>
                        Period
                      </Text>
                      <Text
                        fontSize={'1em'}
                        fontColor={themeDesign.scrollNumberFont[colorMode]}
                        fontWeight={'bold'}>
                        {stake.periodWeeks}
                        <span
                          style={{
                            fontSize: '0.688em',
                            paddingLeft: '0.188em',
                          }}>
                          {stake.periodWeeks > 1 ? 'weeks' : 'week'}
                        </span>
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
                      }}>
                      Edit
                    </Button>
                  </Flex>
                );
              })}
            </Wrap>
          </Scrollbars>
        </Box>
        <Box as={Flex} justifyContent={'center'}>
          <Button
            {...(signIn
              ? {...btnStyle.btnAble()}
              : {...btnStyle.btnDisable({colorMode})})}
            w={'150px'}
            fontSize="14px"
            _hover={theme.btnHover.checkDisable({signIn})}
            disabled={!signIn}
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
                  You can edit the amount and Period.
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
                w={'70px'}
                fontSize={'0.813em'}
                fontWeight={600}
                fontColor={themeDesign.editBorder[colorMode]}>
                Increase Amount
              </Text>
              <Input
                w={'143px'}
                h="32px"
                mr={'10px'}
                // value={test}
                // onKeyDown={onKeyDown}
                // onChange={testOnChange}
                _focus={{
                  borderWidth: 0,
                }}
                {...(select === 'select_period'
                  ? themeDesign.inputVariant[colorMode]
                  : '')}></Input>
              <Button
                w="70px"
                h="32px"
                bg="transparent"
                fontSize={'0.813em'}
                fontWeight={400}
                border={themeDesign.editBorder[colorMode]}
                _hover={{}}
                onClick={() => {
                  setValue(balance);
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
                w={'70px'}
                fontSize={'0.813em'}
                fontWeight={600}
                fontColor={themeDesign.scrollNumberFont[colorMode]}>
                Extend Period
              </Text>
              <Input
                w={'143px'}
                h="32px"
                mr={'0.750em'}
                fontSize={'0.750em'}
                value={periodValue}
                onChange={periodOnchange}
                {...(select === 'select_amount'
                  ? themeDesign.inputVariant[colorMode]
                  : '')}></Input>
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
                {...btnStyle.btnAble()}
                w={'150px'}
                fontSize="14px"
                _hover={theme.btnHover.checkDisable({signIn})}
                disabled={!signIn}
                mr={'15px'}
                onClick={() => {
                  if (select === 'select_amount') {
                    if (account !== undefined && selectLockId !== '') {
                      increaseAmount({
                        account,
                        library,
                        lockId: selectLockId,
                        amount: value,
                      });
                    }
                  }
                  if (select === 'select_period') {
                    if (account !== undefined && selectLockId !== '') {
                      extendPeriod({
                        account,
                        library,
                        lockId: selectLockId,
                        period: Number(value),
                      });
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
                disabled={!signIn}
                onClick={() => {
                  setEdit(false);
                  setSelectLockId('');
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
        w="350px"
        pt="25px"
        pb="25px">
        {!edit && <MainScreen />}
        {edit && <EditScreen />}
      </ModalContent>
    </Modal>
  );
};
