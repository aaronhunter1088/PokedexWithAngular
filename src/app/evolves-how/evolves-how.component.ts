import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {PokemonService} from "../services/pokemon.service";

@Component({
    selector: 'app-evolves-how',
    templateUrl: './evolves-how.component.html',
    styleUrls: ['./evolves-how.component.css'],
    standalone: false
})
export class EvolvesHowComponent implements OnInit {

    @Input() pokemonID: string | number = ''

    pokemonIdAndAttributesMap = new Map<number, Map<string, any>>()
    specificAttributesMap = new Map<string, any>()
    pokemonIDToEvolutionChainMap = new Map<number, number[][]>()
    pokemonChainID: number = 0
    allIDs: number[] = []
    family: number[][] = []
    doesPokemonEvolve: boolean = false
    hasMinimumLevel: boolean = false
    minimumLevel: number = 0
    hasUseItem: boolean = false
    useItem: any
    hasHeldItem: boolean = false
    hasMinimumHappiness: boolean = false
    minimumHappiness: any
    heldItem: any
    isABaby: boolean = false
    hasDayNight: boolean = false
    dayNight: any
    hasLocations: boolean = false
    locations: any
    hasMinimumAffection: boolean = false
    minimumAffection: any
    hasBeauty: boolean = false
    minimumBeauty: any
    hasKnownMoves: boolean = false
    knownMoves: any
    hasKnownMoveType: boolean = false
    knownMoveTypes: any
    hasNeedsRain: boolean = false
    needsRain: any
    // other attributes
    hasTurnUpsideDown: boolean = false
    turnUpsideDown: any
    hasTradeSpecies: boolean = false
    tradeSpecies: any
    emptyChain: boolean = true;

    constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {
        this.pokemonIDToEvolutionChainMap = this.pokemonService.getEvolutionsMap()
        this.specificAttributesMap = this.generateDefaultAttributesMap()
    }

    ngOnInit(): void {
        //console.log("EVOLVES HOW starting with ID: ", this.pokemonID)
        this.pokemonChainID = this.getEvolutionChainID(Number.parseInt(this.pokemonID.toString()))
        console.log("Chain: ", this.pokemonChainID)
        // @ts-ignore
        this.family = this.pokemonIDToEvolutionChainMap.get(this.pokemonChainID);
        // @ts-ignore
        this.family.forEach(list => {
            list.forEach((id: number) => {
                this.allIDs.push(id)
            })
        })
        console.log("family: ", this.allIDs)
        if (this.pokemonChainID != 0) {
            let chainRes = this.pokemonService.getPokemonChainData(this.pokemonChainID.toString())
            chainRes
                .then((chain: any) => {
                    if (chain.length == 0) return
                    else {
                        this.emptyChain = false;
                        this.getEvolutionDetails(chain['chain'])
                    }
                })
                .then(() => {
                    //console.log("keys in main map: ", this.pokemonIdAndAttributesMap.keys())
                    this.allIDs.forEach(id => {
                        console.log("checking map for existence: ", id)
                        if (!this.pokemonIdAndAttributesMap.has(id)) {
                            // FIRST, check if there are similar forms. if so, populate missing id with existing map
                            //this.matchSiblingPokemonWithSiblingAttributeMap(id)
                            console.log(id, " not found! populating with default attrMap")
                            this.pokemonIdAndAttributesMap.set(id, this.generateDefaultAttributesMap())
                        }
                    })
                })
                .then(() => {
                    this.cleanupAttributesMap()
                    console.log("Attributes map cleaned up in Evolves-how")
                })
                .then(() => {
                    // @ts-ignore
                    this.specificAttributesMap = this.pokemonIdAndAttributesMap.get(Number.parseInt(this.pokemonID.toString()))
                    this.hasMinimumLevel = this.specificAttributesMap.get("min_level") != null
                    if (this.hasMinimumLevel) this.minimumLevel = this.specificAttributesMap.get("min_level")
                    this.hasHeldItem = this.specificAttributesMap.get("held_item") != null
                    if (this.hasHeldItem) this.heldItem = this.specificAttributesMap.get("held_item")
                    this.hasUseItem = this.specificAttributesMap.get("use_item") != null
                    if (this.hasUseItem) this.useItem = this.specificAttributesMap.get("use_item")
                    this.isABaby = this.specificAttributesMap.get("is_baby") != null && this.specificAttributesMap.get("is_baby") != false
                    this.hasMinimumHappiness = this.specificAttributesMap.get("min_happiness") != null
                    if (this.hasMinimumHappiness) this.minimumHappiness = this.specificAttributesMap.get("min_happiness")
                    this.hasDayNight = this.specificAttributesMap.get("time_of_day")
                    if (this.hasDayNight) this.dayNight = this.specificAttributesMap.get("time_of_day")
                    this.hasLocations = this.specificAttributesMap.get("location")
                    if (this.hasLocations) this.locations = this.specificAttributesMap.get("location")
                    this.hasMinimumAffection = this.specificAttributesMap.get("min_affection")
                    if (this.hasMinimumAffection) this.minimumAffection = this.specificAttributesMap.get("min_affection")
                    this.hasBeauty = this.specificAttributesMap.get("min_beauty")
                    if (this.hasBeauty) this.minimumBeauty = this.specificAttributesMap.get("min_beauty")
                    this.hasKnownMoves = this.specificAttributesMap.get("known_move")
                    if (this.hasKnownMoves) this.knownMoves = this.specificAttributesMap.get("known_move")
                    this.hasKnownMoveType = this.specificAttributesMap.get("known_move_type")
                    if (this.hasKnownMoveType) this.knownMoveTypes = this.specificAttributesMap.get("known_move_type")
                    this.hasNeedsRain = this.specificAttributesMap.get("needs_rain") != null ? this.specificAttributesMap.get("needs_rain")[0] : this.specificAttributesMap.get("needs_rain")
                    if (this.hasNeedsRain) this.needsRain = this.specificAttributesMap.get("needs_rain")
                    // other attributes
                    this.hasTurnUpsideDown = this.specificAttributesMap.get("turn_upside_down") != null ? this.specificAttributesMap.get("turn_upside_down")[0] : this.specificAttributesMap.get("turn_upside_down")
                    if (this.hasTurnUpsideDown) this.turnUpsideDown = this.specificAttributesMap.get("turn_upside_down")
                    this.hasTradeSpecies = this.specificAttributesMap.get("trade_species") != null ? this.specificAttributesMap.get("trade_species")[0] : this.specificAttributesMap.get("trade_species")
                    //if (this.tradeSpecies) this.tradeSpecies = this.specificAttributesMap.get("trade_species")
                    // @ts-ignore
                    this.doesPokemonEvolve = this.determineIfPokemonEvolves(
                        this.hasMinimumLevel, this.isABaby, this.hasUseItem, this.hasHeldItem, this.hasMinimumHappiness, this.hasBeauty,
                        this.hasMinimumAffection, this.hasDayNight, this.hasKnownMoves, this.hasNeedsRain, this.hasTradeSpecies
                    )
                    console.log("does pokemon evolve: ", this.doesPokemonEvolve)
                })
        }
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
                            //console.log("EVOLVESHOW KEY: ", key);
                            keyToReturn = key;
                            return;
                        }
                    });
                }
            }
        });
        return keyToReturn;
    }

    generateDefaultAttributesMap() {
        return new Map<string, any>([
            ["name", null], // on screen
            ["gender", null],
            ["is_baby", null],
            ["held_item", null], // on screen
            ["use_item", null], //  on screen
            ["known_move", null], // on screen
            ["location", null], // on screen
            ["min_affection", null], // on screen
            ["min_beauty", null], // on screen
            ["min_happiness", null], // on screen
            ["min_level", null], // on screen
            ["needs_rain", null], // on screen
            ["time_of_day", null], // on screen
            ["known_move_type", null], // on screen
            ["party_species", null],
            ["relative_physical_stats", null],
            ["trade_species", null],
            ["turn_upside_down", null] // on screen
        ])
    }

    getEvolutionDetails(chain: any) {
        console.log("chain: ", chain);
        let name = chain['species'].name
        let pkmnId = chain['species'].url.split("/")[6]
        let evolutionDetails: any;
        console.log("name: ", name, " id: ", pkmnId)
        for (let i = 0; i < chain['evolves_to'].length; i++) {
            let evolvesTo = chain['evolves_to'][i]
            for (let j = 0; j < evolvesTo['evolution_details'].length; j++) {
                // possibility of multiple evolution_details
                evolutionDetails = evolvesTo['evolution_details'][j]
                evolutionDetails.isBaby = chain.is_baby
                evolutionDetails.id = pkmnId
                evolutionDetails.name = name
                // setup attributesMap
                if (this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)) == null) {
                    this.setAttributesMap(evolutionDetails);
                } else {
                    this.updateAttributesMap(evolutionDetails, <Map<string, any>>this.pokemonIdAndAttributesMap.get(Number.parseInt(pkmnId)))
                }
                this.getEvolutionDetails(evolvesTo) //, attributesMap, pokemonMap)
            }
            if (evolvesTo['evolves_to'].length >= 0) {
                if (evolvesTo['evolves_to'].length > 1) {
                    console.log("Printing final stage names")
                } else {
                    console.log("Printing final stage name")
                }
                for (let j = 0; j < evolvesTo['evolves_to'].length; j++) {
                    //console.log(evolvesTo['evolves_to'][j]['species'])
                    name = evolvesTo['evolves_to'][j]['species'].name
                    pkmnId = evolvesTo['evolves_to'][j]['species'].url.split("/")[6]
                    evolutionDetails = []//
                    // evolvesTo['evolves_to'][j]['evolution_details'][0]
                    evolutionDetails.isBaby = evolvesTo.is_baby
                    evolutionDetails.id = pkmnId
                    evolutionDetails.name = name
                    this.setAttributesMap(evolutionDetails)
                    this.pokemonIdAndAttributesMap.set(Number.parseInt(pkmnId), this.specificAttributesMap)
                }
                //printPokemonMap(pokemonMap)
            } else {
                //console.log("All Pokemon discovered")
            }
        }
        //console.log("Reset attributesMap for next Pokemon")
        //attributesMap = createAttributesMap(); // reset
    }

    updateAttributesMap(details: any, attributesMap: Map<string, any>) {
        //console.log("updating map for:", attributesMap.get("name"), " ", details)
        console.log("evolution_detailsU for:", attributesMap.get("name"), " ", details)
        //attributesMap.set("name", attributesMap.get("name"))
        if (details?.gender != null) {
            if (attributesMap.get("gender") == null) {
                attributesMap.set("gender", details.gender)
            } else {
                let gender = attributesMap.get("gender")
                let newGender = details?.gender
                let genders = (gender instanceof Array) ? gender : Array.of(gender)
                genders.push(newGender)
                attributesMap.set("gender", genders)
            }
        }
        if (details?.held_item != null) {
            if (attributesMap.get("held_item") == null) {
                attributesMap.set("held_item", Array.of(details.held_item.name))
            } else {
                let heldItem = attributesMap.get("held_item")
                let newHeldItem = details.held_item.name
                let heldItems = (heldItem instanceof Array) ? heldItem : Array.of(heldItem)
                heldItems.push(newHeldItem)
                attributesMap.set("held_item", heldItems)
            }
        }
        if (details?.item != null) {
            if (attributesMap.get("use_item") == null) {
                attributesMap.set("use_item", Array.of(details.item.name))
            } else {
                let item = attributesMap.get("use_item")
                let newItem = details.item.name
                let items = (item instanceof Array) ? item : Array.of(item)
                items.push(newItem)
                attributesMap.set("use_item", items)
            }
        }
        if (details?.min_happiness != null) {
            if (attributesMap.get("min_happiness") == null) {
                attributesMap.set("min_happiness", Array.of(details.min_happiness))
            } else {
                let minHappy = attributesMap.get("min_happiness")
                let newMinHappy = details.min_happiness
                let happinesses = (minHappy instanceof Array) ? minHappy : Array.of(minHappy)
                happinesses.push(newMinHappy)
                attributesMap.set("min_happiness", happinesses)
            }
        }
        if (details?.time_of_day != null && details?.time_of_day != "") {
            if (attributesMap.get("time_of_day") == null) {
                attributesMap.set("time_of_day", Array.of(details?.time_of_day))
            } else {
                let timeOfDay = attributesMap.get("time_of_day")
                let newTimeOfDay = details.time_of_day
                let timeOfDays = (timeOfDay instanceof Array) ? timeOfDay : Array.of(timeOfDay)
                timeOfDays.push(newTimeOfDay)
                attributesMap.set("time_of_day", timeOfDays)
            }
        }
        if (details?.location != null) {
            if (attributesMap.get("location") == null) {
                attributesMap.set("location", Array.of(details.location.name))
            } else {
                let location = attributesMap.get("location")
                let newLocation = details.location.name
                let locations = (location instanceof Array) ? location : Array.of(location)
                locations.push(newLocation)
                attributesMap.set("location", locations)
            }
        }
        if (details?.needs_overworld_rain != null) {
            if (attributesMap.get("needs_rain") == null) {
                attributesMap.set("needs_rain", Array.of(details.needs_overworld_rain))
            } else {
                let needsRain = attributesMap.get("needs_rain")
                let newNeedsRain = details.needs_overworld_rain
                let needsRains = (needsRain instanceof Array) ? needsRain : Array.of(needsRain)
                needsRains.push(newNeedsRain)
                attributesMap.set("needs_rain", needsRains)
            }
        }
        if (details?.min_affection != null) {
            if (attributesMap.get("min_affection") == null) {
                attributesMap.set("min_affection", Array.of(details.min_affection))
            } else {
                let minAffection = attributesMap.get("min_affection")
                let newMinAffection = details.min_affection
                let minAffections = (minAffection instanceof Array) ? minAffection : Array.of(minAffection)
                minAffections.push(newMinAffection)
                attributesMap.set("min_affection", minAffections)
            }
        }
        if (details?.min_beauty != null) {
            if (attributesMap.get("min_beauty") == null) {
                attributesMap.set("min_beauty", Array.of(details.min_beauty))
            } else {
                let minBeauty = attributesMap.get("min_beauty")
                let newMinBeauty = details.min_beauty
                let minBeauties = (minBeauty instanceof Array) ? minBeauty : Array.of(minBeauty)
                minBeauties.push(newMinBeauty)
                attributesMap.set("min_beauty", minBeauties)
            }
        }
        if (details?.known_move != null) {
            if (attributesMap.get("known_move") == null) {
                attributesMap.set("known_move", Array.of(details.known_move.name))
            } else {
                let knownMove = attributesMap.get("known_move")
                let newKnownMove = details.known_move.name
                let knownMoves = (knownMove instanceof Array) ? knownMove : Array.of(knownMove)
                knownMoves.push(newKnownMove)
                attributesMap.set("known_move", knownMoves)
            }
        }
        if (details?.known_move_type != null) {
            if (attributesMap.get("known_move_type") == null) {
                attributesMap.set("known_move_type", Array.of(details.known_move_type.name))
            } else {
                let knownMoveType = attributesMap.get("known_move_type")
                let newKnownMoveType = details.known_move_type.name
                let knownMoveTypes = (knownMoveType instanceof Array) ? knownMoveType : Array.of(knownMoveType)
                knownMoveTypes.push(newKnownMoveType)
                attributesMap.set("known_move_type", knownMoveTypes)
            }
        }
        if (details?.party_species != null) {
            if (attributesMap.get("party_species") == null) {
                attributesMap.set("party_species", Array.of(details.party_species))
            } else {
                let partySpecies = attributesMap.get("party_species")
                let newPartySpecies = details.party_species
                let partySpeciesList = (partySpecies instanceof Array) ? partySpecies : Array.of(partySpecies)
                partySpeciesList.push(newPartySpecies)
                attributesMap.set("party_species", partySpeciesList)
            }
        }
        if (details?.relative_physical_stats != null) {
            if (attributesMap.get("relative_physical_stats") == null) {
                attributesMap.set("relative_physical_stats", Array.of(details.relative_physical_stats))
            } else {
                let relPhysicalStat = attributesMap.get("relative_physical_stats")
                let newRelPhysicalStat = details.relative_physical_stats
                let relPhysicalStats = (relPhysicalStat instanceof Array) ? relPhysicalStat : Array.of(relPhysicalStat)
                relPhysicalStats.push(newRelPhysicalStat)
                attributesMap.set("relative_physical_stats", relPhysicalStats)
            }
        }
        if (details?.trade_species != null) {
            if (attributesMap.get("trade_species") == null) {
                attributesMap.set("trade_species", Array.of(details.trade_species))
            } else {
                let tradeSpecies = attributesMap.get("trade_species")
                let newTradeSpecies = details.trade_species
                let tradeSpeciesList = (tradeSpecies instanceof Array) ? tradeSpecies : Array.of(tradeSpecies)
                tradeSpeciesList.push(newTradeSpecies)
                attributesMap.set("trade_species", tradeSpeciesList)
            }
        }
        if (details?.turn_upside_down != null) {
            if (attributesMap.get("turn_upside_down") == null) {
                attributesMap.set("turn_upside_down", Array.of(details.turn_upside_down))
            } else {
                let turnUpsideDown = attributesMap.get("turn_upside_down")
                let newTurnUpsideDown = details.turn_upside_down
                let turnUpsideDownList = (turnUpsideDown instanceof Array) ? turnUpsideDown : Array.of(turnUpsideDown)
                turnUpsideDownList.push(newTurnUpsideDown)
                attributesMap.set("turn_upside_down", turnUpsideDownList)
            }
        }
        this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), attributesMap)
    }

    setAttributesMap(details: any) {
        console.info("details: ", details)
        this.specificAttributesMap = this.generateDefaultAttributesMap()
        //if (details == null) return attributesMap
        if (this.specificAttributesMap.get("name") == null) this.specificAttributesMap.set("name", details.name)
        if (this.specificAttributesMap.get("gender") == null) this.specificAttributesMap.set("gender", details?.gender ? details.gender : null)
        if (this.specificAttributesMap.get("is_baby") == null) this.specificAttributesMap.set("is_baby", details?.isBaby)
        if (this.specificAttributesMap.get("held_item") == null) {
            this.specificAttributesMap.set("held_item", details?.held_item?.name ? Array.of(details.held_item.name) : null)
        }
        if (this.specificAttributesMap.get("use_item") == null) {
            this.specificAttributesMap.set("use_item", details?.item?.name ? Array.of(details.item.name) : null)
        }
        if (this.specificAttributesMap.get("min_happiness") == null) {
            this.specificAttributesMap.set("min_happiness", details.min_happiness != null ? Array.of(details.min_happiness) : null)
        }
        if (this.specificAttributesMap.get("min_level") == null) {
            this.specificAttributesMap.set("min_level", details?.min_level ? Array.of(details.min_level) : null)
        }
        if (this.specificAttributesMap.get("time_of_day") == null) {
            this.specificAttributesMap.set("time_of_day", (details.time_of_day != null && details.time_of_day !== "") ? Array.of(details.time_of_day) : null)
        }
        if (this.specificAttributesMap.get("location") == null) {
            this.specificAttributesMap.set("location", details?.location?.name ? Array.of(details.location.name) : null)
        }
        if (this.specificAttributesMap.get("needs_rain") == null) {
            this.specificAttributesMap.set("needs_rain", details.needs_overworld_rain != null ? Array.of(details.needs_overworld_rain) : null)
        }
        if (this.specificAttributesMap.get("min_affection") == null) {
            this.specificAttributesMap.set("min_affection", details?.min_affection != null ? Array.of(details.min_affection) : null)
        }
        if (this.specificAttributesMap.get("min_beauty") == null) {
            this.specificAttributesMap.set("min_beauty", details?.min_beauty ? Array.of(details.min_beauty) : null)
        }
        if (this.specificAttributesMap.get("known_move") == null) {
            this.specificAttributesMap.set("known_move", details?.known_move?.name ? Array.of(details.known_move.name) : null)
        }
        if (this.specificAttributesMap.get("known_move_type") == null) {
            this.specificAttributesMap.set("known_move_type", details?.known_move_type?.name ? Array.of(details.known_move_type.name) : null)
        }
        if (this.specificAttributesMap.get("party_species") == null) {
            this.specificAttributesMap.set("party_species", details?.party_species ? Array.of(details.party_species) : null)
        }
        if (this.specificAttributesMap.get("relative_physical_stats") == null) {
            this.specificAttributesMap.set("relative_physical_stats", details?.relative_physical_stats ? Array.of(details.relative_physical_stats) : null)
        }
        if (this.specificAttributesMap.get("trade_species") == null) {
            this.specificAttributesMap.set("trade_species", details?.trade_species ? Array.of(details.trade_species) : null)
        }
        if (this.specificAttributesMap.get("turn_upside_down") == null) {
            this.specificAttributesMap.set("turn_upside_down", details?.turn_upside_down ? Array.of(details.turn_upside_down) : null)
        }
        let triggerMap = this.specificAttributesMap.get("trigger");

        let triggerUrl = triggerMap != null ? triggerMap.get("url").toString() : "";
        if (triggerUrl !== "" && triggerUrl.endsWith("/2")) {
            this.specificAttributesMap.set("trade_species", true);
        }
        console.log("evolution_details for:", details.name, " ", details)

        this.pokemonIdAndAttributesMap.set(Number.parseInt(details.id), this.specificAttributesMap)
    }

    // clean up map, remove unnecessary duplicates
    cleanupAttributesMap() {
        console.log("All attributes maps created: ", this.pokemonIdAndAttributesMap.size)
        Array.from(this.pokemonIdAndAttributesMap).forEach((innerMap) => {
            console.log("id: ", innerMap[0], " , map: ", innerMap[1])
            // clean up min_happiness
            let minHappinessValues = innerMap[1]?.get("min_happiness")
            if (minHappinessValues != null) {
                let minHappinessSet = new Set()
                minHappinessValues.forEach((value: any) => {
                    if (!minHappinessSet.has(value)) {
                        if (value == null) {
                            console.log("Not adding '", value, "'")
                        } else {
                            minHappinessSet.add(value)
                        }
                    }
                })
                innerMap[1].set("min_happiness", [...minHappinessSet].join(' '))
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            // clean up time_of_day: Currently works fine; no cleanup needed
            // clean up minimum affection
            let minAffectionValues = innerMap[1]?.get("min_affection")
            if (minAffectionValues != null) {
                let minAffectionSet = new Set()
                minAffectionValues.forEach((value: any) => {
                    if (!minAffectionSet.has(value)) minAffectionSet.add(value)
                })
                innerMap[1].set("min_affection", [...minAffectionSet].join(' '))
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            // clean up minimum beauty
            let minBeautyValues = innerMap[1]?.get("min_beauty")
            if (minBeautyValues != null) {
                let minBeautySet = new Set()
                minBeautyValues.forEach((value: any) => {
                    if (!minBeautySet.has(value)) minBeautySet.add(value)
                })
                innerMap[1].set("min_beauty", [...minBeautySet].join(' '))
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            // clean up known_moves
            let knownMoveValues = innerMap[1]?.get("known_move")
            if (knownMoveValues != null) {
                let knownMoveSet = new Set()
                knownMoveValues.forEach((value: any) => {
                    if (!knownMoveSet.has(value)) knownMoveSet.add(value)
                })
                innerMap[1].set("known_move", [...knownMoveSet].join(' '))
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            // clean up known_move_type
            let knownMoveTypeValues = innerMap[1]?.get("known_move_type")
            if (knownMoveTypeValues != null) {
                let knownMoveTypeSet = new Set()
                knownMoveTypeValues.forEach((value: any) => {
                    if (!knownMoveTypeSet.has(value)) knownMoveTypeSet.add(value)
                })
                innerMap[1].set("known_move_type", [...knownMoveTypeSet])
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            let needsRainValues = innerMap[1]?.get("needs_rain")
            if (needsRainValues != null) {
                let needsRainSet = new Set()
                needsRainValues.forEach((value: any) => {
                    if (!needsRainSet.has(value)) needsRainSet.add(value)
                })
                innerMap[1].set("needs_rain", [...needsRainSet])
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
            let needsTurnUpsideDown = innerMap[1]?.get("turn_upside_down")
            if (needsTurnUpsideDown != null) {
                let turnUpsideDownSet = new Set()
                needsTurnUpsideDown.forEach((value: any) => {
                    if (!turnUpsideDownSet.has(value)) turnUpsideDownSet.add(value)
                })
                innerMap[1].set("turn_upside_down", [...turnUpsideDownSet])
                this.pokemonIdAndAttributesMap.set(innerMap[0], innerMap[1])
            }
        })
    }

    determineIfPokemonEvolves(level: boolean, isBabyPokemon: boolean, evolvesWithItem: boolean,
                              evolvesWithHeldItem: boolean, evolvesByHappinessAttribute: boolean,
                              hasBeauty: boolean, hasMinAffection: boolean, hasDayNight: boolean,
                              hasKnownMove: boolean, hasNeedsRain: boolean, hasTradeSpecies: boolean)
    {
        //console.log(level, " ", isBabyPokemon, " ", evolvesWithItem, " ", evolvesWithHeldItem, " ", evolvesByHappinessAttribute)
        return level ||
            isBabyPokemon ||
            evolvesWithItem ||
            evolvesWithHeldItem ||
            evolvesByHappinessAttribute ||
            hasBeauty ||
            hasMinAffection ||
            hasDayNight ||
            hasKnownMove ||
            hasNeedsRain ||
            hasTradeSpecies
    }

    checkTypeAndUpdateIfNecessary(id: number, item: any, pokemonType: any): string {
        let type1, type2
        let returnItem = ''
        let itemFirstPart = item.split("-") // ex: ice-stone, thunder-stone ....
        // if one type
        if (pokemonType.length == 1) {
            type1 = pokemonType[0].type.name
            if (itemFirstPart != type1)
                returnItem = type1 + "-stone"
        }
        // if two types
        else {
            type1 = pokemonType[0].type.name
            type2 = pokemonType[1].type.name
            if (itemFirstPart != type1)
                returnItem = type1 + "-stone"
            else if (itemFirstPart != type2)
                returnItem = type2 + "-stone"
            else
                returnItem = item;
        }
        console.log("returnItem: ", returnItem)
        return returnItem;
    }

    matchSiblingPokemonWithSiblingAttributeMap(id: number) {
        console.log("match sibling pokemon with attr map, family: ", this.family)
        let attrMap
        // @ts-ignore
        this.family.every(listOfIDs => {
            let found = false;
            if (listOfIDs.includes(id)) {
                found = true;
                let idToUse = listOfIDs[0];
                // @ts-ignore
                attrMap = this.pokemonIdAndAttributesMap.get(idToUse)
                // @ts-ignore
                let level = attrMap.get("min_level")
                // @ts-ignore
                let name = attrMap.get("name")
                // if is a gmax pokemon, set to 0
                if (name.split("-")[1] === "gmax") {
                    // @ts-ignore
                    attrMap.set("min_level", null)
                } else {
                    // @ts-ignore
                    attrMap.set("min_level", level)
                }
                return;
            }
            if (found) return false; // to break out of every
        })
        // @ts-ignore
        this.pokemonIdAndAttributesMap.set(id, attrMap)
    }
}
