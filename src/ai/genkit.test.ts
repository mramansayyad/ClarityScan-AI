import { test } from 'node:test';
import assert from 'node:assert';
import { ai } from './genkit.js';

test('Genkit instance is defined', () => {
  assert.ok(ai, 'ai instance should be defined');
});
