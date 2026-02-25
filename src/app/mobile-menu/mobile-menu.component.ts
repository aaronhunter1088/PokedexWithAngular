import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../services/dark-mode.service";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {environment} from "../../environments/environment";

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
    @Input() pokemonMap: Map<number, any> = new Map<number, any>();
    @Output() showGifsChange = new EventEmitter<boolean>();
    @Output() currentDarkModeChange = new EventEmitter<boolean>();
    @Output() pokemonMapChange = new EventEmitter<Map<number, any>>();
    pokemonNameID: string = '';
    @Input() chosenType: string = 'none';
    @Input() pageNumber: number = 1;
    @Output() chosenTypeChange = new EventEmitter<string>();
    @Output() chosenPageNumber = new EventEmitter<number>();
    @Input() pkmnPerPage: number = 10; // default
    @Output() pkmnPerPageChange = new EventEmitter<number>();
    @Input() totalPokemon: number = 0;
    @Output() totalPokemonChange = new EventEmitter<number>();
    uniqueTypes: string[] = ["bug", "dark", "dragon", "electric", "fairy", "fighting",
        "fire", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic",
        "rock", "shadow", "steel", "stellar", "unknown", "water"];
    landingPageUrl: string = environment.landingPageUrl;

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

    onPageInput(page: string) {
        if (isNaN(Number(page))) {
            alert("Please enter a valid page number");
            return;
        }
        if (Number(page) < 1) {
            this.pageNumber = 1;
        }
        else {
            this.pageNumber = Number(page);
            this.chosenPageNumber.emit(this.pageNumber);
        }
    }

    onPkmnPerPageInput(pkmnPerPage: string) {
        if (isNaN(Number(pkmnPerPage))) {
            alert("Please enter a valid number of Pokemon per page");
            return;
        }
        if (Number(pkmnPerPage) < 1) {
            this.pkmnPerPage = this.pokemonService.pkmnPerPage;
        }
        else {
            this.pkmnPerPage = Number(pkmnPerPage);
            this.pkmnPerPageChange.emit(this.pkmnPerPage);
        }// reset input field after submission
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
            window.location.href = window.location.href + '/?darkmode=' + updatedDarkmode;
        }, 100);
    }

    showLoadingOverlay(): void {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    }

    hideLoadingOverlay(): void {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    /**
     * Navigate back to the landing page with the current dark mode setting
     */
    navigateToLandingPage(): void {
        const currentDarkMode = this.darkModeService.isDarkMode();
        const url = this.landingPageUrl + "?tileNumber=2&darkmode="+currentDarkMode;
        window.location.href = url;
    }

    getByPkmnType(event: Event) {
        let selectedType = (event.target as HTMLInputElement).value;
        console.log("getByPkmnType (mobile): " + selectedType);
        this.chosenType = selectedType;
        this.chosenTypeChange.emit(selectedType);
        this.closeMobileMenu();
    }

    setPageToView() {
        this.chosenPageNumber.emit(this.pageNumber);
        this.closeMobileMenu();
    }

    setPkmnPerPage() {
        this.pkmnPerPageChange.emit(this.pkmnPerPage);
        this.closeMobileMenu();
    }
}
