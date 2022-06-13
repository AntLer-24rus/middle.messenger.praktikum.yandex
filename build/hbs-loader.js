const Handlebars = require('handlebars')

module.exports = function hbsLoader(content) {
  const precompiled = Handlebars.precompile(content)
  return `
  import Handlebars from 'handlebars/runtime';
  const templateFunction = Handlebars.template(${precompiled});
  export default templateFunction`
}
