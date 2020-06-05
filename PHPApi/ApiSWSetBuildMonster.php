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

    
    $files = $dataObject->files;

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
        
        if (($_FILES["file"]["type"] == "image/pjpeg")
            || ($_FILES["file"]["type"] == "image/jpeg")
            || ($_FILES["file"]["type"] == "image/png")
            || ($_FILES["file"]["type"] == "image/gif")) {
            if (move_uploaded_file($_FILES["file"]["tmp_name"], "Media/buildImage/ ".$_FILES['file']['name'])) {
                //more code here...
                //echo "images/".$_FILES['file']['name'];
            } else {
                //echo 0;
            }
        } else {
           // echo 0;
        }
         if($resultado = mysqli_query($pMysqli, $query)){ 
               echo json_encode(array('success'=>"Ok"));
         } else {
               echo json_encode(array('success'=>"Fail"));       
         }  
    }
?>