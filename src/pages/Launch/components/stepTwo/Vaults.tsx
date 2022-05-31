import {
  Box,
  Button,
  Flex,
  useColorMode,
  useTheme,
  Image,
} from '@chakra-ui/react';
import arrowLeft from 'assets/svgs/arrow_left_normal_icon.svg';
import arrowLeftDark from 'assets/launch/arrow-left-normal-icon.svg';
import arrowHoverLeft from 'assets/launch/arrow-left-hover-icon.svg';
import arrowRight from 'assets/svgs/arrow_right_normal_icon.svg';
import arrowRightDark from 'assets/launch/arrow-right-normal-icon.svg';
import arrowHoverRight from 'assets/launch/arrow-right-hover-icon.svg';
import VaultCard from '../common/VaultCard';
import {useFormikContext} from 'formik';
import {useState, useRef} from 'react';
import {Projects, Vault} from '@Launch/types';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {changeVault, selectLaunch} from '@Launch/launch.reducer';
import AddVaultCard from '@Launch/components/common/AddVaultCard';
import HoverImage from 'components/HoverImage';
import {Swiper, SwiperSlide} from 'swiper/react/swiper-react.js';
import 'swiper/swiper.min.css'; // core Swiper
import 'swiper/modules/navigation/navigation.min.css'; // Navigation module
import 'swiper/modules/pagination/pagination.min.css'; // Pagination module
import {Pagination, Navigation} from 'swiper';

const Vaults = () => {
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {values} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const dispatch = useAppDispatch();
  const [swiperRef, setSwiperRef] = useState<any>();
  const {
    data: {selectedVaultIndex},
  } = useAppSelector(selectLaunch);

  const sliderStyles = `.swiper {
    height: 239px
  }
  .swiper-horizontal>.swiper-pagination-bullets, .swiper-pagination-bullets.swiper-pagination-horizontal, .swiper-pagination-custom, .swiper-pagination-fraction {
    bottom: -5px
  }
  .swiper-button-next, .swiper-button-prev {
    display: none
  }
  .swiper-wrapper {
    margin-top: 1px
  }
    `;

  const styleClass = `{bottom: '0px'}`;

  const gotToNext = () => {
    swiperRef.slideNext();
  };

  const goToPrev = () => {
    swiperRef.slidePrev();
  };
  return (
    <Flex
      w={'100%'}
      bg={colorMode === 'light' ? 'white.100' : 'none'}
      flexDir="column">
      <Box d="flex" h={'239px'} px={'15px'} justifyContent="center">
        <Flex w={'100%'} alignItems="center" justifyContent={'center'} mx={'10px'} px={'5px'}>
          <style>{sliderStyles}</style>
       <Flex h={'196px'}  position={'relative'} top={'-17px'} mr={'16px'}>
          <HoverImage
            img={colorMode === 'light' ? arrowLeft : arrowLeftDark}
            hoverImg={arrowHoverLeft}
            action={() => {goToPrev()}}></HoverImage>
            </Flex>
          <Swiper
            onSwiper={(swiper) => setSwiperRef(swiper)}
            slidesPerView={5.95}
            spaceBetween={0}
            loop={true}
            pagination={{
              clickable: true,
              type: 'bullets',
              horizontalClass: styleClass,
            }}
            height={280}
            navigation={true}
            modules={[Pagination, Navigation]}
          >
            {vaultsList
              .map((vault: Vault, index: number) => {
                const {
                  vaultName,
                  vaultTokenAllocation,
                  isMandatory,
                  adminAddress,
                  vaultType,
                  index: vaultIndex,
                } = vault;
                const strVaultTokenAllocation =
                  vaultTokenAllocation?.toString() || '0';
                return (
                  <SwiperSlide>
                    <Box
                      ml={'2px'}
                      // mr={(index + 1) % 3 !== 0 ? '20px' : 0}
                      w="150px"
                      onClick={() =>
                        dispatch(
                          changeVault({
                            data: vaultName,
                            vaultType,
                            vaultIndex,
                          }),
                        )
                      }>
                      <VaultCard
                        key={`${vaultName}_${vaultTokenAllocation}`}
                        status={vaultName === 'Public' ? 'public' : 'notPublic'}
                        name={
                          vaultType === 'Liquidity Incentive' &&
                          isMandatory === true
                            ? `${values.tokenName}-TOS LP Reward *`
                            : isMandatory === true
                            ? `${vaultName} *`
                            : vaultName
                        }
                        tokenAllocation={strVaultTokenAllocation}
                        isMandatory={isMandatory}
                        adminAddress={adminAddress}
                        vaultIndex={vaultIndex}></VaultCard>
                    </Box>
                  </SwiperSlide>
                );
              })
              .concat(
                <SwiperSlide>
                  <AddVaultCard></AddVaultCard>
                </SwiperSlide>,
              )}
          </Swiper>
          <Flex h={'196px'} position={'relative'} top={'-17px'} ml={'16px'}>

          <HoverImage
            img={colorMode === 'light' ? arrowRight : arrowRightDark}
            hoverImg={arrowHoverRight}
            action={() => { gotToNext()}}></HoverImage>
            </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Vaults;
