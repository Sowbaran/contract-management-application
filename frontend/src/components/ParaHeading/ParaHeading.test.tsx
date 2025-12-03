import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ParaHeading } from '.'

describe('<ParaHeading />', () => {
  it('renders', () => {
    render(<ParaHeading name="test" />)

    expect(screen.getByText(/paraheading/i)).toBeTruthy();
  })
})
