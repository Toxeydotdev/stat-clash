import { useEffect, useState } from 'react';
import {
  ArrowDown,
  Database,
  Info,
  RefreshCw,
  Shuffle,
  Swords,
  Trophy,
  Zap,
} from 'lucide-react';
import type {
  ComparisonMetric,
  FeaturedComparison,
  MetricFormat,
  PlayerProfile,
} from '@stat-clash/contracts';
import {
  Badge,
  Button,
  Hint,
  HintProvider,
  MetricBar,
  Panel,
  type PlayerAccent,
  PlayerAvatar,
} from '@stat-clash/ui';

type ComparisonState =
  | { status: 'loading' }
  | { status: 'ready'; comparison: FeaturedComparison }
  | { status: 'error'; message: string };

function useFeaturedComparison(refreshToken: number): ComparisonState {
  const [state, setState] = useState<ComparisonState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    async function loadComparison() {
      setState({ status: 'loading' });

      try {
        const response = await fetch('/api/comparisons/featured', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Arena API returned ${response.status}`);
        }

        const comparison = (await response.json()) as FeaturedComparison;
        setState({ status: 'ready', comparison });
      } catch (error) {
        if (controller.signal.aborted) return;

        setState({
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown arena error',
        });
      }
    }

    void loadComparison();
    return () => controller.abort();
  }, [refreshToken]);

  return state;
}

function formatMetric(value: number, format: MetricFormat): string {
  if (format === 'percent') return `${value.toFixed(1)}%`;
  if (format === 'decimal') return value.toFixed(2);
  return new Intl.NumberFormat('en-US').format(value);
}

function getWinner(left: number, right: number): 'left' | 'right' | 'tie' {
  if (left === right) return 'tie';
  return left > right ? 'left' : 'right';
}

function orientMetric(metric: ComparisonMetric, swapped: boolean) {
  const [first, second] = metric.values;
  const left = swapped ? second : first;
  const right = swapped ? first : second;
  const maximum = Math.max(left, right, 1);

  return {
    left,
    right,
    leftWeight: Math.max(12, (left / maximum) * 100),
    rightWeight: Math.max(12, (right / maximum) * 100),
    winner: getWinner(left, right),
  } as const;
}

interface PlayerCardProps {
  accent: PlayerAccent;
  align: 'left' | 'right';
  player: PlayerProfile;
}

function PlayerCard({ accent, align, player }: PlayerCardProps) {
  return (
    <article
      aria-label={`${align === 'left' ? 'Left' : 'Right'} challenger`}
      className={`flex items-center gap-4 ${align === 'right' ? 'text-right sm:flex-row-reverse' : ''}`}
    >
      <PlayerAvatar accent={accent} initials={player.initials} label={player.handle} />
      <div className="min-w-0">
        <p className="mb-1 font-mono text-[0.625rem] font-bold uppercase tracking-[0.18em] text-ink-muted">
          {align === 'left' ? 'Challenger 01' : 'Challenger 02'}
        </p>
        <h3 className="truncate font-display text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
          {player.handle}
          <span className="ml-1 font-mono text-[0.625rem] font-medium tracking-normal text-ink-muted">
            {player.discriminator}
          </span>
        </h3>
        <div
          className={`mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink-soft ${align === 'right' ? 'justify-end' : ''}`}
        >
          <span>{player.rank}</span>
          <span aria-hidden="true" className="text-white/20">
            /
          </span>
          <span>{player.region}</span>
        </div>
      </div>
    </article>
  );
}

interface ArenaProps {
  comparison: FeaturedComparison;
}

function ComparisonArena({ comparison }: ArenaProps) {
  const [swapped, setSwapped] = useState(false);
  const [first, second] = comparison.players;
  const leftPlayer = swapped ? second : first;
  const rightPlayer = swapped ? first : second;
  const orientedMetrics = comparison.metrics.map((metric) => ({
    metric,
    values: orientMetric(metric, swapped),
  }));
  const score = orientedMetrics.reduce<[number, number]>(
    (currentScore, { values }) => {
      if (values.winner === 'left') currentScore[0] += 1;
      if (values.winner === 'right') currentScore[1] += 1;
      return currentScore;
    },
    [0, 0],
  );
  const leader =
    score[0] === score[1] ? null : score[0] > score[1] ? leftPlayer : rightPlayer;

  return (
    <Panel className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-clash-cyan via-white/20 to-clash-magenta"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan">{comparison.game.name}</Badge>
          <Badge>{comparison.game.mode}</Badge>
          <Badge>{comparison.game.season}</Badge>
        </div>
        <Hint content={comparison.source.description}>
          <button
            aria-label="About this data"
            className="inline-flex size-9 items-center justify-center border border-white/10 text-ink-muted transition-colors hover:border-clash-cyan/50 hover:text-clash-cyan focus-visible:outline-2 focus-visible:outline-clash-cyan"
            type="button"
          >
            <Info aria-hidden="true" size={15} />
          </button>
        </Hint>
      </div>

      <div className="grid gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-5 lg:py-10">
        <PlayerCard accent="cyan" align="left" player={leftPlayer} />

        <div className="mx-auto grid size-20 rotate-3 place-items-center border border-white/15 bg-void shadow-[5px_5px_0_rgba(255,54,209,0.22)] lg:size-24">
          <div className="-rotate-3 text-center">
            <Swords
              aria-hidden="true"
              className="mx-auto mb-1 text-clash-acid"
              size={19}
            />
            <span className="font-display text-2xl font-black italic tracking-[-0.08em] text-white">
              VS
            </span>
          </div>
        </div>

        <PlayerCard accent="magenta" align="right" player={rightPlayer} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center border-y border-white/[0.08] bg-void/60 px-5 py-4 sm:px-8">
        <strong className="font-display text-4xl font-black text-clash-cyan sm:text-5xl">
          {score[0]}
        </strong>
        <div className="text-center">
          <p className="font-mono text-[0.5625rem] uppercase tracking-[0.22em] text-ink-muted">
            Metric score
          </p>
          <p className="mt-1 font-display text-sm font-bold uppercase tracking-[0.08em] text-white">
            {leader ? `${leader.handle} leads` : 'Dead even'}
          </p>
        </div>
        <strong className="text-right font-display text-4xl font-black text-clash-magenta sm:text-5xl">
          {score[1]}
        </strong>
      </div>

      <div className="px-5 py-2 sm:px-8">
        {orientedMetrics.map(({ metric, values }) => (
          <MetricBar
            key={metric.id}
            label={metric.label}
            leftLabel={leftPlayer.handle}
            leftValue={formatMetric(values.left, metric.format)}
            leftWeight={values.leftWeight}
            rightLabel={rightPlayer.handle}
            rightValue={formatMetric(values.right, metric.format)}
            rightWeight={values.rightWeight}
            winner={values.winner}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-white/[0.08] bg-white/[0.02] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-start gap-3">
          <Database aria-hidden="true" className="mt-0.5 text-clash-acid" size={16} />
          <div>
            <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.14em] text-ink-soft">
              {comparison.source.label}
            </p>
            <p className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.08em] text-ink-muted">
              Captured{' '}
              {new Date(comparison.source.capturedAt).toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short',
                timeZone: 'UTC',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <Button
          intent="ghost"
          onClick={() => setSwapped((current) => !current)}
          size="sm"
        >
          <Shuffle aria-hidden="true" size={14} />
          Swap corners
        </Button>
      </div>
    </Panel>
  );
}

function ArenaLoading() {
  return (
    <Panel aria-label="Loading featured comparison" className="p-5 sm:p-8">
      <div className="mb-8 h-8 w-48 animate-pulse bg-white/[0.06]" />
      <div className="grid gap-7 lg:grid-cols-2">
        <div className="h-32 animate-pulse bg-clash-cyan/[0.05]" />
        <div className="h-32 animate-pulse bg-clash-magenta/[0.05]" />
      </div>
      <div className="mt-7 grid gap-4">
        {[0, 1, 2, 3, 4].map((item) => (
          <div className="h-14 animate-pulse bg-white/[0.035]" key={item} />
        ))}
      </div>
    </Panel>
  );
}

interface ArenaErrorProps {
  message: string;
  onRetry: () => void;
}

function ArenaError({ message, onRetry }: ArenaErrorProps) {
  return (
    <Panel className="grid min-h-96 place-items-center p-8 text-center">
      <div className="max-w-md">
        <Zap aria-hidden="true" className="mx-auto text-clash-magenta" size={32} />
        <h2 className="mt-5 font-display text-3xl font-black text-white">
          Arena feed lost
        </h2>
        <p className="mt-3 font-mono text-xs leading-6 text-ink-muted">{message}</p>
        <Button className="mt-7" intent="secondary" onClick={onRetry}>
          <RefreshCw aria-hidden="true" size={14} />
          Reconnect
        </Button>
      </div>
    </Panel>
  );
}

const roadmap = [
  {
    number: '01',
    title: 'Connect a handle',
    body: 'Bring verified stats in through game-specific provider adapters.',
  },
  {
    number: '02',
    title: 'Normalize the fight',
    body: 'Compare equivalent modes, seasons, and samples instead of noisy totals.',
  },
  {
    number: '03',
    title: 'Drop the receipt',
    body: 'Turn the result into a sharp, shareable matchup card.',
  },
];

export function App() {
  const [refreshToken, setRefreshToken] = useState(0);
  const comparisonState = useFeaturedComparison(refreshToken);

  function scrollToMatchup() {
    document.querySelector('#matchup')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <HintProvider delayDuration={250}>
      <div className="min-h-screen overflow-hidden bg-void text-ink-soft">
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 scanlines"
        />

        <header className="relative z-20 border-b border-white/10 bg-void/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-[90rem] items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
            <a className="group flex items-center gap-3" href="#top">
              <span className="grid size-9 -skew-x-6 place-items-center border border-clash-cyan bg-clash-cyan text-void shadow-[3px_3px_0_var(--color-clash-magenta)] transition-transform group-hover:skew-x-0">
                <Swords aria-hidden="true" size={17} />
              </span>
              <span className="font-display text-lg font-black uppercase tracking-[-0.04em] text-white">
                Stat<span className="text-clash-magenta">/</span>Clash
              </span>
            </a>

            <nav
              aria-label="Primary navigation"
              className="hidden items-center gap-8 md:flex"
            >
              <a className="nav-link" href="#matchup">
                Arena
              </a>
              <a className="nav-link" href="#protocol">
                Protocol
              </a>
              <a className="nav-link" href="#roadmap">
                Roadmap
              </a>
            </nav>

            <Badge tone="acid">
              <span className="size-1.5 animate-pulse rounded-full bg-clash-acid" />
              Exhibition mode
            </Badge>
          </div>
        </header>

        <main id="top">
          <section className="arcade-grid relative border-b border-white/[0.08]">
            <div
              aria-hidden="true"
              className="absolute -right-32 top-14 size-[28rem] rounded-full bg-clash-magenta/[0.07] blur-[100px]"
            />
            <div
              aria-hidden="true"
              className="absolute -left-32 bottom-0 size-[24rem] rounded-full bg-clash-cyan/[0.07] blur-[100px]"
            />

            <div className="relative mx-auto grid min-h-[43rem] max-w-[90rem] items-center gap-14 px-5 py-20 sm:px-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
              <div className="max-w-4xl">
                <div className="mb-7 flex items-center gap-3 font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-clash-cyan">
                  <span className="h-px w-10 bg-clash-cyan" />
                  Player versus player // no excuses
                </div>
                <h1 className="max-w-4xl font-display text-[clamp(3.6rem,9vw,8.2rem)] font-black uppercase leading-[0.78] tracking-[-0.085em] text-white">
                  Settle the{' '}
                  <span className="mt-3 block text-clash-magenta text-outline">
                    lobby debate.
                  </span>
                </h1>
                <p className="mt-9 max-w-2xl text-base leading-8 text-ink-muted sm:text-lg">
                  Put two gaming profiles in the same arena. Stat Clash makes the
                  numbers fair, visual, and just competitive enough to share with the
                  group chat.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <Button onClick={scrollToMatchup}>
                    Enter the arena
                    <ArrowDown aria-hidden="true" size={15} />
                  </Button>
                  <span className="font-mono text-[0.625rem] uppercase leading-5 tracking-[0.13em] text-ink-muted">
                    No login
                    <br />
                    Exhibition data
                  </span>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:justify-self-end">
                <div
                  aria-hidden="true"
                  className="absolute -inset-5 rotate-3 border border-clash-magenta/25"
                />
                <Panel className="relative bg-void/95 p-6 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[0.5625rem] uppercase tracking-[0.2em] text-ink-muted">
                        Current signal
                      </p>
                      <p className="mt-2 font-display text-2xl font-black uppercase text-white">
                        Ranked pulse
                      </p>
                    </div>
                    <Zap aria-hidden="true" className="text-clash-acid" size={21} />
                  </div>
                  <div
                    className="my-8 grid h-32 grid-cols-12 items-end gap-1.5"
                    aria-hidden="true"
                  >
                    {[28, 44, 37, 68, 52, 88, 62, 76, 55, 95, 72, 100].map(
                      (height, index) => (
                        <span
                          className={
                            index > 8 ? 'bg-clash-magenta' : 'bg-clash-cyan/65'
                          }
                          key={height}
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                  <div className="grid grid-cols-3 border-t border-white/10 pt-5 text-center">
                    <div>
                      <strong className="block font-display text-xl text-white">
                        2
                      </strong>
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ink-muted">
                        Players
                      </span>
                    </div>
                    <div className="border-x border-white/10">
                      <strong className="block font-display text-xl text-white">
                        5
                      </strong>
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ink-muted">
                        Metrics
                      </span>
                    </div>
                    <div>
                      <strong className="block font-display text-xl text-clash-acid">
                        1
                      </strong>
                      <span className="font-mono text-[0.5rem] uppercase tracking-[0.13em] text-ink-muted">
                        Verdict
                      </span>
                    </div>
                  </div>
                </Panel>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="featured-clash-title"
            className="relative mx-auto max-w-[90rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
            id="matchup"
          >
            <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <Badge tone="magenta">Round 01</Badge>
                <h2
                  className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.055em] text-white sm:text-6xl"
                  id="featured-clash-title"
                >
                  Featured clash
                </h2>
              </div>
              <p className="max-w-md font-mono text-[0.6875rem] uppercase leading-6 tracking-[0.1em] text-ink-muted">
                A seeded matchup proves the comparison contract before external game
                accounts enter the ring.
              </p>
            </div>

            {comparisonState.status === 'loading' ? <ArenaLoading /> : null}
            {comparisonState.status === 'ready' ? (
              <ComparisonArena comparison={comparisonState.comparison} />
            ) : null}
            {comparisonState.status === 'error' ? (
              <ArenaError
                message={comparisonState.message}
                onRetry={() => setRefreshToken((current) => current + 1)}
              />
            ) : null}
          </section>

          <section className="border-y border-white/[0.08] bg-panel/45" id="protocol">
            <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:px-12 lg:py-20">
              <div>
                <Badge tone="acid">Fair-fight protocol</Badge>
                <h2 className="mt-5 max-w-lg font-display text-4xl font-black uppercase leading-[0.92] tracking-[-0.055em] text-white sm:text-5xl">
                  The flex only works when the data does.
                </h2>
              </div>
              <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
                {roadmap.map((item) => (
                  <article className="bg-void p-6 sm:p-7" key={item.number}>
                    <span className="font-mono text-[0.625rem] font-bold text-clash-cyan">
                      // {item.number}
                    </span>
                    <h3 className="mt-8 font-display text-xl font-black uppercase text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">{item.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="arcade-grid relative" id="roadmap">
            <div className="mx-auto flex max-w-[90rem] flex-col items-start justify-between gap-10 px-5 py-20 sm:px-8 lg:flex-row lg:items-end lg:px-12 lg:py-28">
              <div className="max-w-3xl">
                <p className="font-mono text-[0.625rem] font-bold uppercase tracking-[0.2em] text-clash-magenta">
                  Next challenger
                </p>
                <h2 className="mt-5 font-display text-5xl font-black uppercase leading-[0.88] tracking-[-0.065em] text-white sm:text-7xl">
                  Live game adapters.
                  <span className="block text-ink-muted">Shareable receipts.</span>
                </h2>
              </div>
              <div className="max-w-sm border-l border-clash-magenta pl-5">
                <Trophy aria-hidden="true" className="mb-4 text-clash-acid" size={22} />
                <p className="text-sm leading-7 text-ink-muted">
                  Provider selection, account verification, privacy controls, and metric
                  normalization will be specified before live player data is collected.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 px-5 py-7 sm:px-8 lg:px-12">
          <div className="mx-auto flex max-w-[90rem] flex-col gap-3 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-ink-muted sm:flex-row sm:items-center sm:justify-between">
            <span>Stat Clash // Exhibition build</span>
            <span>Specs before stats // OpenSpec governed</span>
          </div>
        </footer>
      </div>
    </HintProvider>
  );
}

export default App;
