window.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // Step 1 - render navigation
    // ======================================================
    function toMenuItem(it) {
        if (it.type == 'link') {
            return `<li><a href="${it.link}" class="waves-effect">${it.name}</a>`;
        } else if (it.type == 'divider') {
            return '<li><div class="divider" class="waves-effect"></div></li>';
        } else if (it.type == 'user') {
            return `
            <li><div class="user-view deep-purple darken-4">
            <!--                  <a href="#user"><img class="circle" src="images/yuna.jpg"></a>-->
                <i class="material-icons large white-text">person</i>
              <a href="#!"><span class="white-text name">${it.username}</span></a>
              <a href="#!"><span class="white-text email">${it.email}</span></a>
            </div></li>
        `
        }
    }

    $.getAction('actions/get-navigation.php')
        .onSuccess(response => {
            const html = response['navigation'].map(it => toMenuItem(it)).join('')
            document.querySelectorAll('#sidenav').forEach(it => it.innerHTML += html)
            return response
        }).execute()

    // ======================================================
    // Step 2 - init Materialize.css fields
    // ======================================================

    M.AutoInit()

    // ======================================================
    // Step 3 - attach custom validators
    // ======================================================

    $.all('input[type=text],input[type=password]')
        .filter(it => it.dataset['validator'] !== undefined)
        .forEach(it => {
            window.VALIDATION_SERVICE.attachFieldValidator(it, it.dataset['validator'])
        })

    $.all('button')
        .filter(it => it.dataset['require'] !== undefined)
        .forEach(it => {
            window.VALIDATION_SERVICE.attachRequireValidator(it, it.dataset['require'])
        })
});

const $ = {
    one: selector => document.querySelector(selector),
    all: (selector, toArray=true) => {
        let nodeList = document.querySelectorAll(selector)
        return toArray ? Array.from(nodeList) : nodeList
    },
    modal: selector => M.Modal.getInstance($.one(selector)),
    postAction: url => new Action('POST', url),
    getAction: url => new Action('GET', url),
    updateTextFields: () => {
        window.VALIDATION_SERVICE.revalidate()
        M.updateTextFields()
    },
    onLoad: callback => window.addEventListener('DOMContentLoaded', callback),
    attachExtraValidator: (selector, validator) => window.VALIDATION_SERVICE.attachExtraValidator($.one(selector), validator),
}

// ================================================================================================================================================================
// Async Actions support
// ================================================================================================================================================================


class RequestDetails {
    constructor(url, method, status, statusText) {
        this.url = url
        this.method = method
        this.status = status
        this.statusText = statusText
    }

    toString() {
        return `HTTP ${this.method} ${this.url} : ${this.status} ${this.statusText}`
    }
}

class FailureDetails {
    constructor(reason) {
        this.type = reason?.type ?? ''
        this.message = reason?.message ?? ''
        this.details = reason?.details ?? ''
        this.trace = reason?.trace ?? ''
    }
}
FailureDetails.INVALID_JSON_STRUCTURE = json => new FailureDetails({
    type: 'InvalidJsonStructure',
    message: 'Provided JSON has invalid structure',
    details: json,
    trace: []
})

class NokHttpError extends Error {
    constructor(text, details) {
        super(`Http request finished with error: ${details.toString()}\n${text}`)
        this.details = details
    }

    getDetails() {
        return this.details
    }
}

class Action {
    constructor(method, url) {
        this._url = url
        this._method = method
        this._body = null
        this._onSuccessCallback = () => {}
        this._onErrorCallback = Http.genericExceptionHandler
        this._onExceptionCallbacks = new Map()
        this._onExceptionCallbacks.set('NotLoggedInException', Http.notLoggedInExceptionHandler)
    }
    data(data) {
        if (data === null) {
            this._body = null
        } else {
            let formData = new FormData()
            for (const [k, v] of Object.entries(data)) {
                formData.append(k, v)
            }
            this._body = formData
        }
        return this
    }

    /**
     * Callback executed when Action is successful
     * @param callback (json, details) => { code... }
     * @returns {Action}
     */
    onSuccess(callback) {
        this._onSuccessCallback = callback
        return this
    }

    /**
     * Callback executed when JS exception is thrown. Generally, unexpected thing
     * Note: HTTP 500 is also reported as exception!
     * Also note: default handler does console.log + alert. If custom handler set, default will be overriden
     * @param callback (exceptions, details) => { code ... }
     * @returns {Action}
     */
    onError(callback) {
        this._onErrorCallback = callback
        return this
    }

    /**
     * Callback when "expected" problem occurs, manifested by HTTP 200 + JSON with problem details
     * @param name error name
     * @param callback (details, trace, message, error name) => {}
     * @returns {Action}
     */
    onException(name, callback) {
        this._onExceptionCallbacks.set(name, callback)
        return this
    }
    execute() {
        Http.showProgressBar()
        fetch(this._url, {method: this._method, body: this._body})
            .then(response => this._handle(response))
            .catch(exception => this._handleException(exception))
    }
    _handle(response) {
        Http.hideProgressBar()
        if (response.ok) {
            return response.json()
                .then(json => this._handleHttpOk(response.status, response.statusText, json))
        } else {
            return response.text()
                .then(text => this._handleHttpNok(response.status, response.statusText, text))
        }
    }
    _handleHttpOk(status, statusText, json) {
        const requestDetails = new RequestDetails(this._url, this._method, status, statusText)
        const actionSuccessful = json?.status ?? false
        if (actionSuccessful) {
            this._onSuccessCallback(json, requestDetails)
        } else {
            if (json.status == undefined) {
                const failureDetails = FailureDetails.INVALID_JSON_STRUCTURE(json)
                const type = failureDetails.type
                const handler = this._onExceptionCallbacks.get(type) ?? Http.genericActionFailureHandler
                handler(failureDetails, requestDetails)
            } else {
                const failureDetails = new FailureDetails(json?.reason)
                const type = failureDetails.type
                const handler = this._onExceptionCallbacks.get(type) ?? Http.genericActionFailureHandler
                handler(failureDetails, requestDetails)
            }
        }
    }
    _handleHttpNok(status, statusText, text) {
        const details = new RequestDetails(this._url, this._method, status, statusText)
        throw new NokHttpError(text, details)
    }
    _handleException(exception) {
        let details = null
        if (exception instanceof NokHttpError) {
            details = exception.getDetails()
        } else {
            details = new RequestDetails(this._url, this._method, null, null)
        }
        this._onErrorCallback(exception, details)
    }
}

const Http = {
    _counter: 0,
    showProgressBar: () => {
        Http._counter++
        $.one('#request-in-progress-tip').style.display = 'block'
    },
    hideProgressBar: () => {
        Http._counter--
        if (Http._counter == 0) {
            $.one('#request-in-progress-tip').style.display = 'none'
        }
    },
    genericExceptionHandler: (exception, requestDetails) => {
        const message = `Error ${exception.constructor.name} from ${requestDetails}`
        console.log(message)
        console.log(exception)
        alert(message)
    },
    genericActionFailureHandler: (failureDetails, requestDetails) => {
        const message = `Error ${failureDetails.type} from ${requestDetails}: ${failureDetails.message}`
        console.log(message)
        console.log(failureDetails)
        alert(message)
    },
    notLoggedInExceptionHandler: () => {
        // alert('Not logged in')
        location.href = 'login.php'
    }
}

// ================================================================================================================================================================
// FORM VALIDATION
// ================================================================================================================================================================

class ValidationResult {
    constructor(valid, message) {
        this.valid = valid
        this.message = message
    }
}
ValidationResult.OK = new ValidationResult(true, '')
ValidationResult.TOO_SHORT = (count) => new ValidationResult(false, `Podaj przynajmniej ${count} znaki/znaków`)
ValidationResult.TOO_LONG = (count) => new ValidationResult(false, `Podaj nie więcej niż ${count} znaki/znaków`)
ValidationResult.INVALID_CHARS = (chars) => new ValidationResult(false, `Podano niedozwolone znaki: ${chars}`)
ValidationResult.WRONG_EMAIL = () => new ValidationResult(false, "Podaj poprawny adres email")
ValidationResult.INVALID_ENUM_VALUE = (values) => new ValidationResult(false, `Niepoprawna wartość, podaj jedną z wartości: ${values.join(", ")}`)

class ValidationService {
    constructor() {
        this.validators = new Map()
        this.revalidateCandidates = []
    }

    add(definition) {
        this.validators.set(definition['name'], definition)
    }

    validate(name, string) {
        let {minLength, maxLength, allowedCharSet, type, values} = this.validators.get(name)
        if (type == 'TYPE_EMAIL') {
            let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!re.test(string)) {
                return ValidationResult.WRONG_EMAIL()
            }
            let input = $.one('#email-validation-helper')
            input.value = string
            if (!input.checkValidity()) {
                return ValidationResult.WRONG_EMAIL()
            }
        } else if (type == 'TYPE_ENUM') {
            if (!values.included(string)) {
                return ValidationResult.INVALID_ENUM_VALUE(values)
            }
        } else {
            if (string.length < minLength) {
                return ValidationResult.TOO_SHORT(minLength)
            }
            if (string.length > maxLength) {
                return ValidationResult.TOO_LONG(maxLength)
            }
            if (allowedCharSet != '') {
                const regex = new RegExp(`[^${allowedCharSet}]+`, "g")
                let match = string.match(regex)
                if (match) {
                    const invalidChars = match.join('')
                    return ValidationResult.INVALID_CHARS(invalidChars)
                }
            }
        }
        return ValidationResult.OK
    }

    attachExtraValidator(input, condition) {
        if (input.extraValidators == undefined) {
            input.extraValidators = [condition]
        } else {
            input.extraValidators.push(condition)
        }
    }

    attachFieldValidator(input, name) {
        if (!this.validators.has(name)) {
            console.error(`Trying to attach unknown validator ${name}`, input)
            return
        }
        let wrapper = input.closest('.input-field')
        if (!wrapper) {
            console.warn(`Input ${input} not wrapped in .input-field!`)
        } else {
            let helper = wrapper.querySelector('.helper-text')
            if (!helper) {
                console.warn('Missing <span class="helper-text"></span> - validation texts will not be shown!', input)
            }
        }
        input.revalidate = () => {
            let value = input.value
            let validationResult = this.validate(name, value)
            let extraValidationResult = ''
            if (input.extraValidators) {
                let invalidResults = input.extraValidators
                    .map(it => it())
                    .filter(it => it != '')
                if (invalidResults.length > 0) {
                    extraValidationResult = invalidResults[0]
                }
            }
            if (validationResult.valid && extraValidationResult == '') {
                input.setCustomValidity('')
                input.classList.add('valid')
                input.classList.remove('invalid')
            } else {
                let message = extraValidationResult != '' ? extraValidationResult : validationResult.message
                input.setCustomValidity(message)
                input.classList.add('invalid')
                input.classList.remove('valid')
                let helper = input.closest('.input-field')?.querySelector('.helper-text')
                if (helper) {
                    helper.dataset['error'] = message
                }
            }
        }
        input.addEventListener('keyup', () => input.revalidate())
        input.revalidate()
        this.revalidateCandidates.push(input)
    }

    revalidate() {
        this.revalidateCandidates.forEach(it => it.revalidate())
    }

    attachRequireValidator(button, idsOfRequiredInputs) {
        let required = idsOfRequiredInputs.split(',').map(it => it.trim())
        required.forEach(it => {
            if (!$.one(`#${it}`)) {
                console.error(`Require Validator initialized with not existing field ${it}`)
                throw `Require Validator initialized with not existing field ${it}`
            }
        })
        let expression = required.map(it => `#${it}`).join(', ')
        button.revalidate = () => {
            let enabled = $.all(expression).every(it => it.classList.contains('valid'))
            button.disabled = !enabled
        }
        $.all(expression).forEach(input => {
            input.addEventListener('keyup', () => {
                if (input.revalidate) {
                    input.revalidate()
                }
                button.revalidate()
            })
        })
        button.revalidate()
        this.revalidateCandidates.push(button)
    }
}

window.VALIDATION_SERVICE = new ValidationService()