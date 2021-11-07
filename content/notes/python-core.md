Title: Python Core
Slug: python-core
Date: 2021-08-25
Modified: 2021-09-22
Status: published
Garden_status: budding

These are mostly random notes taken during Pluralsight's *Python Core* course or reading other resources.

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

[pep_420]: https://www.python.org/dev/peps/pep-0420/

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

```python
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

> **Note:** Local function usually serve as **code organization** and **readibility** aid.

### 3.8 Closures

- Records objects from enclosing scopes
- Keeps recorded objects **alive** for use **after** the enclosing scope *is gone*.
- Implemented with the `__closure__` attribute

> **Note:** `nonlocal` uses **first found** scope.

### 3.9 Decorators

- We can decorate with a **class** as long as instances of the class implement `__call__()`.
- Using **instances** as decorators enables controlling a group of functions (ex. tracing)
- `functools.wraps()` fixes metadata loss (ex. docstrings)

#### Class instance as decorator

```python
class Trace:  
    def __init__(self):  
        self.enabled = True  
 	def __call__(self, f):  
        def wrap(*args, **kwargs):  
            if self.enabled:  
                print(f'Calling {f}')  
            return f(*args, **kwargs)  
        return wrap
```

```python
tracer = Trace()

@tracer
def rotate_list(l):
	return l[1:] + l[l[0]]
```

```python
>>> l = [1, 2, 3]  
>>> l = rotate_list(l)  
Calling <function rotate_list at 0x7fa1480e4ee0>
>>> l
[2, 3, 1]
```

```python
>>> l = rotate_list(l)
Calling <function rotate_list at 0x7fa1480e4ee0>
>>> l
[3, 1, 2]
```

```python
>>> tracer.enabled = False  
>>> l = rotate_list(l)  
>>> l
[1, 2, 3]
```

#### Preserving metadata

```python
def hello():  
    """Prints a well-known message."""  
 	print("Hello world!")
```

```python
>>> help(hello)
Help on function hello in module __main__:

hello()
    Prints a well-known message.
```

Now, let's define a no-operation decorator.

```python
def noop(f):  
    def noop_wrapper():  
        return f()  
    return noop_wrapper
```

```python
@noop  
def hello():  
	"""Prints a well-known message."""  
	print("Hello world!")
```

```python
>>> help(hello)
Help on function noop_wrapper in module __main__:

noop_wrapper()
```

Suddenly, we lose `.__doc__` and `.__name__`.  
  
Fortunately `functools` provides a `wraps()` decorator to fix this.

```python
import functools  
  
def noop(f):  
    @functools.wraps(f)  
    def noop_wrapper():  
        return f()  
    return noop_wrapper  
  
@noop  
def hello():  
    """Prints a well-known message."""  
 	print("Hello world!")
```

```python
>>> help(hello)
Help on function hello in module __main__:

hello()
	Prints a well-known message.
```

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

|**Should**|**Shouldn't**|
|---|---|
| Be independent of other tests | Use filesystem |
| Names should reflect test scenarios | Use database |
| | Use network |
 
> If you find that the unit of code you want to test has lots of side effects, you might be breaking the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
> Breaking the Single Responsibility Principle means the piece of code is doing too many things and would be better off being refactored.
> Following the Single Responsibility Principle is a great way to design code that it is easy to write repeatable and simple unit tests for, and ultimately, reliable applications.

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

### 5.4 `unittest`

> As you learn more about testing and your application grows, you can consider switching to one of the other test frameworks, like `pytest`, and start to leverage more advanced features.

- Tests **aren't** necessarily ran in the **same order** every time. That's why it's important to make them **independent** from each other.
- If you’re running the same test and passing different values each time and expecting the same result, this is known as **parameterization**.

See also:

- [[test-runner|custom test runner for OI-like programs]]
- [Eli Bendersky - Dynamically generating Python test cases ](https://eli.thegreenplace.net/2014/04/02/dynamically-generating-python-test-cases)

#### 5.4.1 Assertions

```python
def test_raises_something(self):
	with self.assertRaises(ValueError):
		module.method()
```

#### 5.4.2 Fixtures

The data that you create as an input is known as a **fixture**.

```python
# Ran before each test case
def setUp(self):
	self.emp_1 = Employee("John", "Doe")
	self.emp_2 = Employee("Jane", "Smith")
```
- `tearDown` - ran after each test case
- `setUpClass(cls)`, `tearDownClass(cls)`

#### 5.4.3 Mocks

Having your tests fail because the API is offline or there is a connectivity issue could slow down development. In these types of situations, it is best practice to store remote fixtures locally so they can be recalled and sent to the application.

```python
# employee.py

class Employee:
	def monthly_schedule(self, month):
		response = requests.get(f"http://.../{month}")
		if response.ok:
			return response.text
		else:
			return 'Bad response!'

# test_employee.py

from unittest.mock import patch

def test_monthly_schedule(self):
	with patch('employee.requests.get') as mocked_get:
		mocked_get.return_value.ok = True
		mocked_get.return_value.text = 'Success'

		schedule = self.emp_1.monthly_schedule('May')
		mocked_get.assert_called_with("http://.../May")
		self.assertEqual(schedule, 'Success')

		mocked_get.return_value.ok = False
		schedule = self.emp_1.monthly_schedule('June')
		mocked_get.assert_called_with("http://.../June")
		self.assertEqual(schedule, 'Bad response!')

```

### 5.5 `pytest`

Cool features:

- great flexibility
- fixture resources as dependency injections (connected up in runtime)
- `tmpdir` and alike
- lightweight, pythonic assertion syntax
- p nice config file
	- marking tests:  `@pytest.mark.slow`, then `python -m pytest -m "not slow"`
- plugins & other tools

### 5.6 `doctest`

Usecases:

- keeping examples in source code up-to-date
- regression testing
- tutorial documentation for when you're publishing packages

```python
def small_straight(dice):
	"""Score the given roll in the 'small straight' yatzy category.
	
	>>> small_straight([1,2,3,4,5])
	15
	>>> small_straight([1,2,3,5,5])
	0
	"""
	if dice == [1,2,3,4,5]:
		return sum(dice)
	return 0
```

- it has its own test runner though a bit unhelpful
- pycharm has a nice test runner for it
- pytest has a nice test runner for it

#### 5.6.1 Handling varying output

-  `#doctest +ELLIPSIS` lets you use a `...` wildcard
-  seed for randoms
-  doctest can handle tracebacks and errors

### 5.7 Test doubles

---

## 6 Classes & Object-Orientation
- <https://docs.python.org/3/tutorial/classes.html>

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

```python
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

```python
Mono()
>>> The secret code is MONO
<main.Mono object at 0x7fda03fbaa90>

Poly()
>>>The secret code is POLY
<main.Poly object at 0x7fda03fba760>
```

### 6.5 Class Methods with Inheritance

> **Avoid circular dependencies:**
> 
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
> 
> Technique where even uses of attr internally by the class use getters and setters rather than attributes.
> Powerful for establishing and maintaining *class invariance*.

> **Weak Encapsulation**
> 
> Too many properties can lead to *excessive coupling.*

> **Tell! Don't ask.**
> 
> Tell other objects what to do instead of asking them their state and responding to it.

> **Note/trick:** 
> 
 > In property, you can return a `tuple(self._mutable_list)` to prevent it from being modified through a read-only property.
 

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
> 
> <cite>David Wheeler</cite>
 
 Template Method is a [[software-quality#Design Patterns|design pattern]].
 
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
 
### 6.8 Class decorators

> **Recap:**
> 
> Decorators create a wrapper function object which is then bound to the original function name.
>

- A more common idiom is to modify the decorated object **in place** rather than wrap it and return the wrapper.
- Class decorators are applied when the class is first being defined. So when the module is first imported.
- Another common pattern are **Class Decorator Factories** for facilitating patametrization.
- Multiple class decorators can be applied to a single class. Well-designed class decorators compose well in this way.

```python
def auto_repr(cls):  
    members = vars(cls)  
  
    if "__repr__" in members:  
        raise TypeError(f"{cls.__name__} already defines __repr__")  
  
    if "__init__" not in members:  
        raise TypeError(f"{cls.__name__} does not override __init__")  
  
    sig = inspect.signature(cls.__init__)  
    parameter_names = list(sig.parameters)[1:]  
  
    if not all(  
        isinstance(members.get(name, None), property)  
        for name in parameter_names  
    ):  
        raise TypeError(  
		f"Cannot apply auto_repr to {cls.__name__} because not all "
		"__init__ parameters have matching properties" )  
  
    def synthesized_repr(self):  
        return "{typename}({args})".format(  
            typename=typename(self),
			args=", ".join(  
                "{name}={value!r}".format(  
                    name=name,  
 					value=getattr(self, name)  
                ) for name in parameter_names  
            )  
        )  
  
    setattr(cls, "__repr__", synthesized_repr)  
  
    return cls

@auto_repr
class Location:
	def __init__(self, name, position):
		self._name = name
		self._position = position
		
	@property
	def name(self):
		return self._name
```

### 6.9 Data Classes

> Data classes are best used to represent immutable value objects.
>
> - Use immutable attribute types (basic types like ints, floats, strings, etc.)
> - Declare the data-class as frozen (ie. immutable)

```python
@dataclass(eq=True, frozen=True)
class Location:
	name: str
	position: Position
```

- optional arguments for different behaviours, like
	- `eq=True` - enable `__eq__`
	- `repr=True` - enable `__repr__`

> **Note:** Hashing and mutability is complicated.

#### 6.9.1 Preserving class invariance

`__post_init__` is a good place to perform validation on data-class instance construction. Since we *assume immutability* (`frozen=True`) this ensures class invariance.

```python
@dataclass(frozen=True)
class MyDataClass:
	fred: int
	jim: int

	def __post_init__(self):
		if self.fred < 0:
			raise ValueError("How can a fred be less than zero?")
```

If you find yourself wanting to write a setter for a dataclass, **it could be time to promote it to a regular, full class**.

> Keep your data-classes simple.

---

## 7 String Representation of Objects

### 7.1 `repr(obj)` - Representation

- `__repr__(self)`
- by default `'<klass.Klass object at 0x...>'` - not of much use.
- Intended for **developers**. When we evaluate the object alone we get the value of `repr`.
	- `f"{obj=}"` uses `repr`
	
```python
>>> obj
# repr(obj)
```

Conventions for good `__repr__` results:

- Include necessary object state, but be prepared to compromise.
- Format as **constructor invocation** source code.
- As a rule: *always* write a `repr` implementation for classes.

Example:

```python
class Position:
	# ...
	def __repr__(self):
		return f'{typename(self)}(lat={self.lat}, lon={self.lon})'
		
def typename(obj):
	return type(obj).__name__
```

- This assures correct behaviour with **inheritance**
- Produces `Position(lat=19.82, lon=-155.47)`

### 7.2 `str(obj)` - string constructor
- by default `object.__str__` delegates to `__repr__`
-  Intended for **System Consumers** (users, people, in user interfaces, othe systems)
	-  Human readable, aesthetically pleasing 
	-  `"77.5° S, 167.2° E"`
-  used by `print`

```python
class Position
	# ...
	@property
	def lat_hemisphere(self):
		return "N" if self.lat >= 0 else "S"
	
	@property
	def lon_hemisphere(self):
		return "E" if self.lon >= 0 else "W"
	
	def __str__(self):
		return (
			f"{abs(self.lat)}° {self.lat_hemisphere}, "
			f"{abs(self.lon)}° {self.lon_hemisphere}"
		)
```

### 7.3 `format(obj, spec)` - more control
- by default `object.__format__` delegates to `__str__`
- used by f-strings (`"{obj:.2f}"` ), and `"{}".format`

```python
class Position:
	# ...
	def __format__(self, format_spec):
		component_format_spec = ".2f"
		prefix, dot, suffix = format_spec.partition(".")
		if dot:
			num_decimal_places = int(suffix)
			component_format_spec = f".{num_decimal_places}f"
		lat = format(abs(self.lat), component_format_spec)
		lon = format(abs(self.lon), component_format_spec)
		return (
			f"{lat}° {self.lat_hemisphere}, "
			f"{lon}° {self.lon_hemisphere}"
		)
		
	def __str__(self):
		return format(self)
```

---
 
## 8 Multiple Inheritance and MRO
 
 - [Polymorphism in Python](https://www.programiz.com/python-programming/polymorphism)

>  **Type inspection**
>  
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

> Given a **method resolution order** and **a class C in that MRO**, `super()` gives you an object which resolves methods using only the part of the MRO which comes **after** C.
> 
> `super()` works with the MRO of an object, not just its base class.

- Gives you a proxy object which resolves the correct implementation of any requested method
- It has access to the entire inheritance graph

> Kinda complicated. I feel like I still don't quite get it. Probably need some real-world application.

---

## 9 asyncio

#TODO

- <https://realpython.com/async-io-python/#async-io-in-context>
- <https://realpython.com/intro-to-python-threading/#threading-objects>

### threads:
- `threading.Lock` zasób może zostać zablokowany przez jeden wątek i inny nie może wtedy się do tego dostać
- nie trzeba lockować kiedy robi się atomiczne operacje, np tylko przypisuje, a nie że `+=` czy coś
- `lock.locked()`, `lock(True/False)`
- `threading.Semaphore(num_permits)`
	- up to `num_permits` can access the shared resource at a time
	- np jak jest cap na liczbę downloadów naraz
- `threading.Queue`
	- producer/consumer

### asyncio event loop
- in node.js its behind the scenes, in python its explicit
- non-blocking (one thread only)
- `CouroutineObject = CoroutineFunction()`
- `Future(CoroutineObject)`
- right way for awaiting `asyncio.future` is to use `await`
- coroutine chaining

```py
lock = threading.Lock()
lock.acquire()
try:
	# ... access shared resource ...
finally:
	lock.release()

# can be written as
lock = threading.Lock()
with lock:
	# ... access shared resource ...
```

`try-finally`/`with` helps when something breaks and the lock is not released

```python
class Service:
	def __init__(self):
		self.some_lock = threading.Lock()
		self.total_bytes = 0

	def subtask(self, arg):
		# do some work
		with self.some_lock:
			self.total_bytes += b

	def task(self):
		threads = []
		for ... :
			t = threading.Thread(target=self.subtask, args=(a,))
			t.start()
			threads.append(t)

		for t in threads:
			t.join()
```



## 10 Metaclasses

- https://realpython.com/python-metaclasses/

#TODO