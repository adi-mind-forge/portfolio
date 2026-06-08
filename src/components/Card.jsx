import { forwardRef } from 'react'

function Card({ data, flipped, active, dealt, clickable, onClick }, ref) {
  const tagClass = data.lt
    ? 'ctag-lt'
    : data.cls === 'fc-education'
    ? 'ctag-bl'
    : data.cls === 'fc-achieve'
    ? 'ctag-pu'
    : ''

  return (
    <div
      ref={ref}
      className={`card-wrap absolute opacity-0${flipped ? ' flipped' : ''}`}
      style={{
        width: 'clamp(120px,17vw,175px)',
        height: 'clamp(168px,23.8vw,245px)',
        cursor: clickable ? 'pointer' : 'default',
        pointerEvents: clickable ? 'auto' : 'none',
        left: '50%',
        top: '50%',
      }}
      onClick={onClick}
    >
      <div className="card-inner">
        {/* Back */}
        <div
          className="card-back card-back-scanlines flex items-center justify-center overflow-hidden"
          style={{
            background: '#0a120b',
            border: '1px solid rgba(0,255,80,0.2)',
            boxShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 24px rgba(0,255,80,0.05), inset 0 0 20px rgba(0,0,0,0.5)',
          }}
        >
          <div
            className="relative z-[2] flex items-center justify-center font-['Space_Mono'] text-[1.4rem] font-bold tracking-[0.05em]"
            style={{
              width: '86%', height: '86%',
              border: '1px solid rgba(0,255,80,0.12)',
              borderRadius: 6,
              background: 'rgba(0,255,80,0.02)',
              color: 'rgba(0,255,80,0.2)',
            }}
          >
            ✦
          </div>
        </div>

        {/* Front */}
        <div
          className="card-front card-front-grid flex flex-col p-[1rem_0.9rem] overflow-hidden"
          style={{
            background: '#0d1a0e',
            color: '#F5F0E8',
            border: data.cardBorder,
            boxShadow: data.cardShadow,
          }}
        >
          {/* Scan sweep */}
          <div className="scan-sweep" />

          {/* Corner index TL */}
          <div
            className="absolute top-[7px] left-[8px] font-['Space_Mono'] text-[7px] tracking-[0.1em] uppercase leading-[1.4] z-[2]"
            style={{ color: data.indexColor }}
          >
            {data.num}<br />{data.label.slice(0, 3)}
          </div>
          {/* Corner index BR */}
          <div
            className="absolute bottom-[7px] right-[8px] font-['Space_Mono'] text-[7px] tracking-[0.1em] uppercase leading-[1.4] z-[2]"
            style={{ color: data.indexColor, transform: 'rotate(180deg)' }}
          >
            {data.num}<br />{data.label.slice(0, 3)}
          </div>

          {/* Card content */}
          <div className="flex-1 flex flex-col justify-center pt-1.5 relative z-[2]">
            <div className="font-['Space_Mono'] text-[6px] tracking-[0.2em] uppercase mb-1.5" style={{ color: data.labelColor }}>
              {'>'} {data.label}
            </div>
            <div
              className="font-['Space_Mono'] font-bold leading-[1.2] mb-1.5"
              style={{ fontSize: 'clamp(0.72rem,1.5vw,0.95rem)', color: data.titleColor }}
              dangerouslySetInnerHTML={{ __html: data.mini_title.replace('\n', '<br/>') }}
            />
            <div className="font-['DM_Sans'] text-[0.6rem] leading-[1.65]" style={{ color: 'rgba(245,240,232,0.42)' }}>
              {data.mini_body}
            </div>
            <div className="flex flex-wrap gap-0.5 mt-2">
              {data.mini_tags.map(t => (
                <span
                  key={t}
                  className={`font-['Space_Mono'] text-[6px] px-1.5 py-0.5 rounded-[3px] tracking-[0.08em] ${tagClass}`}
                  style={
                    !tagClass
                      ? { border: '1px solid rgba(0,255,80,0.18)', color: 'rgba(0,255,80,0.5)', background: 'rgba(0,255,80,0.04)' }
                      : {}
                  }
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Suit icon */}
          <div
            className="absolute bottom-[22px] left-[9px] text-[1rem] z-[2]"
            style={{ opacity: 0.12, color: data.suitColor }}
          >
            {data.suit}
          </div>
        </div>
      </div>

      {/* Glitch layer */}
      <div className="card-glitch-layer flex flex-col p-[1rem_0.9rem]">
        <div className="font-['Space_Mono'] text-[7px] tracking-[0.1em] uppercase leading-[1.4]" style={{ color: 'rgba(0,255,80,0.35)' }}>
          {data.num}<br />{data.label.slice(0, 3)}
        </div>
        <div className="flex-1 flex flex-col justify-center pt-1.5">
          <div className="font-['Space_Mono'] text-[6px] tracking-[0.2em] uppercase mb-1.5" style={{ color: 'rgba(0,255,80,0.4)' }}>
            {'>'} {data.label}
          </div>
          <div
            className="font-['Space_Mono'] font-bold leading-[1.2]"
            style={{ fontSize: 'clamp(0.72rem,1.5vw,0.95rem)' }}
            dangerouslySetInnerHTML={{ __html: data.mini_title.replace('\n', '<br/>') }}
          />
        </div>
      </div>
    </div>
  )
}

export default forwardRef(Card)
