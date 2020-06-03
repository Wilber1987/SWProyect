<?php
    header("Access-Control-Allow-Origin: *");
    $pMysqli = new mysqli('localhost','root','','sw_proyect');
    if(isset($_GET["param"])){
        $Param =  $_GET["param"]; 
    }else{
        $Param = "";
    }
    $query = "SELECT id, name, 
        element, archetype,
        base_stars, can_awaken, 
        leader_skill , image_filename as img,
        max_lvl_hp,
        max_lvl_attack,
        max_lvl_defense,
        speed,
        crit_rate,
        crit_damage,
        resistance,
        accuracy
        FROM monster 
        where name like '%$Param%' Limit 10";     
    $JsonArray = array();
    $result = $pMysqli->query($query);
    $JsonArray = array();
    foreach ($result as $row ) {
        $jsonObject = array();                    
        $jsonObject["img"]= $row['img'];                     
        $jsonObject["id_"]= $row['id'];
        $jsonObject["name"]= $row['name'];
        $jsonObject["element"]= $row['element'];
        $jsonObject["archetype"]= $row['archetype'];
        $jsonObject["Stars"]= $row['base_stars'];
        //$jsonObject["can_awaken"]= $row['can_awaken'];                 
        if ($row['leader_skill'] != "") {    
            $Leader = json_decode($row['leader_skill']);
            $jsonObject["leader_skill"]= $Leader->id;
        }else{
            $jsonObject["leader_skill"]= "null";
        } 

        $jsonObjectSTATS = array();
        $jsonObjectSTATS['HP'] = $row['max_lvl_hp'];                     
        $jsonObjectSTATS['ATK'] = $row['max_lvl_attack'];
        $jsonObjectSTATS['DEF'] = $row['max_lvl_defense'];
        $jsonObjectSTATS['SPD'] = $row['speed'];
        $jsonObjectSTATS['CR'] = $row['crit_rate'];
        $jsonObjectSTATS['CD'] = $row['crit_damage'];
        $jsonObjectSTATS['RES'] = $row['resistance'];
        $jsonObjectSTATS['ACC'] = $row['accuracy'];

        $jsonObjectFullSTATS = array();
        $jsonObjectFullSTATS[] = $jsonObjectSTATS;


        $IdMonster =  $jsonObject['id_'];
        $queryVideos = "SELECT id_video, url_video, categoria ,id_monster FROM tbl_videos where id_monster = $IdMonster and categoria = 'RTA'";
        $resultVideos = $pMysqli->query($queryVideos);
        $JsonArrayVideos = array();
        foreach ($resultVideos as $fila ) {
            $jsonObjectVideo = array(); 
            $jsonObjectVideo['categoria'] = $fila['categoria'];
            $jsonObjectVideo['url_video'] = $fila['url_video'];
            $jsonObjectVideo['id_video'] = $fila['id_video'];
            $jsonObjectVideo['id_monster'] = $fila['id_monster'];
            $JsonArrayVideos[] = $jsonObjectVideo;
        }
        $jsonObject["STATS_ListTable_hiddenInTable"]= json_encode($jsonObjectFullSTATS);
        $jsonObject["RTA_ListCard_hiddenInTable"]= json_encode($JsonArrayVideos);               

        $JsonArray[] = $jsonObject;
    }     
    echo json_encode(array('Monsters'=> $JsonArray)); 

    $pMysqli->close();  
?>