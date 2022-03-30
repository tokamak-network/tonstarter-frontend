import {Flex, Grid, GridItem, Text, useColorMode} from '@chakra-ui/react';
import {useTheme} from '@emotion/react';
import useTokenDetail from '@Launch/hooks/useTokenDetail';
import {selectLaunch} from '@Launch/launch.reducer';
import {Projects, VaultCommon} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import {useEffect, useMemo, useRef, useState} from 'react';
import {MainTitle} from '../TokenDetail';

const TokenDetail_LP = (props: {isEdit: boolean}) => {
  const theme = useTheme();
  //@ts-ignore
  const {OpenCampaginDesign} = theme;
  const {colorMode} = useColorMode();
  const {
    values: {vaults},
  } = useFormikContext<Projects['CreateProject']>();
  const publicVaultValue = vaults.filter((vault: VaultCommon) => {
    return vault.vaultName === 'Public';
  });

  return null;

  //   return (
  //     <Grid
  //       {...OpenCampaginDesign.border({colorMode})}
  //       w={'100%'}
  //       templateColumns="repeat(3, 1fr)"
  //       fontSize={13}>
  //       <GridItem>
  //         <MainTitle
  //           leftTitle="Token"
  //           rightTitle={`${publicVaultValue[0].vaultTokenAllocation} TON`}></MainTitle>
  //         {firstColData.map(
  //           (
  //             data: {
  //               title: string;
  //               content: string | undefined;
  //               percent?: number | undefined;
  //               formikName: string;
  //             },
  //             index: number,
  //           ) => {
  //             const {title, content, percent, formikName} = data;
  //             return (
  //               <SubTitle
  //                 key={title}
  //                 leftTitle={title}
  //                 rightTitle={content}
  //                 isLast={index + 1 === firstColData.length}
  //                 percent={percent}
  //                 isEdit={isEdit}
  //                 formikName={formikName}></SubTitle>
  //             );
  //           },
  //         )}
  //       </GridItem>
  //       <GridItem borderX={'solid 1px #e6eaee'}>
  //         <MainTitle leftTitle="Schedule" rightTitle="KST"></MainTitle>
  //         {secondColData.map(
  //           (data: {title: string; content: string; formikName: string}) => {
  //             const {title, content, formikName} = data;
  //             return (
  //               <SubTitle
  //                 key={title}
  //                 leftTitle={title}
  //                 rightTitle={content}
  //                 isEdit={isEdit}
  //                 isSecondColData={true}
  //                 formikName={formikName}></SubTitle>
  //             );
  //           },
  //         )}
  //       </GridItem>
  //       <GridItem>
  //         <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
  //         <Flex
  //           h={'60px'}
  //           alignItems="center"
  //           textAlign={'center'}
  //           borderBottom={'solid 1px #e6eaee'}
  //           fontWeight={600}
  //           color={'#7e8993'}
  //           fontSize={13}>
  //           <Text w={'80px'}>Tier</Text>
  //           <Text w={'125px'}>Required TOS</Text>
  //           <Text w={'137px'}>Allocated Token</Text>
  //         </Flex>
  //         {thirdColData.map((data: any, index: number) => {
  //           const {tier, requiredTos, allocatedToken} = data;
  //           return (
  //             <STOSTier
  //               key={tier}
  //               tier={tier}
  //               requiredTos={requiredTos}
  //               allocatedToken={allocatedToken}
  //               isLast={index + 1 === thirdColData.length}
  //               isEdit={isEdit}></STOSTier>
  //           );
  //         })}
  //       </GridItem>
  //     </Grid>
  //   );
};

export default TokenDetail_LP;
