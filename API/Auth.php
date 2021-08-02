<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8');
//echo json_encode("post");
$JSONData = file_get_contents("php://input");
$Data = json_decode($JSONData);
//echo json_encode($Data);
$sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%', '3891888_swproyect');
$Function = $_GET["function"];
$Function($Data);
//$pMysqli = new mysqli('localhost', 'root', '', 'dbprueba');

function login($request)
{
    try {
        $password = $request->password;
        $Data = [];
        $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%', '3891888_swproyect');
        $q = $sqlLi->query(
            "SELECT * FROM tbl_users
            where nickname = '$request->nickname'
            and password = '$password'
            and state = 'act' Limit 1"
        );
        //echo json_encode($q);
        foreach ($q as $row) {
            $Data[] = $row;
        }
        if (count($Data) != 0) {
            # code...
            echo json_encode(array(
                'success' => true,
                'data' => $Data[0],
            ));
            return;
        }
        echo json_encode(array('success' => false));
    } catch (\Throwable $th) {
        echo json_encode($th);
    }
}
function Register($request)
{
    $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%', '3891888_swproyect');
    $password = $request->password;
    if (mysqli_query(
        $sqlLi,
        "INSERT INTO tbl_users(
            nickname,
            name,
            surnames,
            birthday,
            mail,
            password,
            photo,
            state
        ) values(
            '$request->nickname',
            '$request->name',
            '$request->surnames',
            '$request->birthday',
            '$request->mail',
            '$password',
            '$request->photo',
            'act'
        )")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
