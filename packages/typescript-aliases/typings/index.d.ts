/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable spaced-comment */
/// <reference path="./graphql.d.ts" />
/* eslint-enable spaced-comment */
/* eslint-enable @typescript-eslint/triple-slash-reference */


// possibly replaceable with Record<p, t>
interface Dictionary<T> {
  [index: string]: T
}

type PartialMock<T> = Partial<T> & Partial<jest.Mock<T>>

type Scalar = string | number
type ScalarBool = Scalar | boolean

// https://stackoverflow.com/a/50689136/2968327
// type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> // now in 3.5

// e.g. String[] -> String
type Singularise<T> = T extends (infer U)[] ? U : T

/**
 * Conditional types with inference - https://goo.gl/BPfCPY
 * e.g. DeepSingularise<interface { something: String | String[] }> => interface { something: String }
 */
type DeepSingularise<T> = {[K in keyof T]: Singularise<T[K]>}

type Mandatorise<T> = NonNullable<T>

/**
 * - predefined conditional types - https://goo.gl/fs2hsc
 * - removing optionality - https://goo.gl/8JMwbU
 */
type DeepMandatorise<T> = {[K in keyof T]-?: NonNullable<T[K]>}

/**
 * - predefined conditional types - https://goo.gl/fs2hsc
 * - removing optionality - https://goo.gl/8JMwbU
 */
type DeepMandatoriseUnion<T, K extends string> = T & {[U in K]-?: NonNullable<T[K]>}

/**
 * Looks like Omit can handle a union key
 */
type OmitUnion<T, K extends string> = Omit<T, K>

// https://goo.gl/6aLYXr
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

// grab the element type - https://tinyurl.com/yy4hepj9
type ValueOf<T> = T[keyof T]

// https://tinyurl.com/y6bwbroa
type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>}

// Although there is a "Required" in main TS lib, it doesn't seem to work.
//  GH source - https://tinyurl.com/y5rjpxa3
type RequiredProper<T> = T extends object ? {[P in keyof T]-?: NonNullable<T[P]>} : T
type DeepRequiredProper<T, U extends object | undefined = undefined> = T extends object
  ? {
      [P in keyof T]-?: NonNullable<T[P]> extends NonNullable<U | Function | Class>
        ? NonNullable<T[P]>
        : DeepRequiredProper<NonNullable<T[P]>, U>
    }
  : T

/**
 * Finds mutually exclusive parts of types. Similar to usual Omit
 *
 *  - from here - https://stackoverflow.com/a/51064664/2968327
 */
type Disjunction<T, K> = Pick<T, Exclude<keyof T, keyof K>>

/**
 * Finds the intersection of types.
 * Basically, opposite of "Exclude"
 */
// type Intersection<T, U> = T extends U ? T : never;
type Intersection<T, U> = Extract<T, U>

/**
 * Finds mutually exclusive parts of types. Similar to usual Omit
 *
 *  - from here - https://stackoverflow.com/a/51064664/2968327
 */
// type Optionalize<T, K> = T & Partial<Pick<T, Intersection<keyof T, keyof K>>>
type OptionalizeIntersection<T, K> = Omit<T, Intersection<keyof T, keyof K>> & Partial<Pick<T, Intersection<T, K>>>

/**
 * Finds mutually exclusive parts of types. Similar to usual Omit
 *
 *  - from here - https://stackoverflow.com/a/51064664/2968327
 */
// type Optionalize<T, K> = T & Partial<Pick<T, Intersection<keyof T, keyof K>>>
type Optionalize<T, K> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Get the props from a component, with/out children
 *
 *  - https://tinyurl.com/yx9yxbhv
 */
type ComponentPropsWithoutChildren<T> = Omit<React.ComponentProps<T>, 'children'>

/**
 * Sometimes don't want React to add its own children onto props
 */
interface ReactFCSpecifyChildren<P extends {children: any} = {}> {
  (props: P, context?: any): ReactElement | null
  propTypes?: WeakValidationMap<P>
  contextTypes?: ValidationMap<any>
  defaultProps?: Partial<P>
  displayName?: string
}

/**
 * Avoids the typescript error around mapped union key indexes
 */
type DictionaryUnion<T, K extends string> = {
  [key in K]: T
}
type DictionaryUnionOptional<T, K extends string> = {
  [key in K]?: T
}

// type ReturnType = ReturnType

/**
 * Get type of function arguments
 */
type FunctionArgumentTypes<T> = Parameters<T>

// interface StringObject {
//   [index: string]: string
// }
// interface NumberObject {
//   [index: string]: number
// }
// interface ScalarObject {
//   [index: string]: Scalar
// }
// interface ScalarBoolObject {
//   [index: string]: Scalar
// }

// type PartialMock<T = {}> = {
//   [P in keyof T]?: T[P];
// }
