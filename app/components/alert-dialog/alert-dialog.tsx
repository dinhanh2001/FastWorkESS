import * as React from "react"
import { StyleProp, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { AlertDialog as AlertLog, Button, Center} from "native-base";
import { TxKeyPath } from "../../i18n";
import { Text } from "../text/text";
import { color } from "../../theme/color";
import { spacing } from "../../theme";

export interface AlertDialogProps {
  /**
   * An optional style override useful for padding & margin.
   */
  value?:boolean
  messerr?:string | TxKeyPath
  style?: StyleProp<ViewStyle>
  tx?:TxKeyPath

}

/**
 * Describe your component here
 */
export const AlertDialog = observer(function AlertDialog(props: AlertDialogProps) {
  const { value,messerr, tx,...rest} = props
  const [isOpen, setIsOpen] = React.useState(value);
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef(null);
  return (
    <Center >
      <AlertLog   leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertLog.Content >
          <AlertLog.Header borderBottomColor={color.backGroundView} bg={color.backGroundView}>
            <Text tx="loginScreen.headerError" fontSize={spacing[5]} fontWeight={"bold"} color={color.storybookDarkBg}/>
          </AlertLog.Header>
          <AlertLog.Body bg={color.backGroundView} >
              <Text text={messerr}fontSize={spacing[5]}  color={color.storybookDarkBg}/>
          </AlertLog.Body>
          <AlertLog.Footer bg={color.backGroundView} borderTopColor={color.backGroundView} >
            <Button.Group space={2}>
              <Button colorScheme="info" onPress={onClose}>
                <Text tx="loginScreen.closeError" color={color.storybookDarkBg} />
              </Button>
            </Button.Group>
          </AlertLog.Footer>
        </AlertLog.Content>
      </AlertLog>
    </Center>
  )
})
