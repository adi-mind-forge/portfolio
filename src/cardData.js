// Card data — mirrors original CARDS array from the HTML
export const CARDS = [
  {
    cls: 'fc-about',
    label: 'About',
    num: 'A',
    suit: '♠',
    mini_title: 'Developer\nwith purpose.',
    mini_body: "TIET CSE '29. Structured thinker.",
    mini_tags: ['3+ Projects', 'TIET', 'CSE'],
    lt: false,
    bg: '#FDFAF5',
    fg: '#2C2C2A',
    accentBorder: 'rgba(0,255,80,0.3)',
    accentGlow: 'rgba(0,255,80,0.12)',
    tagClass: '',
    indexColor: 'rgba(0,255,80,0.35)',
    labelColor: 'rgba(0,255,80,0.4)',
    titleColor: '#F5F0E8',
    suitColor: '#7dff9b',
    cardBorder: '1px solid rgba(0,255,80,0.25)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 22px rgba(0,255,80,0.12)',
    popupContent: () => `
      <div class="pop-section">
        <div class="pop-sec-title">Who I am</div>
        <div class="pop-body">I'm a detail-oriented learner who turns ideas into clear, practical outcomes. I value structured thinking, consistent improvement, and collaborative problem-solving.</div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">Currently</div>
        <div class="pop-body">B.Tech Computer Science at Thapar Institute of Engineering & Technology, graduating 2029. Every project gets curiosity and a focus on meaningful, well-thought-out work.</div>
      </div>
      <div class="stat-row">
        <div class="stat-mini"><div class="stat-num" style="color:#C4714A">3+</div><div class="stat-lbl">Projects shipped</div></div>
        <div class="stat-mini"><div class="stat-num" style="color:#C4714A">'29</div><div class="stat-lbl">Graduating TIET</div></div>
        <div class="stat-mini"><div class="stat-num" style="color:#C4714A">2</div><div class="stat-lbl">Tech stacks</div></div>
        <div class="stat-mini"><div class="stat-num" style="color:#C4714A">∞</div><div class="stat-lbl">Goals on pitch</div></div>
      </div>`,
  },
  {
    cls: 'fc-skills',
    label: 'Skills',
    num: 'S',
    suit: '♦',
    mini_title: 'Tech\nStack',
    mini_body: 'Web-first, clean interfaces.',
    mini_tags: ['HTML', 'CSS', 'JS', 'Python'],
    lt: false,
    bg: '#EDE7D9',
    fg: '#2C2C2A',
    accentBorder: 'rgba(0,255,80,0.22)',
    accentGlow: 'rgba(0,255,80,0.08)',
    tagClass: '',
    indexColor: 'rgba(0,255,80,0.35)',
    labelColor: 'rgba(0,255,80,0.4)',
    titleColor: '#F5F0E8',
    suitColor: '#7dff9b',
    cardBorder: '1px solid rgba(0,255,80,0.18)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 18px rgba(0,255,80,0.08)',
    popupContent: () => `
      <div class="pop-section">
        <div class="pop-sec-title">Frontend</div>
        <div class="pop-tags">
          ${['HTML','CSS','React.js','Anime.js','Firebase','Responsive Design'].map(t=>`<span class="pop-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">Backend & Languages</div>
        <div class="pop-tags">
          ${['Python','C++','Rust','Express.js','Git','GitHub'].map(t=>`<span class="pop-tag">${t}</span>`).join('')}
        </div>
      </div>
      <div class="pop-section" style="margin-top:0.4rem">
        <div class="pop-sec-title">Currently learning</div>
        <div class="pop-body">Deepening knowledge in React, exploring Rust for systems programming, and experimenting with animation libraries.</div>
      </div>`,
  },
  {
    cls: 'fc-projects',
    label: 'Projects',
    num: 'P',
    suit: '♣',
    mini_title: "Things\nI've Built",
    mini_body: 'SplitEZ · Expense Calc · Portfolio',
    mini_tags: ['3 shipped'],
    lt: true,
    bg: '#2C2C2A',
    fg: '#F5F0E8',
    accentBorder: 'rgba(196,113,74,0.4)',
    accentGlow: 'rgba(196,113,74,0.14)',
    tagClass: 'pop-tag-lt',
    indexColor: 'rgba(196,113,74,0.5)',
    labelColor: 'rgba(196,113,74,0.5)',
    titleColor: '#F5F0E8',
    suitColor: '#C4714A',
    cardBorder: '1px solid rgba(196,113,74,0.35)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 22px rgba(196,113,74,0.12)',
    popupContent: () => `
      <div class="pop-section">
        <div class="pop-sec-title">Shipped work</div>
        <a href="https://github.com/adi-mind-forge/SplitEZ"><div class="proj-row"><span>SplitEZ</span><span class="proj-sub">Firebase · JS</span></div></a>
        <div class="proj-row"><span>Expense Calculator</span><span class="proj-sub">Python · HTML/CSS</span></div>
        <div class="proj-row"><span>This Portfolio</span><span class="proj-sub">React · Tailwind · Anime.js</span></div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">About SplitEZ</div>
        <div class="pop-body">A web app to split bills among friends with real-time Firebase sync and easy settlement tracking.</div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">About Expense Calculator</div>
        <div class="pop-body">Clean, intuitive budget tracker with category breakdown and visual summaries.</div>
      </div>`,
  },
  {
    cls: 'fc-education',
    label: 'Education',
    num: 'E',
    suit: '♥',
    mini_title: 'Where I\nstudied.',
    mini_body: 'TIET · YPS Mohali',
    mini_tags: ['B.Tech', 'PCM'],
    lt: false,
    bg: '#1E3A5F',
    fg: '#D4E8FF',
    accentBorder: 'rgba(100,180,255,0.3)',
    accentGlow: 'rgba(100,180,255,0.1)',
    tagClass: 'pop-tag-bl',
    indexColor: 'rgba(100,180,255,0.4)',
    labelColor: 'rgba(100,180,255,0.45)',
    titleColor: '#D4E8FF',
    suitColor: '#64B4FF',
    cardBorder: '1px solid rgba(100,180,255,0.25)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 22px rgba(100,180,255,0.1)',
    popupContent: () => `
      <div class="pop-section">
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div>
            <div class="tl-year">2024 – 2029</div>
            <div class="tl-school">Thapar Institute of Engineering & Technology</div>
            <div class="tl-deg">B.Tech — Computer Science & Engineering</div>
          </div>
        </div>
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div>
            <div class="tl-year">Until 2024</div>
            <div class="tl-school">YPS (Class of '24)</div>
            <div class="tl-deg">Intermediate — PCM</div>
          </div>
        </div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">About TIET</div>
        <div class="pop-body">One of India's top engineering institutes, located in Patiala. Rigorous curriculum with strong focus on fundamentals and applied learning.</div>
      </div>`,
  },
  {
    cls: 'fc-achieve',
    label: 'Achievements',
    num: '★',
    suit: '✦',
    mini_title: 'Milestones\n& Awards',
    mini_body: 'Hackathons · Certs · Sport',
    mini_tags: ['2024', '2025'],
    lt: false,
    bg: '#2A1F4E',
    fg: '#E8D5FF',
    accentBorder: 'rgba(180,130,255,0.3)',
    accentGlow: 'rgba(180,130,255,0.1)',
    tagClass: 'pop-tag-pu',
    indexColor: 'rgba(180,130,255,0.4)',
    labelColor: 'rgba(180,130,255,0.45)',
    titleColor: '#E0D5FF',
    suitColor: '#B482FF',
    cardBorder: '1px solid rgba(180,130,255,0.25)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 22px rgba(180,130,255,0.1)',
    popupContent: () => `
    <div class="tl-item">
      <div class="tl-dot"></div>
      <div>
        <div class="tl-year">2025 – 26</div>
        <div class="tl-school">MLSC · Microsoft Learn Student Chapter</div>
        <div class="tl-deg">Ideation & planning core team for flagship events <em>Arcadia</em> and <em>El Dinero</em> · conducted tech workshops · contributed to the main website</div>
      </div>
    </div>`,
  },
  {
    cls: 'fc-contact',
    label: 'Contact',
    num: 'C',
    suit: '◆',
    mini_title: "Let's build\nsomething.",
    mini_body: 'Open to internships & ideas.',
    mini_tags: ['GitHub', 'LinkedIn'],
    lt: true,
    bg: '#C4714A',
    fg: '#FDFAF5',
    accentBorder: 'rgba(196,113,74,0.5)',
    accentGlow: 'rgba(196,113,74,0.18)',
    tagClass: 'pop-tag-lt',
    indexColor: 'rgba(196,113,74,0.5)',
    labelColor: 'rgba(196,113,74,0.6)',
    titleColor: '#E8B4A0',
    suitColor: '#C4714A',
    cardBorder: '1px solid rgba(196,113,74,0.45)',
    cardShadow: '0 16px 48px rgba(0,0,0,0.7), 0 0 28px rgba(196,113,74,0.18)',
    popupContent: () => `
      <div class="pop-section">
        <div class="pop-sec-title">Say hello</div>
        <div class="pop-body">Open to internships, collaborations, and interesting projects. I respond fast — let's build something.</div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">Find me here</div>
        <div class="soc-row">
          <a class="soc-link" style="border-color:rgba(255,255,255,0.3);color:#FDFAF5" href="https://github.com/adi-mind-forge" target="_blank">GitHub ↗</a>
          <a class="soc-link" style="border-color:rgba(255,255,255,0.3);color:#FDFAF5" href="https://www.linkedin.com/in/aditya-anand-28b217377" target="_blank">LinkedIn ↗</a>
          <a class="soc-link" style="border-color:rgba(255,255,255,0.3);color:#FDFAF5" href="mailto:adityaanand02012007@gmail.com">Email ↗</a>
        </div>
      </div>
      <div class="pop-section">
        <div class="pop-sec-title">Direct line</div>
        <div class="pop-body" style="font-family:'Space Mono',monospace;font-size:0.72rem;">your@email.com</div>
      </div>`,
  },
]
