import { ReactElement } from 'react';
import { RenderOptions, RenderResult } from '@testing-library/react';

interface PathnameProbeProps {
    testId: string;
}
declare function PathnameProbe({ testId }: PathnameProbeProps): ReactElement;

interface RenderWithRouterOptions extends Omit<RenderOptions, 'wrapper'> {
    initialEntry?: string;
    path?: string;
    pathnameProbe?: boolean | string;
}
declare function renderWithRouter(ui: ReactElement, { initialEntry, path, pathnameProbe, ...renderOptions }?: RenderWithRouterOptions): RenderResult;

export { PathnameProbe, type PathnameProbeProps, type RenderWithRouterOptions, renderWithRouter };
