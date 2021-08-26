Title: Roadmap
Slug: roadmap
Status: published

This is a messy roadmap without a proper direction.

The *quasi-issues* (i.e. bullet points) are sorted by priority, tho.

## Backlinks plugin [High]

Write a digital garden plugin and call it `pelican-garden` (needs a cool banner with pelicans in a garden).

Plugin will enable backlinks (two-way intra-site links).

- Adds *Back-links* section to any article which was linked

## Accessibility [Mid]

Readability and accessibility.

- <https://ia.net/topics/100e2r>
- slow internet
- other accessibility issues.
- <https://readium.org/readium-css/docs/CSS09-default_fonts.html>
- <https://www.a11yproject.com/checklist/>
- <https://gtmetrix.com/> and <https://512kb.club/>

## General

- **[High]** Figure out a structure (minis, notes)
- **[High]** webassets
  - **[Low]** Move values to config
  - **[Med]** compress css
- **[High]** Make the garden a garden
- **[Med]** favicon
- **[Med]** Design an index
    - <https://ia.net/topics/2006>
    - a one-liner of what I am
    - recent updates in garden
    - recent articles
- **[Low]** `Back to top` button
- **[Low]** Move links to config (ex. github link in index.html)
- **[enhancement]** `<details>` for ex. menus, toc's

## Theme

- **[Med]** Check other browsers
- **[Low]** `blockquote`

## Plugins

- **[Med]** compress/dither images (optimize_images or image-process)
- **[Med]** [w3c_validate](https://github.com/getpelican/pelican-plugins/tree/master/w3c_validate) and
additional accessabilty plugins
- **[Med]** [linker](https://github.com/getpelican/pelican-plugins/tree/master/linker) for cool mailto
- **[Low]** Custom plugin for redirecting from drafts when status is set to `published`.
- **[Low]** Custom plugin for updating `modified date` from file metadata if not present in `*.md` source
    - see <https://github.com/getpelican/pelican-plugins/blob/master/always_modified/always_modified.py> for inspo
- **[Low]** `Edit on GitHub` button
- **[Low]** `See source` (<https://github.com/pelican-plugins/show-source> or custom)
- **[Low]** [webring](https://github.com/XXIIVV/webring)
- **[Low]** [seo](https://github.com/pelican-plugins/seo)
- **[Low]** [sitemap](https://github.com/pelican-plugins/sitemap)
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

---

## Backlog

### General

- webassets
    - URL expiry
- remove `.html` from links
- change `h1` in nav to `header`
- **[Low]** fix `/category` instead of `/category/`
- **[Low]** Figure out the difference between `True` and `False` for `RELATIVE_URLS`

### Theme

- **[High]** Skiplink
- **[Med]** `code` and `pre`
- **[Med]** Header font sizes
    - <https://getbootstrap.com/docs/5.1/content/reboot/>
    - <https://getbootstrap.com/docs/5.1/content/typography/>
    - <https://getbootstrap.com/docs/5.1/content/figures/>