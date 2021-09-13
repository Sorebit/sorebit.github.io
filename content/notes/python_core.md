Title: Python Core
Slug: python-core
Date: 2021-08-25
Status: published
Garden_status: budding

These are mostly random notes taken during Pluralsight's *Python Core* course.
It's probably hard to read because of no narrative.

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

> Explicit is better than implicit (EIBTI)

- `__init__.py` - turns a module into a **package**
    - optional since 3.3+ but **EIBTI**
- `os.path.splitext(filename)` -> `('.../name', '.py')`
- `dict.get(key, fallback_value)`

### 2.1 Relative vs absolute imports

```
demo_reader/
├── compressed/
│   ├── bzipped.py  <- we're here
│   └── gzipped.py
└── util/
    └── writer.py
```

| Relative | Absolute |
|---|---|
| `from . import name` | `from demo_reader.compressed import name` |
| `from .. import name` | `from demo_reader import name` |
| `from ..util import name` | `from demo_reader.util import name` |

Generally, **absolute** imports are preferred.

### 2.2 `__all__ = ['name_1', 'other_name']`

- On *module level* in `__init__.py`.
- Controls what happens on `from module import *`.
- If not specified, *all public names* are imported.
- Cool to know, but `import *` is not preferred.

> Namespace packages ([pep 420][pep_420])

- `directory/__main__.py`
    - added to syspath
    - launched as python directory
- it's possible to launch a *zipped* directory

| `python directory` | `python -m directory` |
|---|---|
| executing a directory | executing a package (`-m` means its a module) |
| `'directory'` added to `sys.path` | `'directory'` treated as package |
| `'directory/__main__.py'` is **not** in the package | `'directory/__main__.py'` is a submodule of package `directory` |

### 2.3 Recommended package layout

```
project_name/
├── README                  <- Project root - NOT the package
├── docs/
├── src/                    <- Package/production code
│   └── package_name/
│       ├── __init__.py
│       ├── ...py
│       └── subpackage/
│           └── __init__.py
├── tests/
│   └── test_code.py
└── setup.py
```

- Usually you don't want tests on production cause they're for development right?

### 2.4 Plugins

- Namespace packages & pkgutil
- `setuptools` entry points
- Recommended distribution format is `wheel`

---

## 3 Functions & functional programming

### 3.1 Callable instances

- `__call__`
- callable

### 3.2 Lamdas

```
sorted(iterable, key)
       --------  ---
  list of names  lambda
```

| def | lambda |
|---|---|
| Statement which **defines** a function & **binds** it to a name. | Expression which **evaluates** to a function. |
| Must have a name | Anonymous |
| `def name(arg1, arg2):` | `lambda arg1, arg2: body` |
| `def name(): body` | `lambda: body` |
| | No `return` statement. |
| **Easy** to access for testing. | **Awkward/impossible to test.** Keep lambdas *simple enough* to be correct by *inspection*. |


### 3.3 Rules for `*args`

- Must come after normal positional arguments
- Only collects positional arguments

### 3.4 Order of arguments

```
def f(arg1, arg2, *args, kwarg1, kwarg2, **kwargs):
      ------------=====  ----------------========
         positional                named
```

### 3.5 Extended call syntax

```
t = (1, 2, 3, 4)
f(*t)
>> f(1, 2, 3, 4)
```

```
def color(red, green, blue, **kwargs):
    ...

k = {'red': 0, 'blue': 102, 'green': 102, 'alpha': 0.5}
color(k)
# Remaining named arguments are still in kwargs
>> color(red = k['red'], ..., kwargs = {'alpha': 0.5})
```

### 3.6 Argument forwarding

```
def trace(f, *args, **kwargs)
    ...
    result = f(*args, **kwargs)
    ...
```

### 3.7 Scoping rules *LEGB*

1. **L**ocal
1. **E**nclosing
1. **G**lobal
1. **B**uilt-in

> **Note:** Local functions are bound on **execution**

> **Note:** Local function usually serve as **coude organization** and **readibility** aid.

### 3.8 Closures

- Records objects from enclosing scopes
- Keeps recorded objects **alive** for use **after** the enclosing scope *is gone*.
- Implemented with the `__closure__` attribute

> **Note:** `nonlocal` uses **first found** scope.

### 3.9 Decorators

- We can decorate with a **class** as long as instances of the class implement `__call__()`.
- Using **instances** as decorators enables controlling a group of functions (ex. tracing)
- `functools.wraps()` fixes metadata loss (ex. docstrings)

### 3.10 Functional-style tools

- `map()` uses lazy evaluation
- `filter()`
- `functools.reduce()`

#### Example

```
a = [a1, a2, a3], ...

def f(x, y, z):
    ...

map(f, a, b, c)  # or, actually, list(map(f, a, b, c)
>> [f(a1, b1, c1), f(a2, b2, c2), ...]
```

---

## 4. Managing Python packages & virtual environments

> **Recap**: Any directory, containing an `__init__.py` file is called a **package**.

- `python -m pip` instead of `pip`
- `pip install` specific version
    - `pip install flask==0.9`
    - `pip install 'Django<2.0'`
- installing a local package with pip (creates a develop install)
    - `pip install -e ./directory`

> **Note:** `tox` - test package against multiple versions of Python.

> **Note:** Try `virtualenvwrapper`.

> **Note:** Anaconda is really popular in data science.

---

## 5. Unit testing

A **unit** is a small piece of code

- a method or a function
- a module or a class
- a small group of related classes

**Shouldn't** use:

- filesystem
- database
- network

**Should** be:

- independent of other tests
- names should reflect test scenarios

### 5.1 Fixtures

- `setUp` - ran before each test case
- `tearDown` - ran after each test case

### 5.2 Three parts of a test (AAA)

- **Arrange** - set up objects to be tested
- **Act** - exercise the unit under test
- **Assert** - make claims about what happened

### 5.3 Test Driven Development

1. Write one test (<span style="color:red">RED</span>)
1. Make it pass (<span style="color:green">GREEN</span>)
1. Refactor (back to 1.)

#### 5.3.1 Code coverage

```
800 lines exec. by tests
------------------------ = 80% code coverage
   1000 lines of code
```


[pep_420]: https://www.python.org/dev/peps/pep-0420/
