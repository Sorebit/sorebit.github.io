Title: Public-Intellectual: A Movie Discussions Scraper
Slug: filmweb-scraper
Date: 2024-10-19
Status: published
Summary: Scraping and exploring the minds of verbose cinema enthusiasts.


Not unlike many cinema enthusiasts I've built a habit of noting down the titles of movies and people behind them, while rating all of it using my [[notes/why-rate|elaborate rating system]]. My notebook of choice is [filmweb.pl](https://filmweb.pl) with its big polish-speaking community. I've also got the habit of reading the forum threads in search of any bright mind with a deeper insignt than mine. But when I actually find some smart bloke I'd like to read more from, there's a roadblock. **You can't just browse any user's comment history**.

A strategy came to mind. If someone commented on a movie, we can assume they have watched it (big if, I know) and rated it. So why not visit the user's page, then go through all the movies they have rated and find their comments in the discussions? Sounds **exactly** like a web scraper's job.

> *Technically*, googling `site:filmweb.pl insite:{username}` would yield similiar results. But first of all -- am I really going to click through 50 links? And second of all -- I've been looking for an end goal for a scrapping project.


<span style="color:red">
The more users we go through, the more topics will get downloaded. Since some movies are discussed more frequently, there will be more chances to hit a cache. tym więcej będziemy mieli filmów. The potential przecięcie of the sets of movies people watch is big. So it should "speed up" as we go. That is if we can create a **good enough cache**.
</span>

With this post I tried to turn my [[why-write|working notes]] into a coherent article. So it lies somewhere between a devlog, a collection of snippets and personal notes. PubInt was my first personal scraping project with data of such size. I'm taking no responsibility for using my approach. In the past, I've used *similiar* techniques in [[osir-scrapper]] which cyclically scrapped a single JSON file. There is **a lot** of content on filmweb.pl forums though.

## Basic spider

Sticking with motivation to build fast, I **prioritised a POC over learning the most**. At least untill I had a working tool. This was the main reason to choose [Scrapy](https://docs.scrapy.org) over building a custom stack with lxml, aiohttp, manually managing UserAgents etc. The docs are thorough but a bit all over the place. Thankfully, [scrapeops](https://scrapeops.io) hosts a pretty concise series of posts about building spiders with Scrapy. **In an hour** I had a basic but robust spider that wouldn't blow my focus away with missing features. Scrapy, unsurprisingly, turned out to be **more than powerful enough for my needs**. The project also became complex enough to revisit it when I'm happy with the functionality. I think building a robust<sup>[what it mean]</sup> downloader on top of `asyncio` would be a good exercise to strengthen my understanding of [[Async IO Design Patterns]]. More details about the Scrapy parts are covered in [[#|further sections]].

### Assumptions fall for the first time

It quickly turned out you can only see 100 (most recently?) rated movies on someone's page. That is after scrolling to the bottom of the page repeatedly and loading all items with AJAX. Let's call 100 enough for now and note that benchmarks are needed to see what happens to ludzie, którzy nas nie interesują, ale już są w bazie z liczbą komentarzy osób, które już mam podczas scrappowania kolejnych osób. **But how to dynamically load and interact with a page?**


> ![Jakoś pokazać problem może skrinem]()

Well, *don't*. Handling javascript or reverse-engineering the front-end API would significantly change this project's scope. Not aiming for scale, manual action is an acceptable trade-off for simplicity. Load the page as you would do anyway, call a single JS function that saves starting URL's into a txt file. Load up a user-script and pluck a CSS selector into it. Scrapy comes with a neat little way to pass key, value pairs through the CLI. All the command-line arguments can be passed in as keyword args to the spider's `__init__` like so: `-a file=/some/path`.

```python
def __init__(self, file: str = None, *args, **kwargs):
    super().__init__(*args, **kwargs)
    self.start_urls = []

    if not file:
        raise ValueError(f"Expected file argument for spider {self.name}")
    self.load_start_urls(Path(file).expanduser())
```

If you **really** want to take advantage of JS in your spider, try ...

- https://docs.scrapy.org/en/latest/topics/dynamic-content.html

Maybe I'm reinventing the wheel with this one, but I turned `start_urls` into a list of `(url, callback)` tuples. Keeping the appropriate callback with the URL makes it easier to tell the spider *"This time we're starting on a discussion page rather than on a movie page".* Overriding `start_requests` and `start_urls` is trivial with the way the `scrapy.Spider` class is written.

```python
def start_requests(self) -> Iterable[Request]:
    for url, callback in self.start_urls:
        yield Request(url, dont_filter=True, callback=callback)
```

Data that turned out to be important:

- Position ([[always have a column to sort by]])
- Indent as well as URL of the comment to which the comment was a reply
- `data-id`

At this point the comments were pouring into a database. SQLite makes it easy to **swap databases** just by renaming files. There was no need for an ORM but I wrote some [[sql-boilerplate|boilerplate code]] to facilitate the whole database business. The dataset however was growing too large to make sense of it without a proper viewer. Collecting the scrapped data into a database has another advantage. It's easy to query it from another application, disregarding the original stack used to scrap.

## Viewer

> **Goal:** Each thread becomes a collapsable tree of comments. Filmweb does not provide this, probably since its easier for most users to just read through the 50 comments and naturally go to the next page. All pages should also be gathered into a single tree. More on that later.

![red]({static}/images/filmweb-scraper/red.png)

The main idea of rendering the tree is to **nest** `<details>` tags with each indent representing a reply. i find the `<details>` tag to be a wonderful no-javascript replacement for collapsable elements. the whole `<summary>` element is clickable so it makes for a great header.

Flask was an easy choice since I'm already familiar with it. It has almost no setup and there was no concern with performance nor portability (FastAPI's DI would be an overkill). Jinja2 is a good enough tool with its support for recursive macros. The whole template boils down to this snippet:

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



### Konstruowanie tego drzewa

> Co nas interesuje: dla usera U, suma ścieżek od każdego najdalej zagnieżdżonego komentarza usera U do roota. Zaraz napiszę parę pytestowych testów

I adore pytest for TDD. Out of the box it supports the super-convenient `breakpoint` keyword, implements a fixture system and has very legible error messages with value diffs.

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

## Cleaning the data

> Lesson learned: The internet is messy. Data shouldn't be.

### Handling long threads

Motyw jest taki, że thready mogą się ciągnąć przez wiele stron. Wystarczy, że thread ma więcej niż 50 komentarzy. Żeby grupować je po URL-ach w takim razie trzeba wyrzucić z URL-a query string.
```
Przed: /film/...?page=2
Po: /film/...
```

Pewnie trzeba wyczyścić URL-e żeby identyfikować filmy i topici trochę lepiej.

`urllib.parse` jak zawsze przychodzi z pomocą i wywala query z urla, dopisuje netloc itp
Plus żeby zachować ciągłość co następuje po czym, to do handlera przekazujemy offset przy followowaniu linka do kolejnej strony dyskusji.

```python
next_page = response.css('.pagination__item--next a::attr(href)').extract_first()
if next_page:
    # response.follow allows using relative links
    yield response.follow(next_page, callback=self.parse_topic, cb_kwargs={"offset": i + offset})
```

Tu w ogóle się chyba też okazało, że te anchory nie działają? Nie pamiętam już dokładnie

### Deleted users and banned thoughts

Apparently, there's a lot of comments left by now-deleted users. Funnily enough, they always have a lot to say. So any replies to such comments render without the original user's name and thus, leaving a `NULL` in the `reply_to` column. The viewer connects comments by this column, so any reply to a deleted user results in a "new thread". I've marked the problematic comments' positions in red. **128** should obviously be a **reply to 127** since it's indent is precisely 1 more than that of the deleted comment.

![deleted-user.png]({static}/images/filmweb-scraper/deleted-user.png)

This is easily fixed by keeping track of the latest comment for each indent and connecting the comments based on that, if `reply_to is None`.

It turned out that **comments can also get banned**, silencing the insensitive more explicitly. This, too, is fixed in the way I've just described above.

![banned-comment.png]({static}/images/filmweb-scraper/banned-comment.png)

Pewnie dobrze byłoby używać tych item loaderów do czyszceznia?

## First run, more lessons

After becoming confident with the way the spider handles threads it was time to put it to a lifesize test. I picked a random user, saved their rated movies, and... had to wait **~1.5 hours** for the crawl to complete. This seemed unreasonably long until I realized **almost all 100 movies on the list were blockbusters** with thousands of threads with hundreds of comments per thread. Certainly I expected *some* volume of data, but not **384k comments** in 36.8k topics by **38.5k users**! I also realized I cannot browse through the aggregation in real time because the spider commmits to the database only after it's done. <span style="color:red">This needs to change.</span>


```
{'downloader/request_bytes': 32033826,
 'downloader/request_count': 78779,
 'downloader/request_method_count/GET': 78779,
 'downloader/response_bytes': 1447752646,
 'downloader/response_count': 78779,
 'downloader/response_status_count/200': 41820,
 'downloader/response_status_count/301': 36959,
 'elapsed_time_seconds': 3988.044188,
...
 'item_dropped_reasons_count/Duplicate': 3357,
 'item_scraped_count': 384157,
...
 'request_depth_max': 235,
 'response_received_count': 41820,
...}
```

Some wnioski had to be taken away from this.

1. It is **crucial** to have a cache of some sort for the movies and threads. This way the spider won't concern itself with *The Lord of the Rings* for the next couple days.
2. A couple of times a **breakpoint has fired** and stopped the whole process for a couple minutes until I realized it's waiting for my input. This should not happen. Instead appropriate info should be logged.
    - Turns out this site is so old, there are [17 yo threads](https://www.filmweb.pl/film/Mad+Max+2+Wojownik+szos-1981-1496/discussion/,714254
) back from the times when (I assume) one didn't have to give threads a proper title.
    - The breakpoint triggered because a `NULL` title would not be accepted by the schema
3. Threads can be quite long (the cap seems to be [1000](https://www.filmweb.pl/film/Mroczny+Rycerz+powstaje-2012-506756/discussion/Temat+PRZE...+czyli+w+oczekiwaniu+na+informacje+dotycz%C4%85ce+3+Batmana+od+Chrisa+Nolana,1121232)) so they should not be collapsed by default in the viewer. 
    - `<details>` is actually super nice for this. By collapsing just the top-most element the rest of the tree can be open and still won't be visible until the root becomes open.

The whole time I was wondering *"What happens if I get banned?"*. But I didn't.

> <span style="color:red">Why wasn't I banned? Czy przedstawiamy się jako pająk i to jest ok dla filmwebu?</span>

## Caching topics and threads

<span style="color: red">Tego jeszcze nie zrobiłem</span>

## <span style="color: red">Czego jeszcze brakuje</span>

- Nazwa i link do filmu, nie tylko thread
- cache

## Refactoring spider to use Item Loaders

```python
def parse_topic(self, response: Response, **kwargs):
    topic_url = drop_query(response.url)
    comments = response.css('div.forumTopic')
    topic_title = comments.css('a.forumTopic__title::text').extract_first()
    item = Comment()
    offset = kwargs.get("offset", 0)
    for i, comment_container in enumerate(comments):
        item['topic_url'] = topic_url
        item['topic_title'] = topic_title
        item['post_id'] = comment_container.attrib.get('data-id')
        item['owner'] = comment_container.attrib.get('data-owner')
        item['text_content'] = " <br> ".join(
            comment_container.css('p.forumTopic__text::text').extract()
        )
        item['position'] = i + offset
        item['indent'] = comment_container.attrib.get('data-indent') or 0
        reply_to = comment_container.css('.forumTopic__authorReply a::attr(href)').extract_first()
        if reply_to:
            # URL also contains page num in query. It's convenient to store it all rather than
            # combining it from different columns (which is a violation of which Normal Form?)
            item['reply_to_url'] = add_netloc(reply_to, 'www.filmweb.pl')
            item['reply_to'] = fragment(reply_to).replace("topic_", "").replace("post_", "")
        else:
            item['reply_to_url'] = None
            item['reply_to'] = None

        yield item

    next_page = response.css('.pagination__item--next a::attr(href)').extract_first()
    if next_page:
        yield response.follow(next_page, callback=self.parse_topic, cb_kwargs={"offset": i + offset})
```

## Future endevours

- https://github.com/ppatrzyk/filmweb-export/blob/master/filmweb/getter.py
- https://www.filmweb.pl/api/v1/filmForum/750704/
- https://github.com/orkan/filmweb-api/tree/master/Api/Method
- https://github.com/orkan/filmweb-api/blob/master/Api/Api.php
- https://github.com/orkan/filmweb-api/blob/master/Api/Method/getFilmInfoFull.php
- https://swagger.io/docs/specification/api-host-and-base-path/

Topics: [[Web Scraping]]
