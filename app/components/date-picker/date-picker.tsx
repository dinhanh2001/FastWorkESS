import * as React from "react"
import { useState } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
// import { color, typography } from "../../theme"
import { Box, Input, IInputProps, Icon } from "native-base"
import  AntDesign  from '@expo/vector-icons/AntDesign';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { dateString,stringYMD ,dateSetHoursMinutesString} from "../../utils/common"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface DatePickerProps extends IInputProps{
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  // Use dateString() in root component convert date to string
  defaultValue?: string
  mode?:"date"| "time" 
  onPassing?(e): void
  
}

/**
 * Describe your component here
 */
export const DatePicker = observer(function DatePicker(props: DatePickerProps) {
  const { style, defaultValue,mode, onPassing, ...rest } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState<string>(defaultValue)
  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    setDate(date.toJSON())
    setDatePickerVisibility(false)
    onPassing(date)
  }
  return (
    <View style={styles}>
      <Box>
      <Input
          defaultValue={date ? (mode=="time"?dateSetHoursMinutesString(date):dateString(date) ) : ""}
          placeholder="Birth day"
          showSoftInputOnFocus={false}
          onFocus={()=> {showDatePicker()}}
          isDisabled={isDatePickerVisible}
          onChange={(e)=>console.log(e)}
          InputRightElement={<Icon m="1" size="6" color="black" as={<AntDesign onPress={showDatePicker} name="calendar" size={24} color="black"/>}/>}
          {...rest}
          
        />
      </Box>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // locale={"vi"}
        date={ date ? new Date(date) : new Date() }
      />
    </View>
  )
})