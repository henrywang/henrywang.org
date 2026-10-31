---
title: "Mavericks and Cisco VPN"
description: "A tips about Cisco VPN in Mavericks"
pubDate: 2014-01-13
tags: ["Apple"]
lang: zh
---
上周五是Apple一年一度的Apple Special Day，机会难得，第一时间入手了一台Retina MacBook Pro 13-inch。屏幕和性能简直没话说，这里我就不多阐述，后续会写一些关于该MacBook Pro的review和使用的心得体会。今天这篇blog post主要是要写配置Mavericks自带的Cisco VPN的一个注意事项。

机器拿到手后，第一步就是要安装1Password，因为我所有的用户和密码信息都保存在1Password里面。而1Password的配置文件我是保存在Dropbox内，方便我的iPhone和iPad做同步。因此安装Dropbox就变成了第一步的前一步。不用我说大家都知道Dropbox的Web Site是blocked by GFW的。Dropbox比较特殊，通过API的方式同步Dropbox的文件是不受控制的。因此先要VPN，下载Dropbox for Mac Client，登录，断开VPN，同步文件夹和文件。

配置VPN就是重中之重，我自己的VPN是用Strongswan搭建的，使用数字证书进行对拨入的用户进行认证，所以需要将根证书和客户端证书导入KeyChain Access。导入的方法不多说，很简单。关键是导入后需要对证书进行一些配置。

* 根证书和客户端证书都要配置成always trust。
* 客户端证书的私钥要enable “Allow all application to access this item”选项，也就是说要允许racoon能够使用该私钥。否则会出现如下错误：

> com.apple.SecurityServer[15]: Problem opening rules file "/etc/authorization": No such file or directory
> racoon[1413]: error -25308 errSecInteractionNotAllowed.

具体配置步骤如下：

选择该私钥：
![private key](/images/blog/keychainaccess.png)

Enable “Allow all application to access this item”
![access control](/images/blog/hwvpn05.png)
