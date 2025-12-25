import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PokemonService} from "../services/pokemon.service";

@Component({
    selector: 'app-evolutions',
    templateUrl: './evolutions.component.html',
    styleUrls: ['./evolutions.component.css'],
    standalone: false
})
export class EvolutionsComponent implements OnInit, OnChanges {

    @Input() pokemonID: string | number = ''
    pokemonIDToEvolutionChainMap = new Map<number, number[][]>()
    pokemonChainID: number
    pokemonFamilyIDs: number[][] = []
    allIDs: number[] = []
    pokemonFamily: any[][] = []
    pokemonFamilyAltLevels: any[] = []
    specificAttributesMap = new Map<string, any>()
    pokemonFamilySize: number
    defaultImagePresent: boolean = false
    gifImagePresent: boolean = false
    sprites: any = {}
    stages: number[] = []
    stage: number = 0
    counter: number = 0;

    constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {
        this.pokemonIDToEvolutionChainMap = this.pokemonService.getEvolutionsMap()
        this.specificAttributesMap = this.generateDefaultAttributesMap()
        this.pokemonChainID = 0
        this.pokemonFamilySize = 0
    }

    ngOnInit() {
        //console.log("Evolutions Page loaded");
        this.route.params
            .subscribe(params => {
                //console.log("params", params)
                if (Object.keys(params).length !== 0) {
                    //console.log("params keys.length: ", Object.keys(params).length)
                    this.pokemonID = <number>params['pokemonID'].split("=")[1].trim();
                }
                if (this.pokemonID != null) {
                    //console.log("chosen pokemon with ID: '" + this.pokemonID + "'")
                    this.resetEvolutionParameters()
                    this.pokemonChainID = this.getEvolutionChainID(Number.parseInt(this.pokemonID.toString()))
                    Array.of(this.pokemonIDToEvolutionChainMap.get(this.pokemonChainID)).forEach(family => {
                        // @ts-ignore
                        this.pokemonFamilyIDs = family; // a list of list of IDs [ [1], [2], [3,10033,10195] ]
                        this.setFamilySize();
                        this.setStages();
                        this.setAllIDs();
                    })
                    this.pokemonFamilyIDs.forEach(idList => {
                        this.createListOfPokemonForIDList(idList)
                    });

                }
            })
    }

    ngOnChanges() {
        //console.log("changes in evolutions")
    }

    // attributes map for each pokemon, which holds ALL evolution details
    generateDefaultAttributesMap() {
        return new Map<string, any>([
            ["name", null],
            ["gender", null],
            ["is_baby", null],
            ["held_item", null], // on screen
            ["use_item", null], //  on screen
            ["known_move", null],
            ["location", null],
            ["min_affection", null],
            ["min_beauty", null],
            ["min_happiness", null], // on screen
            ["min_level", null],
            ["needs_rain", null],
            ["time_of_day", null],
            ["known_move", null],
            ["known_move_type", null],
            ["party_species", null],
            ["relative_physical_stats", null],
            ["trade_species", null],
            ["turn_upside_down", null]
        ])
    }

    getEvolutionChainID(pokemonID: number): number {
        let keys = Array.from(this.pokemonIDToEvolutionChainMap.keys());
        //console.log("map keys", keys);
        let keyToReturn = 0;
        keys.forEach(key => {
            if (keyToReturn == 0) { // stop looping after chainID is found
                let pokemonIDs = this.pokemonIDToEvolutionChainMap.get(key);
                let ids: any[] = [];
                // @ts-ignore
                pokemonIDs.forEach(id => ids.push(id));
                //console.log("key: ", key, " ids: ", ids.toString())
                // @ts-ignore
                for (let listIndex = 0; listIndex < pokemonIDs.length; listIndex++) {
                    // @ts-ignore
                    let chainIDs = pokemonIDs[listIndex];
                    chainIDs.forEach(chainID => {
                        if (pokemonID == chainID) {
                            // @ts-ignore
                            //console.log(pokemonID + " found with key", key);
                            //console.log("pokemonChainID: ", key);
                            keyToReturn = key;
                            return;
                        }
                    });
                }
            }
        });
        return keyToReturn;
    }

    getPokemonSprites(pokemonID: any): any {
        this.pokemonService.getPokemonByName(pokemonID)
            .then((pokemon: any) => {
                let sprites = pokemon['sprites'];
                let otherSprites = sprites['other'];
                //console.log("getPokemonSpritesEvolutions");
                //console.log(sprites['front_default']);
                let frontImg = sprites['front_default'] != null ? sprites['front_default'] : "./assets/images/pokeball1.jpg"
                this.defaultImagePresent = frontImg != null;
                let shinyImg = sprites['front_shiny'];
                let officialImg = otherSprites['official-artwork'].front_default;
                let gifImg = pokemon['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
                this.gifImagePresent = gifImg != null;
                this.sprites = {
                    front: frontImg,
                    shiny: shinyImg,
                    official: officialImg,
                    gif: gifImg
                };
            });
        //console.log("theSprites: ", this.sprites);
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

    setFamilySize() {
        Array.from(this.pokemonFamilyIDs).forEach(idList => {
            Array.from(idList).forEach((id: any) => {
                this.pokemonFamilySize += 1;
            });
        });
        //console.log("familySize:", this.pokemonFamilySize);
    }

    setStages() {
        Array.from(this.pokemonFamilyIDs).forEach(idList => {
            this.stages.push(++this.stage);
        })
        //console.log("stages: ", this.stages.length);
    }

    setAllIDs() {
        Array.from(this.pokemonFamilyIDs).forEach(idList => {
            Array.from(idList).forEach((id: any) => {
                this.allIDs.push(id);
            });
        });
        this.allIDs.sort(function (a, b) {
            return a - b;
        })
        //console.log("allIDs: ", this.allIDs);
    }

    createListOfPokemonForIDList(idList: any[]) {
        //console.log("IDList: ", idList, " length: ", idList.length)
        let pokemonList: any[] = [];
        Array.from(idList).forEach((id: any) => {
            //console.log("id: ",id);
            pokemonList = [];
            this.pokemonService.getPokemonByName(id)
                .then((pokemonResponse: any) => {
                    this.pokemonService.getPokemonSpeciesData(pokemonResponse) // pokemonResponse['species'].url
                        .then((speciesData: any) => {
                            let pokemon = this.createPokemon(pokemonResponse, speciesData);
                            pokemonList.push(pokemon);
                        });
                })
        })
        pokemonList.sort(function (a, b) {
            return a.id - b.id;
        });
        //console.log("adding list to familyList: ", pokemonList, " length is ", pokemonList.length)
        this.pokemonFamily.push(pokemonList);
    }

    resetEvolutionParameters() {
        this.pokemonFamily = []
        this.pokemonFamilySize = 0
        this.pokemonFamilyAltLevels = []
        this.allIDs = []
        this.stages = []
        this.stage = 0
        this.counter = 0
    }

    createPokemon(pokemonResponse: any, speciesData: any): any {
        let types = pokemonResponse.types;
        let pokemonType = '';
        if (types.length > 1) {
            pokemonType = types[0].type.name[0].toUpperCase() + types[0].type.name.substring(1) + " & " + types[1].type.name[0].toUpperCase() + types[1].type.name.substring(1);
        } else {
            pokemonType = types[0].type.name[0].toUpperCase() + types[0].type.name.substring(1);
        }
        let sprites = pokemonResponse['sprites'];
        let otherSprites = sprites['other'];
        //console.log("createPokemon");
        //console.log(sprites['front_default']);
        let frontImg = sprites['front_default'] != null ? sprites['front_default'] : "./assets/images/pokeball1.jpg"
        this.defaultImagePresent = frontImg != null;
        //let shinyImg = sprites['front_shiny'];
        let officialImg = otherSprites['official-artwork'].front_default;
        //let gifImg = pokemonResponse['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
        // edit weight
        let adjustedWeight = pokemonResponse.weight.toString()
        //console.log("'"+weight.slice(0,-1)+"'" + "." + "'"+weight.slice(-1)+"'")
        adjustedWeight = adjustedWeight.slice(0, -1) + '.' + adjustedWeight.slice(-1)
        // edit height
        let adjustedHeight = pokemonResponse.height.toString();
        if (adjustedHeight.length == 1) adjustedHeight = "0." + adjustedHeight
        else adjustedHeight = adjustedHeight.slice(0, -1) + '.' + adjustedHeight.slice(-1)
        let pokemon = {
            id: pokemonResponse.id,
            name: pokemonResponse.name,
            height: adjustedHeight,
            weight: adjustedWeight,
            color: speciesData['color'].name,
            type: pokemonType,
            photo: this.defaultImagePresent ? frontImg : officialImg
        }
        return pokemon;
    }
}
