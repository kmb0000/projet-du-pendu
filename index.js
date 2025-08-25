// --- Variables globales ---
const listeMots = ["ORDINATEUR", "PROGRAMMATION", "JAVASCRIPT", "NAVIGATEUR", "INTERNET", "PENDU", "ALGORITHME", "MAISON", "CHAT", "SOLEIL", "MONDE", "TEMPS", "JOUR", "NOMBRE","VILLE", "DROIT", "LUMIERE", "HISTOIRE", "FORET", "OISEAU", "TRAVAIL", "NUAGE", "FAMILLE",
"MER", "LIVRE"];
let motSecret = "";
let lettresTrouvees = [];
let erreurs = 0;
const maxErreurs = 6;
let streak = 0;

// Récupération des éléments du DOM
const motAffiche = document.getElementById("mot-a-deviner");
const clavier = document.getElementById("clavier");
const message = document.getElementById("message");
const boutonRejouer = document.getElementById("bouton-rejouer");
const winstreak = document.querySelector('#winstreak');
const boutonTheme = document.querySelector('#theme-toggle')

// Parties du pendu 
const partiesPendu = [
  document.getElementById("tete"),
  document.getElementById("corps"),
  document.getElementById("bras-gauche"),
  document.getElementById("bras-droit"),
  document.getElementById("jambe-gauche"),
  document.getElementById("jambe-droit")
];

// --- Fonctions ---

// Choisir un mot au hasard
function choisirMot() {
  motSecret = listeMots[Math.floor(Math.random() * listeMots.length)];
  lettresTrouvees = [];
  erreurs = 0;
  mettreAJourAffichageMot();
  cacherPendu();
  message.textContent = "";
}

// Afficher le mot avec underscores et lettres trouvées
function mettreAJourAffichageMot() {
  motAffiche.textContent = motSecret
    .split("")
    .map(lettre => (lettresTrouvees.includes(lettre) ? lettre : "_"))
    .join(" ");
}

// Cacher toutes les parties du pendu
function cacherPendu() {
  partiesPendu.forEach(partie => partie.classList.add("cache"));
}

// Montrer une partie du pendu
function montrerPendu() {
  if (erreurs > 0 && erreurs <= maxErreurs) {
    partiesPendu[erreurs - 1].classList.remove("cache");
  }
}

// Gérer un essai de lettre
function verifierLettre(lettre) {
  if (motSecret.includes(lettre)) {
    lettresTrouvees.push(lettre);
    mettreAJourAffichageMot();
    verifierVictoire();
  
  } else {
    erreurs++;
    montrerPendu();
    verifierDefaite();
  }
}

// Vérifier si le joueur a gagné
function verifierVictoire() {
  if (motSecret.split("").every(l => lettresTrouvees.includes(l))) {
    message.textContent = "🎉 Bravo ! Vous avez gagné !";
    desactiverClavier();
    compteurWinstreak(true);
  }
}

// Vérifier si le joueur a perdu
function verifierDefaite() {
  if (erreurs >= maxErreurs) {
    message.textContent = `💀 Perdu... Le mot était : ${motSecret}`;
    desactiverClavier();
    compteurWinstreak(false);
  }
}

// Créer le clavier virtuel
function creerClavier() {
  clavier.innerHTML = "";
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  alphabet.forEach(lettre => {
    const bouton = document.createElement("button");
    bouton.textContent = lettre;
    bouton.classList.add("touche");
    bouton.addEventListener("click", () => {
      bouton.disabled = true;
      verifierLettre(lettre);
    });
    clavier.appendChild(bouton);
  });
}

// Désactiver toutes les touches après fin de partie
function desactiverClavier() {
  const touches = document.querySelectorAll(".touche");
  touches.forEach(touche => (touche.disabled = true));
}

// Lancer une nouvelle partie
function nouvellePartie() {
  choisirMot();
  creerClavier();
}

// --- Événements
boutonRejouer.addEventListener("click", nouvellePartie);

// --- Lancer le jeu au chargement 
nouvellePartie();

//--- Fonctionnalité Winstreak
function compteurWinstreak(victoire) {
  if(victoire) {
    streak++;
    winstreak.textContent = `🔥 Win Streak ${streak}`;
  } else {
    streak = 0;
    winstreak.textContent = '';
  }
}

//--- Fonctionnalité theme-sombre 
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    boutonTheme.textContent = '☀️';
}

boutonTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark');

  if(document.body.classList.contains('dark')) {
    boutonTheme.textContent = '☀️';
    localStorage.setItem('theme', 'dark');
  }else {
    boutonTheme.textContent = '🌙';
    localStorage.setItem('theme', 'clair');
  }
});