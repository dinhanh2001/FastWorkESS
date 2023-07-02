import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, spacing } from "../../../theme"
import { Text } from "../../text/text"
import { TxKeyPath } from "../../../i18n"
import { Box } from "native-base"
import { ITextProps } from "native-base"

export interface ItemCalendarProps extends ITextProps{
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  tx?:TxKeyPath
  keymain?:string
  key?:string
  value?:string
  bg?:string
}

/**
 * Describe your component here
 */
export const ItemCalendar = observer(function ItemCalendar(props: ItemCalendarProps) {
  const {tx, style,value ,keymain,bg,...rest} = props
  return (
    <Box paddingX={2} flexDirection={"row"} justifyContent={"space-between"} bg={bg}>
      <Text  fontSize={spacing[4]} text={keymain} tx={tx} color={color.storybookDarkBg} {...rest}  />
      <Text  fontSize={spacing[4]} text={value} color={color.storybookDarkBg} {...rest} />
  </Box>
  )
})
