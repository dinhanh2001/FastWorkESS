import * as React from "react"
import { StatusBar, StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { Text } from "../../text/text"
import { Box, HStack, Skeleton, VStack } from "native-base"





export interface SkeletonhomescreenProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Skeletonhomescreen = observer(function Skeletonhomescreen(props: SkeletonhomescreenProps) {
  

  return (
    <>
    <StatusBar barStyle="dark-content" />
    <HStack w="100%" paddingTop={5} borderBottomWidth="1" height={"30%"} space={8} rounded="none" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} 
    
    bgColor="blue.500"
    >
      <Text text="UGBM" h="5" flex="0.3" rounded="xs" color={color.background} w={50} top="4" left={10} position="absolute"  fontWeight={"bold"} fontSize="18"/>
        <Text text="Menu" h="5" flex="0.3" rounded="xs" color={color.background} w={50} top="4" right={10} position="absolute" fontWeight={"bold"} fontSize="18" />
      </HStack>
      <Box marginTop={"-36%"}  bgColor="light.100" marginX={"10%"} borderRadius={10}h={210}  >
        <VStack  padding={5}    shadow="5" justifyContent="space-around" flexDirection={"row"}>
          <HStack  flexDirection="column" flex={"0.5"} >
          <Skeleton w={20} h={5} mb="2" rounded="xs" startColor="trueGray.200" speed={0.5} />
          <Skeleton h={5} mb="2" rounded="xs" startColor="trueGray.200" speed={0.5}/>
          <Skeleton h={5} mb="2" rounded="xs" startColor="trueGray.200" speed={0.5}/>
          <Skeleton w={40} h={5}  rounded="xs" startColor="trueGray.200" speed={0.5}/>
          </HStack>
              <Skeleton size="16" rounded="full" speed={0.5} color={"gray.500"} />
        </VStack>
        <VStack flexDirection={"row"} justifyContent="space-around" marginX="5%" >
          <Skeleton w={"45%"}  speed={0.5} my="4" rounded="md" startColor="green.100" endColor="blue.200" borderRadius={10} />
          <Skeleton w={"45%"} speed={0.5}  my="4" rounded="md" startColor="gray.300"  />
        </VStack>
        </Box>
        <Box marginX={"10%"} marginTop={28} flexDirection={"row"} justifyContent="space-between">
        <Skeleton w={"45%"} speed={0.5} h={"2/5"}  rounded="md" startColor="gray.300" />
        <Skeleton w={"45%"} speed={0.5} h={"2/5"}  rounded="md" startColor="gray.300" />
        </Box>
    </>
  )
})
