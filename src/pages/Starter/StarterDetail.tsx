import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Avatar,
  Text,
  Center,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {checkTokenType} from 'utils/token';
import {ExclusiveSale} from './components/details/ExclusiveSale';
import {WhiteList} from './components/details/WhiteList';
import {OpenSale} from './components/details/OpenSale';
import {OpenSaleAfterDeposit} from './components/details/OpenSaleAfterDeposit';

import {DetailIcons} from './components/details/Detail_Icons';
import {SaleStatus, Tier, DetailInfo} from './types';
import {DetailTable} from './components/details/Detail_Table';
import {OpenSaleDeposit} from './components/details/OpenSaleDeposit';
import {ExclusiveSalePart} from './components/details/ExclusiveSalePart';
import store from 'store';
import {AdminObject} from '@Admin/types';
import {convertTimeStamp} from 'utils/convertTIme';
import {Claim} from './components/details/Claim';
import {useUrl} from './hooks/useUrl';
import {useCallContract} from 'hooks/useCallContract';
import {useActiveWeb3React} from 'hooks/useWeb3';
import starterActions from './actions';
import {convertNumber} from 'utils/number';
import {BigNumber} from 'ethers';
import {useBlockNumber} from 'hooks/useBlock';
import {LoadingComponent} from 'components/Loading';
import moment from 'moment';

const nowTimeStamp = moment().unix();

export const StarterDetail = () => {
  // const {id}: {id: string} = useParams();
  const id = 'DOOROPEN';
  const {colorMode} = useColorMode();
  const theme = useTheme();
  // const {projectStatus} = useUrl();

  const starterData = store.getState().starters.data;

  const projectStatus =
    starterData?.activeProjects[0].timeStamps.endOpenSaleTime > nowTimeStamp
      ? 'active'
      : 'past';

  const [activeStatus, setActiveStatus] = useState<SaleStatus | undefined>(
    undefined,
  );
  const [saleInfo, setSaleInfo] = useState<AdminObject | undefined>(undefined);
  const [activeProjectInfo, setActiveProjectInfo] = useState<any | undefined>(
    undefined,
  );

  const [detailInfo, setDetailInfo] = useState<DetailInfo | undefined>(
    undefined,
  );

  const [isApprove, setIsApprove] = useState(false);

  const {STATER_STYLE} = theme;
  const tokenType = checkTokenType(
    '0x2be5e8c109e2197D077D13A82dAead6a9b3433C5',
  );

  const {account, library} = useActiveWeb3React();

  const PUBLICSALE_CONTRACT = useCallContract(
    starterData.activeData
      .filter((data: AdminObject) => data.name === id)
      .map((e: AdminObject) => e.saleContractAddress)[0],
    'PUBLIC_SALE',
  );

  const {blockNumber} = useBlockNumber();

  //check approve
  useEffect(() => {
    async function checkUserApprove() {
      if (account && library) {
        const isUserApprove = await starterActions.checkApprove(
          account,
          library,
          starterData.activeData
            .filter((data: AdminObject) => data.name === id)
            .map((e: AdminObject) => e.saleContractAddress)[0],
        );
        setIsApprove(isUserApprove);
      }
    }
    checkUserApprove();
  }, [account, library, id, starterData.activeData, blockNumber]);

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
          // PUBLICSALE_CONTRACT.tierExAccount(1),
          // PUBLICSALE_CONTRACT.tierExAccount(2),
          // PUBLICSALE_CONTRACT.tierExAccount(3),
          // PUBLICSALE_CONTRACT.tierExAccount(4),
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
            // 1: res[14],
            // 2: res[15],
            // 3: res[16],
            // 4: res[17],

            1: res[2],
            2: res[3],
            3: res[4],
            4: res[5],
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
        });
      }
    }
    if (account && library && PUBLICSALE_CONTRACT) {
      getInfo();
    }
  }, [account, library, PUBLICSALE_CONTRACT, saleInfo]);

  useEffect(() => {
    async function getStatus() {
      if (PUBLICSALE_CONTRACT) {
        const {activeProjects} = starterData;
        //@ts-ignore
        const {step} = activeProjects.filter(
          (data: any) => data.name === id,
        )[0];
        setActiveStatus(step);

        setActiveProjectInfo(
          activeProjects.filter((data: any) => data.name === id)[0],
        );
      }
    }
    if (PUBLICSALE_CONTRACT) {
      getStatus();
    }
  }, [PUBLICSALE_CONTRACT, id, starterData]);

  useEffect(() => {
    const {activeData, pastData} = starterData;

    if (projectStatus === 'active') {
      const projectInfo = activeData.filter(
        (data: AdminObject) => data.name === id,
      );
      return setSaleInfo(projectInfo[0]);
    }

    // if (projectStatus === 'upcoming') {
    //   const projectInfo = upcomingData.filter(
    //     (data: AdminObject) => data.name === id,
    //   );
    //   return setSaleInfo(projectInfo[0]);
    // }

    if (projectStatus === 'past') {
      const projectInfo = pastData.filter(
        (data: AdminObject) => data.name === id,
      );
      return setSaleInfo(projectInfo[0]);
    }
  }, [starterData, id, projectStatus]);

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
          px={35}
          py={'30px'}
          _hover={''}
          cursor="">
          <Box d="flex" flexDir="column" w={'562px'} pr={35} pos="relative">
            <Flex justifyContent="space-between" mb={15}>
              <Avatar
                src={tokenType.symbol}
                backgroundColor={tokenType.bg}
                bg="transparent"
                color="#c7d1d8"
                name="T"
                h="48px"
                w="48px"
              />
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
            <Box pos="absolute" bottom={'20px'}>
              <DetailIcons
                linkInfo={[
                  {sort: 'website', url: `${saleInfo?.website}`},
                  {sort: 'telegram', url: `${saleInfo?.telegram}`},
                  {sort: 'medium', url: `${saleInfo?.medium}`},
                  {sort: 'twitter', url: `${saleInfo?.twitter}`},
                  {sort: 'discord', url: `${saleInfo?.discord}`},
                ]}></DetailIcons>
            </Box>
          </Box>
          <Box
            w={'1px'}
            bg={colorMode === 'light' ? '#f4f6f8' : '#323232'}
            boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}></Box>
          {projectStatus === 'active' &&
            activeStatus === 'whitelist' &&
            detailInfo && (
              <WhiteList
                date={convertTimeStamp(saleInfo?.endAddWhiteTime, 'YYYY-MM-DD')}
                startDate={convertTimeStamp(saleInfo?.startAddWhiteTime)}
                endDate={convertTimeStamp(saleInfo?.endAddWhiteTime, 'MM.D')}
                userTier={detailInfo.userTier}
                activeProjectInfo={activeProjectInfo}></WhiteList>
            )}
          {projectStatus === 'active' &&
            activeStatus === 'exclusive' &&
            detailInfo && (
              <ExclusiveSalePart
                saleInfo={saleInfo}
                detailInfo={detailInfo}
                activeProjectInfo={activeProjectInfo}
                isApprove={isApprove}></ExclusiveSalePart>
            )}
          {projectStatus === 'active' && activeStatus === 'deposit' && (
            <OpenSaleDeposit
              saleInfo={saleInfo}
              activeProjectInfo={activeProjectInfo}
              isApprove={isApprove}></OpenSaleDeposit>
          )}
          {projectStatus === 'active' && activeStatus === 'openSale' && (
            <OpenSaleAfterDeposit
              saleInfo={saleInfo}
              activeProjectInfo={activeProjectInfo}></OpenSaleAfterDeposit>
          )}
          {projectStatus === 'past' && (
            <Claim
              saleInfo={saleInfo}
              activeProjectInfo={activeProjectInfo}></Claim>
          )}
        </Flex>
        <Flex>
          {activeStatus && detailInfo && (
            <DetailTable
              saleInfo={saleInfo}
              status={activeStatus}
              detailInfo={detailInfo}
              activeProjectInfo={activeProjectInfo}></DetailTable>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
