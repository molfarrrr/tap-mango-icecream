import { signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { Product } from '../models';
import { ApiService } from '../api.service';
import { computed, inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { exhaustMap, pipe, tap } from 'rxjs';
import { immerPatchState } from 'ngrx-immer/signals';

interface InventoryManagerState {
  products: Product[];
  loading: boolean;
}

const initialState: InventoryManagerState = {
  products: [],
  loading: true
};

export const InventoryManagerStore = signalStore(
  withState(initialState),
  withProps(() => ({
    api: inject(ApiService)
  })),

  withComputed(store => ({
    lowStockProducts: computed(() =>
      store.products()
        .filter(x => x.quantity < 50)
        .sort((a, b) => a.quantity - b.quantity)
    ),
  })),

  withMethods((store) => ({
    getProduct: rxMethod<void>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap(() => store.api.getProducts()),
        tap(x => {
          immerPatchState(store, state => {
            state.products = x;
            state.loading = false;
          });
        })
      )
    )
  })),

  withMethods((store) => ({
    updateProduct: rxMethod<Product>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap((product) => store.api.updateProduct(product)),
        tap(() => {
          immerPatchState(store, state => {
            state.loading = false;
          });

          store.getProduct();
        })
      )
    ),

    addProduct: rxMethod<Product>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap((product) => store.api.createProduct(product)),
        tap(() => {
          immerPatchState(store, state => {
            state.loading = false;
          });

          store.getProduct();
        })
      )
    ),

    deleteProduct: rxMethod<number>(
      pipe(
        tap(() => {
          immerPatchState(store, state => {
            state.loading = true;
          });
        }),
        exhaustMap((id) => store.api.deleteProduct(id)),
        tap(() => {
          immerPatchState(store, state => {
            state.loading = false;
          });

          store.getProduct();
        })
      )
    )
  })),

  withHooks({
    onInit(store) {
      store.getProduct();
    },
  }),
);

