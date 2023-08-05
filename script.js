let fields = [
    'cross',
    'circle',
    null,
    null,
    null,
    null,
    'cross',
    null,
    null,
];

function init() {
    render();
}

// Die Funktion zum Generieren des Spielfelds und Rendern in das HTML-Div "content"
function render() {
    // Hole das Content-Div
    const contentDiv = document.getElementById('content');

    // Erstelle den HTML-Code für die Tabelle
    let tableHTML = '<table>';
    for (let i = 0; i < 3; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < 3; j++) {
            const index = i * 3 + j;
            // Prüfe den Wert im Array und füge entsprechend 'circle' oder 'cross' hinzu
            if (fields[index] === 'circle') {
                tableHTML += /*html*/`
                    <td>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150">
    <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="8" dy="2" in="SourceAlpha" result="offset" />
            <feGaussianBlur in="offset" stdDeviation="0" result="blur" />
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
    <circle cx="75" cy="75" r="48"
        style="stroke:url(#circle); stroke-width:30; fill:none; stroke-linecap:round; stroke-linejoin:round; filter:url(#shadow);" />
</svg>
                    </td>
                    `;
            } else if (fields[index] === 'cross') {
                tableHTML += /*html*/`
                <td>
                <svg viewBox="0 0 128 128">
    <!-- Pfade für das X -->
    <path d="M28 30 L98 120"
        style="stroke:#000; stroke-width:15; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
    <path d="M29 20 L99 118"
        style="stroke:#000; stroke-width:15; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
    <path d="M28 102 L108 34"
        style="stroke:#000; stroke-width:15; fill:none; stroke-linecap:round; stroke-linejoin:round;" />

    <!-- Farbverlauf für das X -->
    <defs>
        <linearGradient id="cross" gradientTransform="rotate(45)">
            <stop offset="20%" stop-color="#9c00ff" />
            <stop offset="100%" stop-color="#7300b5" />
        </linearGradient>
    </defs>
    <path d="M20 20 L90 120"
        style="stroke:url(#cross); stroke-width:20; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
    <path d="M20 100 L100 30"
        style="stroke:url(#cross); stroke-width:20; fill:none; stroke-linecap:round; stroke-linejoin:round;" />
</svg>
                </td>
                `;
            } else {
                tableHTML += '<td></td>';
            }
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</table>';

    // Rendere den HTML-Code in das Content-Div
    contentDiv.innerHTML = tableHTML;
}