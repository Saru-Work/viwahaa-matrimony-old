import React from "react";
import { Link } from "react-router-dom";

export default function ProfileView() {
	return (
		<div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
			{/* Sticky Navigation */}
			<header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10 px-4 md:px-20 py-3">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<div className="flex items-center gap-8">
						<div className="flex items-center gap-3 text-primary">
							<span className="material-symbols-outlined text-3xl font-bold">flare</span>
							<h1 className="text-2xl font-extrabold tracking-tight">Viwaha Matrimony</h1>
						</div>
						<nav className="hidden md:flex items-center gap-8">
							<Link className="text-sm font-semibold hover:text-primary transition-colors" to="/">Home</Link>
							<a className="text-sm font-semibold text-primary border-b-2 border-primary pb-1" href="#">Matches</a>
							<a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Inbox</a>
							<a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Shortlist</a>
						</nav>
					</div>
					<div className="flex items-center gap-4">
						<div className="hidden lg:flex items-center bg-primary/5 rounded-full px-4 py-2 border border-primary/10">
							<span className="material-symbols-outlined text-primary/60 text-xl">search</span>
							<input className="bg-transparent border-none focus:ring-0 text-sm w-48 placeholder:text-primary/40" placeholder="Search by ID or Name" type="text" />
						</div>
						<button className="p-2 rounded-full bg-primary/5 text-primary hover:bg-primary/10">
							<span className="material-symbols-outlined">notifications</span>
						</button>
						<div
							className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-accent-gold"
							data-alt="User profile thumbnail circular icon"
							style={{
								backgroundImage:
									"url('https://lh3.googleusercontent.com/aida-public/AB6AXuAqwhsoLHC5i0_BTdeH7B4Pa1RRbGMoDSiYKfi3AtCp-UgRlNryPVg57OqCz24dOEwALofe4xrHj5VDYVqPu4Sw1HTnG_NIrUnQI8J9xkeyO_E714YqeN2xCycL-qD5XUe7KrEvdzFsIVm83N6uQAgwxbedng85T-hfGGi7JdskutPhqvWmF8mNa6m-Att2Uy3YipMXbPftw-7BJ_DxkhYDaeL2aFu1dBRStGfWS2UDICZTLb5uwBRQ9zu2MciUxvVVlfxmGYqbEAgC')",
							}}
						/>
					</div>
				</div>
			</header>

			<main className="max-w-7xl mx-auto px-4 py-8">
				{/* Profile Hero Section */}
				<section className="relative rounded-xl overflow-hidden shadow-2xl mb-8 bg-white dark:bg-slate-900 border border-primary/5">
					<div className="grid grid-cols-1 lg:grid-cols-12">
						{/* Large Profile Image */}
						<div className="lg:col-span-5 relative h-[500px] lg:h-[600px]">
							<div
								className="absolute inset-0 bg-cover bg-center"
								data-alt="Tamil man in elegant traditional silk veshti wedding attire"
								style={{
									backgroundImage:
										"url('https://lh3.googleusercontent.com/aida-public/AB6AXuCpGQTf5sSyoKCuquR8AyiWAf9kmxbbt2zqYuF61uzF9U0C59JtP5xcmwcno0G0WfH8xXMCKxXL94A-jSQATysskcnrx9wB-pSx92FAQ_q7aqJ8jgPoRMGabB6cpgv9FCi4At9BpUbD6dCG0vqaFuPNflHOOqjqyKJIKgoqUcWjlG1w0adyMI33f2_VQmHJrh-6_MMNoBBs7ygWx9wJq0-g77MOKLcs4Cy95s6XmLwmtamTXyT0DvnCr2mahkit0f7-I92vW36Vbzg3')",
								}}
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
							<div className="absolute bottom-6 left-6 text-white">
								<div className="flex items-center gap-2 mb-2">
									<span className="bg-accent-gold text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest">Featured Profile</span>
									<span className="flex items-center gap-1 bg-green-500/80 backdrop-blur px-2 py-0.5 rounded-full text-[10px] font-bold">
										<span className="material-symbols-outlined text-xs">verified</span> Verified
									</span>
								</div>
								<h2 className="text-4xl font-bold">Karthik Venugopal, 29</h2>
								<p className="text-white/80 font-medium">EU982734 • Chennai, Tamil Nadu</p>
							</div>
						</div>

						{/* Fast Info & Actions */}
						<div className="lg:col-span-7 p-8 flex flex-col justify-between">
							<div>
								<div className="flex flex-wrap gap-3 mb-8">
									<button className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
										<span className="material-symbols-outlined">favorite</span> Send Interest
									</button>
									<button className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-primary border-2 border-primary py-4 rounded-xl font-bold hover:bg-primary/5 transition-all">
										<span className="material-symbols-outlined">bookmark</span> Shortlist
									</button>
									<button className="flex-1 flex items-center justify-center gap-2 bg-accent-gold text-primary py-4 rounded-xl font-bold shadow-lg shadow-accent-gold/20 hover:opacity-90 transition-all">
										<span className="material-symbols-outlined">chat</span> Chat Now
									</button>
								</div>
								<div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Profession</p>
										<p className="font-semibold">Software Architect</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Education</p>
										<p className="font-semibold">M.S. in CS, IIT Madras</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Mother Tongue</p>
										<p className="font-semibold">Tamil</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Height</p>
										<p className="font-semibold">5' 11" (180cm)</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Caste</p>
										<p className="font-semibold">Brahmin - Iyer</p>
									</div>
									<div className="space-y-1">
										<p className="text-xs font-bold uppercase tracking-wider text-primary/50">Gothra</p>
										<p className="font-semibold">Bharadwaja</p>
									</div>
								</div>
							</div>
							<div className="mt-12 p-6 bg-primary/5 border border-accent-gold/30 rounded-xl relative overflow-hidden">
								<div className="absolute top-0 right-0 p-2">
									<span className="material-symbols-outlined text-accent-gold text-4xl opacity-20">workspace_premium</span>
								</div>
								<h4 className="text-primary font-bold mb-2 flex items-center gap-2">
									<span className="material-symbols-outlined text-accent-gold">lock</span>
									Premium Contact Details
								</h4>
								<p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Unlock mobile number and direct email for this profile.</p>
								<button className="text-sm font-bold text-accent-gold hover:underline">Upgrade to Premium Plan →</button>
							</div>
						</div>
					</div>
				</section>

				{/* Detailed Sections Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Left Column: Personal & Professional */}
					<div className="lg:col-span-2 space-y-8">
						{/* About Me */}
						<div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/5">
							<h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
								<span className="material-symbols-outlined">person</span> About Me
							</h3>
							<p className="leading-relaxed text-slate-700 dark:text-slate-300">
								I am a grounded and ambitious individual who values family traditions while embracing modern perspectives. Born and raised in Chennai, I currently work as a Software Architect for a global tech firm. I enjoy exploring classical music, South Indian history, and occasional weekend treks. Looking for a partner who is educated, family-oriented, and shares similar cultural values.
							</p>
						</div>

						{/* Professional & Education */}
						<div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/5">
							<h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
								<span className="material-symbols-outlined">work</span> Career & Education
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="flex gap-4">
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
										<span className="material-symbols-outlined">school</span>
									</div>
									<div>
										<p className="text-sm font-bold text-slate-500">Education Details</p>
										<p className="font-semibold text-lg">M.S. Computer Science</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">IIT Madras, Class of 2017</p>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
										<span className="material-symbols-outlined">business_center</span>
									</div>
									<div>
										<p className="text-sm font-bold text-slate-500">Current Profession</p>
										<p className="font-semibold text-lg">Software Architect</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">Google India, Bangalore</p>
									</div>
								</div>
								<div className="flex gap-4 relative group cursor-pointer">
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
										<span className="material-symbols-outlined">payments</span>
									</div>
									<div className="blur-sm group-hover:blur-none transition-all">
										<p className="text-sm font-bold text-slate-500">Annual Income</p>
										<p className="font-semibold text-lg">₹ 45,00,000+</p>
									</div>
									<div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-900/60 rounded-lg group-hover:opacity-0 transition-opacity">
										<span className="material-symbols-outlined text-primary">lock</span>
									</div>
								</div>
								<div className="flex gap-4">
									<div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
										<span className="material-symbols-outlined">location_on</span>
									</div>
									<div>
										<p className="text-sm font-bold text-slate-500">Residency Status</p>
										<p className="font-semibold text-lg">Permanent Resident</p>
										<p className="text-sm text-slate-600 dark:text-slate-400">India (Citizen)</p>
									</div>
								</div>
							</div>
						</div>

						{/* Family Background */}
						<div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/5">
							<h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
								<span className="material-symbols-outlined">family_history</span> Family Heritage
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Father's Status</p>
									<p className="font-semibold">Retired Govt Officer</p>
								</div>
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Mother's Status</p>
									<p className="font-semibold">Homemaker</p>
								</div>
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Siblings</p>
									<p className="font-semibold">1 Younger Brother (Engineer)</p>
								</div>
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Family Values</p>
									<p className="font-semibold">Moderate / Traditional</p>
								</div>
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Family Location</p>
									<p className="font-semibold">Mylapore, Chennai</p>
								</div>
								<div className="border-b border-primary/5 pb-4">
									<p className="text-xs font-bold text-primary/60 uppercase">Native Place</p>
									<p className="font-semibold">Thanjavur, Tamil Nadu</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Religious & Lifestyle */}
					<div className="space-y-8">
						{/* Religious Details / Horoscope */}
						<div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-accent-gold/20 ring-1 ring-accent-gold/10">
							<div className="flex items-center justify-between mb-6">
								<h3 className="text-xl font-bold text-primary flex items-center gap-2">
									<span className="material-symbols-outlined">auto_awesome</span> Horoscope
								</h3>
								<span className="material-symbols-outlined text-accent-gold">star</span>
							</div>
							<div className="space-y-4">
								<div className="flex justify-between py-2 border-b border-primary/5">
									<span className="text-sm font-medium text-slate-500">Star (Nakshatra)</span>
									<span className="font-bold">Moolam</span>
								</div>
								<div className="flex justify-between py-2 border-b border-primary/5">
									<span className="text-sm font-medium text-slate-500">Raasi</span>
									<span className="font-bold">Dhanusu</span>
								</div>
								<div className="flex justify-between py-2 border-b border-primary/5">
									<span className="text-sm font-medium text-slate-500">Dosham</span>
									<span className="font-bold text-green-600">No Dosham</span>
								</div>
								<div className="flex justify-between py-2 border-b border-primary/5">
									<span className="text-sm font-medium text-slate-500">Time of Birth</span>
									<span className="font-bold">06:45 AM</span>
								</div>
							</div>
							<div className="mt-6 p-4 rounded-lg bg-background-light dark:bg-slate-800 border-2 border-dashed border-accent-gold/30 text-center">
								<span className="material-symbols-outlined text-accent-gold text-3xl mb-2">grid_on</span>
								<p className="text-sm font-bold text-slate-700 dark:text-slate-300">Horoscope Chart Attached</p>
								<button className="mt-3 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center gap-2 mx-auto">
									<span className="material-symbols-outlined text-sm">visibility</span> View Chart
								</button>
							</div>
						</div>

						{/* Lifestyle & Habits */}
						<div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-primary/5">
							<h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
								<span className="material-symbols-outlined">nightlife</span> Lifestyle
							</h3>
							<div className="space-y-6">
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
										<span className="material-symbols-outlined">restaurant</span>
									</div>
									<div>
										<p className="text-xs font-bold text-slate-500 uppercase">Food Habits</p>
										<p className="font-semibold">Vegetarian</p>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
										<span className="material-symbols-outlined">language</span>
									</div>
									<div>
										<p className="text-xs font-bold text-slate-500 uppercase">Languages Known</p>
										<p className="font-semibold">Tamil, English, Hindi, Kannada</p>
									</div>
								</div>
								<div>
									<p className="text-xs font-bold text-slate-500 uppercase mb-3">Interests & Hobbies</p>
									<div className="flex flex-wrap gap-2">
										<span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold">Carnatic Music</span>
										<span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold">Chess</span>
										<span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold">Reading History</span>
										<span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold">Photography</span>
										<span className="px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-xs font-bold">Travel</span>
									</div>
								</div>
							</div>
						</div>

						{/* Trust Badge Section */}
						<div className="bg-gradient-to-br from-primary to-slate-900 p-8 rounded-xl shadow-xl text-white">
							<h4 className="font-bold text-lg mb-2">Verified by Viwaha Matrimony</h4>
							<p className="text-sm text-white/70 mb-6">Government ID, Career, and Education certificates have been verified for this profile.</p>
							<div className="flex -space-x-3 mb-4">
								<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400" />
								<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-500" />
								<div className="w-8 h-8 rounded-full border-2 border-white bg-slate-600" />
								<div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-white bg-accent-gold text-[10px] font-bold">+12</div>
							</div>
							<p className="text-[10px] font-bold uppercase tracking-widest text-accent-gold">Trusted by 2.4k members</p>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-primary text-white mt-20 pt-16 pb-8 px-4 md:px-20 border-t-4 border-accent-gold">
				<div className="max-w-7xl mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
						<div className="space-y-4">
							<div className="flex items-center gap-3">
								<span className="material-symbols-outlined text-3xl font-bold text-accent-gold">flare</span>
								<h2 className="text-2xl font-extrabold tracking-tight">Viwaha Matrimony</h2>
							</div>
							<p className="text-white/60 text-sm leading-relaxed">Connecting souls through tradition and trust. The most preferred matrimony site for Tamil families worldwide.</p>
						</div>
						<div>
							<h4 className="font-bold text-accent-gold mb-6 uppercase tracking-widest text-xs">Explore</h4>
							<ul className="space-y-4 text-sm text-white/80">
								<li><a className="hover:text-accent-gold transition-colors" href="#">Premium Memberships</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Success Stories</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Wedding Planner</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Daily Matches</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-accent-gold mb-6 uppercase tracking-widest text-xs">Help & Support</h4>
							<ul className="space-y-4 text-sm text-white/80">
								<li><a className="hover:text-accent-gold transition-colors" href="#">Contact Us</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Safety Tips</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Terms of Service</a></li>
								<li><a className="hover:text-accent-gold transition-colors" href="#">Privacy Policy</a></li>
							</ul>
						</div>
						<div>
							<h4 className="font-bold text-accent-gold mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
							<p className="text-xs text-white/60 mb-4">Get relationship tips and featured profiles directly in your inbox.</p>
							<div className="flex">
								<input className="bg-white/10 border-none rounded-l-lg text-sm w-full focus:ring-accent-gold placeholder:text-white/40" placeholder="Email address" type="email" />
								<button className="bg-accent-gold text-primary px-4 rounded-r-lg font-bold">Join</button>
							</div>
						</div>
					</div>
					<div className="border-t border-white/10 pt-8 flex flex-col md:row justify-between items-center gap-4 text-xs text-white/40">
						<p>© 2024 Viwaha Matrimony Services. All Rights Reserved.</p>
						<div className="flex gap-6">
							<a className="hover:text-accent-gold transition-colors" href="#">Facebook</a>
							<a className="hover:text-accent-gold transition-colors" href="#">Instagram</a>
							<a className="hover:text-accent-gold transition-colors" href="#">Twitter</a>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
