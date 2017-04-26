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

# Autostart

```bash
ekc@ekc-wallboard01:~$ sudo cat /etc/init/asterisk-meteor-cc.conf 
# meteorjs - meteorjs job file
# reference: https://github.com/alykoshin/asterisk-meteor-cc
#
# sudo nano /etc/init/asterisk-meteor-cc.conf
# sudo initctl status asterisk-meteor-cc
# sudo initctl stop service
# sudo initctl start service

description "asterisk-meteor-cc"
author "alykoshin"

# When to start the service
#start on (started JOB=ssh
#          and net-device-up
#          and local-filesystems
#          and runlevel [2345])
start on runlevel [2345]

# When to stop the service
# stop on runlevel [016]
# stop on starting rc RUNLEVEL=[016]
stop on runlevel [!2345]

# Automatically restart process if crashed
respawn
# respawn limit 2 5

# Essentially lets upstart know the process will detach itself to the background
expect fork

# Start the process
# --settings and --port is optional
exec su - ekc -c "cd /home/ekc/asterisk-meteor-cc && meteor"

# manual
```

```bash
ekc@ekc-wallboard01:~$ sudo cat /etc/init/asterisk-meteor-cc.override 
# manual
```
