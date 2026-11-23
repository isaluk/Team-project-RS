type Child = Node | string | null | undefined | false;

type EventHandlers = {
  [K in keyof HTMLElementEventMap]?: (event: HTMLElementEventMap[K]) => void;
};

interface ElementOptions {
  class?: string;
  text?: string;
  attrs?: Record<string, string | number | boolean | undefined>;
  on?: EventHandlers;
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: ElementOptions = {},
  children: Child[] = [],
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options.class) {
    element.className = options.class;
  }
  if (options.text !== undefined) {
    element.textContent = options.text;
  }
  for (const [name, value] of Object.entries(options.attrs ?? {})) {
    if (value === true) {
      element.setAttribute(name, '');
    } else if (value !== false && value !== undefined) {
      element.setAttribute(name, String(value));
    }
  }
  for (const [type, handler] of Object.entries(options.on ?? {})) {
    element.addEventListener(type, handler as EventListener);
  }
  for (const child of children) {
    if (child !== null && child !== undefined && child !== false) {
      element.append(child);
    }
  }

  return element;
}

export function replaceKeepingFocus(container: HTMLElement, children: Node[]): void {
  const active = document.activeElement;
  const key =
    active instanceof HTMLElement && container.contains(active)
      ? active.dataset.focusKey
      : undefined;

  container.replaceChildren(...children);

  if (!key) {
    return;
  }
  const target = container.querySelector<HTMLElement>(`[data-focus-key="${CSS.escape(key)}"]`);
  if (!target) {
    return;
  }
  const isDisabled = target instanceof HTMLButtonElement && target.disabled;
  const fallback = target.parentElement?.querySelector<HTMLElement>('button:not(:disabled)');
  (isDisabled ? fallback : target)?.focus();
}

export function imageUrl(name: string): string {
  return `${import.meta.env.BASE_URL}images/${name}.webp`;
}
