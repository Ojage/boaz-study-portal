import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorBoundaryPage } from "../components/shared/ErrorBoundaryPage";

function toError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (isRouteErrorResponse(error)) {
    const e = new Error(`${error.status} ${error.statusText}`);
    e.name = "RouteErrorResponse";
    return e;
  }
  return new Error("Unknown route error");
}

export function RouteErrorElement() {
  const routeError = useRouteError();
  const error = toError(routeError);

  return (
    <ErrorBoundaryPage
      error={error}
      onReset={() => location.reload()}
    />
  );
}

