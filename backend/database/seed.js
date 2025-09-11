
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Database file path
const dbPath = path.join(__dirname, 'chatbot.db');

// Delete existing DB file for a clean seed
if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Existing database file deleted for a clean seed.');
}

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database for seeding');
    initializeAndSeed();
  }
});

// Initialize database tables
function initializeDatabase(callback) {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      )
    `);

    // Chat sessions table
    db.run(`
      CREATE TABLE IF NOT EXISTS chat_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id TEXT UNIQUE NOT NULL,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        ended_at DATETIME,
        message_count INTEGER DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Messages table
    db.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        user_id INTEGER,
        message_type TEXT DEFAULT 'text',
        content TEXT NOT NULL,
        sender TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        metadata TEXT,
        FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

    // Analytics table
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE NOT NULL,
        total_sessions INTEGER DEFAULT 0,
        total_messages INTEGER DEFAULT 0,
        unique_users INTEGER DEFAULT 0,
        avg_session_duration REAL DEFAULT 0,
        popular_queries TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // User feedback table
    db.run(`
      CREATE TABLE IF NOT EXISTS user_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        session_id TEXT,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        feedback_text TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (session_id) REFERENCES chat_sessions (session_id)
      )
    `);

    // Courses table for CMS
    db.run(`
      CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dean TEXT,
        time TEXT,
        tuition TEXT,
        credits INTEGER,
        description TEXT,
        prerequisites TEXT
      )
    `);

    // Facilities table for CMS
    db.run(`
      CREATE TABLE IF NOT EXISTS facilities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        manager TEXT,
        location TEXT,
        hours TEXT,
        capacity TEXT,
        booking_fee TEXT,
        amenities TEXT,
        description TEXT,
        contact TEXT,
        phone TEXT,
        services TEXT,
        rules TEXT,
        requirements TEXT,
        latitude REAL,
        longitude REAL
      )
    `);

    // Staff table for CMS
    db.run(`
      CREATE TABLE IF NOT EXISTS staff (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT,
        department TEXT,
        email TEXT,
        phone TEXT,
        education TEXT,
        experience TEXT,
        specialization TEXT,
        office_hours TEXT,
        office_location TEXT,
        profile_picture TEXT,
        bio TEXT,
        achievements TEXT
      )
    `);

    // Announcements table for CMS
    db.run(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users (id)
      )
    `);

    // Knowledge Base table
    db.run(`
      CREATE TABLE IF NOT EXISTS knowledge_base (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => { // This callback runs after the LAST statement in db.serialize()
        if (err) {
            console.error('Error creating knowledge_base table', err);
            callback(err);
        } else {
            console.log('✅ All database tables initialized');
            callback(null);
        }
    });
  });
}

const schoolData = {
    courses: [
        { 
          name: "Bachelor of Science in Computer Science", 
          dean: "Engr. Violeta Monticalvo", 
          time: "MWF 10:00-11:00",
          tuition: "₱16,500 per semester",
          credits: 7,
          description: "Introduction to programming and computer science fundamentals",
          prerequisites: "None"
        },
        { 
          name: "Bachelor of Education", 
          dean: "Mr. Jonald Sia", 
          time: "TTh 2:00-3:30",
          tuition: "₱15,000 per semester",
          credits: 4,
          description: "Provides foundational knowledge and skills for aspiring educators",
          prerequisites: "None"
        },
        { 
          name: "Bachelor of hospitality Management", 
          dean: "Mr. Manuel R. Ang", 
          time: "MWF 1:00-2:00",
          tuition: "₱16,500 per semester",
          credits: 3,
          description: "Study of key hospitality management principles and practices",
          prerequisites: "None"
        },
        { 
          name: "Bachelor of Accountancy and Business Administration", 
          dean: "Zenaida O. Villamore", 
          time: "TTh 9:00-10:30",
          tuition: "₱18,000 per semester",
          credits: 4,
          description: "Study of accounting principles and business administration practices",
          prerequisites: "None"
        },
        { 
          name: "Bachelor of Science in Criminology", 
          dean: "Mondejar Cabiles Lyn", 
          time: "MW 3:00-4:30",
          tuition: "₱14,000 per semester",
          credits: 3,
          description: "Study of firearms and law",
          prerequisites: "None"
        }
      ],
      facilities: [
        { 
          name: "Dr. Miguel Peliño Library", 
          manager: "Ms. Ana Reyes - Head Librarian",
          location: "Building A, Floor 2", 
          hours: "8:00 AM - 10:00 PM",
          capacity: "200 students",
          booking_fee: "Free for students, ₱50/hour for external users",
          amenities: "Air-conditioned, WiFi, Study Rooms, Computer Stations",
          description: "A modern library with extensive collection of books, journals, and digital resources for academic research and study",
          contact: "library@osmena.edu.ph",
          phone: "(032) 123-4506",
          services: JSON.stringify(["Book Lending", "Research Assistance", "Computer Access", "Printing Services"]),
          rules: JSON.stringify(["No food or drinks inside", "Maintain silence", "Return books on time", "Show valid ID"]),
          requirements: "Valid school ID required for access",
          latitude: 12.3711,
          longitude: 123.6203
        },
        { 
          name: "Computer Laboratory", 
          manager: "Engr. Violeta Monticalvo - IT Department Head",
          location: "Building B, Floor 1", 
          hours: "9:00 AM - 9:00 PM",
          capacity: "40 computer units",
          booking_fee: "Free for enrolled students, ₱100/hour for training sessions",
          amenities: "High-speed Internet, Latest Software, Air-conditioned, CCTV Monitoring",
          description: "Fully equipped computer lab with modern hardware and software for IT and programming courses, data science projects",
          contact: "it@osmena.edu.ph",
          phone: "(032) 123-4502",
          services: JSON.stringify(["Programming Classes", "Internet Access", "Software Training", "Computer Tutorials"]),
          rules: JSON.stringify(["No personal software installation", "Save work before leaving", "Report technical issues", "Clean workstation after use"]),
          requirements: "Enrollment in Computer Science or related courses",
          latitude: 12.3713,
          longitude: 123.6201
        },
        { 
          name: "Student Cafeteria", 
          manager: "Mrs. Carmen Santos - Food Services Coordinator",
          location: "Building C, Floor 1", 
          hours: "7:00 AM - 8:00 PM",
          capacity: "150 diners",
          booking_fee: "No booking fee, pay per meal (₱80-₱150 per meal)",
          amenities: "Indoor Dining, Outdoor Seating, Air-conditioned Area, Free WiFi",
          description: "Clean and affordable dining facility serving nutritious Filipino meals, snacks, and beverages for students and staff",
          contact: "cafeteria@osmena.edu.ph",
          phone: "(032) 123-4508",
          services: JSON.stringify(["Filipino Meals", "Snacks & Beverages", "Catering Services", "Special Diet Options"]),
          rules: JSON.stringify(["Clean up after eating", "No outside food allowed", "Respect other diners", "Follow health protocols"]),
          requirements: "Open to all students, staff, and visitors",
          latitude: 12.3714,
          longitude: 123.6202
        },
        {
          name: "Science Laboratory",
          manager: "Dr. Maria Gonzales - Science Department Head",
          location: "Building B, Floor 2",
          hours: "8:00 AM - 6:00 PM",
          capacity: "30 students per session",
          booking_fee: "Free for enrolled students, ₱200/hour for external research",
          amenities: "Modern Equipment, Safety Features, Chemical Storage, Fume Hoods",
          description: "Well-equipped laboratory for chemistry, biology, and physics experiments with safety protocols and modern instruments",
          contact: "science@osmena.edu.ph",
          phone: "(032) 123-4509",
          services: JSON.stringify(["Laboratory Experiments", "Research Projects", "Equipment Rental", "Safety Training"]),
          rules: JSON.stringify(["Wear safety equipment", "Follow lab protocols", "Dispose waste properly", "Report accidents immediately"]),
          requirements: "Enrollment in Science courses and completed safety orientation",
          latitude: 12.3714,
          longitude: 123.6206
        },
        {
          name: "Gymnasium",
          manager: "Coach Roberto Martinez - Sports Director",
          location: "Building D, Ground Floor",
          hours: "6:00 AM - 10:00 PM",
          capacity: "500 people",
          booking_fee: "Free for PE classes, ₱500/hour for private events",
          amenities: "Basketball Court, Volleyball Court, Sound System, Locker Rooms, First Aid Station",
          description: "Multi-purpose gymnasium for sports activities, physical education classes, events, and assemblies with professional facilities",
          contact: "sports@osmena.edu.ph",
          phone: "(032) 123-4505",
          services: JSON.stringify(["Sports Training", "Physical Education Classes", "Event Hosting", "Equipment Rental"]),
          rules: JSON.stringify(["Wear proper sports attire", "No street shoes on court", "Clean equipment after use", "Follow safety guidelines"]),
          requirements: "Medical clearance for sports activities",
          latitude: 12.3708,
          longitude: 123.6200
        },
        {
          name: "Medical Clinic",
          manager: "Dr. Elena Vasquez - Campus Physician",
          location: "Building A, Floor 1",
          hours: "8:00 AM - 5:00 PM",
          capacity: "First Aid and Basic Medical Care",
          booking_fee: "Free basic consultation for students, ₱200 for comprehensive check-up",
          amenities: "Medical Equipment, Emergency Supplies, Consultation Room, Pharmacy",
          description: "On-campus medical facility providing basic healthcare services, first aid, and emergency response for students and staff",
          contact: "clinic@osmena.edu.ph",
          phone: "(032) 123-4507",
          services: JSON.stringify(["First Aid", "Basic Medical Consultation", "Health Records", "Emergency Response"]),
          rules: JSON.stringify(["Bring valid ID", "Report emergencies immediately", "Follow medical advice", "Maintain confidentiality"]),
          requirements: "Student ID or staff ID required for services",
          latitude: 12.3712,
          longitude: 123.6198
        }
      ],
      staff: [
        {
          name: "Miguel Luis V. Peliño",
          position: "President",
          department: "Administration",
          email: "president@osmena.edu.ph",
          phone: "(032) 123-4500",
          education: "Ph.D. in Educational Leadership, University of the Philippines",
          experience: "15+ years in educational administration",
          specialization: "Educational Leadership, Strategic Planning",
          office_hours: "Monday-Friday 8:00 AM - 5:00 PM",
          office_location: "Administration Building, 3rd Floor",
          profile_picture: "/uploads/staff/president-maria-osmena.jpg",
          bio: "Miguel Luis V. Peliño is the President of Osmeña Colleges with over 15 years of experience in educational leadership. He holds a Ph.D. in Educational Leadership and is committed to excellence in education and student development.",
          achievements: JSON.stringify(["Educational Leadership Excellence Award", "Community Service Recognition", "Strategic Planning Certification"])
        },
        {
          name: "Dr. Roberto Santos",
          position: "Vice President for Academic Affairs",
          department: "Academic Affairs",
          email: "vpacademics@osmena.edu.ph",
          phone: "(032) 123-4501",
          education: "Ph.D. in Education, Ateneo de Manila University",
          experience: "12+ years in academic administration",
          specialization: "Curriculum Development, Academic Quality Assurance",
          office_hours: "Monday-Friday 9:00 AM - 4:00 PM",
          office_location: "Academic Affairs Office, 2nd Floor",
          profile_picture: "/uploads/staff/vp-roberto-santos.jpg",
          bio: "Dr. Roberto Santos oversees all academic programs and ensures the highest standards of educational quality at Osmeña Colleges.",
          achievements: JSON.stringify(["Curriculum Innovation Award", "Academic Excellence Recognition", "Quality Assurance Certification"])
        },
        {
          name: "Engr. Violeta Monticalvo",
          position: "Dean of Computer Science",
          department: "Computer Science",
          email: "dean.cs@osmena.edu.ph",
          phone: "(032) 123-4502",
          education: "M.S. in Computer Science, University of San Carlos",
          experience: "10+ years in computer science education",
          specialization: "Software Engineering, Data Science",
          office_hours: "Monday-Wednesday-Friday 10:00 AM - 3:00 PM",
          office_location: "Computer Science Department, Building B",
          profile_picture: "/uploads/staff/dean-elena-rodriguez.jpg",
          bio: "Engr. Violeta Monticalvo leads the Computer Science department, bringing expertise in software engineering and data science to prepare students for the digital age.",
          achievements: JSON.stringify(["Innovation in Tech Education", "Software Development Excellence", "Industry Partnership Award"])
        },
        {
          name: "Zenaida O. Villamore",
          position: "Dean of Business Administration",
          department: "Business Administration",
          email: "dean.ba@osmena.edu.ph",
          phone: "(032) 123-4503",
          education: "Ph.D. in Business Administration, University of the Philippines Cebu",
          experience: "14+ years in business education and consulting",
          specialization: "Strategic Management, Entrepreneurship",
          office_hours: "Tuesday-Thursday 9:00 AM - 4:00 PM",
          office_location: "Business Administration Department, Building A",
          profile_picture: "/uploads/staff/dean-miguel-fernandez.jpg",
          bio: "Zenaida O. Villamore brings real-world business experience to the classroom, helping students develop practical skills for successful careers in business.",
          achievements: JSON.stringify(["Business Excellence Award", "Entrepreneurship Mentor Recognition", "Industry Collaboration Award"])
        },
        {
          name: "Ms. Catherine Lim",
          position: "Registrar",
          department: "Student Services",
          email: "registrar@osmena.edu.ph",
          phone: "(032) 123-4504",
          education: "M.A. in Educational Management, University of San Jose Recoletos",
          experience: "8+ years in student records management",
          specialization: "Student Records, Academic Policies",
          office_hours: "Monday-Friday 8:00 AM - 5:00 PM",
          office_location: "Registrar's Office, Ground Floor",
          profile_picture: "/uploads/staff/registrar-catherine-lim.jpg",
          bio: "Ms. Catherine Lim manages all student academic records and ensures compliance with educational policies and procedures.",
          achievements: JSON.stringify(["Records Management Excellence", "Student Service Award", "Process Improvement Recognition"])
        },
        {
          name: "Mr. James Garcia",
          position: "Director of Student Affairs",
          department: "Student Affairs",
          email: "studentaffairs@osmena.edu.ph",
          phone: "(032) 123-4505",
          education: "M.A. in Counseling Psychology, University of San Carlos",
          experience: "9+ years in student development",
          specialization: "Student Counseling, Campus Activities",
          office_hours: "Monday-Friday 9:00 AM - 5:00 PM, Counseling by appointment",
          office_location: "Student Affairs Office, 1st Floor",
          profile_picture: "/uploads/staff/director-james-garcia.jpg",
          bio: "Mr. James Garcia is dedicated to supporting student life and development through counseling services and campus activities.",
          achievements: JSON.stringify(["Student Development Excellence", "Counseling Service Award", "Campus Life Innovation"])
        },
        {
          name: "Ms. Ana Reyes",
          position: "Head Librarian",
          department: "Library Services",
          email: "library@osmena.edu.ph",
          phone: "(032) 123-4506",
          education: "M.L.I.S. Library and Information Science, University of the Philippines",
          experience: "7+ years in academic library management",
          specialization: "Digital Resources, Research Support",
          office_hours: "Monday-Friday 8:00 AM - 6:00 PM",
          office_location: "Library, Building A, 2nd Floor",
          profile_picture: "/uploads/staff/librarian-ana-reyes.jpg",
          bio: "Ms. Ana Reyes manages the college library and provides research support to students and faculty.",
          achievements: JSON.stringify(["Library Innovation Award", "Digital Resource Excellence", "Research Support Recognition"])
        },
        {
          name: "Engr. David Cruz",
          position: "Facilities Manager",
          department: "Facilities & Maintenance",
          email: "facilities@osmena.edu.ph",
          phone: "(032) 123-4507",
          education: "B.S. in Civil Engineering, University of San Carlos",
          experience: "11+ years in facilities management",
          specialization: "Campus Infrastructure, Safety Management",
          office_hours: "Monday-Friday 7:00 AM - 4:00 PM",
          office_location: "Facilities Office, Ground Floor",
          profile_picture: "/uploads/staff/manager-david-cruz.jpg",
          bio: "Engr. David Cruz ensures that all campus facilities are well-maintained and provide a safe learning environment for students and staff.",
          achievements: JSON.stringify(["Facilities Excellence Award", "Safety Management Recognition", "Infrastructure Innovation Award"])
        }
      ],
      knowledge_base: [
        {
          category: 'Enrollment',
          question: 'What are the requirements for enrollment?',
          answer: 'For new students, the requirements are: Form 138 (Report Card), Certificate of Good Moral Character, PSA Birth Certificate (photocopy), and 2x2 ID pictures. For transferees, please also include a Certificate of Transfer Credentials.'
        },
        {
            category: 'Enrollment',
            question: 'When is the enrollment period?',
            answer: 'The enrollment period for the upcoming semester is from August 1st to August 15th. Please check the school\'s official website for any updates or changes.'
        },
        {
            category: 'Events',
            question: 'Are there any upcoming events in the school?',
            answer: 'Yes! The annual Foundation Day will be held on September 25th. There will be various activities, including a parade, sports competitions, and a concert in the evening. More details will be posted on the school bulletin board and official Facebook page.'
        },
      ]
};

function seedDatabase() {
    console.log('Seeding database...');

    const courseStmt = db.prepare('INSERT INTO courses (name, dean, time, tuition, credits, description, prerequisites) VALUES (?, ?, ?, ?, ?, ?, ?)');
    for (const course of schoolData.courses) {
        courseStmt.run(course.name, course.dean, course.time, course.tuition, course.credits, course.description, course.prerequisites);
    }
    courseStmt.finalize();
    console.log('✅ Courses seeded');
    
    const facilityStmt = db.prepare('INSERT INTO facilities (name, manager, location, hours, capacity, booking_fee, amenities, description, contact, phone, services, rules, requirements, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const facility of schoolData.facilities) {
        facilityStmt.run(facility.name, facility.manager, facility.location, facility.hours, facility.capacity, facility.booking_fee, facility.amenities, facility.description, facility.contact, facility.phone, facility.services, facility.rules, facility.requirements, facility.latitude, facility.longitude);
    }
    facilityStmt.finalize();
    console.log('✅ Facilities seeded');

    const staffStmt = db.prepare('INSERT INTO staff (name, position, department, email, phone, education, experience, specialization, office_hours, office_location, profile_picture, bio, achievements) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    for (const staff of schoolData.staff) {
        staffStmt.run(staff.name, staff.position, staff.department, staff.email, staff.phone, staff.education, staff.experience, staff.specialization, staff.office_hours, staff.office_location, staff.profile_picture, staff.bio, staff.achievements);
    }
    staffStmt.finalize();
    console.log('✅ Staff seeded');

    const knowledgeStmt = db.prepare('INSERT INTO knowledge_base (category, question, answer) VALUES (?, ?, ?)');
    for (const item of schoolData.knowledge_base) {
        knowledgeStmt.run(item.category, item.question, item.answer);
    }
    knowledgeStmt.finalize();
    console.log('✅ Knowledge base seeded');
    
    console.log('Database seeding complete!');
}

async function addDefaultUsers() {
    console.log('Adding default users...');
    const users = [
        {
            username: 'admin',
            email: 'admin@osmena.edu.ph',
            password: 'admin123!',
            role: 'admin'
        },
        {
            username: 'staff',
            email: 'staff@osmena.edu.ph',
            password: 'staff123!',
            role: 'staff'
        },
        {
            username: 'student',
            email: 'student@osmena.edu.ph',
            password: 'student123!',
            role: 'student'
        }
    ];

    const saltRounds = 12;
    const userStmt = db.prepare('INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)');

    for (const user of users) {
        const passwordHash = await bcrypt.hash(user.password, saltRounds);
        userStmt.run(user.username, user.email, passwordHash, user.role);
    }
    userStmt.finalize();
    console.log('✅ Default users added');
}

function initializeAndSeed() {
    initializeDatabase(async (err) => {
        if (err) {
            console.error('Failed to initialize database', err);
        } else {
            seedDatabase();
            addDefaultUsers();
        }
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Database connection closed.');
        });
    });
}
