import * as React from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Select, CheckIcon } from "native-base"
const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface itemSelect {
  name?: string
  value?: string
}

export interface SelectOptionsProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  arrValue?: itemSelect[]
  selectedVal?: string
  onValueChange?(d): void
}

/**
 * Describe your component here
 */
export const SelectOptions = observer(function SelectOptions(props: SelectOptionsProps) {
  const { style, arrValue, onValueChange, selectedVal } = props
  const styles = Object.assign({}, CONTAINER, style)
  return (
    <View style={styles}>
      <Select selectedValue={selectedVal} minWidth="200" accessibilityLabel="Choose" placeholder="Choose" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={onValueChange}>
          {arrValue.map((d,i)=>{
            return <Select.Item label={d.name} value={d.value} key={i}/>
          })}
        </Select>
    </View>
  )
})
