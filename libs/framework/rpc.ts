import * as StandardAdapter from "@type-adapters/adapter"

export interface MethodOptions { 
  input: unknown, 
  output: unknown 
}

export interface Callback<Adapter extends StandardAdapter.TypeAdapter, Options extends MethodOptions> {
  (input: StandardAdapter.Static<Adapter, Options['input']>): 
    StandardAdapter.Static<Adapter, Options['output']>
}
export class Rpc<Adapter extends StandardAdapter.TypeAdapter> {
  constructor(private readonly adapter: Adapter) {}

  method<Name extends string, Options extends MethodOptions>(name: Name, options: Options, callback: Callback<Adapter, Options>): this {
    throw Error('not implemented')
  }
}
