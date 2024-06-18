import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilOptionComponent } from './perfil-option.component';

describe('PerfilOptionComponent', () => {
  let component: PerfilOptionComponent;
  let fixture: ComponentFixture<PerfilOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilOptionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfilOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
