import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const data = req.query;
    if (!data) {
      console.log('no query');
      res.status(400).json({ id: undefined });
    }
    const client = await clientPromise;
    const db = client.db();
    const yourCollection = db.collection(
      process.env.MONGODB_COMPANY_COLLECTION
    );
    const company = await yourCollection.findOne({
      name: data.company,
    });
    if (company) {
      res.status(200).json({
        id: company.id,
        name: company.name,
        description: company.description,
        logo: company.logo,
        website: company.website,
        sdgs: company.sdgs,
      });
    } else {
      res.status(200).json({
        id: undefined,
        name: undefined,
        description: undefined,
        logo: undefined,
        website: undefined,
      });
    }
  }
}
