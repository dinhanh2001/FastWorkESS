import { loadString } from "../utils/storage"
import * as Localization from "expo-localization"
import i18n from "i18n-js"
import en from "./en.json"
import ja from "./ja.json"
import vi from "./vi.json"

i18n.fallbacks = true
i18n.translations = { en, ja, vi }
export const language = async () => {
  const languageStorage = await loadString("language")
  // console.log("languageStorage",languageStorage)
  if(languageStorage != null){
    i18n.locale = languageStorage
  }else{
    i18n.locale = Localization.locale || "en"
  }
}
language()
// i18n.locale = "en"
// console.log("languageStorage", languageStorage)
/**
 * Builds up valid keypaths for translations.
 * Update to your default locale of choice if not English.
 */
type DefaultLocale = typeof en
export type TxKeyPath = RecursiveKeyOf<DefaultLocale>

// via: https://stackoverflow.com/a/65333050
type RecursiveKeyOf<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<TObj[TKey], `${TKey}`>
}[keyof TObj & (string | number)]

type RecursiveKeyOfInner<TObj extends object> = {
  [TKey in keyof TObj & (string | number)]: RecursiveKeyOfHandleValue<
    TObj[TKey],
    `['${TKey}']` | `.${TKey}`
  >
}[keyof TObj & (string | number)]

type RecursiveKeyOfHandleValue<TValue, Text extends string> = TValue extends any[]
  ? Text
  : TValue extends object
  ? Text | `${Text}${RecursiveKeyOfInner<TValue>}`
  : Text
