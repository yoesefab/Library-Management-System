import { useEffect, useId, useState } from 'react'
import { BookOpen, CircleNotch, WarningCircle } from '@phosphor-icons/react'
import { ErrorMessage } from '../shared/ErrorMessage.jsx'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function PasswordField({
  error,
  errorId,
  id,
  onChange,
  showPassword,
  togglePassword,
  value,
}) {
  return (
    <div className='field-group'>
      <label htmlFor={id}>Mot de passe</label>
      <div
        className={`field-control password-control${error ? ' is-invalid' : ''}`}
      >
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoComplete='current-password'
          id={id}
          name='password'
          onChange={onChange}
          placeholder='••••••••••••'
          type={showPassword ? 'text' : 'password'}
          value={value}
        />
        <button
          aria-controls={id}
          aria-pressed={showPassword}
          className='password-toggle'
          onClick={togglePassword}
          type='button'
        >
          {showPassword
            ? 'Masquer le mot de passe'
            : 'Afficher le mot de passe'}
        </button>
      </div>
      {error ? <ErrorMessage id={errorId}>{error}</ErrorMessage> : null}
    </div>
  )
}

export function LoginPage() {
  const emailId = useId()
  const emailErrorId = `${emailId}-error`
  const passwordId = useId()
  const passwordErrorId = `${passwordId}-error`
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [authenticationError, setAuthenticationError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    document.title = 'Connexion — Maarif Analytics'
  }, [])

  const validate = () => {
    const nextErrors = {}

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Saisissez une adresse e-mail valide.'
    }

    if (!password) {
      nextErrors.password = 'Le mot de passe est requis.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setAuthenticationError(false)

    if (!validate()) {
      return
    }

    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      setAuthenticationError(true)
    }, 1200)
  }

  return (
    <main className='login-page'>
      <div className='login-shell'>
        <section aria-labelledby='login-title' className='login-column'>
          <div className='brand' aria-label='Maarif Analytics'>
            <BookOpen aria-hidden='true' className='brand-icon' weight='fill' />
            <span className='brand-name'>
              <strong>Maarif</strong> Analytics
            </span>
          </div>

          <div className='brand-rule' aria-hidden='true' />

          <div className='form-region'>
            <h1 id='login-title'>Connectez-vous à votre espace</h1>

            {authenticationError ? (
              <div className='authentication-error live-error' role='alert'>
                <WarningCircle aria-hidden='true' weight='fill' />
                <span>Adresse e-mail ou mot de passe incorrect.</span>
              </div>
            ) : null}

            <form noValidate onSubmit={handleSubmit}>
              <div className='field-group'>
                <label htmlFor={emailId}>Adresse e-mail</label>
                <div
                  className={`field-control${errors.email ? ' is-invalid' : ''}`}
                >
                  <input
                    aria-describedby={errors.email ? emailErrorId : undefined}
                    aria-invalid={Boolean(errors.email)}
                    autoComplete='email'
                    id={emailId}
                    inputMode='email'
                    name='email'
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (errors.email) {
                        setErrors((current) => ({
                          ...current,
                          email: undefined,
                        }))
                      }
                      setAuthenticationError(false)
                    }}
                    placeholder='prenom.nom@maarifculture.ma'
                    type='email'
                    value={email}
                  />
                </div>
                {errors.email ? (
                  <ErrorMessage id={emailErrorId}>{errors.email}</ErrorMessage>
                ) : null}
              </div>

              <PasswordField
                error={errors.password}
                errorId={passwordErrorId}
                id={passwordId}
                onChange={(event) => {
                  setPassword(event.target.value)
                  if (errors.password) {
                    setErrors((current) => ({
                      ...current,
                      password: undefined,
                    }))
                  }
                  setAuthenticationError(false)
                }}
                showPassword={showPassword}
                togglePassword={() => setShowPassword((current) => !current)}
                value={password}
              />

              <button
                className='submit-button'
                disabled={isLoading}
                type='submit'
              >
                {isLoading ? (
                  <>
                    <CircleNotch aria-hidden='true' className='spinner' />
                    <span>Connexion en cours…</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
