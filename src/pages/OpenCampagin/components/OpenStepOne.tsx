import {Flex} from '@chakra-ui/react';
import {useEffect} from 'react';
import type {Projects} from '@OpenCampagin/types';
import InputComponent from '@OpenCampagin/components/common/InputComponent';

const filedNameList = [
  'projectName',
  'description',
  'tokenName',
  'tokenSymbol',
  'totalSupply',
  'ownerAddress',
];

const OpenStepOne = () => {
  return (
    <Flex>
      <Flex>
        {filedNameList.map((name: string) => {
          return (
            <InputComponent
              name={name}
              placeHolder={`input ${name}`}
              key={name}></InputComponent>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default OpenStepOne;