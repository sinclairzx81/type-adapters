import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import { Schema as ET } from '@effect/schema/Schema'

export interface Inference extends TypeInference {
  output: ET.Type<this['input']>
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: unknown, value: unknown): boolean {
    throw Error('not implemented')
  }
}