export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-300 py-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h3 className="font-semibold text-white">Fixly Services</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Home Cleaning</a></li>
                <li><a href="#" className="hover:underline">Plumbing</a></li>
                <li><a href="#" className="hover:underline">Electrical Repairs</a></li>
                <li><a href="#" className="hover:underline">AC Maintenance</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold text-white">Business Solutions</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Commercial Cleaning</a></li>
                <li><a href="#" className="hover:underline">Office Maintenance</a></li>
                <li><a href="#" className="hover:underline">Corporate Services</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold text-white">Fixly Support</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Track Your Service</a></li>
                <li><a href="#" className="hover:underline">Report an Issue</a></li>
                <li><a href="#" className="hover:underline">FAQs</a></li>
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold text-white">Follow Us</h3>
              <ul className="mt-2 space-y-2">
                <li><a href="#" className="hover:underline">LinkedIn</a></li>
                <li><a href="#" className="hover:underline">Twitter</a></li>
                <li><a href="#" className="hover:underline">Instagram</a></li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm">
            <div className="flex flex-wrap justify-center space-x-4">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Refund Policy</a>
            </div>
            <p className="mt-4">&copy; 2025 Fixly, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  