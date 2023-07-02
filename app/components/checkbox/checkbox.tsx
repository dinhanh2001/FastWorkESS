import * as React from "react"
import { TextStyle, ViewStyle } from "react-native"
import { Text } from "../text/text"
import { color, spacing } from "../../theme"
import { CheckboxProps } from "./checkbox.props"
import { Checkbox as CheckNTB ,Box} from "native-base"


const styleText:TextStyle = {
  color:color.background,
  marginLeft:3,
  
}
export function Checkbox(props: CheckboxProps) {
  
  
  const {
    tx,
    fillStyle,
    style,
    text,
    textColor,
    ...rest
  } = props
  const onPress = props.onToggle ? () => props.onToggle && props.onToggle(!props.value) : null;
  const contentcheck = <Text tx={tx} text={text} color={textColor}/>
  return (
    <Box flexDirection={"row"} alignItems="center">
        <CheckNTB
        {...rest}
      >
      {contentcheck}
      </CheckNTB>
      
    </Box>
    
   
  )
}
