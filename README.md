---
# Note
Privileged to make this for a capstone project my senior year of my undergraduate career, I learned how to apply all that the past few years allotted me to absorb. Our project team delicately planned and provided great assistance in coming together for nearly two months. The output of the team includes this repository, a full network plan with multiple zones, financial and administrative planning, and a powerful presentation to the Home Design Solutions corporation.

Regarding this repository, I leave it with some unfinished business. Primarily, unit testing. I have not learned yet about testing libraries, and hope to go and practice these necessary components immediately. In addition, I started this project on the highway to hell as they say... I added a bunch of dependencies I did not need, copied and pasted without proper attribution, and did some foolish planning thinking it all to be nothing. In doing so, I failed miserably. So I tore it all apart and started from scratch. No boilerplate, nothing. Thankfully, after hours of looking at blank `index.ts` files, I added some content. Slowly built up the database learning about the awesome new Prisma client. The funny thing is, I trusted the alpha version of Prisma, when it was still prisma2 in the works, so much so that I wrote up the database model using the experimental Prisma migrate. Looking up the documentation, and going through countless searches on GitHub for examples as I ashamedly do, I dropped on my knees in the streetlights to realize the only light in the streets. Kodak black taught me to push forward as a young one, now I push. Furthermore, planning the database with my team members resulted in multiple "breaking" changes down the road requiring I drop and recreate countless database models.

It worked out great actually, lots of help came from looking up how to design an inventory system, how to implement a billing database, etc. In addition, learning to use ERD modeling to visualize and construct connections greatly enhanced my knowledge, especially regarding the concept of indexing later on when having to query the system. After some deliberation, I ended up using prisma:introspect script in the package file to just generate the [schema.prisma](./prisma/schema.prisma) from the database instead of using migrate. What really pushed me through after all came from the realization through my colleagues and professor that all this is for my benefit. It is quite easy to fall down the wrong road, perhaps even doubt oneself and end up flipping burgers at a burger king singing would you still love me by 50¢. I digress. I learned to stop and think for myself. Learn the native fetch method; you will not hear about it on stack overflow. Teach and learn, peanut butter and bananas, or jelly whatever. Learn to navigate the source code of the library to figure out how to make it better. Create. Struggle, recreate. Do while, continue; break; return something. Anyways, I think I have a lot to learn. Time to think some more. Peace!

Thank you, God, Jesus Christ, and to the excellent professor and staff of Seminole State College of Florida for all your incredible dedication and aspiration. Thank you to the team members I had the privilege to work with.

Please feel free to check out this repository and use it. Please criticize, even scrutinize me with all you got, as I continue to learn ECMAScript, React, and the soft skills my parents would want me to have. Peace!
## How to Initialize
---

- generate keys for encryption as stated below for the seed data and prisma authentication
  - `cd keys`
  - `openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem`
  - `openssl rsa -in key.pem -pubout -out pubkey.pem`
  - `chmod 400 key.pem cert.pem pubkey.pem`
- make sure .env has correct mysql_url for prisma in the prisma folder.
- also make sure .env in root dir is configured properly, see [.env.example](./.env.example)
- create user hds_user and database hds.
  - `create database hds;`
  - `create user hds_user@localhost identified by 'peaceBWithYou123!';`
  - `grant all privileges on hds.* to hds_user@localhost;`
- finally run `npm run prisma2:init` to have prisma generate database schema
- to seed the test data (see [seed file and dummy data](./data/seed.ts))
  - `npm run seed`

## Deploy to server

---

Included in this repo - nginx configs, .zshrc file. The nginx configs include one for a static site, the "branch.codes" one (used for an angular front end website for hds), then the "admin.branch.codes" nginx config which reverse proxies the node process.

### Git

Shell scripts - so this part will initialize the basics, a gpg and ssh key, software updates

Depending on if you use GCP or AWS, or DO, etc. the user password may not be enough security if you get ultra paranoid like me. So look up some things (primarily about teh sshd_config, /etc/sudoers.d/\*\*, mysql config and restricting access). I probably did not include them here.

```shell script
#!/bin/sh
sudo apt update && sudo apt upgrade -y
sudo apt install software-properties-common zsh gnupg2 curl
print "=> Change your password!!"
sudo passwd "$USER"
print "=> creating gpg key"
gpg --full-generate-key
gpg --list-secret-keys --keyid-format LONG
printf "=> please copy the long string aka the id of the gpg key"
read -r keyid
gpg --armor --export "$keyid"
printf '=> Have you copied it and added it to Git?? [y/N] '
read -r confirmation_gpg
echo "$confirmation_gpg"

ssh-keygen -t ecdsa -b 521 -f ~/.ssh/id_ecdsa_521
cat ~/.ssh/id_ecdsa_521.pub
printf '=> Have you copied it and added it to Git?? [y/N] '
read -r confirmation

confirmation=$(echo "$confirmation" | tr '[:lower:]' '[:upper:]')

if [ "$confirmation" = 'YES' ] || [ "$confirmation" = 'Y' ]; then
  eval "$(ssh-agent)"
  ssh-add ~/.ssh/id_ecdsa_521
```

### zsh and Oh My ZSH setup

Just prettify everything up - if anybody actually sees this and wants it to work, make sure to use your own github username where it says YOUR_GITHUB_USERNAME. Also make sure to touch a `.zshrc` file in it or use the default one presented by zsh on install.

```shell script
mkdir ~/Downloads

  # todo make this public if sharing...get your own zsh dotfiles repo
  git clone --recursive git@github.com:<YOUR_GITHUB_USERNAME>/dotfiles.git "$HOME/Downloads"
  cd ~/Downloads/dotfiles || return
  # this installs powerline fonts
  git clone git@github.com:powerline/fonts.git && cd fonts && sh ./install.sh
  # the ohmyzsh
  sh -c "$(curl -fsSL --http2 --tlsv1.2 https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
  git clone git@github.com:romkatv/powerlevel10k.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}"/themes/powerlevel10k
  git clone git@github.com:lukechilds/zsh-nvm.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}"/plugins/zsh-nvm
  git clone git@github.com:zsh-users/zsh-syntax-highlighting.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}"/plugins/zsh-syntax-highlighting
  git clone git@github.com:zsh-users/zsh-completions.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}"/plugins/zsh-completions
  git clone git@github.com:zsh-users/zsh-autosuggestions.git "${ZSH_CUSTOM:-~/.oh-my-zsh/custom}"/plugins/zsh-autosuggestions
  git clone git@github.com:lukechilds/zsh-better-npm-completion ~/.oh-my-zsh/custom/plugins/zsh-better-npm-completion

  git clone --depth=1 git@github.com:amix/vimrc.git ~/.vim_runtime
  sh ~/.vim_runtime/install_awesome_vimrc.sh
else
  # have to say please?
  print 'please git clone yourself then!'
fi
```

### mysql

Also, perhaps you will need to install mysql. [make sure it is the latest version](https://dev.mysql.com/downloads/repo/apt/)

```shell script
curl --http2 --tlsv1.2 https://repo.mysql.com//mysql-apt-config_0.8.15-1_all.deb -o ~/Downloads/mysql.deb
sudo dpkg -i ./mysql.deb
sudo apt update
sudo apt install mysql-server
sudo systemctl enable mysql && sudo systemctl start mysql
sudo mysql_secure_installation
# follow instructions... click ok
```

### nginx

nginx, if not using bionic awk it out from this snippet:

```shell script

sudo wget https://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
sudo touch /etc/apt/sources.list.d/nginx_official.list
sudo sed -i 'deb https://nginx.org/packages/mainline/ubuntu/ bionic nginx
deb-src https://nginx.org/packages/mainline/ubuntu/ bionic nginx' /etc/apt/sources.list.d/nginx_official.list

```

Now reboot.

```shell script
sudo reboot
```


I like to have my server automatically reboot every night so add a cron-job for this

```shell script
sudo crontab -e

#todo yourself -
# add something like this
4 20 * * * /sbin/shutdown -r +5
```

### for swap space

```shell script
sudo swapon --show
sudo fallocate -l 1G /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1024 count=1048576
sudo chmod 600 /swapfile
sudo mkswap /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab
sudo sysctl vm.swappiness=10
```

### auto updates

```shell script
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### node, pm2

#### nvm

if you added the oh my zsh plugins above, and added nvm to the zshrc, then you can use the following nvm commands

```shell script
nvm install stable
nvm alias default stable
npm -g install pm2

pm2 completion >>~/.zshrc
```

### pm2 production

when ready to deploy persistently, set up the [ecosystem](https://pm2.keymetrics.io/docs/usage/application-declaration/) file and perhaps even sign up for the pm2 plus. [its super cool](https://pm2.io/docs/plus/overview/#features-available-in-pm2-plus).

```shell script
pm2 autostart
pm2 run ecosystem.config.js
pm2 save
```

# ~~TODO~~

---

## admin console

1. ~~Forms: login / register / reset password~~

2. ~~setting up all the tables~~

3. POS
   - ~~finish customer order products display.~~
   - ~~seal the deal with redux action, i.e. put customer order in db async~~
     1. ~~will have to deduct quantity picked from each CustomerOrderProduct off the Product's inventory location quantity~~
   - show the customer orders as invoices
     1. ~~create base invoice on server side if not created already~~
     2. ~~line items - bill to pay,~~ deduct the amount from invoice total as added.

## Unit tests

1. just get started. no excuses dude. - did not do any unit tests...

## General refactoring

1. It would be wise to refactor these aspects of this application before considering it ready for production:

   - Redux store states do not accommodate for transient states.
     1. for example, customer order state should handle the states of the order, i.e. attempt add product, add product success, add product fail.
     2. I wonder if it would make sense to submit the order partially in steps to the server concurrently, and handle the canceled order by time out or allow the store location to resume previous orders.
   - Refine data fetching methods, ie remove axios dependency and stick to fetch.
   - Reduce redundant instantiations of prisma client from the api routes and server side requests into single utility
   - API routes checking for auth redundancy as well as verifying request params / method

2. Database structure + documentation

   - a lot of crap in the database makes no sense without a documentation of the underlying structure and planning that went into it, i.e. "Jobs" - "Invoice" relationship
   - it would help to at least comment the info into the schema file for prisma

3. I did absolutely zero seo, not to mention even the basics like page title and unique meta.

## issues

1. Static generation cuts off server side authentication in GIP here: [withRedux](./lib/hoc/with-redux.tsx)

   - current GIP depends on server req to reroute properly with auth state
   - implications right now include no static generation for dashboard pages without refactoring
   - instigates possible issues down the road with following separation of concerns
   - optionally move it to the client side, and use router to reroute

## personal learning interests

1. How to implement a listener or subscriber to state properly with the redux pattern or by any other means albeit effective, or experimental :)
2. How to have server handle tokens so that the cookies stored on a secure domain have httpOnly and secure flags
