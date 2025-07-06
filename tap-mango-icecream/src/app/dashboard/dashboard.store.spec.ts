import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { ChartData } from 'chart.js';
import { DashboardStore } from './dashboard.store';
import { ApiService } from '../api.service';
import { TopProduct } from '../models';

describe('DashboardStore', () => {
  let store: InstanceType<typeof DashboardStore>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockTopProducts: TopProduct[] = [
    { name: 'Product A', quantity: 100 },
    { name: 'Product B', quantity: 200 }
  ];

  const mockMonths = ['Jan', 'Feb', 'Mar'];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getTopProductForMonth', 'getMonths']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: spy }
      ]
    });

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    apiServiceSpy.getTopProductForMonth.and.returnValue(of(mockTopProducts));
    apiServiceSpy.getMonths.and.returnValue(of(mockMonths));

    store = TestBed.inject(DashboardStore);
  });

  it('should initialize with default state', () => {
    expect(store.months()).toEqual([]);
    expect(store.selectedMonth()).toBeNull();
    expect(store.topPerformers()).toEqual([]);
    expect(store.loading()).toBeFalse();
  });

  it('should load months and top performers on init', (done) => {
    setTimeout(() => {
      expect(apiServiceSpy.getMonths).toHaveBeenCalled();
      expect(apiServiceSpy.getTopProductForMonth).toHaveBeenCalledWith('Mar');
      expect(store.months()).toEqual(mockMonths);
      expect(store.selectedMonth()).toBe('Mar');
      expect(store.topPerformers()).toEqual(mockTopProducts);
      expect(store.loading()).toBeFalse();
      done();
    }, 1);
  });

  it('should update selected month and call _getTopPerformers', () => {
    store.setMonths('Feb');
    expect(store.selectedMonth()).toBe('Feb');
    expect(apiServiceSpy.getTopProductForMonth).toHaveBeenCalledWith('Feb');
  });

  it('should compute topPerformersChart correctly', () => {
    store.setMonths('Feb');

    setTimeout(() => {
      const chart = store.topPerformersChart();
      const expectedChart: ChartData<'pie', number[], string | string[]> = {
        labels: ['Product A', 'Product B'],
        datasets: [{
          data: [100, 200]
        }]
      };
      expect(chart).toEqual(expectedChart);
    }, 10);
  });

  it('should set loading true when fetching data', () => {
    store.setMonths('Feb');
    expect(store.loading()).toBeTrue();
  });
});
