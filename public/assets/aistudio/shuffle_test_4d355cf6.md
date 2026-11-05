# shuffle.test.ts

```typescript
import { describe, expect, it } from 'vitest';
import { shuffledOrder } from './shuffle';

describe('shuffledOrder', () => {
  it('devuelve una permutación de 0..n-1', () => {
    for (const n of [0, 1, 2, 4, 7]) {
      const order = shuffledOrder(n);
      expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('la posición de un índice dado varía (ya no es siempre la primera)', () => {
    const positions = new Set<number>();
    for (let i = 0; i < 400; i++) positions.add(shuffledOrder(4).indexOf(0));
    expect(positions.size).toBe(4);
  });

  it('es reproducible con un generador fijo', () => {
    let s = 1;
    const rng = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const a = shuffledOrder(5, rng);
    s = 1;
    expect(shuffledOrder(5, rng)).toEqual(a);
  });
});
```