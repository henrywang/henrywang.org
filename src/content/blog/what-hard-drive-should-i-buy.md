---
title: "After Reading A Blog - What Hard Drive Should I Buy"
description: "I have a lot to write after reading \"What Hard Drive Should I Buy\""
pubDate: 2014-01-23
tags: ["Software"]
lang: zh
---
昨天看了一篇blog - [What Hard Drive Should I Buy?](http://blog.backblaze.com/2014/01/21/what-hard-drive-should-i-buy/)。这篇blog让我感触很深，必须要写点什么才能留住我当时的感受。

看了这篇文章后觉得自己前些日子买的[日立（HGST） 1TB SATA6Gb/s 7200转32M 笔记本硬盘(HTS721010A9E630)](http://item.jd.com/857721.html)是多么英明的决定。不过WD收购了日立硬盘业务，所以以后就可能买不到日立硬盘了，希望WD能够取日立之所长，补自己之所短，做出稳定可靠的硬盘。
其实我相信大部分买硬盘的人在价格和稳定性之间已经会将稳定性放到第一位，因为数据是无价的。但是仅仅依赖硬盘的稳定性是不足以保证数据安全的，再稳定的硬盘再经过多次读写后也会变得不稳定的，而且瞬间的高IO操作可能会导致硬盘损坏。所以数据的可靠性存储对于这个电子时代的人来说都是一个不小的挑战。
那么我就说一下我自己的关于数据存储的一些心得体会。首先数据需要进行分级，我是将我所有的数据分为4个等级，它们分别是A+，A，A-。可能每个人都会问为什么我只用A进行分类，而不用B，C。原因很简单，因为数据都是很重要的，能不丢失尽量不要丢失，这里没有B和C等级的数据，在我看来所有的数据都是A级，只是在A级别里根据重要性的不同又进行了进一步的分类。

*   (A+) 就是指那些非常非常重要的数据，绝对不允许丢失。一旦丢失没有办法通过任何途径重新建立。例如我的多年积累的照片，录像视频，文档，代码，1Password配置文件等。这些数据一旦丢失，后果不堪设想。
*   (A) 就是指相对重要的数据，这些数据如果丢失可以通过其他途径重新建立。例如我的系统文件，如果系统出现问题可以马上恢复，要不然就要重新安装系统，各种软件。最麻烦的是要重新设置系统设定和所有软件的设定。对我来说简直就是灾难！
*  (A-) 就是指那些我想要保存的，如果丢失，它们可以通过其他渠道重新获得。例如一些软件安装文件，电影，电视剧等。

对于A+级别的数据，我的处理方式是将其存放在配置为RAID-1的NAS Storage。作为日常存放地点，NAS既访问方便，又能提供数据的可靠性。除此之外，我会每半年做一次数据备份，备份到我的一些小硬盘上，每次备份使用不同的硬盘，两块硬盘重复使用。这样就有4块硬盘保存我的数据，可靠性提高4倍。

对于A级别的数据，我的处理方式很简单，就是保证每天对系统进行备份，实现这点对于Mac用户来说非常简单，Time Machine。我每天都会对我的Mac至少进行一次Time Machine备份。我的备份方式是将我的MacBook Pro备份到我的Mac mini上，因为我的Mac mini安装了OS X Server，它提供Time Machine功能。我的Mac mini会不定期的备份到提供Time Machine功能的NAS上。我这么做的原因是Mac mini配合OS X Server能够提供更快的备份速度，比我的NAS要快至少1倍。因为我日常使用的是MacBook Pro，我需要快速备份。而我的Mac mini是一个24小时不间断运行的Server，它可以在任何时刻做备份，不需要对速度有要求。所以这种配置既可以保证我使用MacBook Pro时将备份造成的影响降到最低，而且也能同时保证所有的Mac都能够得到备份。

对于A-级别的数据，我的处理方式更加灵活。它可以放到任何地方，空间不足完全可以删除。它不做任何备份。

这是我目前的做法，今年我打算对我的数据存储系统进行一次升级，扩充我的存储容量，提高存储速度，对A+级别的数据提供异地容灾。经过一段时间的Research我决定使用两款设备来实现我的需求。

*   [Synology DS1813+](http://www.amazon.com/Synology-DiskStation-Diskless-Attached-DS1813/dp/B00CRB53CU/ref=sr_1_1?ie=UTF8&qid=1390486817&sr=8-1&keywords=ds1813%2B) 替换我现有的[Western Digital My Book World Edition II](http://www.amazon.com/gp/product/B004T7Q2Y8/ref=oh_details_o01_s00_i00?ie=UTF8&psc=1)。这款Synology的NAS属于中小企业级产品，其读写速度都在100M以上（[Performance测试数据](http://www.synology.com/en-global/products/performance/#five_to_twelve_bay)）。而且支持Apple的Time Machine协议。这样我就可以将MacBook Pro直接备份到这款NAS上，不用绕道Mac mini了。这款NAS支持8个硬盘槽位，因此可以配置为SHR-2模式，既最大化了磁盘是一哦那个空间，更提供了冗余保证。
*   [Transporter Sync](http://www.filetransporter.com/why-transporter/#transporter-sync)我需要购买两个这款产品，一个放在自己家里，另外一个当到我的一个朋友的家里。因为Transporter支持文件自动同步，因此这款产品就解决了异地容灾的问题。不单单这些，Transporter Sync支持文件，文件夹自动同步。这对于像我一样有多台Mac的用户来说，保持每台Mac上的某些数据同步是一个很大的难题。Transporter就是为了解决这个问题而发明的产品。对我来说非常非常非常有意义。

把备份当成一个习惯，写个Reminder来提醒自己每天备份Time Machine，提醒自己每半个月进行一次脱机备份。其实一点也不复杂，而且不会占用很多时间。Do it now!
