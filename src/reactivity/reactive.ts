import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export const reactive = (raw) => {
  return createReactiveObj(raw, mutableHandlers);
};

export const isReactive = (value) => {
  return !!value[ReactiveFlags.IS_REACTIVE];
};

export const readonly = (raw) => {
  return createReactiveObj(raw, readonlyHandlers);
};

export const isReadonly = (value) => {
  return !!value[ReactiveFlags.IS_READONLY];
};

const createReactiveObj = (raw, baseHandlers) => {
  return new Proxy(raw, baseHandlers);
};
