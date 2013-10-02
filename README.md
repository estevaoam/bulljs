bulljs
======

A modular and clean validator plugin for jQuery

How to install
--------------

1. Download the minified file `bull.min.js` and add to your project
2. Load jQuery file first, then bull.min.js

How to use
----------

The best way to you to learn how to use is to check this example:

    $('form').validateForm({
      '.name': {
        presence: true,
      },
      '.email': {
        presence: true,
        format: /[a-zA-Z\.\_]+@[a-zA-Z]+.[a-zA-Z]+/
      },
      '.age': {
        numericality: true
      }
    });

Bull adds the `validateForm()` method to your jQuery objects,
it accepts two arguments:

1. Rules
2. Options (handlers and callbacks)

Rules
-----

You can define rules by using a CSS selector as key
and an object with the validations you want, for example:

    '.name': {
      presence: true
    }

Will require the field with class `name` in your form to be different than blank.

Error message handler
---------------------

By default when the field fails the validation the default error message
handler will add a `div` element with the class `bull-error-message`
right after the input with the error message, for example:

    <div class="bull-error-message">
      Requires to be a number.
    </div>

But you can create your own handler. Just create an object with two methods (`showErrors`, `removeErrors`) that put the errors on your page.

Take a look on the default handler:

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

The context of these two methods is the validator class `Bull`, so
if you need any info on it you can use on your handler. In most cases you only need to use `this.errors` and `this.form`.

`this.errors` is a pair key-value object that holds the error messages,
where the key is the selector of the field that failed the validation
and the value is an Array of messages.

`this.form` is the jQuery object of the form being validated.

You can pass this custom handler as an option of the second argument:

    $('form').validateForm({ ... }, {
      errorHandler: myCustomErrorHandler
    });


Callbacks
--------

Currently there is a success callback that is called when the validation is succeeded and the form is ready to submit.
You can define it passing a function as an attribute of the options hash:

    $('form').validateForm({ ... }, {
      onSuccess: function(){
        ...
      }
    });

The context(`this`) of the function is the HTML DOM object of the form, so you can access normally using jQuery (`$(this)`).


Extending validation functions
------------------------------

You can easily extend the default validation functions by calling
`Bull.defineRule()` method, check out this example:

    Bull.defineRule('maximum', function(field, arg){
      var number = arg.number || arg;
      var message = arg.message || "Deve ser menor do que " + number;

      if (field.val().length > number) {
        this.addError(field, message);
      }
    });


TODO
----

- Multi-form validation
- Improve the defineRule scheme
- Improve README
- Improve documentation
- Unit testing


I NEED YOU
----------

This an open source project, you are (almost) obligated to
fork this repo, create a branch with your feature and do a pull request!
Common, I'm just one guy, help me and the community. :)
