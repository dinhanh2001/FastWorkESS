import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { initials } from "../../utils/common"
import { Avatar } from "native-base"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { InterfaceAvatarProps } from "native-base/lib/typescript/components/composites/Avatar/types"

export interface AvatarNameProps extends InterfaceAvatarProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  uri: string
  name: string
}

/**
 * Describe your component here
 */

export const AvatarName = observer(function AvatarName(props: AvatarNameProps) {
  const { style, uri, name, ...rest } = props
  if (!uri || (uri && (uri + '').indexOf('http') == -1)) {
    return (

      <Avatar {...rest} bg="green.500" mr="1">
        <Text text={`${initials(name)}`} fontSize={spacing[6]} fontWeight="bold" color={color.background} />
      </Avatar>
    )
  } else { 
    return (
      <Avatar {...rest} bg="green.500" mr="1" source={{uri:uri}}>
        <Text text={`${initials(name)}`} fontSize={spacing[6]} fontWeight="bold" color={color.background} />
      </Avatar>
    )
  }
})