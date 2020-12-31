import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FilePage } from './file.page';

describe('FilePage', () => {
  let component: FilePage;
  let fixture: ComponentFixture<FilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
