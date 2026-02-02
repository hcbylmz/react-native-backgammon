---
name: general
description: This is a new rule
---

# Overview

Insert overview text here. The agent will only see this should they choose to apply the rule.

- Components should be at most 250 lines.
- Follow the react native and expo best practices.
- Use expo related packages.
- runOnjs and runOnUi deprecated do not use them. They cause crashes in React Native Reanimated. Instead, use state-based callbacks: store callbacks in refs and trigger them via useEffect when animation state changes, or use setTimeout with estimated durations to clear animations and trigger callbacks.
- use Reanimated not Animated from React Native.
- For Reanimated animations: never call runOnJS inside animation callbacks. Use useEffect to watch animation state changes and execute callbacks when animations complete. Store pending callbacks in refs.
- Use folder structure to kep files organized.
- Make changes as small as possible.
- Do not put comments unless it is very complex logic or some hacky ways to do it.
- Use folders to organize files.
- Never use touchableopacity.
- Do not change layout or game related things when added debug related items. 
- Debug related items should be small icons with fixed position.
- Safeareaview from the react native deprecated. ıf you want to use maybe use external package.
- Do not add jsdoc documentation.
- Always do changes to landscape mode.
- Create reusable components if it is possible and reuse them. Always look for before create a new compoenent if there is a previously created component.