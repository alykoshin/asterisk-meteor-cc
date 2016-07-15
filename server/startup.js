/**
 * Created by alykoshin on 14.07.16.
 */

Meteor.startup(() => {
  Meteor.cleanup();
  Meteor.startAMI();
});

