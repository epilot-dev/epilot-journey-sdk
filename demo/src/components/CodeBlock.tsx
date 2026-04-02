import { useMemo, useState } from 'react';

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: 'typescript' | 'javascript' | 'json' | 'bash';
}

interface Token {
  type: 'keyword' | 'string' | 'number' | 'comment' | 'property' | 'punctuation' | 'operator' | 'builtin' | 'plain';
  value: string;
}

const JS_KEYWORDS = new Set([
  'import', 'from', 'export', 'default', 'const', 'let', 'var', 'function',
  'return', 'if', 'else', 'for', 'while', 'do', 'switch', 'case', 'break',
  'continue', 'new', 'this', 'class', 'extends', 'async', 'await', 'try',
  'catch', 'throw', 'typeof', 'instanceof', 'in', 'of', 'true', 'false',
  'null', 'undefined', 'void', 'type', 'interface', 'enum', 'as',
]);

const BUILTIN = new Set([
  'console', 'Math', 'JSON', 'Array', 'Object', 'String', 'Number',
  'Boolean', 'Promise', 'Map', 'Set', 'Date', 'Error', 'RegExp',
]);

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const commentEnd = end === -1 ? code.length : end;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const commentEnd = end === -1 ? code.length : end + 2;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j++;
        j++;
      }
      tokens.push({ type: 'string', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }
    if (/\d/.test(code[i]) && (i === 0 || !/\w/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[\d._eE]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (JS_KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (BUILTIN.has(word)) {
        tokens.push({ type: 'builtin', value: word });
      } else if (code[j] === ':') {
        tokens.push({ type: 'property', value: word });
      } else {
        tokens.push({ type: 'plain', value: word });
      }
      i = j;
      continue;
    }
    if ('=<>!+-*/%&|^~?'.includes(code[i])) {
      let j = i;
      while (j < code.length && '=<>!+-*/%&|^~?'.includes(code[j])) j++;
      tokens.push({ type: 'operator', value: code.slice(i, j) });
      i = j;
      continue;
    }
    if ('{}[]();:.,'.includes(code[i])) {
      tokens.push({ type: 'punctuation', value: code[i] });
      i++;
      continue;
    }
    let j = i;
    while (j < code.length && !/[a-zA-Z_$\d"'`/=<>!+\-*%&|^~?{}[\]();:.,]/.test(code[j])) j++;
    tokens.push({ type: 'plain', value: code.slice(i, j || i + 1) });
    i = j || i + 1;
  }

  return tokens;
}

const tokenColors: Record<Token['type'], string> = {
  keyword: 'text-violet-400',
  string: 'text-emerald-400',
  number: 'text-amber-300',
  comment: 'text-gray-500 italic',
  property: 'text-sky-300',
  punctuation: 'text-gray-500',
  operator: 'text-pink-400',
  builtin: 'text-yellow-300',
  plain: 'text-gray-200',
};

export function CodeBlock({ code, title, language = 'typescript' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    if (language === 'bash') {
      return code.split('\n').map((line, i) => {
        if (line.trimStart().startsWith('#')) {
          return <div key={i}><span className="text-gray-500 italic">{line}</span></div>;
        }
        return <div key={i}>{line}</div>;
      });
    }
    const tokens = tokenize(code);
    return tokens.map((token, i) => (
      <span key={i} className={tokenColors[token.type]}>{token.value}</span>
    ));
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden" style={{
      border: '1px solid rgba(99, 102, 241, 0.1)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    }}>
      {title && (
        <div className="flex items-center justify-between px-4 py-2" style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16162a 100%)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <span className="text-[11px] text-gray-400 font-mono">{title}</span>
          </div>
          <div className="flex items-center gap-2">
            {language && <span className="text-gray-600 text-[10px] uppercase font-mono">{language}</span>}
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-gray-300 transition-colors text-[11px] font-mono px-2 py-0.5 rounded hover:bg-white/5"
            >
              {copied ? 'copied!' : 'copy'}
            </button>
          </div>
        </div>
      )}
      <pre className="p-3 sm:p-4 text-[11px] sm:text-[13px] overflow-x-auto font-mono leading-relaxed whitespace-pre" style={{
        background: 'linear-gradient(180deg, #0f0f1a 0%, #111122 100%)',
        color: '#e2e8f0',
      }}>
        {highlighted}
      </pre>
    </div>
  );
}
