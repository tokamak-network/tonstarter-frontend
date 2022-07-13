import {useState, useEffect, FC, Dispatch, SetStateAction} from 'react';
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
import {ethers} from 'ethers';
type DAO = {
  daoAirdropTokens: any[];
  handleSelectAll: () => void;
  isCheck: any[];
  checkedAllBoxes: boolean;
  handleClick: Dispatch<SetStateAction<any>>;
  claimToken:  Dispatch<SetStateAction<any>>;
  setIsCheck: Dispatch<SetStateAction<any>>;
  setCheckedTokenAddresses: Dispatch<SetStateAction<any>>;
  setIsCheckAll: Dispatch<SetStateAction<any>>;
  setCheckedAllBoxes: Dispatch<SetStateAction<any>>;
};

export const MobileDAOTable: FC<DAO> = ({
  daoAirdropTokens,
  handleSelectAll,
  isCheck,
  checkedAllBoxes,
  handleClick,
  claimToken,
  setIsCheck,
  setCheckedTokenAddresses,
  setIsCheckAll,
  setCheckedAllBoxes
}) => {
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
  return daoAirdropTokens.length > 0 ? (
    <Grid w={'100%'} bg={themeDesign.bg[colorMode]}>
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
        {' '}
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
      {daoAirdropTokens.map((data: any, index: number) => {
        const {id, address, amount, tokenSymbol, tonStaker, tosStaker} = data;
        const formattedAmt = tonStaker
          ? Number(ethers.utils.formatEther(amount)).toFixed(2)
          : amount;
        return (
          <GridItem
            border={themeDesign.border[colorMode]}
            borderBottom={index === daoAirdropTokens?.length - 1 ? '' : 'none'}
            borderBottomRadius={
              index === daoAirdropTokens?.length - 1 ? '4px' : 'none'
            }
            bg={(index%2 ===0 )?colorMode==='light'? '#fafbfc':'#262626': colorMode==='light'? '#ffffff':'#222222'}
            className={'chart-cell'}
            d={'flex'}
            justifyContent={'center'}
            p={'0px'}
            h={'42px'}>
            <Flex w={'13.13%'} justifyContent={'center'}   h={'42px'}
          borderRight={themeDesign.border[colorMode]}>
              <Checkbox
                key={id}
                type="checkbox"
                name={tokenSymbol}
                id={id}
                onChange={handleClick}
                isChecked={isCheck.includes(String(index))}
                fontWeight={'bold'}
                fontSize={'14px'}
                iconSize="18px"
                left={'5%'}
                value={address}
              />
            </Flex>
            <Text
              fontSize={'12px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              w={'30%'}
              textAlign={'center'}>
              {tokenSymbol}
            </Text>
            <Text
              fontSize={'13px'}
              fontFamily={theme.fonts.roboto}
              color={colorMode === 'light' ? '#353c48' : '#fff'}
              w={'26.6%'}
              textAlign={'center'}>
              {Number(formattedAmt).toLocaleString()}
            </Text>
            <Flex w={'31.3%'} justifyContent={'center'}>
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
                onClick={() => {
                    account &&
                      claimToken({
                        account,
                        library,
                        address: address,
                        tonStaker: tonStaker,
                        tosStaker: tosStaker,
                      });
                    setIsCheck([]);
                    setCheckedTokenAddresses([]);
                    setIsCheckAll(false);
                    setCheckedAllBoxes(false);
                  }}>
                Claim
              </Button>
            </Flex>
          </GridItem>
        );
      })}
    </Grid>
  ) : (
    <Flex
      justifyContent={'center'}
      my={'10px'}
      width={'100%'}
      borderRadius={'10px'}
      p={'30px'}
      border={colorMode === 'light' ? 'solid 1px #fff' : 'solid 1px #373737'}
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
  );
};
