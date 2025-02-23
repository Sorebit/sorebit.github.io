Title: Misun Theme
Slug: misun
Date: 2019-12-03
Modified: 2019-12-05
Footer: Lorem, 2019
Summary: Pelican theme playground with typography show-off.
Category: articles
Status: published


Lorem ipsum dolor sit amet, *consectetur* adipiscing elit. Nulla nibh eros, accumsan ac
tempus et, efficitur nec magna. Maecenas ut fringilla lectus. Nam tempor [vitae augue][life] sit
amet scelerisque. Aenean facilisis ante dolor, id pharetra nisl varius nec. Nunc a eleifend
nibh. Morbi a felis in dui bibendum **consectetur**. Donec id ipsum tincidunt, congue sem et,
pulvinar ligula. Suspendisse feugiat lobortis nunc. Aenean iaculis porta varius. Aenean
congue, ligula a iaculis auctor, odio lectus porttitor purus, ac efficitur lectus orci ut
metus. Donec dignissim non tortor sit amet mattis. 

## A section of an article `h2` *italic* **bold** <small>small</small>

A paragraph of text. Quisque iaculis arcu a justo ornare, sit
amet fermentum ante pellentesque. Nunc est orci, aliquet non tempus vitae, tincidunt vitae
purus. Ut condimentum diam mauris, id luctus odio semper fringilla. Aenean iaculis elementum
neque, et scelerisque erat ullamcorper sed.


> Incredible, latin, marvelous and all those other things a quote could say. Which is very much
> a good thing. The one reason behind this is **multi-lineness**. By all known laws of aviation
> and typography, a **multi-line** paragraph is intentionally designed to span multiple lines.
>
> <cite>Author, or book</cite>

### This is a sub-section `h3` *italic* **bold** <small>small</small>

Honestly, at no point have I needed more than `h3` to structure notes. The following line is an
`<hr>` ([The Thematic Break (Horizontal Rule) element][horiz]). It spans one third of the content
width.

---

## Well, what about *lists*?

- All lists have their top margin removed
- And their bottom margin normalized
    - Nested lists have no bottom margin
    - This way they have a more even appearance
        - Yeah, third level
- Particularly when followed by more list items
- The left padding has also been reset

### What about *ordered lists*?

1. That's
    1. That is
    1. Even
1. Easier

Donec dignissim ullamcorper nibh, eu dignissim ante congue in. Donec viverra et tortor
sit amet volutpat. Mauris luctus hendrerit `nisl eget` ultricies. Maecenas condimentum non mi
eu tincidunt. Aliquam ante nulla, ultrices a eleifend vel, condimentum eu turpis. Ut aliquet
dolor in congue malesuada. Vestibulum facilisis, sem id sodales aliquet, nisl metus ornare
nisl, nec tincidunt quam arcu sit amet quam. Donec scelerisque, nibh a hendrerit pretium,
orci elit rutrum massa, eget tempus orci justo et massa. Sed non molestie nunc. Sed quis
gravida odio. Maecenas dapibus sapien mauris, a cursus metus tempor et. Vivamus est sem,
faucibus eu libero nec, pharetra laoreet ex.

---

## The next paragraph contains an image
<!-- Courtesy of some 4chan Anon -->
![bike]({static}/images/bike.jpg "A bike on tooltip")

Proin a imperdiet elit, vitae pharetra eros. Nullam id enim pharetra, imperdiet enim et,
suscipit est. Vivamus posuere nisl vel lacus scelerisque, at posuere lacus tincidunt.
Quisque vulputate eget turpis sit amet viverra. Ut egestas, libero vel tincidunt tincidunt,
massa quam volutpat arcu, eget iaculis tortor lacus eget enim. Curabitur viverra sapien ut
efficitur efficitur. Etiam quis ante gravida, viverra magna sed, gravida tortor. Morbi
accumsan justo justo, sit amet congue sapien sagittis ut. Quisque a auctor enim. Etiam
sollicitudin libero a laoreet elementum.

### To keep things simple, there is no syntax highlighting

```
"""
The following line is 100 characters long.
0000000000111111111122222222223333333333444444444455555555556666666666777777777788888888889999999999
"""

import apackage


class ShowOff:
    def __init__(self):
        self.show = "off"

    def namely(self, inline="code"):
        return "Work in progress"
```


[life]: https://www.youtube.com/watch?v=l0U7SxXHkPY
[horiz]: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr
