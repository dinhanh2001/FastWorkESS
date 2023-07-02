import * as React from "react"
import {  StyleProp,  ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color } from "../../../theme"
import { Text } from "../../text/text"
import { Pressable as PressableNTB,IPressableProps } from "native-base"
import { Box } from "native-base"
import { TxKeyPath } from "../../../i18n"
export interface MenuHomeProps extends IPressableProps{
  style?: StyleProp<ViewStyle>
  tx?:TxKeyPath
  text?:string
  icon?:any
}

export const MenuHome = observer(function MenuHome(props: MenuHomeProps) {
  const { style,tx,text ,icon,...rest} = props
  const content =  <Text tx={tx} text={text}  fontWeight="bold" fontSize={16}/>

  return (
    <PressableNTB  {...rest} width={"45%"} marginY="5" >
      <Box  padding="5" alignItems={"center"} shadow="9"  borderRadius="10" bgColor={color.background}>
        {icon}
        {content}
      </Box>
    </PressableNTB>
  )
})
