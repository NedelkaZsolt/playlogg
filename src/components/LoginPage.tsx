interface LoginPageProps {
  onLogin: () => void
  onDemoLogin: () => void
  loading?: boolean
}

export function LoginPage({ onLogin, onDemoLogin, loading }: LoginPageProps) {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        height: '100vh',
        background: '#0c0c11',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Atmospheric background glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, #3b82f608 0%, transparent 65%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%',
          left: '15%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(ellipse at center, #3b82f608 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Card */}
      <div
        className="relative flex flex-col items-center text-center"
        style={{
          width: '380px',
          padding: '48px 40px',
          background: '#15151d',
          border: '1px solid #1e1e2c',
          borderRadius: '16px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Logo */}
        <div className="mb-6 select-none">
          <img src="/logo.png" alt="PlayLogg" className="mx-auto" style={{ width: '160px', height: 'auto' }} />
        </div>

        {/* Heading */}
        <h1 className="text-[18px] font-bold mb-2" style={{ color: '#e4e4ef' }}>
          Welcome!
        </h1>
        <p className="text-[13px] mb-8 leading-relaxed" style={{ color: '#52526a' }}>
          Log in with your Steam account to track your games and friends.
        </p>

        {/* Divider */}
        <div className="w-full mb-6" style={{ height: '1px', background: '#1e1e2c' }} />

        {/* Steam button */}
        {loading ? (
          <div className="w-full flex items-center justify-center gap-3 py-3 rounded-lg"
            style={{ background: '#1b2838', border: '1px solid #2a3f5a' }}>
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#66c0f4" strokeWidth="2" strokeLinecap="round"
                strokeDasharray="32" strokeDashoffset="12" />
            </svg>
            <span className="text-[14px] font-semibold" style={{ color: '#66c0f4' }}>
              Loading profile...
            </span>
          </div>
        ) : (
          <>
            <button
              onClick={onLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-[14px] font-semibold transition-all duration-150"
              style={{ background: '#1b2838', color: '#fff', border: '1px solid #2a3f5a' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#213347'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#3d6080'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1b2838'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2a3f5a'
              }}
            >
              <img src="/steam.png" alt="Steam" width="20" height="20" />
              Sign in with Steam
            </button>
            <button
              onClick={onDemoLogin}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-lg text-[14px] font-semibold transition-all duration-150 mt-3"
              style={{ background: '#14151c', color: '#a5b4fc', border: '1px solid #2a2d40' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#1b1d28'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#3f4a77'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = '#14151c'
                ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2a2d40'
              }}
            >
              <span style={{ width: '20px', display: 'inline-block' }}>👾</span>
              Use demo account
            </button>
          </>
        )}

        {/* Fine print */}
        <p className="text-[11px] mt-5 leading-relaxed" style={{ color: '#3e3e56' }}>
          By signing in you agree to the{' '}
          <span style={{ color: '#52526a', cursor: 'pointer', textDecoration: 'underline' }}>
            privacy policy
          </span>
          .<br />
          We do not store any of your data outside of Steam.
        </p>
      </div>

      {/* Bottom label */}
      <p className="text-[11px] mt-6" style={{ color: '#27273a' }}>
        PlayLogg — not affiliated with Valve Corporation
      </p>
    </div>
  )
}
