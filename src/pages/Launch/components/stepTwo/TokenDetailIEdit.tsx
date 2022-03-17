import {Grid, GridItem, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects, VaultCommon} from '@Launch/types';
import {useFormikContext} from 'formik';

const TokenDetailEdit = () => {
  return null;
  // const theme = useTheme();
  // //@ts-ignore
  // const {OpenCampaginDesign} = theme;
  // const {colorMode} = useColorMode();
  // const {firstColData, secondColData, thirdColData} = props;
  // const {
  //   values: {vaults},
  // } = useFormikContext<Projects['CreateProject']>();
  // const publicVaultValue = vaults.filter((vault: VaultCommon) => {
  //   return vault.vaultName === 'Public';
  // });

  // return (
  //   <Grid
  //     {...OpenCampaginDesign.border({colorMode})}
  //     w={'100%'}
  //     templateColumns="repeat(3, 1fr)"
  //     fontSize={13}>
  //     <GridItem>
  //       <MainTitle
  //         leftTitle="Token"
  //         rightTitle={`${publicVaultValue[0].vaultTokenAllocation} TON`}></MainTitle>
  //       {firstColData.map(
  //         (
  //           data: {title: string; content: string; percent?: number},
  //           index: number,
  //         ) => {
  //           const {title, content, percent} = data;
  //           return (
  //             <SubTitle
  //               key={title}
  //               leftTitle={title}
  //               rightTitle={content}
  //               isLast={index + 1 === firstColData.length}
  //               percent={percent}></SubTitle>
  //           );
  //         },
  //       )}
  //     </GridItem>
  //     <GridItem borderX={'solid 1px #e6eaee'}>
  //       <MainTitle leftTitle="Schedule" rightTitle="KST"></MainTitle>
  //       {secondColData.map((data: {title: string; content: string}) => {
  //         const {title, content} = data;
  //         return (
  //           <SubTitle
  //             key={title}
  //             leftTitle={title}
  //             rightTitle={content}></SubTitle>
  //         );
  //       })}
  //     </GridItem>
  //     <GridItem>
  //       <MainTitle leftTitle="sTOS Tier" rightTitle=""></MainTitle>
  //       <Flex
  //         h={'60px'}
  //         alignItems="center"
  //         textAlign={'center'}
  //         borderBottom={'solid 1px #e6eaee'}
  //         fontWeight={600}
  //         color={'#7e8993'}
  //         fontSize={13}>
  //         <Text w={'80px'}>Tier</Text>
  //         <Text w={'125px'}>Required TOS</Text>
  //         <Text w={'137px'}>Allocated Token</Text>
  //       </Flex>
  //       {thirdColData.map((data: any, index: number) => {
  //         const {tier, requiredTos, allocatedToken} = data;
  //         return (
  //           <STOSTier
  //             key={tier}
  //             tier={tier}
  //             requiredTos={requiredTos}
  //             allocatedToken={allocatedToken}
  //             isLast={index + 1 === thirdColData.length}></STOSTier>
  //         );
  //       })}
  //     </GridItem>
  //   </Grid>
  // );
};

export default TokenDetailEdit;
