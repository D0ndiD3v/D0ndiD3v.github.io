---
title: 'Notes on a species that can barely walk'
description: 'First devlog: what this blog is, why my spiders looked like headcrabs, and how a favorite color survives generations.'
pubDate: 2026-08-30
size: 'large'
heroImage: '../../assets/4legsissuespreview.png'
tags: ['spider-sim', 'devlog', 'godot']
---

This is going to be mostly this: a problem, what I tried, why I landed where I did. Expect dead ends and hurdles as often as clean wins. First one's about legs and a little bit about color.

## The bunny-hopping problem

For a while, my spiders had a slight *problem*. The legs moved, but the body, well... didn't. Every set of legs took their step in perfect unison, which meant the whole gait looked less like walking and more like a slightly panicked bunny, hopping through the grass, except the body never actually hopped. It just sat there, hovering calmly, while four legs flailed beside it like an afterthought.

<span class="margin-note">That was an interesting sight, I'm sure i've seen something like that already, I thought to myself.</span>

Visually, the closest comparison I keep coming back to is *Half-Life*'s headcrabs, simply a blob-shaped little insect(?). It was not a creature that used its legs, but a creature which legs were simply *near*.

## Why?: they all stepped together

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

The default procedural leg movement had every leg evaluating its step timing against the same threshold at the same time. No offset, no stagger, so when one leg decided it was time to step, they all (or sometimes just most) did. The fix was a `ThresholdMultiplier` per leg, alternating a small positive/negative variance based on whether the leg's index is even or odd. Nothing that extraordinary, but just enough to break the harmony.

</details>

The actual fix, once I stopped overthinking it, was almost embarrassingly simple: **stop letting them agree.** If every leg steps on its own slightly-offset schedule instead of a shared one, the harmony gets disrupted, and the gait stops reading as *one blob doing four things at once* and starts reading as *one blob doing one thing with four legs.*

It's not perfect. Some configurations still look a little off - I can't and won't pretend this is solved. But it's a *step* in the right direction, and for a first real fix, I'll take it as a win.

## Color, and why it's inherited

Separately, spiders now inherit their coloring. Body hue is shared across a lineage, with body and leg saturation/value clamped in opposite directions so the two don't collapse into the same shade.

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

`BodyGenome.cs` has a shared `Hue` gene, plus `BodySatVal` (clamped >=0.5) and `LegSatVal` (clamped <=0.5), with `UpdateColors()` deriving the actual segment and leg colors from them. Mutation perturbs each independently. The clamps are simple range checks for now, meaning no fancy curve, just "don't let this go below/above x." It works for where the project's at.

</details>

The reasoning was less technical than it sounds: I wanted tracking a lineage to feel *personal*. If color carries forward through generations, you can watch a bloodline drift, and honestly, you can also just root for whichever one you like best. We all have a favorite color. I'm not going to pretend I'd be neutral about which one wins.

<span class="margin-note">I can't make one of the colors better, I'm not-... actually... I am the one in charge of this!</span>

## What's next?

More of this, obviously! Problems, half-fixes, the occasional actual solution. Gait's not done. Color's not done. Neither is the planet they're all crawling around on, and that's what makes it beautiful.