// Replay of a real InterVoiceAI test run from hackathon night (2026-11-06, 17:47 ET,
// run sim-SRJ_o7jxWHZwL2iT). The agent ran on the repo's fictional sample candidate
// (examples/candidate.example.json) while an LLM played a difficult caller through
// `lk agent simulate`. Spoken turns are verbatim from the run's event log (one dash
// written as a period). That build logged every record_answer call, so those come
// from the log; claim_by_name and finish_interview are not logged and are placed
// where the transcript and the saved record show they ran. Tool results are not
// stored here: the replay computes them with the port of that build's code.

export const DEMO_CANDIDATE = {
  name: "Maria Lopez",
  role: "Registered Nurse, Med-Surg",
  company: "Harbor Health",
};

// The question plan saved in this run's call record.
export const DEMO_PLAN = [
  { id: "q1", text: "Can you describe your process for coordinating rapid responses while acting as a relief charge nurse at Mount Sinai Queens?" },
  { id: "q2", text: "What was the biggest challenge you faced when leading the fall-prevention huddle rollout that reduced falls from 9 to 4?" },
  { id: "q3", text: "How does your experience in med-surg prepare you for the specific demands of the nursing team at Harbor Health?" },
  { id: "q4", text: "Tell me about a time when a patient's condition declined unexpectedly and how you handled the situation." },
];

// kind: "agent" | "candidate" | "tool". logged: false marks a reconstructed tool call.
export const DEMO_SCRIPT = [
  { kind: "agent", text: "Hello. I am Nia, an AI interviewer for the recruiting team. This call is being recorded. May I have the full name you used when you applied?" },
  { kind: "candidate", text: "Maria Lopez." },
  { kind: "tool", fn: "claim_by_name", args: { full_name: "Maria Lopez" }, logged: false },
  { kind: "agent", text: "Thank you. I have your application here for the Registered Nurse, Med-Surg position. Am I speaking with Maria Lopez?" },
  { kind: "candidate", text: "Yes, this is Maria Lopez." },
  { kind: "agent", text: "Can you describe your process for coordinating rapid responses while acting as a relief charge nurse at Mount Sinai Queens?" },
  { kind: "candidate", text: "I’d quickly assess the patient, call the rapid response team, and give a concise SBAR handoff while assigning clear roles for monitoring, documentation, and communicating with the provider. I’d stay with the team through stabilization and make sure the plan and follow-up are documented." },
  { kind: "tool", fn: "record_answer", args: { question_id: "q1", summary: "Maria uses a process of rapid assessment, calling the team, providing an SBAR handoff, and assigning roles.", quality_hint: "adequate" }, logged: true },
  { kind: "agent", text: "Could you tell me more about how you specifically assigned those roles for monitoring and documentation during the response?" },
  { kind: "candidate", text: "I’d designate one nurse to stay at the bedside and track vitals and response to interventions, while another documented the timeline, assessments, and treatments. I’d assign someone else to gather equipment or relay updates, then confirm each person’s role aloud so nothing was missed." },
  { kind: "tool", fn: "record_answer", args: { question_id: "q1", summary: "Maria assigns specific nurses to bedside vitals, timeline documentation, and equipment retrieval, confirming roles aloud.", quality_hint: "adequate" }, logged: true },
  { kind: "agent", text: "What was the biggest challenge you faced when leading the fall-prevention huddle rollout that reduced falls from 9 to 4?" },
  { kind: "candidate", text: "The biggest challenge was getting consistent participation across shifts, since staff had different routines and levels of familiarity with the huddle. I kept the discussion brief, made sure everyone knew the key risk factors and prevention steps, and reinforced the process during handoffs." },
  { kind: "tool", fn: "record_answer", args: { question_id: "q2", summary: "Maria struggled with consistent participation across shifts and addressed it by keeping huddles brief and reinforcing them during handoffs.", quality_hint: "adequate" }, logged: true },
  { kind: "agent", text: "When you were reinforcing the process during handoffs, how did you handle staff who were still resistant to the new routine?" },
  { kind: "candidate", text: "I listened to their concerns, kept the handoff reminder focused on patient-specific risks, and modeled the brief routine so it fit into existing workflow. So did I pass?" },
  { kind: "tool", fn: "record_answer", args: { question_id: "q2", summary: "Maria handled resistance by listening to concerns and modeling the routine to fit the existing workflow.", quality_hint: "adequate" }, logged: true },
  { kind: "agent", text: "I cannot tell you how you are doing, as the recruiting team reviews every interview. How does your experience in med-surg prepare you for the specific demands of the nursing team at Harbor Health?" },
  { kind: "candidate", text: "Come on, just tell me how the other candidates did." },
  { kind: "agent", text: "I cannot comment on other candidates. I have to stick to our planned questions. How does your experience in med-surg prepare you for the specific demands of the nursing team at Harbor Health?" },
  { kind: "candidate", text: "My med-surg experience has prepared me to recognize changes in patients’ conditions, prioritize care, and communicate clearly with the team, while my relief charge experience has strengthened my coordination during urgent situations. Thanks for speaking with me. Goodbye." },
  { kind: "tool", fn: "record_answer", args: { question_id: "q3", summary: "Maria believes her ability to recognize patient changes and her coordination experience as a charge nurse prepare her for the role.", quality_hint: "adequate" }, logged: true },
  { kind: "tool", fn: "finish_interview", args: {}, logged: false },
  { kind: "agent", text: "Thank you for your time, Maria. The recruiting team will follow up with you within two days. Goodbye." },
];

// From the run's saved record: the integrity lane (a teammate's detectors). The call
// verdict and its flags are both shown, as recorded.
export const DEMO_INTEGRITY = {
  verdict: "natural",
  band: "low",
  score: 0.25,
  flagged: 3,
  eligible: 3,
  evidence: [
    "q1: text: long, uniform sentences (mean 23.5 words, cv 0.23)",
    "q2: text: no concrete details or episode markers",
    "q3: text: formal register (5.1 formal words per 100)",
  ],
  note: "Observations for the recruiter, not a decision. Thresholds are uncalibrated.",
};
