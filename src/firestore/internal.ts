import {
    aggregateFieldEqual,
    AggregateSpec,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    getDoc,
    getDocFromCache,
    getDocFromServer,
    getDocs,
    getDocsFromCache,
    getDocsFromServer,
    Query,
    queryEqual,
    QuerySnapshot,
    refEqual,
} from "firebase/firestore";
import type { Source } from "./types.js";

/**
 * @internal
 */
export async function getDocFromSource<Value extends DocumentData = DocumentData>(
    reference: DocumentReference<Value>,
    source: Source
): Promise<DocumentSnapshot<Value>> {
    switch (source) {
        case "cache":
            return await getDocFromCache(reference);
        case "server":
            return await getDocFromServer(reference);
        case "default":
            return await getDoc(reference);
    }
}

/**
 * @internal
 */
export async function getDocsFromSource<Value extends DocumentData = DocumentData>(
    query: Query<Value>,
    source: Source
): Promise<QuerySnapshot<Value>> {
    switch (source) {
        case "cache":
            return await getDocsFromCache(query);
        case "server":
            return await getDocsFromServer(query);
        case "default":
            return await getDocs(query);
    }
}

/**
 * @internal
 */
export function isDocRefEqual<Value>(
    a: DocumentReference<Value> | undefined,
    b: DocumentReference<Value> | undefined
): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && refEqual(a, b);
    return areBothUndefined || areSameRef;
}

/**
 * @internal
 */
export function isQueryEqual<Value>(a: Query<Value> | undefined, b: Query<Value> | undefined): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && queryEqual(a, b);
    return areBothUndefined || areSameRef;
}

/**
 * @internal
 */
export function isAggregateSpecEqual<T extends AggregateSpec>(a: T, b: T): boolean {
    if (Object.keys(a).length === Object.keys(b).length) {
        return false;
    }

    return Object.entries(a).every(([key, value]) => aggregateFieldEqual(value, b[key]));
}
