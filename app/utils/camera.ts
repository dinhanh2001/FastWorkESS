import { launchCamera } from 'react-native-image-picker';
import { PermissionsAndroid } from 'react-native'

export const openCamera = async () => {
  // No permissions request is necessary for launching the image library
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    return await launchCamera({
      mediaType: 'photo',
      maxWidth: 1000,
      maxHeight: 1000,
      includeBase64: true,
    },
    async (res) => {
      if(!res.didCancel){
        const base64 = res.assets[0].base64;
        // console.log(base64)
        return base64
        // console.log(res.assets[0].base64)
      }else if (res.errorCode){
        console.log("Error: ",res.errorMessage)
        return res.errorMessage
      }
      return null
      // console.log(res)
    });
  } else {
    console.log("Camera permission denied");
  }
  // return await launchCamera({
  //   mediaType: 'photo',
  //   maxWidth: 1000,
  //   maxHeight: 1000,
  //   includeBase64: true,
  //   // saveToPhotos: true
  // },
  // async (res) => {
  //   if(!res.didCancel){
  //     const base64 = res.assets[0].base64;
  //     // console.log(base64)
  //     return base64
  //     // console.log(res.assets[0].base64)
  //   }else if (res.errorCode){
  //     console.log("Error: ",res.errorMessage)
  //     return res.errorMessage
  //   }
  //   return null
  //   // console.log(res)
  // });
 }

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
    console.warn("err", err);
  }
};