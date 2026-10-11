import {CommonModule} from '@angular/common';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterModule, provideRouter} from '@angular/router';
import {EvolutionsComponent} from './evolutions.component';
import {ArraySortPipe} from '../array-sort.pipe';

describe('EvolutionsComponent', () => {
    let component: EvolutionsComponent;
    let fixture: ComponentFixture<EvolutionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonModule, RouterModule],
            declarations: [EvolutionsComponent, ArraySortPipe],
            providers: [provideRouter([])]
        }).compileComponents();

        fixture = TestBed.createComponent(EvolutionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeDefined();
    });
});