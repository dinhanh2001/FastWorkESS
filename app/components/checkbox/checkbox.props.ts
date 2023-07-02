import { StyleProp, ViewStyle } from "react-native"
import { TxKeyPath } from "../../i18n"
import { ICheckboxProps as PropCkeckBox } from "native-base"
export interface CheckboxProps extends PropCkeckBox{
  /**
   * Additional container style. Useful for margins.
   */
  style?: StyleProp<ViewStyle>

  /**
   * Additional outline style.
   */
  
  /**
   * Additional fill style. Only visible when checked.
   */
  fillStyle?: StyleProp<ViewStyle>
  /**
   * Is the checkbox checked?
   */
  /**
   * The text to display if there isn't a tx.
   */
  text?: string

  /**
   * The i18n lookup key.
   */
  tx?: TxKeyPath

  /**
   * Multiline or clipped single line?
   */
  multiline?: boolean

  /**
   * Fires when the user tabs to change the value.
   */
  onToggle?: (newValue: boolean) => void
  textColor?:string
}
