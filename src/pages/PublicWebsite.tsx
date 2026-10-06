import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Trophy, Users, Target, MapPin, Phone, Mail, Calendar, Star, ChevronRight } from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h1 className="font-bold text-primary text-sm">Ahenkan FC</h1>
                <p className="text-[10px] text-gray-500">Football Academy</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#about" className="text-sm text-gray-600 hover:text-primary">About</a>
              <a href="#programs" className="text-sm text-gray-600 hover:text-primary">Programs</a>
              <a href="#coaches" className="text-sm text-gray-600 hover:text-primary">Coaches</a>
              <a href="#news" className="text-sm text-gray-600 hover:text-primary">News</a>
              <a href="#contact" className="text-sm text-gray-600 hover:text-primary">Contact</a>
              <Link to="/login" className="px-4 py-2 gradient-primary text-white rounded-lg text-sm font-medium hover:opacity-90">Login</Link>
            </div>
            <Link to="/login" className="md:hidden px-3 py-1.5 gradient-primary text-white rounded-lg text-xs font-medium">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 relative overflow-hidden">
        <div className="gradient-primary min-h-[600px] flex items-center relative">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-accent/30 blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full mb-6">
                <Star size={14} className="text-accent" />
                <span className="text-xs text-green-100">Est. 2025 • Adeiso, Ghana</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Developing Ghana's<br /><span className="text-accent">Future Stars</span>
              </h1>
              <p className="text-lg text-green-100 mb-8 max-w-lg">
                Professional football development for young players from U-8 to U-17. 
                Building champions on and off the pitch through excellence in sport, education, and character.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#programs" className="px-6 py-3 bg-accent text-gray-900 rounded-lg font-semibold text-sm hover:bg-accent-light transition-colors">
                  Explore Programs
                </a>
                <a href="#contact" className="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-semibold text-sm hover:bg-white/20 transition-colors">
                  Register Now
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Active Players', value: '44+' },
              { icon: Trophy, label: 'Matches Played', value: '20+' },
              { icon: Target, label: 'Age Groups', value: '6' },
              { icon: Star, label: 'Years of Vision', value: '2025' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <stat.icon size={24} className="mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About Ahenkan Football Academy</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2025, Ahenkan Football Academy is dedicated to developing young football talent in the Upper West Akyem area of Ghana. 
                We believe in nurturing not just football skills, but complete individuals who excel in sport, education, and life.
              </p>
              <p className="text-gray-600 mb-6">
                Our academy provides professional coaching, structured training programs, and competitive match experience for players aged 8 to 17. 
                We focus on technical development, tactical understanding, physical fitness, and mental strength.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: 'Football Development', desc: 'Professional coaching for all age groups' },
                  { title: 'Academic Excellence', desc: 'Supporting education alongside sport' },
                  { title: 'Character Building', desc: 'Discipline, teamwork, and leadership' },
                  { title: 'Life Skills', desc: 'Preparing players for success beyond football' },
                ].map(item => (
                  <div key={item.title} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Shield size={48} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary">Ahenkan FC</h3>
                <p className="text-sm text-gray-500 mt-1">Adeiso, Upper West Akyem</p>
                <p className="text-xs text-gray-400 mt-1">Established 2025</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Programs</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Structured development pathways for every age group</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { age: 'U-8', title: 'Tiny Stars', desc: 'Introduction to football through fun games and basic skills development', color: 'bg-pink-100 text-pink-700' },
              { age: 'U-10', title: 'Rising Stars', desc: 'Fundamental skills, teamwork, and love for the game', color: 'bg-blue-100 text-blue-700' },
              { age: 'U-12', title: 'Developing Stars', desc: 'Technical development and introduction to tactical concepts', color: 'bg-green-100 text-green-700' },
              { age: 'U-14', title: 'Youth Academy', desc: 'Advanced technical and tactical training with competitive matches', color: 'bg-purple-100 text-purple-700' },
              { age: 'U-15', title: 'Elite Youth', desc: 'High-performance training with focus on position-specific development', color: 'bg-amber-100 text-amber-700' },
              { age: 'U-17', title: 'Senior Youth', desc: 'Pre-professional development preparing players for the next level', color: 'bg-red-100 text-red-700' },
            ].map(program => (
              <div key={program.age} className="bg-white rounded-xl p-6 card-shadow border border-gray-100 hover:shadow-md transition-shadow">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${program.color}`}>{program.age}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-3 mb-2">{program.title}</h3>
                <p className="text-sm text-gray-600">{program.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ul className="space-y-1.5 text-xs text-gray-500">
                    <li className="flex items-center gap-2"><ChevronRight size={12} /> 3-4 training sessions per week</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} /> Weekend matches</li>
                    <li className="flex items-center gap-2"><ChevronRight size={12} /> Professional coaching</li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Our Coaching Staff</h2>
            <p className="text-gray-600">Experienced and licensed professionals dedicated to player development</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Kwesi Appiah', role: 'Head Coach', license: 'CAF License B', spec: 'Youth Development' },
              { name: 'Ama Serwaa', role: 'Goalkeeping Coach', license: 'CAF License A', spec: 'Goalkeeping' },
              { name: 'Yaw Boateng', role: 'Fitness Coach', license: 'CAF License C', spec: 'Fitness & Conditioning' },
              { name: 'Abena Osei', role: 'Tactical Coach', license: 'CAF License B', spec: 'Tactical Analysis' },
            ].map(coach => (
              <div key={coach.name} className="bg-white rounded-xl p-6 card-shadow border border-gray-100 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 mx-auto rounded-full gradient-primary flex items-center justify-center text-white text-xl font-bold mb-4">
                  {coach.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-gray-800">{coach.name}</h3>
                <p className="text-sm text-primary font-medium">{coach.role}</p>
                <p className="text-xs text-gray-500 mt-2">{coach.license}</p>
                <p className="text-xs text-gray-400">{coach.spec}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section id="news" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Academy News</h2>
            <p className="text-gray-600">Latest updates from Ahenkan Football Academy</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Pre-Season Training Begins', date: 'June 2025', desc: 'All players are expected to report for pre-season training. New registration is now open for all age groups.' },
              { title: 'League Campaign Update', date: 'June 2025', desc: 'Our U-17 team continues to perform strongly in the Eastern Regional Youth League with an impressive win record.' },
              { title: 'New Partnership Announced', date: 'May 2025', desc: 'Ahenkan FC partners with local schools to support academic excellence alongside football development.' },
            ].map((news, i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden card-shadow border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-32 gradient-primary flex items-center justify-center">
                  <Trophy size={32} className="text-white/50" />
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{news.date}</p>
                  <h3 className="font-bold text-gray-800 mb-2">{news.title}</h3>
                  <p className="text-sm text-gray-600">{news.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">Ready to join Ahenkan Football Academy? Get in touch with us today.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Location</p>
                    <p className="text-sm text-gray-600">Adeiso, Upper West Akyem, Ghana</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Phone</p>
                    <p className="text-sm text-gray-600">+233 24 000 0000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Email</p>
                    <p className="text-sm text-gray-600">info@ahenkanfc.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <Calendar size={20} className="text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">Training Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri: 4:00 PM - 6:00 PM | Sat: 8:00 AM - 12:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 card-shadow border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Registration Inquiry</h3>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); alert('Thank you for your interest! We will contact you soon.'); }}>
                <input required placeholder="Parent/Guardian Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <input required placeholder="Player Name" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <input required type="tel" placeholder="Phone Number" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <input type="email" placeholder="Email" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" />
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none">
                  <option>Select Age Group</option>
                  <option>U-8</option><option>U-10</option><option>U-12</option><option>U-14</option><option>U-15</option><option>U-17</option>
                </select>
                <textarea placeholder="Additional message..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary outline-none" rows={3} />
                <button type="submit" className="w-full py-2.5 gradient-primary text-white rounded-lg font-medium text-sm hover:opacity-90">Submit Inquiry</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="gradient-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Shield size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Ahenkan FC</h3>
                  <p className="text-xs text-green-200">Football Academy</p>
                </div>
              </div>
              <p className="text-sm text-green-100">Developing Ghana's Future Stars since 2025.</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Quick Links</h4>
              <div className="space-y-2">
                <a href="#about" className="block text-sm text-green-200 hover:text-white">About Us</a>
                <a href="#programs" className="block text-sm text-green-200 hover:text-white">Programs</a>
                <a href="#coaches" className="block text-sm text-green-200 hover:text-white">Coaches</a>
                <a href="#contact" className="block text-sm text-green-200 hover:text-white">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Academy Portal</h4>
              <div className="space-y-2">
                <Link to="/login" className="block text-sm text-green-200 hover:text-white">Staff Login</Link>
                <Link to="/login" className="block text-sm text-green-200 hover:text-white">Player Portal</Link>
                <Link to="/login" className="block text-sm text-green-200 hover:text-white">Parent Portal</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-xs text-green-200">© 2025 Ahenkan Football Academy. All rights reserved. | Adeiso, Upper West Akyem, Ghana</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
