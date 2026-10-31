---
title: "Mountain Lion Upgrade Notes"
description: "Be careful before upgrading to Mountain Lion"
pubDate: 2012-07-26
tags: ["Apple"]
lang: en
---
Here are some Apps, which are incompatible with Mountain Lion or not need any more.

1. VMWare Fusion 3.x. It can not work at Mountain Lion. Please upgrade to 4.x before Mountain Lion upgrade.

2. Safariomnibar. Just remove it. Safari 6.0 will support most of features the Safariomnibar provided, such as Unified location bar with search bar and Search directly using location bar. How to remove it:

   ```sh
   sudo rm -rf /Library/Application\ Support/SIMBL/Plugins/SafariOmnibar.bundle
   ```

3. Growl. Growl has been replaced with Notification Center. I don’t need Growl any more. Remove it! The removing HOWTO can be found from [here](http://growl.info/documentation/growl-package-removal.php).
