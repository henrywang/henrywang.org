---
title: "Fusion Drive On My 2010 MacBook Pro"
description: "How to configure Fusion Drive on MacBook Pro (2010)"
pubDate: 2012-11-19
tags: ["Apple"]
lang: en
---
Apple released a new technology - [Fusion Drive](http://support.apple.com/kb/HT5446?viewlocale=en_US&locale=en_US) at [Apple Special Event](http://www.apple.com/apple-events/october-2012/) on Oct 23, 2012. This's so excited for me that I can add this new technology into my 2010 MacBook Pro. I upgraded my MBP last year by removing optical drive and installing a 160GB [Intel SSD 320 series](http://www.intel.com/content/www/us/en/solid-state-drives/solid-state-drives-320-series.html) instead. So my MBP meets the requirement to make a  Fusion Drive.     

I've been worried whether Fusion Drive was compatible with my old MBP. After reading [@jollyjinx](http://twitter.com/jollyjinx)'s blog post [Fusion drive on older Macs? YES!](http://jollyjinx.tumblr.com/post/34638496292/fusion-drive-on-older-macs-yes-since-apple-has), I decided to give it a try on my old MBP.    

Here're the step by step Fusion Drive installation procedure.

## Create a Mountain Lion installation boot disk ##

Just follow [How to create a bootable, backup Mountain Lion install disk](http://arstechnica.com/apple/2012/07/how-to-create-a-bootable-backup-mountain-lion-install-disk/) to make one.     
I chose [8GB SanDisk Extreme SD card](http://amazon.com/dp/B000Y9TZ9Y) as my boot disk. Both MBP and Mac mini could boot from SDXC card slot.

## Create Fusion Drive ##

Boot from SD card and enter into recovery mode:    
![boot](/images/blog/fd0002.jpg)
Open Terminal utility.     
Find my SSD and HDD drive name:     
![SSD and HDD drive name](/images/blog/fd0001.jpg)     
Create logical volume, please remember the CS LVG UUID, it will be a parameter of volume creation command.
![Fusion Drive](/images/blog/fd0003.jpg)    
Check the logical volume group I just created.    
![list](/images/blog/fd0004.jpg)     
Create and format the volume.    
![CS](/images/blog/fd0005.jpg)    
Exit Terminal app and Install OS X.
![install](/images/blog/fd0007.jpg)     
Choose the newly created disk to install OS X.
![osx](/images/blog/fd0009.jpg)    

Done!

BTW: I found most of the data were copied into SSD first when I restored backup data and installed app.
![iops](/images/blog/fd0010.jpg)    
*disk0: SSD, disk1: HDD, disk3: mounted iWork installation disk.*

Any questions, please ping me [ADN](https://alpha.app.net/henrywangxf) or [Twitter](https://twitter.com/henrywangxf).
