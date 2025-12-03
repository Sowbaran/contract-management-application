import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Alert } from '.'

describe('<Alert />', () => {
  it('renders', () => {
    render(<Alert type="info" message="Success" />)

    expect(screen.getByText(/alert/i)).toBeTruthy();
  })
})
