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
  Link,
} from '@chakra-ui/react';
import React, {useState} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {CloseButton} from 'components/Modal';
import Line from '@Launch/components/common/Line';
import {CustomButton} from 'components/Basic/CustomButton';
import {useRouteMatch} from 'react-router-dom';

const NoticeModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const [isCheck, setIsCheck] = useState<boolean>(false);

  const match = useRouteMatch();
  const {url} = match;

  const [modalOpen, setModalOpen] = useState(true);

  const closeModal = () => {
    setModalOpen(false);
    handleCloseModal();
  };

  return (
    <Modal isOpen={modalOpen} isCentered onClose={() => closeModal()}>
      <ModalOverlay />
      <ModalContent
        fontFamily={theme.fonts.roboto}
        bg={colorMode === 'light' ? 'white.100' : 'black.200'}
        maxW="350px"
        h={'568px'}
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
              NOTICE
            </Heading>
          </Box>

          <Flex
            flexDir="column"
            alignItems="center"
            mt={'30px'}
            pl={'25px'}
            pr={'6px'}
            fontSize={13}
            color={colorMode === 'light' ? 'gray.250' : 'white.100'}>
            <Flex w={'100%'} flexDir={'column'}>
              <Flex
                w={'100%'}
                h={'350px'}
                overflow={'auto'}
                fontSize={13}
                flexDir={'column'}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '::-webkit-scrollbar-track': {
                    background: 'transparent',
                    borderRadius: '4px',
                  },
                  '::-webkit-scrollbar-thumb': {
                    background: '#257eee',
                    borderRadius: '3px',
                  },
                }}>
                <Flex flexDir={'column'} w={'100%'} pr={'20px'}>
                  <Text mb={'10px'}>
                    안녕하십니까 토카막 네트워크 개발사 온더/소셜 토큰 플랫폼
                    라이다입니다. 톤스타터 3번째 IDO, LYDA 관련하여 공지사항
                    전달드립니다.
                  </Text>
                  <Text mb={'10px'}>
                    {' '}
                    최근의 크립토 약세장과 국내 시장 현황이 결부됨에 따라,
                    투자사의 사정으로 인해 LYDA의 프라이빗 라운드 계약이
                    최종적으로 성사되지 못했습니다.
                  </Text>
                  <Text mb={'10px'}>
                    {' '}
                    이에 LYDA팀은 대안을 마련하기 위해 최선의 노력을 다했으나,
                    결과적으로 9만불의 프라이빗 펀딩 공백이 발생하게 되었습니다.
                    LYDA팀은 명확한 목표의식을 바탕으로 본 프로젝트의 비전
                    달성을 추구하기에 프로젝트 운영은 계획대로 진행할
                    예정입니다.
                  </Text>
                  <Text mb={'10px'}>
                    {' '}
                    그러나 어려운 상황 속에서 팀을 신뢰하고 투자해주신 퍼블릭
                    라운드 참여자 분들에게도 형평성에 의거 환불 신청 절차를
                    진행드리고자 합니다. 환불을 희망하시는 퍼블릭 라운드 참여자
                    분들께서는 6/29(수)까지 하기 구글 폼을 작성해주시면
                    7/1(금)에 환불을 실행드리도록 하겠습니다.
                  </Text>
                  <Text mb={'10px'}>감사합니다.</Text>
                  <Text
                    textAlign={'center'}
                    color={'blue.100'}
                    cursor="pointer"
                    onClick={() =>
                      window.open('https://forms.gle/4KQW6kpHohPX4PAk6')
                    }>
                    구글 폼 링크
                  </Text>
                </Flex>
              </Flex>
              <Box mt={'25px'} mb={'25px'} px={'15px'}>
                <Line></Line>
              </Box>
              <Flex alignItems="center" justifyContent="center" w={'100%'}>
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
              </Flex>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default NoticeModal;
