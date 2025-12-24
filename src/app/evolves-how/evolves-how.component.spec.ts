import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EvolvesHowComponent} from './evolves-how.component';

describe('EvolvesHowComponent', () => {
    let component: EvolvesHowComponent;
    let fixture: ComponentFixture<EvolvesHowComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EvolvesHowComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(EvolvesHowComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
