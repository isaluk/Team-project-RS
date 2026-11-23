import type { Route } from '../types';

export const ROUTES: Route[] = ['about', 'catalog', 'cart'];

export const DEFAULT_ROUTE: Route = 'about';

function isRoute(value: string): value is Route {
  return (ROUTES as string[]).includes(value);
}

export function parseHash(hash: string): Route {
  const name = hash.replace(/^#\/?/, '').replace(/\/$/, '');
  return isRoute(name) ? name : DEFAULT_ROUTE;
}

export function toHash(route: Route): string {
  return `#/${route}`;
}
