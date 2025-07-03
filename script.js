document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    searchButton.addEventListener('click', function() {
        performSearch();
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
        
        // In a real application, this would search through actual images
        // For now, we'll just show an alert
        alert(`Searching for: ${searchTerm}`);
        
        // Reset the search input
        searchInput.value = '';
    }
    
    // In a real application, this function would load images from the directories
    function loadImages() {
        // This is a placeholder for future functionality
        console.log('Loading images...');
    }
    
    // Call the loadImages function when the page loads
    loadImages();
});