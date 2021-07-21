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
  Container,
  Select,
} from '@chakra-ui/react';
import React, {useCallback} from 'react';
import {useWeb3React} from '@web3-react/core';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {onKeyDown, useInput} from 'hooks/useInput';
import {useModal} from 'hooks/useModal';
import {useState, useEffect, useRef} from 'react';

type SelectPeriod = '1month' | '6months' | '1year' | '3year';

export const StakeOptionModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {account, library} = useWeb3React();
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [selectPeriod, setSelectPeriod] = useState<string | undefined>(
    undefined,
  );
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const periods = ['1month', '6months', '1year', '3year'];

  let balance = data?.data?.user?.balance;
  const {btnStyle} = theme;
  const {value, setValue, onChange} = useInput();
  const {handleCloseModal, handleOpenConfirmModal} = useModal(setValue);
  const keys = [undefined, '', '0', '0.', '0.0', '0.00'];
  const btnDisabled = keys.indexOf(value) !== -1 ? true : false;

  useEffect(() => {
    console.log(selectPeriod);
  }, [selectPeriod]);

  const focusTarget = useRef<any>([]);

  const changeBorderColor = (index: any) => {
    const {current} = focusTarget;
    current.map((e: any) => (e.style.border = 'solid 1px #d7d9df'));
    current[index].style.border = 'solid 1px #2a72e5';
    setSelectPeriod(current[index].id);
  };

  return (
    <Modal
      isOpen={data.modal === 'dao_stake' ? true : false}
      isCentered
      onClose={() => {
        setIsCustom(false);
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
              w={'125px'}
              value={value}
              onKeyDown={onKeyDown}
              onChange={onChange}
              _focus={{
                borderWidth: 0,
              }}
            />
            <Text>TOS</Text>
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
                color={'black.300'}
                mb="10px">
                Locking Period
              </Text>
              <Flex
                w={'320px'}
                h="26px"
                mb="10px"
                fontSize={'0.750em'}
                fontWeight={600}
                cursor={'pointer'}>
                {periods.map((period: string, index: number) => (
                  <Text
                    w={'80px'}
                    h="100%"
                    id={period}
                    ref={(el) => (focusTarget.current[index] = el)}
                    borderTop={'solid 1px #d7d9df'}
                    borderBottom={'solid 1px #d7d9df'}
                    borderLeft={index !== 0 ? '' : 'solid 1px #d7d9df'}
                    borderLeftRadius={index === 0 ? 4 : 0}
                    borderRightRadius={index === periods.length - 1 ? 4 : 0}
                    borderRight={'solid 1px #d7d9df'}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    onClick={() => changeBorderColor(index)}>
                    {period as SelectPeriod}
                  </Text>
                ))}
              </Flex>
              {!isCustom && (
                <Button
                  w={'120px'}
                  h="26px"
                  bg="transparent"
                  border="solid 1px #d7d9df"
                  fontSize={'0.750em'}
                  _hover={{}}
                  onClick={() => setIsCustom(true)}>
                  Customized
                </Button>
              )}
              {isCustom && (
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontSize={'0.750em'} color="gray.250" fontWeight={600}>
                    Customized
                  </Text>
                  <Input w="132px" h="32px"></Input>
                  <Select w="100px" h="32px" fontSize={'0.750em'}>
                    <option value="" disabled selected hidden>
                      Select
                    </option>
                    <option value="days">days</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                  </Select>
                </Flex>
              )}
            </Box>
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              {...(btnDisabled === true
                ? {...btnStyle.btnDisable({colorMode})}
                : {...btnStyle.btnAble()})}
              w={'150px'}
              fontSize="14px"
              _hover={{...theme.btnHover}}
              disabled={btnDisabled}
              onClick={() => {
                handleOpenConfirmModal({
                  type: 'confirm',
                  data: {
                    amount: value,
                    // period,
                    action: () => {},
                  },
                });
              }}>
              Stake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
