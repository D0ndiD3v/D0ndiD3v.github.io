---
title: 'Spiders can have kids now'
description: 'Real reproduction is live, the colors are the best part, and the population fluctuations already surprises me.'
pubDate: 2026-09-06
size: 'small'
tags: ['spider-sim', 'devlog', 'reproduction', 'godot']
---

Spiders can find each other, mate, and produce a genuine mix of both parents now. This is a bigger feature than the last two posts, and somehow the part I care about least is the part that made it possible.

## The part I actually watch

Two spiders near each other, both energized enough, roll the dice, and if it hits, a child spawns carrying a real blend of both genomes, not a clone with some noise added. The most visible result of that, by far, is color. Watch a lineage for a while and you can see it drift toward one shade. That's the part I keep looking at. I can't yet look inside a brain and watch connections form, that's still just a number somewhere out there, but I can watch a color lean one direction across generations, and that's oddly satisfying to just sit and observe.

<span class="margin-note">I would never thing I'd be so excited about spiders breeding, yet here I am, invading their privacy like some pervert.</span>

## It happened, just like that

I expected, I think, some kind of moment. Two spiders noticing each other, approaching, something to point at. That's not what happened. There's no real "finding" here yet, spiders that happen to be close enough just roll a chance to mate, and a child appears somewhere nearby. I didn't catch anything that felt like courtship, because there isn't any yet. That's a little anticlimactic to admit, but it's the honest state of it.

## What actually did surprise me

The population settling in. It plateaus somewhere around the low thirties/high twenties and doesn't push much past that, and when it dips below twenty, it recovers fast. Faster than I expected. That part genuinely worked the way I wanted it to.

<details>
<summary><strong>For the code-curious</strong> - click to expand</summary>

Reproduction cost scales with population, past a soft cap of 20 (set by me), each spider above that threshold makes reproducing slightly more expensive. It's a deliberate cost curve, not emergent scarcity. Over several minutes at 4x speed, population held in roughly an 18-28 band, which is exactly the equilibrium it was tuned to hit.

</details>

And that's also the part that bothers me. It works, but it works because I told it to, not because it grew out of anything the world actually simulates. A more honest version wouldn't need a soft-cap number at all, it would just be: more spiders, less food to go around per spider, some of them go hungry, population drops on its own. That's probably where this goes eventually. For now, I have a number that behaves correctly for reasons I made up.

## Why they can't see each other yet, on purpose

Spiders currently find mates by simple proximity, not the vision-cone system that already handles finding food. That's not an oversight, it was the point. I wanted to isolate one thing: does the reproduction system itself behave correctly, genomes mixing properly, cooldowns working, population responding the way it should, without also asking whether spiders can perceive each other in the first place. Vision already works for food. Extending it to spiders is a real next step, but it wasn't this test's job to prove that too.

## What's next

Real scarcity instead of an imposed cap, and eventually letting spiders actually see each other instead of just happening to be close. The population holds together for now. The colors keep drifting. Neither one required them to actually notice each other, and that's still the part I want to work on.