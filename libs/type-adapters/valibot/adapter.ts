import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as V from 'valibot'

export interface Inference extends TypeInference {
  output: this['input'] extends V.BaseSchema<any, any, any> ? V.InferOutput<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: V.BaseSchema<any, any, any>, value: unknown): boolean {
    const result = V.safeParse(schema, value)
    return result.success
  }
}