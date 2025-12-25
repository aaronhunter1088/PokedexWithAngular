import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Pokedex, PokemonSpecies} from "pokeapi-js-wrapper";

@Injectable({
    providedIn: 'root'
})
export class PokemonService {

    Pokedex = new Pokedex({
        cache: true
    });
    savedPageNumber: number = 1;
    pokemonID: number = 0;
    itemsPerPage: number = 10

    constructor(private http: HttpClient) {
    }

    getPokemonList(_limit: number, _offset: number) {
        const interval = {
            limit: _limit,
            offset: _offset
        }
        return this.Pokedex.getPokemonsList(interval);
    }

    getPokemonByName(pokemonIDName: string | number) {
        return this.Pokedex.getPokemonByName(pokemonIDName);
    }

    getPokemonSpecificData(pokemonName: string) {
        return this.Pokedex.getPokemonByName(pokemonName);
    }

    /**
     * Get species data for a given Pokémon.
     *
     * @param pokemon The Pokémon object containing species URL.
     * @returns A promise that resolves to the species data.
     * Note: This function should function with the Pokedex library,
     * but I see issues with the response it returns so as a fallback,
     * I use the callURL function to get the data directly from the URL.
     */
    async getPokemonSpeciesData(pokemon: any): Promise<object | undefined> { // speciesURL: string
        //return this.callURL(pokemon.species.url);
        return await this.Pokedex.getPokemonSpeciesByName(pokemon.name)
            // @ts-ignore
            .then((res => {
                if (res !== undefined && res.id != 0) {
                    console.log('Name: \'', res.name, '\' ID: \'', res.id, '\'');
                    return res;
                }
            }))
            .catch(err => {
                console.error('Error fetching species data', err);
                return this.callURL(pokemon.species.url);
            });
    }

    getPokemonLocationEncounters(pokemonID: string) {
        //console.log("inside pokemonLocationEncounters pokemonID: ", pokemonID);
        return this.Pokedex.getPokemonEncounterAreasByName(pokemonID);
    }

    async getPokemonChainData(pokemonChainID: string): Promise<object> {
        return await this.Pokedex.getEvolutionChainById(Number.parseInt(pokemonChainID))
    }

    getPokemonNamesThatEvolveFromTrading(): any {
        console.log("Getting Pokemon names that evolve from trading...");
        let triggerUrl = "https://pokeapi.co/api/v2/evolution-trigger/2/";
        this.callURL(triggerUrl)
            .then((triggerResponse: any) => {
                let triggerMap = JSON.parse(triggerResponse.body);
                return triggerMap.pokemon_species.map((m: any) => m.name);
            });
    }

    callURL(url: any): Promise<object | undefined> {
        return this.http.get(url).toPromise();
    }

    saveCurrentPage(page: number) {
        console.log("saving page: ", page);
        this.savedPageNumber = page;
    }

    getSavedPage(): number {
        return this.savedPageNumber;
    }

    savePokemonID(pokemonID: number) {
        console.log("saving pokemonID: ", pokemonID);
        this.pokemonID = pokemonID;
    }

    saveNumberOfPokemonPerPage(itemsPerPage: number) {
        console.log("saving number of pokemon viewable")
        this.itemsPerPage = itemsPerPage
    }

    getNumberOfPokemonPerPage(): number {
        return this.itemsPerPage
    }

    getEvolutionsMap() {
        return new Map<number, number[][]>([
            [1, [[1], [2], [3, 10033, 10195]]], // bulbasaur, ivysaur, venusaur, venusaur-mega, venusaur-gmax
            [2, [[4], [5], [6, 10034, 10035, 10196]]], // squirtle, wartortle, blastoise, blastoise-mega, blastoise-gmax
            [3, [[7], [8], [9, 10036, 10197]]], // charmander, charmeleon, charizard, charizard-mega-x, charizard-mega-y charizard-gmax
            [4, [[10], [11], [12, 10198]]], // caterpie, metapod, butterfree, butterfree-gmax
            [5, [[13], [14], [15, 10090]]], // weedle, kakuna, beedrill, beedrill-mega
            [6, [[16], [17], [18, 10073]]], // pidgey, pideotto, pideot, pideot-mega
            [7, [[19, 10091], [20, 10092, 10093]]], // rattata, rattata-alola, raticate, raticate-alola, raticate-totem-alola
            [8, [[21], [22]]], // spearow, fearow
            [9, [[23], [24]]], // ekans, arbok
            [10, [[172], [25, 10199], [26, 10100]]], // pichu, pikachu, pikachu-gmax, raichu, raichu-alola
            // pikachu also has ID: 10080-10085,10094-10099,10148,10158,10160
            [11, [[27, 10101], [28, 10102]]], //sandrew, sandrew-alola, sandslash, sandslash-alola
            [12, [[29], [30], [31]]], // nidoran-f, nidorina, nidoqueen
            [13, [[32], [33], [34]]], // nidoran-m, nidorino, nidoking
            [14, [[173], [35], [36]]], // cleffa, clefairy, clefable
            [15, [[37, 10103], [38, 10104]]], // vulpix, vulpix-alola, ninetales, ninetales-alola
            [16, [[174], [39], [40]]], // igglybuff, jigglypuff, wigglytuff
            [17, [[41], [42], [169]]], // zubat, golbat, crobat
            [18, [[43], [44], [45, 182]]], // oddish, gloom, vileplume, bellossom
            [19, [[46], [47]]], // paras, parasect
            [20, [[48], [49]]], // venonat, venomoth
            [21, [[50, 10105], [51, 10106]]], // diglett, diglett-alola, dugtrio, dugtrio-alola
            [22, [[52, 10107, 10200, 10161], [863, 53, 10108]]], // meowth, meowth-gmax, perrserker, meowth-galar, persian, persian-alola
            [23, [[54], [55]]], // psyduck, golduck
            [24, [[56], [57]]], // mankey, primeape
            [25, [[58, 10229], [59, 10230]]], // growlithe, growlithe-hisui, arcanine, arcanine-hisui
            [26, [[60], [61], [62, 186]]], // poliwag, poliwhirl, poliwrath, politoed
            [27, [[63], [64], [65, 10037]]], // abra, kadabra, alakazam, alakazam-mega
            [28, [[66], [67], [68, 10201]]], // machop, machoke, machamp, machamp-gmax
            [29, [[69], [70], [71]]], // bellsprout, weepinbell, victreebel
            [30, [[72], [73]]], // tentacool, tentacruel
            [31, [[74, 10109], [75, 10110], [76, 10111]]], // geodude, geodude-alola, graveler, graveler-alola, golem, golem-alola
            [32, [[77, 10162], [78, 10163]]], // ponyta, ponyta-galar, rapidash, rapidash-galar
            [33, [[79, 10164], [80, 10165, 10071], [199, 10172]]], // slowpoke, slowpoke-galar, slowbro, slowbro-galar, slowbro-mega, slowking, slowking-galar
            [34, [[81], [82], [462]]], // magnemite, magneton, magnezone
            [35, [[83, 10166], [865]]], // farfetchd, farfetchd-galar, Sirfetchd
            [36, [[84], [85]]], // doduo, dodrio
            [37, [[86], [87]]], // seel, dewgong
            [38, [[88, 10112], [89, 10113]]], // grimer, grimer-alola, muk, muk-alola
            [39, [[90], [91]]], // shellder, cloyster
            [40, [[92], [93], [94, 10038, 10202]]], // gastly, haunter, gengar, gengar-mega, gengar-gmax
            [41, [[95], [208, 10072]]], // onix, steelix, steelix-mega
            [42, [[96], [97]]], // drowzee, hypno
            [43, [[98], [99, 10203]]], // krabby, kingler, kingler-gmax
            [44, [[100, 10231], [101, 10232]]], // voltorb, voltorb-hisui, electrode, electrode-hisui
            [45, [[102], [103, 10114]]], // exeggcute, exeggutor,exeggutor-alola
            [46, [[104], [105, 10115, 10149]]], // cubone, marowak, marowak-alola, marowak-totem
            [47, [[236], [106, 107, 237]]], // tyroge, hitmonlee, hitmonchan, hitmontop
            [48, [[108], [463]]], // lickitung, lickilicky
            [49, [[109], [110, 10167]]], // koffing, weezing, weezing-galar
            [50, [[111], [112], [464]]], // rhyhorn, rhydon, rhyperior
            [51, [[440], [113], [242]]], // happiny, chansey, blissey
            [52, [[114], [465]]], // tangela, tangrowth
            [53, [[115, 10039]]], // kangaskhan, kangaskhan-mega
            [54, [[116], [117], [230]]], // horsea, seadra, kingdra
            [55, [[118], [119]]], // goldeen, seaking
            [56, [[120], [121]]], // staryu, starmie
            [57, [[439], [122, 10168], [866]]], // mime-jr, mr-mime, mr-mime-galar, mr-rime
            [58, [[123], [212, 10046, 900]]], // scyther, scizor(trade with metal coat), scizor-mega, kleavor(use black augurite)
            [59, [[238], [124]]], // smoochum, jynx
            [60, [[239], [125], [466]]], // elekid, electabuzz, electivire
            [61, [[240], [126], [467]]], // magby, magmar, magmortar
            [62, [[127, 10040]]], // pinsir, pinsir-mega
            [63, [[128]]], // tauros
            [64, [[129], [130, 10041]]], // magikarp, gyarados, gyarados-mega
            [65, [[131, 10204]]], // lapras, lapras-gmax
            [66, [[132]]], // ditto
            [67, [[133, 10205], [134, 135, 136, 196, 197, 470, 471, 700]]],
            // eevee, eevee-gmax, vaporeon, jolteon, flareon, espeon, umbreon(197)
            // eevee also ID: 10159
            [68, [[137], [233], [474]]], // porygon, porygon2, porygon-z
            [69, [[138], [139]]], // omanyte, omastar
            [70, [[140], [141]]], // kabuto, kabutops
            [71, [[142, 10042]]], // aerodactyle, aerodactyl-mega
            [72, [[446], [143, 10206]]], // munchlax, snorlax, snorlax-gmax
            [73, [[144, 10169]]], // articuno, articuno-galar
            [74, [[145, 10170]]], // zapdos, zapdos-galar
            [75, [[146, 10171]]], // moltres, moltres-galar
            [76, [[147], [148], [149]]], // dratini, dragonair, dragonite
            [77, [[150, 10043, 10044]]], // mewtwo, mewtwo-mega-x, mewtwo-mega-y
            [78, [[151]]], // mew
            // /* End of Generation 1 */
            [79, [[152], [153], [154]]], // chikorita, bayleef, meganium
            [80, [[155], [156], [157, 10233]]], // cyndaquil, quilava, typhlosion, typhlosion-hisui
            [81, [[158], [159], [160]]], // totodile, croconaw, feraligatr
            [82, [[161], [162]]], // sentret, furret
            [83, [[163], [164]]], // hoothoot, noctowl
            [84, [[165], [166]]], // ledyba, ledian
            [85, [[167], [168]]], // spinarak, ariados
            [86, [[170], [171]]], // chinchou, lanturn
            [87, [[175], [176], [468]]], // togepi, togetic, togekiss
            [88, [[177], [178]]], // natu, xatu
            [89, [[179], [180], [181, 10045]]], // mareep, flaaffy, ampharos, ampharos-mega
            [90, [[298], [183], [184]]], // azurill, marill, azumarill
            [91, [[438], [185]]], // bonsly, sudowoodo
            [92, [[187], [188], [189]]], // hoppip, skiploom, jumpluff
            [93, [[190], [424]]], // aipom, ambipom
            [94, [[191], [192]]], // sunkern, sunflora
            [95, [[193], [469]]], // yanma, yanmega
            [96, [[194], [195]]], // wooper, quagsire
            [97, [[198], [430]]], // murkrow, honchkrow
            [98, [[200], [429]]], // misdreavus, mismagius
            [99, [[201]]], // unown
            [100, [[360], [202]]], // wynaut, wobbuffet
            [101, [[203]]], // girafarig
            [102, [[204], [205]]], // pineco, forretress
            [103, [[206]]], // dunsparce
            [104, [[207], [472]]], // gligar, gliscor
            [105, [[209], [210]]], // snubbull, granbull
            [106, [[211, 10234], [904]]], // qwilfish, qwilfish-hisui, overqwil
            [107, [[213]]], // shuckle
            [108, [[214, 10047]]], // heracross, heracross-mega
            [109, [[215, 10235], [461, 903]]], // sneasel, sneasel-hisui, weavile (daytime and with Razor Claw) OR sneasler (nighttime with Razor Claw)
            [110, [[216], [217], [901]]], // teddiursa, ursaring, ursaluna(peat block under full moon)
            [111, [[218], [219]]], // slugma, magcargo
            [112, [[220], [221], [473]]], // swinub, piloswine, mamoswine
            [113, [[222, 10173], [864]]], // corsola, corsola-galar, cursola
            [114, [[223], [224]]], // remoraid, octillery
            [115, [[225]]], // delibird
            [116, [[458], [226]]], // mantyke, mantine
            [117, [[227]]], // skarmory
            [118, [[228], [229, 10048]]], // houndour, houndoom, houndoom-mega
            [119, [[231], [232]]], // phanpy, donphan
            [120, [[234]]], // stanler
            [121, [[235]]], // smeargle
            [122, [[241]]], // miltank
            [123, [[243]]], // raikou
            [124, [[244]]], // entei
            [125, [[245]]], // suicune
            [126, [[246], [247], [248, 10049]]], // larvitar, pupitar, tyranitar, tyranitar-mega
            [127, [[249]]], // lugia
            [128, [[250]]], // ho-oh
            [129, [[251]]], // celebi Page 26
            // /* End of Generation 2 */
            [130, [[252], [253], [254, 10065]]], // treeco, grovyle, sceptile, sceptile-mega
            [131, [[255], [256], [257, 10050]]], // torchic, combusken, blaziken, blaziken-mega
            [132, [[258], [259], [260, 10064]]], // mudkip, marshtomp, swampert, swampert-mega
            [133, [[261], [262]]], // poochyena, mightyena
            [134, [[263, 10174], [264, 10175], [862]]], // zigzagoon, zigzagoon-galar, linoone, linoone-galar, obstagoon
            [135, [[265], [266, 268], [267, 269]]], // wurmple, silcoon, cascoon, beautifly, dustox
            [136, [[270], [271], [272]]], // lotad, lombre, ludicolo
            [137, [[273], [274], [275]]], // seedot, nuzleaf, shiftry
            [138, [[276], [277]]], // taillow, swellow
            [139, [[278], [279]]], // wingull, pelipper
            [140, [[280], [281], [282, 10051, 475, 10068]]], // ralts, kirlia, gardevoir(30), gardevoir-mega gallade(dawn stone & male), gallade-mega
            [141, [[283], [284]]], // surskit, masquerain
            [142, [[285], [286]]], // shroomish, breloom
            [143, [[287], [288], [289]]], // slakoth, vigoroth, slaking
            [144, [[290], [291], [292]]], // nincada, ninjask, shedinja
            [145, [[293], [294], [295]]], // whismur, loudred, exploud
            [146, [[296], [297]]], // makuhita, harlyama
            [147, [[299], [476]]], // nosepass, probopass(level up in magnetic field)
            [148, [[300], [301]]], // skitty, delcatty
            [149, [[302, 10066]]], // sableye, sableye-mega
            [150, [[303, 10052]]], // mawile, mawile-mega
            [151, [[304], [305], [306, 10053]]], // aron, lairon, aggron, aggron-mega
            [152, [[307], [308, 10054]]], // meditite, medicham, medicham-mega
            [153, [[309], [310, 10055]]], // electrike, manectric, manectric-mega
            [154, [[311]]], // plusle
            [155, [[312]]], // minun
            [156, [[313]]], // volbeat
            [157, [[314]]], // illumise
            [158, [[406], [315], [407]]], // budew(high friendship), roselia, roserade(shiny stone)
            [159, [[316], [317]]], // gulpin, swalot
            [160, [[318], [319, 10070]]], // carvanha, sharpedo, sharpedo-mega
            [161, [[320], [321]]], // wailmer, wailord
            [162, [[322], [323, 10087]]], //numel, camerupt, camerupt-mega
            [163, [[324]]], // torkoal
            [164, [[325], [326]]], // spoink, grumpig
            [165, [[327]]], // spinda
            [166, [[328], [329], [330]]], // trapinch, vibrava, flygon
            [167, [[331], [332]]], // cacnea, cacturne
            [168, [[333], [334, 10067]]], // swablu, altaria, altaria-mega
            [169, [[335]]], // zangoose
            [170, [[336]]], // seviper
            [171, [[337]]], // lunatone
            [172, [[338]]], // solrock
            [173, [[339], [340]]], // barboach, whiscash
            [174, [[341], [342]]], // corphish, crawdaunt
            [175, [[343], [344]]], // baltoy, claydol
            [176, [[345], [346]]], // lileep, cradily
            [177, [[347], [348]]], // anorith, armaldo
            [178, [[349], [350]]], // feebas, milotic
            [179, [[351, 10013, 10014, 10015]]], // castform OTHER IMAGES with ID: 10013-10015
            [180, [[352]]], // kecleon
            [181, [[353], [354, 10056]]], // shuppet, banette, banette-mega
            [182, [[355], [356], [477]]], // duskull, dusclops, dusknoir(trade with reaper cloth)
            [183, [[357]]], // tropius
            [184, [[433], [358]]], // chingling, chimecho
            [185, [[359, 10057]]], // absol, absol-mega
            [186, [[361], [362, 10074, 478]]], // snorunt, glalie(level up), glalie-mega, froslass(dawn stone & female)
            [187, [[363], [364], [365]]], // spheal, sealeo, walrein
            [188, [[366], [367], [368]]], // clamperl, huntail, gorebyss
            [189, [[369]]], // relicanth
            [190, [[370]]], // luvdisc
            [191, [[371], [372], [373, 10089]]], // bagon, shelgon, salamence, salamence-mega
            [192, [[374], [375], [376, 10076]]], // beldum, metang, metagross, metagross-mega
            [193, [[377]]], // regirock
            [194, [[378]]], // regice
            [195, [[379]]], // registeel
            [196, [[380, 10062]]], // latias, latias-mega
            [197, [[381, 10063]]], // latios, latios-mega
            [198, [[382, 10077]]], // kyogre, kyogre-primal
            [199, [[383, 10078]]], // groudon, groudon-primal
            [200, [[384, 10079]]], // rayquaza, rayquaza-primal
            [201, [[385]]], // jirachi
            [202, [[386, 10001, 10002, 10003]]], // deoxys(normal) OTHER IMAGES with ID: 10001, 10002, 10003
            /* End of Generation 3 */
            [203, [[387], [388], [389]]], // turtwig, grotle, torterra
            [204, [[390], [391], [392]]], // chimchar, monferno, infernape
            [205, [[393], [394], [395]]], // piplup, prinplup, empoleon
            [206, [[396], [397], [398]]], // starly, staravia, staraptor
            [207, [[399], [400]]], // bidoof, bibarel
            [208, [[401], [402]]], // kricketot, kricketune
            [209, [[403], [404], [405]]], // shinx, luxio, luxray
            /* 210 does not exist in evolution-chains call */
            [211, [[408], [409]]], // cranidos, rampardos
            [212, [[410], [411]]], // shieldon, bastiodon
            [213, [[412, 10004, 10005], [413], [414]]], // burmy, wormadam-plant, mothim OTHER IMAGES for 412 with ID: 10004, 10005
            [214, [[415], [416]]], // combee, vespiquen
            [215, [[417]]], // pachirisu
            [216, [[418], [419]]], // buizel, floatzel
            [217, [[420], [421]]], // cherubi, cherrim
            [218, [[422], [423]]], // shellos, gastrodon
            [219, [[425], [426]]], // drifloon, drifblim
            [220, [[427], [428, 10088]]], // buneary, lopunny, lopunny-mega
            [221, [[431], [432]]], // glameow, purugly
            [223, [[434], [435]]], // stunky, skuntank
            /* 222 does not exist in evolution-chains call */
            [224, [[436], [437]]], // bronzor, bronzong
            [228, [[441]]], // chatot
            /* 225, 226, 227 does not exist in evolution-chains call */
            [229, [[442]]], // spiritomb
            [230, [[443], [444], [445, 10058]]], // gible, gabite, garchomp, garchomp-mega
            /* 231 does not exist in evolution-chains call */
            [232, [[447], [448, 10059]]], // riolu, lucario, lucario-mega
            [233, [[449], [450]]], // hippopotas, hippowdon
            [234, [[451], [452]]], // skorupi, drapion
            [235, [[453], [454]]], // croagunk, toxicroak
            [236, [[455]]], // carnivine
            [237, [[456], [457]]], // finneon, lumineon
            /* 238 does not exist in the evolution-chains call */
            [239, [[459], [460, 10060]]], // snover, abomasnow, abomasnow-mega
            [240, [[479, 10008, 10009, 10010, 10011, 10012]]], // rotom, OTHER IMAGES with ID: 10008-10012
            [241, [[480]]], // uxie
            [242, [[481]]], // mesprit
            [243, [[482]]], // azelf
            [244, [[483, 10245]]], // dialga, dialga-origin
            [245, [[484, 10246]]], // palkia, palkia-origin
            [246, [[485]]], // heatran
            [247, [[486]]], // regigigas
            [248, [[487, 10007]]], // giratina,-altered OTHER IMAGES with ID: 10007
            [249, [[488]]], // cresselia
            [250, [[489], [490]]], // phione, manaphy
            /* 251 does not exist in the evolution-chains call */
            [252, [[491]]], // darkrai
            [253, [[492, 10006]]], // shaymin-lang, shaymin-sky
            [254, [[493]]], // arceus
            [255, [[494]]], // victini
            /* End of Generation 4 */
            [256, [[495], [496], [497]]], // snivy, servine, serperior
            [257, [[498], [499], [500]]], // tepig, pignite, emboar
            [258, [[501], [502], [503, 10236]]], // oshawott, dewott, samurott, samurott-hisui
            [259, [[504], [505]]], // patrat, watchog
            [260, [[506], [507], [508]]], // lillipup, herdier, stoutland
            [261, [[509], [510]]], // purrloin, liepard
            [262, [[511], [512]]], // pansage, simisage
            [263, [[513], [514]]], // pansear, simisear
            [264, [[515], [516]]], // panpour, simipour
            [265, [[517], [518]]], // munna, musharna
            [266, [[519], [520], [521]]], // pidove, tranquill, unfezant
            [267, [[522], [523]]], // blitzle, zebstrika
            [268, [[524], [525], [526]]], // roggenrola, boldore, gigalith
            [269, [[527], [528]]], // woobat, swoobat
            [270, [[529], [530]]], // drilbur, excadrill
            [271, [[531, 10069]]], // audino, audino-mega
            [272, [[532], [533], [534]]], // timburr, gurdurr, conkeldurr
            [273, [[535], [536], [537]]], // tympole, palpitoad, seismitoad
            [274, [[538]]], // throh
            [275, [[539]]], // sawk
            [276, [[540], [541], [542]]], // sewaddle, swadloon, leavanny
            [277, [[543], [544], [545]]], // venipede, whirlipede, scolipide
            [278, [[546], [547]]], // cottonee, whimsicott
            [279, [[548], [549, 10237]]], // petilil, lilligant, lilligant
            [280, [[550, 100016, 10247], [902, 10248]]], // basculin-red-striped, basculin-blue-striped, basculin-white-striped, basculegion-male, basculegion-female
            [281, [[551], [552], [553]]], // sandile, krokorok, krookodile
            [282, [[554, 10017, 10176, 10178], [555, 10177]]], // darumaka, darumaka-galar, darmanitan-zen, darmanitan-zen-galar, darmanitan-standard, darmanitan-galar-standard
            [283, [[556]]], // maractus
            [284, [[557], [558]]], // dwebble, crustle
            [285, [[559], [560]]], // scraggy, scrafty
            [286, [[561]]], // sigilyph
            [287, [[562, 10179], [563, 867]]], // yamask(type:ghost) => cofagrigus(levelup:34), OR  yamask => runerigus(near dusty bowl), yamask-galar
            [288, [[564], [565]]], // tirtouga, carracosta
            [289, [[566], [567]]], // archen, archeops
            [290, [[568], [569, 10207]]], // trubbish, garbodor, garbodor-gmax
            [291, [[570, 10238], [571, 10239]]], // zorua,zorua-hisui, zoroark, zoroark-hisui
            [292, [[572], [573]]], // minccino, cinccino
            [293, [[574], [575], [576]]], // gothita, gothorita, gothitelle
            [294, [[577], [578], [579]]], // solosis, duosion, reuniclus
            [295, [[580], [581]]], // ducklett, swanna
            [296, [[582], [583], [584]]], // vanillite, vanillish, vanilluxe
            [297, [[585], [586]]], // deerling, sawsbuck
            [298, [[587]]], // emolga
            [299, [[588], [589]]], // karrablast, escavalier
            [300, [[590], [591]]], // foongus, amoonguss
            [301, [[592], [593]]], // frillish, jellicent
            [302, [[594]]], // alomomola
            [303, [[595], [596]]], // joltik, galvantula
            [304, [[597], [598]]], // ferroseed, ferrothorn
            [305, [[599], [600], [601]]], // klink, klang, klinklang
            [306, [[602], [603], [604]]], // tynamo, eelektrik, eelektross
            [307, [[605], [606]]], // elgyem, beheeyem
            [308, [[607], [608], [609]]], // litwick, lampent, chandelure
            [309, [[610], [611], [612]]], // axew, fraxure, haxorus
            [310, [[613], [614]]], // cubchoo, beatric
            [311, [[615]]], // cryogonal
            [312, [[616], [617]]], // shelmet, accelgor
            [313, [[618, 10180]]], // stunfisk, stunfisk-galar
            [314, [[619], [620]]], // mienfoo, mienshao
            [315, [[621]]], // druddigon
            [316, [[622], [623]]], // golett, golurk
            [317, [[624], [625]]], // pawniard, bisharp
            [318, [[626]]], // bouffalant
            [319, [[627], [628, 10240]]], // rufflet, braviary, braviary-hisui
            [320, [[629], [630]]], // vullaby, mandibuzz
            [321, [[631]]], // heatmor
            [322, [[632]]], // durant
            [323, [[633], [634], [635]]], // deino, zweilous, hydreigon
            [324, [[636], [637]]], // larvesta, volcarona
            [325, [[638]]], // cobalion
            [326, [[639]]], // terrakion
            [327, [[640]]], // virizion
            [328, [[641, 10019]]], // tornadus-incarnate, tornadus-therian
            [329, [[642, 10020]]], // thundurus-incarnate, thundurus-therian
            [330, [[643, 10021]]], // reshiram, thundurus-therian
            [331, [[644]]], // zekrom
            [332, [[645]]], // landorus-incarnate
            [333, [[646, 10022, 10023]]], // kyurem, kyurem-black, kyurem-white
            [334, [[647, 10024]]], // keldeo-ordinary, keldeo-resolute
            [335, [[648, 10018]]], // meloetta-aria, meloetta-pirouette
            [336, [[649]]], // genesect
            // /* End of Generation 5 */
            [337, [[650], [651], [652]]], // chespin, quilladin, chesnaught
            [338, [[653], [654], [655]]], // fennekin, braixen, delphox
            [339, [[656], [657], [658, 10116, 10117]]], // froakie, frogadier, greninja, greninja-battle-bond, greninja-ash
            [340, [[659], [660]]], // bunnelby, diggersby
            [341, [[661], [662], [663]]], // fletchling, fletchinder, talonflame
            [342, [[664], [665], [666]]], // scatterbug, spewpa, vivillon
            [343, [[667], [668]]], // litleo, pyroar
            [344, [[669], [670, 10061], [671]]], // flabebe, floette, floette-eternal, florges
            [345, [[672], [673]]], // skiddo, gogoat
            [346, [[674], [675]]], // pancham, pangoro
            [347, [[676]]], // furfrou,
            [348, [[677], [678, 10025]]], // espurr, meowstic-male, meowstic-female
            [349, [[679], [680], [681, 10026]]], // honedge, doublade, aegislash-shield, aegislash-blade
            [350, [[682], [683]]], // spritizee, aromatisse
            [351, [[684], [685]]], // swirlix, slurpuff
            [352, [[686], [687]]], // inkay, malamar
            [353, [[688], [689]]], // binacle, barbaracle
            [354, [[690], [691]]], // skrelp, dragalge
            [355, [[692], [693]]], // clauncher, clawitzer
            [356, [[694], [695]]], // helioptile, heliolisk
            [357, [[696], [697]]], // tyrunt, tyrantrum
            [358, [[698], [699]]], // amaura, aurorus
            [359, [[701]]], // hawlucha
            [360, [[702]]], // dedenne
            [361, [[703]]], // carbink
            [362, [[704], [705, 10241], [706, 10242]]], // goomy, sliggoo, sloggoo-hisui, goodra, goodra-hisui
            [363, [[707]]], // klefki
            [364, [[708], [709]]], // phantump, trevenant
            [365, [[710], [711]]], // pumpkaboo-average, gourgeist-average
            [366, [[712], [713, 10243]]], // bergmite, avalugg, avalugg-hisui
            [367, [[714], [715]]], // noibat, noivern
            [368, [[716]]], // xerneas
            [369, [[717]]], // yveltal
            [370, [[718, 10118, 10119, 10181, 10120]]], // zygarde-50, zygarde-10-power-construct, zygarde-50-power-construct, zygarde-10, zygarde-complete
            [371, [[719, 10075]]], // diancie, diancie-mega
            [372, [[720, 10086]]], // hoopa, hoopa-unbound
            [373, [[721]]], // volcanion
            // /* End of Generation 6 */
            [374, [[722], [723], [724, 10244]]], // rowlet, dartrix, decidueye, decidueye-hisui
            [375, [[725], [726], [727]]], // litten, torracat, incineroar
            [376, [[728], [729], [730]]], // popplio, brionne, primarina
            [377, [[731], [732], [733]]], // pikipek, trumbeak, toucannon
            [378, [[734], [735, 10121]]], // yungoos, gumshoos, gumshoos-totem
            [379, [[736], [737], [738, 10122]]], // grubbin, charjabug, vikavolt, vikavolt-totem
            [380, [[739], [740]]], // crabrawler, crabominable
            [381, [[741, 10123, 10124, 10125]]], // oricorio-baile, oricorio-pom-pom, oricorio-pau, oricorio-sensu
            [382, [[742], [743, 10150]]], // cutiefly, ribombee, ribombee-totem
            [383, [[744, 10151], [745, 10126, 10152]]], // rockruff, rockruff-own-tempo lycanroc-midday, lycanroc-midnight, lycanroc-dusk
            [384, [[746, 10127]]], // wishiwashi-solo, wishiwashi-school
            [385, [[747], [748]]], // mareanie, toxapex
            [386, [[749], [750]]], // mudbray, mudsdale
            [387, [[751], [752, 10153]]], // dewpider, araquanid, araquanid-totem
            [388, [[753], [754, 10128]]], // fomantis, lurantis, lurantis-totem
            [389, [[755], [756]]], // morelull, shiinotic
            [390, [[757], [758, 10129]]], // salandit, salazzle, salazzle-totem
            [391, [[759], [760]]], // stufful, bewear
            [392, [[761], [762], [763]]], // bounsweet, steenee, tsareena
            [393, [[764]]], // comfey
            [394, [[765]]], // oranguru
            [395, [[766]]], // passimian
            [396, [[767], [768]]], // wimpod, golisopod
            [397, [[769], [770]]], // sandygast, palossand
            [398, [[771]]], // pyukumuku
            [399, [[772], [773]]], // type-null, silvally
            [400, [[774, 10130, 10131, 10132, 10133, 10134, 10135, 10136, 10137, 10138, 10139, 10140, 10141, 10142]]],
            // minior-red-meteor, orange, yellow, green, blue, indio, violet; minior-red, orange, yellow, green, blue, indigo, violet
            [401, [[775]]], // komala
            [402, [[776]]], // turtonator
            [403, [[777, 10154]]], // togedemaru, togedemaru-totem
            [404, [[778, 10143, 10144, 10145]]], // mimikyu-disguised, mimikyu-busted, mimikyu-totem-disguised, mimikyu-totem-busted
            [405, [[779]]], // bruxish
            [406, [[780]]], // drampa
            [407, [[781]]], // dhelmise
            [408, [[782], [783], [784, 10146]]], // jangmo-o, hakamo-o, kommo-o, kommo-o-totem
            [409, [[785]]], // tapu-koko
            [410, [[786]]], // tapu-lele
            [411, [[787]]], // tapu-bulu
            [412, [[788]]], // tapu-fini
            [413, [[789], [790], [791], [792]]], // cosmog, cosmoem, solgaleo, lunala
            [414, [[793]]], // nihilego
            [415, [[794]]], // buzzwole
            [416, [[795]]], // pheromosa
            [417, [[796]]], // xurkitree
            [418, [[797]]], // celesteela
            [419, [[798]]], // kartana
            [420, [[799]]], // guzzlord
            [421, [[800, 10155, 10156, 10157]]], // necrozma, necrozma-dusk, necrozma-dawn, necrozma-ultra
            [422, [[801, 10147]]], // magearna, magearna-original
            [423, [[802]]], // marshadow
            [424, [[803], [804]]], // poipole, naganadel
            [425, [[805]]], // stakataka
            [426, [[806]]], // blacephalon
            [427, [[807]]], // zeraora
            [428, [[808], [809, 10208]]], // meltan, melmetal, melmetal-gmax
            //[429, [[809] ]], // melmetal
            // /* End of Generation 7 */
            [430, [[810], [811], [812, 10209]]], // grookey, thwackey, rillaboom, rillaboom-gmax
            [431, [[813], [814], [815, 10210]]], // scorbunny, raboot, cinderace, cinderace-gmax
            [432, [[816], [817], [818, 10211]]], // sobble, drizzile, inteleon, inteleon-gmax
            [433, [[819], [820]]], // skwovet, greedent
            [434, [[821], [822], [823, 10212]]], // rookidee, corvisquire, corviknight, corviknight-gmax
            [435, [[824], [825], [826, 10213]]], // blipbug, dottler, orbeetle, orbeetle-gmax
            [436, [[827], [828]]], // nickit, thievul
            [437, [[829], [830]]], // gossifleur, eldegoss
            [438, [[831], [832]]], // wooloo, dubwool
            [439, [[833], [834, 10214]]], // chewtle, drednaw, drednaw-gmax
            [440, [[835], [836]]], // yamper, boltund
            [441, [[837], [838], [839, 10215]]], // rolycoly, carkol, coalossal, coalossal-gmax
            [442, [[840], [841, 10216], [842, 10217]]], // applin, flapple, flapple-gmax, appletun, appletun-gmax
            [443, [[843], [844, 10218]]], // silicobra, sandaconda, sandaconda-gmax
            [444, [[845, 10182, 10183]]], // cramorant, cramorant-gulping, gramorant-gorging
            [445, [[846], [847]]], // arrokuda, barraskewda
            [446, [[848], [849, 10219, 10184, 10228]]], // toxel, toxtricity-amped, toxtricity-amped-gmax, toxtricity-low-key, toxtricity-low-key-gmax
            [447, [[850], [851, 10220]]], // sizzlipede, centiskorch, centiskorch-gmax
            [448, [[852], [853]]], // clobbopus, grapploct
            [449, [[854], [855]]], // sinistea, polteageist
            [450, [[856], [857], [858, 10221]]], // hatenna, hattrem, hatterene, hatterene-gmax
            [451, [[859], [860], [861, 10222]]], // impidimp, morgrem, grimmsnarl, grimmsnarl-gmax
            [452, [[868], [869, 10223]]], // milcery, alcremie, alcremie-gmax
            [453, [[870]]], // falinks
            [454, [[871]]], // pincurchin
            [455, [[872], [873]]], //snom, frosmoth
            [456, [[874]]], // stonjourner
            [457, [[875, 10185]]], // eiscue-ice, eiscue-noice
            [458, [[876, 10186]]], // indeedee-male, indeedee-female
            [459, [[877, 10187]]], // morpeko-full-belly, morpeko-hangry
            [460, [[878], [879, 10224]]], // cufant, copperajah, copperajah-gmax
            [461, [[880]]], // dracozolt
            [462, [[881]]], // arctozolt
            [463, [[882]]], // dracovish
            [464, [[883]]], // arctovish
            [465, [[884, 10225]]], // duraludon, duraludon-gmax
            [466, [[885], [886], [887]]], // dreepy, drakloak, dragapult
            [467, [[888, 10188]]], // zacian, zacian-crowned
            [468, [[889, 10189]]], // zamazenta, zamazenta-crowned
            [469, [[890, 10190]]], // eternatus, eternatus-eternamax
            [470, [[891], [892, 10191, 10226, 10227]]], // kubfu, urshifu-single-strike, urshifu-rapid-strike, single-strike-gmax, rapid-strike-gmax
            [471, [[893, 10192]]], // zarude, zarude-dada
            [472, [[894]]], // regieleki
            [473, [[895]]], // regidrago
            [474, [[896]]], // glastrier
            [475, [[897]]], // spectrier
            [476, [[898, 10193, 10194]]], // calyrex, calyrex-ice, calyrex-shadow
            [477, [[899]]], // wyrdeer
            [478, [[905, 10249]]], // enamorus, enamorus-therian
            [479, [[10027, 10028, 10029], [10030, 10031, 10032]]], // pumpkaboo-small, large, super, gorgeist-small, large, super
            /* End of generation 8 */
            [480, [[906], [907], [908]]]
        ]);
    }
}
