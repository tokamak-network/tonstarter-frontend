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
} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {selectModalType} from 'store/modal.reducer';
import {useModal} from 'hooks/useModal';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import {CustomInput} from 'components/Basic';
import AdminActions from '../actions';
import {TokenImage} from './TokenImage';

const Container = (props: {
  title: string;
  value: any;
  setValue?: React.SetStateAction<any>;
  w?: string;
}) => {
  const {colorMode} = useColorMode();
  const {title, value, setValue, w} = props;

  return (
    <Box d="flex" flexDir="column" mb={'24px'}>
      <Text mb={'9px'}>{title}</Text>
      <CustomInput
        w={w || '290px'}
        h={'32px'}
        style={{fontSize: '12px', textAlign: 'left'}}
        value={value}
        setValue={setValue}
        placeHolder={'Enter token address'}
        fontWeight={500}
        startWithZero={true}
        color={
          value !== ''
            ? colorMode === 'light'
              ? 'gray.225'
              : 'white.100'
            : 'gray.175'
        }></CustomInput>
    </Box>
  );
};

export const EditPoolModal = () => {
  const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {chainId} = useActiveWeb3React();
  const {handleCloseModal} = useModal();
  const {btnStyle} = theme;

  const [poolName, setPoolName] = useState<string>('');
  const [poolAddress, setPoolAddress] = useState<string>(
    data.data?.originalData?.address || '',
  );
  const [token0, setToken0] = useState<string>('');
  const [token1, setToken1] = useState<string>('');
  const [token0Image, setToken0Image] = useState<string>('');
  const [token1Image, setToken1Image] = useState<string>('');
  const [fee, setFee] = useState<string>('');

  useEffect(() => {
    if (data.data?.originalData) {
      const {
        poolAddress,
        poolName,
        token0Address,
        token1Address,
        token0Image,
        token1Image,
        feeTier,
      } = data.data?.originalData;
      setPoolAddress(poolAddress || 'undefined');
      setPoolName(poolName || 'undefined');
      setToken0(token0Address || 'undefined');
      setToken1(token1Address || 'undefined');
      setToken0Image(token0Image || 'undefined');
      setToken1Image(token1Image || 'undefined');
      setFee(feeTier || '0');
    }
  }, [data]);

  return (
    <Modal
      isOpen={data.modal === 'Admin_EditPool' ? true : false}
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
              Edit Pool
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can manage a pool
            </Text>
          </Box>

          <Flex
            flexDir="column"
            mt={'30px'}
            pl={'30px'}
            pr={'30px'}
            fontSize={'13px'}
            fontWeight={600}
            color={colorMode === 'light' ? 'black.300' : 'white.100'}>
            <Container
              title={'Pool Name'}
              value={poolName}
              setValue={setPoolName}
            />
            <Container title={'Pool Address'} value={poolAddress} />
            <Container title={'Token 0'} value={token0} setValue={setToken0} />
            <Flex justifyContent="space-between">
              <Container
                w={'230px'}
                title={'Token 0 Image'}
                value={token0Image}
                setValue={setToken0Image}
              />
              <Box mt={'10px'}>
                <TokenImage imageLink={token0Image}></TokenImage>
              </Box>
            </Flex>
            <Container title={'Token 1'} value={token1} setValue={setToken1} />
            <Flex justifyContent="space-between">
              <Container
                w={'230px'}
                title={'Token 1 Image'}
                value={token1Image}
                setValue={setToken1Image}
              />
              <Box mt={'10px'}>
                <TokenImage imageLink={token1Image}></TokenImage>
              </Box>
            </Flex>
            <Container title={'Fee'} value={fee} setValue={setFee} />
          </Flex>

          <Box
            as={Flex}
            justifyContent={'space-between'}
            pt={5}
            px={'20px'}
            borderTop={
              colorMode === 'light' ? '1px solid #f4f6f8' : '1px solid #373737'
            }>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              onClick={() =>
                chainId &&
                AdminActions.editPool({
                  chainId,
                  poolName,
                  poolAddress,
                  token0Address: token0,
                  token1Address: token1,
                  token0Image,
                  token1Image,
                  feeTier: Number(fee),
                })
              }>
              Save
            </Button>
            <Button
              {...btnStyle.btnAble()}
              w={'150px'}
              fontSize="14px"
              _hover={{}}
              color={colorMode === 'light' ? 'gray.225' : 'white.100'}
              bg={'transparent'}
              borderWidth={1}
              onClick={() => {
                handleCloseModal();
              }}>
              Close
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
