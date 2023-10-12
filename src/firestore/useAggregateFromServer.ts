import type { AggregateSpec, AggregateSpecData, FirestoreError, Query } from "firebase/firestore";
import { getAggregateFromServer } from "firebase/firestore";
import type { ValueHookResult } from "../common/types.js";
import { useGet } from "../internal/useGet.js";
import { isAggregateSpecEqual, isQueryEqual } from "./internal.js";

export type UseAggregateFromServerResult<T extends AggregateSpec> = ValueHookResult<AggregateSpecData<T>, FirestoreError>;

interface Reference<T extends AggregateSpec> {
    query: Query<unknown>;
    aggregateSpec: T;
}

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * @internal
 */
async function getData<T extends AggregateSpec>({ query, aggregateSpec }: Reference<T>): Promise<AggregateSpecData<T>> {
    const snap = await getAggregateFromServer(query, aggregateSpec);
    return snap.data();
}

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * @internal
 */
function isEqual<TAggregateSpec extends AggregateSpec, TReference extends Reference<TAggregateSpec>>(
    a: TReference | undefined,
    b: TReference | undefined,
): boolean {
    if (a === undefined && b === undefined) {
        return true;
    }

    const areSameRef =
        a !== undefined &&
        b !== undefined &&
        isQueryEqual(a.query, b.query) &&
        isAggregateSpecEqual(a.aggregateSpec, a.aggregateSpec);
    return areSameRef;
}

/**
 * Returns aggregate of a Firestore Query. Does not update the result once initially calculated.
 * @param query Firestore query the aggregate is calculated for
 * @param aggregateSpec Aggregate specification
 * @returns Size of the result set, loading state, and error
 * - value: Aggregate of the Firestore query; `undefined` if the aggregate is currently being calculated, or an error occurred
 * - loading: `true` while calculating the aggregate; `false` if the aggregate was calculated successfully or an error occurred
 * - error: `undefined` if no error occurred
 */
export function useAggregateFromServer<T extends AggregateSpec>(
    query: Query<unknown> | undefined | null,
    aggregateSpec: T,
): UseAggregateFromServerResult<T> {
    return useGet(query ? { query, aggregateSpec } : undefined, getData, isEqual);
}
