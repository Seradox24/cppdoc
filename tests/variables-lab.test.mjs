import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createVariableExample,
  defaultLabValues,
  dataTypes,
} from '../lib/variables-lab.ts';

/** @type {Array<[import('../lib/variables-lab.ts').DataType, string[], string]>} */
const defaults = [
  ['int', ['12', '15', '17'], '17'],
  ['float', ['2.5f', '4.0f', '4.5f'], '4.5'],
  ['double', ['12.75', '14.00', '14.50'], '14.5'],
  ['bool', ['true', 'false', 'true'], 'true'],
  ['char', ["'A'", "'B'", "'C'"], 'C'],
  ['string', ['"Ada"', '"Luna"', '"Luna!"'], 'Luna!'],
];

for (const [type, expected, output] of defaults) {
  test(`${type}: declaración, pasos y programa comparten los mismos datos`, () => {
    const example = createVariableExample(type, defaultLabValues);
    assert.equal(example.literal, expected[0]);
    assert.deepEqual(
      example.steps.slice(1, 4).map((step) => step.value),
      expected,
    );
    assert.equal(example.steps[0].value, null);
    assert.ok(example.steps.slice(0, 4).every((step) => step.output === ''));
    assert.equal(example.steps[4].output, output);
    assert.equal(example.output, output);
    for (const line of example.lines.slice(0, 3))
      assert.ok(example.program.includes(line));
    assert.ok(
      example.program.includes(example.lines[3].slice(0, -1) + " << '\\n';"),
    );
    assert.equal(
      example.program.includes('#include <string>'),
      type === 'string',
    );
    assert.equal(example.program.includes('std::boolalpha'), type === 'bool');
    assert.equal(
      example.questions[0].choices[example.questions[0].answer],
      example.declaration,
    );
    assert.equal(
      example.questions[1].choices[example.questions[1].answer],
      expected[1],
    );
    assert.ok(example.habits[0].code.includes(example.declaration));
    assert.ok(example.habits[1].code.includes(`const ${example.type.label}`));
  });
}

test('los valores editados se propagan sin modificar el estado de entrada', () => {
  const values = Object.freeze({
    int: 0,
    float: 0.1,
    double: 25,
    bool: false,
    char: 'Z',
    string: 'Luna',
  });
  const expected = {
    int: ['0', '5'],
    float: ['0.1f', '2.1'],
    double: ['25.00', '26.75'],
    bool: ['false', 'false'],
    char: ["'Z'", 'B'],
    string: ['"Luna"', 'Ada!'],
  };
  for (const { id } of dataTypes) {
    const example = createVariableExample(id, values);
    assert.equal(example.literal, expected[id][0]);
    assert.equal(example.output, expected[id][1]);
    for (const question of example.questions) {
      assert.equal(
        new Set(question.choices).size,
        question.choices.length,
        `${id}: respuestas duplicadas`,
      );
      assert.ok(
        question.answer >= 0 && question.answer < question.choices.length,
      );
    }
  }
});

test('el texto vacío y las comillas generan literales copiables', () => {
  for (const text of ['', 'A "B"', 'C:\\datos', 'uno\ndos', 'José', 'Luna']) {
    const example = createVariableExample('string', {
      ...defaultLabValues,
      string: text,
    });
    assert.equal(JSON.parse(example.literal), text);
    assert.ok(
      example.program.includes(`std::string nombre = ${example.literal};`),
    );
    assert.equal(example.steps[1].value, example.literal);
    assert.notEqual(example.literal, example.assignedLiteral);
    assert.equal(example.output, text === 'Luna' ? 'Ada!' : 'Luna!');
  }
});

test('los decimales del slider no filtran artefactos de coma flotante al código', () => {
  for (let tick = 0; tick <= 100; tick++) {
    const example = createVariableExample('float', {
      ...defaultLabValues,
      float: tick / 10,
    });
    assert.match(example.literal, /^\d+\.\df$/);
    assert.match(example.finalLiteral, /^\d+\.\df$/);
    assert.equal(Number(example.output), Number((tick / 10 + 2).toFixed(1)));
  }
});
