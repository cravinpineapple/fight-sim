// reg ex to pull id
// const regEx = /\d+/g;
// var id = element.id.match(regEx)[0];

var entityCustomizerID = 1; // ID generator

addEntityCustomizerListeners(1);


function addEntityCustomizerBox() {
    var newID = entityCustomizerID + 1;

    var newCustomizer = `<div class="entity-customizer-container" id="customizer${newID}"> <div class="entity-customizer-header" id="entity-customizer-header${newID}"> <input type="text" class="entity-customizer-text-box" placeholder="Enter a fighter name..." id="entity-customizer-name-text-box${newID}" /> <div class="spacer" id="spacer${newID}"></div> <button class="entity-customizer-minimize" id="entity-customizer-minimize${newID}" minimized="false">-</button> <div class="spacer" id="spacer${newID}"></div> <button class="entity-customizer-delete" id="entity-customizer-delete${newID}">x</button> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="rounded-divider" id="rounded-divider${newID}"></div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-shape-row" id="entity-shape-row${newID}"> <label class="shape-label" for="entity-customizer-shape-dropdown${newID}" id="shape-label${newID}">Shape:</label> <div class="spacer" id="spacer${newID}"></div> <div class="shape-dropdown-container" id="shape-dropdown-container${newID}"> <button class="shape-drop-button" id="shape-drop-button${newID}">Dropdown</button> <div class="shape-dropdown-content"> <a href="#">Square</a> </div> </div> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-speed-row" id="entity-speed-row${newID}"> <label class="speed-label" for="entity-customizer-speed-text-box${newID}" id="speed-label${newID}">Speed:</label> <div class="spacer" id="spacer${newID}"></div> <input type="text" class="entity-customizer-text-box" placeholder="Enter a speed..." id="entity-customizer-speed-text-box${newID}" /> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-size-row" id="entity-size-row${newID}"> <label class="size-label" for="entity-customizer-size-text-box${newID}" id="size-label${newID}">Size:</label> <div class="spacer" id="spacer${newID}"></div> <input type="text" class="entity-customizer-text-box" placeholder="Enter a size..." id="entity-customizer-size-text-box${newID}" /> </div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="entity-color-row" id="entity-color-row${newID}"> <label class="color-label" for="entity-customizer-color-box" id="color-label${newID}">Color:</label> <div class="spacer" id="spacer${newID}"></div> <div class="entity-customizer-color-box" id="entity-customizer-color-box${newID}"></div><div class="entity-customizer-color-picker" id="entity-customizer-color-picker${newID}"><div class="entity-customizer-color-picker-box" id="entity-customizer-color-picker-box${newID}"><div class="entity-customizer-color-picker-wheel" id="entity-customizer-color-picker-wheel${newID}"></div></div><div class="entity-customizer-color-picker-pointer" id="entity-customizer-color-picker-pointer${newID}"></div></div></div> <div class="spacer-col" id="spacer-col${newID}"></div> <div class="matchups-label" for="entity-customizer-matchups-box" id="matchups-label${newID}">Matchups:</div> <div class="entity-customizer-matchups-container" id="entity-customizer-matchups-container${newID}"> <table class="matchups-table" id="matchups-table${newID}"> <thead> <tr> <th>Name</th> <th>Prey</th> <th>Predator</th> </tr> </thead> <tbody> <tr> <td>TempName${newID}</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> <tr> <td>TempName2</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> <tr> <td>TempName3</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> <tr> <td>TempName4</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> <tr> <td>TempName5</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> <tr> <td>TempName6</td> <td> <input type="checkbox" id="matchup-prey${newID}" value="true"> </td> <td> <input type="checkbox" id="matchup-predator${newID}" value="true"> </td> </tr> </tbody> </table> </div> <div class="spacer-col" id="spacer-col${newID}"></div> </div>`;
    
    var element = document.getElementById(`customizer${entityCustomizerID}`);
    element.insertAdjacentHTML('afterend', newCustomizer);

    addEntityCustomizerListeners(newID);
    entityCustomizerID++;
}


function addEntityCustomizerListeners(newID) {
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

    // color picker
    const colorPicker = new iro.ColorPicker(`#entity-customizer-color-picker-wheel${newID}`, {
        width: 140, color: "#fff"
    });
    colorPicker.on("color:change", function(color) {
        colorBox.style.backgroundColor = color.hexString;
    });

    
    // minimizer event
    minimizer.addEventListener("click", function() {
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
    closer.addEventListener("click", function() {
        container.remove();
        
        // update ids
        var minimizers = document.getElementsByClassName("entity-customizer-container")
        for (let i = 0; i < minimizers.length; i++) {
            minimizers[i].setAttribute("id", `customizer${i + 1}`);
        }

        entityCustomizerID--;
    });

    // color selector event
    colorSelector.addEventListener("click", function() {
        console.log(colorSelector.id);
    });
}


// sideNavMaximizeButton.style.visibility = "visible";
// sideNavMaximizeButton.style.visibility = "hidden";