import { it, expect, vi } from "vitest";
import { wrapPromise } from "./wrapPromise.js";

vi.useFakeTimers();

it("should return value if resolved", async () => {
    const promise = Promise.resolve("success");
    const read = wrapPromise(promise);
    await vi.runAllTimersAsync();
    expect(read()).toBe("success");
});

it("should throw error if rejected", async () => {
    const promise = Promise.reject("error");
    const read = wrapPromise(promise);
    await vi.runAllTimersAsync();
    expect(() => read()).toThrow("error");
});

it("should throw Promise if pending", async () => {
    const promise = Promise.resolve();
    const read = wrapPromise(promise);
    expect(() => read()).toThrow(Promise);
});
