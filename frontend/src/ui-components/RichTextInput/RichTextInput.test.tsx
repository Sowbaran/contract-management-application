import { render } from '@testing-library/react';
import { describe, it } from 'vitest';

import { RichTextInput } from '.'

describe('<RichTextInput />', () => {
  it('renders', () => {
    render(<RichTextInput name="richtextinput" value='' onChangeIp={() => {}}/>)
    // expect(screen.getByText(/richtextinput/i)).toBeTruthy();
  })
})