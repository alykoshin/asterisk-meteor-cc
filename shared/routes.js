/**
 * Created by alykoshin on 12.07.16.
 */


Router.route('/', function () {
  this.render('main');
});
        

Router.route('/wallboard', function () {
// Router.route('/wallboard/:queue', function () {
  this.render('wallboard');
});

