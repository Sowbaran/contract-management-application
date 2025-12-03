import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Card } from './Card'

describe('<Card />', () => {
  it('renders', () => {
    render(<Card mainContent={<div>Main Content</div>}/>)
    expect(screen.getByText(/Main Content/i)).toBeTruthy();
  })
})