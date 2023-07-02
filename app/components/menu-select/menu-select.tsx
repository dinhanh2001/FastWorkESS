import * as React from "react"
import { StyleProp, View, TextStyle, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import { Menu, HStack, Button } from "native-base"
import { Ionicons } from '@expo/vector-icons';
import { TxKeyPath } from "../../i18n"

const CONTAINER: TextStyle = {
  paddingRight: 3,
  color: "white"
}

export interface MenuSelectProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  arrValue?: Array<{ value?: any; name?: string }>
  defaultValue?: string
  title: TxKeyPath
  tx: TxKeyPath
  type?: "radio" | "checkbox"
  onChange?(e: any): void
}

/**
 * Describe your component here
 */
export const MenuSelect = observer(function MenuSelect(props: MenuSelectProps) {
  const { style, arrValue, defaultValue, title, type, onChange, tx } = props
  const styles = Object.assign({}, CONTAINER, style)
  // const [ value, setValue ] = React.useState<string>(arrValue[0].value)
  return (
    <View >
      <Menu
        closeOnSelect={true}
        w={"100%"}
        // maxW={300}
        onOpen={() => console.log("opened")}
        onClose={() => console.log("closed")}
        trigger={(triggerProps) => {
          return (
            <Button {...triggerProps} >
              <HStack>
                <Text tx={tx} style={styles} />
                <Ionicons name="options" size={24} color="white" />
              </HStack>
            </Button>
          )
        }}
      >
        <Menu.OptionGroup defaultValue={defaultValue} title={title} type={type} onChange={onChange}>
          {arrValue.map((d, i) => {
            return (
              <Menu.ItemOption value={d["value"]} key={i}>
                {d['name']}
              </Menu.ItemOption>
            )
          })}
        </Menu.OptionGroup>
      </Menu>
    </View>
  )
})
