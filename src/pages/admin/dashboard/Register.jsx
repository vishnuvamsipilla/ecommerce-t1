import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import axiosClient from "../../../api/axiosClient";
import styles from "./register.module.scss";

export default function Register({ from }) {
  console.log(from, "fromfrom");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerStatus, setRegisterStatus] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onTouched",
  });

  // Watch password value for confirm-password cross-validation
  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setRegisterStatus(null);

    const { confirmPassword, ...rest } = data;

    const registrationPayload = {
      ...rest,
      role: from === "admin" ? "admin" : "user",
    };

    try {
      const response = await axiosClient.post(
        "/auth/register",
        registrationPayload,
      );
      console.log(response, "response");
      setRegisterStatus({
        success: true,
        message: `Account created successfully! Welcome, ${data.userName}!`,
      });
      reset();
      navigate("/login");
    } catch (error) {
      const serverMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Registration failed. Please try again.";
      setRegisterStatus({
        success: false,
        message:
          typeof serverMessage === "string"
            ? serverMessage
            : "Registration failed.",
      });
    }
  };

  return (
    <main className={styles.registerPage}>
      <div className={`${styles.registerBgGlow} ${styles.glow1}`}></div>
      <div className={`${styles.registerBgGlow} ${styles.glow2}`}></div>
      <div className={`${styles.registerBgGlow} ${styles.glow3}`}></div>

      <div className={styles.registerCard}>
        {/* Brand Header */}
        <div className={styles.brandBadge}>
          <svg
            className={styles.brandIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <span className={styles.brandName}>AuraStore</span>
        </div>

        <div className={styles.registerHeader}>
          <h1 className={styles.registerTitle}>Create an account</h1>
          <p className={styles.registerSubtitle}>
            Join AuraStore and start your shopping journey
          </p>
        </div>

        {/* Status notification */}
        {registerStatus && (
          <div
            className={`${styles.statusBanner} ${!registerStatus.success ? styles.statusBannerError : ""}`}
            role="alert"
          >
            {registerStatus.success ? (
              <svg
                className={styles.statusIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className={styles.statusIcon}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1 7a1 1 0 100-2 1 1 0 000 2z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{registerStatus.message}</span>
          </div>
        )}

        {/* Social Sign-up */}
        <div className={styles.socialGrid}>
          <button
            type="button"
            className={styles.btnSocial}
            id="btn-google-register"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            className={styles.btnSocial}
            id="btn-github-register"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            GitHub
          </button>
        </div>

        <div className={styles.divider}>
          <span>or sign up with email</span>
        </div>

        {/* Registration Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.registerForm}
          noValidate
        >
          {/* Username Field */}
          <div className={styles.formGroup}>
            <label htmlFor="userName" className={styles.formLabel}>
              Username
            </label>
            <div
              className={`${styles.inputWrapper} ${errors.userName ? styles.hasError : ""}`}
            >
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <input
                id="userName"
                type="text"
                autoComplete="username"
                enterKeyHint="next"
                placeholder="e.g. john_doe"
                className={styles.formInput}
                aria-invalid={errors.userName ? "true" : "false"}
                aria-describedby={
                  errors.userName ? "userName-error" : undefined
                }
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message: "Username cannot exceed 20 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: "Only letters, numbers, and underscores allowed",
                  },
                })}
              />
            </div>
            {errors.userName && (
              <p
                id="userName-error"
                className={styles.errorMessage}
                role="alert"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="reg-email" className={styles.formLabel}>
              Email Address
            </label>
            <div
              className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ""}`}
            >
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
              <input
                id="reg-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                enterKeyHint="next"
                placeholder="you@example.com"
                className={styles.formInput}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "reg-email-error" : undefined}
                {...register("email", {
                  required: "Email address is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                })}
              />
            </div>
            {errors.email && (
              <p
                id="reg-email-error"
                className={styles.errorMessage}
                role="alert"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="reg-password" className={styles.formLabel}>
              Password
            </label>
            <div
              className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ""}`}
            >
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                enterKeyHint="next"
                placeholder="Min. 8 characters"
                className={styles.formInput}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={
                  errors.password ? "reg-password-error" : "password-hint"
                }
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: "Must include uppercase, lowercase, and a number",
                  },
                })}
              />
              <button
                type="button"
                className={styles.btnTogglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.password ? (
              <p
                id="reg-password-error"
                className={styles.errorMessage}
                role="alert"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.password.message}
              </p>
            ) : (
              <p id="password-hint" className={styles.hintMessage}>
                8+ chars with uppercase, lowercase &amp; number
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.formLabel}>
              Confirm Password
            </label>
            <div
              className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.hasError : ""}`}
            >
              <svg
                className={styles.inputIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                enterKeyHint="done"
                placeholder="Re-enter your password"
                className={styles.formInput}
                aria-invalid={errors.confirmPassword ? "true" : "false"}
                aria-describedby={
                  errors.confirmPassword ? "confirmPassword-error" : undefined
                }
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === passwordValue || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className={styles.btnTogglePassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                    />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                className={styles.errorMessage}
                role="alert"
              >
                <svg
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  width="12"
                  height="12"
                  style={{ flexShrink: 0 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms notice */}
          <p className={styles.termsText}>
            By registering, you agree to our{" "}
            <a
              href="#terms"
              className={styles.linkInline}
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#privacy"
              className={styles.linkInline}
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
            .
          </p>

          {/* Submit button */}
          <button
            type="submit"
            className={styles.btnSubmit}
            id="btn-create-account"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.spinnerWrapper}>
                <span className={styles.spinner}></span>
                <span>Creating account...</span>
              </span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className={styles.registerFooter}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.linkHighlight}>
              Sign in
            </Link>
          </p>
          <div className={styles.navShortcut}>
            <Link to="/" className={styles.linkHome}>
              ← Return to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
