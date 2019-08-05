import * as Yup from 'yup';
import { isBefore, endOfDay, startOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.string().required(),
      banner_id: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields Invalid' });
    }

    const { title, description, location, date, banner_id } = req.body;
    const { userId: user_id } = req;

    const parsedDate = parseISO(date);

    if (isBefore(parsedDate, new Date())) {
      return res.status(400).json({ error: 'You cannot select a past date' });
    }
    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      banner_id,
      user_id
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      description: Yup.string(),
      location: Yup.string(),
      date: Yup.string(),
      banner_id: Yup.number(),
      meetupId: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Fields Invalid' });
    }

    const { meetupId } = req.body;
    const meetup = await Meetup.findByPk(meetupId);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup does not exists' });
    }

    if (!(meetup.user_id === req.userId)) {
      return res
        .status(401)
        .json({ error: 'You just can edit your own meetup' });
    }

    const { date } = meetup;

    /** Verify if is the meetup already happened */
    if (isBefore(date, new Date())) {
      return res.status(400).json({ error: 'You cannot edit a past meetup' });
    }

    await meetup.update(req.body);

    return res.json(meetup);
  }

  async delete(req, res) {
    const { id } = req.params;
    const meetup = await Meetup.findByPk(id);

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup does not exists' });
    }

    if (!(meetup.user_id === req.userId)) {
      return res
        .status(401)
        .json({ error: 'You just can delete your own meetup' });
    }

    /** Verify if is the meetup already happened */
    if (meetup.past) {
      return res.status(400).json({ error: 'You cannot delete a past meetup' });
    }

    await meetup.destroy();

    return res.json({ message: 'Meetup deleted successfully' });
  }

  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;
    if (req.query.date) {
      const parsedDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)]
      };
    }
    const meetup = await Meetup.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'email'],
          required: true
        }
      ],
      attributes: ['id', 'title', 'description', 'location', 'date'],
      limit: 10,
      offset: 10 * page - 10
    });

    return res.json(meetup);
  }
}

export default new MeetupController();
