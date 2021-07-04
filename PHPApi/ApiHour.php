<?php
    header("Access-Control-Allow-Origin: *");
    setlocale(LC_TIME,"es_ES");            
    echo strftime("Hoy es %A y son las %H:%M");
?>