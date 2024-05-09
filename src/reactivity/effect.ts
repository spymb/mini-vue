class ReactiveEffect {
  private _fn: any;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
  }
}

let activeEffect;
export const effect = (fn) => {
  const _effect = new ReactiveEffect(fn);
  _effect.run();

  return _effect.run.bind(_effect)
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

  deps.add(activeEffect);
};

export const trigger = (target, key) => {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);
  for (const dep of deps) {
    dep.run();
  }
};
