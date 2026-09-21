---
title: 'Duct tape and zip ties'
description: 'A gait fix that works, a root cause that is still missing, and why that bothers me more than it probably should.'
pubDate: 2026-09-03
size: 'wide'
tags: ['spider-sim', 'devlog', 'gait', 'godot']
---

Some issues are solved by a simple solution, this certainly wasn't one of them, and I'm not sure whether I actually understand it yet.

## Legs in the wrong place

The problem itself was that the legs seemed to be simply offset in relation to the spiders body. Picture a chair, but it's certainly not the regular dining one, imagine that the front legs end somewhere under where the rear legs *start*, and the rear legs end about the seat's length behind where they should be touching the ground. That wasn't a look I anticipated and it surely surprised me.

<span class="margin-note">One small update, and boom, the spiders looked like someone gave them to a kid and they had petted them a bit too hard.</span>

## Checking the math, over and over, finding nothing

This is the part that frustrated me the most, every time I thought I've found the problem, it turned out to be a dead end. I was adjusting numbers, rechecking the stride math a dozen times. I even tried flipping signs, adding a minus, rewriting the maths and yet none of it helped.

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

```csharp
Vector3 femurDirLocal = new Vector3(leg.Side * leg.FemurDir.X, leg.FemurDir.Y, leg.FemurDir.Z).Normalized();
Vector3 tibiaDirLocal = new Vector3(leg.Side * leg.TibiaDir.X, leg.TibiaDir.Y, leg.TibiaDir.Z).Normalized();
Vector3 naturalOffsetLocal = femurDirLocal * leg.FemurLength + tibiaDirLocal * leg.TibiaLength;
```
```csharp
Vector3 localVelocity = basisInv * hipVelocity;
Vector3 anticipationLocal = new Vector3(localVelocity.X, localVelocity.Y, 0f) * StrideAnticipation;
```

The suspects were, in order: stride-anticipation sign flips, per-leg anticipation bias, but unfortunately neither one changed the output. Eventually I confirmed, by printing the actual values in the console, that the `naturalOffsetLocal` was symmetric all along. I knew the math wasn't lying to me. I still don't fully know what else that could be, maybe it's an order of operations thing, some step happening before or after it should, or maybe the mistake is mine in a way I just haven't noticed. Any of those feel plausible, and yet none of them feel confirmed.

</details>

## The fix, and why it bothers me

The final solution I came up with, for now, was adding a flat manual offset to counteract this bug I was facing. I simply added a `-0.8` on top of already existing math, and it seemed to look fine. I hate that solution but I'd much rather focus on something else and come back to it once I get new ideas than fight with a problem I don't understand.

<span class="margin-note">Obviously this is just a small bandaid placed over a badly scratched knee, just serving as a temporary cover up to the actual problem I haven't managed to solve yet.</span>

What's bugging me the most, is that this isn't a proper fix, it's just duct tape and zip ties put up to hold everything in place. It's "there's a problem, what's the fastest way to make it *look* fine?", and not an explanation of why the legs weren't working in the first place. I'm sure the actual cause is still somewhere in the code, and I've chosen, at least for now, to cover it instead of actually resolving the issue.

## What's next

I'd like to actually understand this issue before I touch legs again, rather than build more on top of a fix I don't trust. Until then, the gait's steady enough that I won't be bothered by it while working on other things. I just know it's not the version I actually pictured, and that's also why the whole procedural leg system is on my list for a proper rework later. Not because it doesn't work, it does, and it looks acceptable on screen right now, but it was never meant to end here. This is a stand-in for the version I originally pictured, not that version itself.
