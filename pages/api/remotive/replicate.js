import clientPromise from '../../../lib/mongodb';
import { getRemotiveJobs } from '../../../backend/job/remotive/remotiveApi';

// replicates what is in the remotive database (db with id, sdg and timestamp) to the job database.

export default async function handler(req, res) {
  if (req.method === 'PATCH') {
    // Fetch all desired jobs from remotive
    const remotiveJobs = await getRemotiveJobs();

    const client = await clientPromise;
    const db = client.db();
    const yourCollection = db.collection(process.env.MONGODB_COLLECTION);

    //delete all external jobs from db
    await yourCollection.deleteMany({ external: true });

    //insert all jobs from remotive into db
    if (remotiveJobs.length > 0) {
      await yourCollection.insertMany(remotiveJobs);
    }

    res.status(201).json({
      message: 'Remotive jobs cleaned up and inserted successfully in DB!',
      data: remotiveJobs,
    });
  }
}
