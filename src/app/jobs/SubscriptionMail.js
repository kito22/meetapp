import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;
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
  }
}

export default new SubscriptionMail();
