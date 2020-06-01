<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');


header('Content-Type: application/json; charset=utf-8'); 

$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData);

    $pMysqli = new mysqli('localhost','root','','sw_proyect');

    $id =   $dataObject->id_; 
    $name =  $dataObject->name; 
    $element =   $dataObject->element;   
    $archetype =   $dataObject->archetype;
    $base_stars =   $dataObject->base_stars;   
    $can_awaken =   $dataObject->can_awaken; 
    $leader_skill =   $dataObject->leader_skill; 

    $query =  "UPDATE monster 
    SET name = '$name' , element = '$element', archetype = '$archetype' , base_stars = 'base_stars'
    can_awaken = '$can_awaken', leader_skill = '$leader_skill'
    WHERE id= $id";
    //$query = "UPDATE INTO Users (id, username, fecha, password) VALUES ($id, '$user', '$fecha', '$pass')";

    if ($resultado = $pMysqli->query($query)) { 
        echo json_encode(array('success'=>"Ok"));
       // $resultado->close();
    } else {
         echo json_encode(array('success'=>"Fail"));
        // $resultado->close();
    }   
    // echo json_encode(array('success'=>"Fail"));
?>