<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8');
//echo json_encode("post");
$JSONData = file_get_contents("php://input");
$Data = json_decode($JSONData);
//echo json_encode($Data);
$sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
$Function = $_GET["function"];
$Function($Data);
//$pMysqli = new mysqli('localhost', 'root', '', 'dbprueba');

function TakePosts($request)
{    
    try {        
        $Data = [];
        $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
        $q = $sqlLi->query("SELECT * FROM tbl_foro where title like '%$request->param%' and state = 'act' order by date desc Limit 10");
        //echo json_encode($q);
        foreach ($q as $row) {
            $Data[] = $row;
        }
        echo json_encode(array('data' => $Data));
    } catch (\Throwable $th) {
        echo json_encode($th);
    }    
}
function NewPost($request)
{
    $now = date("Y-m-d H:i:s");
    $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
    //echo "INSERT INTO tbl_foro(title, body, date) values('$request->title','real_escape_string($request->body)', '$now')";
    $body = mysqli_real_escape_string($sqlLi, $request->body);
    if (mysqli_query($sqlLi, "INSERT INTO tbl_foro(title, body, date) values('$request->title','$body', '$now')")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
function UpdatePost($request)
{
    $now = date("Y-m-d H:i:s");
    $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
    if (mysqli_query($sqlLi, "update tbl_foro set title='$request->title' , body= '$request->body' where id_post = $request->id_post")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
function UpdatePostState($request)
{
    $now = date("Y-m-d H:i:s");
    $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
    if (mysqli_query($sqlLi, "update tbl_foro set state= '$request->state' where id_post = $request->id_post")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}
function TakePostsComents($request)
{    
    try {        
        $Data = [];
        $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
        $q = $sqlLi->query("SELECT * FROM tbl_comments where id_post = $request->param  order by date desc Limit 10");
        foreach ($q as $row) {
            $Data[] = $row;
        }
        echo json_encode(array('data' => $Data));
    } catch (\Throwable $th) {
        echo json_encode($th);
    }    
}
function InsertComment($request)
{
    $now = date("Y-m-d H:i:s");
    $sqlLi = new mysqli("fdb34.awardspace.net", "3891888_swproyect", 'Wmatus09%','3891888_swproyect');
    $body = mysqli_real_escape_string($sqlLi, $request->body);
    if (mysqli_query($sqlLi, "INSERT INTO tbl_comments(body, date, id_reply, id_post, id_user)
         values('$body', '$now',$request->id_reply, $request->id_post, $request->id_user)")) {
        echo json_encode(array('success' => "true"));
    } else {
        echo json_encode(array('success' => "false"));
    }
}

function TestApi($request)
{    
    try {        
        $Data = [];
        $q = $sqlLi->query("SELECT * FROM tbl_post order by date desc Limit 10");
        foreach ($q as $row) {
            $Data[] = $row;
        }
        echo json_encode(array('data' => "SUCCESS"));
    } catch (\Throwable $th) {
        echo json_encode($th);
    }    
}