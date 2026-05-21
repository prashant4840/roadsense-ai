import { ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AppProvider } from '@/context/AppContext';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withProvider?: boolean;
}

export function customRender(
  ui: ReactNode,
  { withProvider = false, ...renderOptions }: CustomRenderOptions = {}
) {
  if (withProvider) {
    return render(ui, {
      wrapper: ({ children }) => <AppProvider>{children}</AppProvider>,
      ...renderOptions,
    });
  }

  return render(ui, renderOptions);
}

export * from '@testing-library/react';
export { customRender as render };
