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
STATIC_PATHS = ['images', 'pdfs']

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
# TODO: Consider categories or none at all
# CATEGORY_URL = '/{slug}.html'
# CATEGORY_SAVE_AS = '/{slug}.html'
CATEGORIES_SAVE_AS = ''  # Disable categories page
# TODO: Consider archives

# Default to draft
DEFAULT_METADATA = {
    'status': 'draft',
}

DEFAULT_PAGINATION = 10

# Plugins
# PLUGINS = None
# PLUGIN_PATHS = []
# http://www.vcheng.org/2014/02/22/pelican-sitemap-pagination/
# https://github.com/lowtechmag/solar-plugins

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
