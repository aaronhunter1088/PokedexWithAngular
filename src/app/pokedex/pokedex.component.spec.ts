import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PokedexComponent} from './pokedex.component';
import {EvolutionsComponent} from '../evolutions/evolutions.component';
import {MobileMenuComponent} from '../mobile-menu/mobile-menu.component';
import {provideRouter, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {PokemonListComponent} from '../pokemon-list/pokemon-list.component';

describe('PokedexComponent', () => {
    let component: PokedexComponent;
    let fixture: ComponentFixture<PokedexComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterModule,
                MobileMenuComponent
            ],
            declarations: [
                PokedexComponent,
                PokemonListComponent,
                EvolutionsComponent
            ],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PokedexComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});