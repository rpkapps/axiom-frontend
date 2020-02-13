import { async, TestBed } from '@angular/core/testing';
import { InfrastructureModule } from './infrastructure.module';

describe('InfrastructureModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [InfrastructureModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(InfrastructureModule).toBeDefined();
  });
});
