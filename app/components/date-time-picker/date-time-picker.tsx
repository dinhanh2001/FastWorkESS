import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../theme"
import RNDateTimePicker from "@react-native-community/datetimepicker"
import  AntDesign  from '@expo/vector-icons/AntDesign';

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const PICK: TextStyle = {
  position: "absolute",
  right: 0,
  display: "none"
}

export interface DateTimePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>,
  value?: Date
}

/**
 * Describe your component here
 */
export const DateTimePicker = observer(function DateTimePicker(props: DateTimePickerProps) {
  const { style, value } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
      <RNDateTimePicker
        value={value}
        style={PICK}
        mode="date"
        display="default"
      />
      <AntDesign name="calendar" size={24} color="black" />
    </View>
  )
})
