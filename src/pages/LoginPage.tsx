import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import type { Role } from '../types'

const ROLE_CARDS: Array<{ role: Role; title: string; subtitle: string; icon: string }> = [
  { role: 'senior', title: 'Senior Leadership', subtitle: 'CEO · CFO · Medical Director', icon: '📊' },
  { role: 'icb', title: 'ICB Pharmacist', subtitle: 'Medicines Optimisation Team', icon: '💊' },
  { role: 'pcn', title: 'PCN Pharmacist', subtitle: 'Primary Care Network', icon: '🏥' },
  { role: 'gp', title: 'Practice Team', subtitle: 'GP practice pharmacist / manager', icon: '🩺' },
]

const DEFAULT_EMAILS: Record<Role, string> = {
  senior: 'l.singh@syicb.nhs.uk',
  icb: 'Marvel@southyorkshire.icb.nhs.uk',
  pcn: 'sarah.khan@sheffieldeast.syicb.nhs.uk',
  gp: 'j.okafor@darnallhc.syicb.nhs.uk',
}

export function LoginPage() {
  const { login, selectedRole, setSelectedRole } = useAuth()
  const [email, setEmail] = useState(DEFAULT_EMAILS[selectedRole])
  const [password, setPassword] = useState('QippTest2026!')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setEmail(DEFAULT_EMAILS[role])
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')
    try {
      await login(email, password)
    } catch {
      setError('Invalid email or password. Check backend API and credentials.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div id="login">
      <section className="ll">
        <div className="ll-logo">
          <div className="ll-mark">◈</div>
          <div className="ll-name">
            MedSave
            <span>NHS Medicines Optimisation - South Yorkshire ICB</span>
          </div>
        </div>

        <div className="ll-hero">
          <h1>
            Find millions in
            <br />
            <em>prescribing savings.</em>
            <br />
            Every month.
          </h1>
          <p>
            Full BNF analysis · Drug Tariff cross-reference · OpenPrescribing live data · ICB benchmarking · AI patient search · action
            sheets · patient letters.
          </p>
        </div>

        <div className="ll-stats">
          <div className="lst"><div className="lst-v">£4.3M</div><div className="lst-l">Estimated annual saving identified across South Yorkshire ICB</div></div>
          <div className="lst"><div className="lst-v">35</div><div className="lst-l">Validated opportunities live this month</div></div>
          <div className="lst"><div className="lst-v">3-5x</div><div className="lst-l">More opportunities than NHSE 16 alone</div></div>
          <div className="lst"><div className="lst-v">Live</div><div className="lst-l">OpenPrescribing API integration</div></div>
        </div>
      </section>

      <section className="lr">
        <h2>Sign in to MedSave</h2>
        <div className="lr-sub">Select your role · each view is tailored to what you need to do</div>

        <div className="rg">
          {ROLE_CARDS.map((card) => (
            <button key={card.role} className={`rb ${selectedRole === card.role ? 'sel' : ''}`} onClick={() => onRoleSelect(card.role)}>
              <div className="rb-ic">{card.icon}</div>
              <div className="rb-n">{card.title}</div>
              <div className="rb-s">{card.subtitle}</div>
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit}>
          <label className="fl" htmlFor="email">NHS email</label>
          <input id="email" className="fi" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

          <label className="fl" htmlFor="password">Password</label>
          <input
            id="password"
            className="fi"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error ? <div className="err">{error}</div> : null}
          <button className="sign" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Signing in...' : 'Sign in with NHS login'}
          </button>
        </form>
      </section>
    </div>
  )
}
