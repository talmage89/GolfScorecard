function getCourses() {
    return fetch('https://golf-courses-api.herokuapp.com/courses').then(
        function(response) {
            return response.json();
        }
    )
}
function getSpecificCourse(id) {
    return fetch(`https://golf-courses-api.herokuapp.com/courses/${id}`).then(
        function(response) {
            return response.json();
        }
    )
}
async function renderCourses() {
    document.getElementById('select-a-course').style.display = 'flex';
    document.getElementById('course-is-selected').style.display = 'none';
    document.getElementById('render-buttons').style.display = 'none';
    let response = await getCourses();
    let html = '';
    response.courses.forEach(course => {
        html += `<div class="card" id="card${course.id}">
                    <img src="${course.image}" class="card-img-top" alt="${course.name}" style="height: 200px">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        
                        <div class='playerOptions' id='options${course.id}'>

                            <span>
                                <label for="league">League:</label>
                                <select name="league" id="league-${course.id}">
                                    <option value="0">Champion</option>
                                    <option value="1">Mens</option>
                                    <option value="2">Womens</option>
                                </select>
                            </span>
                            <span>
                                <label for="players"># of Players:</label>
                                <select name="players" id="players-${course.id}">
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                </select>
                            </span>
                            <button class="btn btn-primary options-ok" id="options-ok-${course.id}">Ok</button>

                        </div>
                        <div class='playerNameInputs' id="names-${course.id}"></div>
                        <button class="btn btn-primary show-options" id='showOptions${course.id}'>Select</button>
                    </div>
                </div>`;
    });
    document.getElementById('course-select').innerHTML = html;
}
async function renderCourseInfo(id, league, playerArr) {
    let response = await getSpecificCourse(id);
    let holes = response.data.holes;
    let html = '<tr>';
    let holeNum = 0;

    document.getElementById('select-a-course').style.display = 'none';
    document.getElementById('course-is-selected').style.display = 'flex';
    document.getElementById('scorecard-title').innerText = response.data.name;

    save();

    for (let i = 0; i < 23; i ++) {html += '<col></col>'}
    for (let i = 0; i < 21; i ++) {
        if (i == 0) {html += '<td>Hole</td>'} 
        else if (i == 10) {html += `<td>Out</td><td rowspan="${4 + playerArr.length}">Initials</td>`;} 
        else if (i == 20){html += '<td>In</td><td>Total</td></tr>'}
        else {
            html += `<td>${holes[holeNum].hole}</td>`
            holeNum += 1;
        }
    }
    html += '<tr>'
    holeNum = 0;
    let outYards = 0;
    let inYards = 0;
    for (let i = 0; i < 21; i ++) {
        if (i == 0) {
            switch(parseInt(league)) {
                case 0:
                    html += '<td>Champion</td>';
                    break;
                case 1:
                    html += '<td>Mens</td>'
                    break;
                case 2:
                    html += '<td>Womens</td>'
                    break;
            }
        } 
        else if (i == 10) {html += `<td>${outYards}</td>`;} 
        else if (i == 20){html += `<td>${inYards}</td><td>${outYards + inYards}</td></tr>`;}
        else {
            html += `<td>${holes[holeNum].teeBoxes[league].yards}</td>`
            i < 10 ? outYards += holes[holeNum].teeBoxes[league].yards : inYards += holes[holeNum].teeBoxes[league].yards;
            holeNum += 1;
        }
    }
    html += '<tr>'
    holeNum = 0;
    for (let i = 0; i < 21; i ++) {
        if (i == 0) {html += '<td>Handicap</td>'} 
        else if (i == 10) {html += '<td></td>';} 
        else if (i == 20){html += '<td></td><td></td></tr>'}
        else {
            html += `<td>${holes[holeNum].teeBoxes[league].hcp}</td>`
            holeNum += 1;
        }
    }
    for (let p = 0; p < playerArr.length; p ++) {
        let pScoreOut = 0;
        let pScoreIn = 0;
        html += '<tr>'
        for (let i = 0; i < 21; i ++) {
            if (i == 0) {html += `<td class="player-name-input" id="player${p}" contentEditable="true">${playerArr[p].name}</td>`;} 
            else if (i == 10) {html += `<td id="p${p}scoreOut">${pScoreOut}</td>`}
            else if (i == 20) {html += `<td id="p${p}scoreIn">${pScoreIn}</td><td id="p${p}totScore">${pScoreIn + pScoreOut}</td></tr>`;} 
            else if (playerArr[p].hasOwnProperty(i)){ 
                html += `<td class="player-score-input" id="p${p}i${i}" contentEditable="true">${playerArr[p][i]}</td>`;
                if (i < 10) {
                    pScoreOut += parseInt(playerArr[p][i]);
                }  else {
                    pScoreIn += parseInt(playerArr[p][i]); 
                }
            } else {
                html += `<td class="player-score-input" id="p${p}i${i}" contentEditable="true"></td>`;
            }
        }
    }
    html += '<tr>'
    holeNum = 0;
    let outPar = 0;
    let inPar = 0;
    for (let i = 0; i < 21; i ++) {
        if (i == 0) {html += '<td>Par</td>'} 
        else if (i == 10) {html += `<td>${outPar}</td>`;} 
        else if (i == 20){html += `<td>${inPar}</td><td>${outPar + inPar}</td></tr>`}
        else {
            html += `<td>${holes[holeNum].teeBoxes[league].par}</td>`
            i < 10 ? outPar += holes[holeNum].teeBoxes[league].par : inPar += holes[holeNum].teeBoxes[league].par;
            holeNum += 1;
        }
    }
    document.getElementById('builder-container').innerHTML = html;
    document.getElementById('render-buttons').style.display = 'inline-block';
    document.getElementById('render-buttons').innerHTML = 
    `<button class="btn btn-primary btn-secondary return-to-selection" id="return-${id}">Change course</button>
    <button class="btn btn-primary btn-secondary show-new-player-input" id="show-input-${id}">Add a player</button>
    <button class="btn btn-primary btn-secondary clear-scores" id="clear-scores-${id}">Clear scores</button>`
}
function updateScore(player) {
    let gTotal = 0;
    let outTotal = 0;
    let inTotal = 0;
    for (let i = 1; i < 20; i ++) {
        if (i < 10) {
            let tBox = document.getElementById(`p${player}i${i}`)
            if (tBox.innerText != '') {
                let val = parseInt(tBox.innerText);
                outTotal += val;
                gTotal += val;
            }
        } else if (i < 20 && i > 10) {
            let tBox = document.getElementById(`p${player}i${i}`)
            if (tBox.innerText != '') {
                let val = parseInt(tBox.innerText);
                inTotal += val;
                gTotal += val;
            }
        }
    }
    document.getElementById(`p${player}scoreOut`).innerText = outTotal;
    document.getElementById(`p${player}scoreIn`).innerText = inTotal;
    document.getElementById(`p${player}totScore`).innerText = gTotal;
}
function save() {
    localStorage.setItem('playerData', JSON.stringify(playerInfo));
    localStorage.setItem('currentId', JSON.stringify(currentId));
    localStorage.setItem('league', JSON.stringify(league));
}

renderCourses();
let currentId;
let optionsBool = [{id: 18300, options: false}, {id: 11819, options: false}, {id: 19002, options: false}];
let league = 0;
let players = 1;
let playerInfo = [];

let ls1 = JSON.parse(localStorage.getItem('currentId'));
let ls2 = JSON.parse(localStorage.getItem('playerData'));
let ls3 = JSON.parse(localStorage.getItem('league'));

if (ls2) {
    playerInfo = ls2;
    if (ls1) {currentId = ls1;}
    if (ls3) {league = ls3;}
    renderCourseInfo(currentId, league, playerInfo);
}

document.body.addEventListener('click', async (e) => {
    if (e.target.className.includes('btn btn-primary')) {
        currentId = /\d{5}/.exec(e.target.id)[0];
        if (e.target.id.includes('showOptions')) {
            for (let i = 0; i < 3; i ++) {
                if (optionsBool[i].id == currentId) {
                    switch (optionsBool[i].options) {
                        case false:
                            document.getElementById(`card${currentId}`).style.height = 'auto';
                            document.getElementById(`options${currentId}`).style.display = 'flex';
                            document.getElementById(`showOptions${currentId}`).style.display = 'none';
                            optionsBool[i].options = true;
                            break;
                        case true:
                            document.getElementById(`card${currentId}`).style.height = '350px';
                            document.getElementById(`options${currentId}`).style.display = 'none';
                            document.getElementById(`showOptions${currentId}`).style.display = 'inline-block';
                            document.getElementById(`names-${currentId}`).style.display = 'none';
                            optionsBool[i].options = false;
                            break;
                    }
                } else {
                    document.getElementById(`card${optionsBool[i].id}`).style.height = '350px';
                    document.getElementById(`options${optionsBool[i].id}`).style.display = 'none';
                    document.getElementById(`showOptions${optionsBool[i].id}`).style.display = 'inline-block';
                    document.getElementById(`names-${optionsBool[i].id}`).style.display = 'none';
                    optionsBool[i].options = false;
                }
            }
        }
        if (e.target.className.includes('options-ok')) {
            document.getElementById(`options${currentId}`).style.display = 'none';
            league = document.getElementById(`league-${currentId}`).value;
            players = document.getElementById(`players-${currentId}`).value;
            let namesInput = document.getElementById(`names-${currentId}`);

            let html = '';
            
            for (let i = 0; i < players; i ++) {html += `<input type="text" class="nameInputs" id="input-${i}" placeholder="Player ${i + 1}"><br>`}
            namesInput.innerHTML = '<label>Please enter player names.</label><br>' + html + 
            `<span><button class="btn btn-primary options-back" id="back-${currentId}">Back</button>
            <button class="btn btn-primary options-render" id="render-${currentId}">Ready</button></span>`;

            namesInput.style.display = 'flex';
        }
        if (e.target.className.includes('options-render')) {
            for (let i = 0; i < players; i ++) {
                let name = document.getElementById(`input-${i}`).value;
                if (name != '') {
                    playerInfo.push({name});
                } else {
                    playerInfo.push({name: '&nbsp'});
                }
            }
            renderCourseInfo(currentId, league, playerInfo);
        }
        if (e.target.className.includes('options-back')) {
            document.getElementById(`options${currentId}`).style.display = 'flex';
            document.getElementById(`names-${currentId}`).style.display = 'none';
        }
        if (e.target.className.includes('show-new-player-input')) {
            playerInfo.push({name: '&nbsp'});
            await renderCourseInfo(currentId, league, playerInfo);
            let name = document.getElementById(`player${playerInfo.length - 1}`);
            name.contentEditable = 'true';
            name.focus();
            name.addEventListener('blur', () => {
                if (name.innerText.charCodeAt(0) == 160) {
                    playerInfo.pop();
                    renderCourseInfo(currentId, league, playerInfo);
                } else {
                    name.contentEditable = 'false';
                    playerInfo[playerInfo.length - 1] = {name: name.innerText};
                    renderCourseInfo(currentId, league, playerInfo);
                }
            })
            name.addEventListener('keydown', (e) => {
                if (e.code === "Enter") {
                    name.blur();
                }
            })
        }
        if (e.target.className.includes('return-to-selection')) {
            renderCourses();
            players = 1;
            playerInfo = [];
            league = 0;
        }
        if (e.target.className.includes('clear-scores')) {
            localStorage.clear();
            let newArray = [];
            playerInfo.forEach(player => {
                newArray.push({name: player.name});
            });
            playerInfo = newArray;
            renderCourseInfo(currentId, league, playerInfo);
        }
    }
    if (e.target.className == 'player-score-input') {
        let input = document.getElementById(e.target.id);
        input.addEventListener('blur', () => {
            let regex = /^\d+$/;
            let player = e.target.id.replace(/^[a-z](\d)[a-z](\d+)/i, "$1");
            let hole = e.target.id.replace(/^[a-z](\d)[a-z](\d+)/i, "$2");

            save();

            if (regex.test(input.innerText)) {
                playerInfo[player][hole] = input.innerText;
                updateScore(player);
            } else {
                input.innerText = '';
                updateScore(player);
            }
        })
        input.addEventListener('keydown', (e) => {
            if (e.code === "Enter" || e.code === 'Tab') {
                input.blur();
            }
        })
    }
    if (e.target.className == 'player-name-input') {
        let nameToChange = document.getElementById(e.target.id);
        nameToChange.addEventListener('blur', (e) => {
            let id = e.target.id.match(/\d$/);
            playerInfo[id].name = nameToChange.innerText;
        });
        nameToChange.addEventListener('keydown', e => {
            if (e.code == "Enter") {
                nameToChange.blur();
            }
        });
    }
});
document.body.addEventListener('focusin', (e) => {
    if (e.target.className == 'player-score-input') {
        let input = document.getElementById(e.target.id);
        input.addEventListener('blur', () => {
            let regex = /^\d+$/;
            let player = e.target.id.replace(/^[a-z](\d)[a-z](\d+)/i, "$1");
            let hole = e.target.id.replace(/^[a-z](\d)[a-z](\d+)/i, "$2");

            save();

            if (regex.test(input.innerText)) {
                playerInfo[player][hole] = input.innerText;
                updateScore(player);
            } else {
                input.innerText = '';
                updateScore(player);
            }
        })
        input.addEventListener('keydown', (e) => {
            if (e.code === "Enter" || e.code === 'Tab') {
                input.blur();
            }
        })
    }
});