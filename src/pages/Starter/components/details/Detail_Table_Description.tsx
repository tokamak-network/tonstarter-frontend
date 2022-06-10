import {AdminObject} from '@Admin/types';
import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailTableContainer} from './Detail_Table_Container';
import {useWeb3React} from '@web3-react/core';
import {useEffect, useState} from 'react';
import starterActions from '../../actions';
import ReactQuill from 'react-quill';
type Detail_Table_DescriptionProps = {
  saleInfo: AdminObject;
};

export const Detail_Table_Description: React.FC<
  Detail_Table_DescriptionProps
> = (prop) => {
  const {saleInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  return (
    <Flex flexDir="column">
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 24})} mb={'30px'}>
        Description
      </Text>
      <Box d="flex" justifyContent="space-between">
        <Box
          {...STATER_STYLE.containerStyle({colorMode})}
          w={'1194px'}
          h={'100%'}
          _hover=""
          cursor=""
          fontSize={15}
          px={'23px'}
          py={'18px'}>
          <ReactQuill
            // placeholder="Input the project description"
            readOnly={true}
            value={saleInfo.description}
            theme={'bubble'}
            style={{color: 'white !important'}}
          />
        </Box>
      </Box>
    </Flex>
  );
};
