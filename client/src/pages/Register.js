import { useState, useContext, useEffect } from 'react';
import API from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', avatar: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setForm(f => ({ ...f, email: location.state.email }));
    }
  }, [location.state]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data } = await API.post('/auth/register', form);
      setUser(data);
      toast.success('Registration successful!');
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
        toast.error(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Unable to connect to server. Please check if the server is running.');
        toast.error('Unable to connect to server.');
      } else {
        setError('An error occurred during registration. Please try again.');
        toast.error('An error occurred during registration.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && (
        <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <input 
        name="name" 
        value={form.name} 
        onChange={handleChange} 
        placeholder="Name" 
        className="block w-full mb-2 p-2 border rounded" 
        required
      />
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
      <input 
        name="avatar" 
        value={form.avatar} 
        onChange={handleChange} 
        placeholder="Avatar URL (optional)" 
        className="block w-full mb-2 p-2 border rounded" 
      />
      <button 
        type="submit" 
        disabled={loading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
};

export default Register; 