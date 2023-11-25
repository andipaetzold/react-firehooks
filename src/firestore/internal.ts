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
export async function getDocFromSource<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    reference: DocumentReference<AppModelType, DbModelType>,
    source: Source,
): Promise<DocumentSnapshot<AppModelType, DbModelType>> {
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
export async function getDocsFromSource<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    query: Query<AppModelType, DbModelType>,
    source: Source,
): Promise<QuerySnapshot<AppModelType, DbModelType>> {
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
export function isDocRefEqual<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    a: DocumentReference<AppModelType, DbModelType> | undefined,
    b: DocumentReference<AppModelType, DbModelType> | undefined,
): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && refEqual(a, b);
    return areBothUndefined || areSameRef;
}

/**
 * @internal
 */
export function isQueryEqual<AppModelType = DocumentData, DbModelType extends DocumentData = DocumentData>(
    a: Query<AppModelType, DbModelType> | undefined,
    b: Query<AppModelType, DbModelType> | undefined,
): boolean {
    const areBothUndefined = a === undefined && b === undefined;
    const areSameRef = a !== undefined && b !== undefined && queryEqual(a, b);
    return areBothUndefined || areSameRef;
}

/**
 * @internal
 */
export function isAggregateSpecEqual<T extends AggregateSpec>(a: T, b: T): boolean {
    if (Object.keys(a).length !== Object.keys(b).length) {
        return false;
    }

    return Object.entries(a).every(([key, value]) => aggregateFieldEqual(value, b[key]!));
}
