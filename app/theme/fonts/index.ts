 import * as Font from "expo-font"

export const initFonts = async () => {
  // Refer to ./assets/fonts/custom-fonts.md for instructions.
  // ...
  // Welcome back! Just uncomment this and replace/append with your font file names!
  // ⬇
  await Font.loadAsync({
    //Montserrat: require("./Montserrat-Regular.ttf"),
   // "Montserrat-Regular": require("./Montserrat-Regular.ttf"),
    "OpenSans-Italic":require('../../../assets/fonts/OpenSans-Italic.ttf'),
    "OpenSans-Regular":require('../../../assets/fonts/OpenSans-Regular.ttf'),
    "OpenSans-Bold":require('../../../assets/fonts/OpenSans-Bold.ttf'),
    "OpenSans-Medium":require('../../../assets/fonts/OpenSans-Medium.ttf'),
  })
}
