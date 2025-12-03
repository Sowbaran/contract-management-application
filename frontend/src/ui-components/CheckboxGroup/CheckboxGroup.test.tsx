import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CheckboxGroup } from '.'

describe('<CheckboxGroup />', () => {
  it('renders', () => {
    render(<CheckboxGroup label={''} className={''} />)
    expect(true).toBeTruthy();
  })
})