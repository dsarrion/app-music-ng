import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlikeComponent } from './unlike.component';

describe('UnlikeComponent', () => {
  let component: UnlikeComponent;
  let fixture: ComponentFixture<UnlikeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlikeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnlikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
