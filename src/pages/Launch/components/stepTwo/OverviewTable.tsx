import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import commafy from 'utils/commafy';

const overviewTableStyle = {
  border: {
    light: '1px solid #eff1f6',
    dark: '1px solid #373737',
  },
  fontColor: {
    light: '#3d495d',
    dark: '#ffffff',
  },
  cellBgColor: {
    light: {
      odd: '#ffffff',
      even: '#fafbfc',
    },
    dark: {
      odd: '#222',
      even: '#262626',
    },
  },
};

const OverviewTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<any>([]);
  const [totalColData, setTotalColData] = useState<any>([]);
  const [columnLength, setColumnLength] = useState<any>([]);

  useEffect(() => {
    const claimData = vaultsList.map((vault: any) => {
      if (vault.claim) {
        return {name: vault.vaultName, claim: vault.claim};
      }
    });
    let i = 0;
    claimData.map((data: any) => {
      return (i = data.claim.length > i ? data.claim.length : i);
    });
    setColumnLength(Array.from({length: i}, (v, i) => i));
    setTableData(claimData);
  }, [vaultsList]);

  useEffect(() => {
    const totals = tableData.map((data: any) => {
      const {claim} = data;
      const result = claim.map((claimData: any) => {
        return claimData.claimTokenAllocation;
      });
      return result;
    });
    const totalSum = [];
    // const indexOfLongestArray = totals.reduce(
    //   (idx: any, arr: any) => (arr.length > totals[idx].length ? idx + 1 : idx),
    //   0,
    // );

    const lengths = totals.map((a: any) => a.length);
    const indexOfLongestArray = lengths.indexOf(Math.max(...lengths));

    if (totals.length === 0) {
      return;
    }
    for (let i = 0; i < totals[indexOfLongestArray].length; i++) {
      let arr: any = [];
      totals.filter((data: any) => {
        const dd = data.filter((d: number, index: number) => {
          if (i === index) {
            return d;
          }
        });
        arr.push(...dd);
      });
      totalSum.push(arr);
    }
    setTotalColData(totalSum);
  }, [tableData]);

  let sumColumn = 0;
  return (
    <Box
      d="flex"
      textAlign="center"
      border={overviewTableStyle.border[colorMode]}
      lineHeight={'42px'}>
      <Flex
        fontSize={12}
        color={overviewTableStyle.fontColor[colorMode]}
        flexDir={'column'}
        fontWeight={600}
        // borderBottom={overviewTableStyle.border[colorMode]}
        w={'90px'}>
        <Text
          fontSize={12}
          borderRight={overviewTableStyle.border[colorMode]}
          w={'90px'}>
          Round
        </Text>
        {columnLength.map((data: any, index: number) => {
          return (
            <Text
              borderTop={overviewTableStyle.border[colorMode]}
              borderRight={overviewTableStyle.border[colorMode]}
              fontSize={13}
              h={'42px'}
              bg={
                index === 0 || index % 2 === 0
                  ? overviewTableStyle.cellBgColor[colorMode].even
                  : overviewTableStyle.cellBgColor[colorMode].odd
              }>
              {index > 9 ? index + 1 : `0${index + 1}`}
            </Text>
          );
        })}
        <Text
          fontSize={13}
          marginTop={'auto'}
          color={colorMode === 'light' ? '#353c48' : 'white.100'}
          fontWeight={600}
          h={'50px'}
          borderTop={overviewTableStyle.border[colorMode]}
          borderRight={overviewTableStyle.border[colorMode]}
          bg={
            totalColData.length % 2 === 0
              ? overviewTableStyle.cellBgColor[colorMode].even
              : overviewTableStyle.cellBgColor[colorMode].odd
          }>
          Sum
        </Text>
      </Flex>
      <Flex
        w={'2040px'}
        overflowX={'auto'}
        css={{
          '&::-webkit-scrollbar': {
            paddingTop: '5px',
            height: '6px',
          },
          '::-webkit-scrollbar-track': {
            background: 'transparent',
            borderRadius: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            background: '#257eee',
            borderRadius: '4px',
          },
          // '::-webkit-scrollbar-track-piece': {
          //   background: 'transparent',
          //   width: '30px',
          // },
        }}>
        {tableData.map((data: any, index: number) => {
          const {name, claim} = data;
          return (
            <Flex
              fontSize={12}
              color={overviewTableStyle.fontColor[colorMode]}
              flexDir={'column'}
              fontWeight={600}
              minW={name.length > 10 ? '140px' : '120px'}>
              <Text
                fontSize={12}
                borderBottom={overviewTableStyle.border[colorMode]}
                borderRight={overviewTableStyle.border[colorMode]}>
                {name === 'Liquidity Incentive'
                  ? `${values.tokenName}-TOS LP Reward`
                  : name}
              </Text>
              {claim.map((claimData: any, index: number) => {
                return (
                  <Text
                    borderBottom={overviewTableStyle.border[colorMode]}
                    borderRight={overviewTableStyle.border[colorMode]}
                    fontSize={13}
                    h={'42px'}
                    bg={
                      index === 0 || index % 2 === 0
                        ? overviewTableStyle.cellBgColor[colorMode].even
                        : overviewTableStyle.cellBgColor[colorMode].odd
                    }>
                    {commafy(claimData.claimTokenAllocation) || '-'}
                  </Text>
                );
              })}
              {columnLength.map((data: any, index: number) => {
                if (claim[index] === undefined) {
                  return (
                    <Text
                      borderBottom={overviewTableStyle.border[colorMode]}
                      borderRight={overviewTableStyle.border[colorMode]}
                      fontSize={13}
                      h={'42px'}
                      bg={
                        index === 0 || index % 2 === 0
                          ? overviewTableStyle.cellBgColor[colorMode].even
                          : overviewTableStyle.cellBgColor[colorMode].odd
                      }>
                      {'-'}
                    </Text>
                  );
                }
              })}
              <Text
                fontSize={13}
                marginTop={overviewTableStyle.border[colorMode]}
                borderRight={overviewTableStyle.border[colorMode]}
                bg={
                  totalColData.length % 2 === 0
                    ? overviewTableStyle.cellBgColor[colorMode].even
                    : overviewTableStyle.cellBgColor[colorMode].odd
                }>
                {commafy(
                  claim.reduce((acc: any, cur: any, index: number) => {
                    if (cur?.claimTokenAllocation) {
                      return acc + cur.claimTokenAllocation || 0;
                    }
                    return '-';
                  }, 0),
                )}
              </Text>
            </Flex>
          );
        })}
        <Flex
          fontSize={12}
          color={overviewTableStyle.fontColor[colorMode]}
          flexDir={'column'}
          fontWeight={600}
          minW={'120px'}
          borderRight={overviewTableStyle.border[colorMode]}>
          <Text fontSize={12}>Total</Text>
          {totalColData.map((roundTotal: number[], index: number) => {
            const sumWithInitial = roundTotal.reduce(
              (previousValue, currentValue) => previousValue + currentValue,
              0,
            );

            sumColumn += sumWithInitial;
            if (index + 1 === totalColData.length) {
              if (sumWithInitial !== 0) {
                return (
                  <>
                    <Text
                      borderTop={overviewTableStyle.border[colorMode]}
                      // borderRight={overviewTableStyle.border[colorMode]}
                      h={'42px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0
                          ? overviewTableStyle.cellBgColor[colorMode].even
                          : overviewTableStyle.cellBgColor[colorMode].odd
                      }>
                      {commafy(sumWithInitial)}
                    </Text>
                    <Text
                      borderTop={overviewTableStyle.border[colorMode]}
                      // borderRight={overviewTableStyle.border[colorMode]}
                      h={'42px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0
                          ? overviewTableStyle.cellBgColor[colorMode].even
                          : overviewTableStyle.cellBgColor[colorMode].odd
                      }>
                      {commafy(sumColumn)}
                    </Text>
                  </>
                );
              } else {
                return (
                  <>
                    <Text
                      borderTop={overviewTableStyle.border[colorMode]}
                      // borderRight={overviewTableStyle.border[colorMode]}
                      borderBottom={overviewTableStyle.border[colorMode]}
                      h={'43px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0
                          ? overviewTableStyle.cellBgColor[colorMode].even
                          : overviewTableStyle.cellBgColor[colorMode].odd
                      }>
                      -
                    </Text>
                    <Text
                      h={'43px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0
                          ? overviewTableStyle.cellBgColor[colorMode].even
                          : overviewTableStyle.cellBgColor[colorMode].odd
                      }>
                      -
                    </Text>
                  </>
                );
              }
            }

            if (sumWithInitial !== 0) {
              return (
                <Text
                  borderTop={overviewTableStyle.border[colorMode]}
                  // borderRight={overviewTableStyle.border[colorMode]}
                  h={'42px'}
                  fontSize={13}
                  bg={
                    index === 0 || index % 2 === 0
                      ? overviewTableStyle.cellBgColor[colorMode].even
                      : overviewTableStyle.cellBgColor[colorMode].odd
                  }>
                  {commafy(sumWithInitial)}
                </Text>
              );
            } else {
              return (
                <Text
                  borderTop={overviewTableStyle.border[colorMode]}
                  // borderRight={overviewTableStyle.border[colorMode]}
                  h={'42px'}
                  fontSize={13}
                  bg={
                    index === 0 || index % 2 === 0
                      ? overviewTableStyle.cellBgColor[colorMode].even
                      : overviewTableStyle.cellBgColor[colorMode].odd
                  }>
                  -
                </Text>
              );
            }
          })}
        </Flex>
        <Flex
          fontSize={12}
          color={overviewTableStyle.fontColor[colorMode]}
          flexDir={'column'}
          fontWeight={600}
          minW={'120px'}
          // borderBottom={overviewTableStyle.border[colorMode]}
        >
          <Text fontSize={12}>Accumulated</Text>
          {totalColData.map((roundTotal: number[], index: number) => {
            let sumNum = 0;

            const totalAcc = totalColData
              .map((roundTotal: number[], i: number) =>
                i <= index ? roundTotal : [],
              )
              .map((data: number[]) => {
                return data.reduce(
                  (previousValue, currentValue) => previousValue + currentValue,
                  0,
                );
              });

            if (index + 1 === totalColData.length) {
              return (
                <>
                  <Text
                    borderTop={overviewTableStyle.border[colorMode]}
                    // borderRight={overviewTableStyle.border[colorMode]}
                    h={'42px'}
                    fontSize={13}
                    bg={
                      index === 0 || index % 2 === 0
                        ? overviewTableStyle.cellBgColor[colorMode].even
                        : overviewTableStyle.cellBgColor[colorMode].odd
                    }>
                    {totalAcc.map((data: number, i: number) => {
                      if (i <= index) {
                        sumNum += data;
                      }
                    })}
                    {sumNum !== 0 ? commafy(sumNum) : '-'}
                  </Text>
                  <Text
                    borderTop={overviewTableStyle.border[colorMode]}
                    // borderRight={overviewTableStyle.border[colorMode]}
                    h={'42px'}
                    fontSize={13}
                    bg={
                      index + 1 === 0 || (index + 1) % 2 === 0
                        ? overviewTableStyle.cellBgColor[colorMode].even
                        : overviewTableStyle.cellBgColor[colorMode].odd
                    }>
                    {sumNum !== 0 ? commafy(sumNum) : '-'}
                  </Text>
                </>
              );
            }

            return (
              <Text
                borderTop={overviewTableStyle.border[colorMode]}
                // borderRight={overviewTableStyle.border[colorMode]}
                h={'42px'}
                fontSize={13}
                bg={
                  index === 0 || index % 2 === 0
                    ? overviewTableStyle.cellBgColor[colorMode].even
                    : overviewTableStyle.cellBgColor[colorMode].odd
                }>
                {totalAcc.map((data: number, i: number) => {
                  if (i <= index) {
                    sumNum += data;
                  }
                })}
                {sumNum !== 0 ? commafy(sumNum) : '-'}
              </Text>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
};

export default OverviewTable;
