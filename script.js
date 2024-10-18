// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('road-form');
//   const roadContainer = document.getElementById('roads-list');
//   const searchInput = document.getElementById('searchInput');
//   const trafficFilter = document.getElementById('trafficFilter');

//   let roadsData = [];
//   document.getElementById('theme-toggle').addEventListener('click', function () {
//     const body = document.body;
    
//     // Toggle between light and dark theme
//     body.classList.toggle('dark-theme');
    
//     // Update button text based on the current theme
//     if (body.classList.contains('dark-theme')) {
//         this.textContent = 'Switch to Light Theme';
//     } else {
//         this.textContent = 'Switch to Dark Theme';
//     }
// });



//   // Fetch and display road reports
//   function fetchAndDisplayRoads() {
//     fetch('http://localhost:3000/roads')
//       .then(res => res.json())
//       .then(data => {
//         roadsData = data; // Save data for search and filter
//         displayRoads(roadsData);
//       });
//   }

//   // Display the filtered and/or searched roads
//   function displayRoads(roads) {
//     roadContainer.innerHTML = ''; // Clear previous results
   

//     // Sort by date (newest first)
//     roads.sort((a, b) => new Date(b.date) - new Date(a.date));

//     // Display each road
//     roads.forEach(road => displayRoad(road));
//   }

//   // Form submission to add a new road report
//   form.addEventListener('submit', function(event) {
//     event.preventDefault();

//     const roadName = document.getElementById('roadName').value;
//     const roadLocation = document.getElementById('roadLocation').value;
//     const roadImage = document.getElementById('roadImage').value;
//     const trafficCondition = document.getElementById('trafficCondition').value;
//     const weatherCondition = document.getElementById('weatherCondition').value;

//     const newRoad = {
//       name: roadName,
//       location: roadLocation,
//       trafficCondition: trafficCondition,
//       weatherCondition: weatherCondition,
//       status: 'Unknown',
//       upvotes: 0,
//       downvotes: 0,
//       image: roadImage,
//       date: new Date().toISOString()
//     };

//     fetch('http://localhost:3000/roads', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(newRoad)
//     })
//     .then(res => res.json())
//     .then(data => {
//       roadsData.push(data); // Add the new road to our data array
//       displayRoads(roadsData); // Redisplay roads, sorted by date
//       form.reset(); // Clear the form
//     });
//   });

//   // Function to display a single road
//   function displayRoad(road) {
//     const roadDiv = document.createElement('div');
//     roadDiv.className = 'road-report';
    

//     roadDiv.innerHTML = `
//       <h3>${road.name} - ${road.location}</h3>
//       <img src="${road.image}" alt="Map of ${road.name}" class="road-image">
//       <p>Status: <strong id="status-${road.id}">${road.status}</strong></p>
//       <p>Traffic Condition: ${road.trafficCondition}</p>
//       <p>Weather Condition: ${road.weatherCondition}</p>
//       <p>Upvotes: <span id="upvote-count-${road.id}">${road.upvotes}</span></p>
//       <p>Downvotes: <span id="downvote-count-${road.id}">${road.downvotes}</span></p>
//       <button class="upvote" data-id="${road.id}">Upvote</button>
//       <button class="downvote" data-id="${road.id}">Downvote</button>
//       <button class="delete" data-id="${road.id}">Delete</button>
//       <small>Reported on: ${new Date(road.date).toLocaleString()}</small>
//     `;

//     roadContainer.prepend(roadDiv); // Newer roads appear on top

//     // Add event listeners for upvote and downvote buttons
//     roadDiv.querySelector('.upvote').addEventListener('click', () => updateVote(road.id, true));
//     roadDiv.querySelector('.downvote').addEventListener('click', () => updateVote(road.id, false));
//     roadDiv.querySelector('.delete').addEventListener('click', () => deleteRoad(road.id)); // Delete button event listener
//   }

//   // Search and filter logic
//   searchInput.addEventListener('input', () => {
//     const searchTerm = searchInput.value.toLowerCase();
//     const filteredRoads = roadsData.filter(road => 
//       road.name.toLowerCase().includes(searchTerm) ||
//       road.location.toLowerCase().includes(searchTerm) ||
//       road.status.toLowerCase().includes(searchTerm)
//     );

//     displayRoads(filteredRoads); // Always display with newest first
//   });

//   trafficFilter.addEventListener('change', () => {
//     const selectedTraffic = trafficFilter.value;
//     const filteredRoads = roadsData.filter(road =>
//       selectedTraffic === '' || road.trafficCondition === selectedTraffic
//     );

//     displayRoads(filteredRoads); // Always display with newest first
//   });

//   // Function to handle upvotes and downvotes
//   function updateVote(roadId, isUpvote) {
//     fetch(`http://localhost:3000/roads/${roadId}`)
//       .then(res => res.json())
//       .then(road => {
//         let newUpvotes = road.upvotes;
//         let newDownvotes = road.downvotes;

//         // Update votes inversely
//         if (isUpvote) {
//           newUpvotes++;
//           if (newDownvotes > 0) newDownvotes--;
//         } else {
//           newDownvotes++;
//           if (newUpvotes > 0) newUpvotes--;
//         }

//         // Update status based on vote difference
//         let newStatus = road.status;
//         if (newUpvotes - newDownvotes >= 5) {
//           newStatus = 'Good';
//         } else if (newDownvotes - newUpvotes >= 5) {
//           newStatus = 'Bad';
//         }

//         // Patch the road data
//         fetch(`http://localhost:3000/roads/${roadId}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({ upvotes: newUpvotes, downvotes: newDownvotes, status: newStatus })
//         })
//         .then(() => {
//           // Update DOM
//           document.getElementById(`upvote-count-${roadId}`).innerText = newUpvotes;
//           document.getElementById(`downvote-count-${roadId}`).innerText = newDownvotes;
//           document.getElementById(`status-${roadId}`).innerText = newStatus;
//         });
//       });
//   }

//   // Function to delete a road report
//   function deleteRoad(roadId) {
//     if (confirm('Are you sure you want to delete this road report?')) {
//       fetch(`http://localhost:3000/roads/${roadId}`, {
//         method: 'DELETE'
//       })
//       .then(() => {
//         // Remove the road from the local data array
//         roadsData = roadsData.filter(road => road.id !== roadId);
//         displayRoads(roadsData); // Redisplay the remaining roads
//       });
//     }
//   }

//   // Fetch and display roads on page load
//   fetchAndDisplayRoads();
// });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('road-form');
  const roadContainer = document.getElementById('roads-list');
  const searchInput = document.getElementById('searchInput');
  const trafficFilter = document.getElementById('trafficFilter');

  let roadsData = [];
  document.getElementById('theme-toggle').addEventListener('click', function () {
    const body = document.body;
    
    // Toggle between light and dark theme
    body.classList.toggle('dark-theme');
    
    // Update button text based on the current theme
    if (body.classList.contains('dark-theme')) {
        this.textContent = 'Switch to Light Theme';
    } else {
        this.textContent = 'Switch to Dark Theme';
    }
  });

  // Fetch and display road reports
  function fetchAndDisplayRoads() {
    fetch('http://localhost:3000/roads')
      .then(res => res.json())
      .then(data => {
        roadsData = data; // Save data for search and filter
        displayRoads(roadsData);
      });
  }

  // Display the filtered and/or searched roads
  function displayRoads(roads) {
    roadContainer.innerHTML = ''; // Clear previous results

    // Sort by date (newest first)
    roads.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Display each road
    roads.forEach(road => displayRoad(road));
  }

  // Form submission to add a new road report
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const roadName = document.getElementById('roadName').value;
    const roadLocation = document.getElementById('roadLocation').value;
    const roadImage = document.getElementById('roadImage').value;
    const trafficCondition = document.getElementById('trafficCondition').value;
    const weatherCondition = document.getElementById('weatherCondition').value;

    const newRoad = {
      name: roadName,
      location: roadLocation,
      trafficCondition: trafficCondition,
      weatherCondition: weatherCondition,
      status: 'Unknown',
      upvotes: 0,
      downvotes: 0,
      image: roadImage,
      date: new Date().toISOString()
    };

    fetch('http://localhost:3000/roads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newRoad)
    })
    .then(res => res.json())
    .then(data => {
      roadsData.push(data); // Add the new road to our data array
      displayRoads(roadsData); // Redisplay roads, sorted by date
      form.reset(); // Clear the form
    });
  });

  // Function to display a single road
  function displayRoad(road) {
    const roadDiv = document.createElement('div');
    roadDiv.className = 'road-report';

    // Determine the status class based on the status
    const statusClass = road.status === 'Good' ? 'status-good' : road.status === 'Bad' ? 'status-bad' : '';

    roadDiv.innerHTML = `
      <h3>${road.name} - ${road.location}</h3>
      <img src="${road.image}" alt="Map of ${road.name}" class="road-image">
      <p>Status: <strong id="status-${road.id}" class="${statusClass}">${road.status}</strong></p>
      <p>Traffic Condition: ${road.trafficCondition}</p>
      <p>Weather Condition: ${road.weatherCondition}</p>
      <p>Upvotes: <span id="upvote-count-${road.id}">${road.upvotes}</span></p>
      <p>Downvotes: <span id="downvote-count-${road.id}">${road.downvotes}</span></p>
      <button class="upvote" data-id="${road.id}">Upvote</button>
      <button class="downvote" data-id="${road.id}">Downvote</button>
      <button class="delete" data-id="${road.id}">Delete</button>
      <small>Reported on: ${new Date(road.date).toLocaleString()}</small>
    `;

    roadContainer.prepend(roadDiv); // Newer roads appear on top

    // Add event listeners for upvote and downvote buttons
    roadDiv.querySelector('.upvote').addEventListener('click', () => updateVote(road.id, true));
    roadDiv.querySelector('.downvote').addEventListener('click', () => updateVote(road.id, false));
    roadDiv.querySelector('.delete').addEventListener('click', () => deleteRoad(road.id)); // Delete button event listener
  }

  // Search and filter logic
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredRoads = roadsData.filter(road => 
      road.name.toLowerCase().includes(searchTerm) ||
      road.location.toLowerCase().includes(searchTerm) ||
      road.status.toLowerCase().includes(searchTerm)
    );

    displayRoads(filteredRoads); // Always display with newest first
  });

  trafficFilter.addEventListener('change', () => {
    const selectedTraffic = trafficFilter.value;
    const filteredRoads = roadsData.filter(road =>
      selectedTraffic === '' || road.trafficCondition === selectedTraffic
    );

    displayRoads(filteredRoads); // Always display with newest first
  });

  // Function to handle upvotes and downvotes
  function updateVote(roadId, isUpvote) {
    fetch(`http://localhost:3000/roads/${roadId}`)
      .then(res => res.json())
      .then(road => {
        let newUpvotes = road.upvotes;
        let newDownvotes = road.downvotes;

        // Update votes inversely
        if (isUpvote) {
          newUpvotes++;
          if (newDownvotes > 0) newDownvotes--;
        } else {
          newDownvotes++;
          if (newUpvotes > 0) newUpvotes--;
        }

        // Update status based on vote difference
        let newStatus = road.status;
        if (newUpvotes - newDownvotes >= 5) {
          newStatus = 'Good';
        } else if (newDownvotes - newUpvotes >= 5) {
          newStatus = 'Bad';
        }

        // Patch the road data
        fetch(`http://localhost:3000/roads/${roadId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ upvotes: newUpvotes, downvotes: newDownvotes, status: newStatus })
        })
        .then(() => {
          // Update DOM
          document.getElementById(`upvote-count-${roadId}`).innerText = newUpvotes;
          document.getElementById(`downvote-count-${roadId}`).innerText = newDownvotes;
          document.getElementById(`status-${roadId}`).innerText = newStatus;
          // Update the status class
          const statusClass = newStatus === 'Good' ? 'status-good' : newStatus === 'Bad' ? 'status-bad' : '';
          document.getElementById(`status-${roadId}`).className = statusClass;
        });
      });
  }

  // Function to delete a road report
  function deleteRoad(roadId) {
    if (confirm('Are you sure you want to delete this road report?')) {
      fetch(`http://localhost:3000/roads/${roadId}`, {
        method: 'DELETE'
      })
      .then(() => {
        // Remove the road from the local data array
        roadsData = roadsData.filter(road => road.id !== roadId);
        displayRoads(roadsData); // Redisplay the remaining roads
      });
    }
  }

  // Fetch and display roads on page load
  fetchAndDisplayRoads();
});

