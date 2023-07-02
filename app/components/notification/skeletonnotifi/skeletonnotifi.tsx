import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import {Skeleton  ,VStack ,HStack} from "native-base"

export interface SkeletonnotifiProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
 const Skeletonnotifi = observer(function Skeletonnotifi(props: SkeletonnotifiProps) {
  
  

  return (
    <  >
      <HStack w="95%"   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
      <HStack w="95%" marginTop={5}   borderBottomWidth="1" space={8} rounded="md" _dark={{
      borderColor: "coolGray.500"
    }} _light={{
      borderColor: "coolGray.200"
    }} p="4">
        <Skeleton size="16" rounded="full" />
        <VStack flex="2" space="4">
          <Skeleton.Text lines={2} />
          <HStack space="" alignItems="center">
            <Skeleton h="3" flex="0.3" rounded="full" startColor="indigo.300" />
          </HStack>
        </VStack>
      </HStack>
    </>
  )
})
export default Skeletonnotifi