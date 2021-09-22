#!/usr/bin/env python
# -*- coding: utf-8 -*- #

SITENAME = "sorebit"
SITEURL = ""

PATH = "content"
TIMEZONE = "Europe/Warsaw"
DEFAULT_DATE_FORMAT = "%B %d, %Y"
DEFAULT_LANG = "en"
THEME = "theme"
RELATIVE_URLS = False
# Ignore all files which names start with a dot
# This fixes copying .git from resume submodule
IGNORE_FILES = [".#*", ".*"]

# Static files
STATIC_PATHS = ["images", "files"]

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Articles
# - Generated from /content/{category}/
# - Stored at /articles/{category}/{slug}.html
# - Accessed at /{category}/{slug}
ARTICLE_PATHS = ["articles", "notes", "minis"]
ARTICLE_URL = "{category}/{slug}"
ARTICLE_SAVE_AS = "{category}/{slug}.html"

# Pages
# - Stored at /pages/{slug}.html
# - Accessed at /{slug}
PAGE_PATHS = ["pages"]
PAGE_URL = "{slug}"
PAGE_SAVE_AS = "{slug}.html"  # Can be overrode by Save_as: ...

# Categories URL names are the same as directory for articles in this category.
# - Generated from separate pages at /pages/{category}.md
# - Stored at /{category}/index.html
# - Accessed at /{slug}/
CATEGORY_URL = "{slug}/"
CATEGORY_SAVE_AS = ""  # Disable default categories pages
CATEGORIES_SAVE_AS = ""  # Disable `/categories.html` page
USE_FOLDER_AS_CATEGORY = True

# Disable tags, authors, and archives
TAGS_SAVE_AS = ""
TAG_SAVE_AS = ""
AUTHORS_SAVE_AS = ""
AUTHOR_SAVE_AS = ""
ARCHIVES_SAVE_AS = ""

# Default to draft
DEFAULT_METADATA = {
    "status": "draft",
}

DEFAULT_PAGINATION = 10


## PLUGINS

# Plugins https://github.com/getpelican/pelican-plugins
PLUGINS = None
# Currently in use
# - webassets

WEBASSETS_DEBUG = True

# WEBASSETS_BUNDLES = (
#     (
#         "my_bundle",  # name
#         ("css/main.scss"),  # args
#         # kwargs
#         {
#             "output": "css/main.min.css",
#             "filters": ["libsass", "cssmin"]
#         }
#     )
# )

# WEBASSETS_CONFIG = [
#     ("libsass_style", "compressed")
# ]

# PLUGIN_PATHS = []


# Custom links and stuff

GITHUB_LINK = "https://github.com/sorebit"

INDEX_DESCRIPTION = (
    "This site is not really ready for release. Please keep this in mind."
)


# Also, as a side note: Isn't `WEBSITE_BUNDLES` a bit too little verbose?
# - Wouldn't a `list` or even a `dict` with `name` as key be more readable, instead of a `tuple`?
# - I would say the `(name, args, kwargs)` format introduces readability issues even in documentation.
