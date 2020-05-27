import {
  assertEquals,
  assertStrictEq,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";
import autoBind from "./mod.ts";

class Foo {
  bar: string;
  wow: string;

  constructor() {
    this.bar = "bar";
    this.wow = "wow";
  }

  setBar(val: string) {
    this.bar = val;
  }

  setWow(val: string) {
    this.wow = val;
  }
}

class Setter {
  val: string;

  constructor(val: string) {
    this.val = val;
  }

  use(setter: (val: string) => void) {
    setter(this.val);
  }
}

Deno.test({
  name: "returns self",
  fn() {
    const foo = new Foo();
    assertStrictEq(autoBind(foo), foo);
  },
});

Deno.test({
  name: "binds all methods",
  fn() {
    const foo = autoBind(new Foo());
    const setter = new Setter("set");

    assertEquals(foo.bar, "bar");
    setter.use(foo.setBar);
    assertEquals(foo.bar, "set");

    assertEquals(foo.wow, "wow");
    setter.use(foo.setWow);
    assertEquals(foo.wow, "set");
  },
});

Deno.test({
  name: "binds only included methods",
  fn() {
    const foo = autoBind(new Foo(), { include: ["setBar"] });
    const setter = new Setter("set");

    assertEquals(foo.bar, "bar");
    setter.use(foo.setBar);
    assertEquals(foo.bar, "set");

    assertThrows(
      () => setter.use(foo.setWow),
      TypeError,
      "Cannot set property 'wow' of undefined",
    );
  },
});

Deno.test({
  name: "binds only non-excluded methods",
  fn() {
    const foo = autoBind(new Foo(), { exclude: ["setBar"] });
    const setter = new Setter("set");

    assertThrows(
      () => setter.use(foo.setBar),
      TypeError,
      "Cannot set property 'bar' of undefined",
    );

    assertEquals(foo.wow, "wow");
    setter.use(foo.setWow);
    assertEquals(foo.wow, "set");
  },
});
