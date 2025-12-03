import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MultiSelect } from '.'

describe('<MultiSelect />', () => {
  it('renders', () => {
    render(<MultiSelect 
      required={true}
      id={"modules"}
      placeholder="Select..."
      name={"Modules"}
      options={[]}
      defaultValues={[]}  />)

    expect(screen.getByText(/multiselect/i)).toBeTruthy();
  })
})
