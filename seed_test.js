const mongoose = require('mongoose');

require('dotenv').config({ path: './lms-node-backend/.env' });

async function generateQuestions(prompt, count, formats) {
    const res = await fetch('http://localhost:8080/api/academic/tests/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, courseName: "Full Stack Development", count, formats })
    });
    if (!res.ok) {
        throw new Error(`AI generation failed: ${res.statusText}`);
    }
    return res.json();
}

async function createComprehensiveTest() {
    try {
        console.log("Generating 10 MCQs...");
        const mcqs = await generateQuestions("Advanced JavaScript, React Fundamentals, Node.js Basics", 10, ['MCQ']);
        
        console.log("Generating 10 Coding Questions...");
        const coding = await generateQuestions("Data Structures, Algorithms, REST API implementation", 10, ['CODING']);
        
        console.log("Generating 10 Theory/Video Questions...");
        const theory = await generateQuestions("System Design, Microservices, Authentication Strategies", 10, ['THEORY']);

        const allQuestions = [...mcqs, ...coding, ...theory];
        console.log(`Successfully generated ${allQuestions.length} questions.`);

        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.useDb('course-db');

        const testData = {
            title: 'Comprehensive Master Test (30 Questions)',
            name: 'Comprehensive Master Test (30 Questions)',
            description: 'A complete assessment covering MCQs, Coding, and Theory concepts across Full Stack Development.',
            difficulty: 'ADVANCED',
            tags: ['FullStack', 'Master', 'Comprehensive'],
            courseId: '',
            courseName: 'Full Stack Development',
            batchId: '',
            batchName: '',
            type: 'MIXED',
            questions: allQuestions,
            proctoring: {
                screenLock: true,
                tabTracking: true,
                faceDetection: true,
                noiseDetection: false
            },
            evaluation: {
                negativeMarking: false,
                markingValue: 10,
                passPercentage: 70,
                allowReview: true
            },
            assignment: {
                mode: 'ALL', 
                studentIds: []
            },
            status: 'PUBLISHED',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('tests').insertOne(testData);
        console.log(`Test created successfully with ID: ${result.insertedId}`);
        process.exit(0);
    } catch (err) {
        console.error("Error creating test:", err);
        process.exit(1);
    }
}

createComprehensiveTest();
