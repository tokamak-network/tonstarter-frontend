import { FC } from "react";
import {Flex,Text} from '@chakra-ui/react'

type VaultComponent = {

}
export const VaultComponent: FC <VaultComponent> = ({}) => {
    return (
        <Flex p={'25px 35px 50px 35px'}><Text>vault</Text></Flex>
    )
}