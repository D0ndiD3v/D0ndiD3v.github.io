---
title: 'Notes on a species that can barely walk'
description: 'First devlog: what this blog is, why my spiders looked like headcrabs, and how a favorite color survives generations.'
pubDate: 2026-08-30
size: 'large'
heroImage: '../../assets/4legissuespreview.png'
tags: ['spider-sim', 'devlog', 'gait', 'godot']
---

The main idea for this post is presenting a problem I stumbled across, what I tried to get rid of it, and what I finally landed on. I'm not afraid to show my mistakes, better yet, I want to include them here, to help me track my progress better, and to flesh out difficulties of making a simulator such as this one.

## The bunny-hopping problem

The main issue was the way my spiders walked. The unfortunate reality was that they took their steps in unison, the steps weren't staggered at all, and it gave the impression that the spiders were jumping or bunnyhopping, or at least that's something i'd like to say, but it was more than that. Since the body of the spider is hovering at a constant height, the whole animation seemed very artificial and simply weird, legs flailing about, while the body stayed completely still, simply gliding in one direction. It made me feel uneasy, but it had a certain vibe to it, especially the four-legged spiders, those ones reminded me very much of *Half-Life*'s headcrabs, just simple little blob-shaped creatures roaming about.

<span class="margin-note">That was an interesting sight, I'm sure I've seen something like that already, I thought to myself.</span>

## Why they all stepped together

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

Here is how the legs are getting split into two alternating groups:

```csharp
int pairIndex = index / 2;
int sideBit = legData.Side > 0 ? 0 : 1;
bool delayed = (pairIndex + sideBit) % 2 == 1;
```

And this is what the grouping actually does for the gait:

```csharp
if (!leg.IsDelayedGroup)
{
    StartStep(leg, target);
}
else
{
    leg.PendingDelay -= dt;
    if (leg.PendingDelay <= 0f)
        StartStep(leg, target);
}
```

</details>

Simply speaking, the legs moved at the same time, because they were built to do it that way, a number crosses a certain threshold, the leg takes a step, the problem was that the spiders were moving more or less straight, which meant that sets of legs crossed the threshold at the same time, thus making both legs move at the same time. The answer to that was surprisingly simple once I dismantled that thought in my head, just stagger the steps by adding an arbitrary number, and hey, it worked. Simply adding a slight offset helped the gait immensely, so much so that it was actually bearable to watch the spiders move around the planet for once. It's not perfect though, some configurations still look a little off, and I won't pretend this is solved. Nonetheless it's a *step* in the right direction, and for a first real fix, I'll count it as a win.

## Color, and why it's inherited

On a side note, spiders now inherit their coloring. Body hue is shared across a lineage, with body and leg saturation set up in a way so the two don't collapse into the same shade. The reasoning behind that was less technical than it sounds, I wanted tracking a lineage to feel more *personal*.

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

`BodyGenome.cs` has a shared `Hue` gene, plus `BodySatVal` and `LegSatVal`, with `UpdateColors()` deriving the actual segment and leg colors from them. The values are set to arbitrary numbers for now, meaning no fancy curve, just "don't let them turn muddy." It works for where the project's at.

```csharp
public float Hue = 0.08f;
public float BodySatVal = 0.6f;
public float LegSatVal = 0.3f;
public Color LegColor;
```
```csharp
public void UpdateColors()
{
    Segments[0].Color = Color.FromHsv(Hue, BodySatVal, BodySatVal);
    LegColor = Color.FromHsv(Hue, LegSatVal, LegSatVal);
}
```

</details>

If color carries forward through generations, you can watch a lineage drift, and honestly, you can also just root for whichever one you like best. We all have a favorite color, and I'm not going to pretend I'd be neutral about which one wins.

<span class="margin-note">I can't make one of the colors better, I'm not-... actually... I am the one in charge of this!</span>

## What's next

More of this, obviously! Problems, half-fixes, the occasional actual solution. Neither the gait nor the color is done, the planet they're all crawling around on isn't looking the best either, and that's what makes it beautiful.