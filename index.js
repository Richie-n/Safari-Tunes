
// Mouseover/mouseout events
let title = document.getElementById('heading')
console.log(title)

title.addEventListener('mouseover', event => {
    event.target.textContent = "Share your music to the world!!"
})
title.addEventListener('mouseout', event => {
    event.target.textContent = "Upload a song"
})


// API REQUESTS

// Search Bar
let searchBar = document.querySelector('.search-form');
console.log(searchBar);

// Add event listener to the search form for form submission
searchBar.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.querySelector('.search-box').value;
    handleSearch(searchTerm);
});

// Function to handle search functionality
function handleSearch(searchTerm) {
    fetch("http://localhost:3000/catalogue")
        .then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error("Failed to fetch data !");
            }
        })
        .then(data => {
            // Using filter method to filter the data based on the search term
            const filteredSongs = data.filter(song => {
                return (
                    song.Title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    song.Artist.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    song.Genre.toLowerCase().includes(searchTerm.toLowerCase()) 
                );
            });

            // Display filtered songs
            displayFilteredSongs(filteredSongs);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Function to display filtered songs
function displayFilteredSongs(songs) {
    const searchResults = document.querySelector('#search-results');

    // Clear previous search results
    searchResults.innerHTML = '';

    songs.forEach(song => {
        results(song);
    });
}

// Function to render each song as a result
function results(song) {
    const searchResults = document.querySelector('#search-results');
    const foundSong = document.createElement('li');

    foundSong.className = "card col-4 m-5";

    foundSong.innerHTML = `
            <img src="${song.Cover}" class="card-img-top" alt="${song.Title}">
            <div class="card-body">
                <h5 class="card-title">${song.Title}</h5>
                <p class="card-text">${song.Artist} </p>
                <p>Genre: ${song.Genre}</p>
                <audio controls>
                    <source src="${song.Song}" type="audio/mpeg">
                </audio>
                <button  id="download" class="btn m-4 download" data-src="${song.Song}" data-title="${song.Title}">Download</button>
            </div>
    `;

    searchResults.appendChild(foundSong);

    // Add event listener to the download button
    const downloadButton = foundSong.querySelector('.download');
    downloadButton.addEventListener('click', function() {
        const songSrc = this.getAttribute('data-src');
        const songTitle = this.getAttribute('data-title');
        downloadSong(songSrc, songTitle);
    });
}

// Function to handle the download action
function downloadSong(songSrc, songTitle) {
    fetch(songSrc)
        .then(res => res.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = songTitle + '.mp3';
            link.click();
            URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error downloading the song:', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    
});



// UPLOAD FORM
let form = document.querySelector('.m-4')
console.log(form)

form.addEventListener('submit', handleUpload)

function handleUpload(e){
    e.preventDefault()
    let formData = {
        Title: e.target.title.value,
        Artist: e.target.artist.value,
        Genre: e.target.genre.value,
        Cover: e.target.cover.value,
        Song: e.target.song.value
    }
    console.log(formData)
    e.target.reset()
    fetch("http://localhost:3000/catalogue",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res =>{
        if(res.ok){
            return res.json()
            location.reload(); 
        } else{
            throw new error("Failed to create a resource!")
        }
    })
    .then(data => console.log(data))
    .catch(err => console.error({
        "Error": err
    }))
    
}





// Dsplaying the catalogue using GET

function displayCatalogue(){
    fetch("http://localhost:3000/catalogue")
    .then(res =>{
        if(res.ok){
            return res.json()
        }else {
            throw new Error("Failed to fetch data !")
        }
    })
    .then(data => {
        data.map((song) => {
            listSongs(song)
        })
    })
}
displayCatalogue()


function listSongs(songs){
    let playlist =document.querySelector('#song-list')
    let card = document.createElement('li')

    card.className = "card col-4 m-5"
    card.innerHTML = 
    ` 
    <img src=${songs.Cover} class="card-img-top" alt=${songs.Title}>
    <div class="card-body">
    <h5 class="card-title">${songs.Title}</h5>
    <p class="card-text">${songs.Artist} </p>
    <p>Genre:${songs.Genre}</p>
    <audio controls>
       <source src="${songs.Song}" type="audio/mpeg">
    </audio>
    <button class = "btn m-4" id="delete">Delete</button>
    <button class = "edit btn m-4" id="edit_${songs.id}">Edit</button>
    </div>
    
  
  `
    playlist.append(card);

    // select the edit button
    let editBtn = card.querySelector(`#edit_${songs.id}`);
    editBtn.addEventListener('click', (e) => {
        const songId = card.dataset.id;
        const songTitle = song.Title;
        const songArtist = song.Artist;
        const songGenre = song.Genre; 
        const songCover = song.Cover; 
        const songSong = song.Song;  
    
        // Prompt the user to enter new values
        const newTitle = prompt('Enter new Title:', songTitle);
        const newArtist = prompt('Enter new Artist:', songArtist);
        const newGenre = prompt('Enter new Genre:', songGenre);
        const newCover = prompt('Enter new Cover:', songCover);
        const newSong = prompt('Enter new Song:', songSong);
    
        // Prepare updated data object
        const updatedData = {
            Title: newTitle,    
            Artist: newArtist,  
            Genre: newGenre,   
            Cover: newCover,   
            Song: newSong       
        };
    
        updateSong(songId, updatedData);
    });
    
    


    // /select the delete button 
    let deleteBtn = card.querySelector('#delete')
    //attach an event 
    deleteBtn.addEventListener('click', (e) => {
        fetch(`http://localhost:3000/catalogue/${songs.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.ok) {
                alert("Song deleted successfully!!")
            }
        })
        e.target.parentNode.parentNode.remove()
    })


}

// EDIT FORM USING PATCH REQUEST
function updateSong(songId, updatedData) {{
    fetch(`http://localhost:3000/catalogue/${songId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
    })

}}