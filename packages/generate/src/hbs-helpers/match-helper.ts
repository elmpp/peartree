// @ts-nocheck

/**
 * handlebars comparison helper - https://tinyurl.com/kd3xdv2
 */
export const matchHelper = (lvalue: string, rvalue: string, options) => {
  if (arguments.length < 3) throw new Error('Handlebars match Helper equal needs 2 parameters')
  if (lvalue.includes(rvalue)) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
