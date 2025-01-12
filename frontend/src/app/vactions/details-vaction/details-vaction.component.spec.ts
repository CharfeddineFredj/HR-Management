import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DetailsVactionComponent } from './details-vaction.component';
import { VactionsService } from 'src/app/sevices/vactions.service';


describe('DetailsVactionComponent', () => {
  let component: DetailsVactionComponent;
  let fixture: ComponentFixture<DetailsVactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailsVactionComponent ],
      imports: [ HttpClientTestingModule ],
      providers: [ VactionsService ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsVactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
