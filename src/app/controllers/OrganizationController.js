import File from '../models/File';
import Meetup from '../models/Meetup';

class OrganizationController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: {
        user_id: req.userId
      },
      attributes: ['id', 'title', 'description', 'location', 'date'],
      include: {
        model: File,
        as: 'banner',
        attributes: ['path', 'url']
      }
    });

    if (!meetups) {
      return res.status(400).json({ error: "You don't have meetups" });
    }

    return res.json(meetups);
  }
}

export default new OrganizationController();
