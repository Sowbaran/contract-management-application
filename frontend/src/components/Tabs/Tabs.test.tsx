import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Tabs } from '.'

describe('<Tabs />', () => {
  it('renders', () => {
    render(<Tabs tabs={[]} onTabClick={() => {}} />)

    expect(true).toBeTruthy();
  })
})
