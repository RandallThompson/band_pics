export default function Footer() {
  return (
    <footer className="mt-12 py-10 bg-primary-950/90 backdrop-blur-sm text-white border-t border-primary-700">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent-400">Buffalo Music Scene</h3>
            <p className="text-primary-300">
              Celebrating Buffalo&apos;s rich musical heritage from the Goo Goo Dolls to emerging local artists.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-200">Discover</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Buffalo Venues</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Local Artists</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Upcoming Shows</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Music History</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-200">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Fan Photos</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Submit Content</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Artist Submissions</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Venue Partners</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-200">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Facebook</a></li>
              <li><a href="#" className="text-primary-400 hover:text-accent-400 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-primary-800 text-center text-primary-400">
          <p>&copy; 2025 Buffalo Music Scene. Celebrating the city&apos;s musical legacy.</p>
        </div>
      </div>
    </footer>
  );
}