import { LeaveStoreModel } from "./leave-store"

test("can be created", () => {
  const instance = LeaveStoreModel.create({})

  expect(instance).toBeTruthy()
})
