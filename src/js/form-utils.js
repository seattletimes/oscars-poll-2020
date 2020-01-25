var $ = require("./lib/qsa");

module.exports = {
  package: function(form) {
    var packet = {};
    var valid = true;
    $(`input:not([type="checkbox"]), select, textarea, input:checked`, form).forEach(function(item) {
      if (item.hasAttribute("required") && !item.value) {
        valid = false;
      }
      var key = item.getAttribute("name");
      var value = item.value;
      if (value == "on" && item.getAttribute("type") == "checkbox") {
        value = true;
      }
      var cast = item.getAttribute("data-cast");
      if (cast && cast == "number") {
        value = parseInt(value, 10);
      }
      packet[key] = value;
    });
    if (!valid) return null;
    return packet;
  },
  //returns true if pass, key name if fail
  validate: function(data, schema) {
    for (var key in schema) {
      var rule = schema[key];
      var value = data[key];
      if (rule instanceof RegExp && !rule.match(value)) {
          return key;
      } else if (rule === true && !value) {
        return key;
      } else {
        //complex validation
        //allow testing based on two properties
        if (rule.or) {
          var or = data[rule.or];
          if (!value && !or) {
            return key;
          }
        }
        if (rule.test) {
          if (!rule.test(value)) {
            return key;
          }
        }
      }
    }
    return true;
  }
};