import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import Splash from "./Splash";
import { mountMotion, scrollTo } from "./motion";

const rest = "EXTTI".split("");

const steps = [
  {
    index: "01",
    title: "Escuta",
    text: "O pedido chega pronto, e quase nunca é o problema. A gente volta na rotina: quem faz, onde para, o que se perde no caminho.",
    glyph: "listen",
  },
  {
    index: "02",
    title: "Desenho",
    text: "Um fluxo. As decisões. O que o sistema precisa devolver para o trabalho andar sem depender de memória.",
    glyph: "draw",
  },
  {
    index: "03",
    title: "Construção",
    text: "Código que entra em uso. Depois da entrega, o sistema continua: ajuste, medida e evolução junto com a operação.",
    glyph: "build",
  },
] as const;

const offers = [
  {
    index: "01",
    title: "Sistemas sob medida",
    text: "O processo do cliente vira software, do jeito que a operação funciona.",
  },
  {
    index: "02",
    title: "Integração",
    text: "Ferramentas que não se falam passam a trocar informação, sem a planilha no meio.",
  },
  {
    index: "03",
    title: "Automação",
    text: "O que hoje depende de alguém lembrar, cobrar ou copiar passa a acontecer.",
  },
  {
    index: "04",
    title: "Evolução",
    text: "Sistema que já existe e já não dá conta. A gente entra, entende e faz ele voltar a servir.",
  },
];

const facts = [
  ["Nome", "NEXTTI"],
  ["Empresa", "NEXTTI Sistemas"],
  ["Ofício", "Sistemas e soluções"],
  ["Direção", "Marcelo Duretti"],
  ["Desenvolvimento", "Gabriel Queiroz Ferrari"],
];

const closeWords = [
  { text: "Se", glow: false },
  { text: "o", glow: false },
  { text: "problema", glow: false },
  { text: "é", glow: false },
  { text: "real,", glow: false },
  { text: "a", glow: false },
  { text: "NEXTTI", glow: true },
  { text: "constrói", glow: true },
  { text: "o", glow: true },
  { text: "sistema.", glow: true },
];

function SplitLine({ text }: { text: string }) {
  const parts = text.split(" ");
  return (
    <>
      {parts.map((part, index) => (
        <span key={`${part}-${index}`}>
          <span className="word-mask">
            <span className="word">{part}</span>
          </span>
          {index < parts.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}

function SectionRule() {
  return (
    <div className="section-rule" data-section-rule aria-hidden="true">
      <span />
    </div>
  );
}

function onNavigate(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#")) return;
  event.preventDefault();
  scrollTo(href);
}

function StepGlyph({ kind }: { kind: "listen" | "draw" | "build" }) {
  if (kind === "listen") {
    return (
      <svg className="step-glyph" viewBox="0 0 64 64" aria-hidden="true">
        <circle className="glyph-stroke" cx="32" cy="32" r="8" />
        <circle className="glyph-stroke" cx="32" cy="32" r="16" />
        <circle className="glyph-stroke" cx="32" cy="32" r="24" />
      </svg>
    );
  }

  if (kind === "draw") {
    return (
      <svg className="step-glyph" viewBox="0 0 64 64" aria-hidden="true">
        <path className="glyph-stroke" d="M8 16H56M8 32H56M8 48H56M16 8V56M32 8V56M48 8V56" />
      </svg>
    );
  }

  return (
    <svg className="step-glyph" viewBox="0 0 64 64" aria-hidden="true">
      <path className="glyph-stroke" d="M8 40L24 24L40 40" />
      <path className="glyph-stroke" d="M20 40L36 24L52 40" />
      <path className="glyph-stroke" d="M12 48H48" />
    </svg>
  );
}

function Chevrons() {
  const tones = [
    { from: "#7eb6ff", mid: "#0058c0", to: "#001860" },
    { from: "#9ae7ff", mid: "#0090d8", to: "#0038a0" },
    { from: "#e8ff7a", mid: "#7ed321", to: "#0c5a22" },
  ];

  return (
    <div className="hero-mark" data-hero-mark>
      <div className="hero-tilt" data-hero-tilt>
        {tones.map((tone, index) => (
          <div className="chevron" data-chevron={index} key={tone.mid} style={{ animationDelay: `${0.08 + index * 0.09}s` }}>
            <svg viewBox="0 0 220 240" aria-hidden="true">
              <defs>
                <linearGradient id={`chevron-${index}`} x1="0" y1="0" x2="0.2" y2="1">
                  <stop offset="0%" stopColor={tone.from} />
                  <stop offset="46%" stopColor={tone.mid} />
                  <stop offset="100%" stopColor={tone.to} />
                </linearGradient>
              </defs>
              <polygon fill={`url(#chevron-${index})`} points="4,38 126,38 208,120 126,202 4,202 84,120" />
              <polygon fill="#ffffff" opacity="0.2" points="4,38 126,38 208,120 154,96 62,96 16,54" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [booting, setBooting] = useState(true);
  const finishSplash = useCallback(() => setBooting(false), []);

  useEffect(() => {
    if (booting) return;
    const root = rootRef.current;
    if (!root) return;
    return mountMotion(root);
  }, [booting]);

  return (
    <>
      {booting && <Splash onDone={finishSplash} />}

      <div ref={rootRef} className={booting ? "page is-waiting" : "page is-ready"}>
        <div className="progress" data-progress aria-hidden="true" />
        <div className="cursor" data-cursor aria-hidden="true" />
        <div className="grain" aria-hidden="true" />

        <header className="header" data-header>
          <div className="header-inner">
            <a className="brand" href="#topo" onClick={onNavigate}>
              <img src="/brand/mark.png" alt="" width={36} height={32} />
              <span className="mini-word">
                <span className="mini-n">N</span>
                <span className="mini-rest">
                  {rest.map((letter, index) => (
                    <span className="mini-mask" key={`${letter}-${index}`} style={{ ["--i" as string]: index }}>
                      <span>{letter}</span>
                    </span>
                  ))}
                </span>
              </span>
            </a>
            <nav className="nav" aria-label="Seções">
              <a href="#empresa" onClick={onNavigate}>
                A empresa
              </a>
              <a href="#metodo" onClick={onNavigate}>
                Método
              </a>
              <a href="#sistemas" onClick={onNavigate}>
                Sistemas
              </a>
              <a href="#pessoas" onClick={onNavigate}>
                Pessoas
              </a>
            </nav>
          </div>
        </header>

        <main>
          <section className="hero" id="topo">
            <div className="glow" data-glow aria-hidden="true" />
            <p className="spine">NEXTTI Sistemas</p>

            <div className="hero-copy" data-hero-copy>
              <p className="kicker">Desenvolvimento de sistemas</p>

              <h1 className="hero-word" data-hero-word tabIndex={0} aria-expanded="false" aria-label="NEXTTI">
                <span className="hero-sizer" aria-hidden="true">
                  NEXTTI
                </span>
                <span className="hero-live">
                  <span className="hero-n" data-hero-n>
                    <span className="letter-mask">
                      <span className="letter">N</span>
                    </span>
                  </span>
                  <span className="hero-rest" data-hero-rest>
                    {rest.map((letter, index) => (
                      <span className="letter-mask" key={`${letter}-${index}`}>
                        <span className="letter-still" data-rest-letter>
                          {letter}
                        </span>
                      </span>
                    ))}
                  </span>
                  <span className="hero-shine" data-hero-shine aria-hidden="true" />
                </span>
              </h1>

              <div className="hero-rule" data-hero-rule aria-hidden="true" />
              <p className="hero-lead">
                Sistemas para problemas reais. A operação entra travada e sai com um caminho que a equipe consegue usar.
              </p>
            </div>

            <Chevrons />

            <div className="hero-meta">
              <p>Marcelo Duretti, CEO</p>
              <p>Gabriel Queiroz Ferrari, desenvolvimento</p>
            </div>
          </section>

          <SectionRule />

          <section className="manifesto panel" id="empresa" data-panel>
            <div className="panel-bg" data-parallax="-28" aria-hidden="true" />
            <div className="panel-body">
              <p className="kicker rise" data-rise>
                ( A empresa )
              </p>
              <div className="manifesto-grid">
                <div>
                  <h2 data-split>
                    <SplitLine text="A NEXTTI resolve o problema antes de empilhar funcionalidade." />
                  </h2>
                  <div className="prose">
                    <p className="rise" data-rise>
                      Somos a NEXTTI Sistemas. O nome fantasia é NEXTTI. O trabalho é desenvolvimento de sistemas: sentar com o cliente, entender o que realmente atrapalha e construir a solução que fica na rotina.
                    </p>
                    <p className="rise" data-rise>
                      Não partimos de um pacote genérico. Cada sistema nasce de um problema concreto, com as pessoas que vão usar do outro lado da mesa.
                    </p>
                  </div>
                </div>
                <dl className="facts rise" data-rise>
                  {facts.map(([label, value]) => (
                    <div className="fact" key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <SectionRule />

          <section className="method panel" id="metodo" data-panel>
            <div className="panel-bg panel-bg-dark" data-parallax="-34" aria-hidden="true" />
            <div className="panel-body">
              <div className="section-head">
                <p className="kicker rise" data-rise>
                  ( O caminho )
                </p>
                <h2 data-split>
                  <SplitLine text="Três momentos. O resto é consequência." />
                </h2>
              </div>

              <div className="path" data-path>
                <div className="path-track" aria-hidden="true">
                  <div className="path-fill" data-path-fill />
                </div>
                <ol className="steps">
                  {steps.map((step) => (
                    <li className="step" data-step key={step.index}>
                      <span className="step-index">{step.index}</span>
                      <div className="step-copy">
                        <h3>{step.title}</h3>
                        <p>{step.text}</p>
                      </div>
                      <div className="step-visual" aria-hidden="true">
                        <StepGlyph kind={step.glyph} />
                        <span className="step-beam" />
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>

          <SectionRule />

          <section className="practice panel" id="sistemas" data-panel>
            <div className="panel-bg" data-parallax="-24" aria-hidden="true" />
            <div className="panel-float" data-parallax="48" aria-hidden="true">
              <img src="/brand/mark.png" alt="" />
            </div>
            <div className="panel-body">
              <div className="section-head section-head-wide">
                <p className="kicker rise" data-rise>
                  ( O que entregamos )
                </p>
                <h2 data-split>
                  <SplitLine text="Quatro formas de tirar um problema do caminho." />
                </h2>
              </div>
              <div className="offers">
                {offers.map((offer) => (
                  <article className="offer" data-slide key={offer.index}>
                    <span>{offer.index}</span>
                    <div>
                      <h3>{offer.title}</h3>
                      <p>{offer.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <SectionRule />

          <section className="people panel" id="pessoas" data-panel>
            <div className="panel-bg panel-bg-dark" data-parallax="-30" aria-hidden="true" />
            <div className="panel-body">
              <div className="section-head section-head-wide">
                <p className="kicker rise" data-rise>
                  ( Quem conduz )
                </p>
                <h2 data-split>
                  <SplitLine text="Duas pessoas. O problema e o sistema na mesma mesa." />
                </h2>
              </div>

              <article className="person" data-slide>
                <div>
                  <p className="role">CEO</p>
                  <h3 data-split>
                    <SplitLine text="Marcelo Duretti" />
                  </h3>
                </div>
                <p>
                  Conduz a empresa e a relação com o cliente. É por ele que o problema entra, antes de virar prazo e escopo.
                </p>
              </article>

              <article className="person" data-slide>
                <div>
                  <p className="role">Desenvolvimento</p>
                  <h3 data-split>
                    <SplitLine text="Gabriel Queiroz Ferrari" />
                  </h3>
                </div>
                <p>
                  Braço direito da direção. Cuida da arquitetura, da construção e da entrega que permanece de pé depois que o sistema entra em uso.
                </p>
              </article>
            </div>
          </section>

          <SectionRule />

          <section className="close panel" data-panel data-close>
            <div className="panel-bg panel-bg-dark" data-parallax="-22" aria-hidden="true" />
            <div className="close-spotlight" data-close-spotlight aria-hidden="true" />
            <div className="panel-body">
              <p className="kicker rise" data-rise>
                ( Daqui para frente )
              </p>
              <h2 className="close-line" data-close-line>
                {closeWords.map((word, index) => (
                  <span key={`${word.text}-${index}`}>
                    <span className={`close-word${word.glow ? " is-glow" : ""}`} data-close-word>
                      {word.text}
                    </span>
                    {index < closeWords.length - 1 ? " " : null}
                  </span>
                ))}
              </h2>

              <div className="marquee-stack" data-marquee aria-hidden="true">
                <div className="marquee marquee-a">
                  <div className="marquee-track" data-marquee-a>
                    {[0, 1].map((group) => (
                      <div className="marquee-group" key={group}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index}>
                            NEXTTI <em>Sistemas</em>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="marquee marquee-b">
                  <div className="marquee-track" data-marquee-b>
                    {[0, 1].map((group) => (
                      <div className="marquee-group outline" key={group}>
                        {Array.from({ length: 5 }, (_, index) => (
                          <span key={index}>
                            NEXTTI <em>Sistemas</em>
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <img src="/brand/oficial.jpg" alt="NEXTTI Sistemas" width={640} height={212} />
          <p>Marcelo Duretti e Gabriel Queiroz Ferrari</p>
        </footer>
      </div>
    </>
  );
}
