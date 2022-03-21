import {Box, Flex, useColorMode, useTheme, Image} from '@chakra-ui/react';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import VaultCard from '../common/VaultCard';
import {useFormikContext} from 'formik';
import {useState} from 'react';
import {Projects, Vault} from '@Launch/types';
import {useAppDispatch} from 'hooks/useRedux';
import {changeVault} from '@Launch/launch.reducer';
import {motion} from 'framer-motion';
import AddVaultCard from '@Launch/components/common/AddVaultCard';

const Vaults = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const dispatch = useAppDispatch();
  const [transX, setTransX] = useState<number>(0);

  return (
    <Flex w={'100%'} bg={'white.100'} flexDir="column">
      <Box d="flex" h={'220px'} px={'15px'} justifyContent="space-between">
        <Image
          cursor={'pointer'}
          src={arrowLeft}
          w={'24px'}
          h={'48px'}
          alignSelf="center"
          onClick={() => setTransX(transX + 165)}
        />
        <Flex w={'100%'} alignItems="center" mx={'15px'} overflow={'hidden'}>
          <motion.div
            animate={{x: transX}}
            style={{display: 'flex', width: '100%'}}>
            {vaultsList?.map((vault: Vault, index: number) => {
              const {
                vaultName,
                vaultTokenAllocation,
                isMandatory,
                adminAddress,
              } = vault;
              const strVaultTokenAllocation =
                vaultTokenAllocation?.toString() || '0';
              return (
                <Box
                  // mr={(index + 1) % 3 !== 0 ? '20px' : 0}
                  mr={'18px'}
                  onClick={() => dispatch(changeVault({data: vaultName}))}>
                  <VaultCard
                    key={`${vaultName}_${vaultTokenAllocation}`}
                    status={vaultName === 'Public' ? 'public' : 'notPublic'}
                    name={vaultName}
                    tokenAllocation={strVaultTokenAllocation}
                    isMandatory={isMandatory}
                    adminAddress={adminAddress}></VaultCard>
                </Box>
              );
            })}
            <Box
            // onClick={() => dispatch(changeVault({ data: vaultName }))}
            >
              <AddVaultCard></AddVaultCard>
            </Box>
          </motion.div>
        </Flex>
        <Image
          cursor={'pointer'}
          src={arrowRight}
          w={'24px'}
          h={'48px'}
          alignSelf="center"
          onClick={() => setTransX(transX - 165)}
        />
      </Box>
    </Flex>
  );
};

export default Vaults;
