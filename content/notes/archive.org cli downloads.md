Title: archive.org cli downloads
Slug: archive-org-cli
Date: 2026-02-05
Modified: 2026-10-04
Summary: archive.org cli downloads
Status: published
Garden_status: seedling

So say you want to trap somebody in a poll in *The Sims 3*  for Xbox 360, but your disc broke in half.

1. You go to https://r-roms.github.io/
2. You find https://archive.org/download/microsoft_xbox360_s_part1
3. You find the zipped `.iso` file and try to download it using Firefox.
4. The download starts strong, at 1 MB/s.
5. Every time it gets throttled to death after 5 GB or so.

Turns out *Internet Archive* has an [official CLI tool](https://archive.org/developers/internetarchive/cli.html). It has built-in retries, and seems to be treated more loosely than the browser download. [Configuration](https://archive.org/developers/internetarchive/configuration.html#configuration) is simple, you just need an account (which you already had if you tried the browser download).

The identifier is the part after `/download/` in the URL. But you can also search for it using `ia search`.

```sh
$ ia list microsoft_xbox360_s_part1
...
Simpsons, Die - Das Spiel (Germany).zip
Sims 3, The (USA, Europe).zip
Sims 3, The - Pets (World) (Beta) (2011-05-17).zip
...
```

I was afraid I’d have to pull the whole “S (Part 1)”, but you can specify which file you need (or even byte range). 

```sh
$ ia download microsoft_xbox360_s_part1 "Sims 3, The (USA, Europe).zip"
```

After that I’m usually getting a stable 300 Kb/s.

One thing I haven’t found out how to do is provide a target directory. Rather I always do

```sh
$ cd /run/media/boczek/Elements
```

There is also the [[torrent]]-based [Minerva Redump](https://minerva-archive.org/browse/Redump/) but at this point I’m getting curious about archive.org’s architecture…
