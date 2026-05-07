const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ATLAS_URI = 'mongodb+srv://BytecodeTrainings:Bytecode%401354@bytecodetrainings.4nosy2u.mongodb.net/?retryWrites=true&w=majority&appName=BytecodeTrainings';

async function seed() {
    try {
        console.log('Connecting to Atlas databases...');
        const userConn = await mongoose.createConnection(`${ATLAS_URI}&dbName=user-db`).asPromise();
        const courseConn = await mongoose.createConnection(`${ATLAS_URI}&dbName=course-db`).asPromise();
        const academicConn = await mongoose.createConnection(`${ATLAS_URI}&dbName=academic-db`).asPromise();

        const User = userConn.model('User', new mongoose.Schema({
            email: { type: String, required: true, unique: true },
            fullName: { type: String, required: true },
            password: { type: String, required: true },
            phoneNumber: String,
            role: String,
            batchId: String,
            batchCode: String,
            batchName: String,
            courseId: String,
            courseName: String,
            active: { type: Boolean, default: true },
            createdAt: { type: Date, default: Date.now }
        }));

        const BatchCourse = courseConn.collection('batches');
        const BatchAcademic = academicConn.collection('batches');

        const courseId = "698db43bf8b8e70584e87846";
        const courseName = "Python With Data Analytics";

        console.log('Ensuring Batches exist in Atlas...');
        // Batch 86 already exists as per my check
        let batch86 = await BatchCourse.findOne({ batchName: 'PDA-86' });
        if (!batch86) {
             console.log('Creating PDA-86 in course-db...');
             const result = await BatchCourse.insertOne({ 
                 batchCode: 'BATCH-698D-1', 
                 batchName: 'PDA-86', 
                 courseId, 
                 courseName, 
                 status: 'ONGOING',
                 createdAt: new Date() 
             });
             batch86 = { _id: result.insertedId, batchCode: 'BATCH-698D-1', batchName: 'PDA-86' };
        }

        // Batch 88 needs to be created
        let batch88 = await BatchCourse.findOne({ batchName: 'PDA-88' });
        if (!batch88) {
             console.log('Creating PDA-88 in course-db...');
             const result = await BatchCourse.insertOne({ 
                 batchCode: 'BATCH-88', 
                 batchName: 'PDA-88', 
                 courseId, 
                 courseName, 
                 status: 'ONGOING',
                 createdAt: new Date() 
             });
             batch88 = { _id: result.insertedId, batchCode: 'BATCH-88', batchName: 'PDA-88' };
             
             // Also create in academic-db for consistency
             await BatchAcademic.insertOne({
                 batchCode: 'BATCH-88',
                 batchName: 'PDA-88',
                 courseId,
                 courseName,
                 status: 'ONGOING',
                 createdAt: new Date()
             });
        }

        const staffData = [
            { fullName: 'T Bhuvan Chandra', phoneNumber: '7416714011', email: 'sunny.bytecodetrainings@gmail.com', password: 'Bytecode@123', role: 'SOCIAL_MEDIA' },
            { fullName: 'Priyanka Munganda', phoneNumber: '7702217677', email: 'priynkamunganda@gmail.com', password: 'Bytecode@123', role: 'TRAINER' },
            { fullName: 'Anu Deepika Santhoshi K', phoneNumber: '7842915917', email: 'anu.bytecodetrainings@gmail.com', password: 'Bytecode@123', role: 'COUNSELOR' },
            { fullName: 'Srilekha', phoneNumber: '8125929307', email: 'srilekha.bytecdetrainings@gmail.com', password: 'Bytecode@123', role: 'COUNSELOR' },
            { fullName: 'B Indraja', phoneNumber: '9133966387', email: 'indu.bytecodetrainings@gmail.com', password: 'Bytecode@123', role: 'COUNSELOR' },
            { fullName: 'Ram Raj', phoneNumber: '9848741563', email: 'ramraj.bytecodetrainings@gmail.com', password: 'Bytecode@123', role: 'SOCIAL_MEDIA' },
            { fullName: 'Lakavath Dillip', phoneNumber: '8688288352', email: 'lakvthdilip12@gmail.com', password: 'Bytecode@123', role: 'EMPLOYEE' }
        ];

        const studentData86 = [
            { fullName: 'M B Srinidhi', phoneNumber: '9381184011', email: 'mbsrinidhi0@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Moluguri Sai Harshitha', phoneNumber: '8074914632', email: 'saiharshithamoluguri12@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Are Sushmitha', phoneNumber: '7386986280', email: 'aresushmitha@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Bajjuri Uma Maheswara Rao', phoneNumber: '7036373091', email: 'bajjuriuma@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Kouda Vikas', phoneNumber: '9949975273', email: 'koudavikas4@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Silagani Rupesh', phoneNumber: '7416756273', email: 'rupeshsilagani@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Silagani Rohith', phoneNumber: '7416756273', email: 'rohithsilagani@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Thatipally kavya', phoneNumber: '9652443653', email: 'kavyathatipally528@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Yeleti Vaishnavi', phoneNumber: '9014562076', email: 'yeletivaishnavi11@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Safavath Maha Lakshmi Bai', phoneNumber: '9703099712', email: 'mahaas1734@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Gasi Sindhuja', phoneNumber: '9398474213', email: 'gasisindhuja@gmail.com', password: 'Bytecode@123' },
            { fullName: 'G.Prudvi Raj', phoneNumber: '9014779182', email: 'prudhviguba@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Kallepu akshaya', phoneNumber: '7995180539', email: 'kallepuakshaya@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Mouyajupelli', phoneNumber: '9030950138', email: 'mouyajupelli@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Srikanth', phoneNumber: '8367368429', email: 'bodkesrikanth1@gmail.com', password: 'Bytecode@123' }
        ];

        const studentData88 = [
            { fullName: 'GUNDREDDY PAVAN KUMAR', phoneNumber: '6309923200', email: 'pavangundreddy2540@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Udayagiri Manohar', phoneNumber: '6301124732', email: 'udayagirimanohar0@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Harikrishna', phoneNumber: '8897943875', email: 'harikrishnayanamalamanda7809@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Saiganesh bhukya', phoneNumber: '8897879453', email: 'saiganeshbhukya88@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Thotakura Charu Saranya', phoneNumber: '9949573074', email: 'charusaranyathotakura@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Indu Varshini Surisetty', phoneNumber: '8885970820', email: 'induvarshinisurisetty@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Hanumanthu Uday Kiran', phoneNumber: '9121639013', email: 'hanumanthuudaykiran30@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Sabbavarapu Usha', phoneNumber: '9652248949', email: 'ushasabbavarapu123@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Likitha', phoneNumber: '7780362759', email: 'likhithavanjarani121@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Pavitra vavilapalli', phoneNumber: '6304646506', email: 'pavithravavilapalli08@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Vakad Vennela', phoneNumber: '9030617958', email: 'prasannavakada2005@gmail.com', password: 'Bytecode@123' },
            { fullName: 'kunuku vasantha', phoneNumber: '9177245341', email: 'vassukunuku@gmail.com', password: 'Bytecode@123' },
            { fullName: 'G. Vamsi Priya', phoneNumber: '9121283259', email: 'vamsi14priya@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Jillala Ganesh', phoneNumber: '9121091371', email: 'ganeshjillala913@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Pamireddy Karunakar Reddy', phoneNumber: '9392855177', email: 'karunakarreddyp257@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Velamala Roja', phoneNumber: '6281623268', email: 'velamalaroja60@gmail.com', password: 'Bytecode@123' },
            { fullName: 'Kondapalli Devika', phoneNumber: '8688906651', email: 'kondapallidevika996@gmail.com', password: 'Bytecode@123' }
        ];

        console.log('Processing Staff in Atlas...');
        for (const user of staffData) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`Staff ${user.email} already exists in Atlas. Skipping.`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({ ...user, password: hashedPassword });
            console.log(`Created Staff: ${user.fullName}`);
        }

        console.log('Processing Students (Batch 86) in Atlas...');
        for (const user of studentData86) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`Student ${user.email} already exists in Atlas. Skipping.`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({ 
                ...user, 
                password: hashedPassword, 
                role: 'STUDENT',
                batchId: batch86._id.toString(),
                batchCode: batch86.batchCode,
                batchName: batch86.batchName,
                courseId,
                courseName
            });
            console.log(`Created Student (86): ${user.fullName}`);
        }

        console.log('Processing Students (Batch 88) in Atlas...');
        for (const user of studentData88) {
            const exists = await User.findOne({ email: user.email });
            if (exists) {
                console.log(`Student ${user.email} already exists in Atlas. Skipping.`);
                continue;
            }
            const hashedPassword = await bcrypt.hash(user.password, 10);
            await User.create({ 
                ...user, 
                password: hashedPassword, 
                role: 'STUDENT',
                batchId: batch88._id.toString(),
                batchCode: batch88.batchCode,
                batchName: batch88.batchName,
                courseId,
                courseName
            });
            console.log(`Created Student (88): ${user.fullName}`);
        }

        console.log('Atlas Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Atlas Seeding failed:', err);
        process.exit(1);
    }
}

seed();
