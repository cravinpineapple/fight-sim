var entityCustomizerID = 0; // ID generator
var colorPickerContainerVisible = false;

const randomWords = ["wing",
    "tomato", "lizard", "spoon", "night", "robin", "blade", "hammer", "friend", "scarecrow", "giraffe", "deer", "cabbage", "queen",
    "ink", "potato", "kitty", "popcorn", "squirrel", "bubble", "loaf", "bear", "boy", "ray", "yam", "doll", "spark", "goose", "yoke", "egg"];



let regEx = /\d+/;

var colorPickerContainer = document.getElementById(`entity-customizer-color-picker0`);
var sidenav = document.getElementById("sidenav");
var entitySelector = document.getElementById("entity-selector");

addEntityCustomizerListeners(0);

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

    var newCustomizer = `<div class="entity-customizer-container" id="entity-customizer-container${newID}">` +
        `<div class="entity-customizer-header" id="entity-customizer-header${newID}">` +
        `<input type="text" class="entity-customizer-text-box" placeholder="Enter a fighter name..."` +
        `id="entity-customizer-name-text-box${newID}" value="Square${newID}" />` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<button class="entity-customizer-minimize" id="entity-customizer-minimize${newID}" minimized="false">-</button>` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<button class="entity-customizer-delete" id="entity-customizer-delete${newID}">x</button>` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="rounded-divider" id="rounded-divider${newID}"></div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="entity-shape-row" id="entity-shape-row${newID}">` +
        `<label class="shape-label" for="entity-customizer-shape-dropdown${newID}" id="shape-label${newID}">Shape:</label>` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<div class="shape-dropdown-container" id="shape-dropdown-container${newID}">` +
        `<button class="shape-drop-button" id="shape-drop-button${newID}">Dropdown</button>` +
        `<div class="shape-dropdown-content">` +
        `<a href="#">Square</a>` +
        `</div>` +
        `</div>` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="entity-speed-row" id="entity-speed-row${newID}">` +
        `<label class="speed-label" for="entity-customizer-speed-text-box${newID}" id="speed-label${newID}">Speed:</label>` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<input type="text" class="entity-customizer-text-box" placeholder="Enter a speed..."` +
        `id="entity-customizer-speed-text-box${newID}" value="1${newID}" />` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="entity-size-row" id="entity-size-row${newID}">` +
        `<label class="size-label" for="entity-customizer-size-text-box${newID}" id="size-label${newID}">Size:</label>` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<input type="text" class="entity-customizer-text-box" placeholder="Enter a size..."` +
        `id="entity-customizer-size-text-box${newID}" value="1${newID}" />` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="entity-color-row" id="entity-color-row${newID}">` +
        `<label class="color-label" for="entity-customizer-color-box" id="color-label${newID}">Color:</label>` +
        `<div class="spacer" id="spacer${newID}"></div>` +
        `<div class="entity-customizer-color-box" id="entity-customizer-color-box${newID}"></div>` +
        `</div>` +
        `<div class="entity-customizer-color-picker" id="entity-customizer-color-picker${newID}">` +
        `<div class="entity-customizer-color-picker-box" id="entity-customizer-color-picker-box${newID}">` +
        `<div class="entity-customizer-color-picker-wheel" id="entity-customizer-color-picker-wheel${newID}"></div>` +
        `</div>` +
        `<div class="entity-customizer-color-picker-pointer" id="entity-customizer-color-picker-pointer${newID}"></div>` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `<div class="matchups-label" for="entity-customizer-matchups-box" id="matchups-label${newID}">Matchups:</div>` +
        `<div class="entity-customizer-matchups-container" id="entity-customizer-matchups-container${newID}">` +
        `<table class="matchups-table" id="matchups-table${newID}">` +
        `<thead>` +
        `<tr>` +
        `<th>Name</th>` +
        `<th>Prey</th>` +
        `<th>Predator</th>` +
        `</tr>` +
        `</thead>` +
        `<tbody class="tbody" id="tbody${newID}"></tbody>` +
        `</table>` +
        `</div>` +
        `<div class="spacer-col" id="spacer-col${newID}"></div>` +
        `</div>`;

    var customizer = document.getElementById(`entity-customizer-container${entityCustomizerID}`);
    customizer.insertAdjacentHTML('afterend', newCustomizer);

    entityCustomizerID++;
    addEntityCustomizerListeners(newID);
}

function createSelector(newID, name, shape, randomColor) {
    let selectorContainer = document.createElement("div");
    selectorContainer.setAttribute("class", "selector-option-container");
    selectorContainer.setAttribute("id", `selector-option-container${newID}`);
    let selectorRow = document.createElement("div");
    selectorRow.setAttribute("class", "selector-option-row");
    selectorRow.setAttribute("id", `selector-option-row${newID}`);
    let selectorIndicator = document.createElement("div");
    selectorIndicator.setAttribute("class", "selector-indicator");
    selectorIndicator.setAttribute("id", `selector-indicator${newID}`);
    let spacer = document.createElement("div");
    spacer.setAttribute("class", "spacer");
    let selectorShape = document.createElement("div");
    selectorShape.setAttribute("class", `${shape}-selector-option`);
    selectorShape.setAttribute("id", `${shape}-selector-option${newID}`);
    selectorShape.style.backgroundColor = `${randomColor}`;
    let spacerCol = document.createElement("div");
    spacerCol.setAttribute("class", "spacer-col");
    let selectorLabel = document.createElement("div");
    selectorLabel.setAttribute("class", "selector-option-label");
    selectorLabel.setAttribute("id", `selector-option-label${newID}`);
    selectorLabel.innerHTML += name;

    selectorContainer.appendChild(selectorRow);
    selectorContainer.appendChild(spacerCol);
    selectorContainer.appendChild(selectorLabel);

    selectorRow.appendChild(selectorIndicator);
    selectorRow.appendChild(spacer);
    selectorRow.appendChild(selectorShape);

    return selectorContainer;
}

function createMatchupRow(ownerID, referenceID) {
    let groupTableRow = document.createElement("tr");
    groupTableRow.setAttribute("class", `matchup-row-${groups[referenceID].name}${referenceID}`);
    groupTableRow.setAttribute("id", `matchup-row-${groups[referenceID].name}${referenceID}${ownerID}`);
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
    var randomShape = "square";
    var randomName = randomWords[Math.floor(Math.random() * randomWords.length)];
    var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
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
    var container = document.getElementById(`entity-customizer-container${newID}`);
    var headerDivider = document.getElementById(`rounded-divider${newID}`);
    var shapeRow = document.getElementById(`entity-shape-row${newID}`);
    var speedRow = document.getElementById(`entity-speed-row${newID}`);
    var sizeRow = document.getElementById(`entity-size-row${newID}`);
    var colorRow = document.getElementById(`entity-color-row${newID}`);
    var colorBox = document.getElementById(`entity-customizer-color-box${newID}`);
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

    var selector = createSelector(newID, randomName, randomShape, randomColor);
    entitySelector.appendChild(selector);

    console.log(document.getElementById(`entity-customizer-color-picker-wheel${newID}`));
    // color picker
    var colorPicker = new iro.ColorPicker(`#entity-customizer-color-picker-wheel${newID}`, {
        width: 140, color: randomColor,
    });
    colorPicker.on("color:change", function (color) {
        let id = this.el.id.match(regEx)[0];
        groups[id].color = color.hexString;
        document.getElementById(`entity-customizer-color-box${id}`).style.backgroundColor = color.hexString;
        document.getElementById(`${randomShape}-selector-option${id}`).style.backgroundColor = color.hexString;
    });

    // color selector event
    colorBox.addEventListener("click", function () {
        let id = this.parentElement.parentElement.id.match(regEx)[0];

        var e = window.event;
        var posX = e.clientX + 45;
        var posY = e.clientY - 85;

        colorPickerContainer.style.visibility = "hidden";
        colorPickerContainer = document.getElementById(`entity-customizer-color-picker${id}`);

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
            container.style.height = "1.3%"
        }
    });

    // closer event
    if (newID != 0) {
        closer.addEventListener("click", function () {
            let removeID = container.id.match(regEx)[0];

            // remove from entity selector
            document.getElementById(`selector-option-container${removeID}`).remove();

            let allMatchupTables = document.getElementsByClassName("tbody");
            for (let i = 0; i < allMatchupTables.length; i++) {
                let id = allMatchupTables[i].id.match(regEx)[0];
                // remove from other matchups in html
                if (id != removeID) {
                    document.getElementById(`matchup-row-${groups[removeID].name}${removeID}${i}`).remove();

                    // if present in beats, remove
                    for (let j = 0; j < groups[i].beats.length; j++) {
                        if (groups[i].beats[j].id == removeID) groups[i].beats.splice(j, 1);
                    }

                    // if present in loses, remove
                    for (let j = 0; j < groups[i].loses.length; j++) {
                        if (groups[i].loses[j].id == removeID) groups[i].loses.splice(j, 1);
                    }
                }
            }

            // remove customizer
            container.remove();
            groups.splice(removeID, 1);

            // update ids
            let customizers = document.getElementsByClassName("entity-customizer-container")
            let selectorOptionContainers = document.getElementsByClassName("selector-option-container");
            for (let i = 0; i < customizers.length; i++) {
                changeElementID(customizers[i], i);
                changeElementID(selectorOptionContainers[i], i);

                groups[i].id = i;
            }
            entityCustomizerID--;

            console.log(groups);
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
            let thisGroupPredatorCheckbox = document.getElementById(`matchup-predator-${groups[newID].name}${newID}-${i}`);
            let thisGroupPreyCheckbox = document.getElementById(`matchup-prey-${groups[newID].name}${newID}-${i}`);

            thisGroupPredatorCheckbox.addEventListener("change", function (e) {
                if (this.checked) {
                    groups[i].loses.push(groups[newID]);
                    thisGroupPreyCheckbox.disabled = true;
                }
                else {
                    for (let j = 0; j < groups[i].loses.length; j++) {
                        if (groups[i].loses[j].id == newID) groups[i].loses.splice(j, 1);
                    }
                    thisGroupPreyCheckbox.disabled = false;
                }
            });

            thisGroupPreyCheckbox.addEventListener("change", function (e) {
                if (this.checked) {
                    groups[i].beats.push(groups[newID]);
                    thisGroupPredatorCheckbox.disabled = true;
                }
                else {
                    for (let j = 0; j < groups[i].beats.length; j++) {
                        if (groups[i].beats[j].id == newID) groups[i].beats.splice(j, 1);
                    }
                    thisGroupPredatorCheckbox.disabled = false;
                }
            });


            // adds all other groups to this group's matchups
            let otherGroupTableRow = createMatchupRow(newID, i);
            tableBody.appendChild(otherGroupTableRow);
            let otherGroupPredatorCheckbox = document.getElementById(`matchup-predator-${groups[i].name}${i}-${newID}`);
            let otherGroupPreyCheckbox = document.getElementById(`matchup-prey-${groups[i].name}${i}-${newID}`);

            otherGroupPredatorCheckbox.addEventListener("change", function (e) {
                if (this.checked) {
                    groups[newID].loses.push(groups[i]);
                    otherGroupPreyCheckbox.disabled = true;
                }
                else {
                    for (let j = 0; j < groups[newID].loses.length; j++) {
                        if (groups[newID].loses[j].id == i) groups[newID].loses.splice(j, 1);
                    }
                    otherGroupPreyCheckbox.disabled = false;
                }
            });

            otherGroupPreyCheckbox.addEventListener("change", function (e) {
                if (this.checked) {
                    groups[newID].beats.push(groups[i]);
                    otherGroupPredatorCheckbox.disabled = true;
                }
                else {
                    for (let j = 0; j < groups[newID].beats.length; j++) {
                        if (groups[newID].beats[j].id == i) groups[newID].beats.splice(j, 1);
                    }
                    otherGroupPredatorCheckbox.disabled = false;
                }
            });
        }
    }
}

// Changes the id number of an element and the id number of all of it's children (and their children, etc), recursively
function changeElementID(element, newID) {
    if (element == undefined) return;

    element.setAttribute("id", `${element.className}${newID}`);

    for (let i = 0; i < element.childElementCount; i++) {
        changeElementID(element.children[i], newID);
    }
}