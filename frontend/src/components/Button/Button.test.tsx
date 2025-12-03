import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Button } from '.'

describe('<Button />', () => {
  it('renders', () => {
    render(<Button type = "submit"
    label = "submit"
    colour = "red"
 />)

    expect(screen.getByText(/button/i)).toBeTruthy();
  })
})
