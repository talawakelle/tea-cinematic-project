import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const svg = (content) => `data:image/svg+xml;utf8,${encodeURIComponent(content)}`

const TEA_FIELD = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#0d2e1f"/>
      <stop offset="100%" stop-color="#07140f"/>
    </linearGradient>
    <linearGradient id="row" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#6fc146"/>
      <stop offset="100%" stop-color="#235a2d"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="url(#bg)"/>
  <g fill="none" stroke="url(#row)" stroke-width="16" stroke-linecap="round" opacity="0.96">
    <path d="M-50 130 C 260 0, 480 0, 780 140 S 1350 290, 1680 120"/>
    <path d="M-80 190 C 240 60, 500 70, 800 210 S 1370 360, 1680 180"/>
    <path d="M-100 250 C 200 120, 520 130, 820 280 S 1380 430, 1690 250"/>
    <path d="M-120 315 C 190 180, 520 200, 840 345 S 1390 500, 1700 315"/>
    <path d="M-120 390 C 190 245, 520 270, 850 420 S 1395 575, 1710 395"/>
    <path d="M-130 470 C 180 325, 530 345, 870 500 S 1410 655, 1720 470"/>
    <path d="M-120 560 C 190 400, 560 420, 900 585 S 1440 740, 1730 555"/>
    <path d="M-100 655 C 230 500, 590 520, 930 680 S 1470 830, 1740 650"/>
    <path d="M-80 760 C 280 610, 640 620, 980 770 S 1500 900, 1760 740"/>
  </g>
  <g fill="#7bd16c" opacity="0.78">
    <circle cx="260" cy="220" r="42"/>
    <circle cx="470" cy="170" r="50"/>
    <circle cx="1160" cy="250" r="34"/>
    <circle cx="1290" cy="320" r="46"/>
    <circle cx="1390" cy="290" r="38"/>
  </g>
</svg>
`)

const TEA_CUP = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
  <rect width="900" height="900" fill="none"/>
  <ellipse cx="450" cy="730" rx="270" ry="55" fill="#c89d6f" opacity="0.45"/>
  <path d="M210 360 h420 c30 0 48 24 44 53 l-14 115 c-16 123-92 190-210 190h-40c-118 0-194-67-210-190l-14-115c-4-29 14-53 44-53z" fill="#e4d19b"/>
  <path d="M250 360 c30-35 370-35 400 0 v30 h-400z" fill="#e8d9ae"/>
  <path d="M260 382 h380 v36 h-380z" fill="#2a2c2f"/>
  <path d="M660 420 c76-6 124 42 124 108 0 58-40 102-100 98" fill="none" stroke="#e4d19b" stroke-width="24" stroke-linecap="round"/>
  <path d="M450 520 C 438 430 470 360 462 250" fill="none" stroke="#118b2f" stroke-width="10" stroke-linecap="round"/>
  <path d="M462 420 C 516 356 566 338 606 250" fill="none" stroke="#118b2f" stroke-width="8" stroke-linecap="round"/>
  <path d="M455 470 C 398 395 350 372 320 292" fill="none" stroke="#118b2f" stroke-width="8" stroke-linecap="round"/>
  <path d="M466 330 C 520 290 560 265 585 205" fill="none" stroke="#118b2f" stroke-width="8" stroke-linecap="round"/>
  <g fill="#7ab65c">
    <path d="M458 380 C 430 300 432 220 458 150 C 506 222 492 305 458 380z"/>
    <path d="M455 450 C 402 390 356 362 282 352 C 326 430 390 458 455 450z"/>
    <path d="M463 445 C 535 428 587 383 632 315 C 555 322 502 360 463 445z"/>
    <path d="M492 520 C 556 514 617 492 678 438 C 608 433 548 456 492 520z"/>
    <path d="M430 560 C 366 542 309 532 250 538 C 302 590 358 602 430 560z"/>
  </g>
</svg>
`)

const STRAWBERRY = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 700">
  <defs>
    <radialGradient id="berry" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#ff8679"/>
      <stop offset="55%" stop-color="#e4312d"/>
      <stop offset="100%" stop-color="#92070f"/>
    </radialGradient>
  </defs>
  <rect width="700" height="700" fill="none"/>
  <path d="M350 120 C 470 120 565 210 575 360 C 584 505 472 600 350 630 C 228 600 116 505 125 360 C 135 210 230 120 350 120z" fill="url(#berry)"/>
  <path d="M350 145 C 425 146 486 203 494 309 C 501 413 428 503 350 547 C 272 503 199 413 206 309 C 214 203 275 146 350 145z" fill="#fff2ef" opacity="0.86"/>
  <path d="M350 208 C 389 257 398 319 350 470 C 302 319 311 257 350 208z" fill="#ffb5ad" opacity="0.75"/>
  <path d="M350 50 C 380 78 404 88 455 96 C 432 122 400 137 350 132 C 300 137 268 122 245 96 C 296 88 320 78 350 50z" fill="#3a8f2f"/>
  <g fill="#f2e26b" opacity="0.9">
    <circle cx="248" cy="247" r="8"/><circle cx="292" cy="210" r="8"/><circle cx="403" cy="215" r="8"/><circle cx="454" cy="267" r="8"/>
    <circle cx="220" cy="334" r="8"/><circle cx="278" cy="315" r="8"/><circle cx="423" cy="320" r="8"/><circle cx="484" cy="353" r="8"/>
    <circle cx="250" cy="429" r="8"/><circle cx="315" cy="410" r="8"/><circle cx="388" cy="410" r="8"/><circle cx="452" cy="436" r="8"/>
    <circle cx="300" cy="516" r="8"/><circle cx="350" cy="542" r="8"/><circle cx="402" cy="518" r="8"/>
  </g>
</svg>
`)

const TEA_FLOWER = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 900">
  <rect width="700" height="900" fill="none"/>
  <path d="M325 730 C 315 560 360 430 420 250" fill="none" stroke="#7d593e" stroke-width="9" stroke-linecap="round"/>
  <path d="M417 255 C 475 210 535 185 600 190 C 555 250 505 278 440 293" fill="#183f27"/>
  <path d="M383 355 C 450 334 510 337 575 380 C 510 415 448 408 390 382" fill="#1d4a2e"/>
  <path d="M338 500 C 285 460 233 447 160 455 C 205 515 258 538 320 548" fill="#173e25"/>
  <path d="M360 620 C 430 610 487 632 548 692 C 482 714 425 702 370 660" fill="#214e30"/>
  <path d="M347 285 C 285 240 230 228 165 240 C 202 292 250 317 320 323" fill="#214a2d"/>
  <g transform="translate(394 314)">
    <circle cx="0" cy="0" r="28" fill="#f1efdb"/>
    <g fill="#ffffff"><ellipse cx="0" cy="-40" rx="20" ry="34"/><ellipse cx="38" cy="-8" rx="20" ry="34" transform="rotate(72 38 -8)"/><ellipse cx="24" cy="34" rx="20" ry="34" transform="rotate(144 24 34)"/><ellipse cx="-24" cy="34" rx="20" ry="34" transform="rotate(216 -24 34)"/><ellipse cx="-38" cy="-8" rx="20" ry="34" transform="rotate(288 -38 -8)"/></g>
  </g>
  <g transform="translate(292 548) scale(0.9)">
    <circle cx="0" cy="0" r="28" fill="#f1efdb"/>
    <g fill="#ffffff"><ellipse cx="0" cy="-40" rx="20" ry="34"/><ellipse cx="38" cy="-8" rx="20" ry="34" transform="rotate(72 38 -8)"/><ellipse cx="24" cy="34" rx="20" ry="34" transform="rotate(144 24 34)"/><ellipse cx="-24" cy="34" rx="20" ry="34" transform="rotate(216 -24 34)"/><ellipse cx="-38" cy="-8" rx="20" ry="34" transform="rotate(288 -38 -8)"/></g>
  </g>
</svg>
`)

const RUBBER = svg(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 320">
  <defs>
    <linearGradient id="b" x1="0" x2="1"><stop offset="0%" stop-color="#83bb4e"/><stop offset="100%" stop-color="#325823"/></linearGradient>
  </defs>
  <rect width="300" height="320" fill="url(#b)"/>
  <g stroke="#99d95a" stroke-width="4" opacity="0.85">
    <path d="M40 0 L60 320"/><path d="M80 0 L100 320"/><path d="M120 0 L140 320"/><path d="M160 0 L180 320"/><path d="M200 0 L220 320"/><path d="M240 0 L260 320"/>
    <path d="M0 80 C 80 70, 220 90, 300 78"/><path d="M0 140 C 80 130, 220 150, 300 138"/><path d="M0 200 C 80 190, 220 210, 300 198"/><path d="M0 260 C 80 250, 220 270, 300 258"/>
  </g>
</svg>
`)

function useTexture(url) {
  return useMemo(() => {
    const texture = new THREE.TextureLoader().load(url)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
    return texture
  }, [url])
}

function ParticleField() {
  const ref = useRef(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(1400 * 3)
    for (let i = 0; i < 1400; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.rotation.z = state.clock.elapsedTime * 0.015
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#b7ff85"
        size={0.05}
        transparent
        opacity={0.8}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function GlowOrb({ position, color, scale = 1, speed = 1 }) {
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.3
    ref.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * speed * 0.35) * 0.15
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.12} />
    </mesh>
  )
}

function Billboard({ url, position, size = [2, 2], opacity = 0.22, speed = 0.6, tilt = 0.1 }) {
  const texture = useTexture(url)
  const ref = useRef(null)

  useFrame((state) => {
    if (!ref.current) return
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.22
    ref.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.45) * tilt
    ref.current.rotation.z = Math.cos(state.clock.elapsedTime * speed * 0.4) * (tilt * 0.7)
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <>
      <color attach="background" args={['#04110d']} />
      <fog attach="fog" args={['#04110d', 5, 22]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[3, 4, 6]} intensity={1.8} color="#f3ffcf" />
      <ParticleField />
      <GlowOrb position={[-3.8, 2.2, -4]} color="#8cff5f" scale={2.6} speed={0.8} />
      <GlowOrb position={[3.8, -1, -4]} color="#d8a357" scale={2.2} speed={0.65} />
      <GlowOrb position={[0, 0.8, -5]} color="#9cf26f" scale={3.1} speed={0.55} />
      <Billboard url={TEA_FLOWER} position={[-3.8, 0.3, -2.5]} size={[2.8, 3.9]} opacity={0.12} speed={0.45} tilt={0.08} />
      <Billboard url={TEA_CUP} position={[3.8, -1.4, -2.2]} size={[2.5, 3.2]} opacity={0.1} speed={0.52} tilt={0.12} />
      <Billboard url={STRAWBERRY} position={[0.6, 1.7, -1.7]} size={[1.9, 1.9]} opacity={0.15} speed={0.9} tilt={0.18} />
    </>
  )
}

function Section({ className = '', children, style }) {
  return (
    <section className={`panel ${className}`.trim()} style={style}>
      {children}
    </section>
  )
}

function Mosaic() {
  const tiles = Array.from({ length: 42 }, (_, index) => (index % 6 === 0 ? RUBBER : TEA_FIELD))
  return (
    <div className="mosaic-grid">
      {tiles.map((src, index) => (
        <div
          key={index}
          className="mosaic-tile"
          style={{
            backgroundImage: `linear-gradient(rgba(6,17,13,0.18), rgba(6,17,13,0.18)), url(${src})`
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const full = document.documentElement.scrollHeight - window.innerHeight
      setProgress(full > 0 ? window.scrollY / full : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const overlayBackground = {
    background: `radial-gradient(circle at ${20 + progress * 60}% ${20 + progress * 30}%, rgba(141,255,97,0.16), transparent 24%), radial-gradient(circle at 80% 70%, rgba(232,164,92,0.12), transparent 22%), linear-gradient(180deg, rgba(2,8,6,0.25), rgba(4,17,13,0.74))`
  }

  return (
    <div className="app-shell">
      <div className="scene-backdrop">
        <Canvas camera={{ position: [0, 0, 8], fov: 48 }} gl={{ antialias: true, alpha: true }}>
          <Atmosphere />
        </Canvas>
        <div className="scene-overlay" style={overlayBackground} />
      </div>

      <div className="content-shell">
        <header className="topbar">
          <div className="topbar-pill">
            <div className="brand-wrap">
              <div className="brand-dot" />
              <span className="brand-text">Tea Lab</span>
            </div>
            <nav className="menu-wrap">
              <span>Origins</span>
              <span>Field</span>
              <span>Testing</span>
              <span>Contact</span>
            </nav>
          </div>
        </header>

        <Section className="grain hero-panel">
          <div
            className="hero-background"
            style={{
              backgroundImage: `linear-gradient(90deg, rgba(2,9,7,0.84) 8%, rgba(2,9,7,0.28) 52%, rgba(2,9,7,0.84) 100%), url(${TEA_FIELD})`
            }}
          />
          <div className="hero-side-plant" style={{ backgroundImage: `url(${TEA_FLOWER})` }} />
          <div className="hero-inner container">
            <div className="copy-stack max-copy">
              <div className="eyebrow">Single-origin visual prototype</div>
              <h1 className="display hero-title">Tea.<br />Revolutionized.</h1>
              <p className="hero-text">
                A React Three Fiber landing page built to mirror the same cinematic, premium,
                image-led scrolling style as the reference clip.
              </p>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container grid-two grid-text-visual">
            <div className="copy-stack">
              <div className="eyebrow">Section 02</div>
              <h2 className="display section-title">Our growers dial it in further.</h2>
              <p className="body-copy">
                The reference site relies on minimal copy, oversized typography, motion haze, and one dominant object per scene.
                This rebuild follows the same logic.
              </p>
            </div>
            <div className="orb-card">
              <div className="orb-glow" />
              <div className="orb-frame spot-ring">
                <div className="orb-ring small" />
                <div className="orb-ring large" />
                <img src={TEA_CUP} alt="Tea cup illustration" className="floating-art cup-art" />
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container grid-two reverse-mobile">
            <div className="copy-stack field-copy">
              <div className="eyebrow">Section 03</div>
              <h2 className="display section-title">We take it to the field.</h2>
              <p className="body-copy">
                Big macro photography, shallow depth, and quiet navigation do most of the heavy lifting.
                The code is simple. The art direction is not.
              </p>
            </div>
            <div className="field-card">
              <div className="field-image" style={{ backgroundImage: `linear-gradient(180deg, rgba(3,10,7,0.12), rgba(3,10,7,0.25)), url(${TEA_FLOWER})` }} />
              <div className="field-chip">Field View</div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container grid-two grid-text-visual">
            <div className="copy-stack">
              <div className="eyebrow">Section 04</div>
              <h2 className="display section-title">Testing. Testing. And more testing.</h2>
              <p className="body-copy">
                The mosaic scene in the reference is basically a textured wall of repeated agricultural slices.
                This version recreates that structure with self-contained assets.
              </p>
            </div>
            <div className="mosaic-card">
              <Mosaic />
            </div>
          </div>
        </Section>

        <Section>
          <div className="container grid-two grid-visual-text">
            <div className="fruit-card">
              <div className="fruit-backdrop" />
              <div className="fruit-wrap">
                <img src={STRAWBERRY} alt="Floating flavour visual" className="floating-art berry-art" />
              </div>
            </div>
            <div className="copy-stack">
              <div className="eyebrow">Section 05</div>
              <h2 className="display section-title">Built for flavour.</h2>
              <p className="body-copy">
                The final object scene in the clip uses a single suspended form against a deep atmospheric field.
                Here it is recreated with a floating ingredient cutout.
              </p>
              <div className="chip">Scroll-crafted interface</div>
            </div>
          </div>
        </Section>

        <Section>
          <div className="container grid-two grid-text-visual">
            <div className="copy-stack">
              <div className="eyebrow">Contact</div>
              <h2 className="display section-title">Build your tea brand experience.</h2>
              <div className="contact-list">
                <div>Contact a territory manager</div>
                <div>Local and tradewinds</div>
                <div>Visit origin evolution podcast</div>
                <div>Story-forward product visuals</div>
              </div>
            </div>
            <div className="contact-card">
              <div
                className="contact-visual"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(4,17,13,0.72), rgba(4,17,13,0.2)), url(${TEA_FIELD})`
                }}
              >
                <div className="contact-radials" />
                <div className="contact-copy">
                  <div className="display contact-title">Tea. Reimagined.</div>
                  <div className="contact-text">
                    This is the closest possible ready-to-run project using a self-contained asset system and a React Three Fiber atmosphere layer.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
