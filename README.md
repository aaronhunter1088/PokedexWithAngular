# PokédexWithAngular
- Version 1.0.0

The application starts at index.html. It defines the head, then the app-root component.

App-root is app.component.html, which defines the navigable image, and then the router-outlet.
The router-outlet is defined by the app-routing.module.ts, which defines the routes of the application.
You will see that '/' is home, which shows the pokemon list. The makes up the homepage. 

If you click on a Pokémon, the Pokédex component will load, as defined in app-routing.module.ts.
This page loads two cards in a row, the left one showing the Pokémon, and the images, and the right
one showing information about the Pokémon including: stats, descriptions, locations, moves, and how 
the Pokémon evolves. This is where the evolutions component is used, which controls all the evolutions 
of the selected Pokémon. Below this is the Evolutions section of the Pokémon page. It shows the 
Evolves-how component, which controls the display of all the ways a Pokémon evolves, whether none or
several.

If you click on the navigable image, the search component will load, as defined in app-routing.module.ts.
This page is the same as the Pokédex component, with the addition of an arrow to go back to the homepage, 
a text field, which expects ids or names of Pokémon, and a Pokéball search button. When you click Enter 
or the Pokéball image, if the Pokémon is found, it loads it; otherwise no action occurs, which is the 
indicator that no Pokémon was found.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.2.

## Development server

Run `ng serve` or `npm run start` for a dev server. Navigate to `http://localhost:4200/`.
The application should automatically reload if you change any of the source files.
Run `ng serve --host <IP Address>` to deploy to your local IP address to access on other devices.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
