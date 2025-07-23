import React, { useState } from 'react';
import { Menu, X, Target, Trophy, Calendar, Users, ChevronRight, MapPin } from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample data - replace with real data fetching
  const standings = [
    { rank: 1, name: "Jón Gunnarsson", division: "Open", points: 290.75, percentage: "96.92%" },
    { rank: 2, name: "Ólafur Þórsson", division: "Open", points: 285.25, percentage: "95.08%" },
    { rank: 3, name: "Guðrún Sigurðardóttir", division: "Production", points: 281.25, percentage: "93.75%" },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold">PRS Iceland</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex space-x-8">
                <li><a href="#" className="hover:text-orange-500 transition-colors">Mótaserían</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Úrslit & Stig</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Félagatal</a></li>
                <li><a href="#" className="hover:text-orange-500 transition-colors">Um PRS</a></li>
              </ul>
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:block">
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-md font-medium transition-colors">
                Skrá í mót
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-zinc-950 pt-16">
          <nav className="container mx-auto px-4 py-8">
            <ul className="space-y-4">
              <li><a href="#" className="text-lg">Mótaserían</a></li>
              <li><a href="#" className="text-lg">Úrslit & Stig</a></li>
              <li><a href="#" className="text-lg">Félagatal</a></li>
              <li><a href="#" className="text-lg">Um PRS</a></li>
              <li className="pt-4">
                <button className="w-full bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-md font-medium">
                  Skrá í mót
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent">
          {/* Add your hero image as background here */}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6">
              Precision Rifle Series
              <span className="block text-orange-500">Iceland</span>
            </h1>
            <p className="text-xl lg:text-2xl text-zinc-300 mb-8">
              Compete at the highest level of precision rifle shooting in Iceland's premier competition series
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center">
                Skrá í næsta mót
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
              <button className="border border-zinc-600 hover:bg-zinc-900 px-8 py-3 rounded-md font-medium transition-colors">
                Sjá stigastöðu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-zinc-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">150+</div>
              <div className="text-zinc-400">Active Members</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">24</div>
              <div className="text-zinc-400">Annual Matches</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">4</div>
              <div className="text-zinc-400">Years Active</div>
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
              <div className="text-4xl font-bold text-orange-500 mb-2">2</div>
              <div className="text-zinc-400">Competition Series</div>
            </div>
          </div>
        </div>
      </section>

      {/* Standings Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Current Standings</h2>
            <p className="text-xl text-zinc-400">2025 PRS Iceland Series</p>
          </div>

          <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-zinc-800">
                    <th className="text-left p-4">Rank</th>
                    <th className="text-left p-4">Shooter</th>
                    <th className="text-left p-4">Division</th>
                    <th className="text-right p-4">Points</th>
                    <th className="text-right p-4">%</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((shooter) => (
                    <tr key={shooter.rank} className="border-t border-zinc-800">
                      <td className="p-4">
                        <span className={`font-medium ${
                          shooter.rank === 1 ? 'text-yellow-500' :
                          shooter.rank === 2 ? 'text-zinc-400' :
                          shooter.rank === 3 ? 'text-orange-600' : ''
                        }`}>
                          {shooter.rank}
                        </span>
                      </td>
                      <td className="p-4">{shooter.name}</td>
                      <td className="p-4">{shooter.division}</td>
                      <td className="p-4 text-right font-medium text-green-500">
                        {shooter.points}
                      </td>
                      <td className="p-4 text-right">{shooter.percentage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-xl mb-8 text-zinc-100">
            Join Iceland's premier precision rifle competition series
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-md font-medium transition-colors inline-flex items-center justify-center">
              <Users className="mr-2 h-4 w-4" />
              Become a Member
            </button>
            <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-900 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-6 w-6 text-orange-500" />
                <span className="font-bold">PRS Iceland</span>
              </div>
              <p className="text-sm text-zinc-400">
                Iceland's premier precision rifle competition organization
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-zinc-50">Match Registration</a></li>
                <li><a href="#" className="hover:text-zinc-50">Current Standings</a></li>
                <li><a href="#" className="hover:text-zinc-50">Member Portal</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>prs@prsiceland.is</li>
                <li>Stekkjaseli 7</li>
                <li>109 Reykjavík</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-zinc-400 hover:text-zinc-50">
                  Facebook
                </a>
                <a href="#" className="text-zinc-400 hover:text-zinc-50">
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-400">
            <p>&copy; 2025 PRS Iceland. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;