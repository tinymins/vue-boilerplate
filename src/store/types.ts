/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import * as Vuex from 'vuex';

import { type KeyType, type UnionToIntersection } from '@/types';

export interface Event<TType extends KeyType, TPayload = never, TResolve = void> {
  type: TType;
  payload: TPayload;
  resolve: TResolve;
}

type ExtractEventUnionKeys<T> = keyof UnionToIntersection<T extends Event<infer TA, unknown, unknown> ? Record<TA, unknown> : never>;
type ExtractEventPayload<T, TKey extends KeyType> = T extends Event<TKey, infer P, unknown> ? P : undefined;
type ExtractEventResolve<T, TKey extends KeyType> = T extends Event<TKey, unknown, infer P> ? P : never;

interface Dispatch<TActionUnion> /** extends Vuex.Dispatch */ {
  <TType extends ExtractEventUnionKeys<TActionUnion>>(
    type: TType,
    payload: ExtractEventPayload<TActionUnion, TType>,
    options?: Vuex.DispatchOptions,
  ): Promise<void>;
  <P extends Vuex.Payload>(payloadWithType: P, options?: Vuex.DispatchOptions): Promise<void>;
}

interface Commit<MutationUnionType> /** extends Vuex.Commit */ {
  <TK extends ExtractEventUnionKeys<MutationUnionType>>(
    type: TK,
    payload?: ExtractEventPayload<MutationUnionType, TK>,
    options?: Vuex.CommitOptions,
  ): void;
  <P extends Vuex.Payload>(payloadWithType: P, options?: Vuex.CommitOptions): void;
}

export interface Module<
  TState,
  TGetterUnion,
  TActionUnion,
  TMutationUnion,
  TRootState,
  TRootGetter,
> extends Vuex.Module<TState, TRootState> {
  actions?: {
    /*
     * Memo:
     * type ActionHandler<TState, TGetterUnion, TActionUnion, TMutationUnion, TRootState, TRootGetter, TActionKey extends KeyType> =
     *   (
     *     this: Vuex.Store<TRootState>,
     *     injectee: ActionContext<TState, TRootState, TActionUnion, TMutationUnion>,
     *     payload?: ExtractEventPayload<TActionUnion, TActionKey>,
     *   ) => Promise<void>;
     */
    [K in ExtractEventUnionKeys<TActionUnion>]: (
      this: Vuex.Store<TRootState>,
      /*
       * Memo:
       * interface ActionContext<TState, TGetterUnion, TActionUnion, TMutationUnion, TRootState, TRootGetter> extends Vuex.ActionContext<TState, TRootState> {
       *   dispatch: Dispatch<TActionUnion>;
       *   commit: Commit<TMutationUnion>;
       *   state: TState;
       *   getters: TGetterUnion;
       *   rootState: TRootState;
       *   rootGetters: TRootGetter;
       * }
       */
      injectee: {
        dispatch: Dispatch<TActionUnion>;
        commit: Commit<TMutationUnion>;
        state: TState;
        getters: TGetterUnion;
        rootState: TRootState;
        rootGetters: TRootGetter;
      },
      payload?: ExtractEventPayload<TActionUnion, K>,
    ) => Promise<ExtractEventResolve<TActionUnion, K>>;
  };
  getters?: {
    /*
     * Memo:
     * type Getter<TState, TGetterUnion extends EmptyObject, TGetterKey extends keyof TGetterUnion, TRootState, TRootGetter> =
     *   (state: TState, getters: TGetterUnion, rootState: TRootState, rootGetters: TRootGetter) => TGetterUnion[TGetterKey];
     */
    [K in keyof TGetterUnion]: (state: TState, getters: TGetterUnion, rootState: TRootState, rootGetters: TRootGetter) => TGetterUnion[K];
  };
  mutations?: {
    /*
     * Memo:
     * type MutationHandler<TState, TGetterUnion, TActionUnion, TMutationUnion, TRootState, TRootGetter, TMutationKey extends KeyType> =
     *   (state: TState, payload?: ExtractEventPayload<TMutationUnion, TMutationKey>) => void;
     */
    [K in ExtractEventUnionKeys<TMutationUnion>]: (state: TState, payload?: ExtractEventPayload<TMutationUnion, K>) => void;
  };
}

export type ExtractModuleState<T, TType extends KeyType> = T extends Module<
infer TState,
infer TGetterUnion,
infer TActionUnion,
infer TMutationUnion,
infer TRootState,
infer TRootGetter
>
  ? TType extends keyof TState
    ? TState[TType]
    : never
  : never;

export type ExtractModuleGetter<T, TType extends KeyType> = T extends Module<
infer TState,
infer TGetterUnion,
infer TActionUnion,
infer TMutationUnion,
infer TRootState,
infer TRootGetter
>
  ? TType extends keyof TGetterUnion
    ? TGetterUnion[TType]
    : never
  : never;

export type ExtractModuleAction<T, TType extends KeyType> = T extends Module<
infer TState,
infer TGetterUnion,
infer TActionUnion,
infer TMutationUnion,
infer TRootState,
infer TRootGetter
>
  ? (payload?: ExtractEventPayload<TActionUnion, TType>) => Promise<ExtractEventResolve<TActionUnion, TType>>
  : never;

export type ExtractModuleMutation<T, TType extends KeyType> = T extends Module<
infer TState,
infer TGetterUnion,
infer TActionUnion,
infer TMutationUnion,
infer TRootState,
infer TRootGetter
>
  ? (payload?: ExtractEventPayload<TMutationUnion, TType>) => void
  : never;
