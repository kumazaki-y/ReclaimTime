import { type FC } from 'react';
import { Link } from 'react-router-dom';
import useLogin from '../../features/auth/hooks/useLogin';
import Button from '../atoms/button';
import InputField from '../atoms/inputField';
import FormContainer from '../molecules/formContainer';

const LoginForm: FC = () => {
  const { email, setEmail, password, setPassword, error, handleLogin } =
    useLogin();

  return (
    <div>
      <h1>Login</h1>
      <FormContainer onSubmit={handleLogin}>
        <InputField
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          placeholder="Enter your email"
          error={error}
          autocomplete="email"
        />
        <InputField
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          placeholder="Enter your password"
          autocomplete="current-password"
          error={error}
        />
        <Button type="submit" label="Login" />
        <div>
          <Link to="/register">Register</Link> |{' '}
          <Link to="/password">Forgot Password?</Link>
        </div>
      </FormContainer>
    </div>
  );
};

export default LoginForm;
