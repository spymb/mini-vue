import { effect } from "../effect";
import { reactive } from "../reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    });

    expect(nextAge).toBe(11);

    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    // effect(fn) -> 函数runner -> fn -> res

    let n = 10;
    const runner = effect(() => {
      n++;
      return "res";
    });
    expect(n).toBe(11);

    const res = runner();
    expect(n).toBe(12);
    expect(res).toBe("res");
  });

  it("scheduler", () => {
    // 1. 通过 effect 的第二个参数给定一个 scheduler 的 fn
    // 2. effect 第一次执行的时候，会执行 fn
    // 3. 当响应式对象 set 的时候，不会执行 fn 而是执行 scheduler
    // 4. 执行 runner 的时候会执行 fn
    let dummy;
    let run;

    const obj = reactive({ foo: 1 });
    const scheduler = jest.fn(() => {
      run = runner;
    });

    const runner = effect(
      () => {
        dummy = obj.foo;
      },
      { scheduler }
    );

    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);

    obj.foo++;
    expect(scheduler).toHaveBeenCalledTimes(1);
    expect(dummy).toBe(1);

    run()
    expect(dummy).toBe(2)
  });
});
