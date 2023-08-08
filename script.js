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
    const contentDiv = document.getElementById('contentTTT');

    let tableHTML = '<table id="table">';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            if (fields[index] === 'circle') {
                tableHTML += generateCircle();
            } else if (fields[index] === 'cross') {
                tableHTML += generateCross();
            } else {
                tableHTML += `<td onclick="fillField(${index})"></td>`;
            }
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    contentDiv.innerHTML = tableHTML;
    enableSymbolsOpacity();
    checkWinner();
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
    if (!fields[index]) {
        const symbol = symbolToSet || currentPlayer;
        fields[index] = symbol;
        const tdElement = document.getElementsByTagName('td')[index];
        tdElement.innerHTML = symbol === 'circle' ? generateCircle() : generateCross();
        tdElement.onclick = null;


        // Wenn ein Gewinner gefunden wird, bricht die Funktion ab
        if (checkWinner()) return;

        // Wenn der Computer als nächstes spielen soll und es ein menschlicher Zug war (symbolToSet ist undefiniert)
        if (computerPlayerActive && !symbolToSet) {
            makeComputerMove();
        } else {
            // currentPlayer wechseln nur, wenn es nicht der Computerzug ist
            currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
            updateSymbolVisibility(currentPlayer);
        }
    }
}

function makeComputerMove() {
    const availableIndexes = fields.reduce((acc, field, idx) => {
        if (!field) {
            acc.push(idx);
        }
        return acc;
    }, []);

    if (availableIndexes.length === 0) return;

    const computerSymbol = currentPlayer === 'circle' ? 'cross' : 'circle';
    const humanSymbol = currentPlayer;

    // Versuche, den Gewinnzug für den Computer zu finden
    let winningMove = findBestMove(availableIndexes, computerSymbol);

    // Wenn kein Gewinnzug für den Computer gefunden wurde, prüfe, ob der menschliche Spieler im nächsten Zug gewinnen könnte und blockiere ihn
    if (winningMove === null) {
        winningMove = findBestMove(availableIndexes, humanSymbol);
    }

    // Wenn weder ein Gewinnzug für den Computer noch ein Blockzug gefunden wurde, wähle einen zufälligen Zug
    const moveIndex = winningMove !== null ? winningMove : availableIndexes[Math.floor(Math.random() * availableIndexes.length)];

    fillField(moveIndex, computerSymbol);
    currentPlayer = currentPlayer === 'circle' ? 'cross' : 'circle';
    updateSymbolVisibility(currentPlayer);
}

function findBestMove(availableIndexes, symbol) {
    for (let index of availableIndexes) {
        let testFields = [...fields];
        testFields[index] = symbol;
        if (isWinningMove(testFields)) {
            return index;
        }
    }
    return null;
}

function isWinningMove(testFields) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (testFields[a] && testFields[a] === testFields[b] && testFields[a] === testFields[c]) {
            return true;
        }
    }

    return false;
}



function checkWinner() {
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

    let winnerFound = false;
    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // We have a winner
            winnerFound = true;
            removeOnClickAttributes();
            drawWinningLine(combination);
            disableSymbolsOpacity();
            showWinner(fields[a]); // Übergeben des Gewinnersymbols
            return true;
        }
    }

    // Aktualisiere die Symbole nur, wenn kein Gewinner gefunden wurde
    if (!winnerFound) {
        if (checkDraw()) {
            // Code, um das Unentschieden anzuzeigen oder zu handhaben
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
    const [a, b, c] = combination;
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('viewBox', '0 0 300 300'); // Adjusted viewBox
    svgElement.setAttribute('class', 'winnerLine');

    const lineElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    lineElement.setAttribute('x1', getCoordinateX(a));
    lineElement.setAttribute('y1', getCoordinateY(a));
    lineElement.setAttribute('x2', getCoordinateX(c));
    lineElement.setAttribute('y2', getCoordinateY(c));
    svgElement.appendChild(lineElement);

    document.getElementById('table').appendChild(svgElement);
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
            <svg id="circleInTD" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
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
                    style="stroke:url(#circle); stroke-width:30; fill:none; stroke-linecap:round; stroke-linejoin:round; filter:url(#shadow);">
                    <!-- Animation für das Zeichnen des Kreises (einmalige Ausführung, 0.6 Sekunden Dauer) -->
                    <animate attributeName="stroke-dasharray" dur="0.6s" keyTimes="0; 1" values="0 377; 377 0" fill="freeze" />
                </circle>
            </svg>
        </td>
    `;

    return svgHTML;
}



function generateCross() {
    const svgHTML = /*html*/`
        <td style="position: relative;">
            <svg id="crossInTD" style="width: 100%; height: 100%;" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
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
    let crossElements = document.querySelectorAll('#crossInTD');
    let circleElements = document.querySelectorAll('#circleInTD');
    let winSymbol = document.getElementById('showWinner');
    let drawTxt = document.getElementById('showDraw');

    drawTxt.classList.add('d-none');
    winSymbol.classList.add('d-none');
    crossElements.forEach((element) => element.remove());
    circleElements.forEach((element) => element.remove());

    // Array zurücksetzen
    fields = new Array(9).fill(null);

    // Zellen zurücksetzen und wieder anklickbar machen
    const cells = document.querySelectorAll('td');
    cells.forEach((cell, index) => {
        cell.innerHTML = ''; // Inhalte der Zelle löschen
        cell.onclick = () => fillField(index); // Event Listener wieder hinzufügen
    });

    disableRestartButton();
    updateSymbolVisibility(currentPlayer);
    render();
}

