window.addEventListener('DOMContentLoaded', () => {
    let session = null
    let qInterval = null
    let qTimeElapsed = 0

    $.getAction('actions/get-decks.php')
        .onSuccess(response => {
            if (response.data.length > 0) {
                let html = response.data
                    .map(it => `<button class="btn start-button" data-id="${it.id}">${it.name}</button>`)
                    .join('')
                document.getElementById('start-buttons').innerHTML = html
            } else {
                $.one('#no-decks').style.display = 'block'
            }
            document.querySelectorAll('#start-buttons button').forEach(button => {
                let deckId = button.dataset['id']
                button.addEventListener('click', () => {
                    $.getAction(`actions/get-cards.php?deckId=${deckId}&limit=10`)
                        .onSuccess(response => {
                            let cards = response.data.map(it => new Card(it.question, it.answer, it.timeout, it.type))
                            if (cards.length === 0) {
                                alert('Zestaw pytań jest pusty')
                            } else {
                                start(cards)
                            }
                        })
                        .execute()
                })
            })
        })
        .execute()

    function start(cards) {
        session = new Session(cards)

        document.querySelector('#start-row').style.display = 'none'
        document.querySelector('#question-row').style.display = 'block'
        document.querySelector('#progress-row').style.display = 'block'
        document.querySelector('#result-row').style.display = 'none'

        render(session)
    }

    document.querySelector('#answer').addEventListener('keypress', evt => {
        if (evt.keyCode == '13') {
            check()
        }
    })

    document.querySelector('#check').addEventListener('click', (e) => {
        e.preventDefault()
        check()
    })

    function check() {
        clearInterval(qInterval)
        document.querySelector('#progressbar').style.width = '100%'
        let answer = document.querySelector('#answer').value
        let success = session.getCurrentCard().isAnswerCorrect(answer)
        session.markSuccess(success)
        let modalId = success ? 'ok-modal' : 'wrong-modal'
        let timeout = success ? 500 : 1200
        document.querySelector('#expected-result').innerHTML = session.getCurrentCard().getExpectedAnswer()
        openModalWithTimeout(modalId, timeout, () => {
            session.forward()
            if (!session.isFinished()) {
                render(session)
            } else {
                renderProgress(session)
                renderScore(session)
            }
        })
    }

    function renderScore(session) {
        document.querySelector('#question-row').style.display = 'none'
        document.querySelector('#result-row').style.display = 'block'
        let score = 100.0 * (session.getSuccessesNumber() / session.getCardsNumber())
        document.querySelector('#score-percent').innerHTML = `${score}%`
        document.querySelector('#start-row').style.display = 'block'
    }

    function render(session) {
        renderQuestion(session.getCurrentCard())
        renderProgress(session)
    }

    function renderProgress(session) {
        let html = ''
        let currentCardIndex = session.getCurrentCardIndex()
        for (let i=1; i<=session.getCardsNumber(); i++) {
            let classNames = ''
            if (currentCardIndex === i-1) {
                classNames = 'active orange'
            } else if (currentCardIndex > i-1) {
                if (session.wasSuccess(i-1)) {
                    classNames = 'active green'
                } else {
                    classNames = 'active red'
                }
            } else {
                classNames = ''
            }
            html += `<li class="waves-effect ${classNames}"><a href="#!">${i}</a></li>`
        }
        document.querySelector('#progress-row .pagination').innerHTML = html
    }

    function renderQuestion(card) {
        $.one('#question').innerHTML = card.getQuestion()
        $.one('#answer').value = ''
        $.one('#answer').focus()
        $.one('#answer').type = card.getType()
        let cardTimeout = session.getCurrentCard().getTimeout()
        let interval = 100
        qTimeElapsed = 0
        qInterval = setInterval(() => {
            qTimeElapsed += interval
            let percent = 100.0 * (1.0 - (qTimeElapsed / cardTimeout))
            document.querySelector('#progressbar').style.width = `${percent}%`
            if (qTimeElapsed >= cardTimeout) {
                check()
            }
        }, interval)
    }

    function openModalWithTimeout(modalId, timeout, callback = () => {}) {
        let modal = M.Modal.getInstance(document.querySelector(`#${modalId}`))
        modal.open()
        setTimeout(() => {
            modal.close()
            callback()
        }, timeout)
    }
} )

class Session {
    constructor(cards) {
        this.cards = cards
        this.step = 0
        this.progress = []
    }

    getCurrentCard() {
        return this.cards[this.step]
    }

    getCurrentCardIndex() {
        return this.step
    }

    getCardsNumber() {
        return this.cards.length
    }

    markSuccess(success) {
        this.progress[this.step] = success
    }

    wasSuccess(step) {
        return this.progress[step]
    }

    getSuccessesNumber() {
        return this.progress.filter(it => it).length
    }

    forward() {
        if (this.step < this.cards.length) {
            this.step += 1
        }
    }

    isFinished() {
        return this.step >= this.cards.length
    }
}

class Card {
    constructor(question, answer, timeout, type) {
        this.question = question
        this.answer = answer
        this.timeout = timeout
        this.type = type
    }

    getQuestion() {
        return this.question
    }

    isAnswerCorrect(answer) {
        return answer.trim() === this.answer.trim()
    }

    getExpectedAnswer() {
        return this.answer
    }

    getTimeout() {
        return this.timeout
    }
    
    getType() {
        return this.type
    }
}