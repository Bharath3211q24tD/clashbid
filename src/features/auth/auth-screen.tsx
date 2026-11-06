"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BrandMark, Logo } from "@/components/ui/brand";
import { DemoNotice } from "@/components/game/demo-notice";
import { useAuth } from "@/stores/auth";
import { useSound } from "@/stores/sound";
import { cn } from "@/lib/utils";

type Mode = "login" | "register";

export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const signIn = useAuth((state) => state.signIn);
  const playSound = useSound((state) => state.play);
  const reduced = useReducedMotion();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (): string | null => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Enter a valid email address.";
    }
    if (password.length < 6) {
      return "Password needs at least 6 characters.";
    }
    if (mode === "register" && handle.trim().length < 3) {
      return "Operator handle needs at least 3 characters.";
    }
    return null;
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      playSound("bid-fail");
      return;
    }
    setError(null);
    setPending(true);
    playSound("ui-confirm");
    window.setTimeout(() => {
      signIn({
        email,
        handle:
          mode === "register"
            ? handle.trim()
            : email.split("@")[0]!.slice(0, 12) || "Operator",
        method: "demo",
      });
      router.push("/lobby");
    }, 700);
  };

  const continueAsGuest = () => {
    playSound("ui-confirm");
    signIn({ email: "", handle: "Guest Operator", method: "demo" });
    router.push("/lobby");
  };

  return (
    <section className="relative mx-auto grid w-full max-w-5xl items-stretch gap-6 px-gutter pb-16 pt-10 lg:grid-cols-[1fr_minmax(0,26rem)] lg:pt-16">
      {/* Cinematic panel */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative hidden flex-col justify-between overflow-hidden rounded-panel border border-line-strong bg-elevated/70 p-8 lg:flex"
        aria-hidden="true"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="arena-grid absolute inset-0 opacity-40" />
          <div className="absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-gold/[0.12] blur-[90px]" />
          <div className="absolute bottom-[-3rem] right-[-2rem] h-56 w-56 rounded-full bg-[#3d4a75]/20 blur-[80px]" />
        </div>

        <div className="relative">
          <Logo markClassName="size-12" />
          <p className="mt-6 max-w-xs font-display text-[0.75rem] font-semibold tracking-[0.3em] text-gold uppercase">
            Build your squad. Outsmart your rival.
          </p>
        </div>

        <div className="relative">
          <p className="text-sm leading-relaxed text-muted">
            Thirty legendary lots. Two operators. A ₹100 Cr war chest and a
            15-second turn clock. Every match is a new draft story.
          </p>
          <div className="mt-5 flex gap-3">
            {["Bid", "Draft", "Battle"].map((label) => (
              <span
                key={label}
                className="rounded-pill border border-line-gold bg-gold-soft px-2.5 py-1 font-display text-[0.5625rem] font-semibold tracking-[0.2em] text-gold-bright uppercase"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Form panel */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col justify-center gap-5 rounded-panel border border-line bg-elevated/80 p-6 sm:p-8"
      >
        <div className="lg:hidden">
          <BrandMark className="size-10" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-[0.1em] text-foreground uppercase">
            {mode === "login" ? "Enter the arena" : "Create operator"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {mode === "login"
              ? "Sign in to your CLASHBID operator account."
              : "Pick a handle. Build a reputation."}
          </p>
        </div>

        <DemoNotice className="self-start">
          Demo auth — no data leaves this browser.
        </DemoNotice>

        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          {mode === "register" ? (
            <Field
              label="Operator handle"
              value={handle}
              onChange={setHandle}
              placeholder="e.g. Goldmarshal"
              autoComplete="nickname"
              invalid={Boolean(error?.toLowerCase().includes("handle"))}
            />
          ) : null}
          <Field
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="operator@clash.bid"
            autoComplete="email"
            invalid={Boolean(error?.toLowerCase().includes("email"))}
          />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            invalid={Boolean(error?.toLowerCase().includes("password"))}
          />

          {error ? (
            <p role="alert" className="text-xs text-danger">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" disabled={pending} className="mt-1 w-full">
            {pending ? "Opening arena…" : mode === "login" ? "Play now" : "Start playing"}
          </Button>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full rounded-control border border-line bg-white/[0.02] px-4 py-2.5 font-display text-[0.6875rem] font-semibold tracking-[0.2em] text-muted uppercase transition-colors hover:border-line-gold hover:text-foreground"
          >
            Continue as guest
          </button>
        </form>

        <p className="text-center text-xs text-muted">
          {mode === "login" ? (
            <>
              New here?{" "}
              <Link
                href="/register"
                className="font-semibold text-gold-bright underline-offset-4 hover:underline"
              >
                Create an operator
              </Link>
            </>
          ) : (
            <>
              Already registered?{" "}
              <Link
                href="/login"
                className="font-semibold text-gold-bright underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  invalid = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  invalid?: boolean;
}) {
  const id = `auth-${label.toLowerCase().replaceAll(" ", "-")}`;
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="font-display text-[0.625rem] font-semibold tracking-[0.2em] text-subtle uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-11 rounded-control border bg-background-deep/70 px-3.5 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-subtle/70 focus:border-line-gold focus:shadow-glow",
          invalid ? "border-danger/60" : "border-line",
        )}
      />
    </div>
  );
}
