## Smart Trigger Breakdown

### Goal

Make sure the function runs **only** when:

- A new analysis is requested (user uploads a file)
- A retry is requested (user clicks “Try Again”)

### It should _never_ run when:

- The analysis finishes (infinite loop risk)
- The user renames the file or edits metadata
- The document is deleted
