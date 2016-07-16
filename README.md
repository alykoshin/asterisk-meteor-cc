# Install

Install Meteor

```sh
curl https://install.meteor.com/ | sh
```

Install Git

```
sudo apt-get update
sudo apt-get -y install git
```

Install and run project

```
cd ~
git clone https://github.com/alykoshin/asterisk-meteor-cc.git
cd asterisk-meteor-cc
meteor npm install
```

Set Asterisk IP/Port

```sh
nano server/ami.js
```

```js
// ...
const amiConfig = {
  host: '172.20.200.1', // <asterisk_ip>
  //host: 'localhost',  // <asterisk_ip>
  port: '5038',         // <asterisk_ami_tcp_port>
};
// ...
```

```sh
DEBUG=ami meteor
```

Then open http://<server_ip>:3000/wallboard
