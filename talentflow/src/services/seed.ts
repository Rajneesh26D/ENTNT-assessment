import { faker } from '@faker-js/faker';
import { db } from './db';
import type { Candidate, TimelineEvent, Job, Assessment } from './db';

const candidateStages: Candidate['stage'][] = ['applied', 'screening', 'technical', 'offer', 'hired', 'rejected'];

const jobTitlesData = [
  'Senior Frontend Developer',
  'Backend Engineer',
  'Full Stack Developer',
  'Product Manager',
  'UX Designer',
  'UI Designer',
  'DevOps Engineer',
  'Data Scientist',
  'Mobile Developer',
  'QA Engineer',
  'Security Engineer',
  'Cloud Architect',
  'Technical Writer',
  'Scrum Master',
  'Business Analyst',
];

const tags = ['Remote', 'On-site', 'Hybrid', 'Full-time', 'Part-time', 'Contract'];
const locations = ['New York', 'San Francisco', 'Austin', 'Boston', 'Seattle', 'Remote'];
const types = ['Full-time', 'Part-time', 'Contract', 'Internship'];

// Seed Jobs FIRST
export async function seedJobs(count: number = 25) {
  try {
    const existingCount = await db.jobs.count();
    if (existingCount >= count) {
      console.log(`✅ Already have ${existingCount} jobs`);
      return;
    }

    console.log(`🌱 Seeding ${count} jobs...`);

    const jobs: Job[] = [];

    for (let i = 0; i < count; i++) {
      const title = faker.helpers.arrayElement(jobTitlesData);
      const slug = title.toLowerCase().replace(/\s+/g, '-') + `-${i + 1}`;
      const status = Math.random() > 0.3 ? 'active' : 'archived';
      const selectedTags = faker.helpers.arrayElements(tags, { min: 2, max: 4 });
      
      const job: Job = {
        id: `job-${i + 1}`,
        title,
        slug,
        status,
        tags: selectedTags,
        order: i,
        location: faker.helpers.arrayElement(locations),
        type: faker.helpers.arrayElement(types),
        description: `We are looking for a talented ${title} to join our growing team. This is an exciting opportunity to work on cutting-edge projects.`,
        requirements: [
          `${faker.number.int({ min: 2, max: 5 })}+ years of experience`,
          'Strong communication skills',
          'Team player',
          'Problem-solving abilities',
          "Bachelor's degree in related field",
        ],
        createdAt: faker.date.past({ years: 1 }).toISOString(),
      };

      jobs.push(job);
    }

    await db.jobs.bulkAdd(jobs);
    console.log(`✅ Seeded ${count} jobs successfully`);
  } catch (error) {
    console.error('❌ Error seeding jobs:', error);
  }
}

// Seed Candidates
export async function seedCandidates(count: number = 1000) {
  try {
    const existingCount = await db.candidates.count();
    if (existingCount >= count) {
      console.log(`✅ Already have ${existingCount} candidates`);
      return;
    }

    console.log(`🌱 Seeding ${count} candidates...`);

    const candidates: Candidate[] = [];
    const timeline: TimelineEvent[] = [];

    for (let i = 0; i < count; i++) {
      const stage = faker.helpers.arrayElement(candidateStages);
      const jobTitle = faker.helpers.arrayElement(jobTitlesData);
      const appliedDate = faker.date.past({ years: 1 });
      
      const candidate: Candidate = {
        id: `cand-${i + 1}`,
        name: faker.person.fullName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        stage,
        jobId: `job-${faker.number.int({ min: 1, max: 25 })}`,
        jobTitle,
        appliedDate: appliedDate.toISOString(),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
        notes: [],
      };

      candidates.push(candidate);

      timeline.push({
        id: `timeline-${i + 1}-1`,
        candidateId: candidate.id,
        stage: 'applied',
        timestamp: appliedDate.toISOString(),
        notes: 'Application submitted',
        changedBy: 'System',
      });
    }

    await db.candidates.bulkAdd(candidates);
    await db.timeline.bulkAdd(timeline);
    
    console.log(`✅ Seeded ${count} candidates`);
  } catch (error) {
    console.error('❌ Error seeding candidates:', error);
  }
}

// Seed Everything
export async function seedDatabase() {
  // IMPORTANT: Seed jobs FIRST, then candidates
  await seedJobs(25);
  await seedCandidates(1000);
  // --- ADDED: seed assessments ---
  await seedAssessments();
  console.log('🎉 Database fully seeded!');
}

// --- ADDED FUNCTION: seedAssessments ---
export async function seedAssessments() {
  try {
    const existingCount = await db.assessments.count();
    if (existingCount > 0) {
      console.log(`✅ Already have ${existingCount} assessments`);
      return;
    }

    console.log('🌱 Seeding assessments...');

    const assessments: Assessment[] = [
      {
        jobId: 'job-1',
        jobTitle: 'Senior Frontend Developer',
        sections: [
          {
            id: 'sec-1',
            title: 'Technical Skills',
            description: 'Questions about your technical expertise',
            questions: [
              {
                id: 'q1',
                type: 'single-choice',
                question: 'How many years of React experience do you have?',
                options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
                required: true,
              },
              {
                id: 'q2',
                type: 'multi-choice',
                question: 'Which frontend frameworks are you proficient in?',
                options: ['React', 'Vue', 'Angular', 'Svelte'],
                required: true,
              },
            ],
          },
          {
            id: 'sec-2',
            title: 'Coding Challenge',
            questions: [
              {
                id: 'q3',
                type: 'long-text',
                question: 'Explain how you would optimize a React application for performance',
                required: true,
                maxLength: 1000,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        jobId: 'job-2',
        jobTitle: 'Backend Engineer',
        sections: [
          {
            id: 'sec-1',
            title: 'Technical Assessment',
            questions: [
              {
                id: 'q1',
                type: 'single-choice',
                question: 'What is your preferred backend language?',
                options: ['Python', 'Node.js', 'Java', 'Go'],
                required: true,
              },
              {
                id: 'q2',
                type: 'numeric',
                question: 'How many years of backend development experience?',
                required: true,
                min: 0,
                max: 20,
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    await db.assessments.bulkAdd(assessments);
    console.log(`✅ Seeded ${assessments.length} assessments`);
  } catch (error) {
    console.error('❌ Error seeding assessments:', error);
  }
}
