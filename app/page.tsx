'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  LayoutDashboard,
  Building2,
  FileUp,
  Rocket,
  Menu,
  X,
  Smartphone,
  Trophy,
  Users,
  Coins
} from 'lucide-react';
import { CTASection } from '@/components/ui/hero-dithering-card';
import { TestimonialsColumn } from '@/components/ui/testimonials-columns-1';
import { HeroPill } from '@/components/ui/hero-pill';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    text: "SLG Golds transformed my small savings into a substantial gold asset. Their flexible monthly schemes are perfect for middle-class families.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Priyanka Sharma",
    role: "Regular Investor",
  },
  {
    text: "The transparency and security provided by SLG Golds is unmatched. I can track my silver assets daily through their intuitive portal.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Rajesh Kumar",
    role: "Business Owner",
  },
  {
    text: "Exceptional customer service. They guided me through every step of the gold enrollment process. Truly a trusted partner.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Sunita Reddy",
    role: "Home Maker",
  },
  {
    text: "I've been investing with them since 2015. Their growth and reliability have been consistent throughout the years.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Amit Patel",
    role: "Tech Professional",
  },
  {
    text: "The best part is how easy it is to manage schemes. No hidden charges, just pure transparency in gold and silver rates.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Meera Iyer",
    role: "Investor",
  },
  {
    text: "Finally a way to save in gold that actually fits my monthly budget. Highly recommended for long-term wealth building.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150",
    name: "Vijay Singh",
    role: "Operations Manager",
  },
];

const firstColumn = testimonials.slice(0, 2);
const secondColumn = testimonials.slice(2, 4);
const thirdColumn = testimonials.slice(4, 6);

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9] text-[#111] font-sans selection:bg-primary/30">
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <span className="text-xl font-bold tracking-tighter">SLG GOLDS</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'Schemes', 'Contact', 'About'].map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {item}
              </Link>
            ))}
            <Link href="/login">
              <Button size="sm" className="rounded-full px-6">Login Portal</Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 items-center">
              {['Home', 'Schemes', 'Contact', 'About'].map((item) => (
                <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold hover:text-primary transition-colors">
                  {item}
                </Link>
              ))}
              <Link href="/login" className="w-full">
                <Button className="w-full h-14 rounded-2xl text-lg">Login Portal</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Announcement Area */}
        <div className="pt-28 flex justify-center">
          <HeroPill
            href="#"
            label="New digital gold schemes launched for 2026"
            announcement="🛠️ New"
            className="gold-glow"
          />
        </div>

        {/* Hero Section */}
        <CTASection />

        {/* Stats Section */}
        <section className="py-20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Happy Investors', value: '12k+', icon: <Users className="w-6 h-6" /> },
              { label: 'Assets Managed', value: '₹50Cr+', icon: <Trophy className="w-6 h-6" /> },
              { label: 'Years of Trust', value: '14+', icon: <Clock className="w-6 h-6" /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-[32px] border border-border flex flex-col items-center text-center group hover:border-primary/50 transition-all hover:shadow-2xl shadow-sm"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold mb-1">{stat.value}</h3>
                <p className="text-muted-foreground font-medium uppercase text-xs tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-white" id="about">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Why SLG GOLDS?</h2>
              <p className="text-muted-foreground text-lg">We combine traditional trust with modern technology to provide the best investment experience.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  title: 'Secure Investment',
                  desc: 'Your assets are backed by physical gold and silver, secured in certified vaults.',
                  icon: <ShieldCheck className="w-10 h-10" />,
                  color: 'bg-primary/5 text-primary'
                },
                {
                  title: 'Flexible Plans',
                  desc: 'From small daily savings to large monthly schemes, we have plans for everyone.',
                  icon: <LayoutDashboard className="w-10 h-10" />,
                  color: 'bg-blue-50 text-blue-600'
                },
                {
                  title: 'Easy Management',
                  desc: 'Track your growth, make payments, and manage documentation via our app.',
                  icon: <Smartphone className="w-10 h-10" />,
                  color: 'bg-green-50 text-green-600'
                }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-start gap-6">
                  <div className={`w-20 h-20 rounded-[28px] ${item.color} flex items-center justify-center shadow-inner`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to Start */}
        <section className="py-24 bg-[#f9f9f9]" id="schemes">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-[48px] border border-border p-12 md:p-20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-20 -mt-20"></div>

              <div className="text-center mb-16 relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">Become an Investor in 3 Simple Steps</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Getting started with SLG Golds is quick and completely transparent.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {[
                  {
                    step: '01',
                    title: 'Visit Office',
                    desc: 'Meet our consultants at our Nagercoil headquarters for a primary consultation.',
                    icon: <Building2 />
                  },
                  {
                    step: '02',
                    title: 'Upload Documents',
                    desc: 'Submit your KYC documents and complete enrollment through our secure portal.',
                    icon: <FileUp />
                  },
                  {
                    step: '03',
                    title: 'Start Investing',
                    desc: 'Start your monthly scheme and watch your gold & silver assets grow in real-time.',
                    icon: <Rocket />
                  }
                ].map((step, i) => (
                  <div key={i} className="relative p-8 rounded-4xl bg-[#fcfcfc] border border-border/50 group hover:bg-white hover:shadow-xl transition-all">
                    <div className="text-6xl font-black text-black/5 absolute top-4 right-8 group-hover:text-primary/10 transition-colors">{step.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">What Our Investors Say</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Real stories from real people building their gold legacy with SLG Golds.</p>
          </div>

          <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px]">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
            <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">Your future is in safe hands.</h2>
            <p className="text-white/80 text-xl font-medium">Join 12,000+ investors who trust us for their wealth security.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/login">
                <Button size="lg" variant="secondary" className="h-16 px-12 rounded-full text-lg shadow-2xl">
                  Register Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-full text-lg border-white/30 text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-16 px-6" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                <span className="text-lg font-bold tracking-tighter">SLG GOLDS</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nagercoil, Kanyakumari Dist. <br />
                Tamil Nadu, India - 629001
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About Us</Link></li>
                <li><Link href="#" className="hover:text-primary">Our Schemes</Link></li>
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Invest</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Gold Scheme</Link></li>
                <li><Link href="#" className="hover:text-primary">Silver Scheme</Link></li>
                <li><Link href="#" className="hover:text-primary">Loyalty Program</Link></li>
                <li><Link href="#" className="hover:text-primary">Market Rates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>support@slggolds.com</li>
                <li>+91 (4652) 234-567</li>
                <li className="flex gap-4 pt-4">
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-muted-foreground hover:text-white">𝕏</div>
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-muted-foreground hover:text-white">in</div>
                  <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-muted-foreground hover:text-white">ig</div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
            <p>© 2026 SLG Golds Private Limited. All rights reserved.</p>
            <div className="flex gap-6">
              <span>EST. 2012 — Nagercoil</span>
              <span className="flex items-center gap-1 font-bold text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pluse"></div>
                System Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
