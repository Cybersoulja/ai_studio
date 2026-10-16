import { Compiler } from 'inkjs/full';
import { Story } from 'inkjs';

export interface InkStoryEvent {
  speaker?: string;
  sound?: 'beep' | 'levelUp' | 'unlock' | 'warp' | 'coffee';
  xp?: number;
  item?: string;
  avatar?: string;
  color?: string;
}

export interface InkDialogueEntry {
  id: string;
  speaker: string;
  text: string;
  tags: string[];
  event?: InkStoryEvent;
  choicesMade?: string;
}

export interface InkChoiceItem {
  index: number;
  text: string;
}

// Canonical Ink RPG scripts
export const INK_SCENARIOS = {
  mission1: {
    id: 'mission1',
    title: 'Incident JIRA-101: The OAuth Anomaly',
    category: 'Engineering Quest',
    difficulty: 'Cosmic P1',
    description: 'A rogue authentication race condition threatens to collapse the USS Hustle edge nodes.',
    inkScript: `
VAR xp_reward = 0
VAR crew_loyalty = 50

-> briefing

=== briefing ===
# speaker: Trill Astro Buzz
# sound: beep
COMMANDER! All hands to flight stations. Gravity is at 0%, but alarms in sector JIRA-101 are flashing crimson.
Our OAuth2 token refresh pipeline is experiencing a high-frequency race condition. The edge nodes are throwing 401 unauthenticated anomalies across orbit.
What are your orders?
* [Summon Nova Starwind for immediate code refactoring] -> nova_path
* [Have Vega Quantum perform a deep tachyon scan] -> vega_path
* [Instruct Orion Codex to raise the Plasma Shield] -> orion_path

=== nova_path ===
# speaker: Nova Starwind
# sound: warp
# xp: 35
Nova Starwind reporting, Commander! I can see the cyclomatic complexity from orbit.
Two asynchronous promises are attempting to refresh the bearer token simultaneously without an atomic mutex lock.
How should we restructure this architecture?
* [Implement an atomic mutex queue with token deduplication] -> nova_mutex
* [Deploy a distributed Redis token lease] -> nova_redis

=== nova_mutex ===
# speaker: Nova Starwind
# sound: levelUp
# xp: 60
Slingshot Refactor engaged! The mutex lock serializes concurrent callers and shares the single inflight token refresh.
The race condition vanishes. 400 lines of messy nested callbacks replaced by a clean async mutex.
* [Call Orion to verify the edge deployment] -> orion_verify
* [Claim mission victory and celebrate with coffee] -> victory_coffee

=== nova_redis ===
# speaker: Orion Codex
# sound: beep
# xp: 40
Orion Codex here. The Redis lease works, but introduces 18ms of unnecessary cloud roundtrip latency to our edge workers!
* [Pivot to Nova's in-memory atomic mutex instead] -> nova_mutex
* [Accept the latency and push to staging] -> orion_verify

=== vega_path ===
# speaker: Vega Quantum
# sound: beep
# xp: 30
Tachyon scanners calibrated! I am injecting edge-case fuzzing vectors into the gateway headers.
Fascinating: the race condition only manifests when token expiry timestamp lands precisely on a millisecond ending in zero!
* [Generate automated test fixtures to guard against regression] -> vega_tests
* [Patch the timestamp comparator directly] -> nova_mutex

=== vega_tests ===
# speaker: Vega Quantum
# sound: levelUp
# xp: 65
# item: Tachyon Crystal
12 hermetic test cases generated and passing green! Edge nodes are permanently shielded against concurrent token desynchronization.
I've extracted a high-purity Tachyon Crystal from the scan telemetry for your Cargo Bay.
* [Hand off to Atlas Comet for production rollout] -> atlas_rollout

=== orion_path ===
# speaker: Orion Codex
# sound: warp
# xp: 35
Plasma Shield at 100%! All inbound traffic is safely buffered in Cloudflare edge cache while we diagnose the core worker.
Zero dropped packets, zero 500 errors visible to users. We have breathing room, Commander.
* [Call Nova and Vega for a surgical joint hotfix] -> joint_hotfix
* [Initiate automatic blue-green rollback] -> rollback_path

=== joint_hotfix ===
# speaker: Nova Starwind
# sound: levelUp
# xp: 75
With Orion's plasma shield holding the perimeter, Vega and I neutralized the race condition in record time!
Clean code syntax locked and loaded.
* [Proceed to Atlas Comet for zero-downtime cutover] -> atlas_rollout

=== rollback_path ===
# speaker: Orion Codex
# sound: beep
# xp: 25
Previous stable container restored in 420 milliseconds. Fleet is operational, though the underlying bug remains logged for sprint triage.
* [Re-engage the anomaly with Nova Starwind] -> nova_path
* [Log tactical post-mortem with Zara Nebula] -> zara_sync

=== orion_verify ===
# speaker: Orion Codex
# sound: beep
# xp: 30
Preflight CI/CD pipelines verified green across all global regions! D1 database migrations applied with zero replication lag.
* [Hand off to Atlas Comet for zero-downtime cutover] -> atlas_rollout

=== atlas_rollout ===
# speaker: Atlas Comet
# sound: warp
# xp: 90
# item: Quantum Levitation Token
Zero Downtime Warp engaged! Multi-service release cutover deployed across 310 edge data centers without a single active connection drop.
Commander, that is how the Space Age Hustle ships destiny.
* [Return to bridge for debriefing] -> mission_complete

=== zara_sync ===
# speaker: Zara Nebula
# sound: beep
# xp: 45
Backlog synchronization complete. Post-mortem mapped into our Notion Story Nodes Matrix. Sprints rebalanced for velocity.
* [Celebrate with the crew] -> mission_complete

=== victory_coffee ===
# speaker: Trill Astro Buzz
# sound: coffee
# item: Quantum Coffee
# xp: 50
BY THE FLOATING NEBULAE! That was poetry in zero-gravity. Here is a fresh flask of Quantum Coffee, piping hot from the dark matter brewer.
* [Dock at Bridge Command] -> mission_complete

=== mission_complete ===
# speaker: Trill Astro Buzz
# sound: levelUp
# xp: 110
🚀 TRILL ASTRO BUZZ TRANSMISSION:
Sector JIRA-101 has returned to nominal state. You navigated your crew with precision, banked cosmic XP, and kept the fleet soaring.
"The grind never stops, Commander. Gravity is optional."
* [Re-run Simulation] -> briefing
* [Conclude Expedition] -> END
`
  },

  mission2: {
    id: 'mission2',
    title: 'The Dark Matter Coffee Heist',
    category: 'Crew Lore & Morale',
    difficulty: 'Cosmic Exploration',
    description: 'Trill Astro Buzz tracks a rare cosmic supply beacon rumored to hold unlimited espresso beans.',
    inkScript: `
-> start

=== start ===
# speaker: Trill Astro Buzz
# sound: coffee
Commander! Sensors detect an ancient cargo probe drifting through the Espresso Nebula.
My readings suggest it contains prime reserves of Dark Matter Coffee Beans. Energy levels across the fleet are at risk of dropping below optimal hustle levels.
Shall we investigate?
* [Set thrusters to maximum and pursue the probe] -> pursue
* [Have Zara check sprint deadlines first] -> zara_check

=== zara_check ===
# speaker: Zara Nebula
# sound: beep
Our sprint burndown chart has 3 days of buffer. I officially approve a 30-minute orbital coffee detour. Let's go!
* [Engage intercept course] -> pursue

=== pursue ===
# speaker: Vega Quantum
# sound: warp
# xp: 30
Warning: The probe is defended by an automated captcha gate and a maze of deprecated API tokens!
* [Deploy Vega's Tachyon Scan to decipher the tokens] -> vega_hack
* [Have Orion deploy brute-force plasma pulse] -> orion_blast

=== vega_hack ===
# speaker: Vega Quantum
# sound: levelUp
# xp: 50
# item: Tachyon Crystal
Tokens decrypted! The captcha gate collapsed. The airlock opens smoothly.
* [Board the probe and claim the payload] -> claim_beans

=== orion_blast ===
# speaker: Orion Codex
# sound: warp
# xp: 40
Plasma blast cracked the outer hatch! A bit noisy, but 100% effective.
* [Board the probe and claim the payload] -> claim_beans

=== claim_beans ===
# speaker: Trill Astro Buzz
# sound: coffee
# item: Quantum Coffee
# xp: 100
JACKPOT! 10 crates of pure roasted Dark Matter Coffee Beans secured.
The entire crew's energy reserves have been refueled to 100%. Velocity is restored!
* [Toast with Trill Astro Buzz and return to bridge] -> END
`
  },

  mission3: {
    id: 'mission3',
    title: 'Ghost in the Edge Worker: P1 Outage',
    category: 'DevOps Battle',
    difficulty: 'Critical Incident',
    description: 'An unknown memory leak in the Cloudflare D1 gateway triggers an orbital emergency.',
    inkScript: `
-> alert

=== alert ===
# speaker: Orion Codex
# sound: beep
RED ALERT, Commander! Cloudflare Workers memory utilization has spiked to 98% in the Tokyo and Frankfurt clusters!
Edge replicas are restarting in a cascade loop. We have 60 seconds before traffic degrades.
* [Trigger Atlas Comet's instant release warp to safe canary] -> atlas_canary
* [Deploy Nova Starwind to profile heap dumps in real time] -> nova_heap
* [Activate Vega's Tachyon memory leak analyzer] -> vega_analyzer

=== atlas_canary ===
# speaker: Atlas Comet
# sound: warp
# xp: 60
Zero Downtime Canary shifted 100% of global ingress to the Dublin and Oregon edge pods!
Memory pressure drops to 14%. The outage has been thwarted before users noticed!
* [Now let's find the root cause with Nova] -> nova_heap

=== nova_heap ===
# speaker: Nova Starwind
# sound: levelUp
# xp: 70
Found it! A global map inside the Telegram webhook listener was accumulating update IDs without an LRU eviction cap.
I've replaced it with a bounded RingBuffer with constant O(1) memory footprint.
* [Push the fix through Orion's Plasma Shield] -> orion_push

=== vega_analyzer ===
# speaker: Vega Quantum
# sound: levelUp
# xp: 50
Tachyon analysis confirms: memory growth was exactly 1.2MB per 1,000 Telegram updates.
Nova's RingBuffer fix resolves the leak completely.
* [Push the fix through Orion's Plasma Shield] -> orion_push

=== orion_push ===
# speaker: Orion Codex
# sound: levelUp
# xp: 85
# item: Quantum Levitation Token
Plasma Shield verified! All edge nodes green. Memory stable at 18MB across all 300+ regions.
A Quantum Levitation Token has been minted to commemorate zero production downtime during a P1 anomaly!
* [Broadcast mission transmission to fleet] -> final_transmission

=== final_transmission ===
# speaker: Trill Astro Buzz
# sound: warp
# xp: 95
TRILL ASTRO BUZZ TRANSMISSION:
Outage resolved with zero downtime and zero data loss. Commander and crew handled the incident with legendary grace.
"When in doubt: Commit, Deploy, and Repeat."
* [Mission Complete] -> END
`
  }
};

export class InkStoryEngine {
  private story: Story | null = null;
  private rawScript: string = '';

  constructor(rawInk: string) {
    this.loadScript(rawInk);
  }

  public loadScript(rawInk: string): boolean {
    try {
      this.rawScript = rawInk;
      const compiler = new Compiler(rawInk);
      this.story = compiler.Compile();
      return true;
    } catch (err) {
      console.error('Failed to compile Ink script:', err);
      return false;
    }
  }

  public canContinue(): boolean {
    return this.story ? this.story.canContinue : false;
  }

  public continueStory(): { text: string; tags: string[]; event?: InkStoryEvent } | null {
    if (!this.story || !this.story.canContinue) return null;

    const rawText = this.story.Continue() || '';
    const text = rawText.trim();
    const tags = this.story.currentTags || [];

    const event: InkStoryEvent = {};
    tags.forEach((tag) => {
      const [key, ...vals] = tag.split(':');
      const val = vals.join(':').trim();
      const lowerKey = key.trim().toLowerCase();

      if (lowerKey === 'speaker') event.speaker = val;
      else if (lowerKey === 'sound') event.sound = val as any;
      else if (lowerKey === 'xp') event.xp = parseInt(val, 10);
      else if (lowerKey === 'item') event.item = val;
    });

    return { text, tags, event };
  }

  public getChoices(): InkChoiceItem[] {
    if (!this.story) return [];
    return this.story.currentChoices.map((c) => ({
      index: c.index,
      text: c.text
    }));
  }

  public chooseChoice(index: number): boolean {
    if (!this.story || index < 0 || index >= this.story.currentChoices.length) {
      return false;
    }
    this.story.ChooseChoiceIndex(index);
    return true;
  }

  public saveState(): string {
    return this.story ? this.story.state.ToJson() : '';
  }

  public loadState(jsonState: string): boolean {
    if (!this.story || !jsonState) return false;
    try {
      this.story.state.LoadJson(jsonState);
      return true;
    } catch {
      return false;
    }
  }
}
