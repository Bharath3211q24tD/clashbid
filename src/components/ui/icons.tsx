import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, ...props }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </IconBase>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  );
}

export function ChevronRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m9 6 6 6-6 6" />
    </IconBase>
  );
}

export function Menu(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h10" />
    </IconBase>
  );
}

export function Close(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </IconBase>
  );
}

export function Lock(props: IconProps) {
  return (
    <IconBase {...props}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
      <path d="M12 14.5v2" />
    </IconBase>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z" />
      <path d="m18.5 16 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
      <path d="M4 16.5v3" />
      <path d="M2.5 18h3" />
    </IconBase>
  );
}

export function Mask(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5.5c2.8-1.7 13.2-1.7 16 0v5.8c0 4.2-3.6 7.7-8 7.7s-8-3.5-8-7.7V5.5Z" />
      <path d="M8.3 9.5c.7-.6 1.8-.6 2.5 0" />
      <path d="M13.2 9.5c.7-.6 1.8-.6 2.5 0" />
      <path d="M9.5 14.5c1.5 1.2 3.5 1.2 5 0" />
    </IconBase>
  );
}

export function Football(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7 3.4 2.5-1.3 4h-4.2l-1.3-4L12 7Z" />
      <path d="M12 3v4" />
      <path d="m4.1 9.2 4.5 1.3" />
      <path d="m19.9 9.2-4.5 1.3" />
      <path d="m6.5 19 3.4-5.5" />
      <path d="m17.5 19-3.4-5.5" />
    </IconBase>
  );
}

export function CricketBall(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8 6.4c2.5 3.2 2.5 8 0 11.2" />
      <path d="M16 6.4c-2.5 3.2-2.5 8 0 11.2" />
      <path d="M9.5 9.5h.01" />
      <path d="M9.5 12.5h.01" />
      <path d="M9.5 15.5h.01" />
      <path d="M14.5 10.5h.01" />
      <path d="M14.5 13.5h.01" />
    </IconBase>
  );
}

export function Trophy(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M16 6h3v2a3 3 0 0 1-3 3" />
      <path d="M8 6H5v2a3 3 0 0 0 3 3" />
      <path d="M12 13v4" />
      <path d="M8 21h8" />
      <path d="M9.5 17h5l.5 4h-6l.5-4Z" />
    </IconBase>
  );
}

export function Swords(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 4h4l9 9-2 2-9-9V4Z" />
      <path d="m13.5 13.5 2-2" />
      <path d="m14 16 2-2 4 4v2h-2l-4-4Z" />
      <path d="m4.5 17.5 2-2" />
      <path d="m3 21 2.5-2.5" />
      <path d="M20 4h-4" />
      <path d="m6.5 6.5 3-3" />
    </IconBase>
  );
}

export function Users(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.3a3 3 0 0 1 0 5.4" />
      <path d="M17.5 14.2A5.5 5.5 0 0 1 21 19.5" />
    </IconBase>
  );
}

export function Layers(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </IconBase>
  );
}

export function Wallet(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 7.5V6a2 2 0 0 1 2-2h12v3.5" />
      <path d="M4 7.5h15a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7.5Z" />
      <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z" />
    </IconBase>
  );
}

export function Gavel(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m14 4 6 6" />
      <path d="m17 7-8.5 8.5-3-3L14 4l3 3Z" />
      <path d="m11 10-6 6" />
      <path d="m4 20 5-5" />
      <path d="M4 20h6" />
    </IconBase>
  );
}

export function Target(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.75" fill="currentColor" stroke="none" />
    </IconBase>
  );
}

export function Bolt(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12L13 2Z" />
    </IconBase>
  );
}

export function Radar(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12V3" />
      <path d="m12 12 5.5 5.5" />
      <path d="M12 12 3.5 9.5" />
      <path d="M12 12h9" opacity=".35" />
    </IconBase>
  );
}

export function Check(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </IconBase>
  );
}

export function Brain(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M9.5 4a3.2 3.2 0 0 0-3.2 3.2v.4A3.1 3.1 0 0 0 4 10.3v1A3.1 3.1 0 0 0 6.3 14.2a3.4 3.4 0 0 0 3.2 4.3c1.4 0 2.5-.7 3-1.8V5.8A3.2 3.2 0 0 0 9.5 4Z" />
      <path d="M14.5 4a3.2 3.2 0 0 1 3.2 3.2v.4A3.1 3.1 0 0 1 20 10.3v1a3.1 3.1 0 0 1-2.3 2.9 3.4 3.4 0 0 1-3.2 4.3c-1.4 0-2.5-.7-3-1.8V5.8A3.2 3.2 0 0 1 14.5 4Z" />
    </IconBase>
  );
}

export function Flag(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 21V4" />
      <path d="M6 4.5c4-1.8 8 1.8 12 0v9c-4 1.8-8-1.8-12 0" />
    </IconBase>
  );
}

export function Shuffle(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 7h3.5c4.5 0 6 10 10.5 10H21" />
      <path d="M18 14l3 3-3 3" />
      <path d="M3 17h3.5c1.7 0 2.9-1.5 3.9-3.3" />
      <path d="M13.4 10.2C14.3 8.5 15.6 7 17 7h4" />
      <path d="M18 4l3 3-3 3" />
    </IconBase>
  );
}

export function Shield(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 5 5.5v5.6c0 4.4 3 7.9 7 9.4 4-1.5 7-5 7-9.4V5.5L12 3Z" />
      <path d="M12 3v17.5" />
    </IconBase>
  );
}

export function Clock(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </IconBase>
  );
}

export function Hourglass(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 3.5h10c0 3.5-3 4.7-3 8.5 0 3.8 3 5 3 8.5H7c0-3.5 3-4.7 3-8.5 0-3.8-3-5-3-8.5Z" />
      <path d="M9 20.5h6" />
    </IconBase>
  );
}

export function Volume(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
      <path d="M15.5 9a5 5 0 0 1 0 6" />
      <path d="M18 6.8a8.5 8.5 0 0 1 0 10.4" />
    </IconBase>
  );
}

export function VolumeOff(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 9.5v5h3.5L12 18V6L7.5 9.5H4Z" />
      <path d="m16 9.5 4.5 5" />
      <path d="m20.5 9.5-4.5 5" />
    </IconBase>
  );
}

export function User(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </IconBase>
  );
}

export function Search(props: IconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </IconBase>
  );
}

export function Flame(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3c1.5 3.5 5 4.7 5 9a5 5 0 0 1-10 0c0-2 .8-3.4 2-5 .3 1 .8 1.8 1.6 2.2C11 7 11.5 5 12 3Z" />
      <path d="M12 21a5 5 0 0 0 5-5" opacity="0.5" />
    </IconBase>
  );
}

export function ActivityLog(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 12h2.5l2-5 3 10 2.5-7 1.6 4H20" />
      <path d="M4 19h16" />
    </IconBase>
  );
}

export function X_1(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </IconBase>
  );
}

export function Plus(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5.5v13" />
      <path d="M5.5 12h13" />
    </IconBase>
  );
}
