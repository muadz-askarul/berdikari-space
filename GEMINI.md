# Project Overview

This is a static blogging template built with [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/), and [shadcn/ui](https://ui.shadcn.com/). It is designed to be an opinionated, unstyled starting point for creating a blog. The template is based on the [Astro Micro](https://astro-micro.vercel.app/) theme.

## Building and Running

### Prerequisites

- Node.js and npm

### Installation

```bash
npm install
```

### Development

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:1234`.

### Building

To build the project for production, run:

```bash
npm run build
```

This command will also run a type check before building.

### Other Commands

- `npm run start`: Alias for `npm run dev`.
- `npm run preview`: Previews the built project.
- `npm run astro`: Run Astro CLI commands.
- `npm run prettier`: Formats all files using Prettier.

## Development Conventions

### Content

- Blog posts are written in MDX and located in the `src/content/blog/` directory.
- Author information is stored in `src/content/authors/` as Markdown files.
- Projects are defined in `src/content/projects/` as Markdown files.

### Styling

- The project uses [Tailwind CSS](https://tailwindcss.com/) for styling.
- The color palette is defined in `src/styles/global.css` using the [OKLCH color format](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch).

### Code Blocks

- Code blocks are styled using [Expressive Code](https://expressive-code.com/).
- The configuration for Expressive Code can be found in `astro.config.ts`.

### Favicons

- Favicons are located in the `public/` directory.
- To update the favicons, replace the existing files and update the references in `src/components/Favicons.astro`.
