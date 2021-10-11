import {AdminObject} from '@Admin/types';
import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {getUserTonBalance} from 'client/getUserBalance';
import {CustomInput} from 'components/Basic';
import {CustomButton} from 'components/Basic/CustomButton';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailCounter} from './Detail_Counter';
import starterActions from '../../actions';
import {useCheckBalance} from 'hooks/useCheckBalance';

type OpenSaleDepositProps = {
  saleInfo: AdminObject;
  activeProjectInfo: any;
  isApprove: boolean;
};

export const OpenSaleDeposit: React.FC<OpenSaleDepositProps> = (prop) => {
  const {saleInfo, activeProjectInfo, isApprove} = prop;

  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {account, library} = useActiveWeb3React();

  const [inputBalance, setInputBalance] = useState(0);
  const [userTonBalance, setUserTonBalance] = useState<string>('-');
  const [totalAllocation, setTotalAllocation] = useState<string>('-');
  const [totalDeposit, setTotalDeposit] = useState<string>('-');
  const [yourDeposit, setYourDeposit] = useState<string>('-');

  const {checkBalance} = useCheckBalance();

  const {STATER_STYLE} = theme;

  const detailSubTextStyle = {
    color: colorMode === 'light' ? 'gray.250' : 'white.100',
  };

  useEffect(() => {
    async function callUserBalance() {
      const tonBalance = await getUserTonBalance({account, library});
      return setUserTonBalance(tonBalance || '-');
    }
    if (account && library) {
      callUserBalance();
    }
  }, [account, library]);

  //call view funcions
  useEffect(() => {
    async function getData() {
      // const res = await Promise.all([

      // ])
      if (account && library && saleInfo) {
        const address = saleInfo.saleContractAddress;
        const res = await Promise.all([
          starterActions.getTotalExpectOpenSaleAmount({
            address,
            library,
          }),
          starterActions.getTotalDepositAmount({
            address,
            library,
          }),
          starterActions.getUserDeposit({
            account,
            library,
            address,
          }),
        ]);
        if (res) {
          //@ts-ignore
          setTotalAllocation(res[0]);
          //@ts-ignore
          setTotalDeposit(res[1]);
          //@ts-ignore
          setYourDeposit(res[2]);
        }
      }
    }
    if (account && library && saleInfo) {
      getData();
    }
  }, [account, library, saleInfo]);

  return (
    <Flex flexDir="column" pl={'45px'}>
      <Box d="flex" textAlign="center" alignItems="center" mb={'20px'}>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 25})} mr={'20px'}>
          Open Sale
        </Text>
        <DetailCounter
          numberFontSize={'18px'}
          stringFontSize={'14px'}
          date={
            activeProjectInfo?.timeStamps.endOpenSaleTime * 1000
          }></DetailCounter>
      </Box>
      <Text
        {...STATER_STYLE.subText({colorMode})}
        letterSpacing={'1.4px'}
        mb={'10px'}>
        Deposited Amount
      </Text>
      <Box d="flex" alignItems="center" mb={'30px'}>
        <Box mr={'10px'}>
          <CustomInput
            w={'220px'}
            h={'32px'}
            numberOnly={true}
            color={
              Number(inputBalance) > 0
                ? colorMode === 'light'
                  ? 'gray.225'
                  : 'white.100'
                : 'gray.175'
            }
            value={inputBalance}
            setValue={setInputBalance}></CustomInput>
        </Box>
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 13})} mr={'3px'}>
          Your balance :{' '}
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}
          mr={'3px'}>
          {userTonBalance}
        </Text>
        <Text
          {...STATER_STYLE.mainText({colorMode, fontSize: 13})}
          color={'blue.100'}>
          TON
        </Text>
      </Box>
      <Box d="flex" flexDir="column">
        <Text {...STATER_STYLE.mainText({colorMode, fontSize: 14})}>
          Details
        </Text>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Sale Period :{' '}
            </Text>
            <Text {...detailSubTextStyle}>
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.startOpenSaleTime,
                'YYYY-MM-D',
              )}{' '}
              ~{' '}
              {convertTimeStamp(
                activeProjectInfo?.timeStamps?.endOpenSaleTime,
                'YYYY-MM-D',
              )}
            </Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Total Allocation :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{totalAllocation}</Text>
          </Flex>
        </Box>
        <Box d="flex" fontSize={'13px'} justifyContent="space-between">
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Total Deposited :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{totalDeposit}</Text>
          </Flex>
          <Flex>
            <Text color={'gray.400'} mr={'3px'}>
              Your Deposited :{' '}
            </Text>
            <Text {...detailSubTextStyle}>{yourDeposit}</Text>
          </Flex>
        </Box>
      </Box>
      <Box mt={'46px'}>
        {isApprove === true ? (
          <CustomButton
            text={'Deposit'}
            func={() =>
              account &&
              checkBalance(inputBalance, Number(userTonBalance)) &&
              starterActions.deposit({
                address: saleInfo.saleContractAddress,
                account,
                library,
                amount: String(inputBalance),
              })
            }></CustomButton>
        ) : (
          <CustomButton
            text={'Approve'}
            func={() =>
              account &&
              starterActions.getAllowance(
                account,
                library,
                saleInfo?.saleContractAddress,
              )
            }></CustomButton>
        )}
      </Box>
    </Flex>
  );
};
