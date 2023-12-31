import { IObservableValue, observable } from "mobx";

export type StatusType = "idle" | "pending" | "done" | "error";

export const withStatus = () => {
  /**
   * The observable backing store for the status field.
   */
  const status: IObservableValue<string> = observable.box("idle");

  return {
    views: {
      get status() {
        return status.get() as StatusType;
      },

      set status(value: StatusType) {
        status.set(value);
      },
    },
    actions: {
      setStatus(value: StatusType) {
        status.set(value);
      },

      resetStatus() {
        status.set("idle");
      },
      getStatus(){
        return status.get();
      }
    },
  };
};