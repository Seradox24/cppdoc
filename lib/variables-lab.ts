// Convert user text into a quoted C++ string literal for the live example.
export function cppStringLiteral(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`;
}

export const executionSteps = [
  {
    value: null,
    output: '',
    title: 'Antes de empezar',
    explanation:
      'Todavía no hemos ejecutado ninguna línea. La variable monedas aún no se ha creado.',
  },
  {
    value: 10,
    output: '',
    title: 'Declarar e inicializar',
    explanation:
      'Creamos una variable de tipo int llamada monedas y le damos su primer valor: 10.',
  },
  {
    value: 15,
    output: '',
    title: 'Asignar un nuevo valor',
    explanation:
      'Guardamos 15 en la variable que ya existe. El 10 anterior se reemplaza; no se suman.',
  },
  {
    value: 17,
    output: '',
    title: 'Leer, calcular y guardar',
    explanation:
      'Primero leemos 15. Calculamos 15 + 2 y después guardamos el resultado, 17, en monedas.',
  },
  {
    value: 17,
    output: '17',
    title: 'Leer sin modificar',
    explanation:
      'std::cout muestra el valor actual en la consola. Leer la variable no cambia lo que guarda: sigue siendo 17.',
  },
] as const;

export const executionLines = [
  'int monedas = 10;',
  'monedas = 15;',
  'monedas = monedas + 2;',
  'std::cout << monedas;',
] as const;
