import {TestBed} from '@angular/core/testing';
import {PokemonService} from './pokemon.service';
import {provideRouter} from '@angular/router';

describe('PokemonService', () => {
    let service: PokemonService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideRouter([])]
        });
        service = TestBed.inject(PokemonService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
