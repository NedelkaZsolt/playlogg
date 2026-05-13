import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import type { NavTab } from '../types'

interface EventNotificationBarProps {
  activeTab: NavTab
}

export function EventNotificationBar({ activeTab }: EventNotificationBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    // Show notification when Home tab is active
    if (activeTab === 'Home') {
      setIsVisible(true)
      // Trigger animation after a tiny delay to ensure CSS transition works
      setTimeout(() => setShowAnimation(true), 50)
    } else {
      setIsVisible(false)
      setShowAnimation(false)
    }
  }, [activeTab])

  const handleClose = () => {
    setShowAnimation(false)
    // Keep it closed for this tab switch
    setTimeout(() => setIsVisible(false), 600)
  }

  if (!isVisible) return null

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .event-notification-enter {
          animation: slideUp 0.8s ease-out forwards;
        }
        .event-notification-exit {
          animation: slideUp 0.6s ease-in reverse forwards;
        }
      `}</style>
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 px-4 py-5 transition-all duration-300 ${
          showAnimation ? 'event-notification-enter' : 'event-notification-exit'
        }`}
        style={{
          background: '#2a2a3a',
          borderTop: '1px solid #3a3a4a',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          {/* Icon and Text container */}
          <div className="flex items-center gap-4 flex-1">
            {/* Image */}
            <div className="flex-shrink-0 w-20 aspect-video rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: '#dc263518' }}>
              <img src="/esl.gif" alt="ESL Event" className="w-full h-full object-cover" />
            </div>

            {/* Text content */}
            <div className="flex-1 cursor-pointer group">
              <p
                className="text-[18px] font-bold leading-tight"
                style={{
                  background: 'linear-gradient(90deg, #3b82f6 0%, #ef4444 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Hamarosan új event kezdődik, ne maradj le róla!
              </p>
              <p
                className="text-[13px] mt-1 transition-colors"
                style={{ color: '#8a8aa0' }}
              >
                Te se a részletekért <span onClick={() => window.open('https://esl.com/', '_blank')} style={{ color: '#3b82f6', cursor: 'pointer', fontWeight: '600' }} className="group-hover:text-blue-400">click ide</span>
              </p>
            </div>
          </div>

          {/* Close button - positioned on the right */}
          <button
            onClick={handleClose}
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: '#dc263533',
              color: '#dc2635',
              border: '1px solid #dc263555',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#dc2635'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = '#dc263533'
              ;(e.currentTarget as HTMLButtonElement).style.color = '#dc2635'
            }}
            aria-label="Close notification"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </>
  )
}
