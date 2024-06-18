import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMovileComponent } from './nav-movile.component';

describe('NavMovileComponent', () => {
  let component: NavMovileComponent;
  let fixture: ComponentFixture<NavMovileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMovileComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NavMovileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
