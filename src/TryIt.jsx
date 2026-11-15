import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw, SkipForward } from "lucide-react";

import { AGENT_SOURCE, applyStep, startCall } from "./demos/interviewGate";
import { DEMO_CANDIDATE, DEMO_INTEGRITY, DEMO_PLAN, DEMO_SCRIPT } from "./demos/demoCall";
import { GUARDRAILS_SOURCE, checkToolCall } from "./demos/guardrails";

// Panels are dark consoles in both themes, so they carry their own focus ring.
const ring =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(247_148_94)] focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const PanelHead = ({ title, file, href }) => (
  <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-2.5">
    <div className="flex items-center gap-2 min-w-0">
      <span aria-hidden="true" className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-700" />
      </span>
      <span className="ml-2 truncate font-mono text-xs text-slate-300">{title}</span>
    </div>
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex shrink-0 items-center gap-1 min-h-[44px] md:min-h-0 font-mono text-xs text-slate-400 hover:text-[rgb(247_148_94)] rounded ${ring}`}
    >
      {file} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  </div>
);

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

// Roughly reading speed: about a minute for the whole call.
const stepDelay = (step) =>
  step.kind === "tool" ? 1000 : Math.min(2600, 700 + 14 * step.text.length);

const chipClass = (a) =>
  a.recorded
    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
    : a.followUpRequested
      ? "border-amber-400/50 bg-amber-400/10 text-amber-200"
      : "border-slate-700 text-slate-400";

const chipLabel = (a) => (a.recorded ? "recorded" : a.followUpRequested ? "follow-up asked" : "open");

const CallReplay = () => {
  const frames = useMemo(buildFrames, []);
  const [shown, setShown] = useState(1);
  const [playing, setPlaying] = useState(false);
  const logRef = useRef(null);
  const done = shown >= frames.length;
  const current = frames[shown - 1].state;

  useEffect(() => {
    if (!playing || done) {
      if (done) setPlaying(false);
      return undefined;
    }
    const t = setTimeout(() => setShown((n) => n + 1), stepDelay(frames[shown].step));
    return () => clearTimeout(t);
  }, [playing, shown, done, frames]);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [shown]);

  const restart = () => {
    setShown(1);
    setPlaying(true);
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      <PanelHead title="InterVoiceAI · phone screen replay" file="my_agent.py" href={AGENT_SOURCE} />

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3 font-mono text-[11px]">
        <span className="text-slate-500">plan</span>
        {current.answers.length === 0 ? (
          <span className="text-slate-500">no application matched yet</span>
        ) : (
          current.answers.map((a) => (
            <span key={a.question.id} className={`rounded border px-2 py-0.5 ${chipClass(a)}`} title={a.question.text}>
              {a.question.id} · {chipLabel(a)}
            </span>
          ))
        )}
        {current.identityConfirmed && <span className="rounded border border-emerald-500/40 px-2 py-0.5 text-emerald-300">identity ok</span>}
      </div>

      <ol ref={logRef} aria-live="polite" className="h-[22rem] md:h-[26rem] overflow-y-auto px-4 py-4 space-y-3 text-sm">
        {frames.slice(0, shown).map(({ step, result, refused }, i) =>
          step.kind === "tool" ? (
            <li key={i} className="font-mono text-xs leading-relaxed [overflow-wrap:anywhere]">
              <div className="text-slate-400">
                <span aria-hidden="true">→ </span>
                {step.fn}({fmtArgs(step.args)})
                {!step.logged && <span className="ml-2 text-slate-600">[not in log]</span>}
              </div>
              <div className={refused ? "text-amber-200" : "text-emerald-300"}>
                <span aria-hidden="true">← </span>
                {result}
              </div>
            </li>
          ) : (
            <li key={i} className="grid grid-cols-[4rem_minmax(0,1fr)] md:grid-cols-[4.5rem_minmax(0,1fr)] gap-2">
              <span className={`font-mono text-[11px] uppercase tracking-[0.18em] pt-0.5 ${step.kind === "agent" ? "text-[rgb(247_148_94)]" : "text-slate-500"}`}>
                {step.kind === "agent" ? "Nia" : "Caller"}
              </span>
              <span className={step.kind === "agent" ? "text-slate-100" : "text-slate-300"}>{step.text}</span>
            </li>
          )
        )}
        {done && (
          <li className="mt-2 rounded-lg border border-slate-800 bg-slate-900/60 p-3 font-mono text-xs leading-relaxed">
            <div className="text-slate-300">
              saved record · outcome <span className="text-slate-100">{current.outcome}</span> ·{" "}
              {current.answers.filter((a) => a.recorded).length} of {current.answers.length} answers recorded
            </div>
            <div className="mt-2 text-slate-400">
              integrity lane (a teammate&rsquo;s detectors): flagged {DEMO_INTEGRITY.flagged} of {DEMO_INTEGRITY.eligible} scored
              answers. The caller was an LLM.
            </div>
            <ul className="mt-1 text-slate-500">
              {DEMO_INTEGRITY.evidence.map((e) => (
                <li key={e}>· {e}</li>
              ))}
            </ul>
            <div className="mt-1 text-slate-500">{DEMO_INTEGRITY.note}</div>
          </li>
        )}
      </ol>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-800 px-4 py-3">
        <button
          type="button"
          onClick={() => (done ? restart() : setPlaying((p) => !p))}
          className={`inline-flex items-center gap-2 rounded-md bg-[rgb(247_148_94)] px-3 h-11 md:h-9 text-sm font-medium text-slate-950 hover:opacity-90 ${ring}`}
        >
          {playing ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
          {done ? "Replay" : playing ? "Pause" : shown === 1 ? "Play the call" : "Resume"}
        </button>
        <button
          type="button"
          onClick={() => setShown((n) => Math.min(frames.length, n + 1))}
          disabled={done}
          className={`inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 h-11 md:h-9 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-40 ${ring}`}
        >
          <SkipForward className="h-4 w-4" aria-hidden="true" /> Step
        </button>
        <button
          type="button"
          onClick={() => {
            setPlaying(false);
            setShown(1);
          }}
          className={`inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-3 h-11 md:h-9 text-sm text-slate-300 hover:border-slate-500 ${ring}`}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" /> Reset
        </button>
        <span className="ml-auto font-mono text-[11px] tabular-nums text-slate-500">
          {shown}/{frames.length}
        </span>
      </div>
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

const GuardrailConsole = () => {
  const [tool, setTool] = useState("Bash");
  // Opens on one real result so the console is never an empty box.
  const [text, setText] = useState(SAMPLES.Bash[0]);
  const [ran, setRan] = useState(() => ({ tool: "Bash", input: SAMPLES.Bash[0], hit: checkToolCall("Bash", SAMPLES.Bash[0]) }));

  const run = (value, toolName = tool) => {
    setText(value);
    setRan(value.trim() ? { tool: toolName, input: value.trim(), hit: checkToolCall(toolName, value.trim()) } : null);
  };

  return (
    <div className="flex flex-col rounded-xl border border-slate-800 bg-slate-950 text-slate-200 overflow-hidden">
      <PanelHead title="Second Brain · pre-tool guardrails" file="guardrails.py" href={GUARDRAILS_SOURCE} />

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
              className="h-11 md:h-10 min-w-0 flex-1 bg-transparent font-mono text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
          <button type="submit" className={`rounded-md bg-slate-100 px-3 h-11 md:h-10 text-sm font-medium text-slate-950 hover:opacity-90 ${ring}`}>
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
              {s.length > 44 ? `${s.slice(0, 41)}...` : s}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite" className="mx-4 mt-4 min-h-[9.5rem] flex-1 rounded-lg border border-slate-800 bg-black/30 p-3 font-mono text-xs leading-relaxed [overflow-wrap:anywhere]">
        {ran ? (
          <>
            <div className="text-slate-500">$ guardrails.py {JSON.stringify(ran.input)}{ran.tool === "Bash" ? "" : ` ${ran.tool}`}</div>
            {ran.hit ? (
              <>
                <div className="text-rose-300">
                  DENY{"   "}tool={ran.tool}{"  "}cmd={ran.input}
                </div>
                <div className="text-slate-200">{"       "}reason: {ran.hit.reason}</div>
                <div className="mt-2 text-slate-500">rule:{"  "}{ran.hit.rule}</div>
                <div className="text-slate-500">match: <span className="text-slate-400">{ran.hit.source}</span></div>
              </>
            ) : (
              <>
                <div className="text-emerald-300">
                  ALLOW{"  "}tool={ran.tool}{"  "}cmd={ran.input}
                </div>
                <div className="mt-2 text-slate-500">No deny rule matched, so the hook lets the call run.</div>
              </>
            )}
          </>
        ) : (
          <div className="text-slate-500">Pick a sample or type a command. The output is the script&rsquo;s own CLI format.</div>
        )}
      </div>

      <p className="px-4 py-3 text-xs leading-relaxed text-slate-500">
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
        Two systems I built, running in your browser. The call is a real test run from the hackathon: my agent
        interviewing the repo&rsquo;s fictional sample nurse while an LLM played a difficult caller. Every tool result is
        computed live by the agent&rsquo;s gate logic, ported from the source.
      </p>
      {/* min-w-0 everywhere: long tool calls and URLs must wrap, never widen the column */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
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
