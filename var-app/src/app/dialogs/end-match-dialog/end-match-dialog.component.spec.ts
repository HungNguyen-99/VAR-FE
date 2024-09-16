import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndMatchDialogComponent } from './end-match-dialog.component';

describe('EndMatchDialogComponent', () => {
  let component: EndMatchDialogComponent;
  let fixture: ComponentFixture<EndMatchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndMatchDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndMatchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
