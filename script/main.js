let paraulaSecreta = "";
let paraulaGuions = "";
let errors = 0;
let puntuacio = 0;
let totalPartides = 0;
let partidesGuanyades = 0;
let puntuacioMaxima = 0;
let encertsConsecutius = 0;


// Activa o desactiva el boto  si el imput te text o no
document.getElementById("input").oninput = function() {
    let botonComencar = document.getElementById("botonComençar");
    let inputValue = document.getElementById("input").value;

    let tieneTexto = false;
    for (let i = 0; i < inputValue.length; i++) {
        if (inputValue[i] !== " ") {
            tieneTexto = true;
            break;
        }
    }

    if (tieneTexto) {
        botonComencar.removeAttribute("disabled");
    } else {
        botonComencar.setAttribute("disabled", "disabled");
    }
};

function mostrar() {
    document.getElementById("input").type = "text";
}

function ocultar() {
    document.getElementById("input").type = "password";
}

function començarPartida() {
    const inputValor = document.getElementById("input").value.trim();

    if (inputValor === "") {
        alert("Has d’afegir una paraula per poder començar a jugar");
        return;
    }

    let tieneNumeros = false;
    for (let i = 0; i < inputValor.length; i++) {
        if (inputValor[i] >= '0' && inputValor[i] <= '9') {
            tieneNumeros = true;
            break;
        }
    }

    if (tieneNumeros) {
        alert("La paraula no pot contenir números");
        return;
    }

    if (inputValor.length < 4) {
        alert("La paraula ha de contenir més de 3 caràcters");
        return;
    }

    document.getElementById("botonMostrar").disabled = true;
    document.getElementById("botonComençar").disabled = true;

    paraulaSecreta = inputValor.toUpperCase();

    let guiones = ""; 
    for (let i = 0; i < paraulaSecreta.length; i++) {
        guiones += "_ "; 
    }
    paraulaGuions = guiones.trim();

    document.getElementById("paraula").textContent = paraulaGuions; 
    document.getElementById("botons").style.display = "block";
    errors = 0;
    puntuacio = 0;
    encertsConsecutius = 0; 
    actualitzarImatge();
    actualitzarPuntuacio();
    reiniciarBotones();
    
    document.getElementById("paraula").style.backgroundColor = ""; 
}

function actualitzarImatge() {
    document.getElementById("penjat").src = `/imatges/penjat_${errors}.jpg`;
}


// comprova la lletra on click y se ha encertat es posa en la paraula y desactiva i cambia el colo del boto seleccionat
function comprovarLletra(lletra) {
    let encert = false;
    let novaParaulaGuions = "";
    let aparicions = 0; 

    const boton = document.getElementById(`boto${lletra}`);
    boton.disabled = true;
    boton.style.color = "red";  
    boton.style.borderColor = "red";  

    for (let i = 0; i < paraulaSecreta.length; i++) {
        if (paraulaSecreta[i] === lletra) {
            novaParaulaGuions += lletra + " ";
            encert = true;
            aparicions++; 
        } else {
            novaParaulaGuions += paraulaGuions[i * 2] + " ";
        }
    }

    paraulaGuions = novaParaulaGuions.trim();
    document.getElementById("paraula").textContent = paraulaGuions; 

    if (encert) {
        encertsConsecutius++; 
        let puntsActuals = encertsConsecutius; 
        puntuacio += puntsActuals * aparicions; 
    } else {
        encertsConsecutius = 0; 
        puntuacio = Math.max(0, puntuacio - 1); 
        errors++; 
        actualitzarImatge();
    }

    actualitzarPuntuacio();
    verificarFinal();
}

//funcio que reinicia els botons quan es perd o es gana
function reiniciarBotones() {
    const contenedorBotones = document.getElementById("botons");
    const botones = contenedorBotones.getElementsByTagName("button");

    for (let i = 0; i < botones.length; i++) {
        botones[i].disabled = false; 
        botones[i].style.color = "";
        botones[i].style.borderColor = ""; 
    }
}

//funcio que verificar si ha perdut per intents o detecta si ja no hi ha guions per tant ha completat la paraula 
function verificarFinal() {
    if (errors === 10) {  
        document.getElementById("paraula").style.backgroundColor = "red"; 
        finalitzarPartida(false);  
    } else if (!paraulaGuions.includes("_")) {  
        finalitzarPartida(true);
    }
}

//funcio que quan es finalitza la partida, activa de nou els botons i posa el background color depenen de si ha guanyat o perdut
function finalitzarPartida(guanyada) {
    document.getElementById("botons").style.display = "none";
    totalPartides++;
    
    if (guanyada) {
        partidesGuanyades++;
        document.getElementById("paraula").style.backgroundColor = "green"; 
    } else {
        document.getElementById("paraula").style.backgroundColor = "red"; 
        document.getElementById("paraula").textContent = paraulaSecreta; 
    }

    if (puntuacio > puntuacioMaxima) {
        puntuacioMaxima = puntuacio;
    }

    document.getElementById("input").disabled = false; 
    document.getElementById("botonMostrar").disabled = false;
    document.getElementById("botonComençar").disabled = false; 

    actualitzarInformacioJugador();
}

function actualitzarPuntuacio() {
    document.getElementById("puntuacio").textContent = "Puntuació: " + puntuacio; 
}

//funcio que actualiza la informacio del jugador
function actualitzarInformacioJugador() {
    let percentatgeGuanyades;
    if (partidesGuanyades > 0) {
        let divisio = partidesGuanyades / totalPartides;
        let percentatge = divisio * 100;
        percentatgeGuanyades = percentatge.toFixed(2);
    } else {
        percentatgeGuanyades = 0;
    }

    document.getElementById("puntuacio").textContent = "Puntuació: " + puntuacio; 
    document.getElementById("totalPartides").textContent = "Total partides: " + totalPartides; 
    document.getElementById("partidesGuanyades").textContent = "Partides guanyades: " + partidesGuanyades; 
    document.getElementById("percentatgeGuanyades").textContent = "Percentatge de partides guanyades: " + percentatgeGuanyades + "%"; 
    document.getElementById("puntuacioMesAlta").textContent = "Partida amb més punts: " + puntuacioMaxima + " punts"; 
}
