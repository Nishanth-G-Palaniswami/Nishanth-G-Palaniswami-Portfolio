// The InterVoiceAI interview gates, ported from src/my_agent.py
// (github.com/Nishanth-G-Palaniswami/InterVoiceAI). The decisions and the strings
// each tool returns to the model are the agent's own; only the Python is now JS.
// Every function is pure: it takes a call state and returns the next state plus
// the tool result the model would read.

export const AGENT_SOURCE =
  "https://github.com/Nishanth-G-Palaniswami/InterVoiceAI/blob/main/src/my_agent.py";

const FOLLOW_UP =
  "Not recorded yet. Ask one short follow-up about a specific detail the candidate " +
  "just mentioned (a name, a number, what they personally did), wait for the " +
  "answer, then call record_answer again with the same question_id.";

// Python's repr() of a str, enough for question ids.
const pyRepr = (s) =>
  s.includes("'") && !s.includes('"') ? `"${s}"` : `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

const planAnswers = (plan) =>
  plan.map((question) => ({ question, followUpRequested: false, recorded: false, qualityHint: "" }));

/** An unknown caller: no application and no plan until claim_by_name finds one. */
export const startCall = () => ({
  answers: [],
  userMessages: 0,
  identityBaseline: 0,
  identityConfirmed: null,
  outcome: null,
});

/**
 * claim_by_name when the name matches an application that already has a plan. The
 * identity check then counts only candidate turns after this point.
 */
export const claimByName = (state, candidate, plan) => ({
  state: { ...state, answers: planAnswers(plan), identityBaseline: state.userMessages },
  refused: false,
  result:
    `Found ${candidate.name}, applying for ${candidate.role}. Ask them to confirm that is ` +
    "them, wait for the answer, then call confirm_identity.",
});

/** A candidate turn landed in the session history. */
export const candidateSpoke = (state) => ({ ...state, userMessages: state.userMessages + 1 });

const cloneAnswers = (state) => state.answers.map((a) => ({ ...a }));

export const confirmIdentity = (state, confirmed) => {
  if (state.userMessages <= state.identityBaseline) {
    return {
      state,
      refused: true,
      result:
        "Not yet: the candidate has not answered the identity check. Ask them to " +
        "confirm, wait for the answer, then call confirm_identity.",
    };
  }
  const next = { ...state, identityConfirmed: confirmed };
  if (!confirmed || state.answers.length === 0) {
    return { state: next, refused: false, result: "Ask for the full name they applied with, then call claim_by_name." };
  }
  const first = state.answers[0].question;
  return { state: next, refused: false, result: `Identity confirmed. Ask ${first.id} exactly as written: ${first.text}` };
};

export const recordAnswer = (state, questionId, qualityHint) => {
  const answers = cloneAnswers(state);
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

/**
 * Plays one script step against the gate. Candidate turns only advance the
 * history; tool steps return the result the model would have read.
 */
export const applyStep = (state, step, { candidate, plan }) => {
  if (step.kind === "candidate") return { state: candidateSpoke(state) };
  if (step.kind !== "tool") return { state };
  const { fn, args } = step;
  if (fn === "claim_by_name") return claimByName(state, candidate, plan);
  if (fn === "confirm_identity") return confirmIdentity(state, args.confirmed);
  if (fn === "record_answer") return recordAnswer(state, args.question_id, args.quality_hint);
  if (fn === "finish_interview") return finishInterview(state, args.candidate_wants_to_stop);
  throw new Error(`unknown tool ${fn}`);
};

export const finishInterview = (state, candidateWantsToStop) => {
  const pending = state.answers.filter((a) => !a.recorded);
  if (pending.length > 0 && !candidateWantsToStop) {
    const first = pending[0];
    const step = first.followUpRequested
      ? "ask its follow-up, then call record_answer again"
      : "ask it, then call record_answer";
    return {
      state,
      refused: true,
      result:
        `Not finished: ${first.question.id} is not recorded yet. ` +
        `${step[0].toUpperCase()}${step.slice(1)}: ${first.question.text} ` +
        "Call finish_interview with candidate_wants_to_stop=true only if the candidate asked to stop.",
    };
  }
  return {
    state: { ...state, outcome: pending.length ? "stopped" : "completed" },
    refused: false,
    result: "Saved. Thank the candidate, say the recruiting team will follow up within two days, then end the call.",
  };
};
