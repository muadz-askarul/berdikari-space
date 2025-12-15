import { config, fields, collection } from '@keystatic/core'

const postSchema = {
  title: fields.slug({ name: { label: 'Title' } }),
  description: fields.text({ label: 'Description', multiline: true }),
  date: fields.date({ label: 'Date' }),
  order: fields.number({ label: 'Order' }),
  image: fields.text({ label: 'Image Path (relative to file)' }),
  tags: fields.array(fields.text({ label: 'Tag' }), {
    label: 'Tags',
    itemLabel: (props) => props.value,
  }),
  authors: fields.array(
    fields.relationship({
      label: 'Author',
      collection: 'authors',
    }),
    {
      label: 'Authors',
      itemLabel: (props) => props.value ?? 'Select an author',
    },
  ),
  draft: fields.checkbox({ label: 'Draft' }),
  content: fields.mdx({
    label: 'Content',
  }),
}

export default config({
  storage: {
    kind: 'github',
    repo: {
      owner: 'muadz-askarul',
      name: 'berdikari-space',
    },
  },
  collections: {
    blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: postSchema,
    }),
    news: collection({
      label: 'News',
      slugField: 'title',
      path: 'src/content/news/*',
      format: { contentField: 'content' },
      schema: postSchema,
    }),
    event: collection({
      label: 'Event',
      slugField: 'title',
      path: 'src/content/event/*',
      format: { contentField: 'content' },
      schema: postSchema,
    }),
    authors: collection({
      label: 'Authors',
      slugField: 'name',
      path: 'src/content/authors/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        pronouns: fields.text({ label: 'Pronouns' }),
        avatar: fields.text({ label: 'Avatar URL' }),
        bio: fields.text({ label: 'Bio' }),
        mail: fields.text({ label: 'Email' }),
        website: fields.url({ label: 'Website' }),
        twitter: fields.url({ label: 'Twitter' }),
        github: fields.url({ label: 'GitHub' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        discord: fields.url({ label: 'Discord' }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'name',
      path: 'src/content/projects/*',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        image: fields.text({ label: 'Image Path' }),
        link: fields.url({ label: 'Link' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
      },
    }),
    media: collection({
      label: 'Media',
      slugField: 'title',
      path: 'src/content/media/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        description: fields.text({ label: 'Description', multiline: true }),
        date: fields.date({ label: 'Date' }),
        order: fields.number({ label: 'Order' }),
        images: fields.array(
          fields.object({
            src: fields.url({ label: 'Source URL' }),
            title: fields.text({ label: 'Title' }),
          }),
          {
            label: 'Images',
            itemLabel: (props) => props.fields.title.value,
          },
        ),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: (props) => props.value,
        }),
        authors: fields.array(
          fields.relationship({
            label: 'Author',
            collection: 'authors',
          }),
          {
            label: 'Authors',
            itemLabel: (props) => props.value ?? 'Select an author',
          },
        ),
        draft: fields.checkbox({ label: 'Draft' }),
        content: fields.mdx({
          label: 'Content',
        }),
      },
    }),
  },
})
