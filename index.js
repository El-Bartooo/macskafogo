const area = document.querySelector("#area");
const jatek = document.querySelector("#jatek");
const ok = document.querySelector("#ok");
const valaszto = document.querySelector("#valaszto");
const mute = document.querySelector("#mute");
const reset = document.querySelector("#reset");
const failHang = document.querySelector("#failHang");
const winHang = document.querySelector("#winHang");
const szinValaszto = document.querySelectorAll("#szinValaszto [type=radio]");
const cicaValaszto = document.querySelectorAll("#cicaValaszto [type=radio]");
const meretValaszto = document.querySelectorAll("#meretValaszto [type=radio]");
const szamlalo = document.querySelector("#szamlalo");
const szamlaloSpan = document.querySelector("#szamlaloSpan");

class Node {
    nev; 
    hely;
    volt;
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

class Rang {
    constructor(datum, nev, pontszam){
        this.datum = datum;
        this.nev = nev;
        this.pontszam = pontszam;
    }
}

let storedString = "";
if(localStorage.getItem("ranglista") === null) {
    localStorage.setItem("ranglista", "———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———;———");
    storedString = localStorage.getItem("ranglista");
}
else {
    storedString = localStorage.getItem("ranglista");
}

let rangTomb = storedString.split(";");
let kicsiTomb = [];
let kozepesTomb = [];
let nagyTomb = [];

for(let i = 0, j = 0; i < 27; i+=3) {
    if((i)%9 == 0) j = 0;
    if(i < 9) {
        kicsiTomb[j] = new Rang(rangTomb[i], rangTomb[i+1], (rangTomb[i+2] == "———" ? rangTomb[i+2] : Number(rangTomb[i+2])));
    }
    else if(i >=9 && i < 18){
        kozepesTomb[j] = new Rang(rangTomb[i], rangTomb[i+1], (rangTomb[i+2] == "———" ? rangTomb[i+2] : Number(rangTomb[i+2])));
    }
    else if(i >=18 && i < 27){
        nagyTomb[j] = new Rang(rangTomb[i], rangTomb[i+1], (rangTomb[i+2] == "———" ? rangTomb[i+2] : Number(rangTomb[i+2])));
    }
    j++;
}

let spanList = document.querySelectorAll("#ranglista span");
for(let i = 0, j = 0; i < spanList.length; i+=3) {
    if((i)%9 == 0) j = 0;
    if(i < 9) {
        spanList[i].textContent = kicsiTomb[j].datum;
        spanList[i+1].textContent = kicsiTomb[j].nev;
        spanList[i+2].textContent = kicsiTomb[j].pontszam;
    }
    else if(i >=9 && i < 18){
        spanList[i].textContent = kozepesTomb[j].datum;
        spanList[i+1].textContent = kozepesTomb[j].nev;
        spanList[i+2].textContent = kozepesTomb[j].pontszam;
    }
    else if(i >=18 && i < 27){
        spanList[i].textContent = nagyTomb[j].datum;
        spanList[i+1].textContent = nagyTomb[j].nev;
        spanList[i+2].textContent = nagyTomb[j].pontszam;
    }
    j++;
}

ok.addEventListener("click", function(e) { 
    e.preventDefault();
    let meret, szin, macska;
    for(let i = 0; i < meretValaszto.length; i++){
        if(meretValaszto[i].checked){
            meret = Number(meretValaszto[i].value);
        }
    }
    for(let i = 0; i < szinValaszto.length; i++){
        if(szinValaszto[i].checked){
            szin = szinValaszto[i].value;
        }
    }
    for(let i = 0; i < cicaValaszto.length; i++){
        if(cicaValaszto[i].checked){
            macska = Number(cicaValaszto[i].value);
        }
    }
    general(meret, macska, szin);
    mute.style.display = "block";
    reset.style.display = "block";
    szamlalo.style.display = "block";
    valaszto.style.display = "none";
})

let nema = false;
mute.addEventListener("click", function(){
    if(nema){
        mute.src = "./src/muteOff.png";
        [...document.querySelectorAll("audio")].forEach(audio => audio.muted = false);
        nema = false;
    }
    else {
        mute.src = "./src/muteOn.png";
        [...document.querySelectorAll("audio")].forEach(audio => audio.muted = true);
        nema = true;
    }
})

reset.addEventListener("click", function(){
    location.reload();
})

const valakiNyert = (jatek, valaki, meret, zsetonok, kicsiTomb, kozepesTomb, nagyTomb) => {

    const ujRekord = () => {
        let rekord = false;
        if(meret == 9){
            for(let i = 0; i < 3; i++){
                if(kicsiTomb[i].pontszam == "———" || kicsiTomb[i].pontszam > zsetonok) rekord = true;
                else { rekord = false; }
            }
        }
        else if (meret == 11){
            for(let i = 0; i < 3; i++){
                if(kozepesTomb[i].pontszam == "———" || kozepesTomb[i].pontszam > zsetonok) rekord = true;
                else { rekord = false; }
            }
        }
        else if (meret == 13){
            for(let i = 0; i < 3; i++){
                if(nagyTomb[i].pontszam == "———" || nagyTomb[i].pontszam > zsetonok) rekord = true;
                else { rekord = false; }
            }
        }
        return rekord;
    }

    let count = 1;
    let vesztett = setInterval(() => {
        if(count < 0) {
            jatek.replaceChildren();
            jatek.style.opacity = 1;
            clearInterval(vesztett);
            let vesztes = document.createElement("DIV");                            
            let ujra = document.createElement("DIV");
            let nyertesSzoveg = document.createElement("DIV");
            let nevInput = document.createElement("INPUT");
            let mentesGomb = document.createElement("DIV");
            vesztes.classList.add("vesztes");
            ujra.classList.add("ujra");
            nyertesSzoveg.classList.add("nyertesSzoveg");
            nevInput.classList.add("nevInput");
            nevInput.setAttribute("type", "text");
            nevInput.setAttribute("size", "20");
            nevInput.setAttribute("maxlength", "20");
            nevInput.setAttribute("placeholder", "Add meg a neved!");
            mentesGomb.classList.add("mentesGomb");
            mentesGomb.setAttribute("type", "submit");
            jatek.style.display = "grid";        
            
            let opac = 0;

            if(valaki == "cica"){
                vesztes.textContent = "A macska kijutott a pályáról!"
                nyertesSzoveg.textContent = "Szeretnéd újraindítani a játékot?";
                ujra.textContent = "Újraindítás";
                jatek.appendChild(vesztes);
                jatek.appendChild(document.createElement("BR"));
                jatek.appendChild(nyertesSzoveg);
                jatek.appendChild(document.createElement("BR"));
                jatek.appendChild(ujra);
            }
            else {
                vesztes.innerHTML = "Gratulálunk,<br> bekerítetted a macskát!";
                jatek.appendChild(vesztes);
                jatek.appendChild(document.createElement("BR"));
                if(ujRekord()){
                    ujra.textContent = "Nincs mentés";
                    nyertesSzoveg.textContent = "Felkerültél a ranglistára: ";
                    mentesGomb.textContent = "Mentés";
                    jatek.appendChild(nyertesSzoveg);
                    jatek.appendChild(document.createElement("BR"));
                    jatek.appendChild(nevInput);
                    jatek.appendChild(document.createElement("BR"));
                    jatek.appendChild(mentesGomb);
                    jatek.appendChild(document.createElement("BR"));
                    jatek.appendChild(ujra);

                    mentesGomb.addEventListener("click", function() {
                        let maiDatum = new Date();
                        let nyertesDatumString = `${maiDatum.getFullYear()}.${(maiDatum.getMonth() < 9 ? "0" : "")}${maiDatum.getMonth() + 1}.${(maiDatum.getDate() < 9 ? "0" : "")}${maiDatum.getDate()}.`;
                        let nyertesNev = nevInput.value == "" ? "Ismeretlen" : nevInput.value;
                        let nyertesPont = zsetonok;
                        let nyertesRang = new Rang(nyertesDatumString, nyertesNev, nyertesPont);
                     
                        if(meret == 9){
                            if(kicsiTomb[0].pontszam == "———" || nyertesRang.pontszam < kicsiTomb[0].pontszam){
                                kicsiTomb.unshift(nyertesRang);
                                kicsiTomb.pop();
                            }
                            else if(kicsiTomb[1].pontszam == "———" || nyertesRang.pontszam < kicsiTomb[1].pontszam){
                                kicsiTomb.unshift(kicsiTomb[0], nyertesRang, kicsiTomb[1]);
                                kicsiTomb.pop();
                                kicsiTomb.pop();
                                kicsiTomb.pop();
                            }
                            else if(kicsiTomb[2].pontszam == "———" || nyertesRang.pontszam < kicsiTomb[2].pontszam){
                                kicsiTomb.pop();
                                kicsiTomb.push(nyertesRang);
                            }
                        }
                        else if(meret == 11){
                            if(kozepesTomb[0].pontszam == "———" || nyertesRang.pontszam < kozepesTomb[0].pontszam){
                                kozepesTomb.unshift(nyertesRang);
                                kozepesTomb.pop();
                            }
                            else if(kozepesTomb[1].pontszam == "———" || nyertesRang.pontszam < kozepesTomb[1].pontszam){
                                kozepesTomb.unshift(kozepesTomb[0], nyertesRang, kozepesTomb[1]);
                                kozepesTomb.pop();
                                kozepesTomb.pop();
                                kozepesTomb.pop();
                            }
                            else if(kozepesTomb[2].pontszam == "———" || nyertesRang.pontszam < kozepesTomb[2].pontszam){
                                kozepesTomb.pop();
                                kozepesTomb.push(nyertesRang);
                            }
                        }
                        else if(meret == 13){
                            if(nagyTomb[0].pontszam == "———" || nyertesRang.pontszam < nagyTomb[0].pontszam){
                                nagyTomb.unshift(nyertesRang);
                                nagyTomb.pop();
                            }
                            else if(nagyTomb[1].pontszam == "———" || nyertesRang.pontszam < nagyTomb[1].pontszam){
                                nagyTomb.unshift(nagyTomb[0], nyertesRang, nagyTomb[1]);
                                nagyTomb.pop();
                                nagyTomb.pop();
                                nagyTomb.pop();
                            }
                            else if(nagyTomb[2].pontszam == "———" || nyertesRang.pontszam < nagyTomb[2].pontszam){
                                nagyTomb.pop();
                                nagyTomb.push(nyertesRang);
                            }
                        }

                        let ujStoredTomb = [];
                        for(let i = 0, j = 0; i < 27; i+=3){
                            if((i)%9 == 0) j = 0;
                            if(i < 9) {
                                ujStoredTomb[i] = kicsiTomb[j].datum;
                                ujStoredTomb[i+1] = kicsiTomb[j].nev;
                                ujStoredTomb[i+2] = kicsiTomb[j].pontszam;
                            }
                            else if(i >=9 && i < 18){
                                ujStoredTomb[i] = kozepesTomb[j].datum;
                                ujStoredTomb[i+1] = kozepesTomb[j].nev;
                                ujStoredTomb[i+2] = kozepesTomb[j].pontszam;
                            }
                            else if(i >=18 && i < 27){
                                ujStoredTomb[i] = nagyTomb[j].datum;
                                ujStoredTomb[i+1] = nagyTomb[j].nev;
                                ujStoredTomb[i+2] = nagyTomb[j].pontszam;
                            }
                            j++;
                        }
                        localStorage.setItem("ranglista", ujStoredTomb.join(";"));
                        location.reload();
                    })
                }
                else {
                    ujra.textContent = "Újra!";
                    jatek.appendChild(ujra);
                }
            }           
            ujra.addEventListener("click", function() {
                location.reload();
            });

            if(valaki == "cica") {
                failHang.play();
            }
            else {
                winHang.play();
            }

            let ujraBeuszik = setInterval(function(){
                if(opac > 1.01){
                    clearInterval(ujraBeuszik);
                }
                else {
                    ujra.style.opacity = opac;
                    //
                    mentesGomb.style.opacity = opac;
                    nevInput.style.opacity = opac;
                    nyertesSzoveg.style.opacity = opac;
                    //
                    vesztes.style.opacity = opac;
                    opac += 0.01;
                }
            }, 10);
        }
        else {
            jatek.style.opacity = count;
            count -= 0.01;
        }
    }, 10);
}


function general(meret, macska, szin){

    let zsetonok = 0;
    
    let palya = new Array(meret); //oszlopok generálása
    
    for (let i = 0; i < palya.length; i++) {
        palya[i] = new Array(meret); //sorok generálása
    }

    let sor=[true,true,true,true,true,true,true,true,true,true,true,true,true];
    let oszlop=[true,true,true,true,true,true,true,true,true,true,true,true,true];

    jatek.replaceChildren();
    
    for(let i = 0; i < meret; i++){      
        for(let j = 0; j < meret; j++){
            let node = new Node(i, j);
            let oval = document.createElement("DIV");
            let br = document.createElement("BR");
            oval.classList.add("oval");
            if((i == 0 || j == 0 || i == meret - 1 || j == meret -1) && !((i == 0 && j == 0) || (i == 0 && j == meret -1) || (i == meret -1 && j == 0) || (i == meret -1 && j == meret -1))) {
                palya[i][j] = node;
                node.nev = "szel";
                node.hely = true;
                node.volt = true;
                jatek.appendChild(oval);
                let op = 0;
                oval.style.opacity = op;
                oval.classList.add(node.nev);
                oval.setAttribute("id", `x${i}y${j}`);
                let anim = setInterval(() => {
                    if(op > 1.025) {
                        clearInterval(anim);
                    }
                    else {
                        oval.style.opacity = op;
                        op += 0.025;
                    }
                }, 20);
                if(j == meret -1) jatek.appendChild(br);
            }
            else if((i == 0 && j == 0) || (i == 0 && j == meret -1) || (i == meret -1 && j == 0) || (i == meret -1 && j == meret -1)){
                palya[i][j] = node;
                node.nev = "sarok";
                node.hely = true;
                node.volt = true;
                jatek.appendChild(oval);
                let op = 0;
                oval.style.opacity = op;
                oval.classList.add(node.nev);
                oval.setAttribute("id", `x${i}y${j}`);
                let anim = setInterval(() => {
                    if(op > 1.025) {
                        clearInterval(anim);
                    }
                    else {
                        oval.style.opacity = op;
                        op += 0.025;
                    }
                }, 20);
                if(j == meret -1) jatek.appendChild(br);
            }
            else if(!((i == 0 && j == 0) || (i == 0 && j == meret -1) || (i == meret -1 && j == 0) || (i == meret -1 && j == meret -1))){
                palya[i][j] = node;
                node.nev = "sima";
                node.hely = true;
                node.volt = true;
                jatek.appendChild(oval);
                let op = 0;
                oval.style.opacity = op;
                oval.classList.add(node.nev + szin);
                oval.setAttribute("id", `x${i}y${j}`);
                let anim = setInterval(() => {
                    if(op > 1.025) {
                        clearInterval(anim);
                    }
                    else {
                        oval.style.opacity = op;
                        op += 0.025;
                    }
                }, 20);
                oval.addEventListener("click", function(){
                    node.nev = "zart";
                    node.hely = false;

                    const clickPrevent = function(klikkelt) {
                        let osszesSima = [...document.querySelectorAll(".sima" + szin)];
                        let osszesSimaClicked = [...document.querySelectorAll(".simaClicked" + szin)];
                        if(klikkelt) {
                            for(let i = 0; i < osszesSima.length; i++){
                                osszesSima[i].classList.add("simaClicked" + szin);
                                osszesSima[i].classList.remove("sima" + szin);
                            }
                        }
                        else {
                            for(let i = 0; i < osszesSimaClicked.length; i++){
                                osszesSimaClicked[i].classList.remove("simaClicked" + szin);
                                osszesSimaClicked[i].classList.add("sima" + szin);
                            }
                        }
                    }
                    
                    if(!this.classList.contains("zart" + szin) && !this.classList.contains("cicaRajtavan" + szin) && this.classList.contains("sima" + szin)){
                        
                        zsetonok++;
                        szamlaloSpan.textContent = zsetonok;

                        let randomHang = Math.floor(Math.random()*4);
                        let cicaHangok = [...document.querySelectorAll(".cicaHang")];
                        cicaHangok[randomHang].play();

                        let klikkelt = true;
                        let clicked = new Node(i, j);

                        this.classList.add("zart" + szin);
                        this.classList.remove("sima" + szin);

                        let irany = lepes(palya, cicaNode, clicked, sor, oszlop);
                        clickPrevent(klikkelt);
                        
                        if(irany == "jobbra"){
                            if(!(document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).classList.contains("zart" + szin))){
                                let jobbra = 0;
                                cica.style.left = `${jobbra}px`;
                                let anim = setInterval(function () {
                                    if(jobbra == 45) {
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).removeChild(cica);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).appendChild(cica);
                                        if(!document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).classList.contains("cicaRajtaVan" + szin) && document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).classList.contains("simaClicked" + szin)) {
                                            document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).classList.toggle("cicaRajtaVan" + szin);
                                            document.querySelector(`#x${currCicaPosX}y${currCicaPosY + 1}`).classList.toggle("simaClicked" + szin);
                                        }
                                        currCicaPosY += 1;
                                        cica.style.left = "0px";
                                        if (cicaSzelenVan()) valakiNyert(jatek, "cica");
                                        klikkelt = false;
                                        clickPrevent(klikkelt);
                                        clearInterval(anim);
                                    }
                                    else {
                                        cica.style.left = `${jobbra}px`;
                                        jobbra+= 1;
                                    }
                                }, 5);
                            }
                        }
                        if(irany == "balra"){
                            if(!(document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).classList.contains("zart" + szin))){
                                let balra = 0;
                                cica.style.left = `${balra}px`;
                                let anim = setInterval(function () {
                                    if(balra == -45) {
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).removeChild(cica);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).appendChild(cica);
                                        if(!document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).classList.contains("cicaRajtaVan" + szin) && document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).classList.contains("simaClicked" + szin)) {
                                            document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).classList.toggle("cicaRajtaVan" + szin);
                                            document.querySelector(`#x${currCicaPosX}y${currCicaPosY - 1}`).classList.toggle("simaClicked" + szin);
                                        }
                                        currCicaPosY -= 1;
                                        cica.style.left = "0px";
                                        if (cicaSzelenVan()) valakiNyert(jatek, "cica");
                                        klikkelt = false;
                                        clickPrevent(klikkelt);
                                        clearInterval(anim);
                                    }
                                    else {
                                        cica.style.left = `${balra}px`;
                                        balra--;
                                    }
                                }, 5);
                            }
                        }
                        if(irany == "fel"){
                            if(!(document.querySelector(`#x${currCicaPosX - 1}y${currCicaPosY}`).classList.contains("zart" + szin))){
                                let fel = -20;
                                cica.style.top = `${fel}px`;
                                let anim = setInterval(function () {
                                    if(fel == -57) {
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).removeChild(cica);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                        document.querySelector(`#x${currCicaPosX - 1}y${currCicaPosY}`).appendChild(cica);
                                        if(!document.querySelector(`#x${currCicaPosX - 1}y${currCicaPosY}`).classList.contains("cicaRajtaVan" + szin) && document.querySelector(`#x${currCicaPosX- 1}y${currCicaPosY}`).classList.contains("simaClicked" + szin)) {
                                            document.querySelector(`#x${currCicaPosX - 1}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                            document.querySelector(`#x${currCicaPosX - 1}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        }
                                        currCicaPosX -= 1;
                                        cica.style.top = "-20px";
                                        if (cicaSzelenVan()) valakiNyert(jatek, "cica");
                                        klikkelt = false;
                                        clickPrevent(klikkelt);
                                        clearInterval(anim);
                                    }
                                    else {
                                        cica.style.top = `${fel}px`;
                                        fel--;
                                    }
                                }, 5);
                            }
                        }
                        if(irany == "le"){
                            if(!(document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).classList.contains("zart" + szin))){
                                let le = -20;
                                cica.style.top = `${le}px`;
                                let anim = setInterval(function () {
                                    if(le == 17) {
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).removeChild(cica);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                        document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).appendChild(cica);
                                        if(!document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).classList.contains("cicaRajtaVan" + szin) && document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).classList.contains("simaClicked" + szin)) {
                                            document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
                                            document.querySelector(`#x${currCicaPosX + 1}y${currCicaPosY}`).classList.toggle("simaClicked" + szin);
                                        }
                                        currCicaPosX += 1;
                                        cica.style.top = "-20px";
                                        if (cicaSzelenVan()) valakiNyert(jatek, "cica");
                                        klikkelt = false;
                                        clickPrevent(klikkelt);
                                        clearInterval(anim);
                                    }
                                    else {
                                        cica.style.top = `${le}px`;
                                        le++;
                                    }
                                }, 5);
                            }
                        }
                    }
                })
            }
        }
    }

    const cica = document.createElement("IMG");
    cica.src = `./src/cat${macska}.png`;
    cica.classList.add("cica");
    
    let currCicaPosX = Math.floor(meret/2);
    let currCicaPosY = Math.floor(meret/2);
    
    let cicaNode = new Node(Math.floor(meret/2), Math.floor(meret/2));
    
    document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).appendChild(cica);
    document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("cicaRajtaVan" + szin);
    document.querySelector(`#x${currCicaPosX}y${currCicaPosY}`).classList.toggle("sima" + szin);
    palya[Math.floor(meret/2)][Math.floor(meret/2)].volt = false;
    
    const cicaSzelenVan = () => (cicaNode.x == 0 || cicaNode.y == 0 || cicaNode.x == meret - 1 || cicaNode.y == meret -1) && !((cicaNode.x == 0 && cicaNode.y == 0) || (cicaNode.x == 0 && cicaNode.y == meret -1) || (cicaNode.x == meret -1 && cicaNode.y == 0) || (cicaNode.x == meret -1 && cicaNode.y == meret -1));
   
    const lepes=function(palya, cicaNode, clicked, sor, oszlop){

        var dbvizszintes=0;
    
        for(let i=0; i<meret; i++){
            if(!palya[cicaNode.x][i].hely){
                dbvizszintes++;
            }
            if(dbvizszintes>=2){
                sor[cicaNode.x]=false;
            }
        }
        
        var dbfuggoleges=0;
    
        for(let i=0; i<meret; i++){
            if(!palya[i][cicaNode.y].hely){
                dbfuggoleges++;
            }
            if(dbfuggoleges>=2){
                oszlop[cicaNode.y]=false;
            }
        }
    
        if(clicked.x==cicaNode.x && clicked.y>cicaNode.y){ 
    
            if(palya[cicaNode.x][cicaNode.y-1].hely && dbvizszintes<2 && oszlop[cicaNode.y-1] && palya[cicaNode.x][cicaNode.y-1].volt){
                cicaNode.y=cicaNode.y-1;
                palya[cicaNode.x][cicaNode.y].volt = false;
                return "balra";
            }
            else if(palya[cicaNode.x-1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x-1] && palya[cicaNode.x-1][cicaNode.y].volt){
                cicaNode.x=cicaNode.x-1;
                palya[cicaNode.x][cicaNode.y].volt = false;
                return "fel";
            }
            else if(palya[cicaNode.x+1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x+1] && palya[cicaNode.x+1][cicaNode.y].volt){
                cicaNode.x=cicaNode.x+1; // le
                palya[cicaNode.x][cicaNode.y].volt = false;
                return "le";                        
            }
        }
        else if(clicked.x==cicaNode.x && clicked.y<cicaNode.y){
                if(palya[cicaNode.x][cicaNode.y+1].hely && dbvizszintes<2 && oszlop[cicaNode.y+1] && palya[cicaNode.x][cicaNode.y+1].volt){
                    cicaNode.y=cicaNode.y+1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "jobbra";
                    }
                    else if(palya[cicaNode.x-1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x-1] && palya[cicaNode.x-1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x-1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "fel";
                    }
                    else if(palya[cicaNode.x+1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x+1] && palya[cicaNode.x+1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x+1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "le";
                    }
                }
        else if(clicked.y==cicaNode.y&&clicked.x>cicaNode.x){
                if(palya[cicaNode.x-1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x-1] && palya[cicaNode.x-1][cicaNode.y].volt){
                    cicaNode.x=cicaNode.x-1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "fel";
                }
                else if(palya[cicaNode.x][cicaNode.y-1].hely && dbvizszintes<2 && oszlop[cicaNode.y-1] && palya[cicaNode.x][cicaNode.y-1].volt){
                    cicaNode.y=cicaNode.y-1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "balra";
                }
                else if(palya[cicaNode.x][cicaNode.y+1].hely && dbvizszintes<2 && oszlop[cicaNode.y+1] && palya[cicaNode.x][cicaNode.y+1].volt){
                    cicaNode.y=cicaNode.y+1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "jobbra";
                }
            }
        else if(clicked.y==cicaNode.y&&clicked.x<cicaNode.x){
                if(palya[cicaNode.x+1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x+1] && palya[cicaNode.x+1][cicaNode.y].volt){
                    cicaNode.x=cicaNode.x+1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "le";
                }
                else if(palya[cicaNode.x][cicaNode.y-1].hely && dbvizszintes<2 && oszlop[cicaNode.y-1] && palya[cicaNode.x][cicaNode.y-1].volt){
                    cicaNode.y=cicaNode.y-1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "balra";
                }
                else if(palya[cicaNode.x][cicaNode.y+1].hely && dbvizszintes<2 && oszlop[cicaNode.y+1] && palya[cicaNode.x][cicaNode.y+1].volt){
                    cicaNode.y=cicaNode.y+1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "jobbra";
                }
            }
        else{
            if(clicked.y>cicaNode.y){
                if(palya[cicaNode.x][cicaNode.y-1].hely && dbvizszintes<2 && oszlop[cicaNode.y-1] && palya[cicaNode.x][cicaNode.y-1].volt){
                    cicaNode.y=cicaNode.y-1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "balra";
                    }
                    else if(palya[cicaNode.x-1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x-1] && palya[cicaNode.x-1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x-1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "fel";
                    }
                    else if(palya[cicaNode.x+1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x+1] && palya[cicaNode.x+1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x+1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "le";
                    }
            }
             else if(clicked.y<cicaNode.y){
                if(palya[cicaNode.x][cicaNode.y+1].hely && dbvizszintes<2 && oszlop[cicaNode.y+1] && palya[cicaNode.x][cicaNode.y+1].volt){
                    cicaNode.y=cicaNode.y+1;
                    palya[cicaNode.x][cicaNode.y].volt = false;
                    return "jobbra";
                    }
                    else if(palya[cicaNode.x-1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x-1] && palya[cicaNode.x-1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x-1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "fel";
                    }
                    else if(palya[cicaNode.x+1][cicaNode.y].hely && dbfuggoleges<2 && sor[cicaNode.x+1] && palya[cicaNode.x+1][cicaNode.y].volt){
                        cicaNode.x=cicaNode.x+1;
                        palya[cicaNode.x][cicaNode.y].volt = false;
                        return "le";
                    }
                 }
             }
                if((dbfuggoleges>=2 && dbvizszintes>=2)){
                    if(clicked.x==cicaNode.x && clicked.y>cicaNode.y){
                            if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                cicaNode.y=cicaNode.y-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "balra";
                                }
                                else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x-1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "fel";
                                }
                                else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x+1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "le";
                                }
                        }
                    else if(clicked.x==cicaNode.x && clicked.y<cicaNode.y){
                            if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                cicaNode.y=cicaNode.y+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "jobbra";
                                }
                                else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x-1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "fel";
                                }
                                else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x+1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "le";
                                }
                            }
                    else if(clicked.y==cicaNode.y && clicked.x>cicaNode.x){
                            if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                cicaNode.x=cicaNode.x-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "fel";
                            }
                            else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                cicaNode.y=cicaNode.y-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "balra";
                            }
                            else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                cicaNode.y=cicaNode.y+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "jobbra";
                            }
                        }
                    else if(clicked.y==cicaNode.y && clicked.x<cicaNode.x){
                            if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                cicaNode.x=cicaNode.x+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "le";
                            }
                            else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                cicaNode.y=cicaNode.y-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "balra";
                            }
                            else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                cicaNode.y=cicaNode.y+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "jobbra";
                            }
                        }
                    else{
                        if(clicked.y>cicaNode.y){
                            if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                cicaNode.y=cicaNode.y-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "balra";
                                }
                                else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x-1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "fel";
                                }
                                else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x+1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "le";
                                }
                        }
                         else if(clicked.y<cicaNode.y){
                            if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                cicaNode.y=cicaNode.y+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "jobbra";
                                }
                                else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x-1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "fel";
                                }
                                else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                    cicaNode.x=cicaNode.x+1;
                                    palya[cicaNode.x][cicaNode.y].volt = false;
                                    return "le";
                                }
                             }
                            }
                         } 
                        else if(dbfuggoleges>=2 && dbvizszintes<2){
                            if(clicked.x==cicaNode.x && clicked.y>cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                }
                            else if(clicked.x==cicaNode.x && clicked.y<cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                    }
                            else if(clicked.y==cicaNode.y && clicked.x>cicaNode.x){
                                    if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                        cicaNode.x=cicaNode.x-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "fel";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                    }
                                }
                            else if(clicked.y==cicaNode.y && clicked.x<cicaNode.x){
                                    if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                        cicaNode.x=cicaNode.x+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "le";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                    }
                                }
                            else{
                                if(clicked.y>cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                }
                                 else if(clicked.y<cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                     }
                                    }
                        }
                        else if(dbvizszintes>=2 && dbfuggoleges<2){
                            if(clicked.x==cicaNode.x && clicked.y>cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                }
                            else if(clicked.x==cicaNode.x && clicked.y<cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                    }
                            else if(clicked.y==cicaNode.y && clicked.x>cicaNode.x){
                                    if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                        cicaNode.x=cicaNode.x-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "fel";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                    }
                                }
                            else if(clicked.y==cicaNode.y && clicked.x<cicaNode.x){
                                    if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                        cicaNode.x=cicaNode.x+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "le";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                    }
                                    else if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                    }
                                }
                            else{
                                if(clicked.y>cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y-1].hely && palya[cicaNode.x][cicaNode.y-1].volt){
                                        cicaNode.y=cicaNode.y-1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "balra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                }
                                 else if(clicked.y<cicaNode.y){
                                    if(palya[cicaNode.x][cicaNode.y+1].hely && palya[cicaNode.x][cicaNode.y+1].volt){
                                        cicaNode.y=cicaNode.y+1;
                                        palya[cicaNode.x][cicaNode.y].volt = false;
                                        return "jobbra";
                                        }
                                        else if(palya[cicaNode.x-1][cicaNode.y].hely && palya[cicaNode.x-1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x-1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "fel";
                                        }
                                        else if(palya[cicaNode.x+1][cicaNode.y].hely && palya[cicaNode.x+1][cicaNode.y].volt){
                                            cicaNode.x=cicaNode.x+1;
                                            palya[cicaNode.x][cicaNode.y].volt = false;
                                            return "le";
                                        }
                                     }
                                    }
                        }

                        let randomTomb = [];
                        if(palya[cicaNode.x][cicaNode.y+1].hely){
                            randomTomb.push("jobbra");
                        }
                        if(palya[cicaNode.x][cicaNode.y-1].hely){
                            randomTomb.push("balra");
                        }
                        if(palya[cicaNode.x-1][cicaNode.y].hely){
                            randomTomb.push("fel");
                        }
                        if(palya[cicaNode.x+1][cicaNode.y].hely){
                            randomTomb.push("le");
                        }

                        let merre = randomTomb[Math.floor(Math.random() * (randomTomb.length))];
                            if(merre == "jobbra"){
                                cicaNode.y=cicaNode.y+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "jobbra";
                            }
                            else if(merre == "balra"){
                                cicaNode.y=cicaNode.y-1;                                
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "balra";
                            }
                            else if(merre == "fel"){
                                cicaNode.x=cicaNode.x-1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "fel";
                            }
                            else if(merre == "le"){
                                cicaNode.x=cicaNode.x+1;
                                palya[cicaNode.x][cicaNode.y].volt = false;
                                return "le";
                            }

            if(!palya[cicaNode.x][cicaNode.y-1].hely && !palya[cicaNode.x][cicaNode.y+1].hely && !palya[cicaNode.x-1][cicaNode.y].hely && !palya[cicaNode.x+1][cicaNode.y].hely){
                valakiNyert(jatek, "játékos", meret, zsetonok, kicsiTomb, kozepesTomb, nagyTomb);
            }
    }
}