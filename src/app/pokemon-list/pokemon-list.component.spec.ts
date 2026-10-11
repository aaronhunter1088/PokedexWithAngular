import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PokemonListComponent} from './pokemon-list.component';
import {MobileMenuComponent} from '../mobile-menu/mobile-menu.component';
import {provideRouter, RouterModule} from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';
import {CommonModule} from '@angular/common';

describe('PokemonListComponent', () => {
    let component: PokemonListComponent;
    let fixture: ComponentFixture<PokemonListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterModule,
                MobileMenuComponent,
                NgxPaginationModule
            ],
            declarations: [
                PokemonListComponent
            ],
            providers: [
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(PokemonListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});