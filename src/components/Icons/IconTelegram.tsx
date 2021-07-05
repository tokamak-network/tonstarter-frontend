import * as React from "react"
import {useColorMode} from '@chakra-ui/react';
export const IconTelegram = (props: React.SVGProps<SVGSVGElement>) =>{
    const {colorMode} = useColorMode();
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      {...props}
    >
      <path fill="none" d="M0 0h20v20H0z" />
      <path
        fill={colorMode==='light'? '#ffffff': '#ffffff'}
        fillRule="evenodd"
        d="M8.698 12.202c.163-1.169 8.7-7.55 6.688-6.486l-5.422 3.14c-3.209 1.949-2.976 1.638-2.3 3.958a8.27 8.27 0 00.541 1.719c.378.452.485-2.3.49-2.331m-3-1.262c.307.121.24.08.344.436.231.785.471 1.509.706 2.287.794 2.641.7 2.656 1.827 1.736 1.866-1.518 1.693-1.667 2.764-.911l3.088 2.252c.878.664.924-.68 1.075-1.4l2.475-11.805c.055-.23.023-.371-.062-.451-.179-.167-.591-.06-.921.074L3.831 8.233C-.114 9.717 3.174 9.95 5.694 10.94z"
      />
    </svg>
  )
}
