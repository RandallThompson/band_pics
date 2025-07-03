document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const resetButton = document.getElementById('reset-button');
    
    searchButton.addEventListener('click', function() {
        performSearch();
    });
    
    resetButton.addEventListener('click', function() {
        resetSearch();
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (searchTerm.trim() === '') {
            alert('Please enter a search term');
            return;
        }
        
        // Search through all image captions and alt text
        const allImageContainers = document.querySelectorAll('.image-container');
        let matchFound = false;
        
        allImageContainers.forEach(container => {
            const caption = container.querySelector('p').textContent.toLowerCase();
            const altText = container.querySelector('img').alt.toLowerCase();
            
            if (caption.includes(searchTerm) || altText.includes(searchTerm)) {
                container.style.display = 'flex';
                matchFound = true;
            } else {
                container.style.display = 'none';
            }
        });
        
        if (!matchFound) {
            alert(`No results found for: ${searchTerm}`);
            // If no matches, show all images again
            allImageContainers.forEach(container => {
                container.style.display = 'flex';
            });
        }
        
        // Reset the search input
        searchInput.value = '';
    }
    
    function resetSearch() {
        // Show all image containers
        const allImageContainers = document.querySelectorAll('.image-container');
        allImageContainers.forEach(container => {
            container.style.display = 'flex';
        });
        
        // Clear the search input
        searchInput.value = '';
    }
    
    // Function to load images from the directories
    function loadImages() {
        console.log('Loading images...');
        
        // In a real application, this would fetch images from the server
        // For demonstration purposes, we'll simulate loading images with sample data
        const genres = ['rock', 'jazz', 'pop', 'events'];
        
        genres.forEach(genre => {
            const galleryElement = document.querySelector(`#${genre} .gallery`);
            
            // Clear any existing content
            galleryElement.innerHTML = '';
            
            // In a real application, we would fetch actual images from the server
            // For now, we'll create placeholder images
            for (let i = 1; i <= 4; i++) {
                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                
                const image = document.createElement('img');
                // Using placeholder image service
                image.src = `https://via.placeholder.com/300x200?text=${genre.charAt(0).toUpperCase() + genre.slice(1)}+Band+${i}`;
                image.alt = `${genre} band ${i}`;
                
                const caption = document.createElement('p');
                caption.textContent = `${genre.charAt(0).toUpperCase() + genre.slice(1)} Band ${i}`;
                
                imageContainer.appendChild(image);
                imageContainer.appendChild(caption);
                galleryElement.appendChild(imageContainer);
            }
        });
    }
    
    // Call the loadImages function when the page loads
    loadImages();
});