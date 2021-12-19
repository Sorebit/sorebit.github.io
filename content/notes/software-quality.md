Title: Software quality
Slug: software-quality
Date: 2021-09-22
Status: draft
Garden_status: seedling

## Tenets of Object-oriented Programming
- **Encapsulation** - Managed access to hidden data.
- **Abstraction** - Simple interfaces to complex objects.
- **Inheritance** - Relating the general to the specific.
- **Polymorphism** - A single interface for different types.
	- [Polymorphism in Python](https://www.programiz.com/python-programming/polymorphism)

paei100 XD

## Design Patterns

Design Patterns

### Facade
- https://refactoring.guru/design-patterns/facade/python/example

Z tego co rozumiem w skrócie, reduces complexity. Dostarcza interfejs, który upraszcza to czego sam używa. Np sam używa 3 subsystemów, a eksponuje tylko np api typu "zrób wszystko"

Analogia do rzeczywistości
- dzwonienie do firmy przez teleasystenta i mówienie mu czego się oczekuje, a on zna wnętrzności firmy i tam sobie z nimi gada

Uwaga, żeby się nie stała "god object"
- https://en.wikipedia.org/wiki/God_object



## SOLID

- **Single responsibility principle**
	- Klasa powinna mieć tylko jedną odpowiedzialność (nigdy nie powinien istnieć więcej niż jeden powód do modyfikacji klasy).
- **Open/closed principle**
	- Klasy (encje) powinny być otwarte na rozszerzenia i zamknięte na modyfikacje.
- **Liskov substitution principle**
	- Funkcje które używają wskaźników lub referencji do klas bazowych, muszą być w stanie używać również obiektów klas dziedziczących po klasach bazowych, bez dokładnej znajomości tych obiektów.
- **Interface segregation principle**
	- Wiele dedykowanych interfejsów jest lepsze niż jeden ogólny.
- **Dependency inversion principle**
	- Wysokopoziomowe moduły nie powinny zależeć od modułów niskopoziomowych - zależności między nimi powinny wynikać z abstrakcji.

---

Further reading:
- https://martinfowler.com/bliki/TechnicalDebt.html