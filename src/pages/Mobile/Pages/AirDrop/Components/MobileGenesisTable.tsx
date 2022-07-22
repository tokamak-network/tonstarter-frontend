import {useState, useEffect,FC, Dispatch, SetStateAction} from 'react';
import {
  Text,
  Flex,
  useColorMode,
  useTheme,
  Checkbox,
  Grid,
  GridItem,
  Button,
  Radio,
  Stack,
  Box,
  RadioGroup,
} from '@chakra-ui/react';
import {useActiveWeb3React} from 'hooks/useWeb3';

type Genesis = {
    genesisAirdropBalance: string| undefined;
    handleSelectAll:  () => void;
    checkedAllBoxes:  boolean;
    handleClick: Dispatch<SetStateAction<any>>;
    claimAirdrop: Dispatch<SetStateAction<any>>;
    isCheck: any[]
}

export const MobileGenesisTable: FC<Genesis> = ({genesisAirdropBalance, handleSelectAll, checkedAllBoxes, handleClick, claimAirdrop, isCheck }) => {
    const {account, library} = useActiveWeb3React();
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const themeDesign = {
        fontColorTitle: {
          light: 'gray.250',
          dark: 'white.100',
        },
        bg: {
          light: '#fff',
          dark: '#222',
        },
        border: {
          light: 'solid 1px #e6eaee',
          dark: 'solid 1px #373737',
        },
        font: {
          light: '#304156',
          dark: '#fff',
        },
        tosFont: {
          light: '#2a72e5',
          dark: '#2a72e5',
        },
        borderTos: {
          light: 'solid 1px #2a72e5',
          dark: 'solid 1px #2a72e5',
        },
        buttonColorActive: {
          light: 'gray.225',
          dark: 'gray.0',
        },
        buttonColorInactive: {
          light: '#c9d1d8',
          dark: '#777777',
        },
      };
    
    return  Number(genesisAirdropBalance) > 0 ? ( 
         <Grid 
        w={'100%'}
        bg={themeDesign.bg[colorMode]}>
        <GridItem
          border={themeDesign.border[colorMode]}
          className={'chart-cell'}
          borderTopLeftRadius={'6px'}
          borderTopRightRadius={'6px'}
          borderBottom={'none'}
          p={'0px'}

          h={'42px'}
          fontSize={'16px'}
          fontFamily={theme.fonts.roboto}>
          <Flex w={'13.13%'} justifyContent={'center'}   h={'42px'}
          borderRight={themeDesign.border[colorMode]}>
            <Checkbox
              // fontWeight={'bold'}
              // fontSize={'14px'}
              // h={'45px'}
              iconSize="18px"
              left={'5%'}
              onChange={handleSelectAll}
              isChecked={checkedAllBoxes}
            />
          </Flex>

          <Text w={'30%'} textAlign={'center'} fontSize={'11px'}  display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'42px'}
          borderRight={themeDesign.border[colorMode]}>
            Token Symbol
          </Text>
          <Text w={'26.6%'} textAlign={'center'} fontSize={'11px'}  display={'flex'}
          alignItems={'center'}
          justifyContent={'center'}
          h={'42px'}
          borderRight={themeDesign.border[colorMode]}>
            Amount
          </Text>
          <Text
            fontSize={'11px'}
            fontWeight={'bolder'}
            color={colorMode === 'light' ? '#353c48' : 'white.0'}
            w={'31.3%'}
            textAlign={'center'}  display={'flex'}
            alignItems={'center'}
            justifyContent={'center'}
            h={'42px'}
            borderRight={themeDesign.border[colorMode]}>
            Action
          </Text>
        </GridItem>
        <GridItem
         bg={colorMode==='light'? '#ffffff':'#222222'}
            border={themeDesign.border[colorMode]}
            className={'chart-cell'}
            d={'flex'}
            borderBottomLeftRadius={'6px'}
            borderBottomRightRadius={'6px'}
            p={'0px'}
            h={'42px'}
            justifyContent={'center'}>
            <Flex w={'13.13%'} justifyContent={'center'}>
              <Checkbox
                key={'Genesis'}
                type="checkbox"
                name={'Genesis Airdrop'}
                id={'Genesis'}
                onChange={handleClick}
                isChecked={isCheck.includes('Genesis')}
                fontWeight={'bold'}
                fontSize={'14px'}
                iconSize="18px"
                left={'5%'}
                value={'Genesis'}
              />
            </Flex>
            <Text
              fontSize={'12px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              w={'30%'}
              textAlign={'center'}>
              TOS
            </Text>
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              w={'26.6%'}
              textAlign={'center'}>
              {Number(genesisAirdropBalance).toLocaleString()}
            </Text>
            <Flex  w={'31.3%'} justifyContent={'center'}>
              <Button
                w={'80px'}
                h={'26px'}
                border={'solid 1px #2a72e5'}
                borderRadius={'3px'}
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                letterSpacing={'.33px'}
                bg={'#2a72e5'}
                color={'#fff'}
                _hover={{}}
                cursor={'pointer'}
                _active={{}}
                onClick={() =>
                  claimAirdrop({
                    userAddress: account,
                    library: library,
                  })
                }>
                Claim
              </Button>
            </Flex>
          </GridItem>
        </Grid>
      
    ):  <Flex
    justifyContent={'center'}
    my={'10px'}
    width={'100%'}
    borderRadius={'10px'}
    p={'30px'}
    border={
      colorMode === 'light' ? 'solid 1px #fff' : 'solid 1px #373737'
    }
    style={{backdropFilter: 'blur(8px)'}}
    boxShadow={'0 1px 1px 0 rgba(96, 97, 112, 0.16)'}
    backgroundColor={colorMode === 'light' ? '#fff' : '#222'}>
    <Text
      fontFamily={theme.fonts.fld}
      color={colorMode === 'light' ? '#7e8993' : '#9d9ea5'}
      fontWeight={'bold'}
      fontSize={'15px'}>
      There aren't any distributed tokens
    </Text>
  </Flex>

}