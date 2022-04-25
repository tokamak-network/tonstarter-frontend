import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import commafy from 'utils/commafy';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const OverviewTable = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
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
      border={middleStyle.border}
      lineHeight={'42px'}>
      <Flex
        fontSize={12}
        color={'#3d495d'}
        flexDir={'column'}
        fontWeight={600}
        // borderBottom={middleStyle.border}
        w={'90px'}>
        <Text fontSize={12} borderRight={middleStyle.border} w={'90px'}>
          Round
        </Text>
        {columnLength.map((data: any, index: number) => {
          return (
            <Text
              borderTop={middleStyle.border}
              borderRight={middleStyle.border}
              fontSize={13}
              h={'42px'}
              bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
              {index > 9 ? index + 1 : `0${index + 1}`}
            </Text>
          );
        })}
        <Text
          fontSize={13}
          marginTop={'auto'}
          color={'#353c48'}
          fontWeight={600}
          h={'50px'}
          borderTop={middleStyle.border}
          borderRight={middleStyle.border}
          bg={totalColData.length % 2 === 0 ? '#fafbfc' : '#ffffff'}>
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
              color={'#3d495d'}
              flexDir={'column'}
              fontWeight={600}
              minW={name.length > 10 ? '140px' : '120px'}>
              <Text
                fontSize={12}
                borderBottom={middleStyle.border}
                borderRight={middleStyle.border}>
                {name}
              </Text>
              {claim.map((claimData: any, index: number) => {
                return (
                  <Text
                    borderBottom={middleStyle.border}
                    borderRight={middleStyle.border}
                    fontSize={13}
                    h={'42px'}
                    bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                    {commafy(claimData.claimTokenAllocation) || '-'}
                  </Text>
                );
              })}
              {columnLength.map((data: any, index: number) => {
                if (claim[index] === undefined) {
                  return (
                    <Text
                      borderBottom={middleStyle.border}
                      borderRight={middleStyle.border}
                      fontSize={13}
                      h={'42px'}
                      bg={
                        index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'
                      }>
                      {'-'}
                    </Text>
                  );
                }
              })}
              <Text
                fontSize={13}
                marginTop={middleStyle.border}
                borderRight={middleStyle.border}
                bg={totalColData.length % 2 === 0 ? '#fafbfc' : '#ffffff'}>
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
          color={'#3d495d'}
          flexDir={'column'}
          fontWeight={600}
          minW={'120px'}
          borderRight={middleStyle.border}>
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
                      borderTop={middleStyle.border}
                      // borderRight={middleStyle.border}
                      h={'42px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'
                      }>
                      {commafy(sumWithInitial)}
                    </Text>
                    <Text
                      borderTop={middleStyle.border}
                      // borderRight={middleStyle.border}
                      h={'42px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0 ? '#ffffff' : '#fafbfc'
                      }>
                      {commafy(sumColumn)}
                    </Text>
                  </>
                );
              } else {
                return (
                  <>
                    <Text
                      borderTop={middleStyle.border}
                      // borderRight={middleStyle.border}
                      borderBottom={middleStyle.border}
                      h={'43px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'
                      }>
                      -
                    </Text>
                    <Text
                      // borderTop={middleStyle.border}
                      // borderRight={middleStyle.border}
                      // borderBottom={middleStyle.border}

                      h={'43px'}
                      fontSize={13}
                      bg={
                        index === 0 || index % 2 === 0 ? '#ffffff' : '#fafbfc'
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
                  borderTop={middleStyle.border}
                  // borderRight={middleStyle.border}
                  h={'42px'}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  {commafy(sumWithInitial)}
                </Text>
              );
            } else {
              return (
                <Text
                  borderTop={middleStyle.border}
                  // borderRight={middleStyle.border}
                  h={'42px'}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  -
                </Text>
              );
            }
          })}
        </Flex>
        <Flex
          fontSize={12}
          color={'#3d495d'}
          flexDir={'column'}
          fontWeight={600}
          minW={'120px'}
          // borderBottom={middleStyle.border}
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
                    borderTop={middleStyle.border}
                    // borderRight={middleStyle.border}
                    h={'42px'}
                    fontSize={13}
                    bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                    {totalAcc.map((data: number, i: number) => {
                      if (i <= index) {
                        sumNum += data;
                      }
                    })}
                    {sumNum !== 0 ? commafy(sumNum) : '-'}
                  </Text>
                  <Text
                    borderTop={middleStyle.border}
                    // borderRight={middleStyle.border}
                    h={'42px'}
                    fontSize={13}
                    bg={
                      index + 1 === 0 || (index + 1) % 2 === 0
                        ? '#fafbfc'
                        : '#ffffff'
                    }>
                    {sumNum !== 0 ? commafy(sumNum) : '-'}
                  </Text>
                </>
              );
            }

            return (
              <Text
                borderTop={middleStyle.border}
                // borderRight={middleStyle.border}
                h={'42px'}
                fontSize={13}
                bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
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
