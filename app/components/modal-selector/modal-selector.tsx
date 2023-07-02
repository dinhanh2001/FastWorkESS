import * as React from "react"
import { View } from "react-native"
import { observer } from "mobx-react-lite"
import { Text } from "../text/text"
import ModalSelector from "react-native-modal-selector-searchable"
import IModalSelectorProps from "react-native-modal-selector-searchable"

export interface ModalSelectorProps extends IModalSelectorProps {
  /**
   * An optional style override useful for padding & margin.
   */


}

/**
 * Describe your component here
 */
export const ModalSelectorSearch = observer(function ModalSelector(props: ModalSelectorProps ) {
  //const { dataCustom, handleSelect, opened } = props
  const [isOpen, setIsOpen] = React.useState(false);
  const onClose = () => setIsOpen(false)
  return (
    <View>
       <ModalSelector
        data={[]}
        initValue={""}
        visible={isOpen}
        caseSensitiveSearch={true}
        touchableActiveOpacity={0}
        onCancel={onClose}
        searchText={`Tìm kiếm`}
        animationType="fade"
        renderItem={(item)=>{
          return (
            <Text text="dgdgd" />
          )
        }}
       
      >
        <Text text="" />
      </ModalSelector> 
    </View>
  )
})
