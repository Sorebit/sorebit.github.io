Title: Python Core
Slug: python-core
Date: 2021-08-25
Modified: 2021-09-22
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

```python
def trace(f, *args, **kwargs)
    # ...
    result = f(*args, **kwargs)
    # ...
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

---

## 6 Classes & Object-Orientation
- https://docs.python.org/3/tutorial/classes.html

### 6.1 Class attributes
```python
class MyClass:

    # Define class attributes in the class block
    my_class_attr = "class attributes go here"
    MY_CONSTANT = "they are often class-specific constants"

    def __init__(self):
        self.my_instance_attr = "instance attrs here"
```

> **Recap:** LEGB - Local, Enclosing, Global, Built-in.

A `class` block does **not** count as an enclosing block, therefore `my_class_attr` is **not** visible in ex. `__init__`. But at **global** scope we have `MyClass`. Since `__init__` doesn't shadow any names, `my_class_attr` is visible from **global** scope as `MyClass.my_class_attr`.

It can also be accessed from any instance of the class but it's **really** not recommended since it drastically reduces readability. (Also only reading works this way.)

To illustrate the problems this poses, consider the following example:
```python
class MyClass:  
    b = 'on class'  
  
	 def __init__(self):  
		self.a = 'on instance'  
		print(self.a)  # >>> on instance  
	 	print(MyClass.b)  # >>> on class  
	 	print(self.b)  # >>> on class # Accesses the class attr
		self.a = 're-bound' # Re-binds existing instance attr
	 	self.b = 'new on instance' # Instance attr hides class attr
	 	print(self.b)  # Accesses instance var via self  
	 	# >>> new on instance
		print(MyClass.a)  # Accesses class attr via object  
	 	# AttributeError: type object 'MyClass' has no attribute 'a'
```

### 6.2 Static Methods
#### 6.2.1 Static Method decorator `@staticmethod` 

```python
class ShippingContainer:  
    next_serial = 1337  
  
 	@staticmethod  
 	def _generate_serial():  
		result = ShippingContainer.next_serial  
		ShippingContainer.next_serial += 1  
 		return result  
  
    def __init__(self, owner_code, contents):  
        self.owner_code = owner_code  
        self.contents = contents  
        self.serial = ShippingContainer._generate_serial()
```

#### 6.2.2 Class Method `@classmethod`

```python
@classmethod
def _generate_serial(cls):
	"""Accepts cls as first argument."""
	result = cls.next_serial  
	cls.next_serial += 1  
	return result
	
	# ...
	# ShippingContainer is passed as cls
	self.serial = ShippingContainer._generate_serial()
```

#### 6.2.3 Idiom: *named constructor*
A factory method which returns an instance of a class.
- Method name allows expressing intent and allows construction with different combinations of args

```python
@classmethod
def create_empty(cls, owner_code):
	"""Creates an instance with empty contents."""
	return cls(owner_code, contents=[])
	
@classmethod
def create_with_items(cls, owner_code, items):
	"""Creates an instance from iterable items."""
	return cls(owner_code, contents=list(items))
```

### 6.3 Choosing between them
- `@classmethod`
	- Requires access to the class object to call other class methods or constructor.
- `@staticmethod`
	- No access needed to either *class* or *instance* objects.
	- Most likely an implementation detail of the class.
	- May be able to be moved outside the class to become a global-scope function in the module.

### 6.4 Static Methods with Inheritance
By calling static method through the *class*, you prevent overrides being invoked at least from the point of view of the base class. Making the design much less flexible and certainly less extensible.

> For **polymorphic dispatch** invoke static methods through `self`.

The following code results in **no polymorphic dispatch**:
```python
class Mono:  
    @staticmethod  
	def _get_code():  
        return "MONO"  
  
 	def __init__(self):  
        self._secret_code = Mono._get_code()  
        print(f"The secret code is {self._secret_code}")
  
  
class Poly(Mono):  
    @staticmethod  
	def _get_code():
        return "POLY"
```
The *expected* behaviour is overriding method from `Mono`. Instead, we see that since the initializer calls `Mono._get_code()` the wrong message gets printed.

```
Mono()
>>> The secret code is MONO
<main.Mono object at 0x7fb1397fbac0>

Poly()
>>> The secret code is MONO
<main.Poly object at 0x7fb1397fbd30>
```

Now when we change `__init__` to call `_get_code()` from `self`, the result is the same as expected.

```python
class Mono:
	# ...
	def __init__(self):  
        self._secret_code = self._get_code()  
        print(f"The secret code is {self._secret_code}")
```

```
Mono()
>>> The secret code is MONO
<main.Mono object at 0x7fda03fbaa90>

Poly()
>>>The secret code is POLY
<main.Poly object at 0x7fda03fba760>
```

### 6.5 Class Methods with Inheritance

> **Avoid circular dependencies:**
> Base classes should have *no knowledge* of subclasses.
>
> To achieve this, use `**kwargs` to thread arguments through named-constructor class-methods to more specialized subclasses.

- It is a good practice when creating derived classes to accept and forward `**kwargs` to its `super()` initializer.

### 6.6 Properties

- `@property` transforms getter methods (ex. `def foo(self)`) so they can be called as if they were attributes (ex. `return self.foo`)
	- can be used to make a *read-only* property (throws `AttributeError` on setting)
	- enables the use of `@foo.setter`
- `@foo.setter` - analogous

```python
class Example:
	@property
	def p(self):
		return self._p
	
	@p.setter
	def p(self, value):
		self._p = value
```

> **Self encapsulation**
> Technique where even uses of attr internally by the class use getters and setters rather than attributes.
> Powerful for establishing and maintaining *class invariance*.

> **Weak Encapsulation**
> Too many properties can lead to *excessive coupling.*

> **Tell! Don't ask.**
> Tell other objects what to do instead of asking them their state and responding to it.

### 6.7 Properties and Inheritance
- To override a *property getter*, redefine it in a *derived class*, delegating to the base class via `super()` if we need to.

Overriding *property getters* is a bit more complicated.
We can use a trick like:
```python
# A (base) <- B <- C
# A and B implement a setter and getter for foo
class B(A):
	MAX_FOO = 10
	
	@foo.setter
	def foo(self, value):
		if value > B.MAX_FOO:
			raise ValueError("Too much!")
		self._foo = value

class C(B):
	MIN_FOO = -20
	
	@B.foo.setter
	def foo(self, value):
		if value < C.MIN_FOO:
			raise ValueError("Too little!")
		# super().foo = value wont work
		B.foo.fset(self, value)
```
 
 Though it's messy it does work and can be useful when there is no possibility to modify the base class.
 
 #### 6.7.1 Using Template Method
 
> "All problems in computer science can be solved by another level of indirection
> ... except for the problem of too many levels of indirection."
> <cite>David Wheeler</cite>
 
 Template Method is a [[design-pattern]].
 
 Don't override properties *directly*. Delegate to regular methods and override those instead.
 
 ```python
class A:
    def __init__(self, foo):
        self.foo = foo

    @property
 	def foo(self):
        return self._foo

    @foo.setter
	def foo(self, value):
        self._set_foo(value)

    def _set_foo(self, value):
        self._foo = value

class B(A):
    MAX_FOO = 10
 	def _set_foo(self, value):
        if value > B.MAX_FOO:
            raise ValueError("Too much!")
        self._foo = value

class C(B):
    MIN_FOO = -20
 	def _set_foo(self, value):
        if value < C.MIN_FOO:
            raise ValueError("Too little!")
        super()._set_foo(value)  # super-class handles its own validation
 ```
 
 ## 7 String Representation of Objects
 
 TODO
 
 ## 8 Multiple Inheritance
 
>  **Type inspection**
>  - `isinstance()` can be used for type checking
>      - `isinstance(3, int) -> True`
>      - `isinstance(3, (int, bytes)) -> True` - instance of any?
>  - Some people consider type checking a sign of poor design
>  - However, sometimes they're the easiest way to solve a problem.
> - `issubclass()`
 
 ```python
 class SubClass(Base1, Base2, Base3):
 	...
```

- `SubClass.__bases__` -> `(<class 'Base1'>, <class 'Base2'>)`
- Classes inherit all methods from all of their bases
- If there's no method name overlap, names resolve to the obvious method
- In the case of overlap, *method resolution order* is used

### 8.1 Base class initialization

If a class uses multiple inheritance and defines no initializer, only the initializer of the first base class is automatically called.

### 8.2 Method Resolution Order (MRO)

- MRO is an *ordering* of a class' *inheritance graph* that Python calculates.
- When a method gets called, the* ingeritance graph* is traversed using MRO. The **first** class that implements called method is used.
- To calculate MRO, the **C3** algorithm is used. It ensures that
	- Subclasses come before base classes
	- Base class order from class definition is preserved
	- The first two qualities are preserved for all MROs in a program

**Example:**

```python
class A:  
    def f(self):  
        return 'A.f'  
  
class B(A):  
    def f(self):  
        return 'B.f'  
  
class C(A):  
    def f(self):  
        return 'C.f'  
  
class D(B, C):  
    pass  
```

- `D.__mro__` -> `(D, B, C, A, object)`
	- `D` doesn't implement `f`
	- `B` does implement `f`.
	- End.
- Therefore,  `B.f` gets called.

 ### 8.3 `super()`
