function jelszoMutatasa() {
    var x = document.getElementById("jelszo");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function bemenetCheck() {
    var email = document.getElementById('email').value;
    var jelszo = document.getElementById('jelszo').value;
    var bejelentkezes_b = document.getElementById('bejelentkezes_b');

    if (email && jelszo) {
        bejelentkezes_b.style.backgroundColor = 'white';
        bejelentkezes_b.style.color = 'black';
    } else {
        bejelentkezes_b.style.backgroundColor = 'transparent';
        bejelentkezes_b.style.color = 'white';
    }
}

document.getElementById('email').addEventListener('input', bemenetCheck);
document.getElementById('jelszo').addEventListener('input', bemenetCheck);

checkInputFields();
