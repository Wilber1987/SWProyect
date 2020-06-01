<?php
    header("Access-Control-Allow-Origin: *");
    $pMysqli = new mysqli('localhost','root','','sw_proyect');   
    $query = "SELECT id, name, element, archetype, base_stars, can_awaken, leader_skill 
         FROM monster Limit 20";   
  
    $JsonArray = array();
    if ($pMysqli->multi_query($query)) { 
        do {
            /* almacenar primer juego de resultados */
            if ($result = $pMysqli->store_result()) {
                while ($row = $result->fetch_row()) {
                    $jsonObject = array();                   
                    $jsonObject["id_"]= $row[0];
                    $jsonObject["name"]= $row[1];
                    $jsonObject["element"]= $row[2];
                    $jsonObject["archetype"]= $row[3];
                    $jsonObject["base_stars"]= $row[4];
                    $jsonObject["can_awaken"]= $row[5];                 
                    if ($row[6] != "") {    
                        $Leader = json_decode($row[6]);
                        $jsonObject["leader_skill"]= $Leader->id;
                    }else{
                        $jsonObject["leader_skill"]= "null";
                    }
                    $JsonArray[] = $jsonObject;
                }
                $result->free();
            }
           
        } while ($pMysqli->next_result());
        echo json_encode(array('Monsters'=> $JsonArray)); 
    }
    $pMysqli->close();  
?>