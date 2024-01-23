//get autoNext
let autoNext = localStorage.getItem('autoNext');
if (autoNext === null) {
    autoNext = false;
    localStorage.setItem('autoNext', autoNext);
} else {
    autoNext = JSON.parse(autoNext);
}
// Set the initial state of the checkbox
document.getElementById('autoNextCheckbox').checked = autoNext;

// Update autoNext in localStorage when the checkbox changes
function updateAutoNext() {
    autoNext = document.getElementById('autoNextCheckbox').checked;
    localStorage.setItem('autoNext', autoNext);
}

let repeatingY = 3;


function copyCommandWithAutoNext(sourceDiv) {
    // Create a new div below the source div
    const newCommandDiv = document.createElement('div');
    newCommandDiv.className = 'command-block Module';
    newCommandDiv.innerHTML = sourceDiv.innerHTML;

    const ghost = document.createElement('p');

    // Reset the value of the textarea and checkbox in the new div
    const textarea = newCommandDiv.querySelector('.command-input');
    const checkbox = newCommandDiv.querySelector('.repeating-checkbox');

    // Check if a warning already exists
    const existingWarning = newCommandDiv.querySelector('.Warning');
    if (existingWarning)
        newCommandDiv.querySelector('.Warning').remove();
    if (autoNext) {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'Warning';

        const warningText = document.createElement('p');
        warningText.innerText = 'This module has auto next. Modifying it will create another command module.';

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Remove AutoNext';
        deleteButton.onclick = function () {
            newCommandDiv.removeChild(warningDiv);
            newCommandDiv.removeAttribute('onchange');
        };


        warningDiv.appendChild(warningText);
        warningDiv.appendChild(deleteButton);
        newCommandDiv.appendChild(warningDiv);
    }

    textarea.value = '';
    checkbox.checked = false;

    // Add the new div after the source div
    sourceDiv.parentNode.insertBefore(newCommandDiv, sourceDiv.nextSibling);

    // Focus on the textarea of the new div
    textarea.focus();

    // If AutoNext is true, set the onchange attribute
    if (autoNext) {
        newCommandDiv.setAttribute('onchange', 'copyCommandWithAutoNext(this)');
    }
}


function deleteCommand(deleteButton) {
    if (document.getElementsByClassName('command-block').length == 1) {
        alert("Cannot Delete the last command.")
        return; //early return
    }
    const commandDiv = deleteButton.parentNode;

    // If there's a div above, give it the onchange event
    const prevDiv = commandDiv.previousElementSibling;
    if (prevDiv && autoNext) {
        prevDiv.setAttribute('onchange', 'createNewCommand(this)');
    }

    // Remove the div
    commandDiv.parentNode.removeChild(commandDiv);
}



//commands to generate this mess
function generateModule(cmd, type) {
    if (type) {
        repeatingY++;
        return `{id:"minecraft:command_block_minecart",Command:'setblock ~ ~${repeatingY} ~ repeating_command_block{auto:1b,Command:"${cmd}"} replace'}`;
    } else {
        return `{id:"minecraft:command_block_minecart",Command:"${cmd}"}`;
    }
}

function generateBase(CMDs) {
    return `summon falling_block ~ ~1 ~ {BlockState:{Name:"minecraft:activator_rail"},Time:1,Passengers:[${CMDs},{id:"minecraft:command_block_minecart",Command:"kill @e[type=command_block_minecart,distance=0..2]"}]}`
}

function generate() {
    let modules = document.getElementsByClassName('command-block');
    let commands = document.getElementsByClassName('command-input');
    let CMDs = '';

    for (let i = 0; i < commands.length; i++) {
        CMDs += generateModule(commands[i].value.trim(), modules[i].querySelector('.repeating-checkbox').checked) + ",";
    }

    CMDs = CMDs.slice(0, -1);
    let cmd = generateBase(CMDs);

    const savedCommandsTextarea = document.getElementById('SavedCommands');
    savedCommandsTextarea.value = cmd;
    localStorage.setItem('savedCommands', cmd);

    repeatingY = 3; // Reset back to the original value
    return cmd;
}

function loadText() {
    let CMDS = document.getElementById('LOC').value.split("\n");
    amount = CMDS.length - 1;

    // Add or remove command blocks based on the loaded commands
    let currentCommands = document.getElementsByClassName('command-block').length;
    for (let i = currentCommands - 1; i > amount - 1; i--) {
        deleteCommand(document.getElementsByClassName('Round')[i]);
    }
    //start
    for (let i = 0; i < amount; i++) {
        copyCommandWithAutoNext(document.getElementsByClassName('command-block')[0]);
    }
    // Load the commands into the textareas
    let c = document.getElementsByClassName('command-input');
    for (let i = 0; i < amount+1; i++) {
        c[i].value = CMDS[i].trim();
    }
}


//funny time
// Load saved commands from localStorage on page load
window.onload = function () {
    const savedCommands = localStorage.getItem('savedCommands');
    if (savedCommands) {
        document.getElementById('SavedCommands').value = savedCommands;
    }
}


