import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { Box, Center, Skeleton, VStack } from "native-base"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

// const TEXT: TextStyle = {
//   fontFamily: typography.primary,
//   fontSize: 14,
//   color: color.primary,
// }

export interface SkeletonProfileNavProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const SkeletonProfileNav = observer(function SkeletonProfileNav(
  props: SkeletonProfileNavProps,
) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
        <VStack bgColor={color.background} paddingBottom="5">
          <Center>
            <VStack w="100%" space={6} rounded="md" marginTop={20} alignItems="center">
              <VStack>
                <Skeleton
                  borderWidth={1}
                  borderColor="coolGray.200"
                  endColor="warmGray.50"
                  h={100}
                  maxH={110}
                  w={100}
                  maxW={110}
                  rounded="full"
                  mt="-70"
                />
                <Skeleton
                  size="10"
                  rounded="full"
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    borderRadius: 50,
                    borderWidth: 3,
                    borderColor: color.background,
                  }}
                />
              </VStack>
              <Skeleton w="40" rounded="20" h="5" />
              <Skeleton.Text lines={1} alignItems="center" px="12" />
            </VStack>
          </Center>
        </VStack>
    </View>
  )
})
