import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import './nav.css';
import bankImg from "../assets/bank.jpg"; // FIX PATH

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { username, password }
      );

      const u = (username || 'admin').toLowerCase();
      const role = u.startsWith('respons')
        ? 'RESPONSABLE'
        : u.startsWith('manager')
        ? 'MANAGER'
        : 'ADMIN';

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', role);
      localStorage.setItem('username', response.data.username);

      window.location.href = '/dashboard';
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid username or password!'
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '0px' }}>
<img 
  src={bankImg} 
  alt="Bank" 
  style={{
    width: "300px",
    height: "100px",
    objectFit: "contain",
    marginBottom: "5px",
      borderRadius: '50px',
          padding: "0px",
          margin: "00px"


  }} 
/>        
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <FormInput
              label="Username"
              name="username"
              placeholder="Enter username"
              value={username}
              onChange={(v) => setUsername(v)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(v) => setPassword(v)}
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '10px',
              borderRadius: '5px',
              fontSize: '16px'
            }}
          >
            Login
          </Button>
        </form>

        {/* HINT */}
        <div style={styles.hint}>
          <strong>Demo accounts</strong> (username = password):<br />
          <code>admin</code> · <code>manager</code> · <code>responsable</code>
        </div>

      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage:
      `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://www.bank-of-algeria.dz/wp-content/uploads/2022/08/IMG_3621-wecompress.com_-scaled.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    width: '400px'
  },
  title: {
    textAlign: 'center',
    color: '#001838',
    marginTop: '5px'
  },
  inputGroup: {
    marginBottom: '15px'
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '10px'
  },
  hint: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)'
  }
  
};

export default Login;
