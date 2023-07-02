import { ShiftChangeStoreModel } from "./shift-change-store"

test("can be created", () => {
  const instance = ShiftChangeStoreModel.create({})

  expect(instance).toBeTruthy()
})
