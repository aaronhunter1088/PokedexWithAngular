import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule, routingComponents} from './app-routing.module';
import {AppComponent} from './app.component';
import {PokedexComponent} from './pokedex/pokedex.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {ArraySortPipe} from './array-sort.pipe';
import {EvolvesHowComponent} from './evolves-how/evolves-how.component';
import {PokemonService} from './services/pokemon.service';

@NgModule({
    declarations: [
        AppComponent,
        PokedexComponent,
        routingComponents,
        ArraySortPipe,
        EvolvesHowComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgxPaginationModule,
        MatSlideToggleModule,
        BrowserAnimationsModule
    ],
    providers: [
        PokemonService,
        provideHttpClient(withInterceptorsFromDi())
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
