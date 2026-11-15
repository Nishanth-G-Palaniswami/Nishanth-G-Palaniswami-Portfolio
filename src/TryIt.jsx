import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, SkipForward } from "lucide-react";

import { AGENT_SOURCE, applyStep, startCall } from "./demos/interviewGate";
import { DEMO_CANDIDATE, DEMO_INTEGRITY, DEMO_PLAN, DEMO_SCRIPT } from "./demos/demoCall";
import { GUARDRAILS_SOURCE, checkToolCall } from "./demos/guardrails";

// Panels are dark consoles in both themes, so they carry their own focus ring.
const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(247_148_94)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

// New lines settle in; the keyframe lives in index.css.
const lineIn = "motion-safe:animate-[line-in_200ms_cubic-bezier(0.22,1,0.36,1)_both]";

// Secondary actions; each use sets its own height and text color.
const outlineBtn = `inline-flex items-center justify-center gap-1.5 rounded-md border border-slate-700 px-3 text-sm hover:border-slate-500 hover:text-slate-100 disabled:opacity-40 disabled:hover:border-slate-700 ${ring}`;

// Short SHA when the source link is pinned to a commit.
const commitOf = (url) => url.match(/\/blob\/([0-9a-f]{7})[0-9a-f]{33}\//)?.[1] ?? null;

const StatusDot = ({ tone, pulse = false }) => (
  <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
    {pulse && <span className="absolute inline-flex h-full w-full rounded-full bg-[rgb(247_148_94)] opacity-60 motion-safe:animate-ping" />}
    <span className={`relative inline-flex h-2 w-2 rounded-full ${tone}`} />
  </span>
);

// The header carries state, not window chrome: status, name, progress, source.
const PanelHead = ({ dot, title, meta, file, href }) => {
  const sha = commitOf(href);
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        {dot}
        <span className="truncate font-mono text-xs text-slate-200">{title}</span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {meta}
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className={`inline-flex items-center gap-1 min-h-[44px] md:min-h-0 font-mono text-xs text-slate-300 hover:text-[rgb(247_148_94)] rounded ${ring}`}
        >
          {file}
          {sha && <span className="hidden sm:inline text-slate-400">@{sha}</span>}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};

const fmtArgs = (args) =>
  Object.entries(args)
    .filter(([k]) => k !== "summary")
    .map(([k, v]) => `${k}=${typeof v === "string" ? `"${v}"` : String(v)}`)
    .join(", ");

// -------------------- InterVoiceAI call replay -------------------- //

// Precompute every frame once: the gate runs on the logged tool calls in order.
const buildFrames = () => {
  const ctx = { candidate: DEMO_CANDIDATE, plan: DEMO_PLAN };
  let state = startCall();
  return DEMO_SCRIPT.map((step) => {
    const out = applyStep(state, step, ctx);
    state = out.state;
    return { step, state, result: out.result, refused: out.refused };
  });
};

// How long the line on screen stays before the next one. Skim pace until the
// first refusal (about four seconds in), reading pace after it, and a held beat
// on every refusal so it registers.
const holdFor = ({ step, refused }, lead) => {
  if (step.kind === "tool") return refused ? 2000 : lead ? 450 : 900;
  return lead ? Math.min(1100, 200 + 4 * step.text.length) : Math.min(4000, 600 + 11 * step.text.length);
};

const chipClass = (a) =>
  a.recorded
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
    : a.followUpRequested
      ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
      : "border-slate-700 text-slate-400";

const chipLabel = (a) => (a.recorded ? "recorded" : a.followUpRequested ? "follow-up asked" : "open");

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const ToolLine = ({ step, result, refused }) => {
  const gate = step.fn === "record_answer";
  const edge = gate ? `border-l-2 pl-3 ${refused ? "border-amber-400/70" : "border-emerald-500/60"}` : "";
  return (
    <li className={`font-mono text-xs leading-relaxed [overflow-wrap:anywhere] ${edge} ${lineIn}`}>
      <div className="text-slate-400">
        <span aria-hidden="true">→ </span>
        {step.fn}({fmtArgs(step.args)})
        {!step.logged && (
          <span className="ml-2 whitespace-nowrap rounded border border-slate-700 px-1.5 text-[10px] text-slate-400">not in log</span>
        )}
      </div>
      {gate ? (
        <div className="mt-1">
          <span
            className={`mr-2 inline-block rounded px-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
              refused ? "bg-amber-400/15 text-amber-300" : "bg-emerald-500/15 text-emerald-300"
            }`}
          >
            gate: {refused ? "refused" : "recorded"}
          </span>
          <span className={refused ? "text-amber-100/80" : "text-emerald-200/80"}>{result}</span>
        </div>
      ) : (
        <div className="text-emerald-300">
          <span aria-hidden="true">← </span>
          {result}
        </div>
      )}
    </li>
  );
};

const CallReplay = () => {
  const frames = useMemo(buildFrames, []);
  const [shown, setShown] = useState(1);
  const [playing, setPlaying] = useState(false);
  const firstRefusal = useMemo(() => frames.findIndex((f) => f.refused), [frames]);
  const logRef = useRef(null);
  const done = shown >= frames.length;
  const current = frames[shown - 1].state;

  useEffect(() => {
    if (!playing || done) {
      if (done) setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setShown((n) => n + 1), holdFor(frames[shown - 1], shown - 1 < firstRefusal));
    return () => clearTimeout(t);
  }, [playing, shown, done, frames, firstRefusal]);

  // The log grows with the call up to its cap, then scrolls inside the panel,
  // so the controls stay on screen with it. Keep its end in view.
  useEffect(() => {
    const el = logRef.current;
    if (el && shown > 1) el.scrollTo({ top: el.scrollHeight, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [shown]);

  const restart = () => {
    setShown(1);
    setPlaying(true);
  };

  const dot = playing ? (
    <StatusDot tone="bg-[rgb(247_148_94)]" pulse />
  ) : done ? (
    <StatusDot tone="bg-emerald-400" />
  ) : (
    <StatusDot tone="bg-slate-500" />
  );

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      <PanelHead
        dot={dot}
        title={
          <>
            InterVoiceAI<span className="hidden sm:inline text-slate-400"> · phone screen replay</span>
          </>
        }
        meta={
          <span className="font-mono text-[11px] tabular-nums text-slate-400">
            {String(shown).padStart(2, "0")}/{frames.length}
          </span>
        }
        file="my_agent.py"
        href={AGENT_SOURCE}
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={() => (done ? restart() : setPlaying((p) => !p))}
          className={`inline-flex items-center gap-2 rounded-md bg-[rgb(247_148_94)] px-3 h-11 md:h-9 text-sm font-medium text-slate-950 hover:opacity-90 motion-safe:transition-transform motion-safe:duration-100 active:scale-[0.97] ${ring}`}
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {done ? "Replay" : playing ? "Pause" : shown === 1 ? "Play the call" : "Resume"}
        </button>
        <button type="button" onClick={() => setShown((n) => Math.min(frames.length, n + 1))} disabled={done} className={`${outlineBtn} h-11 md:h-9 text-slate-300`}>
          <SkipForward className="h-4 w-4" aria-hidden="true" /> Step
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setShown(1);
          }}
          className={`${outlineBtn} h-11 md:h-9 text-slate-300`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-2.5 font-mono text-[11px]">
        <span className="text-slate-400">plan</span>
        {current.answers.length === 0 ? (
          <span className="text-slate-400">no application matched yet</span>
        ) : (
          current.answers.map((a) => (
            <span key={a.question.id} className={`rounded border px-2 py-0.5 ${chipClass(a)}`} title={a.question.text}>
              {a.question.id} · {chipLabel(a)}
            </span>
          ))
        )}
      </div>

      <ol ref={logRef} aria-live="polite" className="max-h-[55vh] overflow-y-auto px-4 py-4 space-y-3 text-sm lg:max-h-[26rem]">
        {frames.slice(0, shown).map(({ step, result, refused }, i) =>
          step.kind === "tool" ? (
            <ToolLine key={i} step={step} result={result} refused={refused} />
          ) : (
            <li key={i} className={`grid grid-cols-[4rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,1fr)] gap-2 ${lineIn}`}>
              <span className={`font-mono text-[11px] uppercase tracking-[0.18em] pt-0.5 ${step.kind === "agent" ? "text-[rgb(247_148_94)]" : "text-slate-400"}`}>
                {step.kind === "agent" ? "Nia" : "Caller"}
              </span>
              <span className={step.kind === "agent" ? "text-slate-100" : "text-slate-300"}>{step.text}</span>
            </li>
          )
        )}
        {done && (
          <li className={`mt-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs leading-relaxed ${lineIn}`}>
            <div className="text-slate-200">
              saved record · outcome <span className="text-slate-50">{current.outcome}</span> ·{" "}
              {current.answers.filter((a) => a.recorded).length} of {current.answers.length} answers recorded
            </div>
            <div className="mt-2 text-slate-300">
              integrity lane (a teammate&rsquo;s detectors): call verdict {DEMO_INTEGRITY.verdict} (score{" "}
              {DEMO_INTEGRITY.score}, {DEMO_INTEGRITY.band} band), with flags on {DEMO_INTEGRITY.flagged} of{" "}
              {DEMO_INTEGRITY.eligible} scored answers. The caller was an LLM.
            </div>
            <ul className="mt-1 text-slate-400">
              {DEMO_INTEGRITY.evidence.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
            <div className="mt-1 text-slate-400">{DEMO_INTEGRITY.note}</div>
          </li>
        )}
      </ol>
    </div>
  );
};

// -------------------- Second Brain guardrail console -------------------- //

const SAMPLES = {
  Bash: [
    "git push origin main",
    "rm -rf dist",
    "curl https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    "curl https://gmail.googleapis.com/gmail/v1%2Fusers%2Fme%2Fmessages%2Fsend",
    "curl https://api.stripe.com/v1/charges",
    "python query.py gmail list-unread",
  ],
  Write: [".env", "creds/gmail.json", "notes/today.md"],
};

// Cut long samples in the middle: the end of a URL is where two samples differ.
const middleTrim = (s, max = 44) => (s.length <= max ? s : `${s.slice(0, 18)}…${s.slice(-(max - 19))}`);

const GuardrailConsole = () => {
  const [tool, setTool] = useState("Bash");
  // Opens on one real result so the console is never an empty box.
  const [text, setText] = useState(SAMPLES.Bash[0]);
  const [ran, setRan] = useState(() => ({ tool: "Bash", input: SAMPLES.Bash[0], hit: checkToolCall("Bash", SAMPLES.Bash[0]) }));

  const run = (value, toolName = tool) => {
    setText(value);
    setRan(value.trim() ? { tool: toolName, input: value.trim(), hit: checkToolCall(toolName, value.trim()) } : null);
  };

  const dot = <StatusDot tone={ran ? (ran.hit ? "bg-rose-400" : "bg-emerald-400") : "bg-slate-500"} />;

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      <PanelHead
        dot={dot}
        title={
          <>
            {/* The file link beside it already says guardrails; the full name only where the column fits it. */}
            Second Brain<span className="hidden sm:inline lg:hidden xl:inline text-slate-400"> · pre-tool guardrails</span>
          </>
        }
        file="guardrails.py"
        href={GUARDRAILS_SOURCE}
      />

      <div className="px-4 pt-4">
        <div role="group" aria-label="Tool" className="inline-flex rounded-md border border-slate-700 p-0.5 font-mono text-xs">
          {["Bash", "Write"].map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={tool === t}
              onClick={() => {
                setTool(t);
                setRan(null);
                setText("");
              }}
              className={`rounded px-3 h-10 md:h-7 ${tool === t ? "bg-slate-800 text-slate-100" : "text-slate-400 hover:text-slate-200"} ${ring}`}
            >
              {t}
            </button>
          ))}
        </div>

        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            run(text);
          }}
        >
          <label htmlFor="guardrail-cmd" className="sr-only">
            {tool === "Bash" ? "Shell command" : "File path"}
          </label>
          <div className="flex min-w-0 flex-1 items-center rounded-md border border-slate-700 bg-slate-900 px-3 focus-within:border-slate-500">
            <span aria-hidden="true" className="mr-2 font-mono text-sm text-[rgb(247_148_94)]">
              {tool === "Bash" ? "$" : "›"}
            </span>
            <input
              id="guardrail-cmd"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={tool === "Bash" ? "a shell command the agent wants to run" : "a file the agent wants to write"}
              autoComplete="off"
              spellCheck="false"
              className="h-11 md:h-10 min-w-0 flex-1 bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <button type="submit" className={`${outlineBtn} h-11 md:h-10 text-slate-100`}>
            Run
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {SAMPLES[tool].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => run(s)}
              title={s}
              className={`max-w-full truncate rounded border border-slate-800 bg-slate-900 px-2 py-2 md:py-1 font-mono text-[11px] text-slate-400 hover:border-slate-600 hover:text-slate-200 ${ring}`}
            >
              {middleTrim(s)}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="mx-4 mt-4 min-h-[9.5rem] flex-1 rounded-lg border border-slate-800 bg-black/30 p-3 font-mono text-xs leading-relaxed [overflow-wrap:anywhere]">
        {ran ? (
          <>
            <div className="text-slate-400">$ guardrails.py {JSON.stringify(ran.input)}{ran.tool === "Bash" ? "" : ` ${ran.tool}`}</div>
            {ran.hit ? (
              <>
                <div className="text-rose-300">
                  DENY{"   "}tool={ran.tool}{"  "}cmd={ran.input}
                </div>
                <div className="text-slate-200">{"       "}reason: {ran.hit.reason}</div>
                <div className="mt-2 text-slate-400">rule:{"  "}{ran.hit.rule}</div>
                <div className="text-slate-400">match: <span className="text-slate-300">{ran.hit.source}</span></div>
              </>
            ) : (
              <>
                <div className="text-emerald-300">
                  ALLOW{"  "}tool={ran.tool}{"  "}cmd={ran.input}
                </div>
                <div className="mt-2 text-slate-400">No deny rule matched, so the hook lets the call run.</div>
              </>
            )}
          </>
        ) : (
          <div className="text-slate-400">Pick a sample or type a command. The output is the script&rsquo;s own CLI format.</div>
        )}
      </div>

      <p className="px-4 py-3 text-xs leading-relaxed text-slate-400">
        The 19 command rules and 2 path rules from the real PreToolUse hook, same order, first match wins; checked
        against the Python on 45 cases. They match commands and file paths, so plain English passes.
      </p>
    </div>
  );
};

// -------------------- the section body -------------------- //

export default function TryIt() {
  return (
    <>
      <p className="-mt-2 mb-8 max-w-3xl text-base md:text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        Two systems, running in your browser. On the left, a real test run from the voice agent hackathon, where my
        team of three built InterVoiceAI on the Take2 starter: the interviewer I wrote, questioning the repo&rsquo;s
        fictional sample nurse while an LLM played a difficult caller. Each tool result is computed by the
        agent&rsquo;s own logic, ported from the commit that ran. On the right, my Second Brain&rsquo;s guardrails.
      </p>
      {/* min-w-0 everywhere: long tool calls and URLs must wrap, never widen the column.
          items-start: the replay grows as it plays instead of opening as an empty box. */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 lg:items-start">
        <div className="min-w-0 lg:col-span-3">
          <CallReplay />
        </div>
        <div className="min-w-0 lg:col-span-2">
          <GuardrailConsole />
        </div>
      </div>
    </>
  );
}
