import * as React from "react"
import {useColorMode} from '@chakra-ui/react';
export const IconTopArrow = (props: React.SVGProps<SVGSVGElement>) =>{
    const {colorMode} = useColorMode();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={30}
      height={38}
      viewBox="0 0 30 38"
    >
      <path fill="none" d="M0 0h30v38H0z" />
      <path
        fill={colorMode==='light'?"#101112": '#7e8993'}
        fillRule="evenodd"
        d="M14.192 28V13.007l-6.049 5.875L7 17.772 15 10l8 7.771-1.143 1.111-6.048-5.876V28z"
      />
    </svg>
  )
}