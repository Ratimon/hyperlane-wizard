# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project


```bash
npx sv create <project_name>
```

>[!NOTE]
> For who want to scaffolding their own svelte project

>[!TIP]
> We, when scaffolding, use following options :
- SvelteKit minimal
- Yes, using Typescript syntax
- tailwindcss, mdsvex
- typography, forms
- pnpm

```bash
pnpm add -D daisyui@4.12.22 svelte-preprocess  autoprefixer
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
