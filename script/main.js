
function getCourses() {
    return fetch('https://golf-courses-api.herokuapp.com/courses').then(
        function(response) {
            return response.json();
        }
    )
}

function getCourse(id) {
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
        html += `<div class="card" style="width: 18rem;">
                    <img src="${course.image}" class="card-img-top" alt="${course.name}" style="height: 100%;">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <button class="btn btn-primary" id='${course.id}'>Select</button>
                    </div>
                </div>`;
    });
    document.getElementById('course-select').innerHTML = html;
}

async function renderCourseInfo(id) {
    let response = await getCourse(id);
    console.log(response);
}

renderCourses();



document.body.addEventListener('click', (e) => {
    if (e.target.className == 'btn btn-primary') {
        renderCourseInfo(e.target.id);
    }
});