---
title: "使用strongSwan搭建IPSec VPN for iOS"
description: "Step by step"
pubDate: 2011-10-26
tags: ["Software"]
lang: zh
---
一直困扰我的VPN问题终于得到了完美的解决，我终于可以“安全的”无墙了！期间也在网络上找了很多文章，看了很多人的Blog和FAQ，终于解决了iOS的Cisco VPN（IPSec VPN）问题。经验一定要分享，下面我会把如何搭建和配置Cisco VPN的过程做个详细的介绍。

还是先说一下iOS设备的一些限制，也就是为啥非要选用Cisco VPN：

  1. iOS设备如果不越狱，支持的VPN有PPTP， L2TP， Cisco VPN， Cisco AnyConnect和Juniper的Junos Pulse。如果越狱就可以使用openVPN。

  2. PPTP已经被GFW给block了，很多人都在使用L2TP，L2TP支持标准的安全特性CHAP和PAP，可以进行用户身份认证。在安全性考虑上，L2TP仅定义了控制消息的加密传输方式，对传输中的数据并不加密。不安全，不考虑。

  3. Cisco AnyConnect需要连接Cisco的Router，ASA或者PIX设备，Junos Pulse需要连接Juniper的SA系列VPN产品。这都需要花钱买，都很贵的，不考虑。

  4. 有人会问了，openVPN也是一个选择啊。对，没错，但是iOS设备安装openVPN Client需要越狱。这点是我不能接受的。不考虑。

  5. 剩下唯一的解决方案就是找到一个软件，能够支持Cisco VPN Client。感谢google的强大，终于找到了一款opensource的软件strongSwan。strongSwan可以支持Cisco VPN Client，而且在其官方网页上居然给出了配置方法，很详细，详情请见[这里](http://wiki.strongswan.org/projects/strongswan/wiki/IOS_(Apple))。不得不说strongSwan为我们GFW内的人们做了一件大好事儿啊。

接着我说一下VPS的事情：国外比较有口碑的而且我用过的VPS运营商是Linode和ARP Network，两个各自有各自的好处。Linode配置全自动，更换系统，注册VPS全自动操作，无需人工干预，支持能力强，基本3－5小时内一定会给出答覆。ARP配置不是全自动，需要发邮件给该运营商，但是ARP Network有自己独立的AS，相当的有实力，支持FreeBSD和OpenBSD，价格比Linode要亲民的多。Linode的VPS可以提供多个Location的选择，美国，英国和日本。ARP Network只有美国一个选择。

我目前两个都在使用，但是近期准备退掉Linode的，一个ARP Network的我觉得就足够我用了。才$10一个月，价格诱惑力很大啊。而且我喜欢独立的AS，听着就有气势。

我这里给出的配置步骤是根据官方网站的文档和我自己配置过程中的一些体会结合而成，不多说了，开始配吧！ 

  1. 操作系统选择：我选的是Ubuntu。Centos我的一个同事也测试过，没问题。

  2. 配置前准备工作，例如做好apt的upgrade等。

  3. 下载strongSwan：

      ```sh
      wget http://download.strongswan.org/strongswan-4.5.3.tar.bz2
      tar jxvf strongswan-4.5.3.tar.bz2
      cd strongswan-4.5.3
      ```

  4. 配置前需要安装gcc等编译工具：

      ```sh
      sudo aptitude install build-essential
      ```

  5. 安装生成RSA Key所使用的openssl工具：（这里需要说明，strongSwan默认生成Key使用从/dev/radom产生的随机数，可能会碰到entrop不足的情况，这样产生随机数非常慢，慢到不可用）因此建议使用openssl生成RSA Key。

      ```sh
      sudo aptitude install libssl-dev
      ```

  6. 编译，安装strongSwan：

      ```sh
      ./configure --prefix=/usr --sysconfdir=/etc --enable-cisco-quirks --disable-gmp --enable-openssl
      make
      sudo make install
      ```

  7. 生成CA证书：

      ```sh
      ipsec pki --gen --outform pem > caKey.pem
      # 例如也可以用 "C=US, O=iOSVPN, CN=iOS CA"
      ipsec pki --self --in caKey.pem --dn "C=CN, O=test, CN=Test CA" --ca --outform pem > caCert.pem
      ```

  8. 生成Server端证书：

      ```sh
      ipsec pki --gen --outform pem > serverKey.pem
      ipsec pki --pub --in serverKey.pem | ipsec pki --issue --cacert caCert.pem --cakey caKey.pem --dn "C=CN, O=test, CN=vpn.test.com" --flag serverAuth --outform pem > serverCert.pem
      ```

  9. 生成Client端证书：

      ```sh
      ipsec pki --gen --outform pem > clientKey.pem
      ipsec pki --pub --in clientKey.pem | ipsec pki --issue --cacert caCert.pem --cakey caKey.pem --dn "C=CN, O=test, CN=client" --outform pem > clientCert.pem
      ```

  10. 将Client证书转换为.p12格式（解释一下原因，Client的.p12格式是因为p12格式的可以即包含key，也包含证书文件，为了方便，省得导入两个文件了）

      ```sh
      openssl pkcs12 -export -inkey clientKey.pem -in clientCert.pem -name "client" -certfile caCert.pem -caname "Test CA" -out clientCert.p12
      ```

  11. Copy生成的key和证书文件到相应的目录：

      ```sh
      cp caCert.pem /etc/ipsec.d/cacerts/
      cp serverCert.pem /etc/ipsec.d/certs/
      cp serverKey.pem /etc/ipsec.d/private/
      cp clientCert.pem /etc/ipsec.d/certs/
      cp clientKey.pem /etc/ipsec.d/private/
      ```

  12. 配置/etc/ipsec.conf文件

      ```
      config setup
          plutostart=yes
          nat_traversal=yes

      conn iOS
          keyexchange=ikev1
          authby=xauthrsasig
          xauth=server
          left=%defaultroute
          leftsubnet=0.0.0.0/0
          leftfirewall=yes
          leftcert=serverCert.pem
          right=%any
          # VPN连接后分配给iOS设备的地址所在网段
          rightsubnet=10.0.0.0/24
          rightsourceip=10.0.0.2
          rightcert=clientCert.pem
          pfs=no
          auto=add
      ```

  13. 创建ipsec.secrets文件 /etc/ipsec.secrets，并编辑：

      ```
      # /etc/ipsec.secrets - strongSwan IPsec secrets file

      # Server的Key文件
      : RSA serverKey.pem

      # test为用户名，password为密码，这里的密码一定要用""引起来
      test : XAUTH "password"
      ```

  14. 配置/etc/strongswan.conf文件，需要分配一个没有任何污染的DSN给VPN连接成功的iOS设备：

      ```
      # /etc/strongswan.conf - strongSwan configuration file

      charon {
          # ...
      }

      pluto {
          # google的DNS，google又做的一件好事儿！
          dns1 = 8.8.8.8
      }
      ```

  15. 配置iOS设备：将生成的caCert.pem和clientCert.p12通过邮件的方式或者通过web方式下载到iOS设备上，并进行证书安装。

      >选择 Settings 选择 General > Network > VPN > Add VPN Configuration选中IPSec VPNdescription用来标识你的vpn的，没有特别的限制Server一定要填入签发Server端证书时，输入的“CN=vpn.test.com”的=后的部分，即vpn.test.com。如果不一致，iOS设备会报错，Server验证失败。Account填入ipsec.secrets的用户名Password填入ipsec.secrects的密码切换Use Certificate到on，并选择导入和Clent的证书

  16. VPN连接：在Settings > VPN下，将 VPN 切换到 ON 开始进行IPSec VPN的协商和连接。连接好后，会给出一个Notification“Welcome to strongSwan - the Linux VPN Soluution!”。看到该notificatio后，恭喜你，连接成功了！！

BTW：我顺便说一下iptables的配置：

  1. strongSwan用到的端口就是UDP 500和4500，所以在iptables的filter表的INPUT 链要加入允许UDP 500和4500进入，即：

      ```
      -A INPUT -p udp --dport 500 -j ACCEPT
      -A INPUT -p udp --dport 4500 -j ACCEPT
      ```

  2. 大家使用VPN的主要目的是为了访问大量的信息，所以需要配置NAT，具体配置如下：

      ```
      -A POSTROUTING -s 10.0.0.0/24 -o eth0 -j MASQUERADE
      ```

  3. 需要配置filter表的Forward链：

      ```
      -A FORWARD -s 10.0.0.0/24 -j ACCEPT
      ```

  4. 最后别忘了net.ipv4.ip_forward=1哟！

大功告成！大家可以安全放心的使用VPN啦！经我的测试，WIFI通过NAT Router连接和GPRS连接都没问题。联通的网络我没有试过，如果有试过的请告知大家结果。谢谢！如果大家在配置过程中有问题可以联系我@henrywangxf。我有时间一定会解答的！
