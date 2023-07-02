import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { ISpinnerProps ,Spinner as SpinnerNTB ,HStack} from "native-base"
import { TxKeyPath } from "../../i18n"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface SpinnerProps extends ISpinnerProps{
  /**
   * An optional style override useful for padding & margin.
   */
  tx?:TxKeyPath
  text?:string
  style?: StyleProp<ViewStyle>
  color?:string
  bg?:string
}

/**
 * Describe your component here
 */
export const Spinner = observer(function Spinner(props: SpinnerProps) {
  const { style,tx,text,color,bg ,...rest } = props
  const styles = Object.assign({}, CONTAINER, style)
  const content = <Text tx={tx} text={text}  />
  return (
    <HStack justifyContent={"center"} bg={bg} borderRadius={10} paddingY="3">
     
    <SpinnerNTB accessibilityLabel="Loading posts" color={color} />
      <Text marginX={2} color="white" fontSize="md">
      {content}
      </Text>
      </HStack>
  )
})
