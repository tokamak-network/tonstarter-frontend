import * as React from 'react';
import {useColorMode} from '@chakra-ui/react';
export const IconTwitter = (props: React.SVGProps<SVGSVGElement>) => {
  const {colorMode} = useColorMode();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20">
      <path fill="none" d="M0 0h20v20H0z" />
      <path
        fill={colorMode === 'light' ? '#222222' : '#ffffff'}
        d="M15.152 2.91284H17.5754L12.281 8.96421L18.5095 17.1986H13.6326L9.81275 12.2045L5.44208 17.1986H3.01709L8.68026 10.7262L2.70508 2.91284H7.70582L11.1586 7.4776L15.152 2.91284ZM14.3013 15.748H15.6443L6.97622 4.28721H5.53506L14.3013 15.748Z"      />
    </svg>
  );
};
