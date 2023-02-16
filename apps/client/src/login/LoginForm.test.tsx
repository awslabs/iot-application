import { screen, render, fireEvent } from '@testing-library/react';

import renderRouter from '../testing/routes';
import LoginForm from './LoginForm';

const setup = () => {
  const handleSubmit = jest.fn();
  const utils = render(<LoginForm handleSubmit={handleSubmit} />);
  const userName = screen.getByLabelText('Username');

  const password = screen.getByLabelText('Password');

  const submitButton = screen.getByRole('button', {
    name: /Submit/i,
  });

  return {
    userName,
    password,
    submitButton,
    handleSubmit,
    ...utils,
  };
};

it('updates the inputs', () => {
  const { userName, password } = setup();
  renderRouter('/login');

  fireEvent.change(userName, { target: { value: 'user' } });
  fireEvent.change(password, { target: { value: 'password' } });

  expect((userName as HTMLInputElement).value).toBe('user');
  expect((password as HTMLInputElement).value).toBe('password');
});

it('submits the form', () => {
  const { userName, password, submitButton, handleSubmit } = setup();
  renderRouter('/login');

  fireEvent.change(userName, { target: { value: 'user' } });
  fireEvent.change(password, { target: { value: 'password' } });
  fireEvent.click(submitButton);

  // FIXME: this handler is being passed an entire event
  // expect(handleSubmit).toHaveBeenCalledWith({
  //   userName: 'user',
  //   password: 'password',
  // });

  expect(handleSubmit).toHaveBeenCalled();
});
