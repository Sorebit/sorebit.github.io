Title: Bible Verse Scraper
Slug: bible-scraper
Date: 2025-01-14
Modified: 2025-01-21
Status: published
Summary: Substitute big ideas for dumb ideas.

A couple months ago, when joking around with a friend over a beer, one of us misquoted the Bible by saying *"Ale powiedz tylko «spoko», a będzie uzdrowiona dusza moja"* (approx. *"But only say «aight cool» and my soul shall be healed"*). Suddenly, a startling idea came to my mind. **What if we substituted every instance of the word *word* in the Bible with the word *aight*?** Believe me, it made huge sense in that moment.

A couple days ago I found the voice memo we recorded that night. Naturally, I rushed to find a plaintext Polish Bible to perform the experiment on. And to my surprise, I couldn't find any. 

Along the way I realized it would be cool, if I could easily tell **which verse** was used to form the new sentences. Fortunately, I found plenty of pages which hosted versions of The Bible suited towards interactive reading. The only reasonable choice I was left with was to **scrape** one of those and I'd be set.

## First source

The first site that grabbed my attention was [biblia.pl](https://biblia.pl). It looked pretty static, with single pages corresponding to single chapters.
I scaffolded a Scrapy project, parsed the links to all books from the main page, then parsed the links to all chapters from the book pages, and then saw the HTML for the chapters... 

![deon-chapter]({static}/images/bible-scraper/deon-chapter.png)

The content's structre was very very awkward. Text was not placed within inline elements but instead **scattered as text nodes between tags.** At that point I was only familiar with using `parcel`'s CSS selectors to extract data. But this was a task too difficult for such tool. It finally became my time to **learn XPath.**

I found these texts particurarly helpful:

- <http://www.zvon.org/comp/r/tut-XPath_1.html>
- <https://serpapi.com/blog/xpath-selector-cheat-sheet-practical-examples-included/>
- <https://scrapfly.io/blog/parsing-html-with-xpath/>
- [Functions - XPath | MDN](https://developer.mozilla.org/en-US/docs/Web/XPath/Functions)

I chose to concatenate verses from many nodes by matching the only constant in that whole mess: `<span class="werset">...</span>`.
I learned about a very helpful command - `node()` - which matches everything that a `*` wildcard does but also **text nodes**. The final selector looked like this:

```python
verses_raw = response.xpath(
    '//div[contains(@class, "tresc")]/node()[not(self::sup or self::a or self::br or self::div)]'
).getall()
```

Each `span.werset` marks the beginning of a verse and also includes the number of the verse (with random whitespace).

```python
opening, closing = '<span class="werset">', '</span>'
verse_num, buf = None, ''
for e in verses_raw:
    if e.startswith(opening):
        yield self._verse(response.url, book, chapter, verse_num, buf)
        verse_num = e.replace(opening, '').replace(closing, '').strip()
        buf = ''
    else:
        buf += e
```

Having completed the method to parse chapters, I ran the crawl and exported to csv. But when I looked into the output I was horrified even further...

```html
<a name="W5"></a>
<span class="werset">5&nbsp;</span>
Zadajcie więc śmierć temu, co jest przyziemne w <waszych> członkach: rozpuście, nieczystości, ...
<a name="W6"></a>
<span class="werset">6&nbsp;</span>
Z powodu nich nadchodzi gniew...
```

Apparently, some artistic choices were made which resulted in questionable HTML. When parsed, everything after `<waszych>` was considered a level deeper and **would not match the selector.** As a side effect the word would not be rendered, which I guess changed with HTML specs changing. After all, the site was started in 2003...

![waszych]({static}/images/bible-scraper/waszych.png)

**This wasn't an isolated case.** Unclosed attribute quotes, missing opening tags and so on quickly lead me to give another site a chance.

## Second (final) source

The second source which I went with was [biblia-online.pl](https://biblia-online.pl). I quickly realized it hosts **9 Polish translations** as old as from 1500's and a couple translations to other languages. The website, as thankfully opposed to the first one is so well structured, that scraping any translation is a matter of changing the starting URL. Also, it was such a relief to see that I can again use a CSS selector for the verse text 😌

```python
def parse_chapter(self, response):
    book = response.xpath('//select[@id="rnav-book"]/optgroup/option[@selected]/text()').get()
    chapter = response.xpath('//input[@id="rnav-chapter"]/@value').get()
    verse_containers = response.css('.vtbl-row.vr')
    for el in verse_containers:
        verse_num = el.css('.vtbl-num::attr(n)').get()
        text_content = el.css('.vtbl-txt::text').get()
        yield self._verse(response.url, book, chapter, verse_num, text_content)

    next_chapter = response.xpath('//a[contains(@title, "Następny rozdział")]/@href').get()
    if next_chapter:
        yield response.follow(next_chapter, callback=self.parse_chapter)
```

The cool thing was I didn't need to create any new code for handling resulting Items. I hope to understand more design choices of Scrapy in further endeavors. Source for spiders and substitution queries [can be found on GitHub](https://github.com/Sorebit/bible-scraper).

## Highlights

The results were a bit disappointing. I realized I'll have to come up with more substitution rules to amuse myself and maybe not share all of it on a public outlet.

With that said, here's some highlights of what came out of applying the initial rules.


**[1 Księga Kronik 5](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Kronik/5/1), 21**
Uprowadzili zaś z ich stad: pięćdziesiąt tysięcy wielbłądów, dwieście pięćdziesiąt tysięcy owiec, dwa tysiące o==spoko== (słów) i sto tysięcy ludzi.

**[1 Księga Kronik 10](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Kronik/10/1), 13**
Saul umarł na skutek własnego przewinienia, które popełnił wobec Pana, przeciw ==spoko== (słowu) Pańskiemu, którego nie strzegł. Zasięgał on nawet rady u wróżbiarki,

**[1 Księga Kronik 17](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Kronik/17/1), 23**
Teraz więc, o Panie, niech trwa na wieki ==spoko== (słowo), któreś wyrzekł o słudze swoim i o domu jego, i uczyń, jak powiedziałeś,


**[1 Księga Kronik 21](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Kronik/21/1), 19**
Dawid więc poszedł na ==spoko== (słowo) Gada, który przemawiał w imieniu Pana.


**[1 Księga Królewska 1](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Krolewska/1/1), 14**
Kiedy zaś jeszcze będziesz tam mówić z królem, ja za tobą wejdę i ==spoko== (słowa) twoje uzupełnię.


**[1 Księga Królewska 5](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Krolewska/5/1), 16**
Wtedy Salomon przesłał Hiramowi takie ==spoko== (słowa):

**[1 Księga Królewska 5](http://biblia-online.pl/Biblia/Tysiaclecia/1-Ksiega-Krolewska/5/1), 21**
Gdy Hiram usłyszał ==spoko== (słowa) Salomona, ucieszył się bardzo i rzekł: Niech będzie dziś błogosławiony Pan, który Dawidowi dał mądrego syna, [by władał] tym wielkim ludem.



**[Księga Przysłów 19](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Przyslow/19/1), 27**
Zaprzestań, synu słuchać pouczeń, a zbłądzisz bez ==spoko== (słów) rozsądku.

**[Księga Przysłów 30](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Przyslow/30/1), 6**
Do ==spoko== (słów) Jego nic nie dodawaj, by cię nie skarał: nie uznał za kłamcę.

**[Księga Przysłów 31](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Przyslow/31/1), 1**
==spoko== (słowa) Lemuela, króla Massa, których nauczyła go matka.

**[Księga Psalmów 5](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/5/1), 2**
Usłysz, Panie, moje ==spoko== (słowa), zwróć na mój jęk uwagę;

**[Księga Psalmów 12](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/12/1), 7**
==spoko== (słowa) Pańskie to ==spoko== (słowa) szczere, wypróbowane srebro, bez domieszki ziemi, siedmiokroć czyszczone.

**[Księga Psalmów 17](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/17/1), 4**
ludzkim obyczajem; według ==spoko== (słów) Twoich warg wystrzegałem się ścieżek gwałtu.

**[Księga Psalmów 17](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/17/1), 6**
Wzywam Cię, bo Ty mnie wysłuchasz, o Boże! Nakłoń ku mnie Twe ucho, usłysz moje ==spoko== (słowo).

**[Księga Psalmów 19](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/19/1), 4**
Nie jest to ==spoko== (słowo), nie są to mowy, których by dźwięku nie usłyszano;

**[Księga Psalmów 22](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/22/1), 2**
Boże mój, Boże mój, czemuś mnie opuścił? Daleko od mego Wybawcy ==spoko== (słowa) mego jęku.

**[Księga Psalmów 33](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/33/1), 4**
Bo ==spoko== (słowo) Pana jest prawe, a każde Jego dzieło niezawodne.

**[Księga Psalmów 33](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/33/1), 6**
Przez ==spoko== (słowo) Pana powstały niebiosa i wszystkie ich zastępy przez tchnienie ust Jego.

**[Księga Psalmów 56](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/56/1), 11**
W Bogu uwielbiam Jego ==spoko== (słowo), wielbię ==spoko== (słowo) Pana.

**[Księga Psalmów 91](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/91/1), 3**
Bo On sam cię wyzwoli z sideł myśliwego i od zgubnego ==spoko== (słowa).

**[Księga Psalmów 119](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/119/1), 161**
Możni prześladują mnie bez powodu, moje zaś serce odczuwa lęk przed Twoimi ==rymami== (słowami).

**[Księga Psalmów 147](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/147/1), 15**
Na ziemię zsyła swoje orędzie, mknie chyżo Jego ==gówno== (słowo).

**[Księga Psalmów 147](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Psalmow/147/1), 19**
Obwieścił swoje ==gówno== (słowa) Jakubowi, Izraelowi ustawy swe i wyroki.



**[Księga Rodzaju 4](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/4/1), 23**
Lamek rzekł do swych żon, Ady i Silli: Słuchajcie, co wam powiem, żony Lameka. Nastawcie ucha na moje ==gówno== (słowa): Gotów jestem zabić człowieka dorosłego, jeśli on mnie zrani, i dziecko - jeśli mi zrobi siniec!

**[Księga Rodzaju 11](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/11/1), 1**
Mieszkańcy całej ziemi mieli jedną mowę, czyli jednakowe ==spoko== (słowa).

**[Księga Rodzaju 17](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/17/1), 22**
Wypowiedziawszy te ==spoko== (słowa), Bóg oddalił się od Abrahama.

**[Księga Rodzaju 34](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/34/1), 18**
Chamorowi i Sychemowi, jego synowi, podobały się te ==rymy== (słowa).

**[Księga Rodzaju 41](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/41/1), 37**
==rymy== (słowa) te podobały się faraonowi i wszystkim jego dworzanom.

**[Księga Rodzaju 44](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/44/1), 18**
Juda podszedłszy do niego, rzekł: Pozwól, panie mój, aby twój sługa powiedział ==spoko== (słowo) wobec ciebie. I nie gniewaj się na twego sługę, wszakżeś ty jak faraon!

**[Księga Rodzaju 44](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/44/1), 24**
Gdy więc przyszliśmy do twego sługi, ojca naszego, powtórzyliśmy mu twe ==spoko== (słowa), panie.

**[Księga Rodzaju 45](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Rodzaju/45/1), 23**
Swemu ojcu zaś posłał dziesięć o==spoko== (słów), objuczonych najlepszymi płodami Egiptu, oraz dziesięć oślic objuczonych zbożem, chlebem i żywnością, aby miał na drogę.



**[Księga Sędziów 2](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Sedziow/2/1), 4**
Kiedy Anioł Pana wyrzekł te ==spoko== (słowa) do wszystkich Izraelitów, lud podniósł lament i zaniósł się płaczem.

**[Księga Sędziów 3](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Sedziow/3/1), 20**
Ehud podszedł do niego. Król przebywał w letniej górnej komnacie, której używał dla siebie. Mam dla ciebie, królu, ==spoko== (słowo) od Boga! - rzekł do niego Ehud, na co ten podniósł się ze swego tronu.

**[Księga Sędziów 18](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Sedziow/18/1), 20**
Uradowało się na te ==spoko== (słowa) serce kapłana. Wziąwszy więc efod, terafim, rzeźbiony posążek ⟨i posążek ulany z metalu⟩, przyłączył się do oddziału.


**[Księga Tobiasza 3](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Tobiasza/3/1), 7**
Tego dnia Sara, córka Raguela z Ekbatany w Medii, również usłyszała ==spoko== (słowa) obelgi od jednej ze służących swojego ojca,

**[Księga Tobiasza 8](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Tobiasza/8/1), 2**
Wtedy przypomniał sobie Tobiasz ==spoko== (słowa) Rafała, wyjął wątrobę i serce ryby z torby, w której je przechowywał, i położył na rozżarzonych węglach do kadzenia.

**[Księga Wyjścia 3](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Wyjscia/3/1), 18**
Oni tych ==rymów== (słów) usłuchają. I pójdziesz razem ze starszymi z Izraela do króla egipskiego i powiecie mu: Pan, Bóg Hebrajczyków, nam się objawił. Pozwól nam odbyć drogę trzech dni przez pustynię, abyśmy złożyli ofiary Panu, Bogu naszemu.

**[Księga Wyjścia 19](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Wyjscia/19/1), 6**
Lecz wy będziecie Mi królestwem kapłanów i ludem świętym. Takie to ==spoko== (słowa) powiedz Izraelitom.

**[Księga Wyjścia 33](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Wyjscia/33/1), 4**
A lud słysząc te twarde ==gówno== (słowa), przywdział żałobę i nie włożył ozdób swych na siebie.

**[Księga Wyjścia 34](http://biblia-online.pl/Biblia/Tysiaclecia/Ksiega-Wyjscia/34/1), 1**
Pan rzekł do Mojżesza: Wyciosaj sobie dwie tablice z kamienia podobne do pierwszych, a na tych tablicach wypisz znów ==spoko== (słowa), ...



**[List do Efezjan 1](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Efezjan/1/1), 13**
W Nim także i wy usłyszawszy ==spoko== (słowo) prawdy, Dobrą Nowinę waszego zbawienia, w Nim również uwierzyliście i zostaliście naznaczeni pieczęcią Ducha Świętego, który był obiecany.


**[List do Efezjan 5](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Efezjan/5/1), 26**
aby go uświęcić, oczyściwszy obmyciem wodą, któremu towarzyszy ==spoko== (słowo),

**[List do Efezjan 6](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Efezjan/6/1), 19**
i za mnie, aby dane mi było ==spoko== (słowo), gdy usta moje otworzę, dla jawnego i swobodnego głoszenia tajemnicy Ewangelii,

**[List do Filipian 1](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Filipian/1/1), 14**
I tak więcej braci, ośmielonych w Panu moimi kajdanami, odważą się bardziej bez lęku głosić ==spoko== (słowo) Boże.


**[List do Hebrajczyków 12](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Hebrajczykow/12/1), 19**
ani też do grzmiących trąb i do takiego dźwięku ==spoko== (słów), iż wszyscy, którzy go słyszeli, prosili, aby do nich nie mówił

**[List do Rzymian 9](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Rzymian/9/1), 9**
Albowiem to jest ==spoko== (słowo) obietnicy: Przyjdę o tym samym czasie, a Sara będzie miała syna.

**[List do Rzymian 10](http://biblia-online.pl/Biblia/Tysiaclecia/List-do-Rzymian/10/1), 8**
Ale cóż mówi: ==spoko== (słowo) to jest blisko ciebie, na twoich ustach i w sercu twoim. Ale jest to ==spoko== (słowo) wiary, którą głosimy.


**[List św. Judy 1](http://biblia-online.pl/Biblia/Tysiaclecia/List-Judy/1/1), 15**
aby dokonać sądu nad wszystkimi i ukarać wszystkich bezbożników za wszystkie bezbożne uczynki, przez które okazywała się ich bezbożność, i za wszystkie twarde ==gówno== (słowa), które wypowiadali przeciwko Niemu grzesznicy bezbożni.
