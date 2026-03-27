import { useMemo } from 'react';

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
  keyword: 'text-purple-400',
  string: 'text-green-400',
  number: 'text-orange-300',
  comment: 'text-gray-500 italic',
  property: 'text-sky-300',
  punctuation: 'text-gray-400',
  operator: 'text-pink-400',
  builtin: 'text-yellow-300',
  plain: 'text-gray-100',
};

export function CodeBlock({ code, title, language = 'typescript' }: CodeBlockProps) {
  const highlighted = useMemo(() => {
    if (language === 'bash') {
      return code.split('\n').map((line, i) => {
        if (line.trimStart().startsWith('#')) {
          return <div key={i}><span className="text-gray-500 italic">{line}</span></div>;
        }
        return <div key={i}>{line}</div>;
      });
    }
    if (language === 'json') {
      const tokens = tokenize(code);
      return tokens.map((token, i) => (
        <span key={i} className={tokenColors[token.type]}>{token.value}</span>
      ));
    }
    const tokens = tokenize(code);
    return tokens.map((token, i) => (
      <span key={i} className={tokenColors[token.type]}>{token.value}</span>
    ));
  }, [code, language]);

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200">
      {title && (
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex items-center justify-between">
          <span>{title}</span>
          {language && <span className="text-gray-500 text-[10px] uppercase">{language}</span>}
        </div>
      )}
      <pre className="bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto font-mono leading-relaxed whitespace-pre">
        {highlighted}
      </pre>
    </div>
  );
}
