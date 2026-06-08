import { useEffect, useRef, useState, useCallback } from 'react'

import adityaPhoto from '../assets/aditya.jpg'
const PHOTO_B64 = adityaPhoto

const ROLES = [
  'Systems Engineer',
  'Linux Enthusiast',
  'C++ Developer',
  'Rust Learner',
  "CSE @ TIET '29",
  './build_cool_things.sh',
]

// Terminal lines for typing animation
const TERMINAL_LINES = [
  { prompt: 'aditya@arch:~$', cmd: 'cat whoami.conf', type: 'cmd' },
  { key: 'name',   val: 'Aditya Anand',      type: 'kv',  keyColor: '#E8B4A0', valColor: 'rgba(245,240,232,0.6)' },
  { key: 'distro', val: 'Arch Linux (btw)',   type: 'kv',  keyColor: '#E8B4A0', valColor: 'rgba(245,240,232,0.6)' },
  { key: 'status', val: 'open_to_work',       type: 'kv',  keyColor: '#E8B4A0', valColor: '#7dff9b' },
  { prompt: 'aditya@arch:~$', type: 'cursor' },
]

function fmtUptime(s) {
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600),
    m = Math.floor((s % 3600) / 60), ss = s % 60
  return d > 0 ? `${d}d ${h}h ${m}m ${ss}s` : `${h}h ${m}m ${ss}s`
}

export default function Hero({ blurred }) {
  const [typed, setTyped] = useState('')
  const [uptime, setUptime] = useState(0)
  const roleRef = useRef({ ri: 0, ci: 0, del: false })

  // Terminal typing state: which lines have appeared, and current char index of typing line
  const [termLines, setTermLines] = useState([])   // indices of fully revealed lines
  const [termTyping, setTermTyping] = useState(0)  // char index in current line being typed
  const [termCurrent, setTermCurrent] = useState(0) // which line is currently being typed

  // Parallax state
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const heroRef = useRef(null)

  // Uptime counter
  useEffect(() => {
    const secs = Math.floor(Math.random() * 86400 * 3 + 3600)
    setUptime(secs)
    const id = setInterval(() => setUptime(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Role typewriter
  useEffect(() => {
    let timeout
    function tick() {
      const { ri, ci, del } = roleRef.current
      const word = ROLES[ri]
      if (!del) {
        const nextCi = ci + 1
        setTyped(word.slice(0, nextCi))
        if (nextCi === word.length) {
          roleRef.current = { ri, ci: nextCi, del: true }
          timeout = setTimeout(tick, 1600)
        } else {
          roleRef.current = { ri, ci: nextCi, del: false }
          timeout = setTimeout(tick, 95)
        }
      } else {
        const nextCi = ci - 1
        setTyped(word.slice(0, nextCi))
        if (nextCi === 0) {
          roleRef.current = { ri: (ri + 1) % ROLES.length, ci: 0, del: false }
        } else {
          roleRef.current = { ri, ci: nextCi, del: true }
        }
        timeout = setTimeout(tick, 48)
      }
    }
    timeout = setTimeout(tick, 200)
    return () => clearTimeout(timeout)
  }, [])

  // Terminal overlay typing animation
  useEffect(() => {
    let timeout
    const CHAR_SPEED = 38
    const LINE_PAUSE = 180
    const START_DELAY = 600

    function typeLine(lineIdx, charIdx) {
      const line = TERMINAL_LINES[lineIdx]
      // Get the full text of this line
      const fullText = line.type === 'cmd'
        ? (line.prompt + ' ' + line.cmd)
        : line.type === 'kv'
        ? (line.key + ' = ' + line.val)
        : line.prompt

      if (charIdx <= fullText.length) {
        setTermTyping(charIdx)
        setTermCurrent(lineIdx)
        timeout = setTimeout(() => typeLine(lineIdx, charIdx + 1), CHAR_SPEED)
      } else {
        // Line done — add to completed, move to next
        setTermLines(prev => [...prev, lineIdx])
        const nextLine = lineIdx + 1
        if (nextLine < TERMINAL_LINES.length) {
          timeout = setTimeout(() => typeLine(nextLine, 0), LINE_PAUSE)
        }
      }
    }

    timeout = setTimeout(() => typeLine(0, 0), START_DELAY)
    return () => clearTimeout(timeout)
  }, [])

  // Mouse parallax
  const handleMouseMove = useCallback((e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2  // -1 to 1
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    setMouse({ x, y })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 })
  }, [])

  // Helper: render a terminal line (completed or currently typing)
  function renderTermLine(lineIdx, charsSoFar) {
    const line = TERMINAL_LINES[lineIdx]
    if (line.type === 'cmd') {
      const full = line.prompt + ' ' + line.cmd
      const chunk = full.slice(0, charsSoFar)
      const promptLen = line.prompt.length + 1
      const promptPart = chunk.slice(0, promptLen)
      const cmdPart = chunk.slice(promptLen)
      return (
        <span key={lineIdx} className="block">
          <span style={{ color: 'rgba(0,255,80,0.35)' }}>{promptPart}</span>
          <span style={{ color: '#7dff9b' }}>{cmdPart}</span>
          {charsSoFar < full.length && <span className="t-cursor" />}
        </span>
      )
    }
    if (line.type === 'kv') {
      const full = line.key + ' = ' + line.val
      const chunk = full.slice(0, charsSoFar)
      const keyEnd = line.key.length
      const eqEnd  = keyEnd + 3
      return (
        <span key={lineIdx} className="block">
          <span style={{ color: line.keyColor }}>{chunk.slice(0, keyEnd)}</span>
          <span style={{ color: 'rgba(0,255,80,0.55)' }}>{chunk.slice(keyEnd, eqEnd)}</span>
          <span style={{ color: line.valColor }}>{chunk.slice(eqEnd)}</span>
          {charsSoFar < full.length && <span className="t-cursor" />}
        </span>
      )
    }
    if (line.type === 'cursor') {
      const full = line.prompt
      const chunk = full.slice(0, charsSoFar)
      return (
        <span key={lineIdx} className="block">
          <span style={{ color: 'rgba(0,255,80,0.35)' }}>{chunk}</span>
          {charsSoFar >= full.length && <span className="t-cursor" />}
        </span>
      )
    }
  }

  // Parallax transforms
  const photoTx   = `translate(${mouse.x * -8}px, ${mouse.y * -8}px)`
  const textTx    = `translate(${mouse.x *  6}px, ${mouse.y *  6}px)`
  const badgeTx   = `translate(${mouse.x * 12}px, ${mouse.y * 12}px)`
  const glowTx1   = `translateY(-50%) translate(${mouse.x * 20}px, ${mouse.y * 20}px)`
  const glowTx2   = `translate(${mouse.x * -14}px, ${mouse.y * -14}px)`

  return (
    <div
      id="hero"
      ref={heroRef}
      className="absolute inset-0 bg-[#0d1a0e] grid scanline-overlay z-[1] overflow-hidden transition-all duration-1000"
      style={{
        gridTemplateColumns: '1fr 1.25fr',
        filter: blurred ? 'blur(14px) brightness(0.3) saturate(0.4)' : 'none',
        transform: blurred ? 'scale(1.08)' : 'scale(1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* CRT Vignette */}
      <div className="absolute inset-0 pointer-events-none z-[50]" style={{
        background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* Ambient glows — parallax layer 3 */}
      <div className="absolute pointer-events-none z-0" style={{
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,80,0.055) 0%, transparent 70%)',
        right: -80, top: '50%',
        transform: glowTx1,
        transition: 'transform 0.12s ease-out',
      }} />
      <div className="absolute pointer-events-none z-0" style={{
        width: 280, height: 280, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(196,113,74,0.07) 0%, transparent 70%)',
        left: -60, bottom: -60,
        transform: glowTx2,
        transition: 'transform 0.12s ease-out',
      }} />

      {/* LEFT: photo panel — parallax layer 1 (deepest) */}
      <div
        className="flex flex-col justify-center z-[2] relative"
        style={{
          padding: '2.8rem 2.2rem',
          borderRight: '1px solid rgba(0,255,80,0.1)',
          minHeight: 0,
        }}
      >
        {/* Photo frame */}
        <div
          className="relative overflow-hidden flex items-end"
          style={{
            borderRadius: 8,
            border: '1px solid rgba(0,255,80,0.2)',
            boxShadow: '0 0 40px rgba(0,255,80,0.08), 0 0 0 1px rgba(0,255,80,0.06)',
            flex: 1,
            minHeight: 0,
            maxHeight: 'calc(100vh - 11rem)',
            transform: photoTx,
            transition: 'transform 0.18s ease-out',
          }}
        >
          <img
            src={PHOTO_B64}
            alt="Aditya Anand"
            className="w-full h-full object-cover object-top block"
            style={{ mixBlendMode: 'normal' }}
          />

          {/* Terminal overlay — typed line by line */}
          <div
            className="absolute bottom-0 left-0 right-0 z-[2] font-['Space_Mono'] leading-[1.85]"
            style={{
              background: 'linear-gradient(transparent, rgba(13,26,14,0.95) 40%)',
              padding: '1.8rem 1rem 0.9rem',
              fontSize: '0.6rem',
              color: 'rgba(0,255,80,0.55)',
            }}
          >
            {TERMINAL_LINES.map((_, i) => {
              const isDone    = termLines.includes(i)
              const isCurrent = !isDone && termCurrent === i
              if (!isDone && !isCurrent) return null
              const chars = isDone
                ? Infinity  // render full line
                : termTyping
              return renderTermLine(i, isDone ? 9999 : chars)
            })}
          </div>

          {/* Scanline overlay */}
          <div className="photo-scan" />
        </div>

        {/* Meta rows */}
        <div className="mt-5 flex flex-col gap-1.5">
          {[
            <><div className="dot-live" />uptime: <span>{fmtUptime(uptime)}</span></>,
            'load: 0.42 0.38 0.31 · mem: 7.2GiB / 16GiB',
            'gh: /adi-mind-forge · li: /your-profile',
          ].map((content, i) => (
            <div key={i} className="flex gap-2 items-center font-['Space_Mono'] text-[8px] tracking-[0.08em]" style={{ color: 'rgba(0,255,80,0.28)' }}>
              {content}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: identity block — parallax layer 2 */}
      <div
        className="flex flex-col justify-center z-[2] relative"
        style={{
          padding: '3rem 3rem 3rem 2.6rem',
          transform: textTx,
          transition: 'transform 0.14s ease-out',
        }}
      >
        {/* Hex badge — parallax layer 3 (floats most) */}
        <div
          className="absolute top-5 right-5 font-['Space_Mono'] text-right leading-[1.9] pointer-events-none"
          style={{
            fontSize: 7, color: 'rgba(0,255,80,0.2)', letterSpacing: '0.07em',
            transform: badgeTx,
            transition: 'transform 0.1s ease-out',
          }}
        >
          0x41 44 49<br />54 59 41
        </div>

        {/* Status chip */}
        <div
          className="flex items-center gap-1.5 w-fit mb-4 font-['Space_Mono'] text-[8px] tracking-[0.18em] uppercase rounded-[4px] px-2.5 py-1"
          style={{ color: '#7dff9b', background: 'rgba(0,255,80,0.07)', border: '1px solid rgba(0,255,80,0.18)' }}
        >
          <div className="dot-live" />
          sys:online · available
        </div>

        {/* Name */}
        <div
          className="font-['Space_Mono'] font-bold leading-[1.1] mb-1 tracking-[-0.02em]"
          style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', color: '#F5F0E8' }}
        >
          Aditya<span style={{ color: '#E8B4A0' }}>.</span><br />Anand
        </div>

        {/* Role typewriter */}
        <div
          className="flex items-center gap-1 font-['Space_Mono'] text-[0.75rem] mb-4 min-h-[1.2rem]"
          style={{ color: '#7dff9b' }}
        >
          <span style={{ color: 'rgba(0,255,80,0.4)' }}>{'>'}</span>
          {typed}
          <span className="tw-cursor">_</span>
        </div>

        {/* Desc */}
        <p className="text-[0.8rem] leading-[1.85] max-w-[310px] mb-7 font-['DM_Sans']" style={{ color: 'rgba(245,240,232,0.42)' }}>
          B.Tech CSE @ TIET '29. I build low-level utilities, automate boring things, and occasionally touch the web. Arch Linux daily driver.
        </p>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1.5 mb-7">
          {['linux', 'systems', 'c++', 'rust', 'networking', 'vim', 'git', 'bash'].map(s => (
            <span
              key={s}
              className="font-['Space_Mono'] text-[7px] px-2 py-0.5 rounded-[3px] tracking-[0.1em]"
              style={{ border: '1px solid rgba(0,255,80,0.18)', color: 'rgba(0,255,80,0.5)', background: 'rgba(0,255,80,0.04)' }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            className="font-['Space_Mono'] text-[8px] tracking-[0.1em] uppercase px-5 py-2 rounded-[3px] cursor-pointer transition-all duration-200"
            style={{ color: '#7dff9b', border: '1px solid rgba(0,255,80,0.55)', background: 'transparent', boxShadow: '0 0 12px rgba(0,255,80,0.08)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,255,80,0.1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,80,0.18)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = '0 0 12px rgba(0,255,80,0.08)' }}
          >
            $ contact --open
          </button>
          <button
            className="font-['Space_Mono'] text-[8px] tracking-[0.1em] uppercase px-5 py-2 rounded-[3px] cursor-pointer transition-all duration-200"
            style={{ color: 'rgba(245,240,232,0.38)', border: '1px solid rgba(245,240,232,0.1)', background: 'transparent' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(245,240,232,0.7)'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,240,232,0.38)'; e.currentTarget.style.borderColor = 'rgba(245,240,232,0.1)' }}
          >
            ./view-work
          </button>
          <a 
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            download
            style={{
              fontFamily: "'Space Mono',monospace",
              fontSize: 8,
              letterSpacing: '0.1em',
              padding: '9px 20px',
              borderRadius: 3,
              textTransform: 'uppercase',
              cursor: 'pointer',
              background: 'rgba(0,255,80,0.08)',
              color: '#7dff9b',
              border: '1px solid rgba(0,255,80,0.55)',
              boxShadow: '0 0 12px rgba(0,255,80,0.15), 0 0 24px rgba(0,255,80,0.08)',
              textDecoration: 'none',
              animation: 'resumeGlow 2.5s ease-in-out infinite',
            }}
          >
            ./resume.pdf ↓
          </a>
        </div>
      </div>

      {/* Scroll hint */}
      {!blurred && (
        <div
          id="scrollHint"
          className="scroll-hint absolute bottom-6 z-[5] pointer-events-none flex flex-col items-center gap-1 font-['Space_Mono'] text-[8px] tracking-[0.14em] uppercase"
          style={{ left: '50%', transform: 'translateX(-50%)', color: 'rgba(0,255,80,0.25)' }}
        >
          scroll
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      )}
    </div>
  )
}
