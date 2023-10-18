import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
// import Stack from './Stack';
import Prayer from './Prayer';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import axios from 'axios';
import moment from 'moment';
import { useState, useEffect } from 'react';
// import { Container } from '@mui/material';
import "moment/dist/locale/ar-dz";


moment.locale("ar");
export default function MainContent() {


    const [selectedCity, setSelectedCity] = useState({
        displayName: "تطاوين",
        apiName: "tataouine",
    });
    const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
    const [today, setToday] = useState("");
    const [remainingTime, setremainingTime] = useState("");
    const [timer, setTimer] = useState(10);
    const [timings, setTimings] = useState({
        Fajr: "05:30",
        Sunrise: "06:24",
        Dhuhr: "12:04",
        Asr: "15:18",
        Sunset: "17:43",
        Maghrib: "17:43",
        Isha: "18:37",
        Imsak: "05:20",
        Midnight: "00:03",
        Firstthird: "21:57",
        Lastthird: "02:10"
    });

    const prayersArray = [
        { key:"Fajr" , displayName: "الفجر"},
        { key:"Dhuhr" , displayName: "الظهر"},
        { key:"Asr" , displayName: "العصر"},
        { key:"Maghrib" , displayName: "المغرب"},
        { key:"Isha" , displayName: "العشاء"},
        
    ];
    const getCities = async () => {
        try {
            const res = await axios.get('https://api.aladhan.com/v1/timingsByCity/:date?country=TU&city=' + selectedCity.apiName);
            setTimings(res.data.data.timings);
        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    useEffect(() => {
        getCities();
        const t = moment();
        setToday(t.format('MMM Do YYYY | h:mm'));

        console.log("the tile iss", t.format("Y"));
    }, [selectedCity]);

    useEffect(() => {
        let interval = setInterval(() => {
            setupCounterdownTimer();
            setTimer((t) => {
                return t - 1;
            });
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    },[timings])
    const setupCounterdownTimer = () => {
        const momentNow = moment();
        let prayerIndex = 0;
    
        for (let i = 0; i < prayersArray.length; i++) {
            const prayerKey = prayersArray[i].key;
            const prayerTime = moment(timings[prayerKey], "HH:mm");
    
            if (momentNow.isBefore(prayerTime)) {
                prayerIndex = i;
                break;
            }
        }
    

        setNextPrayerIndex(prayerIndex);
        const nextPrayerObject = prayersArray[prayerIndex];
        const nextPrayerTime = timings[nextPrayerObject.key];
        const nextPrayerTimeMoment = moment(nextPrayerTime, "HH:mm");
    
        let remainingTime = nextPrayerTimeMoment.diff(momentNow);
    
        if (remainingTime < 0) {
            const midnightDiff = moment("23:59:59", "HH:mm:ss").diff(momentNow);
            const fajrToMidnightDiff = nextPrayerTimeMoment.diff(moment("00:00:00", "HH:mm:ss"));
            const totalDifference = midnightDiff + fajrToMidnightDiff;
    
            remainingTime = totalDifference;
        }
        const durationRemaining = moment.duration(remainingTime);
        setremainingTime(`${durationRemaining.seconds()} : ${durationRemaining.minutes()} : ${durationRemaining.hours()}`);
    

        const Isha = timings['Isha'];
        const IshaMoment = moment(Isha, "hh:mm")
        console.log(durationRemaining.hours() + " " + durationRemaining.minutes()+ " " + durationRemaining.seconds());
    }
    const handleCityChange = (event) => {
        const cityApiName = event.target.value;
        const cityObject = cities.find((city) => city.apiName === cityApiName);
        setSelectedCity(cityObject);
    };

    const cities = [
        { displayName: "تطاوين", apiName: "tataouine" },
        { displayName: "مدنين", apiName: "Médenine" },
        { displayName: "قابس", apiName: "Gabès" },
        { displayName: "قبلي", apiName: "kébili" }
    ];
    return (
        <Container maxWidth="lg" >
          

            <Grid container  >
            <img src='https://yeswiki.net/files/Bandeautheque_homme_20161130111108_20161130115117.jpg' style={{width:" 1153px"}}></img>
        
                <Grid xs={6}>
                    <div>
                        <h2>{today}</h2>
                        <h1>{selectedCity.displayName}</h1>
                   
                    </div>

                </Grid>

                <Grid xs={6}>
                    <div>
                        <h2>متبقي على صلاة {prayersArray[nextPrayerIndex].displayName}</h2>
                        <h1 >{remainingTime} </h1>
                    </div>

                </Grid>
            </Grid>
            <Divider />
            {/** cards */}
            <Stack direction="row" justifyContent={"space-around"} style={{ marginTop: "50px" }}>
                <Prayer name="الفجر" time={timings.Fajr} image="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISDxASEhIQEg8PEA8PEBUPEBUPDw8PFRUWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFRAQFy0dFx0tLS0tLSstLS0tKy0rLS0tLS0tLS0tLS0tLSsrKy0tLS0tKystLS0tLS0tKystKy0rLf/AABEIALEBHAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAADBAABAgUGBwj/xAA/EAADAAECBAQDAwgIBwEAAAAAAQIDBBESITFBBQZRYRNxkYGxwQcUIjJSodHwJDNCcoKSsuEWQ1NiY8LxFf/EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACARAQEBAQADAAIDAQAAAAAAAAABEQIDEiEiMRNBYVH/2gAMAwEAAhEDEQA/APK4sQ9g0rfqPafTT6HSw40eS9vZOXOw6NnQw6MdxY0OYsS9DPs1kK4NKP48O3YNhxjeOBEtJrBRudOzoTjNrGVnSHwX6ho0fuNLThpxFxNKxpF6mp0y37jixGpxFw0vilSx/Hn5Afgk+CENLVILj1KfYTx4hmETAyuFmlKQBGkTEErGDrEalm+Milqxg6xj3GvQy1INIvEZcjz4SnMsi65dyL3B1awL1AZdP6Ga1K5WTGLZMZ0smF+gC8BityuVeMWyYjrXAtmx+xmtyuPlxieXGdbLjYrlwv0M66Rx82MSy4zs5sIjlxFlMcjLApU8zq5sQlePmblYvLvYcY7jkUwMexM2xhjEhzGLY2MwipYbxsYhicMZizWsWGoYaRWbDRRdZsMyblAZZtUUHRuQMs3LKgpfCZTNomi5RtIyjaJqtJFpFIvchjSJuZ3L3BicRTom5mqBiqZhltmKoGM0DpmqoFdkVKyMFeYq7AXRitRWS16C90vQ1bAZKOdjcYul6AMmRd0XkoVy2ZsbgeXh9BTKp9jeSxTLRnHSUDNgn1Er0879RjLQndczWX/qWnMVD2GjkYrHcVnbHJ1cdDWK/c5eKxmLKOpFh5s5uOxmLCWHp2CSJzYaLNMYblsLNMUmws2XUw3DCzQpNhFY0w2rCTYmmETGmGuM3xC00eK8zef5xcWPT8NUuXxK5r/DPf5v6F45vdyJ1Zz+3v0y0z4/4F+UHNhtvPdZsNc74muLGv2op9Pk+XyPpXl/zFpdbjd6bKsilpWtnFw304opJrvs+j2exfJ4+uP2nPU6dfcp0Tcpo5a3jLoHVm6kFUj2X1U7MVZVArY0xqrA1Rm6A1ZNMbqwN2ZqgNWZtaxq8gvksl2L3RlqRWSxbJZeShbJRG5FZKFctl5LFMuQkisZqFKpGsuQUrJzNSJTWJjeNnPw2N47O1jnK6GNjUM5+OxrHZFPYw8MTig8UA7DCyxTHYxFBnDMsLLF4oLNFTB5YWaASwksamDzQSaASwksDy/5SvGcmn0kzjTX5xVY6v8AZlLfh+dfcmfG8+p61T936H6A8c8MjVabLgydLnk0t3FrnNr3T/gfl7Uah2+fTsuyPV4Ovxxw80+j63X1k5dIXb192ew/JH4xeHxTTzxbY9TxafIn0reW4+3jU/V+p4ajp+XvE1ptVp9RwqvzfLjyuWk1ST5rn3232fZ7G+/ylY5+V+sNybmYpNJro0mvky2j5uvYy6B1RqwNMauKqgN0XbA1RTGbYC2buhfJRFxVUAui7oBdBqRV0LXZd0AyURpnJYrks3koUysuDGXIKZchvLQplouM6HlsVqwmRitUakYtOYqG8VHNxWNY7OrErpY6GcdHPx2M47JY1K6GOxiKEMeQYiyYunooYixCLDRZA/FBpoRjIGmyodmgs2JTYSbJiHZoIrE5sxq9dOLHWS3tMrn6t9kvdjEdDJqJiXdNKYTqm+SSXNn5p1+hXHVTLlOqpLfiSTe+3M+i+YvNFZpcU1ONvfgnfnt043vz+XQ8nm1c83tuvY9vi8XrPrzeTv2/TyOVbPY9l+R7HjrxfBxt7zGa8ST2VZVD5PlzXC7fbovk+PqsOLJ2cvs0/vQ35AWTF4lhyTO9Yqp9N5cuXNNvsuF1z7DyTOanj+9x+moofxaTinffm+nocOM/QZjxCktk+R87nJfs2PX3zbPxuN5nsK3RytP5jwZtTm0+O+PLp5VZeFN44e+3C76cW/VfP0e3jp/KBxavU23K8N0s/CVKeLJqNU6XD8N78+St7dOGd315OeOq3epHvrsBdHlPKPmG9bm1uZNrSxeLDppaS6Ju8ld93vPLstkeirILzZcpLL+mrsBdFXYG7JjS7oXuiXkF7sYsS6AZKJdi+SyrrOSxXJRvJYrksuM2sZaFcjCZKFcllkZtDyULtm7YvVm8YtFx0NY6Ofioax2dbHKU/jsax2c6LGMdmcadGLD48hz4sYiw1roRkDxZzosYjIMXT8WGnIITkCzkM4p+cgScghOQLOQIenIeK8++Mfpzil8sa4q/vtcvov8AUz1c5D5P541P9MzSv2+f2TP4nXwz8nLy3OXL1Gdt7t9RbJl6L3MZL5i+WubPVryjcZ0fL/j2XR6iM0bVtyuHttkx959n6Pt9U+LFBTN+rLj9IaDxGM2LHlxvfHlhXL9n6rs+2x5v8o/mDJptNE4qqMmfI44p5VMTO9NPs+crf3Z4fyf5yWjwZMNzVri+JgSaSni345b7LdJ8vVnB8x+O5tbm+JbUqFwxMfq45fN7bvm33e/p7Hmnhvt/j0/zTP8AR8/mJ49A9JhxTi+NSrUZVbrLqNuqrlyT9N9tt13e/AjUZLWPDLqlxNY4ldbtrfZLrTalevJLshqdE8t4sWPfjyXMLjf9qntu2uh9W8teUNPo9r/rdR/1MiX6L25/Dn+z+9+506s4Z53u/D/k3wf8z0cYq/raby5ttv6ykt53XXZJLf2OxWQBWUFWQ8l+3XpkyYPeUBeQFWQFVkxrRLyALyA7yALsGt3kF7szdgbsJqXQvksmTIL3ZZEtVdC90Xdi+SzcjFrGWxd0augDo0w3FDOPIc6MgaMh2xznTpxYxFnLjKGjMZvLUrqRYeMhy4zBpyE9V11YyhYynKnIGnIT1XXWjKGjIcmMoeMpMX2dScgRZDmTmCLOTF9nSWQ+S+cb/p+f2pfvSf4n0tag+V+Y83HrdTX/AJGv8qU/+p08U+1y81+Qjk/EFk6m2/3maXI7vOBD5h5sXtGooA8zu+b5Pb7AtNJcu3VevuLrJ09iKm+S5uuSS5tt9Evcug+LI5qKn9aamp2/aTTW327H3Ssp4Hyp5aWJLLqJTy8njh81i25qn6193zPWPUHl8t9r8evw83mfT1ZQVZRJ52DrOzl6u2naygbyCGfXxP61zP8AepISzeOYJ65J/wAL4vuHrU9o615AN5Di/wDEGCumRL5pr70XPiMU9pyQ36KluX0rPvHSvIAvILPUMHWoHqew9WAuwV5he8xZyzehcli92ZrIBuy4mrugFUVdgXRcZtZig8Wc+cnuFnKvVfU7uWuhNhpsQjKg02FPTkDRkOfNhZyExddGMoaMpzZyhFmJiyunOUJOY87l8bma2SdbdWtth3R6+ci3n7U+qHqvtHaWc2sxzVmNrKT1XXSnMfMdU98mSv2sl19abPfLMeBzz+na9KpfvN8T9ufkv6C2KNtA2zo5Jwiznb67DaYHb/V+ABvDMCyZccU3M3cy2uqT5bo+haHRaXSreVE0ut5KTyfV9Pktj57gWzT90Nu+v4+pjrnW+es/p7rN5hwT/wAzd/8AYnX3CWfzZjX6sXXz2lfieQqikvYxPHGv5K9Fk81ZHvw44Xzbpr7jmZvF81vd5LXtL4J+iEfcpv26mpxIze7f7XT393vv6/vKZSf4FGmU2K3KrJt68zLAJORy902n7Pb7hrB4rknq+Ne/X6iCKb/lDIu11P8A9l/sL/N/saXi0vrNL5bM5Dop0T1i+9dh+Iw/VfNFPVS+lL67HGZRPSHvXXrIDdnKori+Y9T2Z4n8yJlqS1j9zWs41D9H+Azh1lLrzXuK/DZfA/mB2MGuT+YzOoODw+wfBma5Pmv3omNa7f5wkt2+Ry9Vrav2n0/iDy5OLl2B8Aw1aYab939nIDKNqAh7T6+5W26aXauex0sfik8O7ez6Nd9/Y4PD/LLe3d/REXXQ1Pi1vkv0V7dfqczKv0nv1fP68zWy9PqytQv0vsSN8s0PcFSN7mHv2/2ZUZRFP8S+vVGNtn129wDwEp8xVW0+u6G4Sa379CVWeIjZHia9X/PoY4vZkGuInEY3IwN8RXEYTKbA3xGdzO5XGUb2KZlsrcItlNlcRTYFsrcriIBTZRGUBao2qAovcmLoyyE4wSLTALxmuICmaTAIqZtZGBVFgHWVmviANy+IBhfzzJsBVBYpPryGLqm+/p0/iBy5mqa9NvfsObyK6mkue3y9zWMsTafLuZey70B35bv1JOb15r941Rk2Sny6mPiz77mXS7hFzftv941gypdtt/bbmLcv4MLjvs9v4kwNq2R2n12Bbk4iK00jDxlqibsDHD7GGG4jLSAFVGfcLUoy4AERs25MNBGdyMlGSjSZNzKZYEbK3IVsBSLMpl7gXuXuUQDRpMHuWmFbTNIwmWmQbNczO5YF8RpUYL2AJNmaW/Xnt6k3RGwK+FO23P6gq0y7P6o3uWmUBemfbZg7TXVDiZrcITlL/wClrl6fZzD1iT7fTkZ+B7/UC1m7bNo2q5A1jfz+RpLYVY3xE3MFbkUTcm4IioILuTcFxF7lG9ymwe5OIDfIw5KdE3AjkrhNphUQLcJGhnYy8aKEiyECLLRCAQiLIBRpEIFWbfYshBZKIQCr6F4yEAzf6xr0IQo0iEIBT6s0iEA12IUQlGaMkIRWWWQgRl9SmQhREUiEAsi7EIVG5CFECtPoWiEA/9k=" />
                <Prayer name="الظهر" time={timings.Dhuhr} image="data:image/jpeg;base64,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" />
                <Prayer name="العصر" time={timings.Asr} image="data:image/jpeg;base64,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" />
                <Prayer name="المغرب" time={timings.Maghrib} image="data:image/jpeg;base64,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" />
                <Prayer name="العشاء" time={timings.Isha} image="data:image/jpeg;base64,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" />
            </Stack>

            {/** select Option */}
            <Stack Container direction="row" >

                <FormControl style={{ width: "20%", marginTop: "40px" }} >
                    <InputLabel id="demo-simple-select-label">المدينة</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        // value={selectedCity.diplayName}
                        label="Age"
                        onChange={handleCityChange}
                    >

                        {cities.map((city) => {
                            return (
                                <MenuItem value={city.apiName} key={city.apiName}>{city.displayName}</MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>

            </Stack>


        </Container>
    );
}