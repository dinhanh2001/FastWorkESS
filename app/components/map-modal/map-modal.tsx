import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { color, typography } from "../../theme"
import { Text } from "../text/text"
import { Modal } from "native-base"

const CONTAINER: ViewStyle = {
  justifyContent: "center",
}

const TEXT: TextStyle = {
  fontFamily: typography.primary,
  fontSize: 14,
  color: color.primary,
}

export interface MapModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const MapModal = observer(function MapModal(props: MapModalProps) {
  const { style } = props
  const [isModalVisible, setModalVisible] = React.useState(true)
  const styles = Object.assign({}, CONTAINER, style)


  return (
    <View style={styles}>
      <Modal isOpen={isModalVisible} onClose={() => setModalVisible(!isModalVisible)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>
            <Text tx="profileScreen.changePassword" />
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
        </Modal.Content>
      </Modal>

    </View>
  )
})
