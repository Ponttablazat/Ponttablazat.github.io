document.addEventListener("DOMContentLoaded", function () {
	var yesKep = new Image();
	yesKep.src = "../img/yes.png";

	var noKep = new Image();
	noKep.src = "../img/no.png";

	function jelszoMutatasa() {
		var x = document.getElementById("jelszo");
		if (x.type === "password") {
			x.type = "text";
		} else {
			x.type = "password";
		}
	}

	function bemenetCheck() {
		var email = document.getElementById("email").value;
		var jelszo = document.getElementById("jelszo").value;
		var bejelentkezes_b = document.getElementById("bejelentkezes_b");

		if (email && jelszo) {
			bejelentkezes_b.style.backgroundColor = "white";
			bejelentkezes_b.style.color = "black";
			bejelentkezes_b.style.cursor = "pointer";
		} else {
			bejelentkezes_b.style.backgroundColor = "transparent";
			bejelentkezes_b.style.color = "white";
			bejelentkezes_b.style.cursor = "default";
		}
	}

	function handleRememberMe() {
		var rememberMeCheckbox = document.getElementById("bejelentkezes_cb");
		var email = document.getElementById("email").value;
		var jelszo = document.getElementById("jelszo").value;

		if (rememberMeCheckbox.checked) {
			localStorage.setItem("rememberedEmail", email);
			localStorage.setItem("rememberedPassword", jelszo);
		} else {
			localStorage.removeItem("rememberedEmail");
			localStorage.removeItem("rememberedPassword");
		}
	}

	document.getElementById("email").addEventListener("input", bemenetCheck);
	document.getElementById("jelszo").addEventListener("input", bemenetCheck);
	document
		.getElementById("jelszo_cb")
		.addEventListener("click", jelszoMutatasa);
	document
		.getElementById("bejelentkezes_cb")
		.addEventListener("change", handleRememberMe);

	bemenetCheck();

	var rememberedEmail = localStorage.getItem("rememberedEmail");
	var rememberedPassword = localStorage.getItem("rememberedPassword");

	if (rememberedEmail && rememberedPassword) {
		import("./firebase.js")
			.then(({ signInWithEmailAndPassword, auth }) => {
				signInWithEmailAndPassword(auth, rememberedEmail, rememberedPassword)
					.then((userCredential) => {
						const user = userCredential.user;
						console.log("Automatikus bejelentkezés sikeres:", user);
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.error(
							"Automatikus bejelentkezési hiba:",
							errorCode,
							errorMessage
						);
					});
			})
			.catch((error) => {
				console.error("Hiba az Firebase modul betöltésekor:", error);
			});
	}

	var loginButton = document.getElementById("bejelentkezes_b");
	loginButton.addEventListener("click", function () {
		var email = document.getElementById("email").value;
		var jelszo = document.getElementById("jelszo").value;

		import("./firebase.js")
			.then(({ signInWithEmailAndPassword, auth }) => {
				signInWithEmailAndPassword(auth, email, jelszo)
					.then((userCredential) => {
						const user = userCredential.user;
						console.log("Bejelentkezés sikeres:", user);

						if (document.getElementById("bejelentkezes_cb").checked) {
							localStorage.setItem("rememberedEmail", email);
							localStorage.setItem("rememberedPassword", jelszo);
						} else {
							localStorage.removeItem("rememberedEmail");
							localStorage.removeItem("rememberedPassword");
						}

						// Ide navigálhatod a felhasználót a sikeres bejelentkezés után
						// window.location.href = '/dashboard.html'; // Példa
					})
					.catch((error) => {
						const errorCode = error.code;
						const errorMessage = error.message;
						console.error("Bejelentkezési hiba:", errorCode, errorMessage);
					});
			})
			.catch((error) => {
				console.error("Hiba az Firebase modul betöltésekor:", error);
			});
	});
});
