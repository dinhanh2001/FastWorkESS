import { WorktimeStoreModel } from "./worktime-store"

test("can be created", () => {
  const instance = WorktimeStoreModel.create({})

  expect(instance).toBeTruthy()
})
