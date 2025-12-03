import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Footer } from '.'

describe('<Footer />', () => {
  it('renders', () => {
    render(<Footer prop="footer" />)

    expect(screen.getByText(/footer/i)).toBeTruthy();
  })
})
