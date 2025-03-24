import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from "./pokemon-list/pokemon-list.component";
//import { EvolutionsComponent } from "./evolutions/evolutions.component";
import { SearchComponent } from "./search/search.component";
import { PokedexComponent } from "./pokedex/pokedex.component";
import {EvolutionsComponent} from "./evolutions/evolutions.component";

const routes: Routes = [
  {path: '', component: PokemonListComponent},
  {path: 'search', component: SearchComponent},
  {path: 'pokedex/:pokemonID', component: PokedexComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
// Is EvolutionsComponent really a routingComponent??
export const routingComponents = [PokemonListComponent, SearchComponent, PokedexComponent, EvolutionsComponent]
