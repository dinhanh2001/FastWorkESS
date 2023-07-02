import { TimesheetStoreModel } from "./timesheet-store"

test("can be created", () => {
  const instance = TimesheetStoreModel.create({})

  expect(instance).toBeTruthy()
})
