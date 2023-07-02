import React,{useState,useRef} from "react"
import { AutoImage as Image } from "../auto-image/auto-image"
import { presets } from "./wallpaper.presets"
import { WallpaperProps } from "./wallpaper.props"
import { Center ,Button ,AlertDialog } from "native-base"
const defaultImage = require("./bg.png")

/**
 * For your text displaying needs.
 *
 * This component is a HOC over the built-in React Native one.
 */
export function Wallpaper(value:boolean,mess:string) {
  // grab the props
 
  const [isOpen, setIsOpen] = React.useState(value);

  const onClose = () => setIsOpen(false);

  const cancelRef = React.useRef(null);
  return(
    <Center>
      <Button colorScheme="danger" onPress={() => setIsOpen(!isOpen)}>
        Delete Customer
      </Button>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>Delete Customer</AlertDialog.Header>
          <AlertDialog.Body>
           {mess}
          </AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                Cancel
              </Button>
              <Button colorScheme="danger" onPress={onClose}>
                Delete
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  )
}
