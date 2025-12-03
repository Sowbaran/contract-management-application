import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Drawer } from '.'

describe('<Drawer />', () => {
  it('renders', () => {
    render(<Drawer />)

    expect(screen.getByText(/drawer/i)).toBeTruthy();
  })
})
