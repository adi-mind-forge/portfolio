import { useEffect, useRef } from 'react'

export default function Popup({ card, onClose }) {
  const show = !!card
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [card])

  return (
    <div
      className={`popup-overlay absolute inset-0 z-[60] flex items-center justify-center transition-opacity duration-300 ${show ? 'show opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ background: 'rgba(4,10,5,0.88)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={`popup-card-inner popup-grid relative overflow-hidden flex flex-col`}
        style={{
          width: 'min(360px, 78%)',
          maxHeight: '88vh',
          borderRadius: 14,
          background: '#0a130b',
          border: card ? card.accentBorder : '1px solid rgba(0,255,80,0.22)',
          boxShadow: card ? `0 0 60px ${card.accentGlow}, 0 50px 100px rgba(0,0,0,0.85)` : 'none',
          color: '#F5F0E8',
        }}
      >
        {/* Header */}
        <div className="relative flex-shrink-0 z-[1]" style={{ padding: '1.5rem 1.5rem 0.9rem' }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-[26px] h-[26px] rounded-[4px] flex items-center justify-center cursor-pointer text-[11px] transition-all duration-200 font-['Space_Mono']"
            style={{ background: 'rgba(0,255,80,0.06)', border: '1px solid rgba(0,255,80,0.18)', color: 'rgba(0,255,80,0.5)' }}
            onMouseEnter={e => { e.target.style.background = 'rgba(0,255,80,0.12)'; e.target.style.color = '#7dff9b'; e.target.style.borderColor = 'rgba(0,255,80,0.4)' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(0,255,80,0.06)'; e.target.style.color = 'rgba(0,255,80,0.5)'; e.target.style.borderColor = 'rgba(0,255,80,0.18)' }}
          >
            ✕
          </button>
          <div className="text-[1rem] mb-1.5" style={{ color: 'rgba(0,255,80,0.35)' }}>{card?.suit}</div>
          <div className="font-['Space_Mono'] text-[7px] tracking-[0.22em] uppercase mb-1.5" style={{ color: 'rgba(0,255,80,0.4)' }}>
            {'> '}{card?.label}
          </div>
          <div
            className="font-['Space_Mono'] font-bold leading-[1.15]"
            style={{ fontSize: 'clamp(1.1rem,3vw,1.55rem)', color: '#F5F0E8' }}
            dangerouslySetInnerHTML={{ __html: card?.mini_title?.replace('\n', '<br/>') || '' }}
          />
        </div>

        <div style={{ height: 1, background: 'rgba(0,255,80,0.12)', margin: '0 1.5rem' }} />

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="pop-scroll flex-1 overflow-y-auto relative z-[1]"
          style={{ padding: '0 1.5rem 1.6rem' }}
          dangerouslySetInnerHTML={{ __html: card ? buildPopupHTML(card) : '' }}
        />
      </div>
    </div>
  )
}

function buildPopupHTML(card) {
  const content = card.popupContent()
  // Inject tag classes if needed
  if (card.tagClass) {
    return content.replace(/class="pop-tag"/g, `class="pop-tag ${card.tagClass}"`)
  }
  return content
}
