import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const { register, error } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        password: '',
        password2: '',
        user_type: 'buyer', // default to buyer
        phone_number: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const userTypes = [
        { value: 'buyer', label: 'Buyer' },
        { value: 'farmer', label: 'Farmer' },
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear field-specific error when user types
        if (fieldErrors[e.target.name]) {
            setFieldErrors({
                ...fieldErrors,
                [e.target.name]: '',
            });
        }
        setLocalError('');
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) {
            errors.name = 'Username is required';
        } else if (formData.name.length < 3) {
            errors.name = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.password2) {
            errors.password2 = 'Passwords do not match';
        }

        if (formData.phone_number && !/^\d{10}$/.test(formData.phone_number)) {
            errors.phone_number = 'Phone number must be 10 digits';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            return;
        }

        setLoading(true);
        setLocalError('');

        const result = await register(formData);

        if (result.success) {
            navigate('/profile');
        } else {
            setLocalError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Create Account</h2>
                    <p>Join our farmers market community</p>
                </div>

                {(localError || error) && (
                    <div className="auth-error">
                        {localError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name">Username *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Choose a username"
                            disabled={loading}
                            className={fieldErrors.name ? 'error' : ''}
                        />
                        {fieldErrors.name && (
                            <span className="field-error">{fieldErrors.name}</span>
                        )}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Password *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create password"
                                disabled={loading}
                                className={fieldErrors.password ? 'error' : ''}
                            />
                            {fieldErrors.password && (
                                <span className="field-error">{fieldErrors.password}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password2">Confirm Password *</label>
                            <input
                                type="password"
                                id="password2"
                                name="password2"
                                value={formData.password2}
                                onChange={handleChange}
                                placeholder="Confirm password"
                                disabled={loading}
                                className={fieldErrors.password2 ? 'error' : ''}
                            />
                            {fieldErrors.password2 && (
                                <span className="field-error">{fieldErrors.password2}</span>
                            )}
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="user_type">I am a *</label>
                        <select
                            id="user_type"
                            name="user_type"
                            value={formData.user_type}
                            onChange={handleChange}
                            disabled={loading}
                        >
                            {userTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Phone Number (Optional)</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            placeholder="10-digit phone number"
                            disabled={loading}
                            className={fieldErrors.phone_number ? 'error' : ''}
                        />
                        {fieldErrors.phone_number && (
                            <span className="field-error">{fieldErrors.phone_number}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">Location (Optional)</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, State"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;