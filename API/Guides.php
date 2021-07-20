<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8');
echo json_encode("post");
$JSONData = file_get_contents("php://input");
$Data = json_decode($JSONData);
echo json_encode($Data);
$Function = $_GET["function"];
$Function($Data);
//$pMysqli = new mysqli('localhost', 'root', '', 'dbprueba');
function GetGuides($request)
{    
    try {        
        $Data = [];
        echo json_encode($Data);
    } catch (\Throwable $th) {
        echo json_encode($th);
    }    
}
