import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../services/dark-mode.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-mobile-menu',
    imports: [
        RouterLink,
        FormsModule
    ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css',
})
export class MobileMenuComponent implements OnInit {
    @Input() showGifs: boolean = false;
    @Input() currentDarkMode: boolean = false;
    @Output() showGifsChange = new EventEmitter<boolean>();
    @Output() currentDarkModeChange = new EventEmitter<boolean>();
    pokemonNameID: string = '';

    constructor(private pokemonService: PokemonService,
                private router: Router,
                private http: HttpClient,
                private darkModeService: DarkModeService) {
    }

    ngOnInit(): void {
    }

    toggleMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        menu?.classList.toggle('active');
        overlay?.classList.toggle('active');
        // Prevent body scroll when menu is open
        if (menu?.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileMenuOverlay');
        menu?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    async navigateToPokedex() {
        let pokemonId = this.pokemonNameID;
        const idPattern = /^[1-9][0-9]{0,3}$/; // Matches numbers from 1 to 9999
        const isNumeric = /^\d+$/.test(pokemonId);

        if (isNumeric) {
            if (!idPattern.test(pokemonId)) {
                alert("Please enter a valid Pokemon ID (1-9999)");
                return;
            }
        }
        // if a name is entered, validate it and get the id
        if (pokemonId !== undefined) {
            let pokemon = this.pokemonService.getPokemonByName(pokemonId);
            if (pokemon) {
                pokemonId = await pokemon.then(pkmn => {
                    return pkmn.id.toString();
                });
            }
        }
        console.log("searched for pokemonId: " + pokemonId);
        this.router.navigate(['/pokedex', pokemonId])
            .then(() => this.closeMobileMenu());
    }

    onInput(pokemonNameID: string) {
        this.pokemonNameID = pokemonNameID;
    }

    toggleShowGifs() {
        this.showGifs = !this.showGifs;
        this.showGifsChange.emit(this.showGifs);
        this.pokemonService.saveShowGifs(this.showGifs);
        setTimeout(() => {
        }, 100);
    }
    toggleDarkmode() {
        let updatedDarkmode = !this.darkModeService.isDarkMode();
        this.currentDarkModeChange.emit(updatedDarkmode);
        setTimeout(() => {
            window.location.href = window.location.origin + '/?darkmode=' + updatedDarkmode;
        }, 100);
    }
}
