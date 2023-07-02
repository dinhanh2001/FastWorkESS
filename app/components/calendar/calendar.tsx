import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import {Calendar as CalendarWix,CalendarProps as PropCalendar} from 'react-native-calendars';
import { TxKeyPath } from "../../i18n"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface CalendarProps extends PropCalendar {
  /**
   * An optional style override useful for padding & margin.
   */
  tx?:TxKeyPath
  text?:string
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Calendar = observer(function Calendar(props: CalendarProps) {
  const { style,...rest } = props
  const styles = Object.assign({}, CONTAINER, style)

  return (
    <View style={styles}>
     <CalendarWix  {...rest}/>
    </View>
  )
})
