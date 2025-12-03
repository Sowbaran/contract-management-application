import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Label } from '.'

describe('<Label />', () => {
  it('renders', () => {
    render(<Label text='label' />)

    expect(screen.getByText(/label/i)).toBeTruthy();
  })
})