import {Component, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {HttpClient} from "@angular/common/http";
import {DarkModeService} from "../services/dark-mode.service";
import {environment} from "../../environments/environment";
import {Router} from "@angular/router";

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
    pkmnPerPage: number = 10;
    numberOfPokemon: number = 0;
    defaultImagePresent: boolean = false;
    showGifs: boolean = false;
    gifImagePresent: boolean = false;
    landingPageUrl: string = environment.landingPageUrl;
    currentDarkMode: boolean = false;
    pokemonIDName: string = '';
    chosenType: string = 'none';
    uniqueTypes: string[] = ["bug", "dark", "dragon", "electric", "fairy", "fighting",
        "fire", "flying", "ghost", "grass", "ground", "ice", "normal", "poison", "psychic",
        "rock", "shadow", "steel", "stellar", "unknown", "water"];

    filteredPokemonByType = new Map<string, any[]>();
    filteringInProgress = new Map<string, boolean>();
    retroactiveFetchingStarted: boolean = false;

    constructor(public pokemonService: PokemonService,
                private router: Router,
                private http: HttpClient,
                private darkModeService: DarkModeService) {
        this.pkmnPerPage = 10
    }

    async ngOnInit(): Promise<void> {
        this.page = this.pokemonService.getSavedPage();
        if (this.pokemonMap.size === 0 || this.chosenType !== 'none') {
            // update pokemonMap by emptying it first.
            this.pokemonMap.clear();
            // @ts-ignore
            // if (this.filteredPokemonByType.get(this.chosenType)?.length > 0) {
            //     // @ts-ignore
            //     this.filteredPokemonByType.get(this.chosenType).forEach((pkmn: any) => {
            //         console.debug("adding " + pkmn.id + ": " + pkmn.name + " to pokemonMap");
            //         this.pokemonMap.set(pkmn.id, pkmn);
            //     })
            // }
        }

        if (this.retroactiveFetchingStarted) {
            console.log("Retroactive fetching already started, skipping");
        } else {
            this.pokemonService.collectPokemonData().then(() => {
                this.startRetroactiveFetchingByType();
            });
        }

        this.pkmnPerPage = this.pokemonService.getNumberOfPokemonPerPage() // default is 10
        this.getThePokemon().then(r =>
            console.log("pokemonMap size: " + this.pokemonMap.size)
        );
        this.currentDarkMode = this.darkModeService.isDarkMode();
        this.showGifs = this.pokemonService.getShowGifs();
        console.log("Dark mode is ", this.currentDarkMode);
        console.log("Show GIFs is ", this.showGifs);
    }

    ngOnReload() {
    }

    ngOnDestroy() {
        this.pokemonService.saveCurrentPage(this.page);
        this.pokemonService.saveNumberOfPokemonPerPage(this.pkmnPerPage);
        this.pokemonService.saveShowGifs(this.showGifs);
    }

    async getThePokemon() {
        console.log("page number is ", this.page);
        console.log("itemsPerPage: ", this.pkmnPerPage);
        if (this.chosenType !== 'none') {
            if (!this.filteringInProgress.get(this.chosenType)) {
                let skipCount = (this.page - 1) * this.pkmnPerPage;
                console.log("skipCount: " + skipCount);
                let added = 0;
                let pokemonByType = this.filteredPokemonByType.get(this.chosenType);
                if (pokemonByType && pokemonByType.length > 0) {
                    for(let i = 0; i < pokemonByType.length; i++) {
                        if (i < skipCount) {
                            // skip
                        } else {
                            if (added < this.pkmnPerPage) {
                                let pkmn = pokemonByType[i];
                                console.debug("adding pkmn to pokemonMap: " + JSON.stringify(pkmn));
                                this.pokemonMap.set(pkmn.id, pkmn);
                                added++;
                            }
                        }
                    }
                } else {
                    await this.gatherPokemon();
                }
            }
            else {
                await this.gatherPokemon();
            }
        }
        else {
            await this.gatherPokemon();
        }
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
        } else if (chosenPage > Math.round(this.numberOfPokemon / this.pkmnPerPage)) {
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
            this.pkmnPerPage = chosenNumber
            this.getThePokemon();
        }
    }

    /**
     * Navigate back to the landing page with the current dark mode setting
     */
    navigateToLandingPage(): void {
        const currentDarkMode = this.darkModeService.isDarkMode();
        const url = `${this.landingPageUrl}?tileNumber=2&darkmode=${currentDarkMode}`;
        window.location.href = url;
    }

    toggleDarkMode(): void {
        this.darkModeService.toggleDarkMode();
        const url = new URL(window.location.href);
        url.searchParams.set('darkmode', this.darkModeService.isDarkMode().toString());
        setTimeout(() => window.location.href = url.toString(), 100);
    }

    getCurrentDarkMode(): boolean {
        return this.darkModeService.isDarkMode()
    }

    onInput(pokemonIDName: string) {
        this.pokemonIDName = pokemonIDName;
    }

    async navigateToPokedex(): Promise<void> {
        let pokemonId = this.pokemonIDName;
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
        this.router.navigate(['pokedex', pokemonId])
                .then(() => {
                    // Clear the search input after navigation
                    this.pokemonIDName = '';
                });
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

    async getByPkmnType(event: Event) {
        let selectedType = (event.target as HTMLInputElement).value;
        await this.filterByType(selectedType);
    }

    /**
     * Handles type selection from the mobile menu by delegating to the existing
     * filtering logic, ensuring pagination retains the type filter.
     */
    async onMobileTypeSelected(selectedType: string): Promise<void> {
        this.showLoadingOverlay();
        await this.filterByType(selectedType);
    }

    async filterByType(selectedType: string) {
        console.log("filterByType: " + selectedType);
        let previousType = this.chosenType;
        this.chosenType = selectedType;
        // Reset page to 1 when changing filter
        this.page = 1;
        // Clear the pokemon map to force reload
        // If switching from a type to no filter, clear the filtered cache
        // if (selectedType === 'none' && previousType === 'none') {
        //     this.filteredPokemonByType.clear();
        //     this.filteringInProgress.clear();
        // }
        this.pokemonMap.clear();
        if (selectedType !== 'none') {
            // @ts-ignore
            if (this.filteredPokemonByType.has(selectedType) && this.filteredPokemonByType.get(selectedType)?.length > 0) {
                console.debug("type: " + selectedType + " in cache, size: " + this.filteredPokemonByType.get(selectedType)?.length + ", using cached data");
                let pokemonByType = this.filteredPokemonByType.get(selectedType);

                let skipCount = (this.page - 1) * this.pkmnPerPage;
                console.log("skipCount: " + skipCount);
                let added = 0;

                if (pokemonByType && pokemonByType.length > 0) {
                    for(let i = 0; i < pokemonByType.length; i++) {
                        if (i < skipCount) {
                            // skip
                        } else {
                            if (added < this.pkmnPerPage) {
                                let pkmn = pokemonByType[i];
                                console.debug("adding pkmn to pokemonMap: " + JSON.stringify(pkmn));
                                this.pokemonMap.set(pkmn.id, pkmn);
                                added++;
                            }
                        }
                    }
                } else {
                    await this.gatherPokemon();
                }

                // result?.forEach((pkmn) => {
                //     let pokemon = pkmn;
                //     console.debug("adding pkmn to pokemonMap: " + JSON.parse(JSON.stringify(pokemon)));
                //     this.pokemonMap.set(pokemon.id, pokemon);
                // })
                this.hideLoadingOverlay();
            }
            else {
                console.debug("type: " + selectedType + " not in cache, starting to fetch for cache");
                this.numberOfPokemon = await this.pokemonService.fetchPokemonByType(selectedType).then(r => {
                    return r.length;
                })
                // this.numberOfPokemon = await this.fetchAllPokemonByType(selectedType).then(r => {
                //     return r.length;
                // });
                while (this.pokemonMap.size < this.pokemonService.getNumberOfPokemonPerPage()) {
                    await this.getThePokemon();
                    console.log("pokemonMap size: " + this.pokemonMap.size);
                    this.pkmnPerPage += this.pokemonService.getNumberOfPokemonPerPage();
                }
                this.pkmnPerPage = this.pokemonService.getNumberOfPokemonPerPage();
                this.hideLoadingOverlay();
            }
        }
        else {
            await this.getThePokemon();
            this.hideLoadingOverlay();
            //return this.pokemonMap;
        }
    }

    /**
     * Starts retroactive fetching of all Pokemon by type in the background.
     * This method should be called after the initial page load to pre-populate the cache.
     */
    startRetroactiveFetchingByType() {
        console.log("Starting retroactive fetching of Pokemon by type");
        this.retroactiveFetchingStarted = true;

        // Get all types and fetch Pokemon for each type in parallel
        console.log(`Found ${this.uniqueTypes.length} types to fetch Pokemon for`);

        // Process each type concurrently using Promise.all
        this.uniqueTypes.map(async type => {
            // Skip "none" type
            if (type === "none") {
                return Promise.resolve();
            }

            // Check if we've already started fetching this type
            if (this.filteredPokemonByType.has(type) || this.filteringInProgress.get(type)) {
                console.log(`Type ${type} already being fetched, skipping`);
                return Promise.resolve();
            }

            // Mark as in progress
            this.filteringInProgress.set(type, true);

            console.log(`Retroactively fetching Pokemon of type: ${type}`);

            let pkmnByType = await this.pokemonService.fetchPokemonByType(type);
            //return pkmnByType;
            //return this.fetchAllPokemonByType(type)
            this.filteredPokemonByType.set(type, pkmnByType);
            this.filteringInProgress.set(type, false);
        });
    }

    async fetchAllPokemonByType(type: string): Promise<any[]> {
        let pokemonByType: any[] = [];
        try {
            const response = await this.pokemonService.getPokemonList(1300, 0);

            if (response.count === 0) {
                console.log(`No Pokemon found for type ${type}`);
                this.filteredPokemonByType.set(type, []);
                this.filteringInProgress.set(type, false);
                return [];
            }

            for (const pokemon of response.results) {
                try {
                    const pokemonData = await this.pokemonService.getPokemonSpecificData(pokemon.name);

                    let sprites = pokemonData['sprites'];
                    let pokemonType = this.pokemonService.setThePokemonTypes(pokemonData);

                    if (this.chosenType !== 'none' && !pokemonType.split('&').map(type => type.trim().toLowerCase()).includes(this.chosenType)) {
                        //console.dir("Skipping " + pokemonData.name + " because its type: " + pokemonType + " doesn't match chosen type " + this.chosenType);
                        continue;
                    }

                    pokemonData['type'] = pokemonType;
                    let frontImg = sprites['front_default'];
                    pokemonData['showDefaultImage'] = frontImg != null;

                    const speciesData = await this.pokemonService.getPokemonSpeciesData(pokemonData);
                    if (speciesData && 'color' in speciesData && speciesData.color && typeof speciesData.color === 'object' && 'name' in speciesData.color) {
                        pokemonData['color'] = speciesData.color.name;
                    } else {
                        pokemonData['color'] = 'white';
                    }

                    // edit weight
                    let weight: string | number = pokemonData.weight.toString();
                    weight = weight.slice(0, -1) + '.' + weight.slice(-1);
                    weight = weight != null ? 10 * (Number.parseInt(weight) * 0.220462) : 0;
                    pokemonData.weight = weight;

                    // edit height
                    let height: string | number = pokemonData.height.toString();
                    height = height != null ? Number.parseInt(height) * 3.93701 : 0;
                    pokemonData.height = height;

                    pokemonByType.push(pokemonData);
                } catch (error) {
                    console.error("Error fetching data for Pokemon: " + pokemon.name, error);
                }
            }

            this.filteredPokemonByType.set(type, pokemonByType);
            this.filteringInProgress.set(type, false);
            console.log(`Completed retroactive fetch for type ${type}: ${pokemonByType.length} Pokemon`);
            return pokemonByType;
        } catch (error) {
            console.error(`Error retroactively fetching Pokemon of type ${type}`, error);
            this.filteringInProgress.set(type, false);
            // Remove potentially partially-populated cache entry so future requests can retry
            this.filteredPokemonByType.delete(type);
            return [];
        }
    }

    async gatherPokemon() {
        try {
            const pokemonListResponse = await this.pokemonService.getPokemonList(this.pkmnPerPage, (this.page - 1) * this.pkmnPerPage);

            this.numberOfPokemon = pokemonListResponse.count;
            console.log("numberOfPokemon: ", this.numberOfPokemon);

            this.pokemonMap.clear();
            for (const pokemon of pokemonListResponse.results) {
                try {
                    const pokemonData = await this.pokemonService.getPokemonSpecificData(pokemon.name);

                    let sprites = pokemonData['sprites'];
                    let pokemonType = this.pokemonService.setThePokemonTypes(pokemonData);

                    if (this.chosenType !== 'none' && !pokemonType.split('&').map(type => type.trim().toLowerCase()).includes(this.chosenType)) {
                        //console.dir("Skipping " + pokemonData.name + " because its type: " + pokemonType + " doesn't match chosen type " + this.chosenType);
                        continue;
                    }

                    pokemonData['type'] = pokemonType;
                    let frontImg = sprites['front_default'];
                    pokemonData['showDefaultImage'] = frontImg != null;

                    const speciesData = await this.pokemonService.getPokemonSpeciesData(pokemonData);
                    if (speciesData && 'color' in speciesData && speciesData.color && typeof speciesData.color === 'object' && 'name' in speciesData.color) {
                        pokemonData['color'] = speciesData.color.name;
                    } else {
                        pokemonData['color'] = 'white';
                    }

                    // edit weight
                    let weight: string | number = pokemonData.weight.toString();
                    weight = weight.slice(0, -1) + '.' + weight.slice(-1);
                    weight = weight != null ? 10 * (Number.parseInt(weight) * 0.220462) : 0;
                    pokemonData.weight = weight;

                    // edit height
                    let height: string | number = pokemonData.height.toString();
                    height = height != null ? Number.parseInt(height) * 3.93701 : 0;
                    pokemonData.height = height;

                    this.pokemonMap.set(pokemonData.id, pokemonData);
                } catch (error) {
                    console.error("Error fetching data for Pokemon: " + pokemon.name, error);
                }
            }
        }
        catch (error) {
            console.error("Error fetching Pokemon list", error);
        }
    }
}
