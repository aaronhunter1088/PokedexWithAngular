import {Component, OnChanges, OnInit} from '@angular/core';
import {ActivatedRoute, Event, NavigationEnd, NavigationError, NavigationStart, Router} from '@angular/router';
import {DarkModeService} from "./services/dark-mode.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: false
})
export class AppComponent implements OnInit, OnChanges {

    currentRoute: string;
    previousRoute: string;
    title = 'PokedexHome'

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private darkModeService: DarkModeService
    ) {
        this.currentRoute = "";
        this.previousRoute = "";
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationStart) {
                // Show loading indicator
                this.previousRoute = this.currentRoute;
                //console.log("Route change detected. previousRoute: ", this.previousRoute);
            }

            if (event instanceof NavigationEnd) {
                // Hide loading indicator
                this.currentRoute = event.url;
                //console.log("currentRoute: ", event.url);
            }

            if (event instanceof NavigationError) {
                // Hide loading indicator

                // Present error to user
                console.log(event.error);
            }
        });

    }

    ngOnInit(): void {
        // Read darkmode query parameter from URL
        this.activatedRoute.queryParams.subscribe(params => {
            const darkModeParam = params['darkmode'];
            if (darkModeParam !== undefined) {
                const isDarkMode = darkModeParam === 'true' || darkModeParam === true;
                this.darkModeService.setDarkMode(isDarkMode);
            }
        });
    }

    ngOnChanges() {
    }

    getPreviousRoute() {
        return this.previousRoute;
    }

}

