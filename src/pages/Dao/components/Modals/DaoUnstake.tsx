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
  Stack,
  useTheme,
  useColorMode,
  WrapItem,
} from '@chakra-ui/react';
import React from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {useEffect, useState} from 'react';
import {Scrollbars} from 'react-custom-scrollbars-2';
import {unstakeTOS} from '../../actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';

const UnstakeRecord = ({number, amount}: {number: number; amount: string}) => {
  const {colorMode} = useColorMode();
  return (
    <WrapItem w="100%" h="37px">
      <Flex w="100%" justifyContent="space-between" pl="1.875em" pr="1.875em">
        <Text
          color={colorMode === 'light' ? 'gray.400' : 'gray.425'}
          fontSize={'13px'}>
          #{number + 1}
        </Text>
        <Text
          color={colorMode === 'light' ? 'gray.250' : 'white.200'}
          fontSize={'15px'}
          fontWeight={600}>
          {amount} TOS
        </Text>
      </Flex>
    </WrapItem>
  );
};

export const DaoUnstakeModal = (props: any) => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {account, library} = useActiveWeb3React();

  const [unstakeList, setUnstakeList] = useState<[{}]>([{}]);
  const [unstakeBalance, setUnstakeBalance] = useState('-');

  useEffect(() => {
    const lockList = data?.data?.lockList;
    if (lockList === undefined) {
      return;
    }
    const unstakedList = lockList.filter(
      (e: any) => e.end === true && e.endTime > 0,
    );
    const unstakedBalance = unstakedList.reduce((acc: any, cur: any) => {
      return Number(acc) + Number(cur.lockedBalance.replaceAll(',', ''));
    }, 0);
    setUnstakeList(unstakedList);
    // setUnstakeBalance(unstakedBalance.toFixed(2));
    setUnstakeBalance(
      Number(unstakedBalance).toLocaleString(undefined, {
        minimumFractionDigits: 2,
      }),
    );
    /*eslint-disable*/
  }, [data]);

  return (
    <Modal
      isOpen={data.modal === 'dao_unstake' ? true : false}
      isCentered
      onClose={() => {
        handleCloseModal();
      }}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
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
              textAlign={'center'}>
              Unstake
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can earn sTOS and POWER
            </Text>
          </Box>

          <Stack
            as={Flex}
            justifyContent={'center'}
            alignItems={'center'}
            borderBottom={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }
            mb={'25px'}>
            <Box textAlign={'center'} pt="20px" pb="20px">
              <Text
                fontSize={'26px'}
                fontWeight={600}
                color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
                {unstakeBalance} TOS
              </Text>
            </Box>
            <Text
              style={{marginTop: '0', marginBottom: '0.313em'}}
              fontSize="0.750em"
              color="gray.400">
              Detail
            </Text>
            {unstakeList !== undefined && unstakeList.length > 0 && (
              <Scrollbars
                style={{
                  width: '100%',
                  height: '135px',
                  display: 'flex',
                  position: 'relative',
                }}
                thumbSize={70}
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
                  style={{marginTop: '0', marginBottom: '20px'}}
                  justifyContent="center"
                  flexDir="column">
                  {unstakeList.map((unstake: any, index: number) => (
                    <UnstakeRecord
                      number={index}
                      amount={unstake.lockedBalance}
                      key={index}
                    />
                  ))}
                </Flex>
              </Scrollbars>
            )}
          </Stack>

          <Box as={Flex} justifyContent={'center'}>
            <Button
              w={'150px'}
              bg={'blue.500'}
              color="white.100"
              fontSize="14px"
              _hover={{...theme.btnHover}}
              onClick={() => {
                if (account) {
                  unstakeTOS({
                    account,
                    library,
                    handleCloseModal: handleCloseModal(),
                  });
                }
              }}>
              Unstake
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
