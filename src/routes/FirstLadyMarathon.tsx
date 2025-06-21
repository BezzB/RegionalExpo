const FirstLadyMarathon = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="relative min-h-[90vh] flex items-center">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="/assets/images/fladymarathon.jpeg"
            alt="First Lady Marathon"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-xl space-y-8">
            {/* Event Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
              bg-green-600/20 backdrop-blur-sm border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-white text-sm font-medium">Sept 3rd, 2025 • Kakamega</span>
            </div>

            {/* Main Title */}
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-3">
                First Lady
                <span className="block bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                  Marathon
                </span>
              </h1>
              <p className="text-xl md:text-2xl font-light text-white/80">
                Run for Kakamega Forest
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full 
                font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-600/30
                flex items-center gap-2 group">
                Join the Race
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white 
                rounded-full font-medium transition-all duration-300 border border-white/30">
                Learn More
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-bold text-green-400">42km</div>
                <div className="text-sm text-white/70">Distance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">1000+</div>
                <div className="text-sm text-white/70">Runners</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">5000+</div>
                <div className="text-sm text-white/70">Trees</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
          <div className="animate-bounce flex flex-col items-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full opacity-50 blur-3xl" />
          <div className="absolute top-60 -left-40 w-80 h-80 bg-emerald-100 rounded-full opacity-50 blur-3xl" />
        </div>

        {/* Event Overview */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                Event Overview
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Join the Movement for Conservation
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                As the opening event of the Climate Change Summit, this marathon brings together 
                athletes, environmentalists, and community members in a unified effort to preserve 
                East Africa's only tropical rainforest.
              </p>
            </div>

            {/* Event Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  icon: "🗓",
                  title: "Date & Time",
                  details: ["Wednesday, September 3rd, 2025", "Starting at 8:00 AM"],
                  highlight: "Mark your calendar"
                },
                {
                  icon: "📍",
                  title: "Location",
                  details: ["Kakamega Forest", "Meeting Point: Main Entrance"],
                  highlight: "Get directions"
                },
                {
                  icon: "🎽",
                  title: "Registration",
                  details: ["Early Bird: $30", "Regular: $45"],
                  highlight: "Register now"
                }
              ].map((item, index) => (
                <div key={index} 
                  className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl 
                    transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-600">{detail}</p>
                    ))}
                    <button className="mt-4 text-green-600 font-medium hover:text-green-700 
                      transition-colors duration-300 flex items-center gap-2 group-hover:gap-3">
                      {item.highlight}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Race Categories */}
        <section className="relative py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 
                text-sm font-medium mb-4">
                Race Categories
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Choose Your Challenge
              </h2>
              <p className="text-lg text-gray-600">
                Whether you're a seasoned runner or a beginner, we have a category for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Full Marathon",
                  distance: "42km",
                  price: "$45",
                  features: [
                    "Professional timing",
                    "Hydration stations",
                    "Finisher medal",
                    "Race kit",
                    "Tree planting certificate"
                  ]
                },
                {
                  name: "Half Marathon",
                  distance: "21km",
                  price: "$35",
                  features: [
                    "Professional timing",
                    "Hydration stations",
                    "Finisher medal",
                    "Race kit",
                    "Tree planting certificate"
                  ]
                },
                {
                  name: "Fun Run",
                  distance: "5km",
                  price: "$25",
                  features: [
                    "Casual timing",
                    "Hydration stations",
                    "Participation medal",
                    "Race kit",
                    "Tree planting certificate"
                  ]
                }
              ].map((category, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden 
                  hover:shadow-xl transition-shadow duration-300">
                  <div className="p-8 border-b border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-600">{category.distance}</span>
                      <span className="text-gray-500">distance</span>
                    </div>
                    <div className="mt-4 text-gray-600">
                      Starting from <span className="text-gray-900 font-semibold">{category.price}</span>
                    </div>
                  </div>
                  <div className="p-8">
                    <ul className="space-y-4">
                      {category.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-gray-600">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" 
                            viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                              d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="mt-8 w-full py-3 px-6 bg-green-600 hover:bg-green-700 
                      text-white rounded-lg font-medium transition-colors duration-300">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto mb-16 text-center">
              <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 
                text-sm font-medium mb-4">
                Our Impact
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Making a Difference Together
              </h2>
              <p className="text-lg text-gray-600">
                Every step you take contributes to the conservation of Kakamega Forest.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "🌳",
                  stat: "5000+",
                  label: "Trees Planted",
                  description: "Indigenous species restored"
                },
                {
                  icon: "👥",
                  stat: "1000+",
                  label: "Participants",
                  description: "From across East Africa"
                },
                {
                  icon: "🌍",
                  stat: "300",
                  label: "Hectares Protected",
                  description: "Of forest preserved"
                },
                {
                  icon: "🏃‍♀️",
                  stat: "42km",
                  label: "Of Scenic Routes",
                  description: "Through nature"
                }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{item.stat}</div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">{item.label}</div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 bg-green-900">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/90" />
            <div className="absolute inset-0 bg-[url('/assets/images/fladymarathon.jpeg')] 
              opacity-20 bg-cover bg-center" />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Make an Impact?
              </h2>
              <p className="text-xl text-white/80 mb-8">
                Join us in this historic event and be part of the change.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-white text-green-900 rounded-full font-medium 
                  hover:bg-green-50 transition-colors duration-300">
                  Register Now
                </button>
                <button className="px-8 py-4 bg-transparent border-2 border-white text-white 
                  rounded-full font-medium hover:bg-white/10 transition-colors duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="relative py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 
                  text-sm font-medium mb-4">
                  FAQ
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Common Questions
                </h2>
                <p className="text-lg text-gray-600">
                  Everything you need to know about the event.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: "What's included in the registration fee?",
                    answer: "Registration includes a race kit, timing chip, finisher's medal, refreshments, and a tree planting certificate."
                  },
                  {
                    question: "How do I get to the starting point?",
                    answer: "Shuttle services will be available from Kakamega town to the forest entrance. Parking is also available at designated areas."
                  },
                  {
                    question: "What should I bring on race day?",
                    answer: "Bring your race confirmation, ID, appropriate running gear, and any personal hydration preferences."
                  },
                  {
                    question: "Is there an age requirement?",
                    answer: "Participants must be 18+ for the full marathon, 15+ for the half marathon, and all ages are welcome for the fun run."
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md 
                    transition-shadow duration-300 p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.question}</h3>
                    <p className="text-gray-600">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FirstLadyMarathon; 