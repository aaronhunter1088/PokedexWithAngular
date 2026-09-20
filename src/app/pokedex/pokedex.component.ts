import {Component, HostListener, Input, OnChanges, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {PokemonService} from '../services/pokemon.service';
import {ActivatedRoute} from '@angular/router';
import {DarkModeService} from '../services/dark-mode.service';

type PokemonDescriptionEntry = {
    flavor_text: string;
    language?: {
        name?: string;
    };
};

type PokemonTypeEntry = {
    type: {
        name: string;
    };
};

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.css'],
    standalone: false
})
export class PokedexComponent implements OnInit, OnChanges, OnDestroy {
    @Input() pokemonSprites: Record<string, unknown> = {};
    @Input() pokemonImage: string = '';
    @Input() pokemonName: string = '';
    @Input() pokemonID: string | number = '';
    @Input() pokemonHeight: string = '';
    @Input() pokemonWeight: string = '';
    @Input() pokemonColor: string = '';
    @Input() pokemonType: string | PokemonTypeEntry[] = '';
    @Input() pokemonDescriptions: PokemonDescriptionEntry[] = [];
    @Input() pokemonDescription: string = '';
    @Input() pokemonLocations: string[] = [];
    @Input() pokemonMoves: string[] = [];

    descriptionDiv: boolean = true;
    locationsDiv: boolean = false;
    movesDiv: boolean = false;
    evolutionsDiv: boolean = false;
    normal: string = 'normal';
    bold: string = 'bold';
    screenWidth: number = 0;
    screenHeight: number = 0;
    styleFlag: boolean = false;
    gifImage: string = '';
    officialImage: string = '';
    currentDarkMode: boolean = false;
    showGifs: boolean = false;

    constructor(
        private pokemonService: PokemonService,
        private darkModeService: DarkModeService,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {}

    // Initializes the component and loads Pokemon data for routed pages.
    ngOnInit(): void {
        this.setDefaultSelectedButtons();
        this.currentDarkMode = this.darkModeService.isDarkMode();
        this.showGifs = this.pokemonService.getShowGifs();
        this.onResize();

        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        //console.log("w: " + this.screenWidth + " h: " + this.screenHeight)
        this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400
        this.route.params.subscribe(params => {
            //console.log("params", params)
            //console.log("pokemonID", this.pokemonID);
            if (Object.keys(params).length !== 0) {
                //console.log("params keys.length: ", Object.keys(params).length)
                this.pokemonID = Number(window.location.pathname.split('/').pop()?.trim() || 0)
            }
            if (this.pokemonID === undefined) this.pokemonID = <number>params['pokemonID']
            if (Number.parseInt(<string>this.pokemonID) > 0) {
                //console.log("chosen pokemon with ID: '" + this.pokemonID + "'")
                this.pokemonDescription = ''
                this.pokemonLocations = []
                this.pokemonMoves = []
                this.pokemonService.getPokemonByName(this.pokemonID)
                    .then((pokemon: any) => {
                        //console.log("pokemon: ", pokemon)
                        this.pokemonName = pokemon.name
                        //console.log("name: " + pokemon.name)
                        let sprites = pokemon['sprites']//<object>pokemon['sprites']
                        pokemon['sprites'] = sprites;
                        this.pokemonSprites = sprites;
                        let species = pokemon['species']
                        this.pokemonImage = pokemon['sprites']['front_default']
                        this.pokemonImage = this.pokemonImage != null ? this.pokemonImage : "./assets/images/pokeball1.jpg"
                        this.gifImage = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
                        this.officialImage = pokemon['sprites']['other']['official-artwork']['front_default']
                        this.pokemonID = pokemon.id

                        // edit weight
                        let weight = pokemon.weight.toString();
                        weight = weight.slice(0, -1) + '.' + weight.slice(-1);
                        weight = weight != null ? 10 * (Number.parseInt(weight) * 0.220462) : 0;
                        this.pokemonWeight = Math.round(Number(weight)).toString();

                        // edit height
                        let height = pokemon.height.toString();
                        height = height != null ? (Number.parseInt(height) * 3.93701) : 0;
                        this.pokemonHeight = Math.round(Number(height)).toString();

                        // get and set color, and pokemon description
                        this.pokemonService.getPokemonSpeciesData(pokemon)
                            .then((speciesData: any) => {
                                //console.log("pokemon species: ", speciesData);
                                this.pokemonColor = speciesData['color']['name'];
                                this.changeColor(this.pokemonColor);
                                this.pokemonDescriptions = speciesData.flavor_text_entries;
                                this.pokemonDescription = this.getEnglishDescriptions();
                            }) //.subscribe
                        // parse over the types
                        this.pokemonType = pokemon.types
                        //console.log("pokemonType", pokemon.types);
                        if (this.pokemonType.length > 1) {
                            // @ts-ignore
                            this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1) + " and " + this.pokemonType[1].type.name[0].toUpperCase() + this.pokemonType[1].type.name.substring(1)
                        } else {
                            // @ts-ignore
                            this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1)
                        }
                        // locations
                        this.pokemonService.getPokemonLocationEncounters(this.pokemonID.toString()).then(
                            (locations: any) => {
                                if (locations.length == 0) {
                                    this.pokemonLocations.push("No known locations!")
                                } else {
                                    locations.forEach((location: any) => {
                                        let names = location['location_area']['name'].split("-")
                                        let newName = ''
                                        names.forEach((name: string) => {
                                            name = name[0].toUpperCase() + name.substring(1)
                                            newName += name + " "
                                            //console.log(newName);
                                        })
                                        this.pokemonLocations.push(newName)
                                    })
                                    this.pokemonLocations.sort()
                                }
                            });
                        // moves
                        let allMoves = pokemon['moves']
                        //console.log("all moves: ")
                        //console.log(allMoves)
                        for (let i = 0; i < allMoves.length; i++) {
                            //console.log("move: ")
                            //console.log(allMoves[i]['move'].name)
                            let move = allMoves[i]['move'].name
                            move = move[0].toUpperCase() + move.substring(1)
                            this.pokemonMoves.push(move)
                        }
                        this.pokemonMoves.sort()
                    })
                    .catch((error: any) => {
                        console.log("Couldn't get Pokemon info with: '" + this.pokemonID + "'")
                        console.log(error)
                    })
                this.ngOnChanges()
            }
            else if (this.pokemonID !== undefined)
            {
                if (this.pokemonID === 'deoxys') {
                    this.pokemonID = 'deoxys-normal';
                }
                console.log("pokemon name: '" + this.pokemonID + "'")
                this.pokemonDescription = ''
                this.pokemonLocations = []
                this.pokemonMoves = []
                this.pokemonService.getPokemonByName(this.pokemonID)
                    .then((pokemon: any) => {
                        //console.log("pokemon: ", pokemon)
                        this.pokemonName = pokemon.name
                        //console.log("name: " + pokemon.name)
                        let sprites = pokemon['sprites']//<object>pokemon['sprites']
                        pokemon['sprites'] = sprites;
                        this.pokemonSprites = sprites;
                        let species = pokemon['species']
                        this.pokemonImage = pokemon['sprites']['front_default']
                        this.pokemonImage = this.pokemonImage != null ? this.pokemonImage : "./assets/images/pokeball1.jpg"
                        this.gifImage = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
                        this.officialImage = pokemon['sprites']['other']['official-artwork']['front_default']
                        this.pokemonID = pokemon.id

                        // edit weight
                        let weight = pokemon.weight.toString();
                        weight = weight.slice(0, -1) + '.' + weight.slice(-1);
                        weight = weight != null ? 10 * (Number.parseInt(weight) * 0.220462) : 0;
                        this.pokemonWeight = Math.round(Number(weight)).toString();

                        // edit height
                        let height = pokemon.height.toString();
                        height = height != null ? (Number.parseInt(height) * 3.93701) : 0;
                        this.pokemonHeight = Math.round(Number(height)).toString();

                        // get and set color, and pokemon description
                        this.pokemonService.getPokemonSpeciesData(pokemon)
                            .then((speciesData: any) => {
                                //console.log("pokemon species: ", speciesData);
                                this.pokemonColor = speciesData['color']['name'];
                                this.changeColor(this.pokemonColor);
                                this.pokemonDescriptions = speciesData.flavor_text_entries;
                                this.pokemonDescription = this.getEnglishDescriptions();
                            }) //.subscribe
                        // parse over the types
                        this.pokemonType = pokemon.types
                        //console.log("pokemonType", pokemon.types);
                        if (this.pokemonType.length > 1) {
                            // @ts-ignore
                            this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1) + " and " + this.pokemonType[1].type.name[0].toUpperCase() + this.pokemonType[1].type.name.substring(1)
                        } else {
                            // @ts-ignore
                            this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1)
                        }
                        // locations
                        this.pokemonService.getPokemonLocationEncounters(this.pokemonID.toString()).then(
                            (locations: any) => {
                                if (locations.length == 0) {
                                    this.pokemonLocations.push("No known locations!")
                                } else {
                                    locations.forEach((location: any) => {
                                        let names = location['location_area']['name'].split("-")
                                        let newName = ''
                                        names.forEach((name: string) => {
                                            name = name[0].toUpperCase() + name.substring(1)
                                            newName += name + " "
                                            //console.log(newName);
                                        })
                                        this.pokemonLocations.push(newName)
                                    })
                                    this.pokemonLocations.sort()
                                }
                            });
                        // moves
                        let allMoves = pokemon['moves']
                        //console.log("all moves: ")
                        //console.log(allMoves)
                        for (let i = 0; i < allMoves.length; i++) {
                            //console.log("move: ")
                            //console.log(allMoves[i]['move'].name)
                            let move = allMoves[i]['move'].name
                            move = move[0].toUpperCase() + move.substring(1)
                            this.pokemonMoves.push(move)
                        }
                        this.pokemonMoves.sort()
                    })
                    .catch((error: any) => {
                        console.log("Couldn't get Pokemon info with: '" + this.pokemonID + "'")
                        console.log(error)
                    })
                this.ngOnChanges()
            }
            else {
                console.log("searching for a new pokemon")
            }
            if (this.pokemonID !== undefined) {
                this.loadPokemon(this.pokemonID).then(r => {})
            }
        })
    }

    // Resets view state when parent inputs change outside of route-driven loading.
    ngOnChanges(): void {
        this.resetDisplayedTabs();
    }

    // Persists toggle state when the component is destroyed.
    ngOnDestroy(): void {
        this.pokemonService.saveShowGifs(this.showGifs);
    }

    // Keeps the layout mode in sync with the viewport size.
    @HostListener('window:resize', ['$event'])
    onResize(event?: UIEvent): void {
        const winConst: Window = (event?.currentTarget ?? window) as Window;
        this.screenWidth = winConst.innerWidth;
        this.screenHeight = winConst.innerHeight;
        this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400;
    }

    // Switches the displayed Pokemon image.
    showImage(option: string): void {
        const pokeballImage: string = './assets/images/pokeball1.jpg';
        switch (option) {
            case 'default': {
                this.pokemonImage = this.getSpriteValue('front_default');
                if (this.pokemonImage === '') {
                    this.pokemonImage = pokeballImage;
                }
                this.setImageButtonWeights(this.bold, this.normal, this.normal, this.normal);
                break;
            }
            case 'official': {
                this.pokemonImage = this.officialImage || pokeballImage;
                this.setImageButtonWeights(this.normal, this.bold, this.normal, this.normal);
                break;
            }
            case 'shiny': {
                this.pokemonImage = this.getSpriteValue('front_shiny');
                if (this.pokemonImage === '') {
                    this.pokemonImage = pokeballImage;
                }
                this.setImageButtonWeights(this.normal, this.normal, this.bold, this.normal);
                break;
            }
            case 'gif': {
                this.pokemonImage = this.gifImage || pokeballImage;
                this.setImageButtonWeights(this.normal, this.normal, this.normal, this.bold);
                break;
            }
            default: {
                this.pokemonImage = pokeballImage;
                break;
            }
        }
    }

    // Shows the description tab.
    showDescription(): void {
        this.setDivsToNotShow();
        this.descriptionDiv = true;
        this.setButtonsToNormalFont();
        this.setElementFontWeight('descriptionBtn', this.bold);
    }

    // Shows the locations tab.
    showLocations(): void {
        this.setDivsToNotShow();
        this.locationsDiv = true;
        this.setButtonsToNormalFont();
        this.setElementFontWeight('locationsBtn', this.bold);
    }

    // Shows the moves tab.
    showMoves(): void {
        this.setDivsToNotShow();
        this.movesDiv = true;
        this.setButtonsToNormalFont();
        this.setElementFontWeight('movesBtn', this.bold);
    }

    // Shows the evolutions tab.
    showEvolutions(): void {
        this.setDivsToNotShow();
        this.evolutionsDiv = true;
        this.setButtonsToNormalFont();
        this.setElementFontWeight('evolvesHowBtn', this.bold);
    }

    // Hides all content tabs.
    setDivsToNotShow(): void {
        this.descriptionDiv = false;
        this.locationsDiv = false;
        this.movesDiv = false;
        this.evolutionsDiv = false;
    }

    // Clears image button emphasis.
    setImageButtonsToNormalFont(): void {
        this.setImageButtonWeights(this.normal, this.normal, this.normal, this.normal);
    }

    // Clears info button emphasis.
    setButtonsToNormalFont(): void {
        this.setElementFontWeight('descriptionBtn', this.normal);
        this.setElementFontWeight('locationsBtn', this.normal);
        this.setElementFontWeight('movesBtn', this.normal);
        this.setElementFontWeight('evolvesHowBtn', this.normal);
    }

    // Converts Pokemon color names to the matching tile color.
    changeColor(pokemonColor: string): string {
        if (pokemonColor === 'red') {
            return '#FA8072';
        } else if (pokemonColor === 'yellow') {
            return '#ffeb18';
        } else if (pokemonColor === 'green') {
            return '#AFE1AF';
        } else if (pokemonColor === 'blue') {
            return '#ADD8E6';
        } else if (pokemonColor === 'purple') {
            return '#CBC3E3';
        } else if (pokemonColor === 'brown') {
            return '#D27D2D';
        } else if (pokemonColor === 'white') {
            return '#d2cbd3';
        } else if (pokemonColor === 'pink') {
            return '#ef6bb6ff';
        } else if (pokemonColor === 'black') {
            return '#8f8b8b';
        } else if (pokemonColor === 'gray' || pokemonColor === 'grey') {
            return '#8f8b8b';
        } else {
            return '#ffffff';
        }
    }

    // Selects a random English flavor text for the current Pokemon.
    getEnglishDescriptions(): string {
        const englishDescriptions: PokemonDescriptionEntry[] = this.pokemonDescriptions.filter(
            (description: PokemonDescriptionEntry) => description.language?.name === 'en'
        );

        if (englishDescriptions.length > 0) {
            let randomIndex: number = Math.floor(Math.random() * englishDescriptions.length - 1);
            if (randomIndex < 0) {
                randomIndex = 0;
            }
            this.pokemonDescription = englishDescriptions[randomIndex].flavor_text;
        } else {
            this.pokemonDescription = 'No descriptions were found!';
        }

        return this.pokemonDescription;
    }

    // Loads and shapes Pokemon data for the current route or input selection.
    private async loadPokemon(pokemonIdOrName: string | number): Promise<void> {
        const normalizedPokemonId: string | number = this.normalizePokemonIdentifier(pokemonIdOrName);

        if (normalizedPokemonId === '') {
            return;
        }

        this.resetPokemonDetails();
        this.pokemonID = normalizedPokemonId;
        this.resetDisplayedTabs();

        try {
            const pokemon: any = await this.pokemonService.getPokemonByName(normalizedPokemonId);
            const speciesData: any = await this.pokemonService.getPokemonSpeciesData(pokemon);
            const locations: any[] =
                await this.pokemonService.getPokemonLocationEncounters(normalizedPokemonId.toString()) as any[];

            this.pokemonName = pokemon.name;
            this.pokemonSprites = pokemon.sprites ?? {};
            this.pokemonID = pokemon.id;
            this.pokemonImage = this.getSpriteValue('front_default') || './assets/images/pokeball1.jpg';
            this.gifImage = this.getNestedSpriteValue([
                'versions',
                'generation-v',
                'black-white',
                'animated',
                'front_default'
            ]);
            this.officialImage = this.getNestedSpriteValue([
                'other',
                'official-artwork',
                'front_default'
            ]);

            this.pokemonWeight = this.formatWeight(pokemon.weight);
            this.pokemonHeight = this.formatHeight(pokemon.height);
            this.pokemonColor = speciesData?.color?.name ?? '';
            this.pokemonDescriptions = speciesData?.flavor_text_entries ?? [];
            this.pokemonDescription = this.getEnglishDescriptions();
            this.pokemonType = this.formatPokemonTypes(pokemon.types ?? []);
            this.pokemonLocations = this.formatLocations(locations);
            this.pokemonMoves = this.formatMoves(pokemon.moves ?? []);

            this.cdr.detectChanges();
        } catch (error: unknown) {
            console.log(`Couldn't get Pokemon info with: '${normalizedPokemonId}'`);
            console.log(error);
        }
    }

    // Normalizes the incoming route or input identifier before loading.
    private normalizePokemonIdentifier(pokemonIdOrName: string | number): string | number {
        if (pokemonIdOrName === 'deoxys') {
            return 'deoxys-normal';
        }

        if (typeof pokemonIdOrName === 'number') {
            return pokemonIdOrName;
        }

        const trimmedPokemonIdentifier: string = pokemonIdOrName.trim();
        const parsedPokemonId: number = Number(trimmedPokemonIdentifier);

        if (!Number.isNaN(parsedPokemonId) && parsedPokemonId > 0) {
            return parsedPokemonId;
        }

        return trimmedPokemonIdentifier;
    }

    // Clears the previous Pokemon details before a new load.
    private resetPokemonDetails(): void {
        this.pokemonName = '';
        this.pokemonImage = '';
        this.pokemonHeight = '';
        this.pokemonWeight = '';
        this.pokemonColor = '';
        this.pokemonType = '';
        this.pokemonDescription = '';
        this.pokemonDescriptions = [];
        this.pokemonLocations = [];
        this.pokemonMoves = [];
        this.pokemonSprites = {};
        this.gifImage = '';
        this.officialImage = '';
    }

    // Restores the default tab and image button state.
    private resetDisplayedTabs(): void {
        this.setDivsToNotShow();
        this.descriptionDiv = true;
        this.setImageButtonsToNormalFont();
        this.setElementFontWeight('defaultImgBtn', this.bold);
        this.setButtonsToNormalFont();
        this.setElementFontWeight('descriptionBtn', this.bold);
    }

    // Applies the initial selected state for static buttons.
    private setDefaultSelectedButtons(): void {
        this.setElementFontWeight('defaultImgBtn', this.bold);
        this.setElementFontWeight('descriptionBtn', this.bold);
    }

    // Sets the current image button font weights.
    private setImageButtonWeights(
        defaultWeight: string,
        officialWeight: string,
        shinyWeight: string,
        gifWeight: string
    ): void {
        this.setElementFontWeight('defaultImgBtn', defaultWeight);
        this.setElementFontWeight('officialImgBtn', officialWeight);
        this.setElementFontWeight('shinyImgBtn', shinyWeight);
        this.setElementFontWeight('gifImgBtn', gifWeight);
    }

    // Updates an element font weight when the element exists in the current view.
    private setElementFontWeight(elementId: string, fontWeight: string): void {
        const element: HTMLElement | null = document.getElementById(elementId);
        if (element) {
            element.style.fontWeight = fontWeight;
        }
    }

    // Formats the Pokemon types to match the list component presentation.
    private formatPokemonTypes(types: PokemonTypeEntry[]): string {
        return types
            .map((typeEntry: PokemonTypeEntry) => {
                const typeName: string = typeEntry.type.name;
                return typeName.charAt(0).toUpperCase() + typeName.substring(1);
            })
            .join(' and ');
    }

    // Formats location encounter names for display.
    private formatLocations(locations: any[]): string[] {
        if (locations.length === 0) {
            return ['No known locations!'];
        }

        return locations
            .map((location: any) => {
                const names: string[] = location.location_area.name.split('-');
                return names
                    .map((name: string) => name.charAt(0).toUpperCase() + name.substring(1))
                    .join(' ');
            })
            .sort();
    }

    // Formats move names for display.
    private formatMoves(moves: Array<{move: {name: string}}>): string[] {
        return moves
            .map((moveEntry: {move: {name: string}}) => {
                const moveName: string = moveEntry.move.name;
                return moveName.charAt(0).toUpperCase() + moveName.substring(1);
            })
            .sort();
    }

    // Converts the API weight value to rounded pounds.
    private formatWeight(weight: number): string {
        const weightRaw: string = weight?.toString() ?? '0';
        const weightDec: string = `${weightRaw.slice(0, -1)}.${weightRaw.slice(-1)}`;
        const formattedWeight: number = 10 * (Number.parseFloat(weightDec) * 0.220462);
        return Math.round(Number.isFinite(formattedWeight) ? formattedWeight : 0).toString();
    }

    // Converts the API height value to rounded inches.
    private formatHeight(height: number): string {
        const heightRaw: string = height?.toString() ?? '0';
        const formattedHeight: number = Number.parseFloat(heightRaw) * 3.93701;
        return Math.round(Number.isFinite(formattedHeight) ? formattedHeight : 0).toString();
    }

    // Reads a top-level sprite string from the current sprite payload.
    private getSpriteValue(spriteKey: string): string {
        const spriteValue: unknown = this.pokemonSprites[spriteKey];
        return typeof spriteValue === 'string' ? spriteValue : '';
    }

    // Reads a nested sprite string from the current sprite payload.
    private getNestedSpriteValue(path: string[]): string {
        let currentValue: unknown = this.pokemonSprites;

        for (const pathPart of path) {
            if (typeof currentValue !== 'object' || currentValue === null || !(pathPart in currentValue)) {
                return '';
            }
            currentValue = (currentValue as Record<string, unknown>)[pathPart];
        }

        return typeof currentValue === 'string' ? currentValue : '';
    }
}
