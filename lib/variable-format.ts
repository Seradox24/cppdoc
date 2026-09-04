export const formatTypes = [
  { id: 'bool', label: 'bool', concept: 'Has Enough Money', literal: 'false' },
  { id: 'int', label: 'int', concept: 'Coins Collected', literal: '12' },
  { id: 'float', label: 'float', concept: 'Total Cost', literal: '4.5f' },
  {
    id: 'double',
    label: 'double',
    concept: 'Precise Distance',
    literal: '12.75',
  },
  { id: 'char', label: 'char', concept: 'Menu Option', literal: "'A'" },
  {
    id: 'string',
    label: 'std::string',
    concept: 'Player Name',
    literal: '"Ada"',
  },
] as const;

export type FormatType = (typeof formatTypes)[number]['id'];
export type NamingStyle = 'general' | 'unreal';

const cppKeywords = new Set([
  'alignas',
  'alignof',
  'and',
  'asm',
  'auto',
  'bool',
  'break',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'constexpr',
  'continue',
  'default',
  'delete',
  'do',
  'double',
  'else',
  'enum',
  'explicit',
  'export',
  'extern',
  'false',
  'float',
  'for',
  'friend',
  'goto',
  'if',
  'inline',
  'int',
  'long',
  'namespace',
  'new',
  'noexcept',
  'not',
  'nullptr',
  'operator',
  'or',
  'private',
  'protected',
  'public',
  'register',
  'return',
  'short',
  'signed',
  'sizeof',
  'static',
  'struct',
  'switch',
  'template',
  'this',
  'throw',
  'true',
  'try',
  'typedef',
  'typename',
  'union',
  'unsigned',
  'using',
  'virtual',
  'void',
  'volatile',
  'while',
]);

function words(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function pascalCase(value: string) {
  return words(value)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

export function suggestVariableName(
  concept: string,
  type: FormatType,
  style: NamingStyle,
) {
  const pascal = pascalCase(concept) || 'Value';
  if (style === 'unreal') {
    if (type === 'bool') {
      const withoutPrefix = /^B[A-Z]/.test(pascal) ? pascal.slice(1) : pascal;
      return `b${withoutPrefix}`;
    }
    return pascal;
  }
  return pascal[0].toLowerCase() + pascal.slice(1);
}

export function inspectVariableName(
  name: string,
  type: FormatType,
  style: NamingStyle,
) {
  const portable = /^[A-Za-z_][A-Za-z0-9_]*$/.test(name);
  const isKeyword = cppKeywords.has(name);
  const styleMatches =
    style === 'unreal'
      ? type === 'bool'
        ? /^b[A-Z][A-Za-z0-9]*$/.test(name)
        : /^[A-Z][A-Za-z0-9]*$/.test(name)
      : /^[a-z][A-Za-z0-9]*$/.test(name);
  return {
    portable,
    isKeyword,
    styleMatches,
    compiles: portable && !isKeyword,
  };
}

export function buildDeclaration({
  type,
  name,
  initialize,
}: {
  type: FormatType;
  name: string;
  initialize: boolean;
}) {
  const definition = formatTypes.find((item) => item.id === type)!;
  return `${definition.label} ${name}${initialize ? ` = ${definition.literal}` : ''};`;
}
