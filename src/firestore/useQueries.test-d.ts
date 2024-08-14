import { Query, QuerySnapshot } from "firebase/firestore";
import { describe, expectTypeOf, it } from "vitest";
import { useQueries } from "./useQueries.js";

describe("useQueries", () => {
    it("single query", () => {
        type Value = { key: "value" };
        const query = null as unknown as Query<Value>;

        const results = useQueries([query]);

        expectTypeOf<(typeof results)[0][0]>().toMatchTypeOf<QuerySnapshot<Value> | undefined>();
    });

    it("multiple queries", () => {
        type Value1 = { key: "value" };
        type Value2 = { key: "value2" };
        const query1 = null as unknown as Query<Value1>;
        const query2 = null as unknown as Query<Value2>;

        const results = useQueries([query1, query2] as const);

        expectTypeOf<(typeof results)[0][0]>().toMatchTypeOf<QuerySnapshot<Value1> | undefined>();
        expectTypeOf<(typeof results)[1][0]>().toMatchTypeOf<QuerySnapshot<Value2> | undefined>();
    });
});
