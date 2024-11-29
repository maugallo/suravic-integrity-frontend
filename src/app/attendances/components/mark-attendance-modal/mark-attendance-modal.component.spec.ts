import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarkAttendanceModalComponent } from './mark-attendance-modal.component';

describe('MarkAttendanceModalComponent', () => {
  let component: MarkAttendanceModalComponent;
  let fixture: ComponentFixture<MarkAttendanceModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkAttendanceModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarkAttendanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
