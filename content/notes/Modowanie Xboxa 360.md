Title: Modowanie Xbox 360
Slug: modowanie-xbox-360
Date: 2026-02-05
Modified: 2026-10-04
Summary: archive.org cli downloads
Status: published
Garden_status: seedling

---
topics:
  - "[[gierki]]"
---


An old 1TB SSD laying around, a 32 GB usb stick with reasonable transfer speed (→ [[#USB drives setup]]), a 16 GB USB stick with *unreasonably slow* transfer speed, and two pads from the box set (one has slight stick drifting).

> I’m also talking about my laptop being utterly unable to play any game released after… 2010? It doesn’t even have a proper graphics card, almost no internal storage left, and struggles with a couple VST-s running with Ableton Live. So this is kind of the other tangent of why I started tinkering with [[Pure Data]]. Getting my hands dirty, going low(er)-tech, admiring old games. I’ve had the experience of playing Skyrim while sick and out of school. What I didn’t know was missing is *the couch*. 

![[bxob.png]]

# Xbox 360 Slim – Setup
It turns out that I’ve stepped into the 360 modding landscape in its prime. Up to a couple months ago, there has been no **reliable** way of softmodding this console. The best route seemed to be using BadUpdate with Rock Band demo (sic!) as the exploit vector. I think this is a hypervisor exploit (completely no clue on what the exact attack is) that relies on a [[race condition]] with a 30% rate of success.  

> The exploit has a 30% success rate and can take up to 20 minutes to trigger successfully. If after 20 minutes the exploit hasn't triggered you'll need to power off your Xbox 360 console and repeat the process from step 5.
> 
> – https://github.com/grimdoomer/Xbox360BadUpdate 

I have read comments about how at peak bad luck people would sit for an hour waiting for their Xbox to start because of that. Oh, and it’s crucial to note that this is  **NOT a permanent exploit**. If you don’t want to flash the built-in NAND with a hardware mod (JTAG & RGH are the most common choices), you’ve got to run the exploit every time you boot the console. Yuck.

Enter, [ABadAvatar](https://github.com/shutterbug2000/ABadAvatar). An excellent BadUpdate fork that fully automates the process on login, while also ditching the old payload requirements (no wasting space for an unplayable demo).

**Basic setup** boils down to a single USB stick (permanently) plugged into an Xbox 360.

- FAT32 filesystem – easiest to achieve by plugging into an Xbox and using the built-in formatting tool. If not recognizable, this is a nice second step.
- ABadAvatar with [XeUnshackle](https://github.com/Byrom90/XeUnshackle/releases) as payload.
- Apps
	- [Aurora](https://consolemods.org/wiki/Xbox_360:Aurora) – Dashboard, set as the default application in `.ini`
	- [XeMenu 1.1](https://digiex.net/threads/xexmenu-1-1-download-xex-menu-iso-live-and-xex-file-manager-for-xbox-360.11096/) – quirky file manager. Functionally superior to the one built into Aurora. 
	- [Simple 360 NAND Flasher](https://consolemods.org/wiki/File:Simple_360_NAND_Flasher.7z) – just to dump some backup info
- NAND Backup → 
	- W ogóle się zastanawiam gdzie ten backup wrzucić. Na dwa dyski na pewno.
	- My hardware version is *Corona*.
- From what I understand this drive never gets modified after the initial setup, so I’ve just backed up the contents (less than 0.5 GB) in case the USB stick dies eventually.
- **VERY Important:** The Xbox cannot be connected to the internet while ABadAvatar is running. It will try to hit Xbox LIVE and will result in an instant ban. I’m not sure if there are more consequences to this, like the console bricking up entirely. But generally, since my connection is over WLAN and not LAN, I need to forget the network before turning off the console. 
	1. When you enter Aurora, or actually when *XeUnshackle* finishes its job, you can connect to the internet back because LIVE servers are blocked.
	2. It’s actually interesint that the xbox **knows**  they are blocked and not just unreachable. You can see that in the network test GUI.
	3. So I’m wondering if I could just use [[Pi-hole]] with some dedicated list to always block LIVE and not need to forget the network everytime. I’m just worried that at some point I will turn pi-hole off or use the xbox outside my local net. 
		- Albo może właśnie da się na samym routerze ustawić, że konkretny MAC (ciekawe czy te exploity nie zmieniają MAC-a) nie może się dobić do serwerów.
		- Tylko skąd wziąć tę listę? → Na pewno da się ogarnąć po tym jak to **aktualnie** blokuje
		- I z racji, że Pi-hole to jest DNS, to ważne jest to, czy w ogóle się korzysta z FQDN czy po prostu adresów ip, ale ta druga opcja brzmi jakoś nieprawdopodobnie.
				- W każdym razie może być DNS cache na xboxie, więc może być to utrudnione.

## USB drives setup
Ważną sprawą jest to, że jedynym wspieranym [[Filesystems|systemem plików]] jest FAT32. Więc wszelkie dyski USB (a to jest metoda modowania przecież) muszą być dokładnie w ten sposób sformatowane.

- Konsekwencją tego jest trochę rozkminka czy chcę przekształcić ten dysk WD Elements 1 TB (dysk tysionc) na FAT32, żeby nie trzeba było pośrednio jeszcze kopiować na pendrive’a. Teraz proces wygląda tak
	- Get the `.ISO` → dysk wewnętrzny (~8 GB)
	- Extract GOD (size ≤ ISO size) → od razu można na dysk zewnętrzny
		- I tu jest rozwidlenie, bo mógłbym po prostu to dać na pendrive’a, którego zaniosę do Xboxa, ale wrzucam to na WD, żeby mieć backup
- Gdyby WD był w FAT32, to nie mógłbym na niego wrzucić ISO
	- Co w pewnym sensie, z moim małym dyskiem wewnętrznym uniemożliwia workflow, że ściągam wiele gier i po kolei przerzucam ISO na WD, a potem odpalam na nich **naraz** iso2god.
- Ale szczerze, to wyobrażam sobie, że rzadko będę te gierki ściągał, a na NTFS ten dysk będzie miał lepszą żywotność. I mogę trzymać tam wtedy ISO i GOD obok siebie dla czytelności.

## So what can I do with this system now?
- Play some Xbox 360 titles → [[Instalacja gier na zmodowanym Xbox 360]]
	- With DLC’s, updates, and mods, if you’d fancy
- Run unsigned code and homebrew. 
- Move files **over FTP**. Which part of this whole setup enables it? It looks like an FTP plugin is installed for *Aurora?*
	- WinSCP seems to be the easiest choice as it’s Free and not Filezilla.
	- the static ip ends with `17`
- [ ] I just worked out how to install multi-disc games, so the next steps are OG Xbox titles and checking out emulation capabilities. SSX 3 here I come. Actually I should look carefully at the compatibility list https://consolemods.org/wiki/Xbox_360:Original_Xbox_Games_Compatibility_List
- [ ] **Is running PS1 games feasable?**
- Connect third-party controllers, apparently. Mine are working right now, but they might be dead at some point.


Some other games that I would love to play, but don’t have the hardware

- Shadow of the Colossus – PS2
	- I long to experience some game for the first time the same way I’ve had with Skyrim. Amazing atmospheric nature, slow pacing, open world. I’m chasing that since I can’t go hiking this year. Actually my snowboard trip to CZ was the closest I’ve had to Skyrim. Which sound nuts. But riding through a foggy forest in the mountains, trees bending under fresh snow… I think cross-country skis could be my thing. This year’s focus is on physical therapy and mobility training, so who knows maybe I will be able to run by the end of autumn.
	- With PS2 and Xbox 360 being the same gen, the hardware limitations are too strong for emulation overhead. I might end up buying a used PS3 but I’m resisting the urge now since there are *lots* of games for the 360.
- Pikmin 1 & 2 – Gamecube
	- Might get my hands on a Wii someday.

## Sources:
- [Console Mods Wiki](https://consolemods.org/wiki/Xbox_360:Xbox_360_Mods_Wiki)
- [How to Mod Any Xbox 360 with a USB Drive - Bad Update Beginner Setup for Homebrew, Backups, & More!](https://www.youtube.com/watch?v=S4xyqbkK51w)
- [ABadAvatar: Bad Update's Biggest Improvement Yet! - Upgrade & Usage Guide](https://www.youtube.com/watch?v=Aeebq-Tdh0k)

## Glossary
- GOD – Game on Demand
