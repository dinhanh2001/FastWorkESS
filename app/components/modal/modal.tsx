import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
// import { Text } from "../text/text"
import { Modal as ModalNTB, FormControl, Input, Button } from "native-base"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

export interface ModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Modal = observer(function Modal(props: ModalProps) {
  const { style } = props
  const styles = Object.assign({}, CONTAINER, style)
  const [modalVisible, setModalVisible] = React.useState(true);
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  return (
    <View style={styles}>
      <ModalNTB isOpen={modalVisible} onClose={() => setModalVisible(false)} initialFocusRef={initialRef} finalFocusRef={finalRef}>
        <ModalNTB.Content>
          <ModalNTB.CloseButton />
          <ModalNTB.Header>Contact Us</ModalNTB.Header>
          <ModalNTB.Body>
            <FormControl>
              <FormControl.Label>Name</FormControl.Label>
              <Input ref={initialRef} />
            </FormControl>
            <FormControl mt="3">
              <FormControl.Label>Email</FormControl.Label>
              <Input />
            </FormControl>
          </ModalNTB.Body>
          <ModalNTB.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
              setModalVisible(false);
              console.log("finalRef", finalRef)
            }}>
                Cancel
              </Button>
              <Button onPress={() => {
              setModalVisible(false);
            }}>
                Save
              </Button>
            </Button.Group>
          </ModalNTB.Footer>
        </ModalNTB.Content>
      </ModalNTB>
    </View>
  )
})
