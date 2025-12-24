import {Component, HostListener, Input, OnChanges, OnInit} from '@angular/core';
import {PokemonService} from "../services/pokemon.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit, OnChanges {
    @Input() pokemonSprites = {}
    @Input() pokemonImage = ''
    @Input() pokemonName = ''
    @Input() pokemonID: string | number = ''
    @Input() pokemonHeight = ''
    @Input() pokemonWeight = ''
    @Input() pokemonColor = ''
    @Input() pokemonType = []
    @Input() pokemonDescriptions: string[] = []
    @Input() pokemonDescription = ''
    @Input() pokemonLocations: string[] = []
    @Input() pokemonMoves: string[] = []
    descriptionDiv = true
    locationsDiv = false
    movesDiv = false
    evolutionsDiv = false
    normal = 'normal'
    bold = 'bold'
    screenWidth: number = 0
    screenHeight: number = 0
    styleFlag: boolean = false
    showGifs: boolean = false
    gifImage: string = ''
    officialImage: string = ''

    constructor(private route: ActivatedRoute, private pokemonService: PokemonService) {
    }

    ngOnInit(): void {
        // @ts-ignore
        document.getElementById('defaultImgBtn').style.fontWeight = this.bold
        // @ts-ignore
        document.getElementById('descriptionBtn').style.fontWeight = this.bold

        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        //console.log("w: " + this.screenWidth + " h: " + this.screenHeight)
        this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400
        this.route.params
            .subscribe(params => {
                //console.log("params", params)
                //console.log("pokemonID", this.pokemonID);
                if (Object.keys(params).length !== 0) {
                    //console.log("params keys.length: ", Object.keys(params).length)
                    this.pokemonID = <number>params['pokemonID'].split("=")[1].trim()
                }
                if (this.pokemonID === undefined) this.pokemonID = <number>params['pokemonID']
                if (this.pokemonID > 0) {
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
                            //sprites.official = sprites.official;
                            pokemon['sprites'] = sprites;
                            this.pokemonSprites = sprites;
                            let species = pokemon['species']
                            this.pokemonImage = pokemon['sprites']['front_default']
                            this.pokemonImage = this.pokemonImage != null ? this.pokemonImage : "./assets/images/pokeball1.jpg"
                            this.gifImage = pokemon['sprites']['versions']['generation-v']['black-white']['animated']['front_default']
                            this.officialImage = pokemon['sprites']['other']['official-artwork']['front_default']
                            //this.pokemonName = pokemon.name
                            this.pokemonID = pokemon.id
                            // edit weight
                            let weight = pokemon.weight.toString()
                            //console.log("'"+weight.slice(0,-1)+"'" + "." + "'"+weight.slice(-1)+"'")
                            weight = weight.slice(0, -1) + '.' + weight.slice(-1)
                            this.pokemonWeight = weight
                            // edit height
                            let height = pokemon.height.toString()
                            if (height.length == 1) height = "0." + height
                            else height = height.slice(0, -1) + '.' + height.slice(-1)
                            this.pokemonHeight = height
                            // get and set color, and pokemon description
                            this.pokemonService.getPokemonSpeciesData(species.url)
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
                } else {
                    console.log("searching for a new pokemon")
                }
            })
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        //console.log("w: " + this.screenWidth + " h: " + this.screenHeight);
        this.styleFlag = this.screenWidth > 400 && this.screenHeight > 400;
    }

    ngOnChanges() {
        //console.log("changes")
        this.setDivsToNotShow()
        this.descriptionDiv = true
        document.body.style.backgroundColor = "#ffffff"
        this.setImageButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('defaultImgBtn').style.fontWeight = this.bold
        this.setButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('descriptionBtn').style.fontWeight = this.bold
    }

    showImage(option: string): void {
        let pokeballImage = "./assets/images/pokeball1.jpg";
        switch (option) {
            case 'default' : {
                this.pokemonImage = JSON.parse(JSON.stringify(this.pokemonSprites)).front_default;
                if (this.pokemonImage === null) {
                    this.pokemonImage = pokeballImage;
                }
                // @ts-ignore
                document.getElementById('defaultImgBtn').style.fontWeight = this.bold;
                // @ts-ignore
                document.getElementById('officialImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('shinyImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('gifImgBtn').style.fontWeight = this.normal;
                break;
            }
            case 'official' : {
                this.pokemonImage = JSON.parse(JSON.stringify(this.officialImage))
                if (this.pokemonImage === null) {
                    this.pokemonImage = pokeballImage;
                }
                // @ts-ignore
                document.getElementById('defaultImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('officialImgBtn').style.fontWeight = this.bold;
                // @ts-ignore
                document.getElementById('shinyImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('gifImgBtn').style.fontWeight = this.normal;
                break;
            }
            case 'shiny' : {
                this.pokemonImage = JSON.parse(JSON.stringify(this.pokemonSprites)).front_shiny;
                if (this.pokemonImage === null) {
                    this.pokemonImage = pokeballImage;
                }
                // @ts-ignore
                document.getElementById('defaultImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('officialImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('shinyImgBtn').style.fontWeight = this.bold;
                // @ts-ignore
                document.getElementById('gifImgBtn').style.fontWeight = this.normal;
                break;
            }
            case 'gif' : {
                this.pokemonImage = JSON.parse(JSON.stringify(this.pokemonSprites))['versions']['generation-v']['black-white']['animated'].front_default;
                if (this.pokemonImage === null) {
                    this.pokemonImage = pokeballImage;
                }
                // @ts-ignore
                document.getElementById('defaultImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('officialImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('shinyImgBtn').style.fontWeight = this.normal;
                // @ts-ignore
                document.getElementById('gifImgBtn').style.fontWeight = this.bold;
                break;
            }
            default : {
                this.pokemonImage = pokeballImage;
                break;
            }
        }
    }

    showDescription() {
        this.setDivsToNotShow()
        this.descriptionDiv = true;
        this.setButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('descriptionBtn').style.fontWeight = this.bold
    }

    showLocations() {
        this.setDivsToNotShow()
        this.locationsDiv = true;
        this.setButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('locationsBtn').style.fontWeight = this.bold
    }

    showMoves() {
        this.setDivsToNotShow()
        this.movesDiv = true;
        this.setButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('movesBtn').style.fontWeight = this.bold
    }

    showEvolutions() {
        this.setDivsToNotShow()
        this.evolutionsDiv = true
        this.setButtonsToNormalFont()
        // @ts-ignore
        document.getElementById('evolutionsBtn').style.fontWeight = this.bold
    }

    setDivsToNotShow() {
        this.descriptionDiv = false
        this.locationsDiv = false
        this.movesDiv = false
        this.evolutionsDiv = false
    }

    setImageButtonsToNormalFont() {
        // @ts-ignore
        document.getElementById('defaultImgBtn').style.fontWeight = this.normal
        // @ts-ignore
        document.getElementById('shinyImgBtn').style.fontWeight = this.normal
        // @ts-ignore
        document.getElementById('gifImgBtn').style.fontWeight = this.normal
    }

    setButtonsToNormalFont() {
        // @ts-ignore
        document.getElementById('descriptionBtn').style.fontWeight = this.normal
        // @ts-ignore
        document.getElementById('locationsBtn').style.fontWeight = this.normal
        // @ts-ignore
        document.getElementById('movesBtn').style.fontWeight = this.normal
        // @ts-ignore
        document.getElementById('evolutionsBtn').style.fontWeight = this.normal
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

    getEnglishDescriptions() {
        let englishDescriptions: any = [];
        for (let i = 0; i < this.pokemonDescriptions.length; i++) {
            // @ts-ignore
            if (this.pokemonDescriptions[i].language.name === "en") {
                //console.log("desc: ", this.pokemonDescriptions[i]);
                englishDescriptions.push(this.pokemonDescriptions[i]);
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
        return this.pokemonDescription;
    }

}
