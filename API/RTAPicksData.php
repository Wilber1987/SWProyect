<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Content-Type: application/json; charset=utf-8');
//echo "post";
$JSONData = file_get_contents("php://input");
$Data = json_decode($JSONData);
//echo json_encode($Data);
$Function = $_GET["function"];
$pMysqli = new mysqli('localhost', 'root', '', 'sw_proyect');
$Function($Data, $pMysqli);

function RTAData($request, $pMysqli)
{
    //echo "function: ";
    $pMysqli = new mysqli('localhost', 'root', '', 'sw_proyect');
    $Monsters = [];
    $MonPickData = [];
    $M = $pMysqli->query("SELECT * FROM  monsterlist");
    foreach ($M as $row) {
        $Monsters[] = $row;
    }
    //echo json_encode($Mon);
    //$q = $pMysqli->query("SELECT * FROM  monpickdataseason18");
    $q = $pMysqli->query("SELECT * FROM  monpickdata");
    $i = 0;
    foreach ($q as $row) {
        //$i++;
        $MonPickData[] = $row;
    }
    //echo print_r($MonPickData);
    $RTAPicksData = [];
    $SelectedSeason = "Season19";
    //$SelectedSeason = "Season18";
    $NPartidos = count($MonPickData) / 10;
    foreach ($Monsters as $Mon) {
        //echo print_r($Mon);
        $MonDataPicks = array_filter($MonPickData, function ($mon) use ($Mon) {
            //echo print_r($mon);
            return $mon["unit_master_id"] == $Mon["com2us_id"];
        });
        //  echo "filtro: ";
        //echo count($MonDataPicks);

        if (count($MonDataPicks) != 0) {
            //echo "count:" . print_r(count($MonDataPicks));
            $Pick_Rate = count($MonDataPicks);

            $Win_Rate = count(array_filter($MonDataPicks, function ($mon) {
                return $mon["win"] == true;
            }));

            $Banned_Rate = count(array_filter($MonDataPicks, function ($mon) {
                return $mon["banned"] == true;
            }));
            $Leader = count(array_filter($MonDataPicks, function ($mon) {
                return $mon["leader"] == true;
            }));
            $FirstPick = count(array_filter($MonDataPicks, function ($mon) {
                return $mon["pick_slot_id"] == 1;
            }));
            $LastPick = count(array_filter($MonDataPicks, function ($mon) {
                return $mon["pick_slot_id"] == 5;
            }));
            if (($Pick_Rate - $Banned_Rate) == 0) {
                continue;
            }
            $Mon["Pick_Rate"] = ($Pick_Rate / $NPartidos * 100);
            $Mon["Win_Rate"] = ($Win_Rate / ($Pick_Rate - $Banned_Rate) * 100);
            $Mon["FirstPick"] = ($FirstPick / $Pick_Rate * 100);
            $Mon["LastPick"] = ($LastPick / $Pick_Rate * 100);
            $Mon["Banned_Rate"] = ($Banned_Rate / $Pick_Rate * 100);
            $Mon["Leader"] = ($Leader / $Pick_Rate * 100);

            $Mon["PickValue"] = $Pick_Rate;
            $Mon["WinValue"] = $Win_Rate;
            $Mon["FirstPickValue"] = $FirstPick;
            $Mon["LastPickValue"] = $LastPick;
            $Mon["BannedValue"] = $Banned_Rate;
            $Mon["LeaderValue"] = $Leader;

            $Mon["Season"] = $SelectedSeason;
            $Mon["countFilter"] = $NPartidos;
            $SeasonScore = 0;
            $Win_RateScore = 0;
            $Banned_RateScore = 0;
            $FirstPickScore = ($FirstPick / $Pick_Rate * 100) * 0.05;
            //EVALUACION
            #region WINRATE--------------------
            // if (($Mon["Win_Rate"] >= 55) && 
            //     ($Mon["Pick_Rate"] >= 25 )) {
            //     //RATE >55 CON 20
            //     $Win_RateScore = $Mon["Win_Rate"] * 0.70;
            // }else if (($Mon["Win_Rate"] >= 55) && 
            //     ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {                   
            //     //RATE >55 CON 20-10
            //     $Win_RateScore = $Mon["Win_Rate"] * 0.65;
            // }else if (($Mon["Win_Rate"] >= 55) && 
            //     ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
            //     //RATE >55 CON 10-5
            //     $Win_RateScore = $Mon["Win_Rate"] * 0.60;
            // }//MAYORES ---------------> 55---------------------------------------------------------------------->
             /* if ($Mon["Win_Rate"] >= 50 &&
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE 55-50 CON 20                
                $Win_RateScore = $Mon["Win_Rate"] * 0.7;
            }else if ($Mon["Win_Rate"] >= 50 &&
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE 55-50 CON > 20 - 10
                $Win_RateScore = $Mon["Win_Rate"] * 0.65;
            }else if ($Mon["Win_Rate"] >= 50 &&
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE 55-50 CON > 10 - 5
                $Win_RateScore = $Mon["Win_Rate"] * 0.60;
            }//ENTRE  ---------------> 55 - 50------------------------------------------------------------------->
            else */
            if ($Mon["Win_Rate"] >= 55 &&
                ($Mon["Pick_Rate"] >= 10 )) {
                    //RATE 50-45 CON 220
                    $Win_RateScore = $Mon["Win_Rate"] * 0.75;
            }else if ($Mon["Win_Rate"] >= 45 &&
                ($Mon["Pick_Rate"] >= 40 )) {
                    //RATE 50-45 CON 220
                    $Win_RateScore = $Mon["Win_Rate"] * 0.75;
            } else  if ($Mon["Win_Rate"] >= 45 &&
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE 50-45 CON 220
                $Win_RateScore = $Mon["Win_Rate"] * 0.7;
            } else if ($Mon["Win_Rate"] >= 45 &&
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE 50-45 CON > 20 -10
                $Win_RateScore = $Mon["Win_Rate"] * 0.65;
            } else if ($Mon["Win_Rate"] >= 45 &&
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE 50-45 CON > 10 - 5
                $Win_RateScore = $Mon["Win_Rate"] * 0.60;
            }//ENTRE  ---------------> 50 - 45------------------------------------------------------------------->
            else if ($Mon["Win_Rate"] >= 40 &&
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE 45-40 CON > 20
                $Win_RateScore = $Mon["Win_Rate"] * 0.65;
            }else if ($Mon["Win_Rate"] >= 40 &&
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE 50-45 CON > 20 - 10
                $Win_RateScore = $Mon["Win_Rate"] * 0.60;
            }else if ($Mon["Win_Rate"] >= 40 &&
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE 50-45 CON > 10 - 5
                $Win_RateScore = $Mon["Win_Rate"] * 0.55;
            } //ENTRE  ---------------> 45 - 40------------------------------------------------------------------->
            else if ( $Mon["Pick_Rate"] >= 1 ){
                $Win_RateScore = $Mon["Win_Rate"] * 0.5;
            }
            #endregion
            //############# BANNED RATE
            #region BENNED--------------------
            if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE >30 CON 20
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.4;
            }else if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE >30 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.30;
            }else if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE >30 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.2;
            }
            
            else if (($Mon["Banned_Rate"] > 25) && 
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE >25 CON 20
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.35;
            }else if (($Mon["Banned_Rate"] > 25) && 
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE >25 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.25;
            }else if (($Mon["Banned_Rate"] > 25) && 
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE >25 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.15;
            }
            else if (($Mon["Banned_Rate"] > 15) && 
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE >20 CON 20
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.20;
            }else if (($Mon["Banned_Rate"] > 15) && 
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE >20 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.15;
            }else if (($Mon["Banned_Rate"] > 15) && 
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE >20 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.10;
            }
            else if ( $Mon["Pick_Rate"] >= 1 ) {
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.05;
            }
             #endregion

            $Mon["SeasonScore"] =  ($Win_RateScore + $Banned_RateScore + $FirstPickScore) * 2;
            if ($Mon["SeasonScore"] > 100) {
                $Mon["SeasonScore"] = 100;
            }
            if (($Pick_Rate / $NPartidos * 100) > 0.01) {
                array_push($RTAPicksData, $Mon);
            }
            //echo print_r($Mon);
        }
    }
    echo json_encode($RTAPicksData);
    return;
}
