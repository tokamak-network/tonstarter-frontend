import * as React from 'react';
import {useColorMode} from '@chakra-ui/react';
export const LaunchMedium = (props: React.SVGProps<SVGSVGElement>) => {
  const {colorMode} = useColorMode();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <defs>
        <style>{`.prefix__cls-2{fill:${
          colorMode === 'light' ? '#c7d1d8' : '#c7d1d8'
        }}`}</style>
      </defs>
      <path id="prefix__Base" fill="none" d="M0 0h20v20H0z" />
      <g id="prefix__\uADF8\uB8F9_5284" transform="translate(0 4)">
        <circle
          data-name="타원 1"
          cx="5.677"
          cy="5.677"
          r="5.677"
          fill='#c7d1d8'
       
        />
        <ellipse
          data-name="타원 2"
          cx="2.775"
          cy="5.313"
          rx="2.775"
          ry="5.313"
          transform="translate(11.929 .364)"
          fill='#c7d1d8'
        />
        <ellipse
          data-name="타원 3"
          cx="1.015"
          cy="4.772"
          rx="1.015"
          ry="4.772"
          transform="translate(17.97 .905)"
          fill='#c7d1d8'
        />
      </g>
    </svg>
  );
};
