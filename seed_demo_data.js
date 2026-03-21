
const axios = require('axios');

const API_BASE = 'http://localhost:8084/api/placements';
const USER_API = 'http://localhost:8082/api/users';

const placements = [
    {
        studentName: "Arjun Sharma",
        studentEmail: "arjun.sharma@gmail.com",
        companyName: "Google",
        packageLPA: 42.5,
        role: "SDE II",
        placementDate: "2024-02-01",
        quote: "Bytecode Trainings gave me the edge I needed for Google's interview!",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
    },
    {
        studentName: "Priya Patel",
        studentEmail: "priya.patel@outlook.com",
        companyName: "Microsoft",
        packageLPA: 38.0,
        role: "Full Stack Engineer",
        placementDate: "2024-01-15",
        quote: "The hands-on projects were instrumental in landing my role at Microsoft.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
        studentName: "Rahul Verma",
        studentEmail: "rahul.v@yahoo.com",
        companyName: "Amazon",
        packageLPA: 32.0,
        role: "SDE I",
        placementDate: "2024-02-10",
        quote: "Data Structures and Algorithms course at Bytecode is second to none.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
        studentName: "Sneha Reddy",
        studentEmail: "sneha.reddy@gmail.com",
        companyName: "Meta",
        packageLPA: 45.0,
        role: "Machine Learning Engineer",
        placementDate: "2024-02-12",
        quote: "Bytecode's ML module is truly world-class. Highly recommended!",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
        studentName: "Ananya Iyer",
        studentEmail: "ananya.i@gmail.com",
        companyName: "Netflix",
        packageLPA: 40.0,
        role: "Frontend Specialist",
        placementDate: "2024-01-20",
        quote: "The focus on React and modern CSS helped me stand out in the Netflix interviews.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    }
];

const candidates = [
    {
        fullName: "Ishaan Gupta",
        email: "ishaan.g@gmail.com",
        branch: "Computer Science",
        role: "STUDENT",
        phoneNumber: "+91 9876543210",
        password: "password123",
        active: true
    },
    {
        fullName: "Meera Das",
        email: "meera.das@gmail.com",
        branch: "Information Technology",
        role: "STUDENT",
        phoneNumber: "+91 8765432109",
        password: "password123",
        active: true
    },
    {
        fullName: "Kunal Singh",
        email: "kunal.s@gmail.com",
        branch: "Data Science",
        role: "STUDENT",
        phoneNumber: "+91 7654321098",
        password: "password123",
        active: true
    }
];

async function seed() {
    console.log("Starting data seeding...");

    // Add placed students as users first
    for (const p of placements) {
        const studentUser = {
            fullName: p.studentName,
            email: p.studentEmail,
            branch: "Alumni",
            role: "STUDENT",
            phoneNumber: "+91 9000000000",
            password: "password123",
            profileImage: p.image,
            active: true
        };
        try {
            await axios.post(USER_API, studentUser);
            console.log(`Added user for placed student: ${p.studentName}`);
        } catch (e) {
            console.error(`Failed to add user for placed student: ${p.studentName}`, e.message || e);
        }
    }

    for (const p of placements) {
        try {
            await axios.post(`${API_BASE}/records`, p);
            console.log(`Added placement: ${p.studentName} at ${p.companyName}`);
        } catch (e) {
            console.error(`Failed to add placement: ${p.studentName}`, e.message);
        }
    }

    for (const c of candidates) {
        try {
            await axios.post(USER_API, c);
            console.log(`Added candidate: ${c.fullName}`);
        } catch (e) {
            console.error(`Failed to add candidate: ${c.fullName}`, e.message);
        }
    }

    console.log("Seeding completed!");
}

seed();
