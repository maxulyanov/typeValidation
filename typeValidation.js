/*
 * typeValidation: Adds validation arguments for javascript functions
 * 0.1.1
 *
 * By Max Ulyanov
 * Src: https://github.com/M-Ulyanov/typeValidation
 */



(()=> {


    'use strict';


    /**
     *
     * @param func
     * @param model
     * @param context
     * @returns {*}
     */
    function typeValidation(func, model, context) {
        let modelType = getConstructorName(model);
        if (modelType !== 'array') {
            log('error', `✘ Origin: ${func.name}; Expected: argument model should be of type array , instead got: ${modelType}`);
            return false;
        }

        if(context == null) {
            context = this;
        }

        return function () {
            if (checkValidArguments(func, arguments, model)) {
                return func.apply(context, arguments);
            }
        }
    }


    /**
     *
     * @param func
     * @param args
     * @param model
     * @returns {*}
     */
    function checkValidArguments(func, args, model) {
        for (let i = 0; i < model.length; i++) {

            let currentModel = model[i];
            if(currentModel === null) {
                continue;
            }

            let currentArgument = args[currentModel.key] || args[i];
            if(currentArgument == null && !currentModel.required) {
                continue;
            }


            let message = currentModel.key ? `field ${currentModel.key}` : `argument with index ${i}`;
            if(currentModel.required && currentArgument == null) {
                log('error', `✘ Origin: ${func.name}; Expected: required ${message}, instead got: ${currentArgument}`);
                return false;
            }


            let currentArgumentType = getConstructorName(currentArgument);
            if(typeof currentModel.type === 'string' && currentArgumentType !== currentModel.type) {
                log('error', `✘ Origin: ${func.name}; Expected: ${message} must be of type ${currentModel.type}, instead got: ${currentArgumentType} (value: ${currentArgument})`);
                return false;
            }


            let callback = currentModel.callback;
            if(typeof callback === 'function') {
                if(!callback(currentArgument, (message) => {
                        log('error', message);
                    })) {
                    return false;
                }
            }


            if((currentArgumentType === 'array' || currentArgumentType === 'object')
                && getConstructorName(currentModel.items) === 'array') {
                return checkValidArguments(func, currentArgument, currentModel.items);
            }


        }

        return true;

    }


    /**
     *
     * @param type
     * @param message
     */
    function log(type, message) {
        if (type in console) {
            console[type](message);
        }
        else {
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



    if ( typeof exports === 'object' ) {
        module.exports = typeValidation;
    }
    else {
        window.typeValidation = typeValidation;
    }

})();


