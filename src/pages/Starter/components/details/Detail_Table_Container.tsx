import {Box, useColorMode, useTheme, Flex, Text, Image} from '@chakra-ui/react';
import {addToken} from '@Starter/actions/actions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import MetamaskImg from 'assets/images/starter/metamask_icon@3x.png';

type DetailTableContainerProp = {
  title: string;
  data: {key: string; value: string; image?: string}[];
  breakPoint: number;
  w?: number;
  itemPx?: string;
  itemPy?: string;
  isUserTier?: boolean;
  status: string;
};

const fontSize = 15;

export const DetailTableContainer = (prop: DetailTableContainerProp) => {
  const {title, data, breakPoint, w, itemPx, itemPy, isUserTier,status} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {STATER_STYLE} = theme;
  const {account, library} = useActiveWeb3React();

  return (
    <Flex flexDir="column">
      {/* {isUserTier ? (
        <Text textAlign="center" mb="10px" h="24px">
          Your tirer
        </Text>
      ) : (
        <Text mb="10px" h="24px">
          {''}
        </Text>
      )} */}
      <Box
        {...STATER_STYLE.containerStyle({colorMode, isUserTier})}
        w={w || 582}
        h={'100%'}
        _hover=""
        cursor=""
        fontSize={15}
        p={0}>
        <Flex
          flexDir="column"
          {...STATER_STYLE.subText({colorMode, fontSize})}
          {...STATER_STYLE.table.container({colorMode})}
          px={itemPx || '35px'}
          py={itemPy || '21px'}
          bg={isUserTier && 'blue.100'}
          color={isUserTier && 'white.100'}
          borderTopRadius={13}
          h="65.5px"
          textAlign="center"
          justifyContent='center'>
         
          <Text  h={'22.5px'}>{title}</Text>
          {isUserTier  && <Text color='#ffff07' textAlign={'center'} h='22.5px'>Your tier</Text>}
        </Flex>

        {data.map((item, index) => {
          return (
            <Flex
              {...STATER_STYLE.table.container({
                colorMode,
                isLast: index >= breakPoint - 1 ? true : false,
              })}
              px={itemPx || '35px'}
              py={itemPy || '21px'}
              justifyContent="space-between">
              <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
                {item.key}
              </Text>

              {item.key === 'Contract' ? (
                <Flex>
                  <Text
                    {...STATER_STYLE.mainText({colorMode, fontSize})}
                    mr={2}>
                    {item.value}
                  </Text>
                  <Image
                    src={MetamaskImg}
                    w={25}
                    h={'24px'}
                    cursor={'pointer'}
                    onClick={() =>
                      account &&
                      library &&
                      addToken(
                        item.value,
                        library,
                        item.image ? item.image : '',
                      )
                    }
                  />
                </Flex>
              ) : (
                <Text {...STATER_STYLE.mainText({colorMode, fontSize})}>
                  {item.value}
                </Text>
              )}
            </Flex>
          );
        })}
      </Box>
    </Flex>
  );
};
