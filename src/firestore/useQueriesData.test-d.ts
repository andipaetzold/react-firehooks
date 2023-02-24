import { Query } from "firebase/firestore";
import { describe, expectTypeOf, it } from "vitest";
import { useQueriesData } from "./useQueriesData";

describe("useQueriesData", () => {
    it("single query", () => {
        type Value = { key: "value" };
        const query = null as unknown as Query<Value>;

        const results = useQueriesData([query]);

        expectTypeOf<(typeof results)[0][0]>().toMatchTypeOf<Value | undefined>();
    });

    it("multiple queries", () => {
        type Value1 = { key: "value" };
        type Value2 = { key: "value2" };
        const query1 = null as unknown as Query<Value1>;
        const query2 = null as unknown as Query<Value2>;

        const results = useQueriesData([query1, query2] as const);

        expectTypeOf<(typeof results)[0][0]>().toMatchTypeOf<Value1 | undefined>();
        expectTypeOf<(typeof results)[1][0]>().toMatchTypeOf<Value2 | undefined>();
    });
});
