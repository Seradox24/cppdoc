import assert from 'node:assert/strict';
import { test } from 'node:test';
import { evaluatePrecedence, evaluateWallet } from '../lib/assignment-lab.ts';

test('la cartera suma los valores antes de compararlos con el coste', () => {
  const short = evaluateWallet({
    cost: 10,
    coins: 2.45,
    firstBill: 5,
    secondBill: 0,
  });
  assert.equal(short.enough, false);
  assert.ok(Math.abs(short.difference - -2.55) < Number.EPSILON * 10);

  const enough = evaluateWallet({
    cost: 10,
    coins: 2.45,
    firstBill: 5,
    secondBill: 10,
  });
  assert.equal(enough.enough, true);
  assert.ok(Math.abs(enough.available - 17.45) < Number.EPSILON * 10);
});

test('los paréntesis cambian el orden de la expresión', () => {
  const values = { first: 2, second: 3, third: 6 };
  assert.equal(evaluatePrecedence({ ...values, parentheses: false }), 12);
  assert.equal(evaluatePrecedence({ ...values, parentheses: true }), 18);
});
