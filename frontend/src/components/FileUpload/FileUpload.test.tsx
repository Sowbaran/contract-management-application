import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { FileUpload } from '.'

describe('<FileUpload />', () => {
  it('renders', () => {
    render(<FileUpload />)

    expect(screen.getByText(/fileupload/i)).toBeTruthy();
  })
})
