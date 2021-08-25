Title: Python Core
Slug: python-core
Date: 2021-08-25

## 1.1 Using standard exception types

- `ValueError` - proper type, unacceptable value
    - `raise ValueError("Cannot ... {x}")`
- `IndexError` - ex. out of bounds
- `KeyError` - ex. dict lookup
- `ImportError` - ex. when importing OS-specific things
- Usually avoid catching `TypeError`

### LBYL vs EAFP

- `print(e, file=sys.stderr)`

> "Errors should never pass silently, unless explicitly silenced"

## 1.2 Iteration & iterables

- Comprehensions should be purely functional, i.e. have no side effects
  (eg. printing)
  
### Collections are iterable

```
l = [1, 2, 3, 4]
it = iter(l)
next(it)
>>> 1
next(it)
>>> 2
```

### Generators are iterable

```python
def gen123():
    yield 1
    yield 2
    yield 3

g = gen123()
next(g)
```
```
>>> 1
```

### General notes

- `itertools`
    - `islice`, `count`
    - `chain`
- `list(generator)` - exhaust a generator
- Generator expressions, ex. `(x*x for x in range(1, 10000)`
- `any`, `all`

## 1.3 Classes

```python
from typing import Optional

def f(x: Optional[str] = None):
    if x is not None:
        pass
    else:
        pass
```

## 1.4 I/O

- modes:
    - `w`/`r`/`a` - write/read/append
    - `b`/`t` - bin (`bytes`) / text (`str`)
- write returns codepoints, not bytes
- `f.seek` is rather bad (`bookmark = f.tell()`, `f.seek(bookmark)`)
- `sys.stdout.write` - like `f.write`

```python
try:
    return True
finally:
    print("Going to execute anyway")
```

- `contextlib` - used for context managers (`with`)

---

## 2 Organizing larger programs
