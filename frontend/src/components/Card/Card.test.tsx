import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Card } from '.'

describe('<Card />', () => {
  it('renders', () => {
    render(<Card />)

    expect(screen.getByText(/card/i)).toBeTruthy();
  })
})
