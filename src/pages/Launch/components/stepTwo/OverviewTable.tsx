import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';

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
      const indexOfLongestArray = totals.reduce(
        (idx: any, arr: any) => (arr.length > totals[idx].length ? idx + 1 : idx),
        0,
      );
  
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
            borderBottom={middleStyle.border}
            w={'90px'}>
            <Text fontSize={12}>Round</Text>
            {columnLength.map((data: any, index: number) => {
              return (
                <Text
                  borderX={middleStyle.border}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  {index > 9 ? index + 1 : `0${index + 1}`}
                </Text>
              );
            })}
            <Text
              fontSize={13}
              marginTop={'auto'}
              color={'#353c48'}
              fontWeight={600}>
              Sum
            </Text>
          </Flex>
          <Flex maxW={'1040'} overflowX={'scroll'}>
          {tableData.map((data: any, index: number) => {
            const {name, claim} = data;
            return (
              <Flex
                fontSize={12}
                color={'#3d495d'}
                flexDir={'column'}
                fontWeight={600}
                minW={name.length > 10 ? '140px' : '120px'}
                borderBottom={middleStyle.border}>
                <Text fontSize={12}>{name}</Text>
                {claim.map((claimData: any, index: number) => {
                  return (
                    <Text
                      borderX={middleStyle.border}
                      fontSize={13}
                      bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                      {claimData.claimTokenAllocation || '-'}
                    </Text>
                  );
                })}
                {columnLength.map((data: any, index: number) => {
                  if (claim[index] === undefined) {
                    return (
                      <Text
                        borderX={middleStyle.border}
                        fontSize={13}
                        bg={
                          index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'
                        }>
                        {'-'}
                      </Text>
                    );
                  }
                })}
                <Text fontSize={13} marginTop={'auto'}>
                  {name}
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
            borderBottom={middleStyle.border}>
            <Text fontSize={12}>Total</Text>
            {totalColData.map((roundTotal: number[], index: number) => {
              const sumWithInitial = roundTotal.reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0,
              );
              if (sumWithInitial !== 0) {
                return (
                  <Text
                    borderX={middleStyle.border}
                    fontSize={13}
                    bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                    {sumWithInitial}
                  </Text>
                );
              } else {
                return (
                  <Text
                    borderX={middleStyle.border}
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
            borderBottom={middleStyle.border}>
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
              return (
                <Text
                  borderX={middleStyle.border}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  {totalAcc.map((data: number, i: number) => {
                    if (i <= index) {
                      sumNum += data;
                    }
                  })}
                  {sumNum !== 0 ? sumNum : '-'}
                </Text>
              );
            })}
          </Flex>
          <Flex
            fontSize={12}
            color={'#3d495d'}
            flexDir={'column'}
            fontWeight={600}
            minW={'120px'}
            borderBottom={middleStyle.border}>
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
              return (
                <Text
                  borderX={middleStyle.border}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  {totalAcc.map((data: number, i: number) => {
                    if (i <= index) {
                      sumNum += data;
                    }
                  })}
                  {sumNum !== 0 ? sumNum : '-'}
                </Text>
              );
            })}
          </Flex>
          <Flex
            fontSize={12}
            color={'#3d495d'}
            flexDir={'column'}
            fontWeight={600}
            minW={'120px'}
            borderBottom={middleStyle.border}>
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
              return (
                <Text
                  borderX={middleStyle.border}
                  fontSize={13}
                  bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                  {totalAcc.map((data: number, i: number) => {
                    if (i <= index) {
                      sumNum += data;
                    }
                  })}
                  {sumNum !== 0 ? sumNum : '-'}
                </Text>
              );
            })}
          </Flex>
          
          </Flex>
        </Box>
    );
  }

  export default OverviewTable;