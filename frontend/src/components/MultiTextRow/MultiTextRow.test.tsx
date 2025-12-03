import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MultiTextRow } from '.'

describe('<MultiTextRow />', () => {
  it('renders', () => {
    render(<MultiTextRow  id = ""  name = "" />)

    expect(screen.getByText(/multitextrow/i)).toBeTruthy();
  })
})
