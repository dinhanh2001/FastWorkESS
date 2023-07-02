// import * as React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { StyleProp, View, ViewStyle, StyleSheet } from "react-native"
// import { observer } from "mobx-react-lite"
// import { Camera as VisionCamera, useCameraDevices, useFrameProcessor, CameraRuntimeError } from "react-native-vision-camera"

// import * as camera from "../../utils/camera"
// import { ModalLoader } from "../modal-loader/modal-loader"
// const CONTAINER: ViewStyle = {
//   justifyContent: "center",
// }


// export interface CameraProps {
//   /**
//    * An optional style override useful for padding & margin.
//    */
//   style?: StyleProp<ViewStyle>
// }

// /**
//  * Describe your component here
//  */
// export const Camera = observer(function Camera(props: CameraProps) {
//   const { style } = props
//   const styles = Object.assign({}, CONTAINER, style)
//   const devices = useCameraDevices("wide-angle-camera")
//   const device = devices.back
//   console.log(device)
//   camera.requestCameraPermission()
//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet'
//     console.log("Bộ nhận diện:", frame)
//   }, [])
//   const onError = useCallback((error: CameraRuntimeError) => {
//     console.error("Camera gặp lỗi:",error);
//   }, []);
//   return (
//     <View style={styles}>
//       {device ? (
//         <VisionCamera 
//         // {...cameraProps}
//         style={StyleSheet.absoluteFill}
//         device={device}
//         isActive={true}
//         // preset="medium"
//         photo={true}
//         // frameProcessor={frameProcessor}
//         onError={onError}/>
//       ):
//       <ModalLoader loading={true}/>}
//     </View>
//   )
// })
