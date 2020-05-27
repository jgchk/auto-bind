export type Self = { [key: string]: any };
export type Pattern = string | RegExp;
export interface AutoBindOptions {
  readonly include?: Pattern[];
  readonly exclude?: Pattern[];
}

function getAllProperties(obj: object) {
  const props = new Set<[object, string]>();

  do {
    for (const key of Reflect.ownKeys(obj)) {
      props.add([obj, String(key)]);
    }
  } while ((obj = Reflect.getPrototypeOf(obj)) && obj !== Object.prototype);

  return props;
}

export default <T extends Self>(self: T, options?: AutoBindOptions): T => {
  const include = options?.include;
  const exclude = options?.exclude;

  function filter(key: string) {
    const match = (pattern: Pattern) =>
      typeof pattern === "string" ? key === pattern : pattern.test(key);
    return (include ? include.some(match) : true) &&
      (exclude ? !exclude.some(match) : true);
  }

  for (const [obj, key] of getAllProperties(self.constructor.prototype)) {
    if (key === "constructor" || !filter(key)) continue;

    const descriptor = Reflect.getOwnPropertyDescriptor(obj, key);
    if (descriptor && typeof descriptor.value === "function") {
      (self as Self)[key] = self[key].bind(self);
    }
  }

  return self;
};
