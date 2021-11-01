Title: MPC-style 16 levels as an Ableton Live Rack
Slug: 16-levels
Date: 2021-03-28
Status: published
Summary: 16 levels coming to your MIDI controller.

Ableton Push has a 16 levels mode. Live does not. Why? That's beyond me. For quite a few days now,
I've been looking online for a plug-and-play solution to fill this void left in me by the MPC.
Turns out I had to make one *myself*.

## Usage

Just drag the instrument/MIDI rack into a MIDI track, then drop an instrument (presumably a sampler)
onto the **Drop Instrument Here** field.

![Rack preview image][rack_preview]

**Simpler/Sampler**: make sure **Vol < Vel** is set to **100%**, so the rack takes over velocity
control.

![Vol < Vel image][vol_vel]

**That's it!** Your sample is now in **16 levels mode**.

---

## Download

I tested this on Ableton Live 10.0.1 but it should be easy enough to port it to older/newer
versions, was there any need.

- As a whole: \[[Download Instrument rack + MIDI rack][pack_download]\]
- Separately: \[[Instrument rack][instrument_download]\] + \[[MIDI rack][midi_download]\]

## Macros and tweaks

The only 2 macros I needed when using this were **Post Gain** and **Base**. I'd say **Post Gain**
is pretty self-explanatory. If there's too much gain - *lower it*; too little - *add it*.

When changing **Base** macro, make sure to check if any **In Base** MIDI effects
*(MIDI rack -> Chain list -> Key -> In Base)* need a transposition (usually only one).

![In Base Transpose image][in_base_transpose]

### Starting note issues

I suppose pads on some controllers might not start at C<sub>1</sub>. You can fix that by going into
*(MIDI rack -> Chain list -> Key)*, selecting all keys (Ctrl + A) and moving the zones wherever fits
your controller.

![Moving zones image][moving_zones]

---

## How it's made

If you're interested in the insides of the rack, they're quite straightforward.

Every pad (C1 through D♯2) is bound to a separate chain with fixed velocity (depending on key) and
fixed note (**Base**). Everything is then wrapped in an instrument rack with a couple of useful
macros.

### Selecting velocities

Right now velocities are spread linearly like so (see V1 series):

![Velocities image][velocity_per_pad]

In version 0 (see V0 series) pads with lowest velocity were pretty much useless, hence the offset.

## Caveats

Unfortunately, once you transfer a sound into 16 levels it's not that simple to go back. This
leaves the sampler as a separate track. I might figure this out in the future.


[pack_download]: {static}/files/16-levels/.keep
[instrument_download]: {static}/files/16-levels/.keep
[midi_download]: {static}/files/16-levels/.keep
[velocity_per_pad]: {static}/images/16-levels/velocity_per_pad.png
[rack_preview]: {static}/images/16-levels/rack_preview.png
[vol_vel]: {static}/images/16-levels/vol_vel.png
[in_base_transpose]: {static}/images/16-levels/in_base_transpose.png
[moving_zones]: {static}/images/16-levels/moving_zones.png

