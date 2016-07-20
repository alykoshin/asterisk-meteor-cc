/**
 * Created by alykoshin on 12.07.16.
 */


Router.route('/', function () {
  this.render('index');
});
        
Router.route('/main', function () {
  this.render('main');
});
        
Router.route('/listPages', function () {
  this.render('listPages');
});
        

Router.route('/wallboard', function () {
  this.render('wallboard');
});

Router.route('/wallboard/queue/:queue', function () {
  this.render('_wbQueueInfo', { data: { queueName: this.params.queue } });
});

Router.route('/wallboard/queueList', function () {
  this.render('_wbQueueList', { data: {} });
});

