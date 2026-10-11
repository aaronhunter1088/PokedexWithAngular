import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EvolvesHowComponent} from './evolves-how.component';
import {provideRouter} from '@angular/router';
import {PokemonService} from '../services/pokemon.service';

describe('EvolvesHowComponent', () => {
    let component: EvolvesHowComponent;
    let fixture: ComponentFixture<EvolvesHowComponent>;

    beforeEach(async () => {

        // Mock evolution data for Bulbasaur's evolution family.
        const mockEvolutionMap = new Map<number, number[][]>([
            [1, [[1], [2], [3]]]
        ]);

        // Mock only the PokemonService methods needed by this component.
        const mockPokemonService = {
            getEvolutionsMap: () => mockEvolutionMap,
            getPokemonChainData: (_chainId: string) => Promise.resolve([])
        };

        await TestBed.configureTestingModule({
            declarations: [
                EvolvesHowComponent
            ],
            providers: [
                provideRouter([]),
                {
                    provide: PokemonService,
                    useValue: mockPokemonService
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EvolvesHowComponent);
        component = fixture.componentInstance;

        // Set the input before ngOnInit executes.
        component.pokemonID = 1;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});