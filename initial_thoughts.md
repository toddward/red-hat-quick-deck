## Initial Issues to consider:
### Offline portability
- The tokens/font are pulled from online resources.
    - Need to check if they are still linked to online, or if they're added to render locally in the presentation.
### No Base64 Checks
- embedLocalImages just works without checking.
    - it would be good to add a "max size" check, and a --no-embed CLI flag to allow for lighter html files.
### Hardcoded animation delays
- Looks like the entrance animations are 0.5s for the first 6 children, and then nothing after that.
    - Potentially add a css counter, or a longer list. Alternatively, could standardize a wrapper class for staggered lists.


