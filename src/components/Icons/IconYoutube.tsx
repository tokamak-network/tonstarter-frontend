import * as React from 'react';
import {useColorMode} from '@chakra-ui/react';
export const IconYoutube = (props: React.SVGProps<SVGSVGElement>) => {
  const {colorMode} = useColorMode();
  return (
    <svg
      id="youtube-s-icon"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20">
      <defs>
        <style>
          {` .cls-2 {
          fill:${
            colorMode === 'light' ? '#222222' : '#ffffff'
          }
        }`}
        </style>
      </defs>
      <rect id="Base" fill="none" width="20" height="20" />
      <path
        id="패스_33"
        data-name="패스 33"
        className="cls-2"
        d="M295.646,86.282a2.681,2.681,0,0,0-2.4-1.868,81.129,81.129,0,0,0-14.327,0,2.682,2.682,0,0,0-2.4,1.872,25.081,25.081,0,0,0,0,9.29,2.681,2.681,0,0,0,2.4,1.868q3.567.316,7.162.317t7.161-.317h0a2.681,2.681,0,0,0,2.4-1.872A25.081,25.081,0,0,0,295.646,86.282Zm-5.964,5.06a.742.742,0,0,1-.207.207L285,94.53a.744.744,0,0,1-1.158-.62V87.948a.745.745,0,0,1,1.158-.62l4.472,2.981A.745.745,0,0,1,289.682,91.342Z"
        transform="translate(-276.081 -81.097)"
      />
    </svg>
  );
};
