/*
 * typeValidation: Adds validation arguments for javascript functions
 * 0.1.1
 *
 * By Max Ulyanov
 * Src: https://github.com/M-Ulyanov/typeValidation
 */

'use strict';

(function () {

    'use strict';

    /**
     *
     * @param func
     * @param model
     * @param context
     * @returns {*}
     */
    function typeValidation(func, model, context) {
        var modelType = getConstructorName(model);
        if (modelType !== 'array') {
            log('error', '✘ Origin: ' + func.name + '; Expected: argument model should be of type array , instead got: ' + modelType);
            return false;
        }

        if (context == null) {
            context = this;
        }

        return function () {
            if (checkValidArguments(func, arguments, model)) {
                return func.apply(context, arguments);
            }
        };
    }

    /**
     *
     * @param func
     * @param args
     * @param model
     * @returns {*}
     */
    function checkValidArguments(_x, _x2, _x3) {
        var _again = true;

        _function: while (_again) {
            var func = _x,
                args = _x2,
                model = _x3;
            _again = false;

            for (var i = 0; i < model.length; i++) {

                var currentModel = model[i];
                if (currentModel === null) {
                    continue;
                }

                var currentArgument = args[currentModel.key] || args[i];
                if (currentArgument == null && !currentModel.required) {
                    continue;
                }

                var message = currentModel.key ? 'field ' + currentModel.key : 'argument with index ' + i;
                if (currentModel.required && currentArgument == null) {
                    log('error', '✘ Origin: ' + func.name + '; Expected: required ' + message + ', instead got: ' + currentArgument);
                    return false;
                }

                var currentArgumentType = getConstructorName(currentArgument);
                if (typeof currentModel.type === 'string' && currentArgumentType !== currentModel.type) {
                    log('error', '✘ Origin: ' + func.name + '; Expected: ' + message + ' must be of type ' + currentModel.type + ', instead got: ' + currentArgumentType + ' (value: ' + currentArgument + ')');
                    return false;
                }

                var callback = currentModel.callback;
                if (typeof callback === 'function') {
                    if (!callback(currentArgument, function (message) {
                        log('error', message);
                    })) {
                        return false;
                    }
                }

                if ((currentArgumentType === 'array' || currentArgumentType === 'object') && getConstructorName(currentModel.items) === 'array') {
                    _x = func;
                    _x2 = currentArgument;
                    _x3 = currentModel.items;
                    _again = true;
                    i = currentModel = currentArgument = message = currentArgumentType = callback = undefined;
                    continue _function;
                }
            }

            return true;
        }
    }

    /**
     *
     * @param type
     * @param message
     */
    function log(type, message) {
        if (type in console) {
            console[type](message);
        } else {
            console.log(message);
        }
    }

    /**
     *
     * @param entity
     * @returns {string}
     */
    function getConstructorName(entity) {
        return Object.prototype.toString.call(entity).slice(8, -1).toLowerCase();
    }

    if (typeof exports === 'object') {
        module.exports = typeValidation;
    } else {
        window.typeValidation = typeValidation;
    }
})();

//# sourceMappingURL=typeValidation-compiled.js.map