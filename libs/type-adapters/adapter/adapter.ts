export interface TypeInference {
  input: unknown
  output: unknown
}

export abstract class TypeAdapter<Inference extends TypeInference = TypeInference> {
  inference: Inference = {} as never

  abstract validate(schema: unknown, value: unknown): boolean
}

export type Static<A, Type> = (
  A extends TypeAdapter<infer I extends TypeInference> 
    ? (I & { input: Type })['output']
    : unknown
)
