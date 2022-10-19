import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Box,
  Heading,
  Text,
  Flex,
  useTheme,
  useColorMode,
  Link,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';

const NoticeModal = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(true);

  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };

  const link = 'https://tonstarter.tokamak.network/dao';

  return (
    <Modal isOpen={isCheck} isCentered onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="500px"
        // h={'348px'}
        pt="20px"
        pb="20px">
        <CloseButton closeFunc={closeModal}></CloseButton>
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
              <Flex flexDir={'column'}>
                <Text>Planned service maintenance &</Text>
                <Text>smart contract upgrade announcement</Text>
              </Flex>
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'20px'}
            // pl={'23px'}
            // pr={'27px'}
            fontSize={15}
            fontFamily={theme.fonts.fld}
            color={colorMode === 'light' ? 'gray.250' : '#f3f4f1'}>
            <Text>
              Sometime between October ~ November 2022, TONStarter’s DAO page
            </Text>
            <Text>
              will be deprecated and moved under the new TOSv2’s DAO page.
            </Text>
            <Text>
              TONStarter DAO page’s “Manage”, “Unstake”, “Stake” functionality
              will
            </Text>
            <Text>
              not work for up to 24 hours to upgrade the TOSv2 staking contract.
            </Text>
            <Text>The exact schedule will be updated later.</Text>
            <Flex>
              <Text>Check our medium article [</Text>
              <Link
                color={'#2a72e5'}
                isExternal={true}
                href="https://medium.com/onther-tech/tonstarter-planned-service-maintenance-smart-contract-upgrade-announcement-4362b02403c2">
                EN
              </Link>
              ,
              <Link
                color={'#2a72e5'}
                isExternal={true}
                href="https://medium.com/onther-tech/%ED%86%A4%EC%8A%A4%ED%83%80%ED%84%B0-%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%9C%A0%EC%A7%80-%EB%B3%B4%EC%88%98-%EB%B0%8F-%EC%8A%A4%EB%A7%88%ED%8A%B8-%EC%BB%A8%ED%8A%B8%EB%9E%99%ED%8A%B8-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C-%EA%B3%B5%EC%A7%80-eaea40e9c8f6">
                KR
              </Link>
              <Text>] for more details.</Text>
            </Flex>
          </Flex>

          <Box mt={'25px'} mb={'25px'} px={'15px'}>
            <Line></Line>
          </Box>

          <Box as={Flex} alignItems="center" justifyContent="center">
            <CustomButton
              text={'Detail'}
              func={() => {
                window.open(
                  'https://medium.com/onther-tech/tonstarter-planned-service-maintenance-smart-contract-upgrade-announcement-4362b02403c2',
                );
              }}
              style={{
                marginRight: '12px',
                backgroundColor: '#257eee',
                color: colorMode === 'light' ? '#ffffff' : '',
              }}></CustomButton>
            <CustomButton
              text={'Close'}
              func={() => {
                closeModal();
              }}
              style={{
                marginRight: '12px',
                backgroundColor: colorMode === 'light' ? '#fff' : '#222',
                border:
                  colorMode === 'light'
                    ? '1px solid #dfe4ee'
                    : '1px solid #535353',
                color: colorMode === 'light' ? '#3e495c' : '',
              }}></CustomButton>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NoticeModal;