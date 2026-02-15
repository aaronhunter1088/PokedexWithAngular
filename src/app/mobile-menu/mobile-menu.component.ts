import {Component, Input, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../services/dark-mode.service";
import {Router, RouterLink} from "@angular/router";
import {MatSlideToggle} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-mobile-menu',
    imports: [
        RouterLink,
        MatSlideToggle
    ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.css',
})
export class MobileMenuComponent implements OnInit {

    @Input() currentDarkMode: boolean = false;
    @Input() showGifs: boolean = false;
    pokemonNameID: string = '';

    constructor(private pokemonService: PokemonService,
                private router: Router,
                private http: HttpClient,
                private darkModeService: DarkModeService)
    {
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

    navigateToPokedex(event: Event): void {
        this.router.navigate(['/pokedex', this.pokemonNameID]); // path parameter
    }

    onInput(pokemonNameID: string) {
        this.pokemonNameID = pokemonNameID;
    }
}
