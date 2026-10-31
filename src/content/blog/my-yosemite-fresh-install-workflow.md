---
title: "My Yosemite Fresh Install Workflow"
description: "Yosemite, OS X 10.10, Fresh install"
pubDate: 2014-12-07
tags: ["Apple"]
lang: en
---
Every year, Apple gets his Mac OS updated. For me I always do a fresh installation after the new OS passed my compatibility testing, which includes new OS upgrade installation, VPN testing, some apps testing. All of what I did is to make sure everything is able to work with new OS.    
The following step by step installation workflow has been optimized by me. It only costs my 4 hours now. If you like me have the same habit as me, this post might be helpful for you.

## Before Installation

* VPN certificate backup
* RSA public and private backup
* Script backup
* TextMate and Terminal theme backup. I use [IR_Black theme](http://toddwerth.com/category/blog/).
* Write down iCloud login info
* Make a Yosemite installation Disk
* Download app installation package. Some of apps are not available in MAS, so their installation package, like .dmg, need to be downloaded directly from their web site, such as Dropbox, TextExpander, Transporter client, TextMate, Google Chrome, ImageOptim. The Dropbox needs VPN's help.

## After Installation

## Setup login options

I don't like login with iCloud account but a new local user.

## iCloud login setting

I'd like to config iCloud username and password at installation process instead of from System Preferences after the installation. Everything you can do now, do it now. The iCloud related stuff will be ready for use after your first login on you new OS.

## iCloud setting

Enable all iCloud options except Keychain and Back to My Mac. I use 1Password to store and its extension to file username and password, so that the Keychain is not useful for me, disable it for security.

## Install 1Password from MAS

The configuration syncing needs to be done because some of login info will be used later. It supports CloudKit syncing in 1Password 5, so that I don't need VPN at this step.

## VPN setting

1. Import CA and it signed client certificates into Keychain. My VPN server needs all of clients to provide certificate to do authentication. (Keychain -> System -> Certificates) After both of them imported, configure client certificate as Always Trust.
2. Add Cisco IPSec VPN (System Preferences -> Network) and name it "HW VPN". This name will be referenced by my Apple Script, which is able to start and stop VPN connection from Spotlight.
3. Enable Show VPN status in menu bar

## Internet Accounts settings

1. Connect "HW VPN" from menu bar. I need it to add Twitter, Facebook, and Vimeo account.
2. Add my three Gmail account, two Twitter, a Facebook, a Vimeo, and a flickr accounts.

## Install Dropbox

The VPN has not been disconnected so far. After installed, give it my Dropbox account.

## Install TextExpander

Give license to TextExpander, it's easy because I have 1Password. Configure the sync method to Dropbox, then all of my TextExpander settings will be synced here. Done.
The VPN can be disconnected now!

## Install apps from MAS

* Apple's: iPhoto, Xcode, Pages, Numbers, Keynote, 
* Other's: Soulver, Day One, Pocket, Tweetbot, Byword, Pixelmator, Evernote, Kindle, ReadKit, Marked 2, Coinverter, Things.

## Install apps from the other source

 Transporter client, Google Chrome, TextMate, ImageOptim
 
## App's first login

Some of apps need to login before using, such as iTunes, iBooks, Day One, Pocket,  Evernote, Kindle, ReadKit, Transporter client. The Tweetbot and Things need VPN's help.

## System Preferences configurations

### Language & Region

* Add other preferred language if you need other than English. For me, I added Chinese as my second preferred language.

### Security & Privacy

* Set the re-enter password time to 1 minute after sleep or screen saver begins.
* Set MAS and identifier developer as where allowed apps downloaded from

### Enable FileVault

### Turn on Firewall

* Enable stealth mode

### Spotlight

Un-check Spotlight Suggestion and Bing Web Search for privacy consideration.

### Notification

Set turn on Do Not Disturb from 11:00PM to 7:00AM

### Keyboard

* Un-check Select the previous input source(cmd+space) because the Spotlight uses the same shortcut.
* Add Pinyin - Simplified input source

### Trackpad

Enable all trackpad options.

### Extensions

Enable some apps extensions.

### Users & Groups

* Disable Guest user
* Turn off automatic login
* Display login window as lists of uses
* Enable show the sleep, restart, and shut down buttons

## Shell command short name setting

Put the following lines of settings into ~/.bash_profile:
 ``alias ll='ls -alh'``
 ``alias pbwc='pbpaste | wc -w'``

## Local RSA private and public key restore

Copy id_rsa and id_rsa.pub into ~/.ssh

## Homebrew

1. Install Homebrew:
 ``ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"``
2. Install python3 and wget

## Setup time machine and first backup

For my home setup, I need to setup time machine by command line:
``sudo tmutil setdestination -ap afp://tm_server_username:tm_server_password@tm_server_ip_address/tm_directory``
