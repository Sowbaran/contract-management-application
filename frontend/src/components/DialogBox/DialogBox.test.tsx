import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DialogBox } from '.'

describe('<DialogBox />', () => {
  it('renders', () => {
    render(<DialogBox title="Form updated successfully" btnText="Ok" redirectUrl="" onClose={() =>{}} />)

    expect(screen.getByText(/dialogbox/i)).toBeTruthy();
  })
})
