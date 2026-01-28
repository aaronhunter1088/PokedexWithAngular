# Copilot Instructions for PokedexWithAngular

## Project Overview

This is an Angular-based Pokédex application that displays information about Pokémon using the PokéAPI. The application allows users to browse, search, and view detailed information about Pokémon including their stats, descriptions, locations, moves, and evolutions.

**Version:** 1.3.21
**Angular:** 20.3.15
**Node:** 24.12.0
**TypeScript:** 5.9.3

## Architecture

### Application Flow
- **Entry Point:** `src/index.html` → `app-root` component
- **Main Component:** `app.component.html` defines the navigable header and `router-outlet`
- **Routing:** Defined in `app-routing.module.ts`
  - `/` → `PokemonListComponent` (homepage with Pokémon list)
  - `/search` → `SearchComponent` (search for Pokémon by ID/name, assessible by clicking on the Pokédex logo)
  - `/pokedex/:pokemonID` → `PokedexComponent` (detailed Pokémon view)

### Key Components
- **PokemonListComponent** (`src/app/pokemon-list/`): Displays paginated list of Pokémon, 10 by default
- **PokedexComponent** (`src/app/pokedex/`): Shows specific Pokémon information with stats, descriptions, locations, moves and evolutions, if any
- **SearchComponent** (`src/app/search/`): Allows searching for specific Pokémon
- **EvolutionsComponent** (`src/app/evolutions/`): Displays Pokémon evolution chain
- **EvolvesHowComponent** (`src/app/evolves-how/`): Shows evolution methods and conditions

### Services
- **PokemonService** (`src/app/services/pokemon.service.ts`): Manages all PokéAPI interactions using `pokeapi-js-wrapper`
- **DarkModeService** (`src/app/services/dark-mode.service.ts`): Handles dark mode theme switching

## Development Commands

### Local Development
```bash
npm start                # Start dev server on port 4202
ng serve                 # Alternative start command
npm run build            # Production build
npm run build-server     # Build with specific base-href for server deployment
npm test                 # Run unit tests via Karma
```

### Server Configuration
- **Default Port:** 4202 (configured in `angular.json`)
- **Dev Server:** `http://localhost:4202/`

## Coding Standards

### Angular Best Practices
1. **Component Structure**: Follow Angular style guide for component organization
2. **Services**: Use singleton services with `providedIn: 'root'` for shared state
3. **Modules**: Components are organized with individual `.ts`, `.html`, `.css`, and `.spec.ts` files
4. **Routing**: Use Angular Router with lazy loading where appropriate

### TypeScript
- **Strict Mode**: Enabled in `tsconfig.json`
- **Target:** ES2022
- **Style:** Use explicit types, avoid `any` except where necessary (e.g., PokéAPI responses)

### Testing
- **Framework**: Jasmine + Karma
- **Convention**: Each component/service has a corresponding `.spec.ts` file
- **Location**: Test files are co-located with their implementation files

### Naming Conventions
- **Components**: PascalCase (e.g., `PokemonListComponent`)
- **Services**: PascalCase with `Service` suffix (e.g., `PokemonService`)
- **Files**: kebab-case (e.g., `pokemon-list.component.ts`)
- **Selector Prefix**: `app-` (defined in `angular.json`)

## External API

### PokéAPI Integration
- **Library**: `pokeapi-js-wrapper` (v1.2.2)
- **Caching**: Enabled in PokemonService
- **Main Methods**:
  - `getPokemonList(limit, offset)` - Get paginated Pokémon list
  - `getPokemonByName(idOrName)` - Get specific Pokémon data
  - `getPokemonSpeciesData(pokemon)` - Get species information
  - `getPokemonLocationAreaEncounters(pokemon)` - Get location data

### API Response Handling
- PokéAPI responses may have inconsistent typing; use defensive programming
- Check for `undefined` and validate response structure before using data
- The service includes fallback methods when the wrapper doesn't work as expected

## File Locations

### Configuration Files
- `angular.json` - Angular CLI configuration
- `package.json` - Dependencies and npm scripts
- `tsconfig.json` - TypeScript compiler options
- `tsconfig.app.json` - App-specific TypeScript config
- `tsconfig.spec.json` - Test-specific TypeScript config

### Source Code
- `src/app/` - Application components and services
- `src/assets/` - Static assets (images, icons)
- `src/environments/` - Environment-specific configurations
- `src/styles.css` - Global styles

### Build Output
- `dist/pokedex-with-angular/` - Production build artifacts

## Important Notes

1. **Pagination**: The app uses `ngx-pagination` for list pagination
2. **Sorting**: Uses both a custom `ArraySortPipe` (for ID-based sorting) and `ngx-order-pipe` library
3. **Material Design**: Uses Angular Material (`@angular/material`) for UI components
4. **Theme**: Supports dark mode toggle via DarkModeService
5. **Evolution Display**: Complex evolution chains are handled by EvolutionsComponent and EvolvesHowComponent

## Common Tasks

### Adding a New Component
```bash
ng generate component component-name
```

### Adding a New Service
```bash
ng generate service services/service-name
```

### Running Tests
```bash
ng test                  # Run all tests
ng test --watch=false    # Run tests once without watching
```

### Debugging
- Set up run configuration with `--source-map` and `--open` flags
- Use browser DevTools with source maps enabled
- JavaScript Debug configuration at `http://localhost:4202/`

## Dependencies to Note

- `@angular/animations` - Animation support
- `@angular/material` - Material Design components
- `@angular/cdk` - Component Dev Kit
- `ngx-order-pipe` - Sorting utilities
- `ngx-pagination` - Pagination support
- `pokeapi-js-wrapper` - PokéAPI client library
- `rxjs` - Reactive programming

## Build Budgets

- **Initial bundle**: Warning at 900kb, Error at 1mb
- **Component styles**: Warning at 2kb, Error at 4kb

Keep bundle sizes within these limits to maintain performance.
