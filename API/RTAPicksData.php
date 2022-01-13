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

function Get($conect, $tableName, $condicion = "")
{
    try {
        $Form = [];
        mysqli_query($conect, "SET NAMES 'utf8'");
        $q = $conect->query("SELECT * FROM  $tableName $condicion");
        //echo "error: SELECT * FROM  $tableName $condicion <hr>";
        // while ($fila = $q->fetch_object()) {
        //     $Form[] = $fila;
        // }
        foreach ($q as $row) {
        //$i++;
            $MonPickData[] = $row;
        }
        return $Form;
    } catch (\Throwable $th) {
        echo "error: SELECT * FROM  $tableName $condicion <hr>";
    }
}
function RTAData($request, $pMysqli)
{
    //echo "function: ";
    $SelectedSeason = "Season20";
    $pMysqli = new mysqli('localhost', 'root', '', 'sw_proyect');
    $Monsters = [];
    $MonPickData = [];
    $M = $pMysqli->query("SELECT * FROM  monster");
    foreach ($M as $row) {
        $Monsters[] = $row;
    }
    //echo json_encode($Mon);
    //$q = $pMysqli->query("SELECT * FROM  monpickdataseason18");
    //$q = $pMysqli->query("SELECT * FROM  monpickdata where temp = 'Season20-P1' and rank <= 12000");
    $q = $pMysqli->query("SELECT * FROM `monpickdata` where temp = '$SelectedSeason' and rank <= 12000  GROUP BY id_battle");
    $i = 0;
    foreach ($q as $row) {
        //$i++;
        $MonPickData[] = $row;
    }
    //echo print_r($MonPickData);
    $RTAPicksData = [];
    
    //$SelectedSeason = "Season18";
    $NPartidos = count($MonPickData) / 10;
    foreach ($Monsters as $Mon) {
        $MonId = $Mon["com2us_id"];
        //echo print_r($Mon);
        $MonDataPicks = array_filter($MonPickData, function ($mon) use ($Mon) {
            //echo print_r($mon);
            return $mon["unit_master_id"] == $Mon["com2us_id"];
        });
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
                return $mon["firstPick"] == true;
            }));
            $FirstPickInTeam = count(array_filter($MonDataPicks, function ($mon) {
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
            $Mon["FirstPickInTeam"] = ($FirstPickInTeam / $Pick_Rate * 100);
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
            #region WINN
            if ($Mon["Win_Rate"] >= 45 &&
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
                $Win_RateScore = $Mon["Win_Rate"] * 0.55;
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
                $Win_RateScore = $Mon["Win_Rate"] * 0.50;
            } //ENTRE  ---------------> 45 - 40------------------------------------------------------------------->
            else if ( $Mon["Pick_Rate"] >= 2 ){
                $Win_RateScore = $Mon["Win_Rate"] * 0.4;
            } else if ( $Mon["Pick_Rate"] >= 0.4 ){
                $Win_RateScore = $Mon["Win_Rate"] * 0.3;
            } else  if ( $Mon["Pick_Rate"] >= 0.1 ){
                $Win_RateScore = $Mon["Win_Rate"] * 0.2;
            }
            #endregion
            //############# BANNED RATE
            #region BENNED--------------------
            if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE >30 CON 20
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.35;
            }else if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE >30 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.25;
            }else if (($Mon["Banned_Rate"] > 30) && 
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE >30 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.20;
            }
            
            else if (($Mon["Banned_Rate"] > 25) && 
                ($Mon["Pick_Rate"] >= 25 )) {
                //RATE >25 CON 20
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.30;
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
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.25;
            }else if (($Mon["Banned_Rate"] > 15) && 
                ($Mon["Pick_Rate"] < 25 && $Mon["Pick_Rate"] >= 10)) {
                //RATE >20 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.20;
            }else if (($Mon["Banned_Rate"] > 15) && 
                ($Mon["Pick_Rate"] < 10 && $Mon["Pick_Rate"] >= 5)) {
                //RATE >20 CON 20-10
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.15;
            }
            else if ( $Mon["Pick_Rate"] >= 0.4 ) {
                $Banned_RateScore = $Mon["Banned_Rate"] * 0.10;
            }
             #endregion

            $Mon["SeasonScore"] =  ($Win_RateScore + $Banned_RateScore + $FirstPickScore) * 2;
            if ($Mon["SeasonScore"] > 100 ) {
                $Mon["SeasonScore"] = 100;
            }
            if ($Mon["Pick_Rate"] > 0.1) {
                $id = $Mon["com2us_id"];
                $combats = $pMysqli->query("SELECT  count( RTC.temp ) AS count, RTC.*, SUM( win ) AS win_rate 
                    FROM
                        ( SELECT * FROM rta_combats GROUP BY id_combat ORDER BY id_combat ) AS RTC 
                    WHERE
                        temp = '$SelectedSeason' 
                        AND picks LIKE '%$id%' 
                    GROUP BY
                        picks
                        order by count desc limit 20");
                $i = 0;
                $MonCombats = [];                
                foreach ($combats as $row) {
                    //$i++;
                    $MonCombats[] = $row;
                }
                $Mon["combats"] = $MonCombats;
                array_push($RTAPicksData, $Mon);
            }
            //echo print_r($Mon);
        }
    }
    echo json_encode($RTAPicksData);
    return;
}
$TEST = "SELECT * FROM `monpickdata`   where temp = 'Season20-P1' and rank <= 12000  GROUP BY id_battle;
SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 and user = 'NON-TOXIC:' GROUP BY id_battle ORDER BY id_battle;
SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 and user like '%SeyferXx' GROUP BY id_battle ORDER BY id_battle;
SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 GROUP BY id_battle ORDER BY id_battle;
SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 and id_combat is not null GROUP BY id_battle ORDER BY id_battle;

SELECT * FROM `monpickdata` where temp = 'Season20-P2' and rank <= 12000  GROUP BY id_battle

SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 and user like '%SeyferXx' GROUP BY id_combat ORDER BY id_battle;
SELECT * FROM `monpickdata`   where temp = 'Season20-P2' and rank <= 12000 -- and id_combat like '%16153672%' 
and date like '%2022-01-09%' and id_combat is not null  GROUP BY id_battle ORDER BY id_combat;
SELECT * FROM `rta_combats` GROUP BY id_combat;
";
