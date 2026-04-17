import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import SwapRequest from './models/SwapRequest.js';

dotenv.config({ path: './config.env' });

const DEMO_PREFIX = 'demo.skill.swap+';
const DEFAULT_PASSWORD = 'demo1234';

const demoProfiles = [
  {
    name: 'Aarav Sharma',
    email: `${DEMO_PREFIX}aarav@gmail.com`,
    location: 'Bengaluru',
    availability: 'Weekends',
    skillsOffered: ['React', 'JavaScript', 'Tailwind CSS'],
    skillsWanted: ['Public Speaking', 'Docker']
  },
  {
    name: 'Meera Iyer',
    email: `${DEMO_PREFIX}meera@gmail.com`,
    location: 'Pune',
    availability: 'Weekday evenings',
    skillsOffered: ['UI Design', 'Figma', 'Design Systems'],
    skillsWanted: ['Node.js', 'MongoDB']
  },
  {
    name: 'Kabir Verma',
    email: `${DEMO_PREFIX}kabir@gmail.com`,
    location: 'Delhi',
    availability: 'Flexible',
    skillsOffered: ['Python', 'Data Analysis', 'Pandas'],
    skillsWanted: ['React', 'Frontend Architecture']
  },
  {
    name: 'Nisha Patel',
    email: `${DEMO_PREFIX}nisha@gmail.com`,
    location: 'Ahmedabad',
    availability: 'Mornings',
    skillsOffered: ['Content Writing', 'SEO', 'Copywriting'],
    skillsWanted: ['Canva', 'Video Editing']
  },
  {
    name: 'Rohan Singh',
    email: `${DEMO_PREFIX}rohan@gmail.com`,
    location: 'Hyderabad',
    availability: 'After 7 PM',
    skillsOffered: ['Node.js', 'Express', 'REST APIs'],
    skillsWanted: ['System Design', 'Kubernetes']
  },
  {
    name: 'Priya Nair',
    email: `${DEMO_PREFIX}priya@gmail.com`,
    location: 'Kochi',
    availability: 'Weekends',
    skillsOffered: ['Digital Marketing', 'Meta Ads', 'Analytics'],
    skillsWanted: ['SQL', 'Power BI']
  },
  {
    name: 'Dev Malhotra',
    email: `${DEMO_PREFIX}dev@gmail.com`,
    location: 'Chandigarh',
    availability: 'Late evenings',
    skillsOffered: ['Docker', 'CI/CD', 'GitHub Actions'],
    skillsWanted: ['TypeScript', 'Testing']
  },
  {
    name: 'Sara Khan',
    email: `${DEMO_PREFIX}sara@gmail.com`,
    location: 'Mumbai',
    availability: 'Saturday',
    skillsOffered: ['Public Speaking', 'Interview Prep', 'Communication'],
    skillsWanted: ['React', 'Backend APIs']
  }
];

const extraSkillsForTarget = {
  offered: ['Communication', 'Team Collaboration', 'Problem Solving', 'Basic JavaScript'],
  wanted: ['React', 'Node.js', 'UI/UX Design', 'MongoDB', 'Public Speaking']
};

const mergeUnique = (existing = [], incoming = []) => {
  return [...new Set([...(existing || []), ...(incoming || [])])];
};

const getTargetUser = async () => {
  const targetEmail = process.env.TARGET_EMAIL?.trim().toLowerCase();

  if (targetEmail) {
    const user = await User.findOne({ email: targetEmail });
    if (!user) {
      throw new Error(`No user found for TARGET_EMAIL=${targetEmail}`);
    }
    return user;
  }

  // Pick latest non-admin user that is not one of the seeded demo users.
  const user = await User.findOne({
    isAdmin: false,
    email: { $not: new RegExp(`^${DEMO_PREFIX.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`) }
  }).sort({ createdAt: -1 });

  if (!user) {
    throw new Error('No target user found. Create/login your account once, then rerun this script.');
  }

  return user;
};

const upsertDemoUsers = async () => {
  const users = [];

  for (const profile of demoProfiles) {
    let user = await User.findOne({ email: profile.email });

    if (!user) {
      user = new User({
        ...profile,
        password: DEFAULT_PASSWORD,
        isPublic: true,
        isAdmin: false,
        isBanned: false
      });
    } else {
      user.name = profile.name;
      user.location = profile.location;
      user.availability = profile.availability;
      user.skillsOffered = profile.skillsOffered;
      user.skillsWanted = profile.skillsWanted;
      user.isPublic = true;
      user.isAdmin = false;
      user.isBanned = false;
      user.password = DEFAULT_PASSWORD;
    }

    await user.save();
    users.push(user);
  }

  return users;
};

const enrichTargetUser = async (targetUser) => {
  targetUser.skillsOffered = mergeUnique(targetUser.skillsOffered, extraSkillsForTarget.offered);
  targetUser.skillsWanted = mergeUnique(targetUser.skillsWanted, extraSkillsForTarget.wanted);
  targetUser.isPublic = true;
  await targetUser.save();
  return targetUser;
};

const createRequestsToTarget = async (demoUsers, targetUser) => {
  let createdCount = 0;

  for (const demoUser of demoUsers) {
    if (demoUser._id.toString() === targetUser._id.toString()) {
      continue;
    }

    const alreadyPending = await SwapRequest.findOne({
      fromUser: demoUser._id,
      toUser: targetUser._id,
      status: 'pending'
    });

    if (alreadyPending) {
      continue;
    }

    const offeredSkill = demoUser.skillsOffered?.[0] || 'General Mentorship';
    const requestedSkill = targetUser.skillsOffered?.[0] || 'Communication';

    await SwapRequest.create({
      fromUser: demoUser._id,
      toUser: targetUser._id,
      message: `Hi ${targetUser.name}, I can help you with ${offeredSkill}. I'd love to learn ${requestedSkill} from you in exchange.`,
      skillsOffered: [offeredSkill],
      skillsRequested: [requestedSkill],
      status: 'pending'
    });

    createdCount += 1;
  }

  return createdCount;
};

const run = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI missing in backend/config.env');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    const targetUser = await getTargetUser();
    const demoUsers = await upsertDemoUsers();
    const updatedTarget = await enrichTargetUser(targetUser);
    const newRequests = await createRequestsToTarget(demoUsers, updatedTarget);

    console.log('Demo setup complete.');
    console.log(`Target user: ${updatedTarget.name} (${updatedTarget.email})`);
    console.log(`Demo users upserted: ${demoUsers.length}`);
    console.log(`New pending requests sent to target: ${newRequests}`);
    console.log(`Demo user password: ${DEFAULT_PASSWORD}`);
  } catch (error) {
    console.error('Failed to seed demo data:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
