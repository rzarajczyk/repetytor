<?php
require_once 'internal/init-internal.php';
$VERSION = '1';//time();

class Template {
    private static string $name = "";

static function header($name) {
    Template::$name = $name;
    global $VERSION;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Memo</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
    <link rel="stylesheet" href="<?=Template::$name?>.css?v=<?=$VERSION; ?>">
    <link rel="stylesheet" href="_common.css?v=<?=$VERSION; ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🧠</text></svg>">
</head>
<body>

<nav>
    <div class="nav-wrapper">
        <a href="#" data-target="sidenav" class="sidenav-trigger show-on-large" id="menu"><i class="material-icons">menu</i></a>
        <a href="index.php" class="brand-logo">Memo</a>
    </div>
</nav>

<ul class="sidenav" id="sidenav">
</ul>

<div class="container">
    <!-- ================================================= -->
<?php
}

static function footer() {
    global $VERSION;
    ?>
        <!-- ================================================= -->
    </div><!-- container -->

    <div id="request-in-progress-tip">
        <div class="progress">
            <div class="indeterminate"></div>
        </div>
    </div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.js"></script>
        <script src="_common.js?v=<?=$VERSION; ?>"></script>
        <script src="<?=Template::$name?>.js?v=<?=$VERSION; ?>"></script>
    </body>
</html>

    <?php
}
}