// The Second Brain guardrails, ported from .claude/scripts/security/guardrails.py
// (github.com/Nishanth-G-Palaniswami/second-brain). Same patterns, same order,
// first match wins, case-insensitive. One edit: the source's em-dashes are written
// as colons here, per this site's copy rules.

export const GUARDRAILS_SOURCE =
  "https://github.com/Nishanth-G-Palaniswami/second-brain/blob/main/.claude/scripts/security/guardrails.py";

const B1 = "B1 never send emails/messages";
const B2 = "B2 never post to social media";
const B3 = "B3 never access financial data";
const B4 = "B4 never delete";
const B5 = "B5 never push/merge/deploy";

export const BASH_RULES = [
  [B1, String.raw`\busers\.messages\.send\b|\bgmail\.send\b`, "Gmail send is disallowed: use drafts only. (USER.md boundary 1)"],
  [B1, String.raw`/users/[^/\s]+/messages/send\b|%2Fusers%2F[^/\s%]+%2Fmessages%2Fsend\b`, "Gmail REST `users/<id>/messages/send` path is disallowed: use drafts only. (USER.md boundary 1)"],
  [B1, String.raw`\bchat\.postMessage\b|\bchat\.scheduleMessage\b|\bchat\.meMessage\b`, "Slack chat.postMessage is disallowed: draft only. (USER.md boundary 1)"],
  [B1, String.raw`api\.slack\.com/.*\bchat\.(post|schedule|me)`, "Direct Slack send endpoints are disallowed. (USER.md boundary 1)"],
  [B1, String.raw`\bquery\.py\s+gmail\s+send-draft\b`, "Creating a Gmail draft is the user's explicit approval step; the agent must not run `gmail send-draft`. (USER.md boundary 1)"],
  [B2, String.raw`(?:curl|wget|Invoke-RestMethod|Invoke-WebRequest|fetch|httpx|requests)\b.*(?:twitter\.com|x\.com|api\.twitter\.com|api\.x\.com|linkedin\.com|facebook\.com|instagram\.com|threads\.net|bsky\.app|mastodon\.social)`, "HTTP calls to social-media endpoints are disallowed. (USER.md boundary 2)"],
  [B3, String.raw`\b(?:api\.)?(?:stripe|paypal|plaid|checkout)\.com\b`, "Financial-service domains are disallowed without explicit session allowlist. (USER.md boundary 3)"],
  [B3, String.raw`/(?:charge|charges|payment(?:s|-intent)?|billing|invoices?|payouts?|transfers?)\b`, "Payment/billing paths are disallowed. (USER.md boundary 3)"],
  [B4, String.raw`(?:^|[\s;&|\`$(])rm\s+(?!$)`, "`rm` is disallowed: deletion requires the user. (USER.md boundary 4)"],
  [B4, String.raw`(?:^|[\s;&|\`$(])del\s+/[sq]`, "`del /s` / `del /q` is disallowed. (USER.md boundary 4)"],
  [B4, String.raw`\bRemove-Item\b|\bri\s+-force\b|\brd\s+/s\b|\brmdir\s+/s\b`, "Recursive/forced removals are disallowed. (USER.md boundary 4)"],
  [B4, String.raw`\bgit\s+branch\s+-D\b|\bgit\s+reset\s+--hard\b|\bgit\s+clean\s+-\w*f\w*\b`, "Destructive git operations are disallowed. (USER.md boundary 4)"],
  [B4, String.raw`\bDROP\s+(?:TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b|\bTRUNCATE\s+TABLE\b|\bDELETE\s+FROM\b`, "Destructive SQL is disallowed. (USER.md boundary 4)"],
  [B4, String.raw`\bmessages\.(?:trash|delete|batchDelete)\b|\bthreads\.(?:trash|delete)\b`, "Gmail trash/delete endpoints are disallowed. (USER.md boundary 4)"],
  [B4, String.raw`\bchat\.delete\b|\bfiles\.delete\b|\bconversations\.(?:archive|close)\b`, "Slack delete/archive endpoints are disallowed. (USER.md boundary 4)"],
  [B5, String.raw`\bgit\s+push\b`, "`git push` is disallowed: push manually after review. (USER.md boundary 5)"],
  [B5, String.raw`\bgh\s+(?:pr\s+merge|workflow\s+run|release\s+create|run\s+rerun)\b`, "`gh pr merge` / `gh workflow run` / `gh release create` are disallowed. (USER.md boundary 5)"],
  [B5, String.raw`\bvercel\s+(?:deploy|--prod|promote)\b|\brailway\s+(?:up|deploy)\b|\bsupabase\s+db\s+push\b|\bfly\s+deploy\b|\bnetlify\s+deploy\b|\brender\s+deploy\b`, "Deploy commands are disallowed. (USER.md boundary 5)"],
  [B5, String.raw`\bdocker\s+push\b|\bnpm\s+publish\b|\byarn\s+publish\b|\bpnpm\s+publish\b|\btwine\s+upload\b|\bcargo\s+publish\b`, "Package / image publish commands are disallowed. (USER.md boundary 5)"],
].map(([boundary, source, reason], index) => ({ index, boundary, source, reason, pattern: new RegExp(source, "i") }));

export const WRITE_DENY_PATH_PATTERNS = [String.raw`(?:^|[\\/])\.env$`, String.raw`[\\/]creds[\\/].*\.json$`].map(
  (source) => ({ source, pattern: new RegExp(source, "i") })
);

/** check_bash: the first rule whose pattern is found anywhere in the command, or null. */
export const checkBash = (command) => {
  if (!command) return null;
  const rule = BASH_RULES.find((r) => r.pattern.test(command));
  return rule ? { boundary: rule.boundary, reason: rule.reason, source: rule.source, rule: `BASH_RULES[${rule.index}]` } : null;
};

/** check_write: secrets and credential paths are never writable by the agent. */
export const checkWrite = (path) => {
  if (!path) return null;
  const hit = WRITE_DENY_PATH_PATTERNS.find((p) => p.pattern.test(path));
  return hit
    ? {
        boundary: "secrets",
        reason: `Writes to \`${path}\` are disallowed: this path holds secrets/credentials. Ask the user to edit it directly.`,
        source: hit.source,
        rule: "WRITE_DENY_PATH_PATTERNS",
      }
    : null;
};

/** check_tool_call: the hook's entry point. Null means the call runs. */
export const checkToolCall = (toolName, input) =>
  toolName === "Bash" ? checkBash(input) : ["Write", "Edit", "NotebookEdit"].includes(toolName) ? checkWrite(input) : null;
