import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Text,
  Center,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
// import {ExclusiveSale} from './components/details/ExclusiveSale';
import {WhiteList} from './components/details/WhiteList';
// import {OpenSale} from './components/details/OpenSale';
// import {OpenSaleAfterDeposit} from './components/details/OpenSaleAfterDeposit';

import {DetailIcons} from './components/details/Detail_Icons';
import {SaleStatus, Tier, DetailInfo, SaleInfo} from './types';
import {DetailTable} from './components/details/Detail_Table';
import {OpenSaleDeposit} from './components/details/OpenSaleDeposit';
import {ExclusiveSalePart} from './components/details/ExclusiveSalePart';
import store from 'store';
import {AdminObject} from '@Admin/types';
import {Claim} from './components/details/Claim';
import {useCallContract} from 'hooks/useCallContract';
import {useActiveWeb3React} from 'hooks/useWeb3';
import starterActions from './actions';
import {convertNumber} from 'utils/number';
import {BigNumber} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {LoadingComponent} from 'components/Loading';
import {TokenImage} from '../Admin/components/TokenImage';
import {ApproveModal} from './components/ApproveModal';
import moment from 'moment';

export const StarterDetail = () => {
  const {id}: {id: string} = useParams();
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const starterData = store.getState().starters.data;

  const [activeStatus, setActiveStatus] = useState<SaleStatus | undefined>(
    undefined,
  );

  // const [activeStatus, setActiveStatus] = useState<SaleStatus | undefined>(
  //   'deposit',
  // );

  const [saleInfo, setSaleInfo] = useState<SaleInfo | undefined>(undefined);
  const [detailInfo, setDetailInfo] = useState<DetailInfo | undefined>(
    undefined,
  );
  const {STATER_STYLE} = theme;
  const {account, library} = useActiveWeb3React();

  const PUBLICSALE_CONTRACT = useCallContract(
    saleInfo?.saleContractAddress || '',
    'PUBLIC_SALE',
  );

  const {blockNumber} = useBlockNumber();

  useEffect(() => {
    async function getInfo() {
      if (account && library && PUBLICSALE_CONTRACT && saleInfo) {
        const res = await Promise.all([
          starterActions.calculTier({
            account,
            library,
            address: saleInfo.saleContractAddress,
          }),
          PUBLICSALE_CONTRACT.totalExpectSaleAmount(),
          PUBLICSALE_CONTRACT.tiersAccount(1),
          PUBLICSALE_CONTRACT.tiersAccount(2),
          PUBLICSALE_CONTRACT.tiersAccount(3),
          PUBLICSALE_CONTRACT.tiersAccount(4),
          PUBLICSALE_CONTRACT.tiers(1),
          PUBLICSALE_CONTRACT.tiers(2),
          PUBLICSALE_CONTRACT.tiers(3),
          PUBLICSALE_CONTRACT.tiers(4),
          PUBLICSALE_CONTRACT.tiersPercents(1),
          PUBLICSALE_CONTRACT.tiersPercents(2),
          PUBLICSALE_CONTRACT.tiersPercents(3),
          PUBLICSALE_CONTRACT.tiersPercents(4),
          PUBLICSALE_CONTRACT.tiersExAccount(1),
          PUBLICSALE_CONTRACT.tiersExAccount(2),
          PUBLICSALE_CONTRACT.tiersExAccount(3),
          PUBLICSALE_CONTRACT.tiersExAccount(4),
          PUBLICSALE_CONTRACT.snapshot(),
        ]);

        setDetailInfo({
          userTier: Number(res[0].toString()) as Tier,
          totalExpectSaleAmount: {
            1: convertNumber({
              amount: BigNumber.from(res[1]).mul(res[10]).div(10000).toString(),
              localeString: true,
            }) as string,
            2: convertNumber({
              amount: BigNumber.from(res[1]).mul(res[11]).div(10000).toString(),
              localeString: true,
            }) as string,
            3: convertNumber({
              amount: BigNumber.from(res[1]).mul(res[12]).div(10000).toString(),
              localeString: true,
            }) as string,
            4: convertNumber({
              amount: BigNumber.from(res[1]).mul(res[13]).div(10000).toString(),
              localeString: true,
            }) as string,
          },
          tierAccounts: {
            1: res[2],
            2: res[3],
            3: res[4],
            4: res[5],
          },
          tierOfMembers: {
            1: res[14],
            2: res[15],
            3: res[16],
            4: res[17],
          },
          tierCriteria: {
            1: convertNumber({amount: res[6], localeString: true}) as string,
            2: convertNumber({amount: res[7], localeString: true}) as string,
            3: convertNumber({amount: res[8], localeString: true}) as string,
            4: convertNumber({amount: res[9], localeString: true}) as string,
          },
          tierAllocation: {
            1: convertNumber({
              amount: BigNumber.from(res[1])
                .mul(res[10])
                .div(10000)
                .div(res[2].toString() === '0' ? 1 : res[2])
                .toString(),
              localeString: true,
            }) as string,
            2: convertNumber({
              amount: BigNumber.from(res[1])
                .mul(res[11])
                .div(10000)
                .div(res[3].toString() === '0' ? 1 : res[3])
                .toString(),
              localeString: true,
            }) as string,
            3: convertNumber({
              amount: BigNumber.from(res[1])
                .mul(res[12])
                .div(10000)
                .div(res[4].toString() === '0' ? 1 : res[4])
                .toString(),
              localeString: true,
            }) as string,
            4: convertNumber({
              amount: BigNumber.from(res[1])
                .mul(res[13])
                .div(10000)
                .div(res[5].toString() === '0' ? 1 : res[5])
                .toString(),
              localeString: true,
            }) as string,
          },
          snapshot: res[18],
        });
      }
    }
    if (account && library && PUBLICSALE_CONTRACT) {
      getInfo();
    }
  }, [account, library, PUBLICSALE_CONTRACT, saleInfo, blockNumber]);

  useEffect(() => {
    const {rawData} = starterData;
    if (rawData) {
      const projectInfo = rawData.filter(
        (data: AdminObject) => data.name === id,
      );
      return setSaleInfo(projectInfo[0]);
    }
  }, [starterData, id]);

  useEffect(() => {
    setInterval(() => {
      if (!saleInfo) {
        return;
      }
      const {endAddWhiteTime, endExclusiveTime, endDepositTime} = saleInfo;
      const nowTimeStamp = moment().unix();

      const checkStep =
        endAddWhiteTime > nowTimeStamp
          ? 'whitelist'
          : endExclusiveTime > nowTimeStamp
          ? 'exclusive'
          : endDepositTime > nowTimeStamp
          ? 'deposit'
          : 'claim';
      // setActiveStatus(checkStep);
      setActiveStatus('deposit');
    }, 1000);
    /*eslint-disable*/
  }, [saleInfo]);

  if (!saleInfo) {
    return (
      <Center mt={'100px'}>
        <LoadingComponent></LoadingComponent>
      </Center>
    );
  }

  return (
    <Flex mt={'122px'} w={'100%'} justifyContent="center" mb={'100px'}>
      <Flex w="1194px" flexDir="column" mb={'10px'}>
        <Flex
          {...STATER_STYLE.containerStyle({colorMode})}
          w={'100%'}
          h={'367px'}
          pl={'35px'}
          py={'30px'}
          _hover={''}
          cursor="">
          <Box d="flex" flexDir="column" w={'562px'} pr={35} pos="relative">
            <Flex justifyContent="space-between" mb={15}>
              <TokenImage imageLink={saleInfo?.tokenSymbolImage} />
            </Flex>
            <Text {...STATER_STYLE.mainText({colorMode, fontSize: 34})}>
              {saleInfo?.name}
            </Text>
            <Text
              {...STATER_STYLE.subText({colorMode})}
              letterSpacing={'1.4px'}
              mb={'14px'}>
              DESCRIPTION
            </Text>
            <Text
              {...STATER_STYLE.subText({colorMode, fontSize: 15})}
              mb={'11px'}>
              {saleInfo?.description}
            </Text>
            <Box pos="absolute" bottom={'11px'}>
              <DetailIcons
                linkInfo={[
                  {sort: 'website', url: `${saleInfo?.website}`},
                  {sort: 'twitter', url: `${saleInfo?.twitter}`},
                  {sort: 'discord', url: `${saleInfo?.discord}`},
                  {sort: 'telegram', url: `${saleInfo?.telegram}`},
                  {sort: 'medium', url: `${saleInfo?.medium}`},
                ]}></DetailIcons>
            </Box>
          </Box>
          <Box
            w={'1px'}
            bg={colorMode === 'light' ? '#f4f6f8' : '#323232'}
            boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}></Box>
          {activeStatus === 'whitelist' && (
            <WhiteList
              userTier={detailInfo?.userTier || 0}
              saleInfo={saleInfo}
              detailInfo={detailInfo}></WhiteList>
          )}
          {activeStatus === 'exclusive' && (
            <ExclusiveSalePart
              saleInfo={saleInfo}
              detailInfo={detailInfo}></ExclusiveSalePart>
          )}
          {activeStatus === 'deposit' && (
            <OpenSaleDeposit saleInfo={saleInfo}></OpenSaleDeposit>
          )}
          {/* {projectStatus === 'active' && activeStatus === 'openSale' && (
            <OpenSaleAfterDeposit
              saleInfo={saleInfo}
              activeProjectInfo={activeProjectInfo}></OpenSaleAfterDeposit>
          )} */}
          {activeStatus === 'claim' && <Claim saleInfo={saleInfo}></Claim>}
        </Flex>
        <Flex>
          {activeStatus && (
            <DetailTable
              saleInfo={saleInfo}
              status={activeStatus}
              detailInfo={detailInfo}></DetailTable>
          )}
        </Flex>
      </Flex>
      <ApproveModal></ApproveModal>
    </Flex>
  );
};
