function clickOverride(element, locStructKey) {
    var rect = element.getBoundingClientRect();

    if (locStruct && locStruct[locStructKey] && locStruct[locStructKey]["xMean"]) {

        let xMin = locStruct[locStructKey]["xMean"] - locStruct[locStructKey]["xDev"];
        let xMax = locStruct[locStructKey]["xMean"] + locStruct[locStructKey]["xDev"];
        let yMin = locStruct[locStructKey]["yMean"] - locStruct[locStructKey]["yDev"];
        let yMax = locStruct[locStructKey]["yMean"] + locStruct[locStructKey]["yDev"];
        let randomX = Math.random() * (xMax - xMin) + xMin;
        let randomY = Math.random() * (yMax - yMin) + yMin;
        if (randomX > 0 && randomY > 0) {
            let evt = new MouseEvent("click", {
                clientX: rect.left + randomX,
                clientY: rect.top + randomY,
                offsetX: randomX,
                offsetY: randomY,
                view: window,
            });

            // Send the event to the sleep button element
            element.dispatchEvent(evt);
        }
    }
}

function waitForElement(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function checkForAscOrDesc(aElement) {
    let firstA_img = $(aElement).find("img");
    if (firstA_img && firstA_img[0]) {
        let firstA_img_src = $(firstA_img).attr("src");
        if (firstA_img_src && firstA_img_src.includes("desc")) {
            return true;
        }
        else if (firstA_img_src && firstA_img_src.includes("asc")) {
            return false;
        }
    }
    return null;
}

function getHorseBreed() {
    let selector = "#characteristics-body-content a[href*='/dossiers/srace?']";
    return $(selector)?.html()?.replace(/ /g, "") ?? null;
}

function hasBMI(alias) {
    let names = {
        achilles: 'talon-achille',
        apollos: 'lyre-apollon',
        arms: 'bras-morphee',
        artemis: 'fleche-artemis',
        croesus: 'pactole-cresus',
        fifth: '5th-element',
        helios: 'rayon-helios',
        hera: 'pack-hera',
        hestia: 'don-hestia',
        hypnos: 'couverture-hypnos',
        magichat: 'chapeau-magique',
        medusa: 'sang-meduse',
        nyx: 'pack-nyx',
        parchment: 'parchemin-ploutos',
        philotes: 'caresse-philotes',
        poseidon: 'pack-poseidon',
        poc: 'fragment-nuage',
        pocp: 'pack-fragment-nuage',
        pumpkin: 'citrouille-ensorcelee',
        sota: 'sceau-apocalypse',
        stone: 'pierre-philosophale',
        tears: 'larmes-aphrodite',
        timer: 'sablier-chronos',
        wand: 'baton-fertilite',
        woy: 'eau-jouvence',
        elves: 'pack-xmas-gear-2'
     };
    return $("#objects-body-content").find("a[href*='" + names[alias] + "']").length > 0;
}

function checkIfHasHypnos() {
    return hasBMI('hypnos');
}

function checkIfHasHeel() {
    return hasBMI('achilles');
}

function getHorseEnergy() {
    let currentEnergy = document.getElementById("energie").innerText;
    return currentEnergy ? currentEnergy : 0;
}

function getSpendableEnergy() {
    let energyTot = getHorseEnergy();
    let hasHeel = checkIfHasHeel();
    if (!hasHeel) {
        return energyTot - 20;
    }
    return energyTot;
}

function getHorseRideMaxHrs(costPerHalfHr) {
    let hrCst = costPerHalfHr ? costPerHalfHr * 2 : 16.2;
    let horseEnergy = getSpendableEnergy();
    console.log("horseEnergy = ", horseEnergy)
    let x = ((horseEnergy / hrCst) * 10)
    let y = Math.floor(x / 5) * 5;
    let walkHrs = y / 10;
    return walkHrs;
}

function checkEnergyForMission(missionType) {
    let currentEnergy = getSpendableEnergy();
    let avgMissionCost = 27;
    if (missionType == "wood") {
        avgMissionCost = 27;
    }
    else if (missionType == "iron") {
        avgMissionCost = 39;
    }
    else if (missionType == "lessons") {
        avgMissionCost = 30;
    }
    else if (missionType == "sand") {
        avgMissionCost = 27;
    }
    let energyAfterMission = currentEnergy - avgMissionCost;
    console.log("Estimated energy after mission is ", energyAfterMission);
    if (energyAfterMission < 0) {
        return false;
    }
    else {
        return true;
    }
}

async function displayItemsAtTop() {
    const isExtensionEnabled = await getData("extensionEnabled");
    if (!isExtensionEnabled) {
        return;
    }

    const isDisplayItemsAtTopEnabled = await getData("autoDisplayItemsEnabled");
    if (!isDisplayItemsAtTopEnabled) {
        return;
    }

    waitForElement("#objects-body-content").then(async (objectsDiv) => {
        waitForElement("#reproduction-wrapper").then((reproDiv) => {
            const findReproButt = $(reproDiv).find("a.saillir");
            let newImg;

            if (findReproButt && findReproButt[0]) {
                let currBut = findReproButt[0];
                // const spot = $(missionDiv).find(".last");
                // if (spot && spot[0]) {
                //     const clone = $(currBut).clone().appendTo($(spot[0]));
                // }
                const butHref = $(currBut).attr("href");
                if (butHref && butHref.includes("rechercherMale")) {
                    newImg = document.createElement("img");
                    newImg.src = "media/equideo/image/components/actionconsole/saillir.png"
                    // newImg.style.margin = "2px 3px 2px 0";
                    newImg.style.width = "15%";
                    newImg.style.height = "auto";
                    // newImg.classList.add("float-right");
                }

            }

            waitForElement("#module-2").then(async (value) => {
                if (newImg) {
                    let nameHdr = $(value).find("h1.horse-name");
                    if (nameHdr && nameHdr[0]) {
                        $(newImg).appendTo(($(nameHdr[0])));
                    }
                }
            });
        })
        waitForElement("#image-body-content").then(async (value) => {
            // const tableClone = $(objectsDiv).clone().appendTo($(value));
            const objectElements = $(objectsDiv).find("a");
            // console.log("Object elements are ", objectElements);
            for (let step = 0; step < objectElements.length; step++) {
                let clone = $(objectElements[step]).clone().appendTo($(value));
                // .append($(value));
            }
        });

    });

}

