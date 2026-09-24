// Lists every English string the app can show through t(), so the Hindi and Marathi
// word lists can be checked for gaps. No dependencies.
//   node scripts/extract-i18n.mjs            summary and gaps
//   node scripts/extract-i18n.mjs --json     all keys as JSON
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..', 'src')
const keys = new Map() // key -> first file
const dynamic = [] // t(expr) calls that need a human look

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : /\.tsx?$/.test(e.name) ? [p] : []
  })

const unescape = (s) => s.replace(/\\(['"`\\])/g, '$1').replace(/\\n/g, '\n').replace(/\\u([0-9a-fA-F]{4})/g, (_m, h) => String.fromCharCode(parseInt(h, 16)))
const add = (k, f) => keys.has(k) || keys.set(k, f)

const T_LIT = /(?<![\w.$])t\(\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\$])*)`)\s*[,)]/g
const T_ANY = /(?<![\w.$])t\(\s*([^\s)])/g
const PLURAL = /(?<![\w.$])plural\(\s*[^'"`]+?,\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)")(?:\s*,\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"))?\s*\)/g

for (const file of walk(root)) {
  const rel = path.relative(root, file)
  if (rel === 'lib/i18n.tsx' || rel.startsWith('i18n')) continue
  const text = fs.readFileSync(file, 'utf8')
  for (const m of text.matchAll(T_LIT)) add(unescape(m[1] ?? m[2] ?? m[3]), rel)
  for (const m of text.matchAll(T_ANY)) {
    if (!/['"`]/.test(m[1]) && !rel.endsWith('lib/format.ts')) {
      const line = text.slice(0, m.index).split('\n').length
      dynamic.push(`${rel}:${line}  ${text.slice(m.index, text.indexOf('\n', m.index)).trim()}`)
    }
  }
  for (const m of text.matchAll(PLURAL)) {
    const one = unescape(m[1] ?? m[2])
    const many = m[3] ?? m[4] ? unescape(m[3] ?? m[4]) : `${one}s`
    add(`{n} ${one}`, rel)
    add(`{n} ${many}`, rel)
  }
}

// Strings that are saved in English or kept in lists, then shown through t(variable).
// Add anything new of that kind here so it is checked too.
const extra = fs.readFileSync(path.join(root, 'i18n', 'extra-keys.txt'), 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
extra.forEach((k) => add(k, 'i18n/extra-keys.txt'))

const all = [...keys.keys()]
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ keys: all, files: Object.fromEntries(keys), dynamic }, null, 1))
} else {
  console.log(`${all.length} keys`)
  console.log(`\nt(variable) calls to double check (${dynamic.length}):`)
  dynamic.forEach((d) => console.log('  ' + d))
  for (const lang of ['hi', 'mr']) {
    const file = path.join(root, 'i18n', `${lang}.ts`)
    const src = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : ''
    const have = new Set([...src.matchAll(/^\s*(?:'((?:\\.|[^'\\])*)'|"((?:\\.|[^"\\])*)"|`((?:\\.|[^`\\])*)`)\s*:/gm)].map((m) => unescape(m[1] ?? m[2] ?? m[3])))
    const missing = all.filter((k) => !have.has(k))
    console.log(`\n${lang}: ${all.length - missing.length}/${all.length} translated${missing.length ? `, ${missing.length} missing` : ''}`)
    missing.slice(0, 15).forEach((k) => console.log('   - ' + k))
  }
}
