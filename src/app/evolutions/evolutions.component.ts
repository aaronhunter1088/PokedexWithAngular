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
    pokemonIdAndAttributesMap = new Map<number, Map<string, any>>()
    specificAttributesMap = new Map<string, any>()
    pokemonMap = new Map
    pokemonFamilySize: number
    defaultImagePresent: boolean = false
    gifImagePresent: boolean = false
    sprites: any = {}
    stages: number[] = []
    stage: number = 0
    doesPokemonEvolve: boolean = false;
    isBabyPokemon: boolean = false;
    counter: number = 0;
    itemCounter: number = 0;
    attrCounter: number = 0;
    babyCounter: number = 0;

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
                        // let chainRes = this.pokemonService.getPokemonChainData(this.pokemonChainID.toString());
                        // chainRes.then((chain:any) => {
                        //   this.getEvolutionDetails(chain['chain']) //, this.specificAttributesMap, this.pokemonIdAndAttributesMap)
                        // }).then(() => {
                        //   this.allIDs.forEach(id => {
                        //     if (!this.pokemonIdAndAttributesMap.has(id)) {
                        //       console.log(id, " not found in attrMapNew. populating with default attrMapNew")
                        //       this.pokemonIdAndAttributesMap.set(id, this.generateDefaultAttributesMap())
                        //     }
                        //   })
                        // }).then(() => {
                        //   this.cleanupAttributesMap()
                        // })
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
                    this.pokemonService.getPokemonSpeciesData(pokemonResponse['species'].url) // pokemonResponse['species'].url
                        .then((speciesData: any) => {
                            let pokemon = this.createPokemon(pokemonResponse, speciesData);
                            pokemonList.push(pokemon);
                        });
                })
            //pokemonList.sort(function (a, b) { return a.id-b.id; });
            //console.log("adding list to familyList: ", pokemonList, " length is ", pokemonList.length)
            //this.pokemonFamily.push(pokemonList);
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
        //this.pokemonFamilyLevelsMap = new Map<number, number>()
        this.pokemonFamilyAltLevels = []
        //this.isBabyPokemonMap = new Map<number, boolean>()
        //this.specificAttributesMap = new Map<string, any>()
        this.allIDs = []
        this.stages = []
        this.stage = 0
        this.counter = 0
        //this.babyCounter = 0;
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
        //console.log("getPokemonSpritesEvolutions");
        //console.log(sprites['front_default']);
        let frontImg = sprites['front_default'] != null ? sprites['front_default'] : "./assets/images/pokeball1.jpg"
        this.defaultImagePresent = frontImg != null;
        let shinyImg = sprites['front_shiny'];
        let officialImg = otherSprites['official-artwork'].front_default;
        let gifImg = pokemonResponse['sprites']['versions']['generation-v']['black-white']['animated'].front_default;
        //console.log("MAP size", this.attrMapNew.size)
        //console.log("attrMap for pokemon: ",pokemonResponse.name, " ", this.pokemonIdAndAttributesMap.get(pokemonResponse.id))
        //let specifics = this.pokemonIdAndAttributesMap.get(pokemonResponse.id); // is a map
        // @ts-ignore
        //let level = <any>specifics.get("min_level")
        //console.log("res.id[",pokemonResponse.id,"]")
        //console.log("level[", level, "]"," name[",pokemonResponse.name,"]")
        // @ts-ignore
        //let isBabyPokemon = <boolean>specifics.get("is_baby")
        //console.log(pokemonResponse.name, " isBaby: ", this.isBabyPokemonMap.get(pokemonResponse.id));
        // check pokemonResponse.id with chainMap
        //let chainIDToCheck = this.getEvolutionChainID(pokemonResponse.id);
        //let idsInChainCheck = this.pokemonIDToEvolutionChainMap.get(chainIDToCheck); // ex: [[19,10091], [20,10092,10093] ]]
        //let listCount = 0;
        // //@ts-ignore
        // idsInChainCheck.every(listOfIDs => {
        //   let found = false;
        //   if (listOfIDs.includes(pokemonResponse.id)) {
        //     found = true;
        //     let idToUse = listOfIDs[0];
        //     // @ts-ignore
        //     level = this.pokemonIdAndAttributesMap.get(idToUse).get("min_level")
        //     // if is a gmax pokemon, set to 0
        //     if (pokemonResponse.name.split("-")[1] === "gmax") {
        //       level = null;
        //     }
        //     return;
        //   }
        //   if (found) return false; // to break out of every
        //   else listCount += 1;
        // })
        // listCount = 0;
        // //item. item can be different. not always the same
        // // @ts-ignore
        // //let evolvesWithItem = <any>specifics.get("use_item")
        // //console.log("evolvesWithItem: ", evolvesWithItem)
        // // @ts-ignore
        // idsInChainCheck.every(listOfIDs => {
        //   let found = false;
        //   if (pokemonResponse.name.split("-")[1] === "gmax") {
        //     evolvesWithItem = null;
        //     return false;
        //   }
        //   if (listOfIDs.includes(pokemonResponse.id)) {
        //     found = true;
        //     let idToUse = listOfIDs[0];
        //     // @ts-ignore
        //     evolvesWithItem = this.pokemonIdAndAttributesMap.get(idToUse).get("use_item")
        //     if (evolvesWithItem != null && !(evolvesWithItem instanceof Array)) {
        //       evolvesWithItem = this.checkTypeAndUpdateIfNecessary(pokemonResponse.id, evolvesWithItem, pokemonResponse.types)
        //     } else {
        //       // @ts-ignore
        //       evolvesWithItem = this.pokemonIdAndAttributesMap.get(idToUse).get("use_item")
        //     }
        //   }
        //   if (found) return false; // to break out of every
        //   else listCount += 1;
        // })
        //listCount = 0;
        //let doesEvolveWithItem = evolvesWithItem != null
        // min hap
        // @ts-ignore
        //let minHappiness = <number>specifics.get("min_happiness")
        //let evolvesByHappinessAttribute = minHappiness != null
        // held_item
        // @ts-ignore
        //let held_item = <any>specifics.get("held_item")
        //let doesEvolveWithHeldItem = held_item != null
        // evolving can occur based on level, item, or specific attribute
        //this.doesPokemonEvolve = this.determineIfPokemonEvolves(level, isBabyPokemon, doesEvolveWithItem, doesEvolveWithHeldItem, evolvesByHappinessAttribute)
        // edit weight
        let adjustedWeight = pokemonResponse.weight.toString()
        //console.log("'"+weight.slice(0,-1)+"'" + "." + "'"+weight.slice(-1)+"'")
        adjustedWeight = adjustedWeight.slice(0, -1) + '.' + adjustedWeight.slice(-1)
        //pokemon.weight = weight
        // edit height
        let adjustedHeight = pokemonResponse.height.toString();
        if (adjustedHeight.length == 1) adjustedHeight = "0." + adjustedHeight
        else adjustedHeight = adjustedHeight.slice(0, -1) + '.' + adjustedHeight.slice(-1)
        //pokemon.height = height;
        let pokemon = {
            id: pokemonResponse.id,
            name: pokemonResponse.name,
            height: adjustedHeight,
            weight: adjustedWeight,
            color: speciesData['color'].name,
            type: pokemonType,
            photo: this.defaultImagePresent ? frontImg : officialImg
        }
        //evolutionLevel: level,
        //evolves: this.doesPokemonEvolve,
        //doesEvolvesWithItem: doesEvolveWithItem,
        //evolvesByUsingItem: evolvesWithItem,
        //doesEvolveWithHeldItem: doesEvolveWithHeldItem,
        //held_item: held_item,
        //evolvesByHappinessAttribute: evolvesByHappinessAttribute,
        //happinessAttribute: minHappiness,
        //isBaby: isBabyPokemon //this.isBabyPokemonMap.get(pokemonResponse.id)
        //}
        //console.log("pokemon: ", pokemon)
        //console.log("attrMap for pokemon after: ",pokemonResponse.name, " ", this.attrMapNew.get(pokemonResponse.id))
        return pokemon;
    }

    // determineIfPokemonEvolves(level: any, isBabyPokemon: boolean, evolvesWithItem: any, evolvesWithHeldItem: any, evolvesByHappinessAttribute: any) {
    //   return (level > 0 || level!=null) ||
    //     isBabyPokemon ||
    //     evolvesWithItem ||
    //     evolvesWithHeldItem ||
    //     evolvesByHappinessAttribute
    // }

    // getEvolutionDetails(chain: any) {
    //   //console.log("chain: ",chain);
    //   let name = chain['species'].name
    //   let pkmnId = chain['species'].url.split("/")[6]
    //   let evolutionDetails: any;
    //   //console.log("name: ", name, " id: ", pkmnId)
    //   for (let i = 0; i < chain['evolves_to'].length; i++) {
    //     let evolvesTo = chain['evolves_to'][i]
    //     for (let j=0; j < evolvesTo['evolution_details'].length; j++) {
    //       // possibility of multiple evolution_details
    //       evolutionDetails = evolvesTo['evolution_details'][j]
    //       evolutionDetails.isBaby = chain.is_baby
    //       evolutionDetails.id = pkmnId
    //       evolutionDetails.name = name
    //       // setup attributesMap
    //       if (this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)) == null) {
    //         this.setAttributesMap(evolutionDetails);
    //       } else {
    //         this.updateAttributesMap(evolutionDetails, <Map<string, any>>this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)))
    //       }
    //       //this.pokemonIdAndAttributesMap.set(pkmnId, this.specificAttributesMap);
    //       //this.specificAttributesMap = this.generateDefaultAttributesMap()
    //       //console.log("evolution_details for:", name, " id: ", pkmnId, " ", evolutionDetails)
    //       this.getEvolutionDetails(evolvesTo) //, attributesMap, pokemonMap)
    //     }
    //     if (evolvesTo['evolves_to'].length > 0) {
    //       if (evolvesTo['evolves_to'].length > 1) {console.log("Printing final stage names")}
    //       else {console.log("Printing final stage name")}
    //       for (let j=0; j<evolvesTo['evolves_to'].length; j++) {
    //         //console.log(evolvesTo['evolves_to'][j]['species'])
    //         name = evolvesTo['evolves_to'][j]['species'].name
    //         pkmnId = evolvesTo['evolves_to'][j]['species'].url.split("/")[6]
    //         evolutionDetails = []//
    //         // evolvesTo['evolves_to'][j]['evolution_details'][0]
    //         evolutionDetails.isBaby = evolvesTo.is_baby
    //         evolutionDetails.id = pkmnId
    //         evolutionDetails.name = name
    //         this.setAttributesMap(evolutionDetails)
    //         this.pokemonIdAndAttributesMap.set(Number.parseInt(pkmnId), this.specificAttributesMap)
    //       }
    //       //printPokemonMap(pokemonMap)
    //     }
    //     else {
    //       //console.log("All Pokemon discovered")
    //     }
    //   }
    //   //console.log("Reset attributesMap for next Pokemon")
    //   //attributesMap = createAttributesMap(); // reset
    // }

    // updateAttributesMap(details: any, attributesMap: Map<string, any>) {
    //   //console.log("updating map for:", attributesMap.get("name"), " ", details)
    //   console.log("evolution_detailsU for:", attributesMap.get("name"), " ", details)
    //   //attributesMap.set("name", attributesMap.get("name"))
    //   if (details?.gender != null) {
    //     if (attributesMap.get("gender") == null) {
    //       attributesMap.set("gender",details.gender)
    //     } else {
    //       let gender = attributesMap.get("gender")
    //       let newGender = details?.gender
    //       let genders = (gender instanceof Array) ? gender : Array.of(gender)
    //       genders.push(newGender)
    //       attributesMap.set("gender", genders)
    //     }
    //   }
    //   if (details?.held_item != null) {
    //     if (attributesMap.get("held_item") == null) {
    //       attributesMap.set("held_item", Array.of(details.held_item.name))
    //     } else {
    //       let heldItem = attributesMap.get("held_item")
    //       let newHeldItem = details.held_item.name
    //       let heldItems = (heldItem instanceof Array) ? heldItem : Array.of(heldItem)
    //       heldItems.push(newHeldItem)
    //       attributesMap.set("held_item", heldItems)
    //     }
    //   }
    //   if (details?.item != null) {
    //     if (attributesMap.get("use_item") == null) {
    //       attributesMap.set("use_item", Array.of(details.item.name))
    //     } else {
    //       let item = attributesMap.get("use_item")
    //       let newItem = details.item.name
    //       let items = (item instanceof Array) ? item : Array.of(item)
    //       items.push(newItem)
    //       attributesMap.set("use_item", items)
    //     }
    //   }
    //   if (details?.min_happiness != null) {
    //     if (attributesMap.get("min_happiness") == null) {
    //       attributesMap.set("min_happiness", Array.of(details.min_happiness))
    //     } else {
    //       let minHappy = attributesMap.get("min_happiness")
    //       let newMinHappy = details.min_happiness
    //       let happinesses = (minHappy instanceof Array) ? minHappy : Array.of(minHappy)
    //       happinesses.push(newMinHappy)
    //       attributesMap.set("min_happiness", happinesses)
    //     }
    //   }
    //   if (details?.time_of_day != null && details?.time_of_day !== '') {
    //     if (attributesMap.get("time_of_day") == null) {
    //       attributesMap.set("time_of_day", Array.of(details.time_of_day))
    //     } else {
    //       let timeOfDay = attributesMap.get("time_of_day")
    //       let newTimeOfDay = details.time_of_day
    //       let timeOfDays = (timeOfDay instanceof Array) ? timeOfDay : Array.of(timeOfDay)
    //       timeOfDays.push(newTimeOfDay)
    //       attributesMap.set("time_of_day", timeOfDays)
    //     }
    //   }
    //   if (details?.location != null) {
    //     if (attributesMap.get("location") == null) {
    //       attributesMap.set("location", Array.of(details.location.name))
    //     } else {
    //       let location = attributesMap.get("location")
    //       let newLocation = details.location.name
    //       let locations = (location instanceof Array) ? location : Array.of(location)
    //       locations.push(newLocation)
    //       attributesMap.set("location", locations)
    //     }
    //   }
    //   if (details?.needs_overworld_rain != null) {
    //     if (attributesMap.get("needs_rain") == null) {
    //       attributesMap.set("needs_rain", Array.of(details.needs_overworld_rain))
    //     } else {
    //       let needsRain = attributesMap.get("needs_rain")
    //       let newNeedsRain = details.needs_overworld_rain
    //       let needsRains = (needsRain instanceof Array) ? needsRain : Array.of(needsRain)
    //       needsRains.push(newNeedsRain)
    //       attributesMap.set("needs_rain", needsRains)
    //     }
    //   }
    //   if (details?.min_affection != null) {
    //     if (attributesMap.get("min_affection") == null) {
    //       attributesMap.set("min_affection", Array.of(details.min_affection))
    //     } else {
    //       let minAffection = attributesMap.get("min_affection")
    //       let newMinAffection = details.min_affection
    //       let minAffections = (minAffection instanceof Array) ? minAffection : Array.of(minAffection)
    //       minAffections.push(newMinAffection)
    //       attributesMap.set("min_affection", minAffections)
    //     }
    //   }
    //   if (details?.min_beauty != null) {
    //     if (attributesMap.get("min_beauty") == null) {
    //       attributesMap.set("min_beauty", Array.of(details.min_beauty))
    //     } else {
    //       let minBeauty = attributesMap.get("min_beauty")
    //       let newMinBeauty = details.min_beauty
    //       let minBeauties = (minBeauty instanceof Array) ? minBeauty : Array.of(minBeauty)
    //       minBeauties.push(newMinBeauty)
    //       attributesMap.set("min_beauty", minBeauties)
    //     }
    //   }
    //   if (details?.known_move != null) {
    //     if (attributesMap.get("known_move") == null) {
    //       attributesMap.set("known_move", Array.of(details.known_move.name))
    //     } else {
    //       let knownMove = attributesMap.get("known_move")
    //       let newKnownMove = details.known_move.name
    //       let knownMoves = (knownMove instanceof Array) ? knownMove : Array.of(knownMove)
    //       knownMoves.push(newKnownMove)
    //       attributesMap.set("known_move", knownMoves)
    //     }
    //   }
    //   if (details?.known_move_type != null) {
    //     if (attributesMap.get("known_move_type") == null) {
    //       attributesMap.set("known_move_type", Array.of(details.known_move_type.name))
    //     } else {
    //       let knownMoveType = attributesMap.get("known_move_type")
    //       let newKnownMoveType = details.known_move_type.name
    //       let knownMoveTypes = (knownMoveType instanceof Array) ? knownMoveType : Array.of(knownMoveType)
    //       knownMoveTypes.push(newKnownMoveType)
    //       attributesMap.set("known_move_type", knownMoveTypes)
    //     }
    //   }
    //   if (details?.party_species != null) {
    //     if (attributesMap.get("party_species") == null) {
    //       attributesMap.set("party_species", Array.of(details.party_species))
    //     } else {
    //       let partySpecies = attributesMap.get("party_species")
    //       let newPartySpecies = details.party_species
    //       let partySpeciesList = (partySpecies instanceof Array) ? partySpecies : Array.of(partySpecies)
    //       partySpeciesList.push(newPartySpecies)
    //       attributesMap.set("party_species", partySpeciesList)
    //     }
    //   }
    //   if (details?.relative_physical_stats != null) {
    //     if (attributesMap.get("relative_physical_stats") == null) {
    //       attributesMap.set("relative_physical_stats", Array.of(details.relative_physical_stats))
    //     } else {
    //       let relPhysicalStat = attributesMap.get("relative_physical_stats")
    //       let newRelPhysicalStat = details.relative_physical_stats
    //       let relPhysicalStats = (relPhysicalStat instanceof Array) ? relPhysicalStat : Array.of(relPhysicalStat)
    //       relPhysicalStats.push(newRelPhysicalStat)
    //       attributesMap.set("relative_physical_stats", relPhysicalStats)
    //     }
    //   }
    //   if (details?.trade_species != null) {
    //     if (attributesMap.get("trade_species") == null) {
    //       attributesMap.set("trade_species", Array.of(details.trade_species))
    //     } else {
    //       let tradeSpecies = attributesMap.get("trade_species")
    //       let newTradeSpecies = details.trade_species
    //       let tradeSpeciesList = (tradeSpecies instanceof Array) ? tradeSpecies : Array.of(tradeSpecies)
    //       tradeSpeciesList.push(newTradeSpecies)
    //       attributesMap.set("trade_species", tradeSpeciesList)
    //     }
    //   }
    //   if (details?.turn_upside_down != null) {
    //     if (attributesMap.get("turn_upside_down") == null) {
    //       attributesMap.set("turn_upside_down", Array.of(details.turn_upside_down))
    //     } else {
    //       let turnUpsideDown = attributesMap.get("turn_upside_down")
    //       let newTurnUpsideDown = details.turn_upside_down
    //       let turnUpsideDownList = (turnUpsideDown instanceof Array) ? turnUpsideDown : Array.of(turnUpsideDown)
    //       turnUpsideDownList.push(newTurnUpsideDown)
    //       attributesMap.set("turn_upside_down", turnUpsideDownList)
    //     }
    //   }
    //   this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), attributesMap)
    //   //return this.specificAttributesMap;
    // }

    // setAttributesMap(details: any) {
    //   console.log("evolution_details for:", details.name, " ", details)
    //   this.specificAttributesMap = this.generateDefaultAttributesMap()
    //   //if (details == null) return attributesMap
    //   if (this.specificAttributesMap.get("name") == null) this.specificAttributesMap.set("name", details.name)
    //   if (this.specificAttributesMap.get("gender") == null) this.specificAttributesMap.set("gender", details?.gender ? details.gender : null)
    //   if (this.specificAttributesMap.get("is_baby") == null) this.specificAttributesMap.set("is_baby", details?.isBaby)
    //   if (this.specificAttributesMap.get("held_item") == null) {
    //     this.specificAttributesMap.set("held_item", details?.held_item?.name ? Array.of(details.held_item.name) : null)
    //   }
    //   if (this.specificAttributesMap.get("use_item") == null) {
    //     this.specificAttributesMap.set("use_item", details?.item?.name ? Array.of(details.item.name) : null)
    //   }
    //   if (this.specificAttributesMap.get("min_happiness") == null) {
    //     this.specificAttributesMap.set("min_happiness", details?.min_happiness ? Array.of(details.min_happiness) : null)
    //   }
    //   if (this.specificAttributesMap.get("min_level") == null) {
    //     this.specificAttributesMap.set("min_level", details?.min_level ? Array.of(details.min_level) : null)
    //   }
    //   if (this.specificAttributesMap.get("time_of_day") == null) {
    //     if (details?.time_of_day == null && details?.time_of_day !== '') {
    //       this.specificAttributesMap.set("time_of_day", details?.time_of_day ? Array.of(details.time_of_day) : null)
    //     }
    //   }
    //   if (this.specificAttributesMap.get("location") == null) {
    //     this.specificAttributesMap.set("location", details?.location?.name ? Array.of(details.location.name) : null)
    //   }
    //   if (this.specificAttributesMap.get("needs_rain") == null) {
    //     this.specificAttributesMap.set("needs_rain", details.needs_overworld_rain != null ? Array.of(details.needs_overworld_rain) : null)
    //   }
    //   if (this.specificAttributesMap.get("min_affection") == null) {
    //     this.specificAttributesMap.set("min_affection", details?.min_affection != null ? Array.of(details.min_affection) : null)
    //   }
    //   if (this.specificAttributesMap.get("min_beauty") == null) {
    //     this.specificAttributesMap.set("min_beauty", details?.min_beauty ? Array.of(details.min_beauty) : null)
    //   }
    //   if (this.specificAttributesMap.get("known_move") == null) {
    //     this.specificAttributesMap.set("known_move", details?.known_move?.name ? Array.of(details.known_move.name) : null)
    //   }
    //   if (this.specificAttributesMap.get("known_move_type") == null) {
    //     this.specificAttributesMap.set("known_move_type", details?.known_move_type?.name ? Array.of(details.known_move_type.name) : null)
    //   }
    //   if (this.specificAttributesMap.get("party_species") == null) {
    //     this.specificAttributesMap.set("party_species", details?.party_species ? Array.of(details.party_species) : null)
    //   }
    //   if (this.specificAttributesMap.get("relative_physical_stats") == null) {
    //     this.specificAttributesMap.set("relative_physical_stats", details?.relative_physical_stats ? Array.of(details.relative_physical_stats) : null)
    //   }
    //   if (this.specificAttributesMap.get("trade_species") == null) {
    //     this.specificAttributesMap.set("trade_species", details?.trade_species ? Array.of(details.trade_species) : null)
    //   }
    //   if (this.specificAttributesMap.get("turn_upside_down") == null) {
    //     this.specificAttributesMap.set("turn_upside_down", details?.turn_upside_down ? Array.of(details.turn_upside_down) : null)
    //   }
    //   this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), this.specificAttributesMap)
    // }

    // cleanupAttributesMap() {
    //   console.log("All attributes maps created: ", this.pokemonIdAndAttributesMap.size)
    //   Array.from(this.pokemonIdAndAttributesMap).forEach((innerMap) => {
    //     console.log("id: ", innerMap[0], " , map: ", innerMap[1])
    //     // clean up map, remove unnecessary duplicates
    //     // clean up min_happiness
    //     let minHappinessValues = innerMap[1].get("min_happiness")
    //     if (minHappinessValues != null) {
    //       let minHappinessSet = new Set()
    //       minHappinessValues.forEach((value: any) => {
    //         if (!minHappinessSet.has(value)) minHappinessSet.add(value)
    //       })
    //       innerMap[1].set("min_happiness", [...minHappinessSet].join(' '))
    //       this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
    //     }
    //   })
    // }

    // checkTypeAndUpdateIfNecessary(id: number, item: any, pokemonType: any): string {
    //   let type1, type2
    //   let returnItem = ''
    //   let itemFirstPart = item.split("-") // ex: ice-stone, thunder-stone ....
    //   // if one type
    //   if (pokemonType.length == 1) {
    //     type1 = pokemonType[0].type.name
    //     if (itemFirstPart != type1)
    //       returnItem = type1+"-stone"
    //   }
    //   // if two types
    //   else {
    //     type1 = pokemonType[0].type.name
    //     type2 = pokemonType[1].type.name
    //     if (itemFirstPart != type1)
    //       returnItem = type1+"-stone"
    //     else if (itemFirstPart != type2)
    //       returnItem = type2+"-stone"
    //     else
    //       returnItem = item;
    //   }
    //   console.log("returnItem: ", returnItem)
    //   return returnItem;
    // }
}
