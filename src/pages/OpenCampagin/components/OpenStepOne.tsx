import {Button, Flex, Input} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import {useContract} from 'hooks/useContract';
import {useEffect, useState} from 'react';
import * as ERC20_FACTORY_A_ABI from 'services/abis/ERC20AFactory.json';
import type {ProjectStep2} from '@OpenCampagin/types';
import {convertToWei} from 'utils/number';

const OpenStepOne = () => {
  const {ERC20AFACTORY_ADDRESS} = DEPLOYED;
  const ERC20_FACTORY_A = useContract(
    ERC20AFACTORY_ADDRESS,
    ERC20_FACTORY_A_ABI.abi,
  );
  const [tokenInputs, setTokenInputs] = useState<ProjectStep2>({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    ownerAddress: '',
  });

  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: {value, id},
    } = e;
    if (id === 'totalSupply') {
      return setTokenInputs({
        ...tokenInputs,
        [id]: convertToWei(value.replaceAll(',', '')),
      });
    }
    setTokenInputs({
      ...tokenInputs,
      [id]: value,
    });
  };

  useEffect(() => {
    console.log(tokenInputs);
  }, [tokenInputs]);

  return (
    <Flex>
      <Flex>
        <Input
          id={'tokenName'}
          placeholder="token name"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeValue(e)
          }></Input>
        <Input
          id={'tokenSymbol'}
          placeholder="token symbol"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeValue(e)
          }></Input>
        <Input
          id={'totalSupply'}
          placeholder="initial supply"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeValue(e)
          }></Input>
        <Input
          id={'ownerAddress'}
          placeholder="token owner"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChangeValue(e)
          }></Input>
      </Flex>
      <Button
        onClick={() => {
          const {tokenName, tokenSymbol, totalSupply, ownerAddress} =
            tokenInputs;
          if (ERC20_FACTORY_A) {
            return ERC20_FACTORY_A.create(
              tokenName,
              tokenSymbol,
              totalSupply,
              ownerAddress,
            );
          }
        }}>
        create
      </Button>
    </Flex>
  );
};

export default OpenStepOne;
