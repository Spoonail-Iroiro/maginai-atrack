import { test, expect } from 'vitest';
import { version } from '@/modules/version.js';

test('sample test', () => {
  expect(version).toEqual('0.1.0');
});
