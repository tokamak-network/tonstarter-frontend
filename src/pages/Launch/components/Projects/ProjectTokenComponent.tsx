import { FC } from "react";
import {Flex, Text} from '@chakra-ui/react'

type ProjectTokenProps = {

}

export const ProjectTokenComponent: FC<ProjectTokenProps> =({}) =>{
    return (
        <Flex p={'25px 35px 50px 35px'}><Text>project  token</Text></Flex>
    )
}