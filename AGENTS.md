# AI Agent Guide for PokedexWithAngular

## Critical Architecture Decisions

### Non-Standard Port Configuration
**Dev server runs on port 4202** (not 4200). Configured in `angular.json` line 78. All debugging and local testing expects `http://localhost:4202/`.

### Router Reload Strategy
`app-routing.module.ts` uses `onSameUrlNavigation: 'reload'` - navigation to same URL triggers component reload. Critical for search functionality when navigating between different Pokémon.

### Non-Standalone Components
Components use `standalone: false`. Do NOT generate new components with standalone: true. Use traditional module-based architecture.

## PokéAPI Integration Patterns

### Wrapper Fallback Strategy
`PokemonService.getPokemonSpeciesData()` (lines 105-130) demonstrates critical pattern: pokeapi-js-wrapper sometimes returns invalid responses, so fallback to direct HTTP call using `pokemon.species.url`. Use this pattern when adding new API calls.

### Evolution Chain Hardcoding
**480+ evolution chains are hardcoded** in `PokemonService.getEvolutionsMap()` (lines 233-725). This is intentional - PokéAPI evolution chain endpoint is too slow and unreliable for real-time lookups. When adding new Pokémon generations, extend this map following the existing pattern:
```typescript
[chainID, [[stage1IDs], [stage2IDs], [stage3IDs, ...altForms]]]
```

### Unit Conversion Logic
Weight/height conversions happen in TWO places:
1. `PokemonService.collectPokemonData()` (lines 156-166) - for list view caching
2. `PokedexComponent.ngOnInit()` (lines 84-92) - for detail view

Formula: `weight * 0.220462 * 10` for lbs, `height * 3.93701` for inches. Must keep both in sync.

## Component Communication Flow

### Pokémon ID Extraction Pattern
Multiple components extract pokemonID from URL using same pattern:
```typescript
this.pokemonID = Number(window.location.pathname.split('/').pop()?.trim() || 0)
```
Used in PokedexComponent, EvolutionsComponent, SearchComponent. Avoids ActivatedRoute param issues with reloads.

### Service State Management
`PokemonService` maintains app state without observables:
- `savedPageNumber` - preserves list pagination across navigation
- `allPokemon` - cached full dataset (loads 1025 Pokémon on first use)
- `showGifs` - user preference for animated sprites
- `pkmnPerPage` - pagination size

Call `savePokemonID()`, `saveCurrentPage()` before navigation to preserve state.

## Development Workflows

### Build Commands
- `npm start` - standard dev server
- `npm run startAngularAppAndMobile` - serves on 0.0.0.0 for mobile testing
- `npm run deployAngularAppForServer` - builds with `/angular/` base-href for deployment

### Debugging Setup
Debug config expects source maps enabled. Run config needs `--source-map --open` flags. Debug at `http://localhost:4202/` not 4200.

## Project-Specific Patterns

### Type Safety Pragmatism
TypeScript strict mode ON, but PokéAPI response objects typed as `any` throughout. This is intentional - API shape is inconsistent. Add defensive checks (`!= null`, optional chaining) rather than creating types.

### Image Selection Logic
Three image sources per Pokémon (PokedexComponent lines 77-80):
1. `sprites.front_default` - fallback to pokeball image if null
2. `sprites.versions.generation-v.black-white.animated.front_default` - GIF
3. `sprites.other.official-artwork.front_default` - high-res official art

Check `showGifs` service flag to determine which to display.

### DOM Manipulation Pattern
Direct DOM access via `document.getElementById()` common for button state (e.g., PokedexComponent lines 44-47). Not using ViewChild/template refs for UI state. Follow this pattern for consistency.

## Data Flow Red Flags

### Evolutions Component Lifecycle
EvolutionsComponent relies on pokemonIDToEvolutionChainMap lookup → finds chain ID → extracts 2D array of evolution stages → fetches data for each ID. If evolution display breaks, check:
1. Chain ID exists in map (line 50)
2. Array structure matches `[[stage1], [stage2], [stage3]]` format
3. All referenced Pokémon IDs are ≤ 1025

### Species Data Race Condition
PokedexComponent fetches species data async (line 95) AFTER setting basic Pokémon data. UI must handle loading states - `pokemonColor`, `pokemonDescriptions` populate later. Check template has proper null checks.

## Bundle Size Constraints
Initial bundle max 1MB (error), 900KB (warning). Evolution map alone is ~50KB. When adding features, check bundle impact with `npm run build`.

