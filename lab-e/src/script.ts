type AppState = {
    currentStyle: string;
    styles: Record<string, string>;
};

const appState: AppState = {
    currentStyle: "Wersja 1",
    styles: {
        "Wersja 1": "/wersja_1.css",
        "Wersja 2": "/wersja_2.css",
        "Wersja 3": "/wersja_3.css"
    }
};

function setStyle(styleName: string): void {
    const cssPath = appState.styles[styleName];
    if (!cssPath) return;

    const oldLink = document.getElementById("Wersje");
    if (oldLink) oldLink.remove();

    const newLink = document.createElement("link");
    newLink.id = "Wersje";
    newLink.rel = "stylesheet";
    newLink.href = cssPath;

    document.head.appendChild(newLink);
    appState.currentStyle = styleName;
}


function renderStyleLinks(): void {
    const container = document.getElementById("switch");
    if (!container) return;

    container.innerHTML = "";

    Object.keys(appState.styles).forEach(styleName => {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = styleName;
        link.style.marginRight = "15px";


        link.addEventListener("click", (e) => {
            e.preventDefault();
            setStyle(styleName);
        });

        container.appendChild(link);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderStyleLinks();
});
