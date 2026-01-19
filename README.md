# PokédexWithAngular

#### Versions

- Angular Pokédex App v1.3.21
- Inception Year: 2022
- Angular CLI: 21.0.4
- Angular: 20.3.15
- TypeScript: 5.9.3 (version check: npx tsc -v)
- Node: 24.12.0
- Package Manager: npm 11.6.2

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

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application
will automatically reload if you change any of the source files.

## Debugging the UI

To debug the Angular application, we can create a run configuration which will also launch a JavaScript
debugger for us. First, create a new Run Configuration for npm. Set the command to "run" and the
script to "start". Start calls `ng serve` under the hood. Add the following arguments as well:

- --source-map
- --open

Next, click on `Browser/Live Edit` tab and enable opening the browser after launch. Set the browser to
any that is allowed. Set the URL to `http://localhost:4200/`. Apply and save the configuration.
Last, create a JavaScript Debug configuration. Give it a name, set the browser the the URL to the same
one as before: `http://localhost:4200/`. Apply and save the configuration.
When you start the npm run configuration, it will launch the browser, follwed by the JavaScript
debug configuration, which attaches itself to the browser session.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use
`ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a
package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out
the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
