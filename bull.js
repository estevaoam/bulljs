// Check if an object is empty. :)
var isEmpty = function(obj){
  for(var prop in obj) {
    if(obj.hasOwnProperty(prop)){ return false; };
  }
  return true;
}

// Default error handler
// you can do your object
// and pass through the
// 'validateForm' method.
var DefaultErrorHandler = {
  showErrors: function() {
    var errors = this.errors;
    var form = this.form;

    for (selector in errors) {
      var field = $(selector, form);
      var errorElement = '<div>';
      errorElement +=  errors[selector][0];
      errorElement += '</div>';

      errorElement = $(errorElement).addClass('validator-error-message');

      field.addClass('input-error').parent('div').after($(errorElement));
    }
  },

  removeErrors: function() {
    $('.validator-error-message').remove();
    $('.input-error').removeClass('input-error');
  }
}

// Bull "class"
var Bull = {
  validators: {},
  errors: {},
  form: null,
  errorHandler: null,

  init: function(formObject, errorHandler) {
    this.form = $(formObject);
    this.errorHandler = errorHandler;
    return this;
  },

  // Adds an error to a field
  addError: function(field, message){
    var selector = field.selector;

    if (this.errors[selector] === undefined) {
      this.errors[selector] = [message];
    } else {
      this.errors[selector].push(message);
    }
  },

  // Validates the form:
  // apply rules to each input.
  validate: function(rules){
    this.reset();

    for (prop in rules) {
      this.applyRule(rules[prop], $(prop, this.form));
    }

    var result = isEmpty(this.errors);

    if (result === false) {
      this.errorHandler.showErrors.call(this);
    }

    return result;
  },

  // Define a new kind of rule,
  // accepts a name (string) and
  // a function that is the validation
  // logic.
  defineRule: function(name, fun){
    if (this.validators[name] === undefined) {
      this.validators[name] = fun;
    }
  },

  // Apply rules to a field,
  // first arg is the hash ({ruleName: arg})
  // and second one is the field to check for
  // the rules.
  applyRule: function(rulesParams, field){
    for (ruleName in rulesParams) {
      this.validators[ruleName].call(this, field, rulesParams[ruleName]);
    }
  },

  // Removes all error messages
  // and resets the validator instance.
  reset: function() {
    this.errorHandler.removeErrors.call(this);
    this.errors = {};
  }
}

// Default validators

Bull.defineRule('numericality', function(field, arg){
  var message = arg.message || "Should have only numbers";

  if (isNaN(field.val())) {
    this.addError(field, message);
  }
});

Bull.defineRule('presence', function(field, arg){
  var message = arg.message || "Can't be blank";

  if (field.val() === undefined || field.val() === null || $.trim(field.val()) === "") {
    this.addError(field, message);
  }
});

Bull.defineRule('format', function(field, arg){
  var message = arg.message || "Isn't a valid format";
  var format = arg.regex || arg;

  if (!format.test(field.val())) {
    this.addError(field, message);
  }
});

Bull.defineRule('maximum', function(field, arg){
  var number = arg.number || arg;
  var message = arg.message || "Should have less than " + number + " chars";

  if (field.val().length > number) {
    this.addError(field, message);
  }
});

// Validating form
$.fn.validateForm = function(rules, errorHandler){
  this.bind('submit', function(e){
    var errorHandler = errorHandler || DefaultErrorHandler;
    var result = Bull.init(this, errorHandler).validate(rules);

    if (result === false) {
      e.preventDefault();
    }
  });
}
