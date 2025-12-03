import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { DialogBoxWithComments } from '.'

describe('<DialogBoxWithComments />', () => {
  it('renders', () => {
    render(<DialogBoxWithComments isOpen={false} title={''} btnText={''} moduleId={undefined} emailId={''} formId={null} status={''} redirectUrl={''} onClose={() =>{}}  />)

    expect(screen.getByText(/dialogboxwithcomments/i)).toBeTruthy();
  })
})
