# Code Review Etiquette

This document describes the general etiquette that should be followed in code reviews, drawing inspiration from [this post](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/). This isn't intended to be an exhaustive list.

## Authoring

- Concisely describe the purpose the pull request `("this is a fix for ...")`
- Provide an explanation for why the work is being done that can be understood without historical context
- Describe _why_ your code change serves its intended purposes. How does it fix the bug? Why is this the right refactor?
- @tag individuals that you specifically want to involve in the review

## Reviewing

- Approach code reviews with the mindset to help others learn and grow
- Familiarize yourself with the context of the issue and why the PR exists _before_ leaving comments
- Label comments with intent: `("nit:... blocking:... consider:... personal preference:... ")`
- Ask, don't tell `("what do you think about trying...?")`
- Give an explanation for _why_ you think a change is needed and offer concrete suggestions for improvement
- Don't use derogatory terms, like "stupid", or hyperbole, like "always, never, nothing"
- Be humble `("I'm not sure, let's try...")`

## Responding to Feedback

- Accept feedback graciously - consider responding with appreciation `("good call!")`
- Take time to consider the feedback and ask for clarification if you need it
- If you disagree with a suggestion, explain why. Avoid template answers like `("out of scope")`
- Consider face-to-face conversations for longer discussions. Post a follow-up to summarize offline discussions for posterity
- Try to respond to every comment
