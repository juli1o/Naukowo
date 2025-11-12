function getLocation() {
    if (!navigator.geolocation) {
        alert("Sorry, no geolocation available for you!");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        document.getElementById("latitude").innerText = position.coords.latitude;
        document.getElementById("longitude").innerText = position.coords.longitude;
    }, (positionError) => {
        console.error(positionError);
    }, {
        enableHighAccuracy: false
    });
}

let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let marker = L.marker([53.430127, 14.564802]).addTo(map);
marker.bindPopup("<strong>Hello!</strong><br>This is a popup.");


document.getElementById("getLocation").addEventListener("click", function(event) {
    if (!navigator.geolocation) {
        console.log("No geolocation.");
    }

    navigator.geolocation.getCurrentPosition(position => {
        console.log(position);
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        map.setView([lat, lon]);
    }, positionError => {
        console.error(positionError);
    });
});


function createPuzzleFromMap() {
    const rasterMap = document.getElementById("rasterMap");
    const container = document.getElementById("puzzleContainer");
    const size = 4;
    const pieceWidth = rasterMap.width / size;
    const pieceHeight = rasterMap.height / size;

    container.innerHTML = "";

    let pieces = [];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            pieceCanvas.classList.add("puzzle-piece");
            pieceCanvas.id = `piece-${x}-${y}`
            pieceCanvas.draggable = true;

            const ctx = pieceCanvas.getContext("2d");
            ctx.drawImage(
                rasterMap,
                x * pieceWidth, y * pieceHeight,
                pieceWidth, pieceHeight,
                0, 0,
                pieceWidth, pieceHeight
            );

            pieceCanvas.dataset.correctX = x;
            pieceCanvas.dataset.correctY = y;

            pieces.push(pieceCanvas);
        }
    }

    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach(piece => container.appendChild(piece));

    setupPuzzleDragAndDrop();
}

function setupPuzzleDragAndDrop() {
    const puzzleContainer = document.getElementById("puzzleContainer");
    const solverSlots = document.querySelectorAll(".solver-slot");

    let dragged = null;

    document.querySelectorAll(".puzzle-piece").forEach(piece => {
        piece.addEventListener("dragstart", e => {
            dragged = e.target;
            e.dataTransfer.setData("text", e.target.id);
            e.dataTransfer.effectAllowed = "move";
        });
    });

    puzzleContainer.addEventListener("dragover", e => e.preventDefault());
    puzzleContainer.addEventListener("drop", e => {
        e.preventDefault();
        if (dragged) {
            puzzleContainer.appendChild(dragged);
        }
    });

    solverSlots.forEach(slot => {
        slot.addEventListener("dragover", e => e.preventDefault());

        slot.addEventListener("drop", e => {
            e.preventDefault();
            const pieceId = e.dataTransfer.getData("text");
            const piece = document.getElementById(pieceId);
            if (piece) {
                slot.innerHTML = "";
                slot.appendChild(piece);
            }
            checkPuzzleCompletion();
        });
    });
}

function checkPuzzleCompletion() {
    const size = 4;
    const slots = document.querySelectorAll(".solver-slot");
    let correct = 0;

    slots.forEach((slot, index) => {
        const piece = slot.querySelector(".puzzle-piece");
        if (piece) {
            const expectedX = index % size;
            const expectedY = Math.floor(index / size);
            if (piece.dataset.correctX == expectedX && piece.dataset.correctY == expectedY) {
                correct++;
            }
        }
    });

    if (correct === size * size) {
        console.log("Puzzle ułożone poprawnie!");
        showCompletionNotification();
    }
}

function showCompletionNotification() {
    if (Notification.permission === "granted") {
        new Notification("Gratuluje", { body: "Ułożyłeś mapę poprawnie" });
    } else {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Gratuluje", { body: "Ułożyłeś mapę poprawnie" });
            } else {
                alert("Gratuluje Ułożyłeś mapę poprawnie!");
            }
        });
    }
}


document.getElementById("saveButton").addEventListener("click", function() {
    leafletImage(map, function (err, canvas) {
       let rasterMap = document.getElementById("rasterMap");

        rasterMap.width = canvas.width;
        rasterMap.height = canvas.height;

        let ctx = rasterMap.getContext("2d");
        ctx.drawImage(canvas, 0, 0);

        createPuzzleFromMap();
    });
});

