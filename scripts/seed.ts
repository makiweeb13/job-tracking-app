import { connectToDatabase } from "@/lib/db";
import "@/lib/models";
import { Board, Column, JobApplication } from "@/lib/models";

const USER_ID = "6a269e7ebec95593be523e55"; // Default seeded user: Jane Doe
const SAMPLE_JOBS = [
    {
        position: "Software Engineer",
        company: "Tech Corp Philippines",
        description: "Develop and maintain software applications.",
        jobUrl: "https://techcorp.ph/jobs/software-engineer",
        location: "Makati, Metro Manila",
        applicationDate: new Date("2023-10-01"),
        salary: 1500000,
        tags: ["JavaScript", "TypeScript", "React"],
        notes: "Excited about the opportunity!"
    },
    {
        position: "Frontend Developer",
        company: "Web Solutions PH",
        description: "Build responsive web interfaces.",
        jobUrl: "https://websolutions.ph/careers/frontend-developer",
        location: "BGC, Taguig",
        applicationDate: new Date("2023-10-01"),
        salary: 1200000,
        tags: ["JavaScript", "TypeScript", "React"],
        notes: "Looking for a challenging role!"
    },
    {
        position: "Backend Developer",
        company: "Data Systems Inc.",
        description: "Design and implement server-side logic.",
        jobUrl: "https://datasystems.ph/jobs/backend-developer",
        location: "Quezon City",
        applicationDate: new Date("2023-10-01"),
        salary: 1300000,
        tags: ["Node.js", "Express", "MongoDB"],
        notes: "Interested in working with data!"
    },
    {
        position: "Full Stack Developer",
        company: "Innovatech Solutions",
        description: "Develop full-stack web applications.",
        jobUrl: "https://innovatech.ph/jobs/full-stack-developer",
        location: "Makati, Metro Manila",
        applicationDate: new Date("2023-10-01"),
        salary: 1600000,
        tags: ["JavaScript", "TypeScript", "React", "Node.js"],
        notes: "Excited about the opportunity!"
    },
    {
        position: "DevOps Engineer",
        company: "Cloud Solutions PH",
        description: "Manage cloud infrastructure and CI/CD pipelines.",
        jobUrl: "https://cloudsolutions.ph/jobs/devops-engineer",
        location: "Cebu City",
        applicationDate: new Date("2023-10-01"),
        salary: 1500000,
        tags: ["Docker", "Kubernetes", "AWS"],
        notes: "Excited about the opportunity!"
    },
    {
        position: "Data Scientist",
        company: "Analytics Philippines",
        description: "Analyze and interpret complex data sets.",
        jobUrl: "https://analyticsph.com/careers/data-scientist",
        location: "Quezon City",
        applicationDate: new Date("2023-10-01"),
        salary: 1400000,
        tags: ["Python", "Machine Learning", "Data Analysis"],
        notes: "Looking forward to working with data!"
    },
    {
        position: "Product Manager",
        company: "Tech Innovators PH",
        description: "Lead product development and strategy.",
        jobUrl: "https://techinnovators.ph/jobs/product-manager",
        location: "BGC, Taguig",
        applicationDate: new Date("2023-10-01"),
        salary: 1800000,
        tags: ["Product Management", "Agile", "Leadership"],
        notes: "Excited about the opportunity!"
    },
    {
        position: "UX Designer",
        company: "Creative Agency Philippines",
        description: "Design user-friendly interfaces and experiences.",
        jobUrl: "https://creativeagency.ph/careers/ux-designer",
        location: "Manila",
        applicationDate: new Date("2023-10-01"),
        salary: 1000000,
        tags: ["UX Design", "Figma", "User Research"],
        notes: "Looking for a creative role!"
    },
    {
        position: "Mobile Developer",
        company: "App Makers PH",
        description: "Develop mobile applications for iOS and Android.",
        jobUrl: "https://appmakers.ph/jobs/mobile-developer",
        location: "Makati, Metro Manila",
        applicationDate: new Date("2023-10-01"),
        salary: 1300000,
        tags: ["React Native", "iOS", "Android"],
        notes: "Excited about mobile development!"
    },
    {
        position: "Cloud Architect",
        company: "Enterprise Solutions PH",
        description: "Design and implement cloud infrastructure solutions.",
        jobUrl: "https://enterprisesolutions.ph/jobs/cloud-architect",
        location: "BGC, Taguig",
        applicationDate: new Date("2023-10-02"),
        salary: 1900000,
        tags: ["AWS", "Azure", "Cloud Architecture"],
        notes: "Looking to lead cloud initiatives!"
    },
    {
        position: "QA Engineer",
        company: "Quality First PH",
        description: "Develop and execute comprehensive testing strategies.",
        jobUrl: "https://qualityfirst.ph/careers/qa-engineer",
        location: "Quezon City",
        applicationDate: new Date("2023-10-03"),
        salary: 1100000,
        tags: ["Testing", "Automation", "Selenium"],
        notes: "Passionate about quality assurance!"
    },
    {
        position: "Solutions Architect",
        company: "Tech Consultants PH",
        description: "Design technical solutions for enterprise clients.",
        jobUrl: "https://techconsultants.ph/jobs/solutions-architect",
        location: "Makati, Metro Manila",
        applicationDate: new Date("2023-10-04"),
        salary: 1700000,
        tags: ["Architecture", "Consulting", "Enterprise"],
        notes: "Interested in strategic solutions!"
    },
    {
        position: "Security Engineer",
        company: "CyberDefense Philippines",
        description: "Implement and maintain security protocols.",
        jobUrl: "https://cyberdefense.ph/jobs/security-engineer",
        location: "BGC, Taguig",
        applicationDate: new Date("2023-10-05"),
        salary: 1600000,
        tags: ["Cybersecurity", "Network Security", "Compliance"],
        notes: "Excited to protect systems!"
    },
    {
        position: "Machine Learning Engineer",
        company: "AI Innovations PH",
        description: "Develop machine learning models and algorithms.",
        jobUrl: "https://aiinnovations.ph/jobs/ml-engineer",
        location: "Quezon City",
        applicationDate: new Date("2023-10-06"),
        salary: 1800000,
        tags: ["Python", "TensorFlow", "Machine Learning"],
        notes: "Passionate about AI and ML!"
    }
];

async function seed() {
    console.log("Starting database seeding...");

    if (process.env.NODE_ENV !== "development") {
        console.error("Seeding is only allowed in development environment.");
        process.exit(1);
    }

    await connectToDatabase();

    try {
        // Find existing "Job Hunt" board
        const board = await Board.findOne({ userId: USER_ID, name: "Job Hunt" });
        if (!board) {
            console.error("Board 'Job Hunt' not found. Please create it first.");
            process.exit(1);
        }
        console.log("Found board:", board.name, "ID:", board._id);

        // Get existing columns
        const columns = await Column.find({ boardId: board._id }).sort({ order: 1 });
        if (columns.length === 0) {
            console.error("No columns found in the board. Please create columns first.");
            process.exit(1);
        }
        console.log(`Found ${columns.length} columns`);

        // Clear existing job applications for this board
        await JobApplication.deleteMany({ boardId: board._id });
        console.log("Cleared existing job applications");

        // Create job applications
        // Distribute jobs across different columns for variety
        const columnDistribution = [
            0, 0, 0, 1, 1, 2, 3, 4, 0, 1, 0, 2, 1, 0
        ]; // Distribute across columns

        for (let i = 0; i < SAMPLE_JOBS.length; i++) {
            const job = SAMPLE_JOBS[i];
            const columnIndex = Math.min(columnDistribution[i], columns.length - 1);
            const column = columns[columnIndex];

            const jobApplication = new JobApplication({
                ...job,
                columnId: column._id,
                boardId: board._id,
                order: i,
            });
            await jobApplication.save();
            
            // Add job application to column's jobApplications array
            await Column.updateOne(
                { _id: column._id },
                { $push: { jobApplications: jobApplication._id } }
            );
            
            console.log(`Job application created: ${job.position} at ${job.company}`);
        }

        console.log("\n✅ Database seeding completed successfully!");
        console.log(`Created ${SAMPLE_JOBS.length} job applications in ${columns.length} columns`);
        process.exit(0);
    } catch (error) {
        console.error("Error during seeding:", error);
        process.exit(1);
    }
}

seed();