import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const reactive = (raw) => {
  return createReactiveObj(raw, mutableHandlers);
};

export const readonly = (raw) => {
  return createReactiveObj(raw, readonlyHandlers);
};

const createReactiveObj = (raw, baseHandlers) => {
  return new Proxy(raw, baseHandlers);
};
