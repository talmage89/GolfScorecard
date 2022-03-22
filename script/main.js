
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

async function renderCourseInfo(id, league, playersArr) {
    let response = await getSpecificCourse(id);
    let holes = response.data.holes;
    let html = '<tr>';
    let holeNum = 0;
    
    for (let i = 0; i < 23; i ++) {html += '<col></col>'}
    for (let i = 0; i < 21; i ++) {
        if (i == 0) {html += '<td>Hole</td>'} 
        else if (i == 10) {html += `<td>Out</td><td rowspan="${4 + playersArr.length}">Initials</td>`;} 
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
        if (i == 0) {html += '<td>Yard</td>'} 
        else if (i == 10) {html += `<td>${outYards}</td>`;} 
        else if (i == 20){html += `<td>${inYards}</td><td>${outYards + inYards}</td></tr>`}
        else {
            html += `<td>${holes[holeNum].teeBoxes[league].yards}</td>`
            i < 10 ? outYards += holes[holeNum].teeBoxes[league].yards : inYards += holes[holeNum].teeBoxes[league].yards;
            holeNum += 1;
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
    for (let p = 0; p < playersArr.length; p ++) {
        html += '<tr>'
        for (let i = 0; i < 21; i ++) {
            if (i == 0) {html += `<td id="player${p}">${playersArr[p]}</td>`;} 
            else if (i == 10) {html += `<td></td>`}
            else if (i == 20) {html += `<td></td><td></td></tr>`;} 
            else { html += `<td></td>`;}
        }
    }

    document.getElementById('builder-container').innerHTML = html;
    document.getElementById('render-buttons').style.display = 'inline-block';
    document.getElementById('render-buttons').innerHTML = 
                                                            `<button class="btn btn-primary return-to-selection" id="return-${id}">Change course</button>
                                                            <button class="btn btn-primary show-new-player-input" id="show-input-${id}">Add a player</button>`
}

renderCourses();

let optionsBool = [{id: 18300, options: false}, {id: 11819, options: false}, {id: 19002, options: false}];
let league = 0;
let players = 1;
let playerNames = [];
document.body.addEventListener('click', async (e) => {
    if (e.target.className.includes('btn btn-primary')) {
        let currentId = /\d{5}/.exec(e.target.id)[0];
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
                    playerNames.push(name);
                } else {
                    playerNames.push('&nbsp');
                }
            }
            document.getElementById('select-a-course').style.display = 'none';
            document.getElementById('course-is-selected').style.display = 'flex';
            renderCourseInfo(currentId, league, playerNames);
        }
        if (e.target.className.includes('options-back')) {
            document.getElementById(`options${currentId}`).style.display = 'flex';
            document.getElementById(`names-${currentId}`).style.display = 'none';
        }
        if (e.target.className.includes('show-new-player-input')) {
            playerNames.push('&nbsp');
            await renderCourseInfo(currentId, league, playerNames);
            let name = document.getElementById(`player${playerNames.length - 1}`);
            name.contentEditable = 'true';
            name.focus();
            name.addEventListener('blur', () => {
                if (name.innerText.charCodeAt(0) == 160) {
                    playerNames.pop();
                    renderCourseInfo(currentId, league, playerNames);
                } else {
                    name.contentEditable = 'false';
                    playerNames[playerNames.length - 1] = name.innerText;
                    renderCourseInfo(currentId, league, playerNames);
                }
            })
        }
    }
});