import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Page filters kept in the query string, so a filtered view can be shared as
 * a link (/equipe?categoria=eixo-1&busca=unicamp).
 *
 * Every write replaces the current history entry: filtering is not
 * navigation, and Back should leave the page rather than undo keystrokes.
 * Nothing is written on arrival, so a page opened without parameters keeps a
 * clean URL and behaves exactly as it did before the filters were linkable.
 */

/**
 * One choice among known values. A missing or unknown value reads as
 * `fallback`, so a stale or mistyped link opens the default view instead of
 * an empty one; choosing the fallback removes the parameter.
 */
export function useUrlChoice(key, { fallback, isValid }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const raw = searchParams.get(key);
  const value = raw !== null && isValid(raw) ? raw : fallback;

  const setValue = useCallback(
    (next) => {
      setSearchParams(
        (params) => {
          if (next === fallback || next === null || next === undefined) params.delete(key);
          else params.set(key, next);
          return params;
        },
        { replace: true }
      );
    },
    [key, fallback, setSearchParams]
  );

  return [value, setValue];
}

/**
 * Free text mirrored to one parameter. The field reads its own state, so
 * typing never waits on the router; the link catches up after a short pause.
 * The pause also keeps a fast typist under the browsers' cap on
 * history.replaceState calls (Safari throws past about a hundred in ten
 * seconds). The URL holds the trimmed text and drops the parameter when
 * nothing is left.
 *
 * If the parameter changes from outside, say a link to this same page, the
 * text follows it.
 */
export function useUrlText(key, { delay = 350 } = {}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlValue = searchParams.get(key) ?? '';
  const [value, setValue] = useState(urlValue);
  // What the URL holds, or is about to: tells our own writes apart from
  // outside changes.
  const synced = useRef(urlValue);

  useEffect(() => {
    if (urlValue === synced.current) return;
    synced.current = urlValue;
    setValue(urlValue);
  }, [urlValue]);

  useEffect(() => {
    const next = value.trim();
    if (next === synced.current) return undefined;
    // setSearchParams changes whenever any parameter does, which restarts the
    // pause with fresh parameters: a chip clicked mid-typing is not undone.
    const timer = setTimeout(() => {
      synced.current = next;
      setSearchParams(
        (params) => {
          if (next) params.set(key, next);
          else params.delete(key);
          return params;
        },
        { replace: true }
      );
    }, delay);
    return () => clearTimeout(timer);
  }, [value, key, delay, setSearchParams]);

  return [value, setValue];
}
