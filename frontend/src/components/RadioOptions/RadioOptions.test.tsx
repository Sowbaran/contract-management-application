import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { RadioOptions } from '.'

describe('<RadioOptions />', () => {
  it('renders', () => {
    render(<RadioOptions id="radio_btn" name='Name' options={
      [{id:"option1" , text:"Option1"}]
    } />)

    expect(screen.getByText(/radiooptions/i)).toBeTruthy();
  })
})
