import { StyleProp, TextStyle, TouchableOpacityProps, ViewStyle ,PressableProps,ButtonProps as Oss } from "react-native"
import { ButtonPresetNames } from "./button.presets"
import { TxKeyPath } from "../../i18n"
import {IButtonProps ,IPressableProps} from "native-base"
export interface ButtonProps extends IButtonProps {
  /**
   * Text which is looked up via i18n.
   */
  tx?: TxKeyPath

  /**
   * The text to display if not using `tx` or nested components.
   */
  text?: string

  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  /**
   * An optional style override useful for the button text.
   */
  textStyle?: StyleProp<TextStyle>

  /**
   * One of the different types of text presets.
   */
  preset?: ButtonPresetNames

  /**
   * One of the different types of text presets.
   */
  children?: React.ReactNode

  
}
