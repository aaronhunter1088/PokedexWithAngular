import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PokemonListComponent} from './pokemon-list.component';
import {AppModule} from '../app.module';

describe('PokemonListComponent', () => {
    let component: PokemonListComponent;
    let fixture: ComponentFixture<PokemonListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AppModule
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