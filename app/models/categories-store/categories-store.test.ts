import { CategoriesStoreModel } from "./categories-store"

test("can be created", () => {
  const instance = CategoriesStoreModel.create({})

  expect(instance).toBeTruthy()
})
