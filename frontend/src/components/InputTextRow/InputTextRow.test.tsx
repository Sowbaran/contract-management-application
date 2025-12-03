import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { InputTextRow } from '.'

describe('<InputTextRow />', () => {
  it('renders', () => {
    render(<InputTextRow name='' />)

    expect(screen.getByText(/inputtextrow/i)).toBeTruthy();
  })
})
