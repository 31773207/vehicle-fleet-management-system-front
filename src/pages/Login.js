import React, { useState } from 'react';
import axios from 'axios';
import Button from '../components/common/Button';
import { FormInput } from '../components/common/FormInput';
import './nav.css';
import bankLogo from '../assets/bank.jpg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // In Login.js - handleLogin function
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', { username, password });
    
    // Get role from response or determine from username
const userRole = response.data.role || 
                 (username.toLowerCase().startsWith('respons') ? 'RESPONSABLE' :
                  username.toLowerCase().startsWith('manager') ? 'MANAGER' : 'ADMIN');
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('username', response.data.username);
    
    window.location.href = '/dashboard';
  } catch (err) {
    setError('Invalid username or password!');
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* LOGO */}
        <div style={styles.logoContainer}>
          <img 
            src={bankLogo} 
            alt="Bank Of Algeria Logo" 
            style={styles.logo}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {/* FORM */}
        <form onSubmit={handleLogin} style={styles.form}>
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
            style={styles.loginButton}
          >
            Login
          </Button>
        </form>

        {/* footer */}
        <div style={styles.hint}>
  © {new Date().getFullYear()} Bank Of Algeria - Fleet Management System
</div>

      <style>
    {`
    input::placeholder {
      color: #020d4b !important;
      opacity: 0.8;
      font-style: italic;
      font-size: 16px !important;
    }
    input:focus::placeholder {
      color: transparent !important;
    }
    input:focus {
      border-color: #020d4b!important;
      outline: none;
    }
  `}
</style>
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
    backgroundImage: `linear-gradient(rgba(46, 45, 45, 0.27), rgba(0, 0, 0, 0.56)), url("https://www.bank-of-algeria.dz/wp-content/uploads/2022/08/IMG_3621-wecompress.com_-scaled.jpg")`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },
  card: {
     backgroundColor: 'rgba(78, 118, 137, 0.31)',
    backdropFilter: 'blur(15px)',
    padding: '40px 30px',
    borderRadius: '20px',
    width: '420px',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  logoContainer: {
    textAlign: 'center',
    marginBottom: '5px'
  },
  logo: {
    width: '200px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '2px solid #001838',
    padding: '2px',
    backgroundColor: 'rgba(255,255,255,0.1)'
  },
  bankTitle: {
    color: '#020d4b',
    marginTop: '15px',
    marginBottom: '0',
    fontSize: '22px',
    fontWeight: 'bold',
    letterSpacing: '1px'
  },
  form: {
    width: '100%'
  },
  inputGroup: {
    marginBottom: '20px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
    
  },
  loginButton: {
    width: '100%',
    padding: '12px',
    marginTop: '10px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    backgroundColor: '#020d4b',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
    backgroundColor: 'rgba(255,0,0,0.1)',
    padding: '8px',
    borderRadius: '5px'
  },
    hint: {
    marginTop: '25px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.7)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '15px'
  },
  
};

export default Login;