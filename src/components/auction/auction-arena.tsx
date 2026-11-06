"use client";

import { CurrentLotStage } from "@/components/auction/current-lot-stage";
import { BidPanel } from "@/components/auction/bid-panel";
import { AuctionActivity } from "@/components/auction/auction-activity";
import { ResolutionOverlay } from "@/components/auction/resolution-overlay";
import {
  PlayerChip,
  SquadPanel,
  SQUAD_SIZE_DISPLAY,
} from "@/components/game/player-chip";
import { WalletDisplay } from "@/components/game/wallet-display";
import { useDemoMatch } from "@/stores/demo-match";
import { formatCrores } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { DemoMatch } from "@/types";

export function AuctionArena({ matchId }: { matchId: string }) {
  const match = useDemoMatch((state) => state.match);
  if (!match || match.matchId !== matchId) return null;
  return <ArenaShell match={match} />;
}

function ArenaShell({ match }: { match: DemoMatch }) {
  const rivalTurn = match.turn === "rival" && match.lotStage === "ACTIVE";
  const you = match.players.you;
  const rival = match.players.rival;

  return (
    <div className="mx-auto w-full max-w-[92rem] px-gutter pb-8 pt-6">
      <div className="mb-4 hidden items-center justify-between gap-3 lg:flex">
        <p className="font-display text-[0.625rem] font-semibold tracking-[0.24em] text-gold uppercase">
          Live auction — 1v1 arena
        </p>
        <p className="text-[0.625rem] font-medium tracking-[0.18em] text-subtle uppercase tabular-nums">
          Sold {match.soldCount} · Unsold {match.unsoldCount} · Lots 30
        </p>
      </div>

      {/* Desktop: three-column broadcast layout */}
      <div className="hidden lg:grid lg:h-[calc(100dvh-var(--spacing-header)-3.75rem)] lg:grid-cols-[16.5rem_minmax(0,1fr)_16.5rem] lg:gap-4">
        <aside className="flex min-h-0 flex-col gap-3">
          <PlayerChip player={you} active={!rivalTurn} />
          <WalletDisplay walletCr={you.walletCr} label="Your wallet" />
          <SquadPanel
            title="Your squad"
            side="you"
            entries={you.squad}
            className="min-h-0 flex-1"
          />
          <AuctionActivity className="min-h-0 flex-1" />
        </aside>

        <section className="relative flex min-h-0 flex-col gap-3 overflow-hidden rounded-panel border border-line-strong bg-elevated/60 p-4">
          <CurrentLotStage className="min-h-0 flex-1" />
          <BidPanel className="shrink-0" />
          <ResolutionOverlay />
        </section>

        <aside className="flex min-h-0 flex-col gap-3">
          <PlayerChip player={rival} active={rivalTurn} />
          <WalletDisplay walletCr={rival.walletCr} label="Rival wallet" />
          <SquadPanel
            title="Rival squad"
            side="rival"
            entries={rival.squad}
            className="min-h-0 flex-1"
          />
          <TurnStatusCard
            turn={match.turn}
            stage={match.lotStage}
            leader={match.lotLeader}
            currentBidCr={match.currentBidCr}
            className="shrink-0"
          />
        </aside>
      </div>

      {/* Mobile: purpose-built card stack */}
      <div className="flex flex-col gap-3 lg:hidden">
        <PlayerChip player={you} active={!rivalTurn} />
        <section className="relative flex flex-col overflow-hidden rounded-panel border border-line-strong bg-elevated/60 p-3.5">
          <CurrentLotStage />
          <ResolutionOverlay />
        </section>
        <div className="grid grid-cols-2 gap-3">
          <WalletDisplay walletCr={you.walletCr} label="Wallet" compact />
          <WalletDisplay walletCr={rival.walletCr} label="Rival wallet" compact />
        </div>
        <MobileDetail summary={`Your squad · ${you.squad.length}/${SQUAD_SIZE_DISPLAY}`}>
          <SquadPanel title="Your squad" side="you" entries={you.squad} />
        </MobileDetail>
        <MobileDetail summary="Auction activity">
          <AuctionActivity />
        </MobileDetail>
        <MobileDetail summary="Rival squad">
          <SquadPanel title="Rival squad" side="rival" entries={rival.squad} />
        </MobileDetail>
        <BidPanel className="sticky bottom-3 z-20 shadow-float" />
      </div>
    </div>
  );
}

function MobileDetail({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-card border border-line bg-elevated/50 px-4 py-3">
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[0.6875rem] font-semibold tracking-[0.2em] text-foreground uppercase [&::-webkit-details-marker]:hidden">
        {summary}
        <span aria-hidden="true" className="text-gold transition-transform duration-300 group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function TurnStatusCard({
  turn,
  stage,
  leader,
  currentBidCr,
  className,
}: {
  turn: "you" | "rival";
  stage: string;
  leader: "you" | "rival" | null;
  currentBidCr: number;
  className?: string;
}) {
  const status =
    stage !== "ACTIVE"
      ? "Resolving"
      : turn === "rival"
        ? leader === "rival"
          ? "Rival leads"
          : "Rival thinking"
        : leader === "you"
          ? "You lead the lot"
          : leader
            ? "Bid to stay in"
            : "Open the bidding";

  return (
    <div
      className={cn(
        "rounded-card border border-line bg-elevated/70 px-3 py-3",
        className,
      )}
    >
      <p className="font-display text-[0.5625rem] font-semibold tracking-[0.22em] text-subtle uppercase">
        Lot status
      </p>
      <p
        className={cn(
          "mt-1 font-display text-sm font-semibold tracking-[0.08em] uppercase",
          turn === "you" ? "text-gold-bright" : "text-foreground",
        )}
      >
        {status}
      </p>
      <p className="mt-1 text-[0.625rem] text-muted tabular-nums">
        {leader
          ? `Highest bid ${formatCrores(currentBidCr)}`
          : "No bids on the floor yet"}
      </p>
    </div>
  );
}
