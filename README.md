# auto-bind
[![deno](https://img.shields.io/badge/deno-161e2e?style=flat-square&logo=deno)](https://deno.land/x/auto_bind)
[![license](https://img.shields.io/github/license/jgchk/auto-bind?style=flat-square)](https://choosealicense.com/licenses/gpl-3.0/)

automatically bind methods to their class instance :star2::sparkles:

## import

```javascript
import autoBind from "https://deno.land/x/auto_bind/src/mod.ts";
```

## usage

```javascript
import autoBind from "https://deno.land/x/auto_bind/src/mod.ts";

class Foo {
  bar: string;

  constructor(bar: string) {
    this.bar = bar;
    autoBind(this);
  }

  message() {
    return `foo ${this.bar}`;
  }
}

const foo = new Foo("bar");
const message = foo.message;

console.log(message()); // with autoBind -> 'foo bar'
                        // without autoBind -> TypeError: Cannot read property 'bar' of undefined
```

## contributing
- pull requests are welcome!
- for major changes, open an issue first to discuss what you would like to change
- update tests as appropriate
