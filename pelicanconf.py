#!/usr/bin/env python
# -*- coding: utf-8 -*- #

SITENAME = 'sorebit'
SITEURL = ''

PATH = 'content'
TIMEZONE = 'Europe/Warsaw'
DEFAULT_DATE_FORMAT = ('%B %d, %Y')
DEFAULT_LANG = 'en'
THEME = 'theme'
# Static files
STATIC_PATHS = ['images', 'pdfs', 'files']

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Articles
ARTICLE_PATHS = ['articles']
ARTICLE_URL = '{category}/{slug}.html'
ARTICLE_SAVE_AS = '{category}/{slug}.html'
# Pages
PAGE_PATHS = ['pages']
PAGE_URL = '{slug}.html'
PAGE_SAVE_AS = '{slug}.html'
# Disable tags and authors
TAGS_SAVE_AS = ''
TAG_SAVE_AS = ''
AUTHORS_SAVE_AS = ''
AUTHOR_SAVE_AS = ''

# Categories URL names are the same as directory for articles in this category.
CATEGORY_URL = '/{slug}.html'
CATEGORY_SAVE_AS = '/{slug}.html'
CATEGORIES_SAVE_AS = ''  # Disable `/categories.html` page
USE_FOLDER_AS_CATEGORY = True
# TODO: Consider archives

# Default to draft
DEFAULT_METADATA = {
    'status': 'draft',
}

DEFAULT_PAGINATION = 10

# Plugins https://github.com/getpelican/pelican-plugins
PLUGINS = None
# PLUGIN_PATHS = []
#     http://www.vcheng.org/2014/02/22/pelican-sitemap-pagination/
#     https://github.com/lowtechmag/solar-plugins
#     sitemap
#     webassets
#     webring
#     compress images
#     compress css / js (yuicompress)
#     autopages
#     better_table if i ever use tables
#     deadlinks
#     html_entity
#     optimize_images or image-process
#     Consider a plugin for generating duckduckgo search queries with sth like `ddg_search('phrase')`
#       - interlinks instead of cutom ddg search plugin?
#     cool mailto functionality in linker
#     w3_validate and additional accessabilty plugins
#     pelican link class
#     subcategory

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = False
