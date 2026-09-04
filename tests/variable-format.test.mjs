import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildDeclaration,
  formatTypes,
  suggestVariableName,
} from '../lib/variable-format.ts';

test('la convención general genera camelCase portátil', () => {
  assert.equal(
    suggestVariableName('coins collected', 'int', 'general'),
    'coinsCollected',
  );
  assert.equal(
    suggestVariableName('Player NAME', 'string', 'general'),
    'playerName',
  );
  assert.equal(
    suggestVariableName('opción menú', 'char', 'general'),
    'opcionMenu',
  );
});

test('la convención de Unreal usa PascalCase y prefijo b para bool', () => {
  assert.equal(
    suggestVariableName('has enough money', 'bool', 'unreal'),
    'bHasEnoughMoney',
  );
  assert.equal(
    suggestVariableName('total cost', 'float', 'unreal'),
    'TotalCost',
  );
  assert.equal(
    suggestVariableName('b has faded in', 'bool', 'unreal'),
    'bHasFadedIn',
  );
});

test('las seis declaraciones conservan tipo, inicializador y punto y coma', () => {
  for (const definition of formatTypes) {
    const name = suggestVariableName(
      definition.concept,
      definition.id,
      'unreal',
    );
    assert.equal(
      buildDeclaration({ type: definition.id, name, initialize: true }),
      `${definition.label} ${name} = ${definition.literal};`,
    );
    assert.equal(
      buildDeclaration({ type: definition.id, name, initialize: false }),
      `${definition.label} ${name};`,
    );
  }
});
