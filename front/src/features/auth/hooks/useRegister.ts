import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { USER_REGISTER, FRONTEND_URL } from 'urls';

interface UseRegisterReturn {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  handleRegister: (event: React.FormEvent) => Promise<void>;
  error: string | undefined;
}

const useRegister = (): UseRegisterReturn => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');

      return;
    }

    try {
      const response = await fetch(USER_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          confirm_success_url: `${FRONTEND_URL}/login`,
        }),
      });

      if (response.ok) {
        navigate('/checkemail');
      } else {
        setError('登録に失敗しました。もう一度お試しください。');
      }
    } catch (error: unknown) {
      setError('Something went wrong. Please try again.');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    error,
    handleRegister,
  };
};

export default useRegister;
