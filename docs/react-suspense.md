# React Suspense

Hooks suffixed with `Once` can be used in React `suspense`-mode by passing `suspense: true` in the options object. When using suspense-mode, the component must be wrapped in a `<Suspense>`. The second (`loading`) and third (`error`) item in the returned tuple are static and cannot be used for loading state or error handling. Errors must be handled by a wrapping [error boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary).

```jsx
function App() {
    return (
        <Suspense fallback={<>Loading...</>}>
            <MyComponent />
        </Suspense>
    );
}

function MyComponent() {
    const [todos] = useQueryDataOnce(collection("todos", firestore), { suspense: true });
    return <>{JSON.stringify(todos)}</>;
}
```
