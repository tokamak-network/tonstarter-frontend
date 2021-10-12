import {
    useColorMode,
    useTheme,
} from '@chakra-ui/react';



export const styles = (colorMode: any ) =>{

    if (colorMode == 'light'){
        return 
            `.DayPicker-Day--outside {
              font-size: 13px;
              font-family: Roboto;
              color: #c7d1d8
            }`
    }

    else {

        `.DayPicker-Day--outside {
            font-size: 13px;
            font-family: Roboto;
            color: #3c3c3c
          }`
    }

}

