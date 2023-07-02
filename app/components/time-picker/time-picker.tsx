import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import DateTimePickerModal from "react-native-modal-datetime-picker";

export interface TimePickerProps {
  /**
   * An optional style override useful for padding & margin.
   */
  isOpen?:boolean
  onPassing(time):void
  close():void
}

/**
 * Describe your component here
 */
export const TimePicker = observer(function TimePicker(props: TimePickerProps) {
  const {onPassing,isOpen,close} = props
  const [open ,setOpen] = React.useState<boolean>(isOpen)
  const handleConfirm =(time) =>{
    setOpen(false)
    onPassing(time)
  }
  const hideDatePicker = () =>{
    setOpen(false)
    close()
  }
  return (
    <View >
      <DateTimePickerModal 
      mode="time"
      isVisible={open}
      date={new Date()}
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
       />
    </View>
  )
})
