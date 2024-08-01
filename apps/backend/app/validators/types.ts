import { VineObject, VineValidator } from '@vinejs/vine'

export type ExtractSchemaType<T> =
  T extends VineValidator<infer A, infer _>
    ? A extends VineObject<infer _Z, infer X, infer _C, infer _V>
      ? X
      : never
    : never
