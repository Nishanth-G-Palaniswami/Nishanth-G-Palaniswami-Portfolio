// The InterVoiceAI interview tools, ported from src/my_agent.py as it stood when the
// replayed run happened: commit c4601cd (2026-11-06 22:43 UTC) on the demo branch of
// github.com/Nishanth-G-Palaniswami/InterVoiceAI. The decisions and the strings each
// tool returns to the model are the agent's own; only the Python is now JS. Later
// commits added confirm_identity and made finish_interview refuse while answers are
// pending; neither existed in this run, so neither is here.
// Every function is pure: it takes a call state and returns the next state plus the
// tool result the model would read.

export const AGENT_SOURCE =
  "https://github.com/Nishanth-G-Palaniswami/InterVoiceAI/blob/c4601cd21077a31e5f5ea0ebc8e10665b89b5551/src/my_agent.py";

const FOLLOW_UP =
  "Not recorded yet. Ask one short follow-up about a specific detail the candidate " +
  "just mentioned (a name, a number, what they personally did), wait for the " +
  "answer, then call record_answer again with the same question_id.";

// Python's repr() of a str, enough for question ids.
const pyRepr = (s) =>
  s.includes("'") && !s.includes('"') ? `"${s}"` : `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

/** An unknown caller: no application and no plan until claim_by_name finds one. */
export const startCall = () => ({ answers: [], outcome: null });

/** claim_by_name when the name matches an application that already has a plan. */
export const claimByName = (state, candidate, plan) => {
  const first = plan[0];
  return {
    state: {
      ...state,
      answers: plan.map((question) => ({ question, followUpRequested: false, recorded: false, qualityHint: "" })),
    },
    refused: false,
    result:
      `Found ${candidate.name}, applying for ${candidate.role}. Confirm that is them, ` +
      `then ask ${first.id} exactly as written: ${first.text}`,
  };
};

export const recordAnswer = (state, questionId, qualityHint) => {
  const answers = state.answers.map((a) => ({ ...a }));
  const index = answers.findIndex((a) => a.question.id === questionId);
  if (index < 0) {
    return {
      state,
      refused: true,
      result: `Unknown question_id ${pyRepr(questionId)}. Valid ids: ${answers.map((a) => a.question.id).join(", ")}.`,
    };
  }
  const answer = answers[index];
  if (!answer.followUpRequested && qualityHint !== "no_answer") {
    answer.followUpRequested = true;
    return { state: { ...state, answers }, refused: true, result: FOLLOW_UP };
  }
  answer.recorded = true;
  answer.qualityHint = qualityHint;
  const following = answers[index + 1];
  return {
    state: { ...state, answers },
    refused: false,
    result: following
      ? `Recorded ${questionId}. Now ask ${following.question.id} exactly as written: ${following.question.text}`
      : "Recorded. All planned questions are done: call finish_interview now.",
  };
};

/** finish_interview in this build: always saves, "completed" only if every answer is recorded. */
export const finishInterview = (state) => ({
  state: { ...state, outcome: state.answers.every((a) => a.recorded) ? "completed" : "stopped" },
  refused: false,
  result: "Saved. Thank the candidate, say the recruiting team will follow up within two days, then end the call.",
});

/** Plays one script step. Spoken turns change nothing; tool steps return their result. */
export const applyStep = (state, step, { candidate, plan }) => {
  if (step.kind !== "tool") return { state };
  if (step.fn === "claim_by_name") return claimByName(state, candidate, plan);
  if (step.fn === "record_answer") return recordAnswer(state, step.args.question_id, step.args.quality_hint);
  if (step.fn === "finish_interview") return finishInterview(state);
  throw new Error(`unknown tool ${step.fn}`);
};
