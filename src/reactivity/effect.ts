import { extend } from "../utils";

class ReactiveEffect {
  private _fn: any;
  public scheduler?: Function;
  onStop?: () => void;
  depsList = [];
  active = true;
  constructor(fn, scheduler) {
    this._fn = fn;
    this.scheduler = scheduler;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }

  stop() {
    if (this.active) {
      cleanEffect(this);
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

let activeEffect;
export const effect = (fn, options: any = {}) => {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  extend(_effect, options)

  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
};

const cleanEffect = (effect) => {
  effect.depsList.forEach((deps) => {
    deps.delete(effect);
  });
};

export const stop = (runner) => {
  runner.effect.stop();
};

const targetMap = new Map();
export const track = (target, key) => {
  // target -> [key -> deps]
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  if (!activeEffect) return

  deps.add(activeEffect);
  activeEffect.depsList.push(deps);
};

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for (const dep of deps) {
    if (dep.scheduler) {
      dep.scheduler();
    } else {
      dep.run();
    }
  }
};
