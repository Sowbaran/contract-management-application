import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { Alert } from '.'

describe('<Alert />', () => {
  it('renders', () => {
    render(<Alert open={false} />)
  })
})