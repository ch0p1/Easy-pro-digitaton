# shuffle.ts

```typescript
/**
 * Devuelve una permutación aleatoria de los índices 0..length-1 (Fisher-Yates).
 * Se usa para mezclar la posición de las opciones sin alterar los índices de
 * `correcta` ni de `error_comun` en los datos de los ejercicios.
 */
export function shuffledOrder(length: number, rng: () => number = Math.random): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}
```