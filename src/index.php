<?php
require_once 'internal/init.php';
require_once '_template.php';

Template::header('index');

?>
    <div class="row" id="question-row">
        <div class="col s12">
            <div class="card">
                <div class="card-content">
                    <div class="card-title"></div>
                    <div id="question"></div>
                    <div>
                        <input type="number" id="answer">
                    </div>
                    <div class="progress">
                        <div id="progressbar" class="determinate"></div>
                    </div>
                </div>
                <div class="card-action">
                    <button href="#!" id="check" class="btn">sprawdź</button>
                </div>
            </div>
        </div>
    </div>

    <div class="row" id="result-row">
        <div class="col s12">
            <div class="card">
                <div class="card-content">
                    <span class="card-title">Twój wynik</span>
                    <div id="score">
                        <div id="score-percent" class="score-info">0</div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div class="row" id="progress-row">
        <div class="col s12">
            <div class="card">
                <div class="card-content" id="progress-ul">
                    <ul class="pagination">
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <div class="row" id="start-row">
        <div class="col s12" id="start-buttons">
        </div>
        <div id="no-decks">
            <div class="infobox light-blue lighten-4">
                <i class="medium material-icons left">list</i>
                <div class="msg valign-wrapper">
                    <span>Nie masz zdefiniowanych zestawów pytań.<br>
                        Zalogowani użytkownicy mogą dodawać zestawy pytań na stronie <a href="decks.php">Zestawy pytań</a></span>
                </div>
                <div class="float-fixer"></div>
            </div>
        </div>
    </div>

    <div class="modal" id="ok-modal">
        <div class="modal-content">
            <div class="emoji">✅</div>
        </div>
    </div>

    <div class="modal" id="wrong-modal">
        <div class="modal-content">
            <div class="emoji">❌</div>
            <div id="expected-result"></div>
        </div>
    </div>

<?php Template::footer(); ?>