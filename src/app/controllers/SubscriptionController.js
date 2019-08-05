import { Op } from 'sequelize';
import User from '../models/User';
import Meetup from '../models/Meetup';
import Subscription from '../models/Subscription';
import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetupId, {
      include: [
        {
          model: User,
          as: 'user'
        }
      ]
    });

    if (!meetup) {
      return res.status(404).json({ error: 'Meetup does not exists' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in your own meetup' });
    }

    if (meetup.past) {
      return res
        .status(400)
        .json({ error: 'You cannot subscribe in a past meetup' });
    }

    /**
     * check if the user is already subscribed
     */

    const checkSubscriptions = await Subscription.findOne({
      where: {
        user_id: req.userId,
        meetup_id: meetup.id
      }
    });

    if (checkSubscriptions) {
      return res.status(400).json({ error: 'User is already subscribed' });
    }

    /**
     * check if the user is already a subscription with the same date
     */

    const checkDate = await Subscription.findOne({
      where: {
        user_id: user.id
      },
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: meetup.date
          },
          required: true
        }
      ]
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: 'User has already a subscription at the same time' });
    }

    const subscription = await Subscription.create({
      user_id: req.userId,
      meetup_id: meetup.id
    });

    await Mail.sendMail({
      to: `${meetup.user.name} <${meetup.user.email}>`,
      subject: 'New subscription',
      template: 'subscription',
      context: {
        meetupName: meetup.title,
        subscriberName: user.name,
        subscriberEmail: user.email
      }
    });

    return res.json(subscription);
  }

  async index(req, res) {
    const subscriptions = await Subscription.findAll({
      where: {
        user_id: req.userId
      },
      attributes: ['meetup_id'],
      include: [
        {
          model: Meetup,
          as: 'meetup',
          where: {
            date: {
              [Op.gt]: new Date()
            }
          },
          required: true,
          attributes: ['title', 'description', 'location', 'date', 'id']
        }
      ],
      order: [['meetup', 'date']]
    });

    if (!subscriptions) {
      return res.status(404).json({ error: 'You do not have subscriptions' });
    }

    return res.json(subscriptions);
  }
}

export default new SubscriptionController();
