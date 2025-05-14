# Vue-project

This template should help get you started developing with Vue 3 in Vite.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

# Vue-Supabase setup

## install as a package

```sh
npm install @supabase/supabase-js
```

## create a .env and a supabaseClient.ts file in root

You can find your URL and ANON keys in the settings menu of Supabase.

### supabaseClient.ts

```sh
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env
const supabaseAnonKey = import.meta.env

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### .env

```sh
SUPABASE_URL_KEY=
SUPABASE_ANON_KEY=
```

## DataTable setup

You can set your Datatable up as you see fit.
Import or create your rows

Dont forget:
After you have set up your Datatable you need to create policies for read and write access
