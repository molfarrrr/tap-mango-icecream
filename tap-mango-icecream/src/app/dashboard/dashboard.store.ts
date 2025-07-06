import { signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { TopProduct } from '../models';
import { ApiService } from '../api.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { immerPatchState } from 'ngrx-immer/signals';
import { ChartData } from 'chart.js';

interface DashboardState {
  months: string[];
  selectedMonth: string;
  topPerformers: TopProduct[];
  loading: boolean;
}

const initialState: DashboardState = {
  months: [],
  selectedMonth: null,
  topPerformers: [],
  loading: false,
};

export const DashboardStore = signalStore(
  withState(initialState),
  withProps(() => ({
    api: inject(ApiService)
  })),

  withComputed(store => ({
    topPerformersChart: computed<ChartData<'pie', number[], string | string[]>>(() => {
      const topPerformers = store.topPerformers();
      const labels: string[] = [];
      const data: number[] = [];

      topPerformers.forEach(({name, quantity}) => {
        labels.push(name);
        data.push(quantity);
      });

      return {
        labels,
        datasets: [{
          data,
        }]
      }
    })
  })),

  withMethods(store => ({
    _getTopPerformers: rxMethod<string>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap((month: string) => store.api.getTopProductForMonth(month)),
        tap((x: TopProduct[]) => {
          immerPatchState(store, state => {
            state.topPerformers = x;
            state.loading = false;
          });
        })
      )
    ),
  })),

  withMethods((store) => ({
    _getMonths: rxMethod<void>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap(() => store.api.getMonths()),
        tap(x => {
          immerPatchState(store, state => {
            state.months = x;
            state.loading = false;
            state.selectedMonth = x[x.length - 1];
          });

          store._getTopPerformers(store.selectedMonth());
        })
      )
    ),
  })),

  withMethods((store) => ({
    setMonths(month: string) {
      immerPatchState(store, state => {
        state.selectedMonth = month;
      });

      store._getTopPerformers(store.selectedMonth());
    }
  })),

  withHooks({
    onInit(store) {

      store._getMonths();
    },
  }),
);

