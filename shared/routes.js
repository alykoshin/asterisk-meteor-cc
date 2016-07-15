/**
 * Created by alykoshin on 12.07.16.
 */


Router.route('/', function () {
  this.render('main');
});
        

Router.route('/wallboard', function () {
  this.render('wallboard');
});

Router.route('/wallboard/queue/:queue', function () {
  this.render('_queueInfo', { data: { queueName: this.params.queue } });
});

