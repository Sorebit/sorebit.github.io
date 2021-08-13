# sorebit.github.io

- [Site setup notes](#)
- [Pelican theme](https://github.com/sorebit/misun)
- `make github` - for publishing to `gh-pages` branch

## Roadmap

This is a messy roadmap without a proper direction.

### Backlinks plugin

Write a digital garden plugin and call it `pelican-garden` (needs a cool banner with pelicans in a garden).

Plugin will enable backlinks (two-way intra-site links).
- Adds *Back-links* section to any article which was linked

### Accessibility

Readability and accessibility.

- <https://ia.net/topics/100e2r>
- slow internet
- other accessibility issues.
- <https://readium.org/readium-css/docs/CSS09-default_fonts.html>
- <https://www.a11yproject.com/checklist/>
- <https://gtmetrix.com/> and <https://512kb.club/>

### General

- [ ] Figure out the difference between `True` and `False` for `RELATIVE_URLS`
- [ ] Figure out a structure
  - [ ] minis
  - [ ] notes
- [ ] `<details>` for ex. menus, toc's
- [ ] `Back to top` button
- [ ] webassets
  - [ ] Move values to config
  - [x] URL expiry
- [ ] favicon
- [x] remove `.html` from links?
- [ ] Move links to config (ex. github link in index.html)
- [ ] Design an index
    - a one-liner of what i am
    - recent updates in garden
    - recent articles
- [ ] Make the garden a garden

### Theme

- [ ] `blockquote`
- [ ] `code` and `pre`
- [ ] Header font sizes
  - <https://getbootstrap.com/docs/5.1/content/reboot/>
  - <https://getbootstrap.com/docs/5.1/content/typography/>
- [x] Change h1 in nav to header
- [ ] Check other browsers
- [ ] Skiplink
- <https://getbootstrap.com/docs/5.1/content/figures/>

### Plugins

- [ ] Custom plugin for redirecting from drafts when status is set to `published`.
- [ ] Custom plugin for updating `modified date` from file metadata if not present in `*.md` source
  - see <https://github.com/getpelican/pelican-plugins/blob/master/always_modified/always_modified.py>
    for inspo
- [ ] `Edit on GitHub` button
- [ ] `See source` (<https://github.com/pelican-plugins/show-source> or custom)
- [ ] [webring](https://github.com/XXIIVV/webring)
- [ ] [seo](https://github.com/pelican-plugins/seo)
- [ ] compress/dither images (optimize_images or image-process)
- [ ] [w3c_validate](https://github.com/getpelican/pelican-plugins/tree/master/w3c_validate) and
additional accessabilty plugins
- [ ] [sitemap](https://github.com/pelican-plugins/sitemap)
- [linker](https://github.com/getpelican/pelican-plugins/tree/master/linker) for cool mailto
functionality

#### Maybe

- webmentions
  - <https://keithjgrant.com/posts/2019/02/adding-webmention-support-to-a-static-site/>
  - <https://indieweb.org/webmention.io>
- <http://www.vcheng.org/2014/02/22/pelican-sitemap-pagination/>
- <https://github.com/lowtechmag/solar-plugins> (dither and page_metadata?)
- [autopages](https://github.com/getpelican/pelican-plugins/tree/master/autopages) for
`category.page` if it's not included in pelican core yet
- [deadlinks](https://github.com/silentlamb/pelican-deadlinks/tree/master)
- [interlinks](https://github.com/getpelican/pelican-plugins/tree/master/interlinks) for ddg search
links
- [linkclass](https://github.com/pelican-plugins/linkclass/tree/main) for interal/external links
- comments through GitHub issues or email
