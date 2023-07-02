import { ShiftmoreStoreModel } from "./shiftmore-store"

test("can be created", () => {
  const instance = ShiftmoreStoreModel.create({})

  expect(instance).toBeTruthy()
})
