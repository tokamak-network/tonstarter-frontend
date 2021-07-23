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
  Image,
  useTheme,
  useColorMode,
  Input,
  Select,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
// import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useUser} from 'hooks/useUser';
import {useState, useEffect} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import backArrowIcon from 'assets/svgs/back_arrow_icon.svg';
import {useRef} from 'react';

interface Stake {
  address: string;
  amount: string;
  period: string;
}

type TosStakeList = Stake[] | undefined;

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
};

export const DaoManageModal = () => {
  const {data} = useAppSelector(selectModalType);
  const [edit, setEdit] = useState(false);
  const [tosStakeList, setTosStakeList] = useState<TosStakeList>(undefined);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {signIn, account, library} = useUser();
  const {btnStyle} = theme;
  const {handleCloseModal, handleOpenConfirmModal} = useModal();

  const focusTarget = useRef<any>([]);

  useEffect(() => {
    const dummyData: Stake[] = [
      {address: 'temp1', amount: '1,000,000', period: '23'},
      {address: 'temp2', amount: '1,000,000', period: '23'},
      {address: 'temp3', amount: '1,000,000', period: '23'},
      {address: 'temp4', amount: '1,000,000', period: '23'},
      {address: 'temp5', amount: '1,000,000', period: '23'},
      {address: 'temp6', amount: '1,000,000', period: '23'},
    ];

    //set the data set for rendering stake list
    setTosStakeList(dummyData);
  }, [signIn, account, library]);

  if (signIn === false) {
    return <></>;
  }

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
              height: '395px',
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
              {tosStakeList?.map((data: any, index: number) => {
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
                      {index}
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
                        {data.amount}
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
                        {data.period}
                        <span
                          style={{
                            fontSize: '0.688em',
                            paddingLeft: '0.188em',
                          }}>
                          day
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
                      onClick={() => setEdit(true)}>
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
              handleOpenConfirmModal({
                type: 'confirm',
                data: {
                  // amount: value,
                  // period,
                  action: () => {},
                },
              });
            }}>
            Manage
          </Button>
        </Box>
      </ModalBody>
    );
  };

  const EditScreen = () => {
    return (
      <ModalBody p={0}>
        <Flex h="524px" flexDir="column" alignItems="center">
          <Flex
            w={'100%'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            pl={'1.250em'}
            pb={'1.250em'}>
            <Image
              w="1.375em"
              h="1.375em"
              src={backArrowIcon}
              mr="0.625em"
              cursor={'pointer'}
              onClick={() => setEdit(false)}></Image>
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
              <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
                You can edit the amount and Period.
              </Text>
            </Flex>
          </Flex>
          <Flex
            alignItems="center"
            pl="1.438em"
            h={'64px'}
            w={'100%'}
            pr="1.875em"
            borderBottom={themeDesign.border[colorMode]}>
            <Text
              w={'55px'}
              fontSize={'0.813em'}
              fontWeight={600}
              fontColor={themeDesign.editBorder[colorMode]}>
              Amount
            </Text>
            <Input w={'10.188em'} h="32px" mr={'0.750em'}></Input>
            <Button
              w="70px"
              h="32px"
              bg="transparent"
              fontSize={'0.813em'}
              fontWeight={400}
              border={themeDesign.editBorder[colorMode]}
              _hover={{}}
              onClick={() => setEdit(true)}>
              Edit
            </Button>
          </Flex>
          <Flex
            alignItems="center"
            pl="1.438em"
            h={'64px'}
            w={'100%'}
            pr="1.875em"
            borderBottom={themeDesign.border[colorMode]}>
            <Text
              w={'55px'}
              fontSize={'0.813em'}
              fontWeight={600}
              fontColor={themeDesign.scrollNumberFont[colorMode]}>
              Period
            </Text>
            <Input
              w={'50px'}
              h="32px"
              mr={'0.750em'}
              fontSize={'0.750em'}></Input>
            <Select w={'6.250em'} h="32px" fontSize={'0.750em'}>
              <option>Day</option>
              <option>Month</option>
              <option>Year</option>
            </Select>
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
              onClick={() => {}}>
              Manage
            </Button>
            <Button
              bg="transparent"
              border={themeDesign.btnBorder[colorMode]}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              disabled={!signIn}
              onClick={() => {}}>
              Cancel
            </Button>
          </Box>
        </Flex>
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
