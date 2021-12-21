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
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CloseButton} from 'components/Modal';
import {ClaimList} from '@Dao/types';
import {DEPLOYED} from 'constants/index';
import * as LockTOSDividend from 'services/abis/LockTOSDividend.json';
import {useContract} from 'hooks/useContract';
import Web3 from 'web3';

const ClaimRecord = ({
  name,
  amount,
  tokenName,
  index,
}: {
  name: string;
  amount: string;
  tokenName: string;
  index: number;
}) => {
  const {colorMode} = useColorMode();
  return (
    <WrapItem w="100%" h="37px">
      <Flex w="100%" justifyContent="space-between" pl="1.875em" pr="1.875em">
        <Text
          color={colorMode === 'light' ? 'gray.400' : 'gray.425'}
          fontSize={'13px'}>
          {`#${index + 1}`}
        </Text>
        <Text
          color={colorMode === 'light' ? 'gray.250' : 'white.200'}
          fontSize={'15px'}
          fontWeight={600}>
          {amount} {tokenName}
        </Text>
      </Flex>
    </WrapItem>
  );
};

export const DaoClaim = (props: any) => {
  const {data} = useAppSelector(selectModalType);
  const {balance, claimList} = data.data;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {handleCloseModal} = useModal();
  const {account} = useActiveWeb3React();

  const [unstakeList, setUnstakeList] = useState<ClaimList[] | []>([]);
  const [unstakeBalance, setUnstakeBalance] = useState('-');
  const [tokenList, setTokenList] = useState([]);

  const {LockTOSDividend_ADDRESS} = DEPLOYED;
  const DIVIDEND_CONTRACT = useContract(
    LockTOSDividend_ADDRESS,
    LockTOSDividend.abi,
  );

  useEffect(() => {
    if (balance) {
      setUnstakeBalance(balance);
    }
    if (claimList) {
      const list = claimList.filter(
        (data: ClaimList) => Number(data.claimAmount.replaceAll(',', '')) > 0,
      );
      const tokenAddresses = list.map((data: ClaimList) => {
        return data.tokenAddress;
      });
      setTokenList(tokenAddresses);
      setUnstakeList(list);
    }
    /*eslint-disable*/
  }, [data, balance, claimList]);

  return (
    <Modal
      isOpen={data.modal === 'dao_claim' ? true : false}
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
              Claim
            </Heading>
            <Text color="gray.175" fontSize={'0.750em'} textAlign={'center'}>
              You can claim
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
                $ {unstakeBalance}
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
                  {unstakeList.map((data: ClaimList, index: number) => (
                    <ClaimRecord
                      index={index}
                      name={data.name}
                      amount={data.claimAmount}
                      tokenName={data.tokenName}
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
              onClick={async () => {
                if (account && tokenList.length > 0) {
                  try {
                    // DIVIDEND_CONTRACT?.claimBatch(tokenList);
                    const web3 = new Web3(Web3.givenProvider);
                    //@ts-ignore
                    const contract = new web3.eth.Contract(
                      //@ts-ignore
                      LockTOSDividend.abi,
                      LockTOSDividend_ADDRESS,
                    );
                    contract.methods
                      .claimBatch([
                        '0x709bef48982Bbfd6F2D4Be24660832665F53406C',
                      ])
                      .send({from: account});
                    // const tx = {
                    //   // this could be provider.addresses[0] if it exists
                    //   from: account,
                    //   // target address, this could be a smart contract address
                    //   to: LockTOSDividend_ADDRESS,
                    //   // optional if you want to specify the gas limit
                    //   gas: 21000,
                    //   // optional if you are invoking say a payable function
                    //   // value: value,
                    //   // this encodes the ABI of the method and the arguements
                    //   data: contract.methods.claimBatch([
                    //     '0x44d4F5d89E9296337b8c48a332B3b2fb2C190CD0',
                    //   ]),
                    // };
                    // const signPromise = web3.eth.signTransaction(tx, tx.from);
                    // signPromise.then((signedTx) => {
                    // raw transaction string may be available in .raw or
                    // .rawTransaction depending on which signTransaction
                    // function was called
                    //@ts-ignore
                    // const sentTx = web3.eth.sendSignedTransaction(
                    //   //@ts-ignore
                    //   signedTx.raw || signedTx.rawTransaction,
                    // );
                    // });

                    // contarct.methods.claimBatch(tokenList).send({from: account});
                    // console.log(contarct.methods.claimBatch(tokenList));
                    // claimDividendPool({
                    //   account,
                    //   library,
                    //   tokenAddress: tokenList,
                    // });
                  } catch (e) {
                    console.log(e);
                  } finally {
                  }
                }
              }}>
              Claim
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
