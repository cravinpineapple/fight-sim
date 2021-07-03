var entityCustomizerID = 0; // ID generator
var colorPickerContainerVisible = false;

const randomWords = ["wing",
    "tomato", "lizard", "spoon", "night", "robin", "blade", "hammer", "friend", "scarecrow", "giraffe", "deer", "cabbage", "queen",
    "ink", "potato", "kitty", "popcorn", "squirrel", "bubble", "loaf", "bear", "boy", "ray", "yam", "doll", "spark", "goose", "yoke", "egg"];

addEntityCustomizerListeners(0);

let regEx = /\d+/;

var colorPickerContainer = document.getElementById(`entity-customizer-color-picker0`);
var sidenav = document.getElementById("sidenav");

window.addEventListener("click", function () {
    if (colorPickerContainerVisible) {
        colorPickerContainer.style.visibility = "hidden";
        colorPickerContainerVisible = false;
    }
    if (colorPickerContainer.style.visibility == "visible") {
        colorPickerContainerVisible = true;
    }
});

sidenav.addEventListener("scroll", function () {
    if (colorPickerContainerVisible) {
        colorPickerContainer.style.visibility = "hidden";
        colorPickerContainerVisible = false;
    }
    if (colorPickerContainer.style.visibility == "visible") {
        colorPickerContainerVisible = true;
    }
});


function addEntityCustomizerBox() {
    var newID = entityCustomizerID + 1;

    var newCustomizer = `<div class="entity-customizer-container" id="customizer${newID}"> <div class="entity-customizer-header" id="entity-customizer-header${newID}"> <input type="text" class="entity-customizer-text-box" placeholder="Enter a fighter name..." id="entity-customizer-name-text-box${newID}" /> <div class="spacer" id="spacer${newID}"></div> <button class="entity-customizer-minimize" id="entity-customizer-minimize${newID}" minimized="false">-</button> <div class="spacer" id="spacer${newID}"></div> <button class="entity-customizer-delete" id="entity-customizer-delete${newID}">x</button> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="rounded-divider" id="rounded-divider${newID}"></div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-shape-row" id="entity-shape-row${newID}"> <label class="shape-label" for="entity-customizer-shape-dropdown${newID}" id="shape-label${newID}">Shape:</label> <div class="spacer" id="spacer${newID}"></div> <div class="shape-dropdown-container" id="shape-dropdown-container${newID}"> <button class="shape-drop-button" id="shape-drop-button${newID}">Dropdown</button> <div class="shape-dropdown-content"> <a href="#">Square</a> </div> </div> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-speed-row" id="entity-speed-row${newID}"> <label class="speed-label" for="entity-customizer-speed-text-box${newID}" id="speed-label${newID}">Speed:</label> <div class="spacer" id="spacer${newID}"></div> <input type="text" class="entity-customizer-text-box" placeholder="Enter a speed..." id="entity-customizer-speed-text-box${newID}" /> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-size-row" id="entity-size-row${newID}"> <label class="size-label" for="entity-customizer-size-text-box${newID}" id="size-label${newID}">Size:</label> <div class="spacer" id="spacer${newID}"></div> <input type="text" class="entity-customizer-text-box" placeholder="Enter a size..." id="entity-customizer-size-text-box${newID}" /> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-color-row" id="entity-color-row${newID}"> <label class="color-label" for="entity-customizer-color-box" id="color-label${newID}">Color:</label> <div class="spacer" id="spacer${newID}"></div> <div class="entity-customizer-color-box" id="entity-customizer-color-box${newID}"></div><div class="entity-customizer-color-picker" id="entity-customizer-color-picker${newID}"><div class="entity-customizer-color-picker-box" id="entity-customizer-color-picker-box${newID}"><div class="entity-customizer-color-picker-wheel" id="entity-customizer-color-picker-wheel${newID}"></div></div><div class="entity-customizer-color-picker-pointer" id="entity-customizer-color-picker-pointer${newID}"></div></div></div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="matchups-label" for="entity-customizer-matchups-box" id="matchups-label${newID}">Matchups:</div> <div class="entity-customizer-matchups-container" id="entity-customizer-matchups-container${newID}"> <table class="matchups-table" id="matchups-table${newID}"> <thead> <tr> <th>Name</th> <th>Prey</th> <th>Predator</th> </tr> </thead> <tbody id="tbody${newID}"></tbody> </table> </div> <div class="spacer-col" id="spacer-col${newID}"></div> </div>`;

    var element = document.getElementById(`customizer${entityCustomizerID}`);
    element.insertAdjacentHTML('afterend', newCustomizer);

    entityCustomizerID++;
    addEntityCustomizerListeners(newID);
}

function createMatchupRow(ownerID, referenceID) {
    let groupTableRow = document.createElement("tr");
    let groupTableRowLabel = document.createElement("td");
    let groupTableRowPredator = document.createElement("td");
    let groupTableRowPrey = document.createElement("td");
    let groupTableRowPredatorCheckBox = document.createElement("input");
    groupTableRowPredatorCheckBox.setAttribute("type", "checkbox");
    groupTableRowPredatorCheckBox.setAttribute("id", `matchup-predator-${groups[referenceID].name}${referenceID}-${ownerID}`);
    let groupTableRowPreyCheckBox = document.createElement("input");
    groupTableRowPreyCheckBox.setAttribute("type", "checkbox");
    groupTableRowPreyCheckBox.setAttribute("id", `matchup-prey-${groups[referenceID].name}${referenceID}-${ownerID}`);
    groupTableRowLabel.innerHTML = `${groups[referenceID].name}`;
    groupTableRowPredator.appendChild(groupTableRowPredatorCheckBox);
    groupTableRowPrey.appendChild(groupTableRowPreyCheckBox);
    groupTableRow.appendChild(groupTableRowLabel);
    groupTableRow.appendChild(groupTableRowPrey);
    groupTableRow.appendChild(groupTableRowPredator);

    return groupTableRow;
}

function addEntityCustomizerListeners(newID) {
    let maxSpeed = 50;
    let minSpeed = 1;
    let maxSize = 25;
    let minSize = 1;

    // TODO: randomShape
    var randomName = randomWords[Math.floor(Math.random() * randomWords.length)];
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    var randomSpeed = Math.floor(Math.random() * (maxSpeed - minSpeed) + minSpeed);
    var randomSize = Math.floor(Math.random() * (maxSize - minSize) + minSize);

    groups.push({
        name: randomName,
        id: newID,
        color: randomColor,
        size: randomSize * 2.5,
        speed: randomSpeed * 0.025,
        shape: "square",
        members: [],
        beats: [],
        loses: [],
    });
    console.log(groups);

    // container
    var container = document.getElementById(`customizer${newID}`);
    var headerDivider = document.getElementById(`rounded-divider${newID}`);
    var shapeRow = document.getElementById(`entity-shape-row${newID}`);
    var speedRow = document.getElementById(`entity-speed-row${newID}`);
    var sizeRow = document.getElementById(`entity-size-row${newID}`);
    var colorRow = document.getElementById(`entity-color-row${newID}`);
    var colorBox = document.getElementById(`entity-customizer-color-box${newID}`);
    var colorSelector = document.getElementById(`entity-customizer-color-box${newID}`);
    var matchupsLabel = document.getElementById(`matchups-label${newID}`);
    var matchupsContainer = document.getElementById(`entity-customizer-matchups-container${newID}`);
    var minimizer = document.getElementById(`entity-customizer-minimize${newID}`);
    var closer = document.getElementById(`entity-customizer-delete${newID}`);

    var nameTextBox = document.getElementById(`entity-customizer-name-text-box${newID}`);
    var speedTextBox = document.getElementById(`entity-customizer-speed-text-box${newID}`);
    var sizeTextBox = document.getElementById(`entity-customizer-size-text-box${newID}`);

    speedTextBox.value = "" + randomSpeed;
    sizeTextBox.value = "" + randomSize;
    nameTextBox.value = "" + randomName;
    colorBox.style.backgroundColor = randomColor;

    // color picker
    const colorPicker = new iro.ColorPicker(`#entity-customizer-color-picker-wheel${newID}`, {
        width: 140, color: randomColor
    });
    colorPicker.on("color:change", function (color) {
        colorBox.style.backgroundColor = color.hexString;
        let id = colorBox.id.match(regEx);
        groups[id].color = color.hexString;
    });

    // color selector event
    colorSelector.addEventListener("click", function () {
        var e = window.event;
        var posX = e.clientX + 45;
        var posY = e.clientY - 85;


        colorPickerContainer.style.visibility = "hidden";
        colorPickerContainer = document.getElementById(`entity-customizer-color-picker${newID}`);

        colorPickerContainer.style.top = posY + "px";
        colorPickerContainer.style.left = posX + "px";
        colorPickerContainer.style.visibility = "visible";
    });

    // minimizer event
    minimizer.addEventListener("click", function () {
        var minimized = minimizer.getAttribute("minimized");

        if (minimized == "true") { // maximize
            minimizer.setAttribute("minimized", "false");
            minimizer.innerHTML = "-";

            headerDivider.style.visibility = "visible";
            shapeRow.style.visibility = "visible";
            speedRow.style.visibility = "visible";
            sizeRow.style.visibility = "visible";
            colorRow.style.visibility = "visible";
            matchupsLabel.style.visibility = "visible";
            matchupsContainer.style.visibility = "visible";
            container.style.height = "35%"
        }
        else { // minimize
            minimizer.setAttribute("minimized", "true");
            minimizer.innerHTML = "+";

            headerDivider.style.visibility = "hidden";
            shapeRow.style.visibility = "hidden";
            speedRow.style.visibility = "hidden";
            sizeRow.style.visibility = "hidden";
            colorRow.style.visibility = "hidden";
            matchupsLabel.style.visibility = "hidden";
            matchupsContainer.style.visibility = "hidden";
            container.style.height = "3%"
        }
    });

    // closer event
    if (newID != 0) {
        closer.addEventListener("click", function () {
            let removeID = container.id.match(regEx)[0];
            container.remove();
            groups.splice(removeID, 1);

            // update ids
            let customizers = document.getElementsByClassName("entity-customizer-container")
            for (let i = 0; i < customizers.length; i++) {
                customizers[i].setAttribute("id", `customizer${i}`);
                groups[i].id = i;
            }

            entityCustomizerID--;
        });
    }


    var tableBody = document.getElementById(`tbody${newID}`);
    // add all other groups to this group's matchups
    for (let i = 0; i < entityCustomizerID; i++) {
        if (newID != i) {
            let otherGroupTableBody = document.getElementById(`tbody${i}`);

            // adds this group to all other group's matchups

            // let thisGroup = `<tr><td>${groups[newID].name}</td><td><input type="checkbox" id="matchup-prey-${groups[newID].name}${newID}-${i}" value="true"></td><td><input type="checkbox" id="matchup-predator-${groups[newID].name}${newID}-${i}" value="true"></td></tr>`;
            // otherGroupTableBody.innerHTML += thisGroup;
            let thisGroupTableRow = createMatchupRow(i, newID);
            otherGroupTableBody.appendChild(thisGroupTableRow);

            document.getElementById(`matchup-predator-${groups[newID].name}${newID}-${i}`).addEventListener("change", function (e) {
                if (this.checked) groups[i].beats.push(groups[newID]);
                else {
                    for (let j = 0; j < groups[i].beats.length; j++) {
                        if (groups[i].beats[j].id == newID) groups[i].beats.splice(j, 1);
                    }
                }
            });

            document.getElementById(`matchup-prey-${groups[newID].name}${newID}-${i}`).addEventListener("change", function (e) {
                if (this.checked) groups[i].loses.push(groups[newID]);
                else {
                    for (let j = 0; j < groups[i].loses.length; j++) {
                        if (groups[i].loses[j].id == newID) groups[i].loses.splice(j, 1);
                    }
                }
            });


            // adds all other groups to this group's matchups
            let otherGroupTableRow = createMatchupRow(newID, i);
            tableBody.appendChild(otherGroupTableRow);

            document.getElementById(`matchup-predator-${groups[i].name}${i}-${newID}`).addEventListener("change", function (e) {
                if (this.checked) groups[newID].beats.push(groups[i]);
                else {
                    for (let j = 0; j < groups[newID].beats.length; j++) {
                        if (groups[newID].beats[j].id == i) groups[newID].beats.splice(j, 1);
                    }
                }
            });

            document.getElementById(`matchup-prey-${groups[i].name}${i}-${newID}`).addEventListener("change", function (e) {
                if (this.checked) groups[newID].loses.push(groups[i]);
                else {
                    for (let j = 0; j < groups[newID].loses.length; j++) {
                        if (groups[newID].loses[j].id == i) groups[newID].loses.splice(j, 1);
                    }
                }
            });
        }
    }
}


// sideNavMaximizeButton.style.visibility = "visible";
// sideNavMaximizeButton.style.visibility = "hidden";