Title: Python Core
Slug: python-core
Date: 2021-08-25
Modified: 2022-09-21
Status: published
Garden_status: budding

These are mostly random notes taken during Pluralsight's *Python Core* course or reading other resources.

It's probably hard to read because of no narrative.

First step, break this down into smaller topic-specific notes.
Second step, turn into **better** notes by
- [[Notatki powinny być atomiczne|keeping them atomic]], żeby uniknąć SZUKANIA wewnątrz notatek, tylko bardziej traktowanie tego jak API [Potrzebny link i analiza tego co napisał Matuschak]
- ???
- Inkrementalnie łączenie ich z innymi notatkami i dopisywanie tego co już wiem, żeby się utrwalało

1.1 [[Python Exceptions]]
1.2 [[Iteration & Iterables]]
1.3 [[Python IO]]
1.4 [[Python Try-Except-Finally]]

---
## 2 Organizing larger programs

- [[Python packages]]
- [[Explicit is better than implicit]]
- [[Managing Python packages & virtual environments]]
- Generally, [[Prefer absolute imports to relative imports|absolute imports are preferred]].

### 2.2 `__all__ = ['name_1', 'other_name']`

- On *module level* in `__init__.py`.
- Controls what happens on `from module import *`.
- If not specified, *all public names* are imported.
- Cool to know, but `import *` is not preferred.

> Namespace packages ([pep 420][https://www.python.org/dev/peps/pep-0420/])

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
- `setuptools` entry points [[Jak stworzyć entry-point dla paczki Pythonowej]]
- Recommended distribution format is `wheel`

---

## 3 Functions & functional programming
### 3.1 Callable instances
- [[Anything implementing dunder call is considered callable]]

### 3.2 Lamdas

```
sorted(iterable, key)
       --------  ---
  list of names  lambda
```

| def                                                              | lambda                                                                                     |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Statement which **defines** a function & **binds** it to a name. | Expression which **evaluates** to a function.                                              |
| Must have a name                                                 | Anonymous                                                                                  |
| `def name(arg1, arg2):`                                          | `lambda arg1, arg2: body`                                                                  |
| `def name(): body`                                               | `lambda: body`                                                                             |
|                                                                  | No `return` statement.                                                                     |
| **Easy** to access for testing.                                  | **Awkward/impossible to test.** [[Keep lambdas simple enough to be correct by inspection]] |

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

> **Note:** [[Local functions are bound on execution]]

> **Note:** [[Use local functions to organize code|Local functions usually serve as code organization and readibility aid]].

### 3.8 [[Closure|Closures]]

- Records objects from enclosing scopes
- Keeps recorded objects **alive** for use **after** the enclosing scope *is gone*.
- Implemented with the `__closure__` attribute

> **Note:** `nonlocal` uses **first found** scope.

3.9 [[Python Decorators]]

### 3.10 Functional-style tools

- `map()` uses lazy evaluation
- `filter()`
- `functools.reduce()`

#### Example

```python
a = [a1, a2, a3], b = ..., c = ...

def f(x, y, z):
    ...

map(f, a, b, c)  # or, actually, list(map(f, a, b, c)
>> [f(a1, b1, c1), f(a2, b2, c2), ...]
```

---

## 5. [[Unit Testing]]

- [[AAA (Test Driven Development)]]
- [[Test Driven Development]]
- [[Python unittest library|unittest]]
- [[pytest]]
- [[doctest]] 

### 5.7 Test doubles

### What is "mutation testing"? #pytanie-bez-odpowiedzi 

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

Classmethod Idiom: *named constructor*
- [[A named constructor is a factory method which returns an instance of a class]]

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
> [[Base classes should have no knowledge of subclasses]].
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
> [[Python Decorators|Decorators]] create a wrapper function object which is then bound to the original function name.
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

> Data classes are best used to represent immutable [[Value Object Pattern|value objects]].
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

## 9 asyncio [[Python AsyncIO]]

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

---

## 10 [[Introspection (Python)|Introspection]]
## 11 [[python-metaclass|Metaclasses]]