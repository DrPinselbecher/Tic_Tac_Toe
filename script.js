let fields = [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
];

let computerPlayerActive = false;
let computer = 'circle';
let currentPlayer = 'circle';

function init() {
    render();
}

function render() {
    generateTableHTML();
    enableSymbolsOpacity();
    checkWinner();
}

function generateTableHTML() {
    let tableHTML = '<table id="table">'; // Beginnt die HTML-Tabelle mit einer öffnenden <table>-Tag
    for (let i = 0; i < 3; i++) { // Äußere Schleife, die für jede Zeile in einer 3x3-Tabelle läuft
        tableHTML += '<tr>'; // Fügt eine öffnende <tr>-Tag für eine neue Zeile hinzu
        for (let j = 0; j < 3; j++) { // Innere Schleife, die für jede Zelle in der aktuellen Zeile läuft
            const index = i * 3 + j; // Berechnet den Index im 1D-Array "fields" basierend auf der aktuellen Zeile und Spalte
            if (fields[index] === 'circle') { // Wenn die Zelle einen Kreis enthält
                tableHTML += generateCircle(); // Fügt das HTML für den Kreis hinzu
            } else if (fields[index] === 'cross') { // Wenn die Zelle ein Kreuz enthält
                tableHTML += generateCross(); // Fügt das HTML für das Kreuz hinzu
            } else { // Wenn die Zelle leer ist
                tableHTML += `<td onclick="fillField(${index})"></td>`; // Fügt eine leere Zelle mit einem onclick-Handler hinzu
            }
        }
        tableHTML += '</tr>'; // Schließt die aktuelle Zeile mit einem schließenden <tr>-Tag
    }
    tableHTML += '</table>'; // Schließt die Tabelle mit einem schließenden <table>-Tag
    document.getElementById('contentTTT').innerHTML = tableHTML; // Setzt den HTML-Inhalt des Elements mit der ID 'contentTTT' auf die generierte Tabelle
}


function updateSymbolVisibility(currentPlayer) {
    const crossElement = document.getElementById('showCross');
    const circleElement = document.getElementById('showCircle');

    if (currentPlayer === 'cross') {
        crossElement.style.opacity = 0.2; // macht das "cross"-Element blasser
        circleElement.style.opacity = 1.0; // setzt das "circle"-Element auf voll sichtbar
    } else if (currentPlayer === 'circle') {
        crossElement.style.opacity = 1.0; // setzt das "cross"-Element auf voll sichtbar
        circleElement.style.opacity = 0.2; // macht das "circle"-Element blasser
    }
}

function fillField(index, symbolToSet) {
    if (!fields[index]) { // Überprüft, ob das Feld am gegebenen Index bereits gefüllt ist
        const symbol = symbolToSet || currentPlayer; // Setzt das Symbol entweder auf das übergebene Symbol oder das des aktuellen Spielers
        fields[index] = symbol; // Füllt das Feld im Array mit dem ausgewählten Symbol
        const tdElement = document.getElementsByTagName('td')[index]; // Holt das HTML-Element für das Feld am gegebenen Index
        tdElement.innerHTML = symbol === 'circle' ? generateCircle() : generateCross(); // Setzt den inneren HTML-Inhalt des Elements entweder auf einen Kreis oder ein Kreuz, je nachdem, welches Symbol ausgewählt ist
        tdElement.onclick = null; // Entfernt den onClick-Handler, um weitere Klicks auf dieses Feld zu verhindern
        if (checkWinner()) return; // Überprüft, ob ein Gewinner gefunden wurde, und bricht die Funktion ab, wenn dies der Fall ist
        if (computerPlayerActive && !symbolToSet) { // Wenn der Computer der nächste Spieler ist und es ein menschlicher Zug war
            makeComputerMove(); // Lässt den Computer einen Zug machen
        } else { // Wenn es ein menschlicher Zug ist oder der Computer nicht der nächste Spieler ist
            switchPlayer(); // Wechselt den aktuellen Spieler
            updateSymbolVisibility(currentPlayer); // Aktualisiert die Symbol-Sichtbarkeit für den aktuellen Spieler
        }
    }
}


function makeComputerMove() {
    // Reduziere das Spielfeld auf einen Array von verfügbaren Indizes (Zellen, die nicht belegt sind)
    const availableIndexes = fields.reduce((acc, field, idx) => {
        if (!field) { // Wenn das Feld nicht belegt ist
            acc.push(idx); // Füge den Index zum Array der verfügbaren Indizes hinzu
        }
        return acc; // Gebe den akkumulierten Wert zurück
    }, []);
    if (availableIndexes.length === 0) return; // Wenn keine Züge mehr verfügbar sind, beende die Funktion
    const computerSymbol = currentPlayer === 'circle' ? 'cross' : 'circle'; // Bestimme das Symbol des Computers
    const humanSymbol = currentPlayer; // Speichere das Symbol des menschlichen Spielers
    // Versuche, den Gewinnzug für den Computer zu finden
    let winningMove = findBestMove(availableIndexes, computerSymbol);
    // Wenn kein Gewinnzug für den Computer gefunden wurde, prüfe, ob der menschliche Spieler im nächsten Zug gewinnen könnte und blockiere ihn
    if (winningMove === null) {
        winningMove = findBestMove(availableIndexes, humanSymbol);
    }
    // Wenn weder ein Gewinnzug für den Computer noch ein Blockzug gefunden wurde, wähle einen zufälligen Zug
    const moveIndex = winningMove !== null ? winningMove : availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
    fillField(moveIndex, computerSymbol); // Fülle das gewählte Feld mit dem Symbol des Computers
    switchPlayer(); // Wechsle den aktuellen Spieler
    updateSymbolVisibility(currentPlayer); // Aktualisiere die Symbol-Sichtbarkeit entsprechend dem neuen Spieler
}


function findBestMove(availableIndexes, symbol) {
    for (let index of availableIndexes) { // Durchlaufe jeden verfügbaren Index im übergebenen Array "availableIndexes"
        let testFields = [...fields]; // Erstelle eine Kopie des aktuellen Spielfelds, um einen Testzug durchzuführen
        testFields[index] = symbol;    // Füge das Symbol (entweder 'circle' oder 'cross') an der derzeit untersuchten Position im Testspielfeld ein
        if (isWinningMove(testFields)) { // Prüfe, ob das Einfügen des Symbols an dieser Position zu einem Gewinn führt
            return index;              // Wenn es ein Gewinnzug ist, gib den Index dieses Zugs zurück
        }
    }
    return null; // Wenn kein Gewinnzug gefunden wird, gib null zurück
}



function isWinningMove(testFields) {

    for (const combination of winningCombinations()) {
        const [a, b, c] = combination;
        if (testFields[a] && testFields[a] === testFields[b] && testFields[a] === testFields[c]) {
            return true;
        }
    }

    return false;
}

function winningCombinations() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return winningCombinations;
}

function checkWinner() {

    let winnerFound = false;
    for (const combination of winningCombinations()) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // We have a winner
            winnerFound = true;
            removeOnClickAttributes();
            drawWinningLine(combination);
            disableSymbolsOpacity();
            showWinner(fields[a]);
            return true;
        }
    }

    if (!winnerFound) {
        if (checkDraw()) {
            showDraw();
        } else {
            updateSymbolVisibility(currentPlayer);
        }
    }
}

function checkDraw() {
    return !fields.includes(null);
}

function showDraw() {
    let drawTxt = document.getElementById('showDraw');
    drawTxt.classList.remove('d-none');

    disableSymbolsOpacity();

    drawTxt.innerHTML = `
        <h2 id="draw" class="drawTxt">Es ist ein Unentschieden!</h2>
    `;

    enableRestartButton();
}

function showWinner(winningSymbol) {
    let winner = document.getElementById('showWinner');
    let border = document.getElementById('symbolsContainer');
    let symbol;

    border.classList.remove('d-none');
    winner.classList.remove('d-none');

    if (winningSymbol === 'cross') {
        symbol = generateCross();
    } else {
        symbol = generateCircle();
    }

    winner.innerHTML = `
        <h2 class="drawTxt">Glückwunsch an<br><span class="winSymbol">${symbol}</span></h2>
    `;
    enableRestartButton();
}


function disableSymbolsOpacity() {
    const symbolsContainer = document.getElementById('symbolsContainer');

    symbolsContainer.style.display = 'none';
}

function enableSymbolsOpacity() {
    const symbolsContainer = document.getElementById('symbolsContainer');

    symbolsContainer.style.display = '';
}

function removeOnClickAttributes() {
    const tdElements = document.getElementsByTagName('td');
    for (const tdElement of tdElements) {
        tdElement.removeAttribute('onclick');
        tdElement.style.cursor = 'default';
    }
}

function drawWinningLine(combination) {
    const [a, b, c] = combination; // Destructuring der "combination", um die ersten, zweiten und dritten Indizes zu erhalten
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); // Erstellen eines neuen SVG-Elements
    svgElement.setAttribute('viewBox', '0 0 300 300'); // Festlegen des viewBox-Attributs des SVG, um den sichtbaren Bereich zu definieren
    svgElement.setAttribute('class', 'winnerLine'); // Festlegen der CSS-Klasse für das SVG-Element

    const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line'); // Erstellen eines neuen Linien-Elements innerhalb des SVG
    lineElement.setAttribute('x1', getCoordinateX(a)); // Festlegen des x1-Attributs für den Startpunkt der Linie basierend auf Index a
    lineElement.setAttribute('y1', getCoordinateY(a)); // Festlegen des y1-Attributs für den Startpunkt der Linie basierend auf Index a
    lineElement.setAttribute('x2', getCoordinateX(c)); // Festlegen des x2-Attributs für den Endpunkt der Linie basierend auf Index c
    lineElement.setAttribute('y2', getCoordinateY(c)); // Festlegen des y2-Attributs für den Endpunkt der Linie basierend auf Index c
    svgElement.appendChild(lineElement); // Hinzufügen des Linien-Elements zum SVG-Element

    document.getElementById('table').appendChild(svgElement); // Anhängen des SVG-Elements an das Element mit der ID 'table'
}

function getCoordinateX(index) {
    return (index % 3) * 100 + 50; // Mitte eines 100x100 Feldes
}

function getCoordinateY(index) {
    return Math.floor(index / 3) * 100 + 50; // Mitte eines 100x100 Feldes
}

function generateCircle() {
    const svgHTML = /*html*/`
        <td style="position: relative;">
            <svg class="circleInTD" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feOffset dx="3" dy="3" in="SourceAlpha" result="offset" />
                        <feGaussianBlur in="offset" stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <defs>
                    <linearGradient id="circle" gradientTransform="rotate(45)">
                        <stop offset="20%" stop-color="#FF7F00" />
                        <stop offset="100%" stop-color="#ff5b1f" />
                    </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="60" id="circlePath"
                    style="stroke:url(#circle); stroke-width:30; fill:none; stroke-linecap:round; stroke-linejoin:round; filter:url(#shadow);">                    <animate attributeName="stroke-dasharray" dur="0.6s" keyTimes="0; 1" values="0 377; 377 0" fill="freeze" />
                </circle>
            </svg>
        </td>
    `;

    return svgHTML;
}



function generateCross() {
    const svgHTML = /*html*/`
        <td style="position: relative;">
            <svg class="crossInTD" style="width: 100%; height: 100%;" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <linearGradient id="cross" gradientTransform="rotate(45)">
                        <stop offset="20%" stop-color="#9c00ff" />
                        <stop offset="100%" stop-color="#7300b5" />
                    </linearGradient>
                </defs>
                <!-- Schatten für die erste Linie -->
                <path d="M50 50 L150 150"
                    style="stroke:black; stroke-width:25; fill:none; stroke-linecap:round; stroke-linejoin:round; filter: drop-shadow(3px 3px 3px black);">
                    <animate attributeName="stroke-dasharray" dur="0.5s" repeatCount="1" values="0 141; 141 0" fill="freeze" />
                </path>
                <!-- Schatten für die zweite Linie -->
                <path d="M50 150 L150 50"
                    style="stroke:black; stroke-width:25; fill:none; stroke-linecap:round; stroke-linejoin:round; filter: drop-shadow(3px 3px 3px black);">
                    <animate attributeName="stroke-dasharray" dur="0.5s" repeatCount="1" values="0 141; 141 0" fill="freeze" />
                </path>
                <!-- Die erste lila Linie -->
                <path d="M50 50 L150 150"
                    style="stroke:url(#cross); stroke-width:25; fill:none; stroke-linecap:round; stroke-linejoin:round;">
                    <animate attributeName="stroke-dasharray" dur="0.5s" repeatCount="1" values="0 141; 141 0" fill="freeze" />
                </path>
                <!-- Die zweite lila Linie -->
                <path d="M50 150 L150 50"
                    style="stroke:url(#cross); stroke-width:25; fill:none; stroke-linecap:round; stroke-linejoin:round;">
                    <animate attributeName="stroke-dasharray" dur="0.5s" repeatCount="1" values="0 141; 141 0" fill="freeze" />
                </path>
            </svg>
        </td>
    `;
    return svgHTML;
}

function playWithComputer() {
    document.getElementById('computer-button').style.display = 'none'; // Versteckt den Button mit der ID 'computer-button'
    document.getElementById('player-button').style.display = 'block';  // Zeigt den Button mit der ID 'player-button' an
    computerPlayerActive = true;
    resetGame();
}

function playWithPlayer() {
    document.getElementById('player-button').style.display = 'none';   // Versteckt den Button mit der ID 'player-button'
    document.getElementById('computer-button').style.display = 'block'; // Zeigt den Button mit der ID 'computer-button'
    computerPlayerActive = false;
    resetGame();
}

function enableRestartButton() {
    const button = document.getElementById('restartGame');
    button.disabled = false;
    button.classList.remove('disabled-button');
}


function disableRestartButton() {
    const button = document.getElementById('restartGame');
    button.disabled = true;
    button.classList.add('disabled-button');
}

function resetGame() {
    removeElements();
    setArrayToNull();
    resetAllCells();
    disableRestartButton();
    switchPlayer();
    render();
}

function resetAllCells() {
    document.querySelectorAll('td').forEach((cell, index) => {
        cell.innerHTML = ''; // Inhalte der Zelle löschen
        cell.onclick = () => fillField(index); // Event Listener wieder hinzufügen
    });
}

function removeElements() {
    document.querySelectorAll('.crossInTD').forEach((element) => element.remove()); // Klassen statt IDs verwenden
    document.querySelectorAll('.circleInTD').forEach((element) => element.remove()); // Klassen statt IDs verwenden
    document.getElementById('showWinner').classList.add('d-none');
    document.getElementById('showDraw').classList.add('d-none');
}

function setArrayToNull() {
    fields = new Array(9).fill(null); // Direkte Zuweisung zum "fields"-Array
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
}