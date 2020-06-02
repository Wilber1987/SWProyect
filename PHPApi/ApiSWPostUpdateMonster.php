<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8'); 

$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData);

    //$pMysqli = new mysqli('localhost','root','','sw_proyect');
    $pMysqli = mysqli_connect('localhost','root','','sw_proyect');
    mysqli_select_db($pMysqli, 'sw_proyect');

    $id =   $dataObject->id_; 
    $name =  $dataObject->name; 
    $element =   $dataObject->element;   
    $archetype =   $dataObject->archetype;
    $base_stars =   $dataObject->base_stars;   
    $can_awaken =   $dataObject->can_awaken; 
    $leader_skill =   $dataObject->leader_skill; 

    if($id != -1){
        $queryUpdate =  "UPDATE monster 
        SET name = '$name' , element = '$element', archetype = '$archetype' , base_stars = '$base_stars',
        can_awaken = '$can_awaken', leader_skill = '$leader_skill'
        WHERE id= $id";   
        $resultUpdate = mysqli_query($pMysqli, $queryUpdate);
        if($resultUpdate)
        {
           echo json_encode(array('success'=>"Ok"));
        }
        else
        {
            echo json_encode(array('success'=>"Fail"));
        }
    }
    else {
         $query = "INSERT INTO monster (name, element, archetype, base_stars, can_awaken, leader_skill)
         VALUES ($name, $element, $archetype, $base_stars, $can_awaken, $leader_skill)";    
         //$resultado = mysqli_query($pMysqli, $query);
         //if ($resultado = $pMysqli->query($query)) {
         if($resultado = mysqli_query($pMysqli, $query)){ 
               echo json_encode(array('success'=>"Ok"));
         } else {
               echo json_encode(array('success'=>"Fail"));       
         }  
    }
?>