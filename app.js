// Get user's location - COMING SOON
var start_location = [49.28369169619546, -123.12871409775906];
// navigator.geolocation.getCurrentPosition((position) => {
//   start_location = [position.coords.latitude, position.coords.longitude];
// });

// Create the map
var map = L.map('map').setView(start_location, 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Populate lat long field of form
function setCoordinates(latlng) {
    // Populate lat long field of form
    const form_lat = document.getElementById("lat");
    form_lat.value = latlng[0];

    const form_long = document.getElementById("long");
    form_long.value = latlng[1];
}

// Create the post-making form
var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(`<button onclick='setCoordinates([${e.latlng.lat}, ${e.latlng.lng}])'>Get coordinates</button>`)
        .openOn(map);
}
map.on('click', onMapClick);

// Pan to area of map where post is
function goToMarker(coords) {
    map.flyTo(coords, 14);
}

function openPost(id) {
    closePosts();
    const post = document.getElementById(`${id}`);
    post.style.display = 'block';
    const posts = document.getElementById('posts');
    posts.style.display = 'block';
}

// Create post
function createPost(e) {

    e.preventDefault();

    // Get data from form
    const form = document.forms["post_form"];
    const lat = form["lat"].value;
    const long = form["long"].value;
    const title = form["title"].value;
    const entry = form["entry"].value;

    // Create post and put in posts div
    const id = self.crypto.randomUUID();
    const posts_div = document.getElementById('posts');
    const post = document.createElement('div');
    post.classList.add('post');
    post.id = id;

    const post_title = document.createElement('h2');
    const post_title_text = document.createTextNode(title);
    post_title.appendChild(post_title_text);

    const img = document.createElement('img');
    img.src = "https://picsum.photos/600/400";
    img.classList.add('postImage');
    img.alt = "Random Image";

    const coords = document.createElement('button');
    const coords_text = document.createTextNode(`${lat} °N; ${long} °E`);
    const marker_icon = document.createElement('i');
    const marker_icon_text = document.createTextNode('place');
    marker_icon.classList.add('material-icons');
    marker_icon.appendChild(marker_icon_text);
    coords.appendChild(marker_icon);
    coords.appendChild(coords_text);
    coords.addEventListener("click", () => {goToMarker([lat, long])});
    coords.classList.add('coordButton');
    // const coords = document.createElement('p');
    // const coords_text = document.createTextNode(`${lat} °N, ${long} °E`);
    // coords.appendChild(coords_text);

    const post_entry = document.createElement('p');
    const post_entry_text = document.createTextNode(entry);
    post_entry.appendChild(post_entry_text);

    post.appendChild(post_title);
    post.appendChild(img);
    post.appendChild(coords);
    post.appendChild(post_entry);

    posts_div.appendChild(post);
    
    // Make marker
    var marker = L.marker([lat, long]).addTo(map);
    marker.bindPopup(`<b>${title}</b><br><button onclick=openPost('${id}')>Read more...</button>`).openPopup();
    form.reset();
}

function closePosts() {
    const posts = document.getElementById("posts");
    
    const all_posts = posts.getElementsByClassName('post');
    for (let post of all_posts) {
        post.style.display = 'none';
    }

    posts.style.display = 'none';
}