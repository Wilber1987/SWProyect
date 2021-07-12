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
$pMysqli = new mysqli('localhost', 'root', '', 'dbprueba');
function GlobalData($request)
{
    $q = Insert($request, "globaldata");
    echo true;
}
function MonPickData($request)
{
    echo "heare";
    //echo json_encode($request->dataForm);
    try {
        // $pMysqli->begin_transaction(MYSQLI_TRANS_START_READ_ONLY);
        // foreach ($request->dataForm as $key => $value) {
        //     $Data = Get("monpickdata", 
        //     "WHERE id_battle= $value->id_battle 
        //     AND user = $value->user
        //     and unit_master_id = $value->unit_master_id");
        //     if (count($Data) == 0) {
        //         Insert($value, "monpickdata");
        //     }            
        // }
        // $pMysqli->close();
        echo true;
    } catch (\Throwable $th) {
        echo json_encode($th);
    }
    
}
function GetModel($request, $tableName)
{
    $Form = [];
    $q = $pMysqli->query("DESCRIBE  $tableName");
    foreach ($q as $row) {
        $Form[] = $row;
    }
    echo json_encode(array('Form' => $Form));
}
function Get($tableName, $condicion = "")
{
    $Form = [];
    $q = $pMysqli->query("SELECT * FROM  $tableName $condicion");
    foreach ($q as $row) {
        $Form[] = $row;
    }
    return $Form;
    //echo json_encode(array('data' => $Form));
}
function Insert($request, $tableName)
{
    $colums = "";
    $values = "";
    foreach ($request->dataForm as $key => $value) {
        if ($key != "id") {
            $colums = $colums . $key . ",";
            $values = $values . "'" . $value . "',";
        }
    }
    $colums = substr($colums, 0, -1);
    $values = substr($values, 0, -1);
    if (mysqli_query($pMysqli, "INSERT INTO $tableName($colums) values($values)")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
function Update($request, $tableName)
{
    $values = "";
    foreach ($request->dataForm as $key => $value) {
        if ($key != "id") {
            $values = $values . " $key = '$value',";
        }
    }
    $values = substr($values, 0, -1);
    $id = $request->dataForm->id;
    $query = "UPDATE $tableName SET $values where id = $id";
    if (mysqli_query($pMysqli, $query)) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
function Delete($request, $tableName)
{
    # code...
}
