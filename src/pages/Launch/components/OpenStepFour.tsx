import {Button, Flex, Input} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useEffect, useMemo, useState} from 'react';
import * as ERC20_FACTORY_A_ABI from 'services/abis/ERC20AFactory.json';
import type {ProjectStep2} from '@Launch/types';
import {convertToWei} from 'utils/number';

const OpenStepFour = () => {
  const {ERC20AFACTORY_ADDRESS} = DEPLOYED;
  const ERC20_FACTORY_A = useContract(
    ERC20AFACTORY_ADDRESS,
    ERC20_FACTORY_A_ABI.abi,
  );
  return (
    <Flex>
      <Button
        onClick={() => {
          //   const {tokenName, tokenSymbol, totalSupply, ownerAddress} =
          //     tokenInputs;
          //   if (ERC20_FACTORY_A) {
          //     return ERC20_FACTORY_A.create(
          //       tokenName,
          //       tokenSymbol,
          //       totalSupply,
          //       ownerAddress,
          //     );
          //   }
        }}>
        create
      </Button>
    </Flex>
  );
};

export default OpenStepFour;
