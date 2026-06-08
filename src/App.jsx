import { useEffect, useRef, useState, useCallback } from 'react'
import Hero from './components/Hero'
import Card from './components/Card'
import Popup from './components/Popup'
import { CARDS } from './cardData'

const N = CARDS.length

function tablePositions(rootEl, cardEls) {
  const W = rootEl.offsetWidth
  const H = rootEl.offsetHeight
  const cw = cardEls[0]?.offsetWidth || 155
  const ch = cardEls[0]?.offsetHeight || 217
  const topY = H * 0.28
  const botY = H * 0.72
  const col1 = W * 0.22
  const col2 = W * 0.5
  const col3 = W * 0.78
  const rots = [-14, 0, 14, 14, 0, -14]
  const xs = [col1, col2, col3, col1, col2, col3]
  const ys = [topY, topY, topY, botY, botY, botY]
  return CARDS.map((_, i) => ({
    tx: xs[i] - W / 2 - cw / 2,
    ty: ys[i] - H / 2 - ch / 2,
    rot: rots[i],
    cx: xs[i],
    cy: ys[i],
  }))
}

export default function App() {
  const rootRef = useRef(null)
  const cardRefs = useRef([])
  const animeRef = useRef(null)
  const finalPosRef = useRef(Array(N).fill(null).map(() => ({})))
  const bobAnimsRef = useRef(Array(N).fill(null))
  const stateRef = useRef({
    dealtCount: 0,
    allDealt: false,
    allFlipped: false,
    activeCard: -1,
    animating: false,
    heroBlurred: false,
    popupOpen: false,
  })

  const [heroBlurred, setHeroBlurred] = useState(false)
  const [dealtSet, setDealtSet] = useState(new Set())
  const [flippedSet, setFlippedSet] = useState(new Set())
  const [activeCard, setActiveCardState] = useState(-1)
  const [allDealt, setAllDealt] = useState(false)
  const [allFlipped, setAllFlipped] = useState(false)
  const [showFlipHint, setShowFlipHint] = useState(false)
  const [showClickHint, setShowClickHint] = useState(false)
  const [popupCard, setPopupCard] = useState(null)
  const [ndotActive, setNdotActive] = useState(0)

  // Lazy-load anime.js
  const getAnime = useCallback(async () => {
    if (!animeRef.current) {
      const mod = await import('animejs/lib/anime.es.js')
      animeRef.current = mod.default
    }
    return animeRef.current
  }, [])

  function stopBob(i) {
    if (bobAnimsRef.current[i] && animeRef.current) {
      animeRef.current.remove(cardRefs.current[i])
      bobAnimsRef.current[i] = null
    }
  }

  const startBob = useCallback(async (i) => {
    const anime = await getAnime()
    const amts = [9, 11, 8, 10, 9, 11]
    const durs = [3700, 4200, 3500, 4000, 3800, 4400]
    const dlys = [0, 600, 300, 1000, 450, 800]
    const p = finalPosRef.current[i]
    if (bobAnimsRef.current[i]) anime.remove(cardRefs.current[i])
    bobAnimsRef.current[i] = anime({
      targets: cardRefs.current[i],
      translateX: p.tx,
      translateY: [p.ty, p.ty - amts[i]],
      rotate: p.rot,
      direction: 'alternate',
      loop: true,
      duration: durs[i],
      delay: dlys[i],
      easing: 'easeInOutSine',
    })
  }, [getAnime])

  const dealCard = useCallback(async (i) => {
    const s = stateRef.current
    if (s.animating) return
    const anime = await getAnime()
    s.animating = true

    if (!s.heroBlurred) {
      s.heroBlurred = true
      setHeroBlurred(true)
    }

    const root = rootRef.current
    const pos = tablePositions(root, cardRefs.current)
    const p = pos[i]
    const W = root.offsetWidth
    const H = root.offsetHeight
    const cw = cardRefs.current[i].offsetWidth
    const ch = cardRefs.current[i].offsetHeight
    const dstX = p.cx - W / 2 - cw / 2
    const dstY = p.cy - H / 2 - ch / 2

    finalPosRef.current[i] = { tx: dstX, ty: dstY, rot: p.rot }

    const el = cardRefs.current[i]
    el.style.opacity = '1'
    el.style.zIndex = 15 + i

    anime({
      targets: el,
      translateX: [W * 0.1, dstX],
      translateY: [H * 0.46, dstY],
      rotate: [0, p.rot],
      scale: [0.5, 1],
      opacity: [0, 1],
      duration: 580,
      easing: 'easeOutExpo',
      complete: () => {
        setDealtSet(prev => new Set([...prev, i]))
        s.dealtCount++
        startBob(i)
        if (s.dealtCount === N) {
          s.allDealt = true
          setAllDealt(true)
          setShowFlipHint(true)
          setNdotActive(1)
        }
        s.animating = false
      },
    })
  }, [getAnime, startBob])

  const flipAllCards = useCallback(async () => {
    const s = stateRef.current
    if (!s.allDealt || s.allFlipped || s.animating) return
    const anime = await getAnime()
    s.animating = true
    setShowFlipHint(false)

    cardRefs.current.forEach((w, i) => {
      setTimeout(() => {
        const inner = w.querySelector('.card-inner')
        inner.style.transition = 'transform 0.68s cubic-bezier(0.4,0,0.2,1)'
        inner.style.transform = 'rotateY(180deg)'
        setFlippedSet(prev => new Set([...prev, i]))
        if (i === N - 1) {
          setTimeout(() => {
            s.allFlipped = true
            setAllFlipped(true)
            setActive(0)
            s.animating = false
            setTimeout(() => setShowClickHint(true), 500)
          }, 750)
        }
      }, i * 180)
    })
  }, [getAnime])

  const setActive = useCallback(async (i) => {
    const s = stateRef.current
    const anime = await getAnime()

    if (s.activeCard >= 0 && s.activeCard !== i) {
      cardRefs.current[s.activeCard].style.zIndex = 15 + s.activeCard
      cardRefs.current[s.activeCard].style.filter = ''
      startBob(s.activeCard)
    }

    s.activeCard = i
    setActiveCardState(i)
    stopBob(i)

    const p = finalPosRef.current[i]
    anime({
      targets: cardRefs.current[i],
      translateX: p.tx,
      translateY: p.ty - 16,
      rotate: p.rot * 0.4,
      duration: 320,
      easing: 'easeOutExpo',
    })
    cardRefs.current[i].style.zIndex = 25
    cardRefs.current[i].style.filter = 'drop-shadow(0 0 16px rgba(232,180,160,0.85))'

    setNdotActive(i + 1)
  }, [getAnime, startBob])

  const expandCard = useCallback((idx) => {
    const s = stateRef.current
    if (s.popupOpen) return
    s.popupOpen = true
    setShowClickHint(false)
    setPopupCard(CARDS[idx])

    // Scatter other cards
    getAnime().then(anime => {
      const root = rootRef.current
      const W = root.offsetWidth
      const H = root.offsetHeight
      const others = cardRefs.current.map((_, i) => i).filter(i => i !== idx)
      const CORNER_SPOTS = [
        { tx: -1, ty: -1, rot: -28 },
        { tx: 1, ty: -1, rot: 28 },
        { tx: -1, ty: 1, rot: 22 },
        { tx: 1, ty: 1, rot: -22 },
        { tx: -1.6, ty: 0, rot: -18 },
      ]

      stopBob(idx)
      cardRefs.current[idx].style.opacity = '0'
      cardRefs.current[idx].style.pointerEvents = 'none'

      others.forEach((cardIdx, ci) => {
        const w = cardRefs.current[cardIdx]
        stopBob(cardIdx)
        const sp = CORNER_SPOTS[ci]
        const cw = w.offsetWidth
        const ch = w.offsetHeight
        const tx = (W / 2) * sp.tx * 0.85 - cw / 2
        const ty = (H / 2) * sp.ty * 0.82 - ch / 2
        anime({
          targets: w,
          translateX: tx,
          translateY: ty,
          rotate: sp.rot,
          scale: 0.42,
          opacity: 0.35,
          duration: 500,
          delay: ci * 60,
          easing: 'easeInOutExpo',
        })
        w.style.zIndex = 12
      })
    })
  }, [getAnime])

  const closePopup = useCallback(async () => {
    const s = stateRef.current
    if (!s.popupOpen) return
    const anime = await getAnime()
    s.popupOpen = false
    setPopupCard(null)

    cardRefs.current.forEach((w, i) => {
      const p = finalPosRef.current[i]
      w.style.opacity = '1'
      w.style.filter = ''
      w.style.pointerEvents = 'auto'
      anime({
        targets: w,
        translateX: p.tx,
        translateY: p.ty,
        rotate: p.rot,
        scale: 1,
        opacity: 1,
        duration: 580,
        delay: i * 45,
        easing: 'easeOutExpo',
        complete: () => {
          w.style.zIndex = 15 + i
          startBob(i)
        },
      })
    })

    setTimeout(() => {
      const ac = s.activeCard
      if (ac >= 0) {
        stopBob(ac)
        const p = finalPosRef.current[ac]
        anime({
          targets: cardRefs.current[ac],
          translateX: p.tx,
          translateY: p.ty - 16,
          rotate: p.rot * 0.4,
          duration: 280,
          easing: 'easeOutExpo',
        })
        cardRefs.current[ac].style.zIndex = 25
        cardRefs.current[ac].style.filter = 'drop-shadow(0 0 16px rgba(232,180,160,0.85))'
      }
      setShowClickHint(true)
    }, 480)
  }, [getAnime, startBob])

  const recallCards = useCallback(async () => {
    const s = stateRef.current
    if (!s.heroBlurred || s.animating) return
    const anime = await getAnime()
    s.animating = true
    if (s.popupOpen) closePopup()
    cardRefs.current.forEach((_, i) => stopBob(i))

    s.allDealt = false
    s.allFlipped = false
    s.dealtCount = 0
    s.activeCard = -1
    setAllDealt(false)
    setAllFlipped(false)
    setDealtSet(new Set())
    setFlippedSet(new Set())
    setActiveCardState(-1)
    setShowClickHint(false)

    cardRefs.current.forEach((w, i) => {
      const inner = w.querySelector('.card-inner')
      inner.style.transition = 'none'
      inner.style.transform = 'rotateY(0deg)'
      anime({
        targets: w,
        opacity: 0,
        translateY: '+=50',
        scale: 0.72,
        duration: 350,
        delay: i * 40,
        easing: 'easeInExpo',
        complete: () => {
          if (i === N - 1) {
            cardRefs.current.forEach(c => {
              c.style.opacity = '0'
              c.style.transform = ''
              c.style.filter = ''
              c.style.zIndex = ''
            })
            s.heroBlurred = false
            setHeroBlurred(false)
            setNdotActive(0)
            s.animating = false
          }
        },
      })
    })
  }, [getAnime, closePopup])

  // Add floating particles to hero
  useEffect(() => {
    getAnime().then(anime => {
      const heroEl = document.getElementById('hero')
      if (!heroEl) return
      const particles = []
      for (let i = 0; i < 18; i++) {
        const p = document.createElement('div')
        p.className = 'hero-particle absolute rounded-full pointer-events-none z-[1]'
        const sz = Math.random() * 2.5 + 1
        p.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;opacity:${Math.random() * 0.35 + 0.05};background:rgba(0,255,80,0.18);`
        heroEl.appendChild(p)
        particles.push(p)
        anime({
          targets: p,
          translateY: [Math.random() * -60 - 20, Math.random() * 60 + 20],
          translateX: [Math.random() * 30 - 15, Math.random() * 30 - 15],
          opacity: [{ value: 0.02 }, { value: Math.random() * 0.3 + 0.05 }, { value: 0.02 }],
          duration: Math.random() * 6000 + 5000,
          easing: 'easeInOutSine',
          loop: true,
          direction: 'alternate',
          delay: Math.random() * 4000,
        })
      }
      return () => particles.forEach(p => p.remove())
    })
  }, [getAnime])

  // Wheel handler
  useEffect(() => {
    let wacc = 0, wt = 0
    const handler = (e) => {
      const s = stateRef.current
      if (s.popupOpen) { e.preventDefault(); return }
      e.preventDefault()
      const now = Date.now()
      if (now - wt > 800) wacc = 0
      wt = now
      wacc += e.deltaY
      if (wacc > 60) {
        wacc = 0
        if (!s.heroBlurred) dealCard(0)
        else if (s.dealtCount < N && !s.animating) dealCard(s.dealtCount)
        else if (s.allDealt && !s.allFlipped) flipAllCards()
        else if (s.allFlipped && s.activeCard < N - 1) setActive(s.activeCard + 1)
      } else if (wacc < -60) {
        wacc = 0
        if (s.allFlipped && s.activeCard > 0) setActive(s.activeCard - 1)
        else if (s.heroBlurred) recallCards()
      }
    }
    const root = rootRef.current
    if (root) root.addEventListener('wheel', handler, { passive: false })
    return () => { if (root) root.removeEventListener('wheel', handler) }
  }, [dealCard, flipAllCards, setActive, recallCards])

  // Touch handler
  useEffect(() => {
    let ty0 = 0
    const onStart = (e) => { ty0 = e.touches[0].clientY }
    const onEnd = (e) => {
      const s = stateRef.current
      const dy = ty0 - e.changedTouches[0].clientY
      if (Math.abs(dy) < 30) return
      if (dy > 0) {
        if (!s.heroBlurred) dealCard(0)
        else if (s.dealtCount < N && !s.animating) dealCard(s.dealtCount)
        else if (s.allDealt && !s.allFlipped) flipAllCards()
        else if (s.allFlipped && s.activeCard < N - 1) setActive(s.activeCard + 1)
      } else {
        if (s.allFlipped && s.activeCard > 0) setActive(s.activeCard - 1)
        else recallCards()
      }
    }
    const root = rootRef.current
    if (root) {
      root.addEventListener('touchstart', onStart, { passive: true })
      root.addEventListener('touchend', onEnd, { passive: true })
    }
    return () => {
      if (root) {
        root.removeEventListener('touchstart', onStart)
        root.removeEventListener('touchend', onEnd)
      }
    }
  }, [dealCard, flipAllCards, setActive, recallCards])

  // Keyboard handler
  useEffect(() => {
    const handler = (e) => {
      const s = stateRef.current
      if (e.key === 'Escape') closePopup()
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (!s.heroBlurred) dealCard(0)
        else if (s.dealtCount < N && !s.animating) dealCard(s.dealtCount)
        else if (s.allDealt && !s.allFlipped) flipAllCards()
        else if (s.allFlipped && s.activeCard < N - 1) setActive(s.activeCard + 1)
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (s.allFlipped && s.activeCard > 0) setActive(s.activeCard - 1)
        else recallCards()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [dealCard, flipAllCards, setActive, recallCards, closePopup])

  const handleNdotClick = (i) => {
    const s = stateRef.current
    if (i === 0) recallCards()
    else if (!s.heroBlurred) dealCard(0)
    else if (s.allFlipped) setActive(i - 1)
  }

  const handleCardClick = (i) => {
    const s = stateRef.current
    if (s.allDealt && s.allFlipped && !s.popupOpen) expandCard(i)
  }

  return (
    <div
      id="pr"
      ref={rootRef}
      className="w-full h-screen relative overflow-hidden"
      style={{ minHeight: 600, background: '#0f0c07', fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* Hero section */}
      <Hero blurred={heroBlurred} />

      {/* Deck of cards */}
      <div id="deck" className="absolute inset-0 z-[10] pointer-events-none">
        {CARDS.map((card, i) => (
          <Card
            key={card.cls}
            ref={el => (cardRefs.current[i] = el)}
            data={card}
            flipped={flippedSet.has(i)}
            dealt={dealtSet.has(i)}
            clickable={allFlipped}
            active={activeCard === i}
            onClick={() => handleCardClick(i)}
          />
        ))}
      </div>

      {/* Popup */}
      <Popup card={popupCard} onClose={closePopup} />

      {/* Nav dots */}
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-[30]">
        {Array.from({ length: N + 1 }, (_, i) => (
          <div
            key={i}
            onClick={() => handleNdotClick(i)}
            className="w-[5px] h-[5px] rounded-full cursor-pointer transition-all duration-300"
            style={{
              background: ndotActive === i ? '#E8B4A0' : 'rgba(245,240,232,0.18)',
              transform: ndotActive === i ? 'scale(1.6)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 z-[30] transition-all duration-500"
        style={{
          background: '#C4714A',
          width: heroBlurred ? `${(Math.max(activeCard, 0) + 1) / N * 100}%` : '0%',
        }}
      />

      {/* Flip hint */}
      <div
        className="absolute bottom-5 z-[30] font-medium text-[9px] tracking-[0.12em] uppercase px-4 py-1.5 rounded-full pointer-events-none transition-opacity duration-300 whitespace-nowrap"
        style={{
          left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(196,113,74,0.92)', color: '#FDFAF5',
          opacity: showFlipHint ? 1 : 0,
        }}
      >
        ↓ Scroll to reveal
      </div>

      {/* Click hint */}
      <div
        className="absolute bottom-5 z-[30] text-[9px] tracking-[0.12em] uppercase pointer-events-none transition-opacity duration-300 whitespace-nowrap"
        style={{
          left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(245,240,232,0.3)',
          opacity: showClickHint ? 1 : 0,
        }}
      >
        Click any card to expand
      </div>

      {/* Popup scoped styles */}
      <style>{`
        .pop-section { margin-bottom: 0.9rem; }
        .pop-sec-title { font-family: 'Space Mono', monospace; font-size: 7px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(0,255,80,0.4); margin-bottom: 0.5rem; }
        .pop-body { font-family: 'DM Sans', sans-serif; font-size: 0.78rem; line-height: 1.8; color: rgba(245,240,232,0.55); }
        .pop-tags { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 0.5rem; }
        .pop-tag { font-family: 'Space Mono', monospace; font-size: 7px; padding: 3px 8px; border-radius: 3px; border: 1px solid rgba(0,255,80,0.18); color: rgba(0,255,80,0.55); background: rgba(0,255,80,0.04); letter-spacing: 0.07em; }
        .pop-tag-lt { border-color: rgba(196,113,74,0.25) !important; color: rgba(196,113,74,0.65) !important; background: rgba(196,113,74,0.05) !important; }
        .pop-tag-bl { border-color: rgba(100,180,255,0.2) !important; color: rgba(100,180,255,0.6) !important; background: rgba(100,180,255,0.04) !important; }
        .pop-tag-pu { border-color: rgba(180,130,255,0.2) !important; color: rgba(180,130,255,0.6) !important; background: rgba(180,130,255,0.04) !important; }
        .stat-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 0.6rem; }
        .stat-mini { padding: 0.6rem 0.8rem; border-radius: 6px; background: rgba(0,255,80,0.04); border: 1px solid rgba(0,255,80,0.1); }
        .stat-num { font-family: 'Space Mono', monospace; font-size: 1.2rem; font-weight: 700; }
        .stat-lbl { font-family: 'Space Mono', monospace; font-size: 0.58rem; color: rgba(245,240,232,0.35); margin-top: 2px; letter-spacing: 0.08em; }
        .proj-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 9px; border-radius: 6px; background: rgba(0,255,80,0.04); border: 1px solid rgba(0,255,80,0.1); margin-bottom: 5px; font-size: 0.72rem; color: rgba(245,240,232,0.75); }
        .proj-sub { font-family: 'Space Mono', monospace; font-size: 7px; color: rgba(0,255,80,0.38); }
        .tl-item { display: flex; gap: 10px; padding-bottom: 10px; position: relative; }
        .tl-item::before { content: ''; position: absolute; left: 5px; top: 14px; bottom: 0; width: 1px; background: rgba(0,255,80,0.15); }
        .tl-item:last-child::before { display: none; }
        .tl-dot { width: 11px; height: 11px; border-radius: 50%; border: 2px solid rgba(0,255,80,0.4); flex-shrink: 0; margin-top: 3px; }
        .tl-year { font-family: 'Space Mono', monospace; font-size: 7px; color: rgba(0,255,80,0.4); margin-bottom: 2px; }
        .tl-school { font-family: 'Space Mono', monospace; font-size: 0.78rem; font-weight: 700; color: #F5F0E8; margin-bottom: 1px; }
        .tl-deg { font-family: 'DM Sans', sans-serif; font-size: 0.68rem; color: rgba(245,240,232,0.45); }
        .ach-row { display: flex; gap: 9px; margin-bottom: 9px; align-items: flex-start; }
        .ach-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }
        .ach-text strong { display: block; font-size: 0.75rem; margin-bottom: 1px; color: rgba(245,240,232,0.85); }
        .ach-text span { font-family: 'DM Sans', sans-serif; font-size: 0.68rem; color: rgba(245,240,232,0.45); line-height: 1.55; }
        .soc-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.6rem; }
        .soc-link { font-family: 'Space Mono', monospace; font-size: 7px; letter-spacing: 0.1em; padding: 4px 10px; border-radius: 3px; border: 1px solid rgba(0,255,80,0.25); color: rgba(0,255,80,0.55); background: rgba(0,255,80,0.04); text-decoration: none; transition: all 0.2s; }
        .soc-link:hover { background: rgba(0,255,80,0.1); color: #7dff9b; border-color: rgba(0,255,80,0.45); }
        .ctag-lt { border-color: rgba(196,113,74,0.25) !important; color: rgba(196,113,74,0.6) !important; background: rgba(196,113,74,0.04) !important; }
        .ctag-bl { border-color: rgba(100,180,255,0.2) !important; color: rgba(100,180,255,0.55) !important; background: rgba(100,180,255,0.04) !important; }
        .ctag-pu { border-color: rgba(180,130,255,0.2) !important; color: rgba(180,130,255,0.55) !important; background: rgba(180,130,255,0.04) !important; }
        .popup-overlay.show .popup-card-inner { transform: scale(1) translateY(0) rotateY(0deg) !important; opacity: 1 !important; }
      `}</style>
    </div>
  )
}
