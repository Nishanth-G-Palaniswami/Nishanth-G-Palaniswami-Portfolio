import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const root = fileURLToPath(new URL('.', import.meta.url))

// Site revision for the footer colophon. Refuses to build without git: a
// revision stamp that could silently go stale is worse than no stamp.
function gitRev() {
  let out
  try {
    out = execSync('git rev-parse HEAD', { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
  } catch (err) {
    throw new Error('build: git rev-parse failed, refusing to build without a revision. ' + err.message)
  }
  if (!/^[0-9a-f]{40}$/.test(out)) throw new Error('build: unexpected git output: ' + JSON.stringify(out))
  if (process.env.COMMIT_REF && process.env.COMMIT_REF !== out) {
    throw new Error('build: checkout ' + out + ' does not match COMMIT_REF ' + process.env.COMMIT_REF)
  }
  return out
}

const sha = gitRev()

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_SHA__: JSON.stringify(sha),
    __BUILD_REV__: JSON.stringify(sha.slice(0, 7)),
    // UTC date of the build, not the commit, so a redeploy shows when it ran.
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
})
