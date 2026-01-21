import { useRef, useCallback } from "react";

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
}

/**
 * A hook that provides a wrapper for async operations with automatic retry.
 * Returns a function that will retry the operation up to maxAttempts times.
 */
export function useRetryableFetch() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async <T>(
      operation: (signal: AbortSignal) => Promise<T>,
      options: RetryOptions = {}
    ): Promise<{ data: T | null; aborted: boolean; failed: boolean }> => {
      const { maxAttempts = 2, delayMs = 1000 } = options;

      // Abort any previous in-flight request
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      let lastError: unknown = null;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        // Check if aborted before starting
        if (controller.signal.aborted) {
          return { data: null, aborted: true, failed: false };
        }

        try {
          const result = await operation(controller.signal);

          // If we're still the active controller, return success
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null;
            return { data: result, aborted: false, failed: false };
          } else {
            // A newer request superseded us
            return { data: null, aborted: true, failed: false };
          }
        } catch (err) {
          lastError = err;

          // Check if this was an abort
          const isAbort =
            err instanceof DOMException && err.name === "AbortError";
          const isAbortContext =
            typeof err === "object" &&
            err !== null &&
            (err as any)?.context?.name === "AbortError";

          if (isAbort || isAbortContext || controller.signal.aborted) {
            return { data: null, aborted: true, failed: false };
          }

          // If we have more attempts, wait and retry
          if (attempt < maxAttempts) {
            console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
          }
        }
      }

      // All attempts failed
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }

      console.error("All retry attempts failed:", lastError);
      return { data: null, aborted: false, failed: true };
    },
    []
  );

  const abort = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  return { execute, abort, abortControllerRef };
}
