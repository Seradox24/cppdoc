export const dataTypes = [
  {
    id: 'int',
    label: 'int',
    category: 'Números enteros',
    name: 'monedas',
    description:
      'Para contar unidades completas: 0, 12 o −5. No conserva la parte decimal.',
    example: 'Monedas, vidas o cantidad de objetos.',
  },
  {
    id: 'float',
    label: 'float',
    category: 'Números con decimales',
    name: 'velocidad',
    description:
      'Para representar medidas con decimales. La f de 2.5f indica que ese número es un float.',
    example: 'Una velocidad de 2.5 metros por segundo.',
  },
  {
    id: 'double',
    label: 'double',
    category: 'Más precisión habitual',
    name: 'distancia',
    description:
      'También representa decimales. Suele ofrecer más precisión que float. Un literal como 12.75, sin f, es double.',
    example: 'Una distancia que necesita más precisión.',
  },
  {
    id: 'bool',
    label: 'bool',
    category: 'Verdadero o falso',
    name: 'tieneTarjeta',
    description:
      'Solo tiene dos valores: true (verdadero) y false (falso). Sirve para guardar una respuesta de sí o no.',
    example: '¿Hay una tarjeta en la cartera?',
  },
  {
    id: 'char',
    label: 'char',
    category: 'Un carácter básico',
    name: 'inicial',
    description:
      "Para un carácter básico, como 'A' o '7'. Se escribe entre comillas simples. Un emoji no cabe necesariamente en un char.",
    example: 'La inicial de un nombre o una opción del menú.',
  },
  {
    id: 'string',
    label: 'std::string',
    category: 'Texto',
    name: 'nombre',
    description:
      'Guarda una secuencia de caracteres, como un nombre. Usa comillas dobles. Es un tipo de la biblioteca estándar; incluye <string> para usarlo.',
    example: 'El nombre de la persona: "Ada".',
  },
] as const;

export type DataType = (typeof dataTypes)[number]['id'];
export type LabValues = {
  int: number;
  float: number;
  double: number;
  bool: boolean;
  char: string;
  string: string;
};
export const defaultLabValues: LabValues = {
  int: 12,
  float: 2.5,
  double: 12.75,
  bool: true,
  char: 'A',
  string: 'Ada',
};

export type Exercise = {
  title: string;
  prompt: string;
  code?: string;
  choices: string[];
  answer: number;
  explanation: string;
  hint: string;
};
type Habit = {
  label: string;
  title: string;
  code: string;
  explanation: string;
};
type ExecutionStep = {
  value: string | null;
  output: string;
  title: string;
  explanation: string;
};

// Escape user text once; every declaration and copied program shares this literal.
export function cppStringLiteral(value: string): string {
  return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')}"`;
}

function formatLiteral(
  type: DataType,
  value: number | boolean | string,
): string {
  if (type === 'string') return cppStringLiteral(String(value));
  if (type === 'char') return `'${value}'`;
  if (type === 'float') return `${Number(value).toFixed(1)}f`;
  if (type === 'double') return Number(value).toFixed(2);
  return String(value);
}

const typeDetails: Record<
  DataType,
  { initialization: string; pitfall: Habit; format: Habit; exercise: Exercise }
> = {
  int: {
    initialization:
      'Dentro de una función, int monedas; no empieza automáticamente en cero. Inicialízala o asígnale un valor antes de leerla. int monedas{}; sí empieza en 0.',
    pitfall: {
      label: '03 / CUIDA LAS CONVERSIONES',
      title: 'Un entero no conserva fracciones',
      code: 'int puntos = 3.8; // guarda 3\n// Alternativa con llaves:\n// int puntos{3.8}; // error',
      explanation:
        'Con =, esta conversión descarta la parte decimal; no redondea. Las llaves rechazan esta conversión que pierde información. El rango de int también tiene límites.',
    },
    format: {
      label: '04 / ESCRIBE UNA CANTIDAD',
      title: 'Un entero va sin comillas',
      code: 'int vidas = 3;\nint temperatura = -5;',
      explanation:
        'Los enteros pueden ser positivos, negativos o cero. Escribe 3 si quieres una cantidad; "3" es texto y no sirve para inicializar directamente un int.',
    },
    exercise: {
      title: 'El decimal que se pierde',
      prompt:
        '¿Qué valor se guarda con esta inicialización? El compilador puede advertir sobre la conversión.',
      code: 'int puntos = 3.8;',
      choices: ['3.8', '3', '4'],
      answer: 1,
      explanation:
        'Se guarda 3. Se descarta la parte fraccionaria, sin redondear. Con int puntos{3.8}; las llaves hacen que esta conversión sea un error.',
      hint: 'int no conserva fracciones. Esta conversión tampoco redondea al entero más cercano.',
    },
  },
  float: {
    initialization:
      'Dentro de una función, float velocidad; no empieza automáticamente en cero. float velocidad{}; sí empieza en 0.0f. Dale un valor antes de leerla.',
    pitfall: {
      label: '03 / LOS DECIMALES SE APROXIMAN',
      title: 'Más dígitos no garantizan exactitud',
      code: 'float medida = 0.1f;',
      explanation:
        'Muchos decimales, como 0.1, no se representan exactamente en el formato binario habitual. float guarda una aproximación. Los controles muestran valores redondeados para facilitar la lectura.',
    },
    format: {
      label: '04 / PUNTO Y SUFIJO f',
      title: 'Indica un literal float',
      code: 'float velocidad = 2.5f;\nfloat retroceso = -1.5f;',
      explanation:
        'En el código, usa punto decimal. La f indica el tipo del número escrito, no una unidad ni una operación. Sin f, un literal como 2.5 es double y al guardarlo en float se convierte.',
    },
    exercise: {
      title: '¿Qué significa la f?',
      prompt: 'Observa el valor inicial. ¿Qué indica el sufijo f?',
      code: 'float velocidad = 2.5f;',
      choices: [
        'Que el valor se redondea a un entero.',
        'Que la unidad es pies.',
        'Que el literal 2.5f tiene tipo float.',
      ],
      answer: 2,
      explanation:
        'La f hace que ese número escrito sea un literal float. Sin ella, 2.5 es un literal double. No cambia la unidad de la velocidad.',
      hint: 'El sufijo forma parte del literal numérico: informa al compilador sobre su tipo.',
    },
  },
  double: {
    initialization:
      'Dentro de una función, double distancia; no empieza automáticamente en cero. double distancia{}; sí empieza en 0.0. Dale un valor antes de leerla.',
    pitfall: {
      label: '03 / PRECISIÓN NO ES EXACTITUD',
      title: 'También hay aproximaciones',
      code: 'double medida = 0.1;',
      explanation:
        'double suele tener más precisión que float, pero tampoco representa exactamente todos los decimales en el formato binario habitual. Más precisión reduce muchos errores; no los elimina todos.',
    },
    format: {
      label: '04 / UN DECIMAL SIN f',
      title: 'El literal ya es double',
      code: 'double distancia = 12.75;\ndouble desplazamiento = -0.5;',
      explanation:
        'Un literal decimal como 12.75, sin sufijo, tiene tipo double. Usa punto, no coma. Los ceros finales no cambian el valor: 2.50 y 2.5 representan el mismo número.',
    },
    exercise: {
      title: 'El tipo del número escrito',
      prompt: '¿Qué tipo tiene el literal 12.75 de esta línea?',
      code: 'double distancia = 12.75;',
      choices: ['int', 'float', 'double'],
      answer: 2,
      explanation:
        'Un literal con punto decimal y sin sufijo, como 12.75, tiene tipo double. 12.75f sería float.',
      hint: 'Fíjate en el punto decimal y en que no hay ningún sufijo f.',
    },
  },
  bool: {
    initialization:
      'Dentro de una función, bool tieneTarjeta; no empieza automáticamente en false. bool tieneTarjeta{}; sí empieza en false. Dale un valor antes de leerla.',
    pitfall: {
      label: '03 / INVERTIR NO ES GUARDAR',
      title: '! produce el valor contrario',
      code: 'bool tieneTarjeta = false;\ntieneTarjeta = !tieneTarjeta;',
      explanation:
        '!false produce true y !true produce false. Solo consultar !tieneTarjeta no modifica la variable; la asignación con = es la que guarda el resultado.',
    },
    format: {
      label: '04 / PALABRAS SIN COMILLAS',
      title: 'true y false son valores lógicos',
      code: 'bool tieneTarjeta = true;\nstd::cout << std::boolalpha << tieneTarjeta;',
      explanation:
        'Escribe true o false, sin comillas. std::boolalpha hace que la consola muestre esas palabras. Sin ese formato, cout normalmente muestra 1 o 0; la variable sigue siendo bool.',
    },
    exercise: {
      title: 'Mostrar el valor contrario',
      prompt:
        '¿Qué aparece en la consola? Aquí solo consultamos el valor contrario, sin asignarlo.',
      code: 'bool tieneTarjeta = false;\nstd::cout << std::boolalpha << !tieneTarjeta;',
      choices: ['false', 'true', '!tieneTarjeta'],
      answer: 1,
      explanation:
        'Se muestra true porque !false es true. tieneTarjeta sigue guardando false: no hay ninguna asignación que la modifique.',
      hint: 'El signo ! produce el valor lógico contrario. std::boolalpha lo muestra como palabra.',
    },
  },
  char: {
    initialization:
      "Dentro de una función, char inicial; no tiene un carácter inicial garantizado. char inicial{}; empieza en el carácter nulo '\\0', que no es el símbolo '0' y normalmente no se ve al imprimirlo.",
    pitfall: {
      label: '03 / UN CARÁCTER NO ES UN TEXTO',
      title: 'Las comillas importan',
      code: 'char inicial = \'A\'; // válido\n// char inicial = "A"; // error',
      explanation:
        'Las comillas simples crean un literal de carácter. Las dobles crean un literal de cadena, aunque solo contenga una letra. Tampoco asumas que un emoji cabe en un char.',
    },
    format: {
      label: '04 / SÍMBOLO Y CANTIDAD',
      title: "'7' no significa contar siete",
      code: "char opcion = '7';\nchar letra = 'M';",
      explanation:
        "char representa el carácter mediante un código numérico. '7' es el símbolo de una opción, no el entero 7. Para cambiar de letra, asignamos otro carácter explícitamente.",
    },
    exercise: {
      title: 'Un símbolo entre comillas',
      prompt: '¿Qué representa el valor inicial de esta variable?',
      code: "char opcion = '7';",
      choices: [
        "El carácter '7'.",
        'La cantidad entera 7.',
        'Un texto de varios caracteres.',
      ],
      answer: 0,
      explanation:
        "Las comillas simples indican un carácter. Se guarda la representación del símbolo '7'; no se convierte automáticamente en la cantidad 7.",
      hint: 'Observa las comillas simples. Estamos identificando un símbolo, no contando unidades.',
    },
  },
  string: {
    initialization:
      'std::string nombre; sí construye una cadena vacía, incluso dentro de una función. También puedes escribir std::string nombre{}; o darle un texto inicial. Este comportamiento difiere del de los tipos fundamentales sin inicializador.',
    pitfall: {
      label: '03 / REEMPLAZAR O AÑADIR',
      title: '+ une textos',
      code: 'std::string nombre = "Ada";\nnombre = "Luna";\nnombre = nombre + "!";',
      explanation:
        'La primera asignación reemplaza el texto. La siguiente une "!" al valor actual y guarda "Luna!". Esta suma funciona porque nombre es std::string; no es una suma numérica.',
    },
    format: {
      label: '04 / COMILLAS DOBLES Y CABECERA',
      title: 'Puedes guardar texto vacío',
      code: '#include <string>\n\nstd::string nombre = "Ada";\nstd::string vacio = "";',
      explanation:
        'Usa comillas dobles e incluye <string>. Las comillas delimitan el literal, no forman parte del texto guardado. El texto puede contener espacios y también puede estar vacío.',
    },
    exercise: {
      title: 'Una cadena sin texto inicial',
      prompt:
        '¿Qué imprime este fragmento dentro de main()? Se ha incluido <string> y <iostream>.',
      code: 'std::string nombre;\nstd::cout << nombre;',
      choices: [
        'Nada: la cadena está vacía.',
        'La palabra nombre.',
        'Un valor desconocido, como un int local sin inicializar.',
      ],
      answer: 0,
      explanation:
        'El constructor de std::string crea una cadena vacía. Esta regla no es la misma que la de una variable local int sin inicializador.',
      hint: 'std::string construye un objeto con un valor inicial definido, aunque no escribas =.',
    },
  },
};

export function createVariableExample(selected: DataType, values: LabValues) {
  const type = dataTypes.find((item) => item.id === selected)!;
  const initialValue = values[selected];
  let assigned: number | string | boolean;
  let final: number | string | boolean;
  let operation: string;
  let operationTitle: string;
  let operationExplanation: string;
  if (selected === 'bool') {
    assigned = !values.bool;
    final = !assigned;
    operation = `${type.name} = !${type.name};`;
    operationTitle = 'Invertir y guardar';
    operationExplanation = `Leemos ${assigned}. El operador ! produce el valor contrario, ${final}, y = lo guarda en ${type.name}.`;
  } else if (selected === 'char') {
    const letters = ['A', 'B', 'C', 'M', 'Z'];
    const index = letters.indexOf(values.char);
    assigned = letters[(index + 1) % letters.length];
    final = letters[(index + 2) % letters.length];
    operation = `${type.name} = '${final}';`;
    operationTitle = 'Sustituir otro carácter';
    operationExplanation = `Reemplazamos '${assigned}' por '${final}'. La variable sigue siendo char: guarda un carácter básico, no una palabra.`;
  } else if (selected === 'string') {
    assigned = values.string === 'Luna' ? 'Ada' : 'Luna';
    final = `${assigned}!`;
    operation = `${type.name} = ${type.name} + "!";`;
    operationTitle = 'Unir texto y guardar';
    operationExplanation = `Leemos ${cppStringLiteral(assigned)}. El operador + une "!" al texto. Después guardamos ${cppStringLiteral(final)} en ${type.name}.`;
  } else {
    const offset = selected === 'int' ? 3 : selected === 'float' ? 1.5 : 1.25;
    const increment = selected === 'int' ? 2 : 0.5;
    const places = selected === 'int' ? 0 : selected === 'float' ? 1 : 2;
    assigned = Number((Number(initialValue) + offset).toFixed(places));
    final = Number((assigned + increment).toFixed(places));
    operation = `${type.name} = ${type.name} + ${formatLiteral(selected, increment)};`;
    operationTitle = 'Leer, calcular y guardar';
    operationExplanation = `Primero leemos ${formatLiteral(selected, assigned)}. Le sumamos ${formatLiteral(selected, increment)} y después guardamos ${formatLiteral(selected, final)} en ${type.name}.`;
  }

  const literal = formatLiteral(selected, initialValue);
  const assignedLiteral = formatLiteral(selected, assigned);
  const finalLiteral = formatLiteral(selected, final);
  const declaration = `${type.label} ${type.name} = ${literal};`;
  const outputExpression = `std::cout << ${selected === 'bool' ? 'std::boolalpha << ' : ''}${type.name};`;
  const lines = [
    declaration,
    `${type.name} = ${assignedLiteral};`,
    operation,
    outputExpression,
  ];
  const output = String(final);
  const steps: ExecutionStep[] = [
    {
      value: null,
      output: '',
      title: 'Antes de empezar',
      explanation: `Todavía no hemos ejecutado ninguna línea. La variable ${type.name} aún no se ha creado.`,
    },
    {
      value: literal,
      output: '',
      title: 'Declarar e inicializar',
      explanation: `Creamos una variable de tipo ${type.label} llamada ${type.name} y le damos el valor inicial ${literal}, elegido en el laboratorio.`,
    },
    {
      value: assignedLiteral,
      output: '',
      title: 'Asignar un nuevo valor',
      explanation: `Guardamos ${assignedLiteral} en ${type.name}. El valor anterior, ${literal}, se reemplaza. Esta instrucción no lo suma ni lo une al nuevo.`,
    },
    {
      value: finalLiteral,
      output: '',
      title: operationTitle,
      explanation: operationExplanation,
    },
    {
      value: finalLiteral,
      output,
      title: 'Leer sin modificar',
      explanation: `std::cout muestra el valor actual. ${type.name} sigue guardando ${finalLiteral}. ${selected === 'bool' ? 'std::boolalpha permite verlo como true o false, en lugar de 1 o 0.' : selected === 'string' || selected === 'char' ? 'Las comillas delimitan el literal del código; no se imprimen alrededor del valor.' : 'La consola puede omitir ceros decimales finales; eso no cambia el valor guardado.'}`,
    },
  ];
  const details = typeDetails[selected];
  const habits: Habit[] = [
    {
      label: '01 / EMPIEZA CON UN VALOR',
      title:
        selected === 'string'
          ? 'El texto vacío también es un valor'
          : 'Inicializa antes de leer',
      code: declaration,
      explanation: details.initialization,
    },
    {
      label: '02 / EL TIPO LIMITA EL DATO',
      title: type.category,
      code: declaration,
      explanation: type.description,
    },
    {
      label: '03 / ESCRIBE EL LITERAL CORRECTO',
      title: `Así se representa un valor ${type.label}`,
      code: literal,
      explanation:
        selected === 'int'
          ? 'Un literal int se escribe como un número entero, sin parte decimal.'
          : selected === 'float'
            ? 'El sufijo f indica que este literal decimal es float.'
            : selected === 'double'
              ? 'Un decimal sin sufijo f es un literal double.'
              : selected === 'bool'
                ? 'true y false se escriben sin comillas.'
                : selected === 'char'
                  ? 'Un carácter básico se delimita con comillas simples.'
                  : 'Un texto de std::string se delimita con comillas dobles.',
    },
  ];
  const invalidLiteral =
    selected === 'char'
      ? cppStringLiteral(values.char)
      : selected === 'string'
        ? '42'
        : cppStringLiteral(literal);
  const questions: Exercise[] = [
    {
      title: `Declarar una variable ${type.label}`,
      prompt: `¿Qué declaración crea ${type.name} como ${type.label} y le da el valor inicial ${literal}?`,
      choices: [
        declaration,
        selected === 'bool'
          ? `${type.label} ${type.name} = ;`
          : `${type.label} ${type.name} = ${invalidLiteral};`,
        `${type.label} = ${literal};`,
      ],
      answer: 0,
      explanation: `Escribimos el tipo ${type.label}, el nombre ${type.name} y el valor ${literal}, y cerramos con ;. ${selected === 'string' ? 'std::string admite este texto entre comillas dobles.' : selected === 'char' ? 'char necesita aquí un carácter entre comillas simples.' : selected === 'bool' ? 'Usa true o false sin comillas, y escribe el valor después de =.' : 'El número va sin comillas; entre comillas sería texto.'}`,
      hint: `Necesitas tanto el tipo ${type.label} como el nombre ${type.name}. Revisa también cómo se escribe su valor.`,
    },
    {
      title: 'Reconocer el valor inicial',
      prompt: `En ${declaration}, ¿qué parte es el valor inicial?`,
      code: declaration,
      choices: [type.name, literal, type.label],
      answer: 1,
      explanation: `${literal} es el dato concreto escrito después de =. ${type.name} es el nombre y ${type.label} es el tipo.`,
      hint: 'Busca el dato que aparece después de = y antes del punto y coma.',
    },
    {
      title: `Reconocer la categoría de ${type.label}`,
      prompt: `¿Qué clase de dato representa ${type.label} en esta actividad?`,
      choices: [
        type.category,
        ...dataTypes
          .filter((item) => item.id !== selected)
          .slice(0, 2)
          .map((item) => item.category),
      ],
      answer: 0,
      explanation: `${type.label} se usa aquí para ${type.category.toLowerCase()}.`,
      hint: `Revisa la tarjeta descriptiva de ${type.label} en el explorador.`,
    },
    {
      title: 'Reconocer el nombre',
      prompt: `¿Qué nombre identifica la variable de este ejemplo?`,
      code: declaration,
      choices: [type.label, type.name, literal],
      answer: 1,
      explanation: `${type.name} es el identificador que permite referirse a este dato en el código.`,
      hint: 'El nombre aparece entre el tipo y el signo =.',
    },
  ];
  const includes =
    '#include <iostream>' +
    (selected === 'string' ? '\n#include <string>' : '');
  const program = `${includes}\n\nint main() {\n    ${lines.slice(0, 3).join('\n    ')}\n\n    ${outputExpression.slice(0, -1)} << '\\n';\n    return 0;\n}`;
  return {
    type,
    literal,
    declaration,
    assignedLiteral,
    finalLiteral,
    lines,
    steps,
    habits,
    questions,
    program,
    output,
    displayed:
      selected === 'string'
        ? String(initialValue) || '(texto vacío)'
        : String(initialValue),
    introduction:
      selected === 'bool'
        ? 'Vamos a guardar si hay una tarjeta, cambiar la respuesta e invertirla antes de mostrarla.'
        : selected === 'char'
          ? 'Vamos a guardar una inicial, sustituirla por otras letras y mostrar el carácter final.'
          : selected === 'string'
            ? 'Vamos a guardar un nombre, reemplazarlo y añadir texto antes de mostrarlo.'
            : `Vamos a guardar ${selected === 'int' ? 'una cantidad de monedas' : selected === 'float' ? 'una velocidad' : 'una distancia'}, cambiarla y mostrar el resultado.`,
    operationNote: operationExplanation,
  };
}

export type VariableExample = ReturnType<typeof createVariableExample>;
