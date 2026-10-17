# Changelog

All notable changes to Potato Quiz. Versions follow `major.minor.patch`:
**minor** for new features or question batches, **patch** for fixes and small tweaks.

## 3.0.0 — 2026-10-17
A big update from playtesting.

**Items**
- **Fairer item drops.** Question prizes used to come only from the hot-streak list, so Exodia was the only Legendary prize, while Nuke, Swap and the other comeback items could only come from cold streaks and rarely appeared. Now every item can be a prize, and each item's chance comes from its rarity: any single Legendary is rarer than any single Rare. An item that already showed up in a game is half as likely to show up again. Item sources reset to the new defaults once.
- **Separate streak lengths:** hot streaks (right answers) still give items at 3, 5 and 7; cold streaks (wrong answers) now give comeback items at **2, 4 and 6**. Both are in Settings › Items.
- **Last-place boost:** from round 11 on, whoever is in last place at the start of each round gets a free Common cold-streak item. Change the round (or turn it off) in Settings › Items.
- Question prize chance is now **35%** per button (was 20%).
- **Using an item again stacks:** Skip Turn, Hard Lock, Category Lock and Beginner's Luck add more turns instead of resetting.
- **Category Lock on yourself:** lock yourself into a favorite category for 1 turn.
- **New Category Lock screen:** families as tidy cards in A–Z order, tap one to see its categories, or search them all.
- **Beginner's Luck** now lasts 5 *turns*, and it's obvious when it's on: the easiest difficulty glows and shows the doubled points (e.g. ~~2~~ → 4), with a banner and a glowing badge on the scoreboard.
- Nuke now rounds the average **up**, and its description says so.
- Settings › Items › Item list has **Tick all / Untick all** and **Reset items to default**.

**Scoreboard**
- **Streak tracker:** each player shows their last 5 answers as ✓/✗ dots and a meter filling up toward their next streak item. A player one answer away from an item glows and gets a "1 more = item!" tag.

**Setup**
- **Categories fold away** so Recent players sits right under the player list. Click "Categories in this game" to open it.
- **🔞 After Dark (18+):** a new adults-only family with 369 questions (sex, dating, partying, raunchy movies, TV and music). It's hidden and off until someone switches on **After Dark** on the setup screen, which asks for a quick confirmation.

**Sound & timer**
- New sounds for the game starting, each new turn and each question appearing, plus soft hover and click ticks on buttons (turn those off separately in Settings › Effects).
- The timer warning now starts at **10 seconds** (was 5) and can be changed in Settings › Timer.

**Questions**
- **11,074 new questions**, bringing the bank to **29,499**. The biggest additions are Anime, General Knowledge, Video Games and Movies. Pokémon was left alone.
- **55 new sub-categories** across the families, for example Isekai, Mecha, Horror Games, Indie Games, Rom-Coms & Musicals, Myths & Legends, Board & Card Games, Ice Hockey, Pro Wrestling, AI & Robots and Streaming Originals. About 1,450 existing questions moved into them.
- Categories with no good fresh material left were stopped early instead of padded. New questions were checked against the whole bank and against each other for repeats.
- The 🌍 Culture button now switches only the regional and ethnic culture families, not Pop Culture.

## 2.3.1 — 2026-10-16
- **Click an answer, then Next:** clicking a multiple-choice answer now scores it right away ("🎉 Correct! +4" or "❌ Wrong") and shows a single **Next** button. A small "Change result" link brings back the Correct/Wrong buttons if someone clicked by mistake.
- **Ended games don't count:** games ended with ✕ End game no longer add to players' Games or Wins. Answers and item use from that game still count.
- Groundwork for new sub-categories coming in the next question update. They stay hidden until they have questions.

## 2.3.0 — 2026-10-16
Playtest improvements:
- **Click an answer:** players can tap a multiple-choice answer instead of pressing Reveal. Their pick is marked, wrong picks turn red, and the matching Correct/Wrong button is highlighted for the host to confirm. The Reveal button still works too.
- **Late answers:** when the timer runs out, the host can still mark the answer correct if a player called it in time. On by default; turn it off in Settings › Timer.
- **🌍 Culture on/off** button on the setup screen turns all the regional Culture families on or off at once.
- **Bigger item icons** on item cards and on the scoreboard.
- **Phone a Friend** no longer appears in 2-player games, since the only "friend" would be your opponent.

## 2.2.0 — 2026-10-16
- **New Animals family** with 8 categories: General, Mammals, Birds, Ocean Life, Reptiles & Amphibians, Insects & Bugs, Pets & Dog Breeds, and Dinosaurs & Prehistoric (296 questions).
- **7,754 new questions** across every family. The bank is now 18,425 questions, and each family grew by about 240–300. Thin categories got the most, such as History › General, Disney › General, TV › General, Cartoons and Horror.
- Quality first: categories with no good fresh material left were stopped early instead of padded. Every new question was checked against the whole bank for repeats and for "giveaway" answers that echo the category name.
- Fixed two wrong Pokémon answers (Katy's gym type, Sandy Shocks).

## 2.1.3 — 2026-10-16
- **Item sounds:** earning an item now plays a louder power-up sound right away, using an item plays a whoosh-and-zap, and a Shield block plays a clank. You can preview them in Settings › Effects.
- Groundwork for the upcoming **Animals** family. Its categories stay hidden until questions arrive.

## 2.1.2 — 2026-10-16
- A failed Exodia now costs **half your points**, rounded in your favor, instead of all of them.
- New Exodia stats: the Players tab shows how many times each player used and won with Exodia, plus how many times Exodia has been completed overall. The Items tab shows Exodia attempts, completions and failures.

## 2.1.1 — 2026-10-16
- Question prizes now start only after the first **3 rounds**, so nobody gets items too early. Change it in Settings › Items › Question prizes › "Start after" (0 = from the first round).

## 2.1.0 — 2026-10-16
- **4,142 new questions**, so popular families repeat far less. The bank is now 10,671 questions. Each of these families now has about 1,000:

  | Family | Before | Now |
  |---|---|---|
  | Anime | 214 | 980 |
  | Food | 248 | 982 |
  | Music | 364 | 991 |
  | Pokémon | 365 | 985 |
  | Video Games | 237 | 991 |
  | Pop Culture | 343 | 984 |

- Thin sub-categories got the most new questions: every Pokémon region now has about 100, and categories like Naruto, One Piece, Baking & Desserts and Hip-Hop & R&B grew several-fold.
- Every new question has 5 wrong answers, so it works in 4-answer, 6-answer and no-choices games.
- New questions arrive automatically. Your own edits, deletions and added questions are kept.

## 2.0.3 — 2026-10-16
- **Question prizes reworked:** on a trailing player's turn, each difficulty (or category) button rolls the prize chance (20% by default) once. A button that wins shows a glowing 🎁 with the item's icon, so players can see the prize and choose that question. Pick it and answer correctly to keep the item. Never on Random, Gamble, locked turns or Exodia.
- Moved 38 questions whose category gave away the answer. For example, Finding Nemo and Willy Wonka's dentist father are no longer under Dentistry, "Which sport is played at Wimbledon?" is no longer under Tennis, and "Which country…?" questions no longer sit in that country's own category.
- Fixed: the box of Pokémon Black shows Reshiram, not Zekrom.

## 2.0.2 — 2026-10-16
- Category lists no longer repeat the group name: under Food you now see "Drinks", not "Food: Drinks".
- Categories inside each group are now strictly A–Z (General included), both in Edit Questions and on the setup screen.

## 2.0.1 — 2026-10-16
- Edit Questions now lists categories in the same order as the setup screen: groups A–Z, each group's General category first, then A–Z. Ungrouped categories come last under "Other". This applies to the category filter, the question form, and the Categories tab.

## 2.0.0 — 2026-10-16
- **New save format:** the question bank now lives in its own file, `questions.json`, and each browser saves only your changes (edited, deleted and added questions, plus settings, categories and tiers). A save is now about 15 KB instead of 1.5 MB, so the bank can keep growing without hitting the browser's storage limit.
- New starter questions and fixes now reach everyone automatically. If you edited a question yourself, your version is kept.
- Existing saves convert automatically the first time you open 2.0. Your edits, deletions and own questions are kept.
- Settings › Data now has two reset buttons: **Reset settings** (settings only, questions untouched) and **Reset everything** (also undoes all question changes and deletes questions you added). Reset everything shows exactly what will change, offers a backup export first, and asks twice.
- Setup screen: category families are now **collapsible rows in A–Z order** (each family's General category first, then its categories A–Z). Tap the arrow to show a family's categories, or use **Expand all / Collapse all**. Each row shows how many of its categories are on.
- The game needs the website (or a local web server) to load questions. Opening the HTML file straight from your computer no longer works.

## 1.9.0 — 2026-10-16
- **No-choices mode:** a third option on the setup screen hides all answers. Players say their answer out loud, then reveal it and mark it right or wrong.
- Every starter question now has **5 wrong answers**, so 6-answer games use written options instead of auto-picked ones. Saved games pick them up automatically unless you changed that question's wrong answers.
- New **Reset all settings to default** button (Settings › Data). Questions, categories, tiers, players and stats are kept.
- Settings layout cleaned up: clearer sections and aligned inputs on the Game and Items tabs.
- Random bonus is back to **1 point** by default, so it stays below an Easy question. Saves still on 2 switch back automatically.

## 1.8.0 — 2026-10-16
- **6-answer mode:** on the setup screen, choose 4 answers (normal) or 6 (harder). Questions without their own extra wrong answers get look-alike answers picked automatically.
- Question editor has 2 optional extra wrong answers, used only in 6-answer games.
- **Question prizes:** players in the bottom half of the scores have a 20% chance that a question they pick (not Random or Gamble) carries an item. Get it right to keep it. Turn it on or off, set the chance, and choose which items can be prizes in Settings.
- **Item rarity:** items are Common, Rare or Legendary. Rarer items show up less often (60 / 30 / 10 by default). You can change an item's rarity and the weights in Settings.
- **Item stats:** a new Items tab on the Stats screen shows how often each item showed up, was earned, used, or still held when a game ended.
- Edit Questions can filter by question type: multiple choice, open answer, picture, audio clip, or no media.
- Settings are now split into tabs (Game, Items, Timer, Effects, Data), which is easier on phones.
- Gamble cooldown now counts turns to wait: 1 by default, and 0 means no cooldown. Saved settings convert automatically and behave the same.

## 1.7.0 — 2026-10-16
- **Points doubled** so scores stay even: Easy 2, Medium 4, Hard 6, Obscure 10. Default win target is now **60**.
- Items doubled to match: Pickpocket steals 2/4/6, Heist 6/8/10, Blue Shell −10; Random bonus is +2.
- Saved settings still on the old defaults switch over automatically; custom values are kept.
- New Gamble setting (on by default): after a Gamble, a player must get a regular question right before gambling again.
- Edit Questions now opens filtered to **Uncategorized**, so it loads instantly and shows questions that still need a category.

## 1.6.1 — 2026-10-16
- The game now shows its version number on the main menu, with a link to this changelog.
- Added this changelog.

## 1.6.0 — 2026-10-16
- Stats screen now has **Players** and **Questions** tabs.
- Questions tab ranks the top 10, 50 or 100 questions answered most often **correctly**, most often **incorrectly**, or **seen** the most.
- Edit Questions keeps the sortable **Seen** column; % correct moved to Stats.

## 1.5.0 — 2026-10-16
- **Question counter:** every question tracks how often it's been shown and answered correctly. Questions seen more often are drawn less, to cut down on repeats.
- New **📊 Stats** screen: games, wins, win %, correct, incorrect and % correct for each player.
- Reset buttons for question counts (Settings) and player stats (Stats).
- Exodia now skews toward hard tiers for any number of tiers (3 tiers: Easy → Medium → Medium → Hard → Hard).

## 1.4.0 — 2026-10-16
- Seven new regional culture families with 760 questions: European, African, South American, Central American & Caribbean, Middle Eastern, Oceania & Pacific, and North American Culture.
- Difficulty tiers are now a **ranked list**: drag them into order (easiest at the top). The order, not the points, drives Exodia, Hard Lock and Beginner's Luck.
- Removed the "Bonus" tier option. Hard Lock now always uses the hardest tier.
- Setup screen: switch **difficulties** on or off for a game; Hard Lock, Exodia and Beginner's Luck adapt.

## 1.3.0 — 2026-10-16
- Sports expanded with Cricket, Rugby, Tennis, Golf, Winter Sports, Track & Field, Swimming & Water Sports, Combat Sports, Esports, and Archery & Target Sports (400 new questions).
- 135 pre-1990 questions most players wouldn't know moved up to Obscure.
- Setup screen: **Turn all off** button for categories.

## 1.2.0 — 2026-10-16
- Every category now belongs to a family: new **General Knowledge**, **Cars** and **Pop Culture** families; American Actors joined Movies and Space & Astronomy joined Science.

## 1.1.0 — 2026-10-16
- **Category families:** pick a family (e.g. Pokémon) then a sub-category, or "Any".
- Split Pokémon (by region), Video Games, Anime, Science, Sports, History, Movies, Music, TV, Math, Geography, Technology, Disney, Food and Asian Culture into sub-categories.
- New Generations family (Boomers, Gen X, Millennial, Gen-Z, Gen Alpha), Disney+ Shows and Theme Parks; 727 new questions.

## 1.0.1 — 2026-10-16
- Question preview now shows for 2.5 seconds by default.

## 1.0.0 — 2026-10-15
- First public release: 4,600+ questions across categories and four difficulty tiers (Easy, Medium, Hard, Obscure).
- Pick by difficulty or category, 🎲 Random (bonus point) and 🎰 Gamble (double or nothing, with a cooldown).
- 20+ streak items (Blue Shell, Exodia, Heist, Side Bet, Dodge the Bullet…), answer timer, question preview, round and turn indicators, sound effects and animations.
- Question editor with pictures and audio clips, categories and tiers; export/import backups.
