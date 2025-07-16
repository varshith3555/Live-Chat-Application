import { useState, useContext } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [notRegistered, setNotRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setNotRegistered(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setNotRegistered(false);
    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/login', form);
      setUser(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message === 'User not found') {
        setNotRegistered(true);
        toast.error('User not registered. Please sign up first.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to server. Please check if the server is running.');
        toast.error('Unable to connect to server.');
      } else {
        setError('An error occurred during login. Please try again.');
        toast.error('An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoToRegister = () => {
    navigate('/register', { state: { email: form.email } });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {notRegistered && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded flex flex-col items-center">
          <span>User not registered. Please sign up first.</span>
          <button
            type="button"
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleGoToRegister}
          >
            Sign up
          </button>
        </div>
      )}
      <input 
        name="email" 
        value={form.email} 
        onChange={handleChange} 
        placeholder="Email" 
        className="block w-full mb-2 p-2 border rounded" 
        required
      />
      <input 
        name="password" 
        type="password" 
        value={form.password} 
        onChange={handleChange} 
        placeholder="Password" 
        className="block w-full mb-2 p-2 border rounded" 
        required
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <div className="mt-4 text-center">
        <span>Don't have an account? </span>
        <button type="button" className="text-blue-600 underline" onClick={() => navigate('/register')}>Sign up</button>
      </div>
    </form>
  );
};

export default Login; 