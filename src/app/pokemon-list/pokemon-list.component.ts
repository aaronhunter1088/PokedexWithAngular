import {Component, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../services/dark-mode.service";
import {environment} from "../../environments/environment.development";

@Component({
    selector: 'app-pokemon-list',
    templateUrl: './pokemon-list.component.html',
    styleUrls: ['./pokemon-list.component.css'],
    standalone: false
})
export class PokemonListComponent implements OnInit {

    pokemonMap = new Map<number, any>();
    page: number = 1;
    blankPageNumber: string = ''
    itemsPerPage: number
    numberOfPokemon: number = 0;
    defaultImagePresent: boolean = false;
    showGifs: boolean = false;
    gifImagePresent: boolean = false;
    landingPageUrl: string = environment.landingPageUrl;

    constructor(private pokemonService: PokemonService, private http: HttpClient,
                private darkModeService: DarkModeService) {
        this.itemsPerPage = 10
    }

    ngOnInit(): void {
        this.page = this.pokemonService.getSavedPage();
        this.itemsPerPage = this.pokemonService.getNumberOfPokemonPerPage() // default is 10
        this.getThePokemon();
    }

    ngOnReload() {
    }

    ngOnDestroy() {
        this.pokemonService.saveCurrentPage(this.page);
        this.pokemonService.saveNumberOfPokemonPerPage(this.itemsPerPage)
    }

    getThePokemon() {
        console.log("page number is ", this.page);
        console.log("itemsPerPage: ", this.itemsPerPage);
        // @ts-ignore
        this.pokemonService.getPokemonList(this.itemsPerPage, (this.page - 1) * this.itemsPerPage)
            .then((pokemonListResponse: any) => {
                this.pokemonMap = this.newMap();
                //console.log(response);
                this.numberOfPokemon = pokemonListResponse.count;
                console.log("numberOfPokemon: ", this.numberOfPokemon);
                pokemonListResponse.results.forEach((pokemon: any) => {
                    this.pokemonService.getPokemonSpecificData(pokemon.name)
                        .then((pokemon: any) => {
                            //console.log(pokemon);
                            let sprites = pokemon['sprites'];
                            let types = pokemon['types']; // list of objects
                            //console.log("types: ", types)
                            let pokemonType = '';
                            //console.log(types);
                            if (types.length > 1) {
                                //console.log("more than 1 type");
                                pokemonType = types[0].type.name[0].toUpperCase() + types[0].type.name.substring(1) + " & " + types[1].type.name[0].toUpperCase() + types[1].type.name.substring(1);
                            } else {
                                //console.log("only 1 type");
                                pokemonType = types[0].type.name[0].toUpperCase() + types[0].type.name.substring(1);
                            }
                            pokemon.type = pokemonType;
                            let frontImg = sprites['front_default'];
                            pokemon.showDefaultImage = frontImg != null;
                            this.pokemonService.getPokemonSpeciesData(pokemon)
                                .then((speciesData: any) => { // .subscribe
                                    //console.log("speciesData: ", speciesData)
                                    pokemon.color = speciesData?.color?.name;
                                    // edit weight
                                    let weight = pokemon.weight.toString()
                                    //console.log("'"+weight.slice(0,-1)+"'" + "." + "'"+weight.slice(-1)+"'")
                                    weight = weight.slice(0, -1) + '.' + weight.slice(-1)
                                    pokemon.weight = weight
                                    // edit height
                                    let height = pokemon.height.toString();
                                    if (height.length == 1) height = "0." + height
                                    else height = height.slice(0, -1) + '.' + height.slice(-1)
                                    pokemon.height = height;
                                    this.pokemonMap.set(pokemon.id, pokemon);
                                });
                        });
                });
            });
        this.blankPageNumber = '';
    }

    getPokemonMapValues() {
        return Array.from(this.pokemonMap.values());
    }

    newMap() {
        return new Map<number, any>();
    }

    getPokemonSprites(pokemon: any) {
        //console.log(pokemon);
        let sprites = pokemon['sprites'];
        let otherSprites = sprites['other'];
        //console.log("getPokemonSprites");
        //console.log(sprites['front_default']);
        let frontImg = sprites['front_default'];
        this.defaultImagePresent = frontImg != null;
        let shinyImg = sprites['front_shiny'];
        let officialImg = otherSprites['official-artwork'].front_default;
        let gifImg = pokemon['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
        this.gifImagePresent = gifImg != null;
        return {'front': frontImg, 'shiny': shinyImg, 'official': officialImg, 'gif': gifImg};
    }

    showOfficialArtwork(pokemon: any) {
        //console.log("showOfficialArtwork");
        //console.log(pokemon.name);
        let images = this.getPokemonSprites(pokemon);
        //console.log(this.officialImg);
        this.defaultImagePresent = true;
        return images.official;
    }

    showFrontImage(pokemon: any) {
        //console.log("left, showFrontImage");
        //console.log(pokemon.name);
        let images = this.getPokemonSprites(pokemon);
        //console.log(this.frontImg);
        this.defaultImagePresent = false;
        return images.front;
    }

    changeColor(pokemonColor: string): string {
        if (pokemonColor === "red") {
            return "#FA8072";
        } else if (pokemonColor === "yellow") {
            return "#ffeb18";
        } else if (pokemonColor === "green") {
            return "#AFE1AF";
        } else if (pokemonColor === "blue") {
            return "#ADD8E6";
        } else if (pokemonColor === "purple") {
            return "#CBC3E3";
        } else if (pokemonColor === "brown") {
            return "#D27D2D";
        } else if (pokemonColor === "white") {
            return "#d2cbd3";
        } else if (pokemonColor === "pink") {
            return "#ef6bb6ff";
        } else if (pokemonColor === "black") {
            return "#8f8b8b"
        } else if (pokemonColor === "gray" || pokemonColor === "grey") {
            return "#8f8b8b"
        } else return "#ffffff";
    }

    setNewPageNumber(newPage: string) {
        let chosenPage = Number.parseInt(newPage)
        if (chosenPage < 0) {
            alert("Page number cannot be negative")
            return
        } else if (chosenPage > Math.round(this.numberOfPokemon / this.itemsPerPage)) {
            alert("Cannot pick a number more than there are pages")
            return
        }
        this.page = chosenPage
        this.getThePokemon();
        this.pokemonService.saveCurrentPage(this.page);
        this.blankPageNumber = '';
    }

    setNumberOfPokemonToDisplay(numberOfPokemon: string) {
        let chosenNumber = Number.parseInt(numberOfPokemon)
        if (chosenNumber < 0) {
            alert("Cannot show negative number of Pokemon")
            return
        } else {
            if (chosenNumber > 50) alert(chosenNumber + " is too high. Defaulting to 50")
            this.itemsPerPage = chosenNumber
            this.getThePokemon();
        }
    }

    /**
     * Navigate back to the landing page with the current dark mode setting
     */
    navigateToLandingPage(): void {
        const currentDarkMode = this.darkModeService.getDarkMode();
        const url = `${this.landingPageUrl}?tileNumber=2&darkmode=${currentDarkMode}`;
        window.location.href = url;
    }
}
