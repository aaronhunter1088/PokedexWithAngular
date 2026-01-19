import {Component, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {DarkModeService} from "../services/dark-mode.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css'],
    standalone: false
})
export class SearchComponent implements OnInit {

    // variables passed into search component
    pokemonIDName = '';
    //pokemon = '';
    pokemonName = '';
    sprites = {}; // sprites: object = {};
    species = '';
    pokemonImage = '';
    pokemonID = '';
    pokemonHeight = '';
    pokemonWeight = '';
    pokemonColor = '';
    pokemonType = [];
    pokemonDescriptions: any[] = [];
    pokemonDescription = '';
    pokemonLocations: any[] = [];
    pokemonMoves: any[] = [];
    statusCode: number = 0;

    constructor(
        private pokemonService: PokemonService,
        private darkModeService: DarkModeService
    ) {
    }

    ngOnInit(): void {
    }

    onInput(pokemonIDName: string) {
        this.pokemonIDName = pokemonIDName;
    }

    isValidName(nameOrId: string) {
        let code = 0;
        this.pokemonIDName = nameOrId.toLowerCase();
        fetch("https://pokeapi.co/api/v2/pokemon/" + this.pokemonIDName)
            .then((response) => {
                if (response.ok && nameOrId.length > 0) {
                    code = 200;
                    this.statusCode = code;
                    console.log("Response.ok and code ", code, " and name/ID is '", nameOrId, "'");
                } else if (!nameOrId) {
                    code = 400;
                    this.statusCode = code;
                    alert("Not a valid name or ID: '" + this.pokemonIDName + "' and statusCode: " + this.statusCode);
                    console.log("code", code);
                    //return;
                } else {
                    throw new Error('Something went wrong');
                }
            })
            .catch((error) => {
                code = 404;
                console.log("code", code);
                this.statusCode = code;
                this.pokemonIDName = nameOrId;
                console.log('There was an ERROR: ', error);
                alert("Not a valid name or ID: '" + this.pokemonIDName + "' and statusCode: " + this.statusCode);
            });
    }

    getPokemonInfo() {
        this.isValidName(this.pokemonIDName);
        this.pokemonDescription = '';
        this.pokemonLocations = [];
        this.pokemonMoves = [];
        this.pokemonService.getPokemonByName(this.pokemonIDName)
            .then((pokemon: any) => {
                //console.log("pokemon: ", pokemon);
                this.pokemonName = pokemon.name;
                //console.log("name: " + pokemon.name);
                this.sprites = pokemon['sprites']//<object>pokemon['sprites'];
                this.species = pokemon['species'];
                //console.log("sprites", pokemon['sprites']);
                this.pokemonImage = pokemon['sprites']['front_default'];
                //this.pokemonImage = pokemon['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
                this.pokemonName = pokemon.name;
                this.pokemonID = pokemon.id;
                this.pokemonHeight = pokemon.height;
                this.pokemonWeight = pokemon.weight;
                // get and set color, and pokemon description
                this.pokemonService.getPokemonSpeciesData(pokemon)
                    .then((speciesData: any) => {
                        //console.log("pokemon species: ", speciesData);
                        this.pokemonColor = speciesData['color']['name'];
                        this.setBackgroundColor();
                        this.pokemonDescriptions = speciesData.flavor_text_entries;
                        this.pokemonDescription = this.getEnglishDescriptions();
                    }); //.subscribe
                // parse over the types
                this.pokemonType = pokemon.types;
                //console.log("pokemonType", pokemon.types);
                if (this.pokemonType.length > 1) {
                    // @ts-ignore
                    this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1) + " and " + this.pokemonType[1].type.name[0].toUpperCase() + this.pokemonType[1].type.name.substring(1);
                } else {
                    // @ts-ignore
                    this.pokemonType = this.pokemonType[0].type.name[0].toUpperCase() + this.pokemonType[0].type.name.substring(1);
                }
                // locations
                this.pokemonService.getPokemonLocationEncounters(this.pokemonID).then(
                    (locations: any) => {
                        if (locations.length == 0) {
                            this.pokemonLocations.push("No known locations!");
                        } else {
                            locations.forEach((location: any) => {
                                let names = location['location_area']['name'].split("-")
                                let newName = '';
                                names.forEach((name: string) => {
                                    name = name[0].toUpperCase() + name.substring(1);
                                    newName += name + " ";
                                    //console.log(newName);
                                });
                                this.pokemonLocations.push(newName);
                            });
                            this.pokemonLocations.sort();
                        }
                    });
                // moves
                let allMoves = pokemon['moves'];
                //console.log("all moves: ");
                //console.log(allMoves);
                for (let i = 0; i < allMoves.length; i++) {
                    //console.log("move: ");
                    //console.log(allMoves[i]['move'].name);
                    let move = allMoves[i]['move'].name;
                    move = move[0].toUpperCase() + move.substring(1);
                    this.pokemonMoves.push(move);
                }
                this.pokemonMoves.sort();
            })
            .catch((error: any) => {
                console.log("Couldn't get Pokemon info with: '" + this.pokemonIDName + "'");
                console.log(error);
            });
        this.pokemonIDName = '';
    }

    setBackgroundColor() {
        // Don't override body background in dark mode
        // Instead, we'll just store the color for potential use
        // The dark mode service handles the body background
    }

    getEnglishDescriptions() {
        let englishDescriptions: any = [];
        for (let i = 0; i < this.pokemonDescriptions.length; i++) {
            // @ts-ignore
            if (this.pokemonDescriptions[i].language.name === "en") {
                //console.log("desc: ", this.pokemonDescriptions[i]);
                englishDescriptions.push(this.pokemonDescriptions[i])
            }
        }
        // @ts-ignore
        if (englishDescriptions.length > 0) {
            let randomIndex = Math.floor(Math.random() * englishDescriptions.length - 1)
            if (randomIndex < 0) randomIndex = 0
            this.pokemonDescription = englishDescriptions[randomIndex].flavor_text
        } else {
            this.pokemonDescription = "No descriptions were found!"
        }
        //console.log(this.pokemonDescription);
        return this.pokemonDescription
    }
}
