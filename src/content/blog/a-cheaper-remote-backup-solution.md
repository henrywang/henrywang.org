---
title: "A Cheaper Remote Backup Solution"
description: "How to backup my files on remote site."
pubDate: 2012-11-12
tags: ["Software"]
lang: en
---
[Amazon’s Glacier](http://aws.amazon.com/glacier/) is a good choice to get your important data stored remotely. It’s becoming my remote backup choice.

I have a [Western Digital My Book World Edition II - 6 TB (2 x 3 TB) Network Attached Storage](http://www.amazon.com/gp/product/B004T7Q2Y8/ref=oh_details_o01_s00_i00) as my local backup solution. The reason why I choose this one is because:

1. It’s a NAS. It appears on my home network as a shared folder. Easy to find, easy to use.
2. It supports Apple Time Machine.
3. It supports RAID0 & 1. To avoid one of two 3T disks failure. This’s very important because all normal disks are not very stabile. My data is much more expensive than all disks!

Even thought I have local backup, I’d rather make Glacier as my remote backup. I’ll put all my important data into Glacier. I can get all my the most important data back in case my local backup failed or some natural disaster.

The Glacier is cheaper, only $0.01 per GB/month. For me, it costs less than $2/month.

I’m going to put about 200GB data into Glacier, which includes the configuration files of 1Password, TextExpander, Alfred, my personal VPN, and Omnifocus. My iPhoto library, my documentation directory and my wife’s documentation directory will be uploaded there as well.
