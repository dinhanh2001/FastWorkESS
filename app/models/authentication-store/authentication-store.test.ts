import { AuthenticationStoreModel } from "./authentication-store"

test("can be created", () => {
  const instance = AuthenticationStoreModel.create({
     isAuthenticationStore:true
  })

  expect(instance.isAuthenticationStore).toBeTruthy()
})
