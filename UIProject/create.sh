IDS=("350001 350011 1.0 0.9" \
        "360001 360022 1.5 1.4" \
        "370001 370022 2.0 1.9" \
    )

n_ids=${#IDS[@]}
for ((i=0;i<$n_ids;i++));
do
	row=(${IDS[$i]})
	start=${row[0]}
    end=${row[1]}
    scale1=${row[2]}
    scale2=${row[3]}
    echo $oip $oa $ip $a
    for((j=$start;j<=$end;j++));
    do
        \cp temp.xml monster$j.xml
        sid=`cat package.xml|grep $j.png|awk -F '"' '{print $2}'`
        sed -i "" "s/2,2/$scale1,$scale1/g" monster$j.xml
        sed -i "" "s/dqd219/$sid/g" monster$j.xml
        sed -i "" "s/350001/$j/g" monster$j.xml
        sed -i "" "s/1.9,1.9/$scale2,$scale2/g" monster$j.xml
    done
done

