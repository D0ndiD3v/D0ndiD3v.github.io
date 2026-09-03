---
title: 'Duct tape and zip ties'
description: 'A gait fix that works, a root cause that is still missing, and why that bothers me more than it probably should.'
pubDate: 2026-09-03
size: 'wide'
tags: ['spider-sim', 'devlog', 'gait', 'godot']
---

Some issues end with a clean answer. This one didn't, and I'm still not entirely sure I understand it yet.

## Legs in the wrong place

Picture a chair. Four legs, each starting at a corner of the seat. Now imagine the front two legs' feet ending up somewhere under where the back legs *start*, and the back legs' feet landing a whole seat-length *behind* the seat itself. That's roughly what my spiders' legs were doing, feet dragging way behind where the body's actual center of mass sat, like the whole understructure had been stretched backwards and nobody told the body.

<span class="margin-note">One small update, and boom, the spiders looked like someone gave them to a kid and they had petted them a bit too hard.</span>

## Checking the math, over and over, finding nothing

This is the part that actually frustrated me the most. Every time I thought I'd spotted the cause, changing it did close to nothing. I went through the stride math a few times over and couldn't find a discrepancy. Neither an obvious minus sign, nor an obviously wrong number.

<details>
<summary><strong>For the code-curious</strong> — click to expand</summary>

The suspects were, in order: stride-anticipation sign flips, per-leg anticipation bias. Neither one moved the needle. Eventually I confirmed, by printing the actual values, that the base natural-stance math (`naturalOffsetLocal`) was symmetric front-to-back all along. The math wasn't lying to me. Something else was.

</details>

I still don't fully know what that something else is. Maybe it's an order of operations thing, some step happening before or after it should. Maybe there's an offset somewhere I don't understand the full effect of yet. Maybe the mistake is mine in a way I just haven't noticed. Any of those feels plausible, and yet none of them feels confirmed.

## The fix, and why it bothers me

What I landed on is a flat manual offset, `GlobalForwardBias`, added on top of everything else, independent of the real stride math. `-0.8` looks right. It works. Great.

<span class="margin-note">Obviously this is just a small bandaid placed over a badly scratched knee, just serving as a temporary cover up to the actual problem I haven't managed to solve yet.</span>

And it bugs me the most. This isn't a fix, it's duct tape and zip ties. It's "there's a problem, what's the fastest way to make it *look* fine?", and not an explanation of why the legs were wrong in the first place. I know the actual cause is still sitting somewhere in the code, and I've chosen, at least for now, to cover it instead of actually finding the cause.

That's also why the whole procedural leg system is on my list for a proper rework later, especially now. Not because it doesn't work, it does, and it looks acceptable on screen right now. But it was never meant to end here. This is a stand-in for the version I originally pictured, not that version itself.

## What's next

I'd like to actually understand this issue before I touch legs again, rather than build more on top of a fix I don't trust. Until then, the gait's steady enough that I won't be fighting it while working on other things. I just know it's not the version I actually pictured.