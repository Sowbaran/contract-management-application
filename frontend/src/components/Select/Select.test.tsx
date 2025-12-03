import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Select } from '.';

describe('<Select />', () => {
  it('renders', () => {
    const handleChange = (value: string) => console.log(value); // Mocking the onChange function
    render(<Select id="test" name="test" options={[{ value: 'test', label: 'test' }]} onChange={handleChange} />);

    // Use role to find the select element and check if it exists
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeDefined(); // Checks if the select element is defined
  });
});
