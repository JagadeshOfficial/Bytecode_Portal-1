package com.bytecode.placement.config;

import com.bytecode.placement.model.PlacementRecord;
import com.bytecode.placement.repository.PlacementRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class PlacementDataSeeder implements CommandLineRunner {

    private final PlacementRecordRepository repository;
    private final com.bytecode.placement.repository.JobRepository jobRepository;

    @Override
    public void run(String... args) throws Exception {
        if (repository.count() == 0) {
            System.out.println("Seeding Placement Records...");
            List<PlacementRecord> records = List.of(
                createRecord("Vamsi Tammisetty", "Software Engineer", "Cognizant", 3.5, "Fresher", "/placements/Vamsi-T.png", "The foundation built here helped me crack my first tech role.", 100.0),
                createRecord("Sai Kumar", "Systems Engineer", "TCS", 3.36, "Fresher", "https://ui-avatars.com/api/?name=Sai+Kumar&background=random", "ByteCode helped me start my career with a strong foundation.", 100.0),
                createRecord("Jagadesh", "Backend Developer", "Forsys", 4.0, "Fresher", "/placements/Jagadesh.png", "Practical projects gave me the edge during technical rounds.", 120.0),
                createRecord("Venkatesh Y.", "Systems Engineer", "Infosys", 3.6, "Fresher", "https://ui-avatars.com/api/?name=Venkatesh+Y&background=random", "The structured curriculum helped me crack the interview easily.", 130.0),
                createRecord("Vamsi K", "Software Engineer", "Cognizant", 3.5, "Fresher", "/placements/Vamsi-K.png", "Step-by-step guidance made my transition into tech very smooth.", 100.0),
                createRecord("Lakshmi Prasanna", "Project Engineer", "Wipro", 3.5, "Fresher", "https://ui-avatars.com/api/?name=Lakshmi+Prasanna&background=random", "I am very happy with the placement support and guidance.", 110.0),
                createRecord("Rajasekhar", "Full Stack Developer", "Accenture", 5.0, "Fresher", "/placements/Rajasekhar.png", "Direct mentorship from industry experts is invaluable.", 150.0),
                createRecord("Srinivas Rao", "Software Engineer", "HCLTech", 4.25, "Fresher", "https://ui-avatars.com/api/?name=Srinivas+Rao&background=random", "Good curriculum and mentors really made a difference.", 140.0),
                createRecord("Manoj", "Associate Developer", "Absolute Labs", 5.0, "Fresher", "/placements/Manoj.png", "The platform's recursive training approach is truly unique.", 150.0),
                createRecord("Ravi Teja", "Associate Software Engineer", "Tech Mahindra", 3.25, "Fresher", "https://ui-avatars.com/api/?name=Ravi+Teja&background=random", "Got placed within 3 months of joining the course.", 115.0),
                createRecord("Sampath", "Systems Engineer", "Accenture", 5.0, "Fresher", "/placements/Sampath.png", "Focusing on core fundamentals was the key to my success.", 150.0),
                createRecord("Anusha Reddy", "App Development Assoc", "Accenture", 4.5, "Fresher", "https://ui-avatars.com/api/?name=Anusha+Reddy&background=random", "Mock interviews were very helpful in boosting my confidence.", 150.0),
                createRecord("Karthik", "Software Engineer", "Accenture", 4.0, "Fresher", "/placements/Karthik.png", "Mock interviews prepared me for exactly what to expect.", 120.0),
                createRecord("Sai Krishna", "Programmer Analyst", "Cognizant", 4.0, "Fresher", "https://ui-avatars.com/api/?name=Sai+Krishna&background=random", "The real-world projects gave me a lot of confidence.", 125.0),
                createRecord("Prasad", "Associate Engineer", "Gemini", 3.5, "Fresher", "/placements/Prasad.png", "A great place for freshers to start their software journey.", 100.0),
                createRecord("Bhanu Prakash", "Analyst", "Capgemini", 4.0, "Fresher", "https://ui-avatars.com/api/?name=Bhanu+Prakash&background=random", "Thanks to the entire ByteCode team for this opportunity.", 125.0),
                createRecord("Ganesh", "Software Engineer", "Tech Mahendra", 5.0, "Fresher", "/placements/Ganesh-K.png", "Curriculum is perfectly aligned with what the industry needs.", 150.0),
                createRecord("Nagarjuna K.", "Graduate Trainee", "LTIMindtree", 5.0, "Fresher", "https://ui-avatars.com/api/?name=Nagarjuna+K&background=random", "Excellent teaching and career support.", 160.0),
                createRecord("Harish", "Developer", "Cloud Leaf L.L.C", 5.0, "Fresher", "/placements/Harish-K.png", "The hands-on assignments helped me understand complex concepts.", 150.0),
                createRecord("Haritha G.", "Associate Professional", "DXC Technology", 4.2, "Fresher", "https://ui-avatars.com/api/?name=Haritha+G&background=random", "Very supportive faculty and detailed coursework.", 135.0),
                createRecord("Santhavana", "Software Engineer", "Cognizant", 4.0, "Fresher", "/placements/Santhavana.png", "I constant support from recruiters made a huge difference.", 120.0),
                createRecord("Shiva Kumar", "Software Engineer Trainee", "Hexaware", 6.0, "Fresher", "https://ui-avatars.com/api/?name=Shiva+Kumar&background=random", "I learned a lot here and it paid off.", 180.0),
                createRecord("Phani B", "Junior Developer", "Centillion Networks", 3.5, "Fresher", "/placements/Phani.png", "The real-world project simulations were very helpful.", 100.0),
                createRecord("Vamsi Krishna", "Associate Engineer", "Virtusa", 5.5, "Fresher", "https://ui-avatars.com/api/?name=Vamsi+Krishna&background=random", "Good environment to learn and grow.", 170.0),
                createRecord("Rishi", "Software Engineer", "Innovation Labs", 3.5, "Fresher", "/placements/Rishi.png", "Excellent training and great placement support.", 100.0),
                createRecord("Swathi M.", "Engineer", "Tata Elxsi", 7.0, "Fresher", "https://ui-avatars.com/api/?name=Swathi+M&background=random", "My dream job came true thanks to the team.", 200.0),
                createRecord("Midhun", "Associate Developer", "Terralogic", 4.0, "Fresher", "/placements/Midhun.png", "I am grateful for the mentorship I received here.", 120.0),
                createRecord("Naresh Babu", "Software Developer", "Happiest Minds", 6.5, "Fresher", "https://ui-avatars.com/api/?name=Naresh+Babu&background=random", "Very professional training and placement process.", 190.0),
                createRecord("marahor", "DevOps Associate", "Teachmint", 4.5, "Fresher", "/placements/Marohar.png", "Transitioning to DevOps was made easy by ByteCode.", 100.0),
                createRecord("Sravani P.", "Trainee Software Eng", "Mphasis", 4.0, "Fresher", "https://ui-avatars.com/api/?name=Sravani+P&background=random", "Placement team is very good and helpful.", 125.0),
                createRecord("Tejaswar", "Software Engineer", "Arcitech", 4.5, "Fresher", "/placements/Tejaswar.png", "The technical depth covered in the course is impressive.", 100.0),
                createRecord("Karthik Goud", "Software Engineer", "Cyient", 3.8, "Fresher", "https://ui-avatars.com/api/?name=Karthik+Goud&background=random", "I improved my coding skills significantly.", 118.0),
                createRecord("Divya", "Backend Engineer", "Nemali Software Solutions", 4.0, "Fresher", "/placements/Divya.png", "The focus on clean code and architecture was a game changer.", 120.0),
                createRecord("Manasa V.", "Junior Engineer", "Zensar", 4.5, "Fresher", "https://ui-avatars.com/api/?name=Manasa+V&background=random", "A truly transformational learning journey.", 150.0),
                createRecord("Rishwitha", "Junior Developer", "Tech Solutions", 3.5, "Fresher", "/placements/Rishwitha Nalgonda.png", "Highly recommend for anyone looking to enter the IT industry.", 100.0),
                createRecord("Pavan Kalyan", "Technical Associate", "Sonata Software", 4.0, "Fresher", "https://ui-avatars.com/api/?name=Pavan+Kalyan&background=random", "Highly recommended platform for freshers.", 130.0),
                createRecord("Gopi Chand", "Software Engineer", "ValueLabs", 5.5, "Fresher", "https://ui-avatars.com/api/?name=Gopi+Chand&background=random", "Everything was perfect, from training to placement.", 175.0),
                createRecord("Renuka Devi", "Associate Consultant", "Kellton", 3.5, "Fresher", "https://ui-avatars.com/api/?name=Renuka+Devi&background=random", "Thank you to the team for all the support.", 110.0)
            );
            repository.saveAll(records);
            System.out.println("Seeded " + records.size() + " placement records.");
        }

        if (jobRepository.count() == 0) {
            System.out.println("Seeding Job Listings...");
            List<com.bytecode.placement.model.JobListing> jobs = List.of(
                createJob("Google", "SDE I & II", "Bangalore", 18.0, "B.Tech/M.Tech", new Date(), List.of("Java", "DSA", "System Design"), true),
                createJob("Amazon", "Cloud Support Engineer", "Hyderabad", 12.0, "Any Graduate", new Date(), List.of("AWS", "Linux", "Networking"), true),
                createJob("TCS", "System Engineer", "Mumbai", 7.0, "B.Tech", new Date(), List.of("Java", "SQL", "Communication"), true),
                createJob("Infosys", "Specialist Programmer", "Pune", 9.5, "B.Tech/M.Tech", new Date(), List.of("Python", "Django", "React"), true),
                createJob("Microsoft", "Software Engineer", "Noida", 22.0, "B.Tech/M.Tech", new Date(), List.of("C#", ".NET", "Azure"), true),
                createJob("Accenture", "App Development Associate", "Gurgaon", 4.5, "Any Graduate", new Date(), List.of("Java", "Spring Boot"), true)
            );
            jobRepository.saveAll(jobs);
            System.out.println("Seeded " + jobs.size() + " job listings.");
        }
    }

    private PlacementRecord createRecord(String name, String role, String company, Double pkg, String prev, String img, String quote, Double hike) {
        return PlacementRecord.builder()
            .studentName(name)
            .role(role)
            .companyName(company)
            .packageLPA(pkg)
            .prevRole(prev)
            .image(img)
            .quote(quote)
            .hike(hike)
            .placementDate(new Date())
            .build();
    }

    private com.bytecode.placement.model.JobListing createJob(String company, String title, String location, Double salary, String eligibility, Date date, List<String> skills, boolean active) {
        return com.bytecode.placement.model.JobListing.builder()
            .companyName(company)
            .jobTitle(title)
            .location(location)
            .salaryPackage(salary)
            .eligibility(eligibility)
            .driveDate(date)
            .skillsRequired(skills)
            .active(active)
            .build();
    }
}

