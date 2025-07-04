export default function Footer() {
  return (
    <footer className="mt-12 py-10 bg-black text-white">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-pink-500">Band Pics</h3>
            <p className="text-gray-400">
              Your ultimate destination for discovering live music and sharing concert experiences.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Discover</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Concerts Near Me</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Popular Artists</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Upcoming Events</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Festivals</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Community</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Fan Photos</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Submit Content</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Artist Submissions</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Venue Partners</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Instagram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Facebook</a></li>
              <li><a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; 2025 Band Pics. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}