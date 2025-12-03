import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DatePickForm } from '.'

describe('<DatePickForm />', () => {
  it('renders', () => {
    render(<DatePickForm id = "date-picker" name = "Date"/>)

    expect(screen.getByText(/datepickform/i)).toBeTruthy();
  })
})
