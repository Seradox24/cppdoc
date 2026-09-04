const cppTokenPattern =
  /(\/\/.*|#include|<iostream>|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:void|bool|int|float|double|char|std::string)\b|\b(?:return|true|false)\b|\b\d+(?:\.\d+)?f?\b|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*\()|\b[A-Za-z_][A-Za-z0-9_]*(?=\s*(?:=|;|,)))/g;

function highlightCpp(line: string) {
  return line.split(cppTokenPattern).map((token, index) => {
    let className = 'cpp-token-plain';
    if (token.startsWith('//')) className = 'cpp-token-comment';
    else if (/^(void|bool|int|float|double|char|std::string)$/.test(token))
      className = 'cpp-token-type';
    else if (/^(return|#include)$/.test(token)) className = 'cpp-token-keyword';
    else if (/^(true|false|\d|"|')/.test(token)) className = 'cpp-token-value';
    else if (/^[A-Za-z_]/.test(token)) className = 'cpp-token-name';

    return (
      <span className={className} key={`${token}-${index}`}>
        {token}
      </span>
    );
  });
}

export function CppCodeEditor({
  filename,
  lines,
  activeLine,
  ariaLabel,
}: {
  filename: string;
  lines: readonly string[];
  activeLine?: number;
  ariaLabel?: string;
}) {
  return (
    <div className="cpp-editor">
      <div className="cpp-editor-bar">
        <span className="cpp-editor-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <code>{filename}</code>
      </div>
      <ol aria-label={ariaLabel ?? `Código de ${filename}`}>
        {lines.map((line, index) => (
          <li
            className={activeLine === index + 1 ? 'is-active' : ''}
            key={`${line}-${index}`}
          >
            <span className="cpp-line-number" aria-hidden="true">
              {index + 1}
            </span>
            <code>{line ? highlightCpp(line) : '\u00a0'}</code>
          </li>
        ))}
      </ol>
    </div>
  );
}
