<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8'); 

$JSONData = file_get_contents("php://input");
$dataObject = json_decode($JSONData);

    $pMysqli = mysqli_connect('localhost','root','','sw_proyect');
    mysqli_select_db($pMysqli, 'sw_proyect');
    $id =   $dataObject->id; 
    $Descripcion =   $dataObject->Descripcion;  
    if($id == -1){      
    }
    else {
        $filepathBD = "Media/buildImage/image.png";
        $filepath = "../Media/buildImage/image.png"; // or image.jpg       
        $data = $dataObject->files;       
        $fileBin = file_get_contents($data);
        $mimeType = mime_content_type($data);
        file_put_contents($filepath, $fileBin);

        $query = "INSERT INTO build_monsters(id_monster, descripcion, image)
        VALUES ($id, '$Descripcion', '$filepathBD')"; 
        // move_uploaded_file($files->tmp_name, "Media/buildImage/".$files->name);   

         if($resultado = mysqli_query($pMysqli, $query)){ 
               echo json_encode(array('success'=>"Ok"));
         } else {
               echo json_encode(array('success'=>"Fail"));       
         }  
    }
?>