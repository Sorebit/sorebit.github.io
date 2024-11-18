Title: Public-Intellectual: A Movie Discussions Scrapper
Slug: filmweb-scrapper
Date: 2024-10-19
Status: published
Summary: 16 levels coming to your MIDI controller.


Not unlike many cinema enthusiasts I've built a habit of noting down the names and titles, rating them using my zmyślny rating system. My notebook of choice is <https://filmweb.pl> with its big polish-speaking community. I've also got the habit of reading the forum threads in search of any bright mind with a deeper insignt than mine. But when I actually find some smart bloke I'd like to read more from, there's a roadblock. **You can't just browse any user's comment history**.

> *Technically*, googling `site:filmweb.pl insite:{username}` would yield similiar results. But first of all -- am I really going to click through 50 links? And second of all -- I've been looking for an end goal for a scrapping project.

A strategy came to mind. If someone commented on a movie, let's also assume they have watched it (big if, I know) and rated it. So why not visit the user's page, then go through all the movies they have rated and find their comments in the discussions? Sounds **exactly** like a web scraper's job.

The more users we go through, the more topics will get downloaded. Since some movies are discussed more frequently, there will be more chances to hit a cache. tym więcej będziemy mieli filmów. The potential przecięcie of the sets of movies people watch is big. So it should "speed up" as we go. That is if we can create a **good enough cache**.

This was my first personal scraping project with data of such size. In the past, I've used similiar techniques in [[osir-scrapper]] which cyclically scrapped a single JSON file. There is **a lot** of content on filmweb.pl forums.

## Spider

Sticking with motivation to build fast, I **prioritised a POC over learning the most**. At least untill I have a working tool. This was the main reason to choose [Scrapy]() over building a custom stack with lxml, aiohttp, manually managing UserAgents etc. **In an hour** I had a basic but robust spider that wouldn't blow my focus away with missing features. Scrapy, unsurprisingly, turned out to be **more than powerful enough for my needs** and the project is complex enough to revisit it when I'm happy with the functionality. I think building a robust downloader on top of `asyncio` would be a good exercise to strengthen my understanding of [[Async IO Design Patterns]]. More details about the Scrapy parts are covered in further sections.

### Wstępne założenia upadają po raz pierwszy Assumptions fall for the first time

It quickly turned out you can only see 100 (most recently?) rated movies on someone's page. That is after scrolling to the bottom of the page repeatedly and loading all items with AJAX. Let's call 100 enough for now and note that benchmarks are needed to see what happens to ludzie, którzy nas nie interesują, ale już są w bazie z liczbą komentarzy osób, które już mam podczas scrappowania kolejnych osób. **But how to dynamically load and interact with a page?**


> ![Jakoś pokazać problem może skrinem]()

Well, *don't*. Handling javascript or reverse-engineering the front-end API would significantly change this project's scope. Not aiming for scale, manual action is an acceptable trade-off for simplicity. Load the page as you would do anyway, call a single JS function that saves starting URL's into a txt file. Load up a user-script and pluck a CSS selector into it. Scrapy comes with a neat little way to pass key, value pairs through the CLI. All the command-line arguments can be passed in as keyword args to the spider's `__init__` like so `-a file=/some/path`.

```
def __init__(self, file: str = None, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.start_urls = []

    if not file:
        raise ValueError(f"Expected file argument for spider {self.name}")
    self.load_start_urls(Path(file).expanduser())
```

If you really want to take advantage of JS in your spider, try ...

At this point the comments are pouring into a SQLite database. The dataset however is growing too large to make sense of it without a proper viewer.

### Łączenie kilku stron w jedną

Pewnie trzeba wyczyścić URL-e żeby identyfikować filmy i topici trochę lepiej.

`urllib.parse` jak zawsze przychodzi z pomocą i wywala query z urla, dopisuje netloc itp



## Viewer

> Goal: collapsable tree of comments. Filmweb does not provide this, probably since its easier for most users to just read through the 50 comments and naturally go to the next page. Pages should also be gathered into a single tree. More on that later.

![red]({static}/images/filmweb-scrapper/red.png)

Collecting the scrapped data into a SQLite DB has another advantage. It's easy to query it from another application, disregarding the original stack used to scrap. Flask was an easy choice since I'm already familiar with it, it has almost no setup and I'm not concerted with performance nor portability (FastAPI's DI would be an overkill). Jinja2 is also a good enough tool with its support for recursive macros. 
This is the main idea of rendering the tree

`<details>` to przepiękny HTML tag. Bez javascriptu mamy funkcjonalność collapsable elementu.

```html
{% macro comment(c) %}
<details class="comment">
  <summary class="comment__header">...</summary>
  <div class="comment__body">
    <p class="comment__text">{{ c.text_content }}</p>
    <!-- replies -->
    {% for rc in c.replies %}
      {{ comment(rc) }}
    {% endif %}
  </div>
</details>
{%- endmacro %}
...
  {% for c in comments %}
    {{ comment(c) }}
  {% endfor %}
```

> Lekcja z nieogarniętości danych na stronach nr 2: Użytkownik usunięty nie ma nazwy, więc skrapuje się NULL.
> Co za tym idzie -- źle się wyświetla, ale to zaraz sb naprawię
> Co za tym serio idzie -- kiedy ktoś odpowiada na komentarz usuniętego użytkownika, to reply_to jest też NULL. Mogę z tym żyć bo przez to jak jest napisane konstruowanie tego drzewa to się doda po prostu jako nowy wątek.
> Niby mógłbym to próbować rozwiązać w taki sposób, że tzymałbym mapę indent -> najświeższy post z tym indentem i jak znajdę post, który nie ma `position=0, indent=0`, to chyba podpinamy do 


### Konstruowanie tego drzewa

> Co nas interesuje: dla usera U, suma ścieżek od każdego najdalej zagnieżdżonego komentarza usera U do roota. Zaraz napiszę parę pytestowych testów

Zacząłem robić jakiś taki niezręczny algorytm, który w miarę liniowo konstruuje te drzewo.
Ale tak sobie zacząłem teraz myśleć, że może mógłbym to ugryźć od strony eager loadingu?
Nie wiem czy dobrze to nazywam, ale w takim sensie, że zamiast korzystać z tego indentu, to mógłbym korzystać z tego, że kolumna `reply_to` mogłaby mieć FK (post_id).
Tylko jak wtedy z tego skorzystać? Wiadomo że są posortowane po pozycji.
Czyli idziemy sobie po kolei po nich. I 
- Dodajemy do mapy ID -> wiersz
- Jeśli `reply_to is not None`, to wybieramy z mapy i `.replies.append`
- No i to powinno wystarczyć lol. Proste wsm

No dobra, ale chyba moje pytanie było takie, że jak załadować taki relationship fajnie?

Chyba to nie powinna być tylko liczba tylko post_{ID} albo topic_{ID}
Więc może zostawimy sobie reply_to_url i reply_to 

A to chyba miałby być taki JOIN do tej samej tabeli?
W sensie jakiś RIGHT JOIN po reply_to = post_id ORDER BY reply_to (czy tam post_id), position i wtedy po tym sobie iść?

> Lekcja z SQLite: Nie jest łatwo wrzucić tupla jako argument ale się da. Może jakiś snippet do formatowania.
> https://stackoverflow.com/questions/283645/python-list-in-sql-query-as-parameter
> https://ricardoanderegg.com/posts/sqlite-list-array-parameter-query/

Filtrowanie tego drzewa okazuje się trochę bardziej tricky, niż myślałem. No bo spoko,

> (1.) Gather all paths leading from marked nodes back to root.
> Ordering starting nodes by index (desc) prevents traversing the same path multiple times.

I teraz się zastanawiam, bo napisałem sobie taką generic funkcję do zagłębiania się w drzewo (DFS basically) i mam tak naprawdę zebrane
wszystkie wierzchołki, jakie mają być na tym nowym drzewie w `visited` po tym jak sobie zrobiłem (1.)

I się zastanawiam czy po prostu zrobić coś co schodzi tym samym właśnie traversem i jeśli post_id in visited, to go dorzuca?
Tylko właśnie najbardziej tricky jest to dorzucanie. Bo nie chcę mutować poprzedniego drzewa, tylko stworzyć nowe.
Drugą opcją jest robienie tego w tej samej funkcji, co zbiera visited. I chyba od tego zacznę, a potem najwyżej zrefactoruję.

Mega spoko mi się pracuje z tym pytestem i `breakpoint()`

## Clearing the data

Pojawił się kolejny niespodziewany case
> Lekcja nr 3: Zablokowane wpisy
> Troszeczkę inny format wtedy jest
> i też nie ma reply_to, ale to powinno się załatwić w ten sam sposób, że podpinamy do poprzedniego indentu

## First run, more lessons

Pierwsza próba zeskrapowania jakiegoś usera
1. Baza się lockuje bo nie ma commita chyba
Więc nie można też za bardzo jej podglądać jak leci
Ciekawe co się stanie jak nas zbanują? Czy pójdzie commit na spider_close
2. Zajęło to 1.5h

```
{'downloader/request_bytes': 32033826,
 'downloader/request_count': 78779,
 'downloader/request_method_count/GET': 78779,
 'downloader/response_bytes': 1447752646,
 'downloader/response_count': 78779,
 'downloader/response_status_count/200': 41820,
 'downloader/response_status_count/301': 36959,
 'elapsed_time_seconds': 3988.044188,
 'finish_reason': 'finished',
 'finish_time': datetime.datetime(2024, 10, 18, 16, 14, 57, 927186, tzinfo=datetime.timezone.utc),
 'httpcompression/response_bytes': 4733076779,
 'httpcompression/response_count': 41820,
 'item_dropped_count': 3357,
 'item_dropped_reasons_count/Duplicate': 3357,
 'item_scraped_count': 384157,
 'log_count/DEBUG': 504761,
 'log_count/INFO': 68,
 'log_count/WARNING': 3357,
 'memusage/max': 169840640,
 'memusage/startup': 71340032,
 'request_depth_max': 235,
 'response_received_count': 41820,
 'robotstxt/request_count': 2,
 'robotstxt/response_count': 2,
 'robotstxt/response_status_count/200': 2,
 'scheduler/dequeued': 78776,
 'scheduler/dequeued/memory': 78776,
 'scheduler/enqueued': 78776,
 'scheduler/enqueued/memory': 78776,
 'start_time': datetime.datetime(2024, 10, 18, 15, 8, 29, 882998, tzinfo=datetime.timezone.utc)}
```

To były bardzo znane filmy, mnóstwo wątków dużo userów. Więc kilka wniosków

1. Paginacja na indeksie, bo userów jest ileśdziesiąt tysięcy i zamula okropnie DOM
2. Nitki potrafią być długie, więc zwinięty root, a reszta rozwinięta, żeby się rozwijały w całości jak się kliknie root.
3. Konieczne jest "cacheowanie" filmów i topiców. W sensie, że bierzemy tabelę i zapisujemy w niej timestamp, kiedy był scrapowany film i topic i jak mniej niż threshold to nie wchodzimy w to w ogóle. Bo jak tylko ktoś wejdzie w Hobbita, to jest bbbaaardzo dużo danych do ściągnięcia.
4. Poza tym kilka razy mi się odpalił debugger, na topicach, gdzie był pusty tytuł (chyba jakieś bardzo stare komentarze)
  - Ten ma 17 lat: https://www.filmweb.pl/film/Mad+Max+2+Wojownik+szos-1981-1496/discussion/,714254
    - No się pojawiał NULL w nienullowalnym title
    - Zostawianie tego debuggera jak coś długo leci jest takie sobie, bo trzeba sprawdzać 

## Future endevours

- https://github.com/ppatrzyk/filmweb-export/blob/master/filmweb/getter.py
- https://www.filmweb.pl/api/v1/filmForum/750704/
- https://github.com/orkan/filmweb-api/tree/master/Api/Method
- https://github.com/orkan/filmweb-api/blob/master/Api/Api.php
- https://github.com/orkan/filmweb-api/blob/master/Api/Method/getFilmInfoFull.php
- https://swagger.io/docs/specification/api-host-and-base-path/

Topics: [[Web Scraping]]
