import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import { TSchema, StaticDecode } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export interface Inference extends TypeInference {
  output: this['input'] extends TSchema ? StaticDecode<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: TSchema, value: unknown): boolean {
    return Value.Check(schema, value)
  }
}