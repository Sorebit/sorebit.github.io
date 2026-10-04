Title: Instalacja gier na zmodowanym Xbox 360
Slug: instalacja-gier-na-zmodowanym-xbox-360
Date: 2026-02-05
Modified: 2026-10-04
Summary: Instalacja gier na zmodowanym Xbox 360
Status: published
Garden_status: seedling

topics:
  - "[[gierki]]"

Everything described here relies on the assumption that you’ve got a reliable source of legitimately obtained game copies in `.iso` format, such as original DVD’s dumped using a DVD to ISO script. → 
https://consolemods.org/wiki/Xbox_360:Playing_Game_Backups#.xex_Software 

If you don’t want to be bothered with backing up your collection, just download them from **Myrient**, Internet Archive, or any other redump you trust.

- **[Myrient](https://myrient.erista.me/files/Redump/Microsoft%20-%20Xbox%20360/)**
	- Actually, they’ve announced recently that due to growing hardware prices and third-parties abusing their hosting to build paywalled downloaders, they can no longer operate with $6k losses every month and will be closing by the end of March 2026. Hopefully, April 1st is going to be a massive April Fools relief but now I’m stocking on games I wish to ever play. Also for my [[Modowanie 3DS|3DS]].
- [Internet Archive](https://archive.org/download/amstrad-gx-4000-games/Microsoft%20-%20Xbox%20360%20ISO/)
	- Probably will become my second choice when Myrient is down.
	- Downloading big files from archive.org seems to be most reliable when using their CLI tool → [[archive.org cli downloads]]
- /r/Roms Megathread – https://r-roms.github.io/
	- Aggregates sources for most console games you can think of.
- ISO → GOD
	- https://github.com/r4dius/Iso2God
	- https://consolemods.org/wiki/Xbox_360:ISO2GOD


## Multi-disc variants :: 1 install disc, 1 play disc
This is the only variant I needed to learn about. Other ones are covered in this in-depth post on se7ensins – [se7ensins.com – A Short Guide For Installing Multi-Disc Games on a JTAG/RGH/R-JTAG](https://www.se7ensins.com/forums/threads/a-short-guide-for-installing-multi-disc-games-on-a-jtag-rgh-r-jtag.1381808/).
Na przykładzie Skyrim Legendary Edition. Same applies to GTA V.

Potrzebne jest

- [Xbox 360 Image Browser](https://digiex.net/threads/xbox-360-image-browser-2-9-0-350-xiso-browser-and-extractor.3136/)
- iso2god
- pliki .ISO z dumpami płyt gierek
	- Podstawa Skyrim (Disc 1)
	- Skyrim Legendary Edition (Disc 2, na którym są DLC)

Chodzi docelowo o to, żeby mieć w wyniku wszystkich działań jeden folder (Title ID), który można wrzucić na `Hdd1`. Nie interesują mnie inne metody, nie potrzebuję extracted plików (do GTA V i Skyrima wystarczyły).

W przypadku Skyrima na (Disc 1) jest podstawa gry, którą zmieniamy ISO → GOD i dostajemy tym samym nasz root (Title ID).

- Z (Disc 2) przy użyciu **Image Browsera** wyciągamy sam folder `Content`. Reszta to padding. 
- W środku jest folder Content > `0000000000000000` > `FFED2000` > `FFFFFFFF`.
- I głębiej są już 3 DLC jako binarki.

Nie do końca wiem dlaczego, ale trzeba zmienić nazwy tych folderów

- `FFED2000` → `425307E6` (Title ID)
- `FFFFFFFF` → `00000002` (Chyba oznacza się tak DLC)

W efekcie, jak wrzucimy to do roota (Title ID), to się nam to połączy w jedno drzewo

- `425307E6`
	- `00000002`
	- `00007000`

I to jest gotowe GOD do skopiowania na Hdd1. **But** the title won’t actually load the DLC’s. There are downloadable updates required to be applied on the base game.

## Title Updates
Włączamy gierkę przez aurorę i home buttonem otwieramy guide, na dolnym czarnym pasku jest title id, media id i title update version (skrótami). Ważne jest żeby sobie stąd zanotować media ID, bo na tej podstawie wchodzimy na https://xboxunity.net/ szukamy “Skyrim”, utwieramy Updates i pod tym media ID znajdujemy najwyższą wersję. Zależnie od tego jak się nazywa plik (lowercase czy uppercase) to wrzuca się je w różne miejsca na dysku.
### Lowercase variant (see also: [[Steve Rhoden, lowercase music]])
>  for exemple `tu00000002_00000000`

W naszym przypadku to było lowercase, więc trafiło to do `Content`-u obok gry.

- `425307E6`
	- `00000002`
	- `00007000`
	- `000B0000` ← Robimy sobie tutaj folder na Title Updates

W tym folderze Aurora będzie mogła odnaleźć update (trzeba zrobic rescan), robimy apply uruchamiamy gierkę i boom.

### Uppercase variant
> for exemple `TU_16L61V6_0000008000000.00000000000O2`
 
W tym przypadku idzie inside `Hdd1:/Cache` folder. Z doświadczenia z Minecraftem wychodzi na to, że nie wybiera się wtedy tego, tylko się robi rescan, to odpala Aurorę od nowa i apply-uje title update. 

**Q: Czym różnią się te metody?**
A: ?

## Minecraft (and other Xbox Live Arcade titles)
O dziwo wystarczy tylko zmienić ustawienia przez Aurorę [4]. 
- Settings Override: Enable
- XBLA Patching: Enable

**Q: Dlaczego to działa? I na innych Xbox Arcade grach?**
A: ?

## Sources

[1]: https://consolemods.org/wiki/Xbox_360:Manually_Installing_Title_Updates – info jak szukać title updates
[2]: [se7ensins.com – A Short Guide For Installing Multi-Disc Games on a JTAG/RGH/R-JTAG](https://www.se7ensins.com/forums/threads/a-short-guide-for-installing-multi-disc-games-on-a-jtag-rgh-r-jtag.1381808/)
[3]: https://www.youtube.com/watch?v=BTRTYlVBgcM – spoko, ale nie wiem czemu nie korzysta z god w ogóle
[4]: [BadAvatar- Minecraft Xbox 360 Unlock Full Game Fix- Xbox Arcade games ](https://www.youtube.com/watch?v=RtrXLSELyuY)
[5]: MrMario2011 – https://www.youtube.com/watch?v=6eOzQH1yeI0 – generally a great source of information. I understand, but dislike the aim to describe many routes to achieve the goal. But up to some point I didn’t get that I don’t even need to concern myself with extracted file formats.
