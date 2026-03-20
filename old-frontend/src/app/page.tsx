"use client";

import { useRef, useEffect, useState } from 'react';
import AnimatedHero from '@/components/AnimatedHero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import IndustryPartners from '@/components/IndustryPartners';
import { motion, animate, useInView, Variants } from 'framer-motion';
import { Code, Database, Globe, Layers, CheckCircle, ArrowRight, ShieldCheck, BookOpen, Cpu, Server, Lock, Download, TrendingUp, Quote, Star, Linkedin, Twitter, Github, Instagram, Mail, Phone, MapPin, Send, ChevronRight, Zap, Target, Rocket, Lightbulb, Video, Award, Users } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';

// BEST ANIMATIONS: VARIANT DEFINITIONS
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

function Counter({ value, suffix = "", duration = 2 }: { value: number, suffix?: string, duration?: number }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: duration,
        ease: "easeOut",
        onUpdate: (latest) => setDisplayValue(Math.round(latest)),
      });
      return controls.stop;
    }
  }, [value, duration, isInView]);

  return <span ref={ref}>{displayValue}{suffix}</span>;
}

const getCompanyLogo = (company: string) => {
  const mapping: { [key: string]: string } = {
    'Cognizant': '1',
    'Terralogic': '2',
    'Oracle': '3',
    'Absolute Labs': '4',
    'AbsoluteLabs': '4',
    'Forsys': '5',
    'SparxIT': '6',
    'Algoworks': '7',
    'DXMINDS': '8',
    'Nexgen': '9',
    'Honeywell': '10',
    'Deloitte': '11',
    'Cisco': '12',
    'ZenSar Technologies': '13',
    'ZenSar': '13',
    'ITC INFOTECH': '14',
    'Hexaware Technologies': '15',
    'HP': '16',
    'Mphasis': '17',
    'Mindtree': '18',
    'Wipro': '19',
    'DXC Technology': '24',
    'Dr. Reddy\'s': '21',
    'Salesforce': '22',
    'IBM': '23',
    'Facebook': '25',
    'AWS': '26',
    'Tech Mahindra': '27',
    'Tech Mahendra': '27',
    'Accenture': '28',
    'HCLTech': '29',
    'HCL': '29',
    'Arcitech': '31',
    'Cloud Leaf L.L.C': '32',
    'CloudLeaf': '32',
    'Teachmint': '33',
    'Centillion Networks': '34',
    'Centelon': '34',
    'Tech Solutions': '35',
    'Gemini': '36',
    'Amazon': '37',
    'Microsoft': '38',
    'Adobe': '39',
    'Uber': '40',
    'Cred': '41',
    'Zerodha': '42',
    'Netflix': '43',
    'Google Cloud': '44',
    'Google': '44',
    'Apple': '45',
    'Razorpay': '46',
    'Meta': '47',
    'Canva': '48',
    'Stripe': '49',
    'Walmart': '50',
    'Flipkart': '51',
    'Airbnb': '52',
    'Snowflake': '46',
    'PayPal': '51',
    'Nemali Software Solutions': '53',
    'Innovation Labs': '54'
  };

  const normalized = company.trim();
  const logoId = mapping[normalized] || String((Math.abs(deterministicHash(normalized)) % 54) + 1);
  const extension = logoId === '54' ? 'svg' : 'png';

  return `/CompanyLogos/${logoId}.${extension}`;
};

// Helper for hash
const deterministicHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
};

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <AnimatedHero />

      {/* 1. PLACEMENT STATS */}
      <section className={styles.statsSection}>
        <div className="container">
          <motion.div
            className={styles.statsGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <StatItem value={150} suffix="%" label="Avg Salary Hike" />
            <StatItem value={40} suffix=" LPA" label="Highest Package" />
            <StatItem value={500} suffix="+" label="Hiring Partners" />
            <StatItem value={95} suffix="%" label="Placement Rate" />
          </motion.div>
        </div>
      </section>

      {/* 2. PROGRAM ADVANTAGE */}
      <section className={styles.advantageSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <motion.h2
              className={styles.sectionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The ByteCode Advantage
            </motion.h2>
            <p className={styles.sectionSubtitle}>Why top tech companies prefer our graduates.</p>
          </div>

          <motion.div
            className={styles.advantageGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AdvantageCard
              icon={<Video />}
              title="Interactive Live Classes"
              desc="Real-time engagement with experts from world-class tech giants."
            />
            <AdvantageCard
              icon={<Target />}
              title="Personal Mentorship"
              desc="Daily guidance from MAANG developers to accelerate your growth."
            />
            <AdvantageCard
              icon={<Rocket />}
              title="Real-World Projects"
              desc="Build and ship scalable products that companies actually look for."
            />
            <AdvantageCard
              icon={<Lightbulb />}
              title="Elite Job Portal"
              desc="Exclusive access to high-paying roles from our global network."
            />
          </motion.div>
        </div>
      </section>

      {/* 3. VIBRANT CAREER TRACKS */}
      <section className={styles.pCoursesSection} id="courses">
        <div className="container">
          <div className={styles.pSectionHeader}>
            <div className={styles.pBadge}>VIBRANT CAREER TRACKS</div>
            <h2 className={styles.pSectionTitle}>Elite Specializations</h2>
          </div>

          <motion.div
            className={styles.pCourseGrid}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <CourseCard
              title="Python with Data Analytics"
              desc="Master data architecture and engineering to drive product intelligence."
              salary="12 LPA"
              icon={<Database size={24} />}
              image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80"
              tags={['Python', 'SQL', 'Pandas']}
            />
            <CourseCard
              title="Java Full Stack Mastery"
              desc="The ultimate guide to building enterprise distributed systems at scale."
              salary="14 LPA"
              icon={<Code size={24} />}
              image="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80"
              tags={['Java', 'Spring', 'React']}
            />
            <CourseCard
              title="Python Full Stack"
              desc="End-to-end modern application development with the world's fastest stack."
              salary="12 LPA"
              icon={<Layers size={24} />}
              image="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80"
              tags={['Python', 'Django', 'React']}
            />
            <CourseCard
              title="Data Science"
              desc="Unlock the power of predictive modeling and artificial intelligence."
              salary="16 LPA"
              icon={<Cpu size={24} />}
              image="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80"
              tags={['ML', 'AI', 'TensorFlow']}
            />
            <CourseCard
              title="DevOps with AWS"
              desc="Automate infrastructure and master cloud-native deployment pipelines."
              salary="18 LPA"
              icon={<Server size={24} />}
              image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
              tags={['AWS', 'Docker', 'K8s']}
            />
            <CourseCard
              title="Cyber Security"
              desc="Defend enterprise networks and master ethical hacking techniques."
              salary="15 LPA"
              icon={<ShieldCheck size={24} />}
              image="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&q=80"
              tags={['Ethical Hacking', 'NetSec', 'SOC']}
            />
          </motion.div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
            <Link href="/courses" className={styles.pSeeMoreBtn}>
              See All Courses <ArrowRight size={22} style={{ marginLeft: '10px' }} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. CAREERS ROADMAP */}
      <section className={styles.roadmapSection}>
        <div className="container">
          <div className={styles.pSectionHeader}>
            <div className={styles.pBadge}>BYTECODE INSTITUTIONAL FLOW</div>
            <h2 className={styles.pSectionTitle}>Elite Career Architecture</h2>
          </div>
          <div className={styles.roadmapContainer}>
            <div className={styles.roadmapPath}>
              <RoadmapStep num="01" phase="Diagnostic" title="Skill Assessment" desc="Custom career mapping, logic evaluation and baseline altitude check." icon={<Target size={20} />} />
              <RoadmapStep num="02" phase="Foundation" title="Scholar Phase" desc="Deep immersion into advanced CS principles and engineering research." icon={<Award size={20} />} />
              <RoadmapStep num="03" phase="Mastery" title="Tech Specialization + Core Mastery" desc="Production-grade stack development and fundamental logic optimization." icon={<Cpu size={20} />} />
              <RoadmapStep num="04" phase="Readiness" title="Interview Prep + References" desc="MAANG-level mock drills and direct elite corporate referrals." icon={<Users size={20} />} />
              <RoadmapStep num="05" phase="Outcome" title="Placement" desc="Securing high-impact roles at top-tier Global Product Companies." icon={<Rocket size={20} />} />
            </div>
          </div>
        </div>
      </section>

      {/* 5. HALL OF FAME */}
      <section className={styles.successSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Recent Placements</h2>
          </div>
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollTrack}>
              {[...SUCCESS_STORIES, ...SUCCESS_STORIES].map((s, i) => (
                <div key={i} className={styles.successCard}>
                  <div className={styles.successHeader}>
                    <img src={s.image} alt={s.name} className={styles.successImage} />
                    <div className={styles.successBadge}><TrendingUp size={12} /> {s.hike}</div>
                  </div>
                  <div className={styles.successContent}>
                    <div className={styles.nameHeader}>
                      <h4 className={styles.successName}>{s.name}</h4>
                      <div className={styles.companyLogoBadgeMini}>
                        <img
                          src={getCompanyLogo(s.company)}
                          alt={s.company}
                          style={s.company === 'Innovation Labs' ? { filter: 'brightness(0)' } : {}}
                          onError={(e: any) => e.target.style.display = 'none'}
                        />
                      </div>
                    </div>
                    <p className={styles.successRole}>{s.role} @ {s.company}</p>
                    <div className={styles.metaRow}>Package: <span>{s.package}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. STUDENT REVIEWS */}
      <section className={styles.reviewsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Student Stories</h2>
          </div>
        </div>
        <div className={styles.reviewsWrapper}>
          <div className={styles.reviewsTrack}>
            {[...REVIEWS, ...REVIEWS].map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        </div>
      </section>

      <IndustryPartners />
      <Footer />
    </main>
  );
}

function ReviewCard({ name, role, image, quote, rating }: any) {
  return (
    <motion.div className={styles.reviewCard} variants={fadeInUp}>
      <div className={styles.reviewHeader}>
        <img src={image} alt={name} className={styles.reviewAvatar} />
        <div className={styles.reviewInfo}>
          <h4>{name}</h4>
          <p>{role}</p>
        </div>
      </div>
      <div className={styles.reviewRating}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < rating ? "#f59e0b" : "none"} />
        ))}
      </div>
      <blockquote className={styles.reviewQuote}>{quote}</blockquote>
    </motion.div>
  );
}

function StatItem({ value, suffix, label }: any) {
  return (
    <motion.div className={styles.statItem} variants={fadeInUp}>
      <div className={styles.statGlow} />
      <span className={styles.statValue}><Counter value={value} suffix={suffix} /></span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
}

function AdvantageCard({ icon, title, desc }: any) {
  return (
    <motion.div className={styles.advantageCard} variants={fadeInUp} whileHover={{ y: -8 }}>
      <div className={styles.advIcon}>{icon}</div>
      <h3 className={styles.advTitle}>{title}</h3>
      <p className={styles.advDesc}>{desc}</p>
    </motion.div>
  );
}

function CourseCard({ title, desc, salary, icon, image, tags }: any) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div className={styles.advCard} variants={fadeInUp}>
      <div className={styles.advCardImage}>
        <img src={image} alt={title} />
        <div className={styles.advCardOverlay} />
        <div className={styles.advCardBadge} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#10b981', color: '#fff', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 900 }}>JOB GUARANTEED</div>
      </div>
      <div className={styles.advCardContent}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ background: '#8b5cf6', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{icon}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#10b981', fontWeight: 900, fontSize: '1.25rem' }}>₹{salary}</div>
            <div style={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 800 }}>AVG. PACKAGE</div>
          </div>
        </div>
        <h3 className={styles.advCardTitle}>{title}</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tags.map((t: string) => <span key={t} className={styles.advTag}>{t}</span>)}
        </div>
        <p className={styles.advCardDesc}>{desc}</p>
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className={styles.advBtnPrimary}><Download size={14} style={{ marginRight: '8px' }} /> Syllabus</button>
          <Link href="/courses" style={{ color: '#94a3b8', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center' }}>Explore <ChevronRight size={16} /></Link>
        </div>
      </div>
    </motion.div>
  );
}

function RoadmapStep({ num, title, desc, phase, icon }: any) {
  return (
    <motion.div
      className={styles.roadmapNode}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className={styles.nodeMarker}>
        <div className={styles.markerIcon}>{icon}</div>
        <div className={styles.markerNum}>{num}</div>
      </div>
      <div className={styles.nodeInfo}>
        <div className={styles.nodePhase}>{phase}</div>
        <h3 className={styles.nodeTitle}>{title}</h3>
        <p className={styles.nodeDesc}>{desc}</p>
      </div>
    </motion.div>
  );
}



const REVIEWS = [
  // PLACED STUDENTS FIRST (From SUCCESS_STORIES + Verified Text Reviews)
  {
    name: "bolla sahithi",
    role: "Associate Engineer @ Infosys",
    image: "https://i.pravatar.cc/150?u=sahithi",
    rating: 5,
    quote: "Joined in ByteCode Trainings 4 months back and placed successfully in Infosys as a Associate Engineer. Applying to jobs for 11 months before this!"
  },
  {
    name: "Sai Vamsheedhar Reddy",
    role: "System Engineer @ TCS",
    image: "/placements/Vamsi-K.png",
    rating: 5,
    quote: "Bytecode offers an excellent curriculum tailored to the demands of the tech industry. The faculty's expertise helped me secure a position at TCS."
  },
  {
    name: "Vamsi Thammisetti",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Vamsi-T.png",
    rating: 5,
    quote: "Exceeded my expectations! I highly recommend Bytecode to anyone looking to learn Java. Top-notch training for beginners."
  },
  {
    name: "Jagadesh",
    role: "Backend Developer @ Forsys",
    image: "/placements/Jagadesh.png",
    rating: 5,
    quote: "The program is perfectly structured for beginners. The mentors here are deeply invested in our success and support us constantly."
  },
  {
    name: "Vamsi K",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Vamsi-K.png",
    rating: 5,
    quote: "The labs and practical assignments were very helpful. I cleared the Cognizant technical rounds with ease thanks to the curriculum."
  },
  {
    name: "Rajasekhar",
    role: "Full Stack Developer @ Accenture",
    image: "/placements/Rajasekhar.png",
    rating: 5,
    quote: "Gained technical skills and the confidence to tackle complex problems at scale. The Java Full Stack course is truly industry-grade."
  },
  {
    name: "Manoj",
    role: "Associate Developer @ Absolute Labs",
    image: "/placements/Manoj.png",
    rating: 5,
    quote: "An incredible journey. The support from the placement cell was constant and very helpful throughout my graduation transition."
  },
  {
    name: "Sampath",
    role: "Systems Engineer @ Accenture",
    image: "/placements/Sampath.png",
    rating: 5,
    quote: "The career services team was instrumental in navigating the job market and cracking the interview at a top MNC like Accenture."
  },
  {
    name: "Karthik",
    role: "Software Engineer @ Accenture",
    image: "/placements/Karthik.png",
    rating: 5,
    quote: "Invaluable practical skills. I secured a job even before graduation thanks to the intense mock interview preparation."
  },
  {
    name: "Prasad",
    role: "Associate Engineer @ Gemini",
    image: "/placements/Prasad.png",
    rating: 5,
    quote: "Curriculum is up-to-date with industry standards. It's the best place for freshers to start their IT journey with confidence."
  },
  {
    name: "Ganesh",
    role: "Software Engineer @ Tech Mahindra",
    image: "/placements/Ganesh-K.png",
    rating: 5,
    quote: "The Python with Data Analytics program was a game-changer; it gave me the practical confidence I needed for my new role at Tech Mahindra."
  },
  {
    name: "Harish",
    role: "Developer @ Cloud Leaf L.L.C",
    image: "/placements/Harish-K.png",
    rating: 5,
    quote: "Intense but incredibly rewarding. The hands-on project experience here is unparalleled in terms of quality and depth."
  },
  {
    name: "Santhavana",
    role: "Software Engineer @ Cognizant",
    image: "/placements/Santhavana.png",
    rating: 5,
    quote: "The 1:1 mentorship from industry experts gave me the confidence to handle any technical round at the corporate level."
  },
  {
    name: "Phani B",
    role: "Junior Developer @ Centillion Networks",
    image: "/placements/Phani.png",
    rating: 5,
    quote: "The Java Full Stack bootcamp was challenging and thorough. It helped me secure my dream role as a software engineer."
  },
  {
    name: "Rishi",
    role: "Software Engineer @ Innovation Labs",
    image: "/placements/Rishi.png",
    rating: 5,
    quote: "Excellent training and great placement support. The real-world project simulations were very helpful in understanding production code."
  },
  {
    name: "Midhun",
    role: "Associate Developer @ Terralogic",
    image: "/placements/Midhun.png",
    rating: 5,
    quote: "Within just a month, I've seen a lot of improvements in my communication and soft skills. The 1-on-1 sessions made me job-ready."
  },
  {
    name: "marahor",
    role: "DevOps Associate @ Teachmint",
    image: "/placements/Marohar.png",
    rating: 5,
    quote: "There will be definitely a change while coming to this training and leaving. I saw massive growth in both technical and DevOps aspects."
  },
  {
    name: "Yambadi Tejaswar",
    role: "Software Engineer @ Arcitech",
    image: "/placements/Tejaswar.png",
    rating: 5,
    quote: "Classes are easy to understand, and the trainers explain everything clearly with real-time examples. Practical learning is top focus."
  },
  {
    name: "Divya",
    role: "Backend Engineer @ Nemali Software",
    image: "/placements/Divya.png",
    rating: 5,
    quote: "The real-world projects and system design drills were the key differentiator for me. Cracking the backend role was easy after this."
  },
  {
    name: "Rishwitha",
    role: "Junior Developer @ Tech Solutions",
    image: "/placements/Rishwitha Nalgonda.png",
    rating: 5,
    quote: "I highly recommend ByteCode for anyone looking to enter the IT industry. The career guidance here is truly exceptional."
  },

  // REMAINING STUDENT REVIEWS
  {
    name: "Vivek Kamera",
    role: "Data Analytics Student",
    image: "https://i.pravatar.cc/150?u=vivek",
    rating: 5,
    quote: "The trainers are highly knowledgeable and explain every concept in a very clear way. Highlight is the placement support starting from 60 days!"
  },
  {
    name: "Lakshman Madamanchi",
    role: "Data Analytics Student",
    image: "https://i.pravatar.cc/150?u=lakshman",
    rating: 5,
    quote: "Highly recommended to all confused freshers! Currently enrolled in Data Analytics and the experience has been amazing so far."
  },
  {
    name: "Archana Davuluru",
    role: "Python Data Analyst",
    image: "https://i.pravatar.cc/150?u=archana",
    rating: 5,
    quote: "Best institute for training of python with data analysis courses. Good receiving by institute faculty and friendly nature is a plus point."
  },
  {
    name: "AREPALLI SIDDHARTHA",
    role: "Transformed Graduate",
    image: "https://i.pravatar.cc/150?u=siddhartha",
    rating: 5,
    quote: "I joined Bytecode Trainings where am transforming myself. Got hands-on experience on the real time industry projects."
  },
  {
    name: "Budige Pavani",
    role: "Python Data Analytics",
    image: "https://i.pravatar.cc/150?u=pavani",
    rating: 5,
    quote: "Trainer and mentors are very friendly and everytime available for clearing our doubts. Gained a lot of knowledge in a short period."
  },
  {
    name: "Charan Teja",
    role: "Java Full Stack Developer",
    image: "https://i.pravatar.cc/150?u=charan",
    rating: 5,
    quote: "Provides a great environment for learning. The trainers are experienced and give individual attention to every student. Gained strong knowledge."
  },
  {
    name: "Jagadeswararao Vana",
    role: "Full Stack Student",
    image: "https://i.pravatar.cc/150?u=jv",
    rating: 5,
    quote: "The classes were clear and easy to understand. It's a very good place to learn coding and tech skills for freshers. Very positive experience."
  },
  {
    name: "Praneeth Reddy",
    role: "Technical Graduate",
    image: "https://i.pravatar.cc/150?u=praneeth",
    rating: 5,
    quote: "Concentrates on not only technical training but also communication and interview prep skills. Placement assistance is very helpful!"
  },
  {
    name: "Avalla Sunil",
    role: "IT Career Starter",
    image: "https://i.pravatar.cc/150?u=sunil",
    rating: 5,
    quote: "Perfect place to kickstart your IT career. Trainers explain concepts with real examples making learning super easy. Placement support is excellent."
  },
  {
    name: "Sharook khan Pathan",
    role: "Upskilled Graduate",
    image: "https://i.pravatar.cc/150?u=sharook",
    rating: 5,
    quote: "Staff is very friendly and helpful. They support students throughout the course and answer doubts clearly. Teaching style makes learning easy."
  },
  {
    name: "tharuni Uma",
    role: "Upskilling Professional",
    image: "https://i.pravatar.cc/150?u=tharuni",
    rating: 5,
    quote: "Supportive trainers and practical approach helped me understand projects. Highly recommended for anyone looking to upskill their career."
  },
  {
    name: "Yashwanth Raja",
    role: "Data Analytics Aspirant",
    image: "https://i.pravatar.cc/150?u=yashwanth",
    rating: 5,
    quote: "Best institution to land a job in data analytics. Mentors and trainers are very experienced in their field. Highly recommended!"
  }
];

const SUCCESS_STORIES = [
  { name: "Vamsi Tammisetty", role: "Software Engineer", company: "Cognizant", package: "3.5 LPA", hike: "100%", image: "/placements/Vamsi-T.png" },
  { name: "Jagadesh", role: "Backend Developer", company: "Forsys", package: "4 LPA", hike: "120%", image: "/placements/Jagadesh.png" },
  { name: "Vamsi K", role: "Software Engineer", company: "Cognizant", package: "3.5 LPA", hike: "100%", image: "/placements/Vamsi-K.png" },
  { name: "Rajasekhar", role: "Full Stack Developer", company: "Accenture", package: "5 LPA", hike: "150%", image: "/placements/Rajasekhar.png" },
  { name: "Manoj", role: "Associate Developer", company: "Absolute Labs", package: "5 LPA", hike: "150%", image: "/placements/Manoj.png" },
  { name: "Sampath", role: "Systems Engineer", company: "Accenture", package: "5 LPA", hike: "150%", image: "/placements/Sampath.png" },
  { name: "Karthik", role: "Software Engineer", company: "Accenture", package: "4 LPA", hike: "120%", image: "/placements/Karthik.png" },
  { name: "Prasad", role: "Associate Engineer", company: "Gemini", package: "3.5 LPA", hike: "100%", image: "/placements/Prasad.png" },
  { name: "Ganesh", role: "Software Engineer", company: "Tech Mahendra", package: "5 LPA", hike: "150%", image: "/placements/Ganesh-K.png" },
  { name: "Harish", role: "Developer", company: "Cloud Leaf L.L.C", package: "5 LPA", hike: "150%", image: "/placements/Harish-K.png" },
  { name: "Santhavana", role: "Software Engineer", company: "Cognizant", package: "4 LPA", hike: "120%", image: "/placements/Santhavana.png" },
  { name: "Phani B", role: "Junior Developer", company: "Centillion Networks", package: "3.5 LPA", hike: "100%", image: "/placements/Phani.png" },
  { name: "Rishi", role: "Software Engineer", company: "Innovation Labs", package: "3.5 LPA", hike: "100%", image: "/placements/Rishi.png" },
  { name: "Midhun", role: "Associate Developer", company: "Terralogic", package: "4 LPA", hike: "120%", image: "/placements/Midhun.png" },
  { name: "marahor", role: "DevOps Associate", company: "Teachmint", package: "Competitive", hike: "100%", image: "/placements/Marohar.png" },
  { name: "Tejaswar", role: "Software Engineer", company: "Arcitech", package: "Competitive", hike: "100%", image: "/placements/Tejaswar.png" },
  { name: "Divya", role: "Backend Engineer", company: "Nemali Software Solutions", package: "4 LPA", hike: "120%", image: "/placements/Divya.png" },
  { name: "Rishwitha", role: "Junior Developer", company: "Tech Solutions", package: "3.5 LPA", hike: "100%", image: "/placements/Rishwitha Nalgonda.png" }
];
