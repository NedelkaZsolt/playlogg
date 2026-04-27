interface LoginPageProps {
  onLogin: () => void
  loading?: boolean
}

// Steam SVG logo (official brand asset shape)
function SteamLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 233 233" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M116.5 0C52.1 0 0 52.1 0 116.5c0 55.4 38.6 101.8 90.6 113.5l33.5-82.6c-1.3.1-2.6.1-3.9.1-24.8 0-44.9-20.1-44.9-44.9s20.1-44.9 44.9-44.9 44.9 20.1 44.9 44.9c0 21.6-15.3 39.7-35.7 44l-32.8 80.9c3.8.6 7.7.9 11.7.9 64.4 0 116.5-52.1 116.5-116.5S180.9 0 116.5 0z"
        fill="white"
        opacity="0.9"
      />
      <path
        d="M116.2 80.6c-19.8 0-35.8 16-35.8 35.8s16 35.8 35.8 35.8 35.8-16 35.8-35.8-16.1-35.8-35.8-35.8z"
        fill="white"
        opacity="0.5"
      />
    </svg>
  )
}

export function LoginPage({ onLogin, loading }: LoginPageProps) {
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
        <div className="flex items-center gap-2.5 mb-6 select-none">
          <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 2C11 2 16 7.5 16 12.5C16 15.5 13.8 18 11 18C8.2 18 6 15.5 6 12.5C6 10.2 7.4 8.4 7.4 8.4C7.4 8.4 6.8 11.2 9.2 12.2C9.2 12.2 8.5 9.4 11 8C11 8 10.2 10.8 12.3 11.6C12.3 11.6 14 10 14 12.8C14 14.3 12.7 15.5 11 15.5C9.3 15.5 8 14.3 8 12.8C8 11.5 9 10.5 10 10.2"
              stroke="#3b82f6"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[20px] font-bold tracking-tight">
            <span style={{ color: '#e4e4ef' }}>Play</span>
            <span style={{ color: '#3b82f6' }}>Logg</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[18px] font-bold mb-2" style={{ color: '#e4e4ef' }}>
          Üdvözlünk!
        </h1>
        <p className="text-[13px] mb-8 leading-relaxed" style={{ color: '#52526a' }}>
          Jelentkezz be Steam fiókoddal hogy<br />nyomon követhesd játékaid és barátaid.
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
              Profil betöltése...
            </span>
          </div>
        ) : (
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
            <SteamLogo />
            Bejelentkezés Steammel
          </button>
        )}

        {/* Fine print */}
        <p className="text-[11px] mt-5 leading-relaxed" style={{ color: '#3e3e56' }}>
          A bejelentkezéssel elfogadod az{' '}
          <span style={{ color: '#52526a', cursor: 'pointer', textDecoration: 'underline' }}>
            adatvédelmi szabályzatot
          </span>
          .<br />
          Semmilyen adatodat nem tároljuk Steam szerveren kívül.
        </p>
      </div>

      {/* Bottom label */}
      <p className="text-[11px] mt-6" style={{ color: '#27273a' }}>
        PlayLogg — nem kapcsolódik a Valve Corporation-höz
      </p>
    </div>
  )
}
