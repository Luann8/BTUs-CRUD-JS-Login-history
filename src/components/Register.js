import React, { useState } from 'react';
import './Register.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validação básica no frontend
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.message === 'Usuário registrado com sucesso!') {
        setFormData({ username: '', email: '', password: '' }); // Limpar formulário
        onRegister();
      } else {
        setErrors({ server: data.message || 'Erro ao registrar' });
      }
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setErrors({ server: 'Erro ao conectar ao servidor. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Crie sua Conta</h2>
      {errors.server && <p className="register-error" role="alert">{errors.server}</p>}
      
      <form onSubmit={handleSubmit} className="register-form" noValidate>
        <div className="form-group">
          <label htmlFor="username">Nome de Usuário</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange('username')}
            placeholder="Digite seu nome de usuário"
            required
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.username && (
            <span id="username-error" className="error-message" role="alert">
              {errors.username}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="Digite seu email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <span id="email-error" className="error-message" role="alert">
              {errors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange('password')}
            placeholder="Digite sua senha"
            required
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.password && (
            <span id="password-error" className="error-message" role="alert">
              {errors.password}
            </span>
          )}
        </div>

        <button 
          type="submit" 
          className="register-btn" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Registrando...' : 'Registrar'}
        </button>
      </form>
    </div>
  );
};

export default Register;
