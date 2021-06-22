import {FC} from 'react';
import {
  Flex,
  Text,
  Button,
  Image,
  Container,
  useTheme,
  Avatar,
  Tooltip,
} from '@chakra-ui/react';
import {Link} from 'react-router-dom';
import {useColorMode} from '@chakra-ui/react';
import tooltipIcon from 'assets/svgs/input_question_icon.svg';
import {Stake} from 'pages/Staking/staking.reducer';

type TokenComponentProps = {
  data: Stake;
};

export const TokenComponent: FC<TokenComponentProps> = ({data}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  return (
    <Container
      bg={colorMode === 'light' ? theme.colors.white[100] : 'transparent'}
      boxShadow="base"
      rounded={15}
      borderWidth={colorMode === 'light' ? 0 : 1}
      borderColor={theme.colors.gray[75]}
      p="4">
      <Flex direction={'row'} pos="relative">
        <Avatar src="" />
        <Flex direction={'column'} px={6}>
          <Text
            fontWeight={'bold'}
            fontSize={26}
            fontFamily={theme.fonts.fld}
            lineHeight={1}
            color={
              colorMode === 'light'
                ? theme.colors.gray[275]
                : theme.colors.white[100]
            }>
            {data.name}
          </Text>
          <Flex mb={2}>
            <Text className={'fld-text1'} mr={1}>
              Period
            </Text>
            <Text className={'fld-text2'} mr={1}>
              {data.period}
            </Text>
            <Text
              fontWeight={'semibold'}
              fontSize={16}
              fontFamily={theme.fonts.fld}
              mx={1}
              color={theme.colors.gray[10]}>
              /
            </Text>
            <Text className={'fld-text1'} mr={1}>
              APY
            </Text>
            <Text className={'fld-text2'} mr={1}>
              50%
            </Text>
          </Flex>
          <Flex>
            <Text className={'fld-text1'} mr={1}>
              Earning Per Block
            </Text>
            <Text className={'fld-text2'} mr={1}>
              {data.totalRewardAmount} FLD
            </Text>
          </Flex>
          <Flex mt={3} alignItems={'center'}>
            <Text
              fontWeight={'semibold'}
              fontSize={32}
              fontFamily={theme.fonts.fld}
              mr={2}
              color={
                colorMode === 'light'
                  ? theme.colors.gray[125]
                  : theme.colors.white[100]
              }
              lineHeight={1}>
              {data.tokamakStaked}
            </Text>
            <Text
              fontWeight={'semibold'}
              fontSize={20}
              fontFamily={theme.fonts.fld}
              color={
                colorMode === 'light'
                  ? theme.colors.gray[125]
                  : theme.colors.white[100]
              }
              mr={2}>
              TON
            </Text>
            <Tooltip
              hasArrow
              placement="right"
              label="Total Staked"
              color={theme.colors.white[100]}
              bg={theme.colors.gray[375]}>
              <Image src={tooltipIcon} />
            </Tooltip>
          </Flex>
          <Text className={'fld-text1'} fontWeight={'normal'}>
            1644.99 USD
          </Text>
          <Flex mt={4} mb={2}>
            <Button
              as={Link}
              to={`/staking?contract=${data.contractAddress}&action=stake`}
              h={8}
              fontSize={16}
              fontWeight={700}
              rounded={18}
              bg={theme.colors.yellow[200]}
              px={34}
              fontFamily={theme.fonts.fld}
              mr={2}
              color={'black'}
              _hover={{bg: theme.colors.yellow[300]}}>
              Staking
            </Button>

            <Button
              as={Link}
              to={`/staking?contract=${data.contractAddress}&action=info`}
              borderWidth={1}
              borderColor={
                colorMode === 'light' ? 'transparent' : theme.colors.gray[75]
              }
              h={8}
              fontSize={16}
              fontWeight={700}
              color={
                colorMode === 'light' ? theme.colors.gray[125] : '!currentcolor'
              }
              rounded={18}
              bg={
                colorMode === 'light' ? theme.colors.gray[200] : '!currentcolor'
              }
              px={34}
              fontFamily={theme.fonts.fld}
              _hover={{
                bg:
                  colorMode === 'light'
                    ? theme.colors.gray[325]
                    : 'transparent',
                borderColor:
                  colorMode === 'light'
                    ? 'transparent'
                    : theme.colors.gray[350],
                color:
                  colorMode === 'light'
                    ? theme.colors.gray[125]
                    : theme.colors.gray[0],
              }}>
              {' '}
              Details{' '}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};
