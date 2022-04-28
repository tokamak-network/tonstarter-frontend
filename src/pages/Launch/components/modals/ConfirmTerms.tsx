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
  Checkbox,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';
import {Link, useRouteMatch} from 'react-router-dom';

const ConfirmTermsModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(false);

  const match = useRouteMatch();
  const {url} = match;

  const closeModal = () => {
    setIsCheck(false);
    handleCloseModal();
  };

  return (
    <Modal
      isOpen={data.modal === 'Launch_ConfirmTerms' ? true : false}
      isCentered
      onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        w="350px"
        pt="25px"
        pb="25px">
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
              Warning
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'30px'}
            pl={'35px'}
            fontSize={13}
            fontWeight={600}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Flex w={'100%'} flexDir={'column'} mb={'24px'}>
              <Text w={'300px'} h={'300px'} overflow={'auto'}>
                Inappropriate projects (in cases where illegal elements such as
                violence, gambling, sexuality, etc. are evident) may be delisted
                from the TonStarter page without prior notice, and the cost of
                listing is not compensated. Both publishers and participants are
                required to comply with applicable laws and regulations in their
                use of TonStarter. Additional information for KYC may be
                requested in the future, and non-compliance may result in
                disadvantages such as delisting. Inappropriate projects (in
                cases where illegal elements such as violence, gambling,
                sexuality, etc. are evident) may be delisted from the TonStarter
                page without prior notice, and the cost of listing is not
                compensated. Both publishers and participants are required to
                comply with applicable laws and regulations in their use of
                TonStarter. Additional information for KYC may be requested in
                the future, and non-compliance may result in disadvantages such
                as delisting.
              </Text>
            </Flex>
            <Flex mt={'25px'} alignItems="center">
              <Checkbox
                w={'18px'}
                h={'18px'}
                mr={'12px'}
                onChange={() => setIsCheck(!isCheck)}></Checkbox>
              <Text w={'169px'} h={'34px'}>
                I understand the above and agree to the purpose.
              </Text>
            </Flex>
          </Flex>

          <Box mt={'25px'} mb={'25px'} px={'15px'}>
            <Line></Line>
          </Box>

          <Box as={Flex} alignItems="center" justifyContent="center">
            <CustomButton
              text={'Cancel'}
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
            <Link to={isCheck ? `${url}/createproject` : '#'}>
              <CustomButton
                text={'Confirm'}
                func={() => {
                  if (isCheck) return closeModal();
                }}
                style={{
                  backgroundColor: isCheck
                    ? 'blue.500'
                    : colorMode === 'light'
                    ? '#e9edf1'
                    : '#353535',
                  color:
                    colorMode === 'light'
                      ? isCheck
                        ? '#ffffff'
                        : '#86929d'
                      : isCheck
                      ? '#ffffff'
                      : '#838383',
                }}></CustomButton>
            </Link>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmTermsModal;
