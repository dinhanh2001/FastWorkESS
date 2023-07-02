import { MissonStoreModel } from "./misson-store"

test("can be created", () => {
  const instance = MissonStoreModel.create({})

  expect(instance).toBeTruthy()
})
