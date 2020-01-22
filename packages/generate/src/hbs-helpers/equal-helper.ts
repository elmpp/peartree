// @ts-nocheck

/**
 * handlebars comparison helper - https://tinyurl.com/kd3xdv2
 */
export const equalHelper = (lvalue, rvalue, options) => {
  if (arguments.length < 3) throw new Error('Handlebars Helper equal needs 2 parameters')
  if (lvalue === rvalue) {
    return options.fn(this)
  } else {
    return options.inverse(this)
  }
}
