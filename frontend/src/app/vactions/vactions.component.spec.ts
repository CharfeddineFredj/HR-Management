import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { VactionsComponent } from './vactions.component';
import { VactionsService } from '../sevices/vactions.service';


describe('VactionsComponent', () => {
  let component: VactionsComponent;
  let fixture: ComponentFixture<VactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VactionsComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ VactionsService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
