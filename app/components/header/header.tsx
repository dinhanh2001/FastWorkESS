import React from "react"
import { View, ViewStyle, TextStyle, Pressable } from "react-native"
import { HeaderProps } from "./header.props"
import { Text } from "../text/text"
import { spacing } from "../../theme"
import { translate } from "../../i18n/"
import { color } from "../../theme"
import  AntDesign  from '@expo/vector-icons/AntDesign';
import  Entypo  from '@expo/vector-icons/Entypo';
// static styles
const ROOT: ViewStyle = {
  flexDirection: "row",
  paddingHorizontal: spacing[4],
  alignItems: "center",
  paddingTop: spacing[4],
  paddingBottom: spacing[2],
  justifyContent: "flex-start",
  backgroundColor:color.background
  
}
const TITLE: TextStyle = { textAlign: "center" }
const TITLE_MIDDLE: ViewStyle = { flex: 1, justifyContent: "center" }
const LEFT: ViewStyle = { width: 32 }
const RIGHT: ViewStyle = { width: 32 }

/**
 * Header that appears on many screens. Will hold navigation buttons and screen title.
 */
export function Header(props: HeaderProps) {
  const {
    onLeftPress,
    onRightPress,
    rightIcon,
    leftIcon,
    headerText,
    headerTx,
    style,
    bgColor,
    titleStyle,
    colorLeftIons,
    iconsRight,
    border
  } = props
  const header = headerText || (headerTx && translate(headerTx)) || ""
  return (
    <View style={[ROOT, style,{backgroundColor:bgColor},border ? {borderBottomColor:color.backGroundView,borderBottomWidth:1}:{borderBottomWidth:0}]}>
      {leftIcon ? (
         <AntDesign  name="arrowleft" size={25} color={colorLeftIons}  onPress={onLeftPress} />
        
      ) : (
        <View style={LEFT} />
      )}
      <View style={TITLE_MIDDLE}>
        <Text style={[TITLE, titleStyle]} text={header} fontSize="2xl" fontWeight={"bold"}/>
      </View>
      {rightIcon ? (
            <Pressable onPress={onRightPress}>
                  {iconsRight}
             </Pressable>
        
   
      ) : (
        <View style={RIGHT} />
      )}
    </View>
  )
}
