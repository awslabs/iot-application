import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormEvent } from 'react';

import { LoginForm } from './login-form';

describe('<LoginForm />', () => {
  test('as a user, I want to login to my application', async () => {
    const handleSubmit = jest.fn((e: FormEvent) => e.preventDefault());
    render(<LoginForm onSubmit={handleSubmit} />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText('Username'), 'user');
    await user.type(screen.getByLabelText('Password'), 'password');
    await user.click(screen.getByRole('button'));

    expect(handleSubmit).toHaveBeenCalled();
  });
});
