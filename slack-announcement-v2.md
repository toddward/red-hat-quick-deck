# Slack Announcement — Red Hat Quick Deck v2

Copy the block below into Slack. Uses Slack mrkdwn formatting.

---

:mega: *Red Hat Quick Deck v2 is here* :mega:

The Quick Deck skill just got a major upgrade — your self-contained HTML slide decks now support *videos, memes, GIFs, and local images* alongside the cinematic Red Hat-branded slides you already know.

:clapper: *Video Slides*
Drop a YouTube or Vimeo link and get a beautiful thumbnail with a branded play button baked into your deck. Click to play inline when serving via HTTP, or opens YouTube in a new tab from local files. Direct `.mp4` files work everywhere.

:joy: *Meme & GIF Slides*
Paste an imgflip URL, a Giphy link, or any image URL. Full-resolution rendering, auto-format detection, and optional captions for maximum comedic delivery. Yes, your architecture review can now include a "This Is Fine" dog.

:frame_with_picture: *Local Image Support*
Reference any file on your machine with `@file` — screenshots, diagrams, exported charts — and it gets base64-encoded directly into the HTML. The deck stays 100% self-contained and portable.

:pencil2: *Post-Generation Media Placement*
After your deck is generated, the skill prompts you to place media exactly where you want it:
• *"In slide 3"* — embed into an existing slide
• *"After slide 5"* — insert a new standalone media slide
• *"Replace slide 7"* — swap a slide for a video or meme

:sparkles: *How to use it*
Just ask Claude to create a quick deck like you always have. After the initial deck is generated, you'll be prompted to add videos or memes. Provide URLs and placement — the skill handles the rest.

:tv: _Inline video requires serving the deck via HTTP. One command: `python3 -m http.server` — instructions are included in every deck that has video._

Built with :heart: by the Anthropic Appreciation Society (and Claude)
