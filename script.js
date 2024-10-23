let auth0 = null; // Global variable for Auth0 client

// Initialize the Auth0 client
const initAuth0 = async () => {
  auth0 = await createAuth0Client({
    domain: 'dev-otmijyoitiphecce.eu.auth0.com',
    client_id: 'Ek7z8cPgKHVIt4BZHcPGk7oyRxLjt6Lx',
    cacheLocation: 'localstorage', // Optional for session persistence
  });

  // Handle login callback if redirected after authentication
  if (window.location.search.includes('code=')) {
    await auth0.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/'); // Clean up URL after redirect
  }

  // Check if the user is already authenticated
  const isAuthenticated = await auth0.isAuthenticated();
  if (isAuthenticated) {
    const user = await auth0.getUser();
    document.getElementById('profile').textContent = JSON.stringify(user);
  }
};

// Call initAuth0 when the window loads
window.onload = () => {
  initAuth0();
};

// Add login and logout event listeners
document.getElementById('login').addEventListener('click', async () => {
  await auth0.loginWithRedirect({
    redirect_uri: window.location.origin
  });
});

document.getElementById('logout').addEventListener('click', () => {
  auth0.logout({
    returnTo: window.location.origin
  });
});


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
    roads.sort((a, b) => new Date(a.date) - new Date(b.date));

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
      <small>Reported on: ${new Date(road.date).toLocaleString('en-GB', { hour12: false })}</small>
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
        roadsData = roadsData.filter(road => road.id !== roadId); // Remove from local data
        displayRoads(roadsData); // Redisplay roads without the deleted one
      });
    }
  }

  // Fetch the roads when the page loads
  fetchAndDisplayRoads();
});
