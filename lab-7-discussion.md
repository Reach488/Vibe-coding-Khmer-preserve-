**Part one**

My most specific rule is on `khmer_term`: it must contain Khmer script (U+1780–U+17FF) and is saved exactly as typed, so `Prahok` in that box is refused by both the form and a database check constraint, and a "letters only" rule would have been worse because Khmer vowel signs are combining marks and would reject `ប្រហុក` itself.

**Part two**

My AI assistant played the partner and attacked my live archive from a stranger account: updating and deleting my entries came back `data: []` and a `.txt` upload was refused, and the empty arrays were the proof because row-level security says nothing when it refuses, so I could only tell by reading my entry again and finding it unchanged. I was more confident than I should have been (p. 154) because the form code was tidy and the build was green, until the same testing showed `status` could be set from the console and photo removal silently did nothing, both rules that lived only in the form.
