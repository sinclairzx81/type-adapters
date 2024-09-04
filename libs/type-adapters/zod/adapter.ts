import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as z from 'zod'

export interface Inference extends TypeInference {
  output: this['input'] extends z.ZodSchema ? z.infer<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: z.ZodSchema, value: unknown): boolean {
    return schema.safeParse(value).success
  }
}