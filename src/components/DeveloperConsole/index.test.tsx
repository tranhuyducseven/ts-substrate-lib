import { render } from '@testing-library/react';
import React from 'react';

import DeveloperConsole from '.';

describe('Test Template', () => {
  test('Should render title', () => {
    const { queryByText } = render(<DeveloperConsole title="hello substrate" />);
    const linkElement = queryByText(/hello substrate/i);
    expect(linkElement).not.toBe(null);
  });
});
