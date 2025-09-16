import type { CollectionEntry } from "astro:content";

export interface ContentMap {
    'blog': CollectionEntry<'blog'>[],
    'event': CollectionEntry<'event'>[],
    'news': CollectionEntry<'news'>[],
    'authors': CollectionEntry<'authors'>[],
    'projects': CollectionEntry<'projects'>[],
}